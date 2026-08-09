import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const loopbackHosts = new Set(["127.0.0.1", "[::1]", "localhost"]);

function assertAllowedProtocol(url) {
  const allowsHttp = url.protocol === "http:" && loopbackHosts.has(url.hostname);

  if (url.protocol !== "https:" && !allowsHttp) {
    throw new Error("Smoke-check base URL must use HTTPS, except for loopback HTTP.");
  }
}

function assertNoUrlMetadata(url) {
  if (url.username !== "" || url.password !== "" || url.search !== "" || url.hash !== "") {
    throw new Error("Smoke-check base URL must not contain credentials, a query, or a fragment.");
  }
}

function assertRootPath(url) {
  if (url.pathname !== "/") {
    throw new Error("Smoke-check base URL must be an origin without a path.");
  }
}

export function validateBaseUrl(value) {
  if (!URL.canParse(value)) {
    throw new Error(`Invalid smoke-check base URL: ${value}`);
  }

  const url = new URL(value);

  assertAllowedProtocol(url);
  assertNoUrlMetadata(url);
  assertRootPath(url);

  return url;
}

function validateCriticalAssetPath(path) {
  if (!path.startsWith("/") || path.startsWith("//") || path.includes("..")) {
    throw new Error("Critical asset path must be a same-origin absolute path.");
  }
}

function isRedirectStatus(status) {
  return status >= 300 && status < 400;
}

function resolveSameOriginRedirect(currentUrl, response, origin) {
  const location = response.headers.get("location");

  if (location === null) {
    throw new Error(`${currentUrl} returned ${response.status} without a Location header.`);
  }

  const redirectUrl = new URL(location, currentUrl);

  if (redirectUrl.origin !== origin) {
    throw new Error(`Cross-origin smoke-check redirect is not allowed: ${redirectUrl}`);
  }

  return redirectUrl;
}

async function fetchSameOrigin(
  url,
  { fetchImplementation, origin, timeoutMilliseconds },
  redirectCount = 0,
) {
  if (redirectCount > 5) {
    throw new Error(`Smoke-check redirect limit exceeded for ${url}.`);
  }

  const response = await fetchImplementation(url, {
    redirect: "manual",
    signal: AbortSignal.timeout(timeoutMilliseconds),
  });

  if (!isRedirectStatus(response.status)) {
    return response;
  }

  const redirectUrl = resolveSameOriginRedirect(url, response, origin);

  return fetchSameOrigin(
    redirectUrl,
    { fetchImplementation, origin, timeoutMilliseconds },
    redirectCount + 1,
  );
}

async function checkTarget(target, options) {
  const targetUrl = new URL(target.path, options.baseUrl);
  const response = await fetchSameOrigin(targetUrl, {
    fetchImplementation: options.fetchImplementation,
    origin: options.baseUrl.origin,
    timeoutMilliseconds: options.timeoutMilliseconds,
  });

  if (response.status !== 200) {
    throw new Error(`${target.path} returned HTTP ${response.status}; expected 200.`);
  }

  const contentType = response.headers.get("content-type")?.toLowerCase() ?? "";

  if (!contentType.startsWith(target.contentType)) {
    throw new Error(
      `${target.path} returned Content-Type ${contentType || "(missing)"}; expected ${target.contentType}.`,
    );
  }

  const body = await response.text();

  if (!body.includes(target.marker)) {
    throw new Error(`${target.path} did not contain the stable marker ${target.marker}.`);
  }
}

export async function runHttpSmoke({
  baseUrl,
  criticalAssetPath = "/assets/brand/logo-mark.svg",
  fetchImplementation = fetch,
  timeoutMilliseconds = 10_000,
}) {
  const parsedBaseUrl = validateBaseUrl(baseUrl);
  validateCriticalAssetPath(criticalAssetPath);

  const targets = [
    {
      path: "/",
      contentType: "text/html",
      marker: 'id="portfolio-title"',
    },
    {
      path: criticalAssetPath,
      contentType: "image/svg+xml",
      marker: "viewBox=",
    },
    {
      path: "/assets/brand/site.webmanifest",
      contentType: "application/manifest+json",
      marker: '"short_name"',
    },
  ];

  for (const target of targets) {
    await checkTarget(target, {
      baseUrl: parsedBaseUrl,
      fetchImplementation,
      timeoutMilliseconds,
    });
  }

  return targets.map((target) => target.path);
}

function readOption(argumentsList, option) {
  const optionIndex = argumentsList.indexOf(option);

  return optionIndex === -1 ? undefined : argumentsList[optionIndex + 1];
}

function requireBaseUrl(argumentsList) {
  const baseUrl = readOption(argumentsList, "--base-url") ?? process.env.SMOKE_BASE_URL;

  if (baseUrl === undefined) {
    throw new Error("Provide --base-url or SMOKE_BASE_URL.");
  }

  return baseUrl;
}

function readTimeoutMilliseconds(argumentsList) {
  const timeoutOption = readOption(argumentsList, "--timeout-ms");
  const timeoutMilliseconds = timeoutOption === undefined ? 10_000 : Number(timeoutOption);

  if (!Number.isSafeInteger(timeoutMilliseconds) || timeoutMilliseconds <= 0) {
    throw new Error("--timeout-ms must be a positive integer.");
  }

  return timeoutMilliseconds;
}

async function execute(argumentsList) {
  const checkedPaths = await runHttpSmoke({
    baseUrl: requireBaseUrl(argumentsList),
    criticalAssetPath:
      readOption(argumentsList, "--critical-asset-path") ?? "/assets/brand/logo-mark.svg",
    timeoutMilliseconds: readTimeoutMilliseconds(argumentsList),
  });

  process.stdout.write(`HTTP smoke check passed (${checkedPaths.join(", ")}).\n`);
  return 0;
}

function reportFailure(error) {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`HTTP smoke check failed: ${message}\n`);
  return 1;
}

export async function run(argumentsList = process.argv.slice(2)) {
  return execute(argumentsList).catch(reportFailure);
}

const invokedModuleUrl =
  process.argv[1] === undefined ? "" : pathToFileURL(resolve(process.argv[1])).href;

if (import.meta.url === invokedModuleUrl) {
  process.exitCode = await run();
}
