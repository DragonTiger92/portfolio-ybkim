import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { expectedCycloneDxComponent, validateCycloneDxSbom } from "./validate-cyclonedx-sbom.mjs";

function createValidReport() {
  return {
    bomFormat: "CycloneDX",
    metadata: {
      component: structuredClone(expectedCycloneDxComponent),
    },
    specVersion: "1.6",
  };
}

describe("CycloneDX SBOM contract", () => {
  it("accepts the exact release identity and license expression", () => {
    assert.deepEqual(validateCycloneDxSbom(createValidReport()), []);
  });

  it("rejects format, specification, type, name, and version drift", () => {
    const report = createValidReport();
    report.bomFormat = "SPDX";
    report.specVersion = "1.5";
    report.metadata.component.type = "library";
    report.metadata.component.name = "another-project";
    report.metadata.component.version = "0.0.0";

    const errors = validateCycloneDxSbom(report).join("\n");
    assert.match(errors, /bomFormat must be CycloneDX/u);
    assert.match(errors, /specVersion must be 1\.6/u);
    assert.match(errors, /metadata\.component\.type must be application/u);
    assert.match(errors, /metadata\.component\.name must be portfolio-ybkim/u);
    assert.match(errors, /metadata\.component\.version must be 1\.0\.1/u);
  });

  it("requires the exact root purl, bom-ref, and sole license expression", () => {
    const report = createValidReport();
    report.metadata.component.purl = "pkg:npm/portfolio-ybkim@0.0.0";
    report.metadata.component["bom-ref"] = "generated-reference";
    report.metadata.component.licenses.push({ expression: "MIT" });

    const errors = validateCycloneDxSbom(report).join("\n");
    assert.match(errors, /metadata\.component\.purl/u);
    assert.match(errors, /metadata\.component\.bom-ref/u);
    assert.match(errors, /exactly one license expression/u);
  });

  it("rejects a missing root component without throwing", () => {
    assert.deepEqual(validateCycloneDxSbom({ bomFormat: "CycloneDX", specVersion: "1.6" }), [
      "metadata must be an object.",
    ]);
  });
});
