import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const expectedSecurityHeaders = new Map([
  ["cache-control", "public, max-age=0, must-revalidate"],
  [
    "content-security-policy",
    "base-uri 'self'; connect-src 'self' https://cdn.jsdelivr.net; default-src 'self'; font-src 'self' https://cdn.jsdelivr.net; form-action 'self'; frame-ancestors 'none'; frame-src 'none'; img-src 'self'; manifest-src 'self'; media-src 'none'; object-src 'none'; script-src 'self'; script-src-attr 'none'; style-src-elem 'self' https://cdn.jsdelivr.net; style-src-attr 'unsafe-inline'; worker-src 'none'; upgrade-insecure-requests",
  ],
  ["permissions-policy", "camera=(), geolocation=(), microphone=(), payment=(), usb=()"],
  ["referrer-policy", "strict-origin-when-cross-origin"],
  ["x-content-type-options", "nosniff"],
  ["x-frame-options", "DENY"],
]);

const expectedCacheRules = new Map([
  [
    "/_astro/*",
    {
      detachedHeader: "cache-control",
      value: "public, max-age=31536000, immutable",
    },
  ],
  [
    "/assets/resume/*",
    {
      detachedHeader: "cache-control",
      value: "public, max-age=0, must-revalidate",
    },
  ],
]);

function createRule(pattern) {
  return {
    detachedHeaders: new Set(),
    headers: new Map(),
    pattern,
  };
}

function validateRulePattern(pattern, lineNumber, errors) {
  const isSupportedPattern = pattern.startsWith("/") || pattern.startsWith("https://");
  const splatCount = [...pattern].filter((character) => character === "*").length;

  if (!isSupportedPattern || splatCount > 1) {
    errors.push(`Line ${lineNumber}: unsupported header rule pattern ${pattern}.`);
  }
}

function addDetachedHeader({ errors, headerLine, lineNumber, rule }) {
  const headerName = headerLine.slice(2).trim().toLowerCase();

  if (!/^[a-z0-9-]+$/u.test(headerName)) {
    errors.push(`Line ${lineNumber}: invalid detached header name.`);
    return;
  }

  rule.detachedHeaders.add(headerName);
}

function addRegularHeader({ errors, headerLine, lineNumber, rule }) {
  const separatorIndex = headerLine.indexOf(":");

  if (separatorIndex <= 0) {
    errors.push(`Line ${lineNumber}: header must contain a name and value.`);
    return;
  }

  const headerName = headerLine.slice(0, separatorIndex).trim().toLowerCase();
  const headerValue = headerLine.slice(separatorIndex + 1).trim();

  if (!/^[a-z0-9-]+$/u.test(headerName) || headerValue === "") {
    errors.push(`Line ${lineNumber}: invalid header name or empty value.`);
    return;
  }

  if (rule.headers.has(headerName)) {
    errors.push(`Line ${lineNumber}: duplicate ${headerName} header in ${rule.pattern}.`);
    return;
  }

  rule.headers.set(headerName, headerValue);
}

function addHeaderLine(context) {
  if (context.headerLine.startsWith("! ")) {
    addDetachedHeader(context);
    return;
  }

  addRegularHeader(context);
}

function addParsingErrorForLongLine(line, lineNumber, errors) {
  if (line.length > 2_000) {
    errors.push(`Line ${lineNumber}: exceeds Cloudflare's 2,000-character limit.`);
  }
}

function addRuleLine(state, line, lineNumber) {
  validateRulePattern(line, lineNumber, state.errors);

  if (state.rules.has(line)) {
    state.errors.push(`Line ${lineNumber}: duplicate header rule ${line}.`);
    state.currentRule = state.rules.get(line);
    return;
  }

  state.currentRule = createRule(line);
  state.rules.set(line, state.currentRule);
}

function addParsedHeaderLine(state, headerLine, lineNumber) {
  if (state.currentRule === undefined) {
    state.errors.push(`Line ${lineNumber}: header appears before a rule.`);
    return;
  }

  addHeaderLine({
    errors: state.errors,
    headerLine,
    lineNumber,
    rule: state.currentRule,
  });
}

