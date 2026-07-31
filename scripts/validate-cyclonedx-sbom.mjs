import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const expectedLicense = "MIT AND LicenseRef-Portfolio-Materials-All-Rights-Reserved";
const expectedPurl = "pkg:npm/portfolio-ybkim@1.0.0";

export const expectedCycloneDxComponent = Object.freeze({
  "bom-ref": expectedPurl,
  licenses: [{ expression: expectedLicense }],
  name: "portfolio-ybkim",
  purl: expectedPurl,
  type: "application",
  version: "1.0.0",
});

function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function addExactValueError(errors, field) {
  if (field.actual !== field.expected) {
    errors.push(`${field.label} must be ${field.expected}; received ${String(field.actual)}.`);
  }
}

function validateLicense(component, errors) {
  const licenses = component.licenses;

  if (!Array.isArray(licenses) || licenses.length !== 1) {
    errors.push("metadata.component.licenses must contain exactly one license expression.");
    return;
  }

  const [license] = licenses;
  const expression = isRecord(license) ? license.expression : undefined;
  addExactValueError(errors, {
    actual: expression,
    expected: expectedLicense,
    label: "metadata.component.licenses[0].expression",
  });
}

function validateComponent(component, errors) {
  if (!isRecord(component)) {
    errors.push("metadata.component must be an object.");
    return;
  }

  const exactFields = ["type", "name", "version", "purl", "bom-ref"];
  exactFields.forEach((field) => {
    addExactValueError(errors, {
      actual: component[field],
      expected: expectedCycloneDxComponent[field],
      label: `metadata.component.${field}`,
    });
  });
  validateLicense(component, errors);
}

export function validateCycloneDxSbom(report) {
  if (!isRecord(report)) {
    return ["CycloneDX report must be a JSON object."];
  }

  const errors = [];
  addExactValueError(errors, {
    actual: report.bomFormat,
    expected: "CycloneDX",
    label: "bomFormat",
  });
  addExactValueError(errors, {
    actual: report.specVersion,
    expected: "1.6",
    label: "specVersion",
  });

  const metadata = report.metadata;

  if (!isRecord(metadata)) {
    errors.push("metadata must be an object.");
    return errors;
  }

  validateComponent(metadata.component, errors);
  return errors;
}

function assertNoErrors(errors) {
  if (errors.length > 0) {
    throw new Error(errors.map((error) => `- ${error}`).join("\n"));
  }
}

async function validateSbomFile(argumentsList) {
  const reportPath = resolve(argumentsList[0] ?? "sbom.cdx.json");
  const report = JSON.parse(await readFile(reportPath, "utf8"));
  assertNoErrors(validateCycloneDxSbom(report));
  process.stdout.write("CycloneDX SBOM contract passed.\n");
  return 0;
}

function reportValidationFailure(error) {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`CycloneDX SBOM validation failed: ${message}\n`);
  return 1;
}

export async function run(argumentsList = process.argv.slice(2)) {
  return validateSbomFile(argumentsList).catch(reportValidationFailure);
}

const invokedModuleUrl =
  process.argv[1] === undefined ? "" : pathToFileURL(resolve(process.argv[1])).href;

if (import.meta.url === invokedModuleUrl) {
  process.exitCode = await run();
}
