import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const defaultExpectedVersion = "32.5.0";
const defaultReportPath = "scancode-report.json";
const requiredArrayNames = ["headers", "license_detections", "packages", "dependencies", "files"];
const requiredScanOptions = ["--copyright", "--info", "--license", "--package"];

function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function formatFinding(finding) {
  return typeof finding === "string" ? finding : JSON.stringify(finding);
}

function normalizeToolVersion(version) {
  return typeof version === "string" ? version.replace(/^v/u, "") : version;
}

function validateOptions(options, headerLabel, errors) {
  if (!isRecord(options)) {
    errors.push(`${headerLabel}.options must be an object.`);
    return;
  }

  if (!Array.isArray(options.input) || options.input.length === 0) {
    errors.push(`${headerLabel}.options.input must be a non-empty array.`);
  }

  requiredScanOptions.forEach((option) => {
    if (options[option] !== true) {
      errors.push(`${headerLabel}.options.${option} must be true.`);
    }
  });
}

function collectHeaderFindings(header, headerLabel, result) {
  if (!Array.isArray(header.errors)) {
    result.errors.push(`${headerLabel}.errors must be an array.`);
  } else {
    header.errors.forEach((finding) => {
      result.errors.push(`${headerLabel} error: ${formatFinding(finding)}`);
    });
  }

  if (header.warnings === undefined) {
    return;
  }

  if (!Array.isArray(header.warnings)) {
    result.errors.push(`${headerLabel}.warnings must be an array when present.`);
    return;
  }

  header.warnings.forEach((finding) => {
    result.warnings.push(`${headerLabel} warning: ${formatFinding(finding)}`);
  });
}

function validateHeader(header, index, context) {
  const headerLabel = `headers[${index}]`;

  if (!isRecord(header)) {
    context.result.errors.push(`${headerLabel} must be an object.`);
    return;
  }

  if (header.tool_name !== "scancode-toolkit") {
    context.result.errors.push(`${headerLabel}.tool_name must be scancode-toolkit.`);
  }

  if (normalizeToolVersion(header.tool_version) !== context.expectedVersion) {
    context.result.errors.push(`${headerLabel}.tool_version must be ${context.expectedVersion}.`);
  }

  validateOptions(header.options, headerLabel, context.result.errors);
  collectHeaderFindings(header, headerLabel, context.result);
}

function collectRequiredArrays(report, errors) {
  const arrays = {};
  requiredArrayNames.forEach((name) => {
    if (Array.isArray(report[name])) {
      arrays[name] = report[name];
      return;
    }

    errors.push(`${name} must be a top-level array.`);
    arrays[name] = [];
  });
  return arrays;
}

function fileLabel(file, index) {
  return isRecord(file) && typeof file.path === "string" ? file.path : `files[${index}]`;
}

function validateFile(file, index, errors) {
  const label = fileLabel(file, index);

  if (!isRecord(file)) {
    errors.push(`${label} must be an object.`);
    return;
  }

  if (!Array.isArray(file.scan_errors)) {
    errors.push(`${label}.scan_errors must be an array.`);
    return;
  }

  file.scan_errors.forEach((finding) => {
    errors.push(`${label} scan error: ${formatFinding(finding)}`);
  });
}

export function validateScancodeReport(report, expectedVersion = defaultExpectedVersion) {
  const result = { errors: [], fileCount: 0, warnings: [] };

  if (!isRecord(report)) {
    result.errors.push("ScanCode report must be a JSON object.");
    return result;
  }

  const arrays = collectRequiredArrays(report, result.errors);
  result.fileCount = arrays.files.length;

  if (arrays.headers.length === 0) {
    result.errors.push("headers must contain at least one ScanCode header.");
  }

  const headerContext = { expectedVersion, result };
  arrays.headers.forEach((header, index) => {
    validateHeader(header, index, headerContext);
  });
  arrays.files.forEach((file, index) => {
    validateFile(file, index, result.errors);
  });
  return result;
}

function parseExpectedVersion(argumentsList, index, state) {
  const version = argumentsList[index + 1];

  if (version === undefined || version.startsWith("--")) {
    throw new Error("--expected-version requires a value.");
  }

  state.expectedVersion = version;
  return index + 2;
}

function parseArgument(argumentsList, index, state) {
  const argument = argumentsList[index];

  if (argument === "--expected-version") {
    return parseExpectedVersion(argumentsList, index, state);
  }

  if (argument.startsWith("--")) {
    throw new Error(`Unsupported option: ${argument}.`);
  }

  if (state.positionalPath !== undefined) {
    throw new Error("Provide at most one ScanCode report path.");
  }

  state.positionalPath = argument;
  return index + 1;
}

export function parseArguments(argumentsList) {
  const state = { expectedVersion: defaultExpectedVersion, positionalPath: undefined };
  let index = 0;

  while (index < argumentsList.length) {
    index = parseArgument(argumentsList, index, state);
  }

  return {
    expectedVersion: state.expectedVersion,
    reportPath: state.positionalPath ?? defaultReportPath,
  };
}

function assertNoErrors(errors) {
  if (errors.length > 0) {
    throw new Error(errors.map((error) => `- ${error}`).join("\n"));
  }
}

function reportWarnings(warnings) {
  if (warnings.length > 0) {
    process.stderr.write(
      `ScanCode reported warnings:\n${warnings.map((warning) => `- ${warning}`).join("\n")}\n`,
    );
  }
}

async function validateReportFile(argumentsList) {
  const options = parseArguments(argumentsList);
  const report = JSON.parse(await readFile(resolve(options.reportPath), "utf8"));
  const result = validateScancodeReport(report, options.expectedVersion);
  assertNoErrors(result.errors);
  reportWarnings(result.warnings);
  process.stdout.write(`ScanCode report contract passed (${result.fileCount} entries checked).\n`);
  return 0;
}

function reportValidationFailure(error) {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`ScanCode report validation failed: ${message}\n`);
  return 1;
}

export async function run(argumentsList = process.argv.slice(2)) {
  return validateReportFile(argumentsList).catch(reportValidationFailure);
}

const invokedModuleUrl =
  process.argv[1] === undefined ? "" : pathToFileURL(resolve(process.argv[1])).href;

if (import.meta.url === invokedModuleUrl) {
  process.exitCode = await run();
}