function parseLine(state, line, lineIndex) {
  const lineNumber = lineIndex + 1;
  const trimmedLine = line.trim();
  addParsingErrorForLongLine(line, lineNumber, state.errors);

  if (trimmedLine === "" || line.trimStart().startsWith("#")) {
    return;
  }

  if (/^\s/u.test(line)) {
    addParsedHeaderLine(state, trimmedLine, lineNumber);
    return;
  }

  addRuleLine(state, line, lineNumber);
}

export function parseHeaders(contents) {
  const state = {
    currentRule: undefined,
    errors: [],
    rules: new Map(),
  };
  contents.split(/\r?\n/u).forEach((line, lineIndex) => {
    parseLine(state, line, lineIndex);
  });

  if (state.rules.size > 100) {
    state.errors.push("Header file exceeds Cloudflare's 100-rule limit.");
  }

  return { errors: state.errors, rules: state.rules };
}

function validateExpectedHeader(rule, [headerName, expectedValue], errors) {
  const actualValue = rule.headers.get(headerName);

  if (actualValue !== expectedValue) {
    errors.push(
      `${rule.pattern} must set ${headerName} to ${expectedValue}; received ${actualValue ?? "(missing)"}.`,
    );
  }
}

function validateExpectedHeaders(rule, expectedHeaders, errors) {
  expectedHeaders.forEach((expectedValue, headerName) => {
    validateExpectedHeader(rule, [headerName, expectedValue], errors);
  });
}

function validateCacheRule(rules, [pattern, expected], errors) {
  const rule = rules.get(pattern);

  if (rule === undefined) {
    errors.push(`Missing required cache rule ${pattern}.`);
    return;
  }

  if (!rule.detachedHeaders.has(expected.detachedHeader)) {
    errors.push(`${pattern} must detach the inherited ${expected.detachedHeader} header.`);
  }

  const actualValue = rule.headers.get(expected.detachedHeader);

  if (actualValue !== expected.value) {
    errors.push(`${pattern} must set ${expected.detachedHeader} to ${expected.value}.`);
  }
}

function validateCacheRules(rules, errors) {
  expectedCacheRules.forEach((expected, pattern) => {
    validateCacheRule(rules, [pattern, expected], errors);
  });
}

function validateGlobalRule(rules, errors) {
  const globalRule = rules.get("/*");

  if (globalRule === undefined) {
    errors.push("Missing global /* security-header rule.");
    return;
  }

  validateExpectedHeaders(globalRule, expectedSecurityHeaders, errors);
}

function validateRuleSafety(rule, errors) {
  if (rule.headers.has("strict-transport-security")) {
    errors.push("HSTS is forbidden until the production domain and TLS are verified live.");
  }

  const contentSecurityPolicy = rule.headers.get("content-security-policy") ?? "";

  if (contentSecurityPolicy.includes("*") || contentSecurityPolicy.includes("'unsafe-eval'")) {
    errors.push(`${rule.pattern} contains a forbidden CSP wildcard or unsafe-eval.`);
  }
}

export function validateHeaders(contents) {
  const { errors, rules } = parseHeaders(contents);
  validateGlobalRule(rules, errors);
  rules.forEach((rule) => {
    validateRuleSafety(rule, errors);
  });
  validateCacheRules(rules, errors);

  return errors;
}

function assertNoErrors(errors) {
  if (errors.length > 0) {
    throw new Error(errors.map((error) => `- ${error}`).join("\n"));
  }
}

async function validateHeadersFile(argumentsList) {
  const headersPath = resolve(argumentsList[0] ?? "public/_headers");
  const errors = validateHeaders(await readFile(headersPath, "utf8"));
  assertNoErrors(errors);
  process.stdout.write("Cloudflare Pages header contract passed.\n");
  return 0;
}

function reportHeaderValidationFailure(error) {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`Header validation failed: ${message}\n`);
  return 1;
}

export async function run(argumentsList = process.argv.slice(2)) {
  return validateHeadersFile(argumentsList).catch(reportHeaderValidationFailure);
}

const invokedModuleUrl =
  process.argv[1] === undefined ? "" : pathToFileURL(resolve(process.argv[1])).href;

if (import.meta.url === invokedModuleUrl) {
  process.exitCode = await run();
}
