import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { createSiteSmokeTargets } from "./site-smoke-contract.mjs";
import { checkSmokeTarget } from "./smoke-http-response.mjs";

const loopbackHosts = new Set(["127.0.0.1", "[::1]", "localhost"]);
const defaultRetryDelayMilliseconds = 5_000;

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

export async function runHttpSmoke({
  baseUrl,
  criticalAssetPath = "/assets/brand/logo-mark.svg",
  fetchImplementation = fetch,
  timeoutMilliseconds = 10_000,
  siteTargets = [],
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

  const combinedTargets = [
    ...targets.map((target) => ({
      ...target,
      validate: siteTargets.find((siteTarget) => siteTarget.path === target.path)?.validate,
    })),
    ...siteTargets.filter(
      (target) => !targets.some((baseTarget) => baseTarget.path === target.path),
    ),
  ];
  for (const target of combinedTargets) {
    await checkSmokeTarget(target, {
      baseUrl: parsedBaseUrl,
      fetchImplementation,
      timeoutMilliseconds,
    });
  }

  return combinedTargets.map((target) => target.path);
}

function delay(milliseconds) {
  return new Promise((resolveDelay) => setTimeout(resolveDelay, milliseconds));
}

function ignoreRetry() {}

function validateRetryOptions(attempts, retryDelayMilliseconds) {
  if (!Number.isSafeInteger(attempts) || attempts <= 0) {
    throw new Error("--attempts must be a positive integer.");
  }

  if (!Number.isSafeInteger(retryDelayMilliseconds) || retryDelayMilliseconds < 0) {
    throw new Error("--retry-delay-ms must be a non-negative integer.");
  }
}

export async function runHttpSmokeWithRetry({
  attempts = 1,
  onRetry = ignoreRetry,
  retryDelayMilliseconds = defaultRetryDelayMilliseconds,
  waitImplementation = delay,
  ...smokeOptions
}) {
  validateRetryOptions(attempts, retryDelayMilliseconds);

  return runHttpSmokeAttempt({
    attempt: 1,
    attempts,
    onRetry,
    retryDelayMilliseconds,
    smokeOptions,
    waitImplementation,
  });
}

function runHttpSmokeAttempt(options) {
  return runHttpSmoke(options.smokeOptions).catch((error) => retryHttpSmoke(options, error));
}

async function retryHttpSmoke(options, error) {
  if (options.attempt >= options.attempts) {
    throw error;
  }

  options.onRetry({
    attempt: options.attempt,
    attempts: options.attempts,
    retryDelayMilliseconds: options.retryDelayMilliseconds,
  });
  await options.waitImplementation(options.retryDelayMilliseconds);

  return runHttpSmokeAttempt({
    ...options,
    attempt: options.attempt + 1,
    retryDelayMilliseconds: options.retryDelayMilliseconds * 2,
  });
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

function readAttempts(argumentsList) {
  const attempts = argumentsList.includes("--attempts")
    ? Number(readOption(argumentsList, "--attempts"))
    : 1;

  return attempts;
}

function readRetryDelayMilliseconds(argumentsList) {
  const retryDelayMilliseconds = argumentsList.includes("--retry-delay-ms")
    ? Number(readOption(argumentsList, "--retry-delay-ms"))
    : defaultRetryDelayMilliseconds;

  return retryDelayMilliseconds;
}

function reportRetry({ attempt, attempts, retryDelayMilliseconds }) {
  process.stderr.write(
    `HTTP smoke check attempt ${attempt} of ${attempts} failed; retrying in ${retryDelayMilliseconds} ms.\n`,
  );
}

async function execute(argumentsList) {
  const baseUrl = requireBaseUrl(argumentsList);
  const siteTargets = await createSiteSmokeTargets(
    readOption(argumentsList, "--artifact-dir") ?? "dist",
  );
  const checkedPaths = await runHttpSmokeWithRetry({
    attempts: readAttempts(argumentsList),
    baseUrl,
    siteTargets,
    criticalAssetPath:
      readOption(argumentsList, "--critical-asset-path") ?? "/assets/brand/logo-mark.svg",
    onRetry: reportRetry,
    retryDelayMilliseconds: readRetryDelayMilliseconds(argumentsList),
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
