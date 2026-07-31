import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { parseArguments, validateScancodeReport } from "./validate-scancode-report.mjs";

function createValidReport() {
  return {
    dependencies: [],
    files: [
      { path: "source/package.json", scan_errors: [] },
      { path: "source/src/index.js", scan_errors: [] },
    ],
    headers: [
      {
        errors: [],
        options: {
          "--copyright": true,
          "--info": true,
          "--license": true,
          "--package": true,
          input: ["source"],
        },
        tool_name: "scancode-toolkit",
        tool_version: "32.5.0",
      },
    ],
    license_detections: [],
    packages: [],
  };
}

describe("ScanCode report contract", () => {
  it("accepts an error-free v32.5.0 native JSON report", () => {
    assert.deepEqual(validateScancodeReport(createValidReport()), {
      errors: [],
      fileCount: 2,
      warnings: [],
    });
  });

  it("accepts a leading v in the ScanCode tool version", () => {
    const report = createValidReport();
    report.headers[0].tool_version = "v32.5.0";

    assert.deepEqual(validateScancodeReport(report).errors, []);
  });

  it("requires the expected tool, version, options, and top-level arrays", () => {
    const report = createValidReport();
    report.headers[0].tool_name = "another-tool";
    report.headers[0].tool_version = "32.4.1";
    report.headers[0].options["--license"] = false;
    delete report.dependencies;

    const errors = validateScancodeReport(report).errors.join("\n");
    assert.match(errors, /dependencies must be a top-level array/u);
    assert.match(errors, /tool_name must be scancode-toolkit/u);
    assert.match(errors, /tool_version must be 32\.5\.0/u);
    assert.match(errors, /options\.--license must be true/u);
  });

  it("fails header and per-file scan errors without inventing classifications", () => {
    const report = createValidReport();
    report.headers[0].errors.push("scan aborted");
    report.files[0].scan_errors.push("failed to read file");

    const result = validateScancodeReport(report);
    assert.deepEqual(result.warnings, []);
    assert.match(result.errors.join("\n"), /headers\[0\] error: scan aborted/u);
    assert.match(result.errors.join("\n"), /source\/package\.json scan error/u);
    assert.doesNotMatch(result.errors.join("\n"), /Unknown|Review Required|Rejected/u);
  });

  it("preserves tool warnings as warnings without failing the report", () => {
    const report = createValidReport();
    report.headers[0].warnings = ["fallback detector used"];

    const result = validateScancodeReport(report);
    assert.deepEqual(result.errors, []);
    assert.deepEqual(result.warnings, ["headers[0] warning: fallback detector used"]);
  });

  it("requires scan_errors on every reported file entry", () => {
    const report = createValidReport();
    delete report.files[1].scan_errors;

    assert.match(
      validateScancodeReport(report).errors.join("\n"),
      /source\/src\/index\.js\.scan_errors must be an array/u,
    );
  });
});

describe("ScanCode CLI arguments", () => {
  it("parses an exact version and positional report path", () => {
    assert.deepEqual(parseArguments(["--expected-version", "32.5.0", "source.json"]), {
      expectedVersion: "32.5.0",
      reportPath: "source.json",
    });
  });

  it("rejects missing option values, unsupported options, and extra paths", () => {
    assert.throws(() => parseArguments(["--expected-version"]), /requires a value/u);
    assert.throws(() => parseArguments(["--unknown"]), /Unsupported option/u);
    assert.throws(() => parseArguments(["first.json", "second.json"]), /at most one/u);
  });
});
