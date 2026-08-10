import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { describe, it } from "node:test";

const pagesUploadUrl = new URL("../.github/workflows/pages-upload.yml", import.meta.url);
const pagesProductionUrl = new URL("../.github/workflows/pages-production.yml", import.meta.url);
const formalReleaseUrl = new URL("../.github/workflows/formal-release.yml", import.meta.url);

function getIndent(line) {
  return line.length - line.trimStart().length;
}

function getYamlBlock(contents, key, indent) {
  const lines = contents.split(/\r?\n/u);
  const header = `${" ".repeat(indent)}${key}:`;
  const start = lines.findIndex((line) => line === header);

  if (start === -1) {
    return "";
  }

  const followingLines = lines.slice(start + 1);
  const end = followingLines.findIndex((line) => line.trim() !== "" && getIndent(line) <= indent);

  return followingLines.slice(0, end === -1 ? undefined : end).join("\n");
}

function validateWorkflowCallSecretDeclaration(contents) {
  const workflowCall = getYamlBlock(contents, "workflow_call", 2);
  const secrets = getYamlBlock(workflowCall, "secrets", 4);
  const apiToken = getYamlBlock(secrets, "CLOUDFLARE_API_TOKEN", 6);

  if (apiToken.includes("        required: false")) {
    return [];
  }

  return [
    "workflow_call must declare CLOUDFLARE_API_TOKEN as an optional reusable-workflow secret",
  ];
}

function validateUploadJobSecretContract(contents) {
  const uploadJob = getYamlBlock(contents, "upload", 2);
  const environment = getYamlBlock(uploadJob, "environment", 4);
  const jobEnvironment = getYamlBlock(uploadJob, "env", 4);
  const errors = [];

  if (!environment.includes("      name: cloudflare-pages-production")) {
    errors.push("the upload job must use the production Environment");
  }

  if (!jobEnvironment.includes("      CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}")) {
    errors.push("the upload job must read the Cloudflare token from the secrets context");
  }

  return errors;
}

function validateSourceOnlyCaller(contents) {
  const deployJob = getYamlBlock(contents, "deploy", 2);
  const errors = [];

  if (!deployJob.includes("    uses: ./.github/workflows/pages-upload.yml")) {
    errors.push("the deploy job must call pages-upload.yml");
  }

  if (/^ {4}secrets:/mu.test(deployJob)) {
    errors.push("the deploy job must not forward or inherit caller secrets");
  }

  return errors;
}

describe("Pages reusable-workflow secret declaration", () => {
  it("accepts only the optional secret at the workflow_call secrets depth", () => {
    const validDeclaration = [
      "on:",
      "  workflow_call:",
      "    secrets:",
      "      CLOUDFLARE_API_TOKEN:",
      "        required: false",
    ].join("\n");
    const misplacedDeclaration = validDeclaration.replace("    secrets:", "  secrets:");
    const missingDeclaration = "on:\n  workflow_call:\n    inputs:";

    assert.deepEqual(validateWorkflowCallSecretDeclaration(validDeclaration), []);
    assert.match(
      validateWorkflowCallSecretDeclaration(misplacedDeclaration).join("\n"),
      /must declare CLOUDFLARE_API_TOKEN/u,
    );
    assert.match(
      validateWorkflowCallSecretDeclaration(missingDeclaration).join("\n"),
      /must declare CLOUDFLARE_API_TOKEN/u,
    );
  });

  it("accepts the checked-in Environment-backed source-only contract", async () => {
    const [pagesUpload, pagesProduction, formalRelease] = await Promise.all([
      readFile(pagesUploadUrl, "utf8"),
      readFile(pagesProductionUrl, "utf8"),
      readFile(formalReleaseUrl, "utf8"),
    ]);

    assert.deepEqual(validateWorkflowCallSecretDeclaration(pagesUpload), []);
    assert.deepEqual(validateUploadJobSecretContract(pagesUpload), []);
    assert.deepEqual(validateSourceOnlyCaller(pagesProduction), []);
    assert.deepEqual(validateSourceOnlyCaller(formalRelease), []);
  });
});
