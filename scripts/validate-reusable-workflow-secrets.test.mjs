import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { describe, it } from "node:test";

const pagesUploadActionUrl = new URL("../.github/actions/pages-upload/action.yml", import.meta.url);
const pagesUploadWorkflowUrl = new URL("../.github/workflows/pages-upload.yml", import.meta.url);
const pagesProductionUrl = new URL("../.github/workflows/pages-production.yml", import.meta.url);
const formalReleaseUrl = new URL("../.github/workflows/formal-release.yml", import.meta.url);
const callerApiTokenMapping = "api-token: ${{ secrets.CLOUDFLARE_API_TOKEN }}";
const actionApiTokenMapping = "CLOUDFLARE_API_TOKEN: ${{ inputs['api-token'] }}";
const directEnvironmentMappings = [
  "account-id: ${{ vars.CLOUDFLARE_ACCOUNT_ID }}",
  callerApiTokenMapping,
  "production-url: ${{ vars.CLOUDFLARE_PAGES_PRODUCTION_URL }}",
  "project-name: ${{ vars.CLOUDFLARE_PAGES_PROJECT_NAME }}",
];
const actionInputNames = [
  "account-id",
  "api-token",
  "artifact-id",
  "production-url",
  "project-name",
  "revision",
];
const credentialStepNames = [
  "Validate deployment configuration",
  "Upload artifact with pinned Wrangler",
  "Resolve exact deployment",
];

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

function getYamlStepBlock(contents, name, indent) {
  const lines = contents.split(/\r?\n/u);
  const header = `${" ".repeat(indent)}- name: ${name}`;
  const start = lines.findIndex((line) => line === header);

  if (start === -1) {
    return "";
  }

  const followingLines = lines.slice(start + 1);
  const end = followingLines.findIndex((line) => line.trim() !== "" && getIndent(line) <= indent);

  return [lines[start], ...followingLines.slice(0, end === -1 ? undefined : end)].join("\n");
}

function countOccurrences(contents, value) {
  return contents.split(value).length - 1;
}

function hasActionTokenMapping(action, stepName) {
  const runs = getYamlBlock(action, "runs", 0);
  const step = getYamlStepBlock(runs, stepName, 4);
  const stepEnvironment = getYamlBlock(step, "env", 6);

  return stepEnvironment.includes(`        ${actionApiTokenMapping}`);
}

function validateDirectEnvironmentJob(deployJob) {
  const environment = getYamlBlock(deployJob, "environment", 4);
  const errors = [];

  if (!deployJob.includes("    runs-on: ubuntu-latest")) {
    errors.push("the deploy boundary must be an ordinary runner job");
  }

  if (!environment.includes("      name: cloudflare-pages-production")) {
    errors.push("the ordinary deploy job must bind the production Environment directly");
  }

  if (deployJob.includes("uses: ./.github/workflows/pages-upload.yml")) {
    errors.push("the deploy boundary must not call a reusable upload workflow");
  }

  if (/^ {4}secrets:/mu.test(deployJob)) {
    errors.push("the deploy job must not forward or inherit caller secrets");
  }

  return errors;
}

function validateTrustedCheckout(checkoutStep) {
  const isTrustedCheckout =
    checkoutStep.includes("uses: actions/checkout@") &&
    checkoutStep.includes("          ref: ${{ github.workflow_sha }}") &&
    checkoutStep.includes("          persist-credentials: false");

  if (isTrustedCheckout) {
    return [];
  }

  return ["the deploy job must check out its trusted workflow revision"];
}

function validateLocalUploadAction(uploadStep) {
  const actionInputs = getYamlBlock(uploadStep, "with", 8);
  const errors = [];

  if (
    !uploadStep.includes("        id: upload") ||
    !uploadStep.includes("        uses: ./.github/actions/pages-upload")
  ) {
    errors.push("the ordinary deploy job must call the local Pages upload action");
  }

  const missingInputs = actionInputNames.filter(
    (inputName) => !actionInputs.includes(`          ${inputName}:`),
  );
  errors.push(...missingInputs.map((inputName) => `the upload action is missing ${inputName}`));

  const missingEnvironmentMappings = directEnvironmentMappings.filter(
    (mapping) => !actionInputs.includes(`          ${mapping}`),
  );
  errors.push(
    ...missingEnvironmentMappings.map(
      (mapping) => `the Environment job must pass ${mapping.split(":", 1)[0]} directly`,
    ),
  );

  return errors;
}

function validateDirectEnvironmentCaller(contents) {
  const deployJob = getYamlBlock(contents, "deploy", 2);
  const checkoutStep = getYamlStepBlock(deployJob, "Checkout trusted delivery tooling", 6);
  const uploadStep = getYamlStepBlock(deployJob, "Upload and verify production artifact", 6);

  return [
    ...validateDirectEnvironmentJob(deployJob),
    ...validateTrustedCheckout(checkoutStep),
    ...validateLocalUploadAction(uploadStep),
  ];
}

function validatePagesUploadAction(contents) {
  const inputs = getYamlBlock(contents, "inputs", 0);
  const outputs = getYamlBlock(contents, "outputs", 0);
  const runs = getYamlBlock(contents, "runs", 0);
  const errors = [];

  if (!runs.includes("  using: composite")) {
    errors.push("Pages upload must be a local composite action");
  }

  if (contents.includes("${{ secrets.")) {
    errors.push("the composite action must receive credentials through explicit inputs");
  }

  if (
    !outputs.includes("    value: ${{ steps.resolve.outputs['deployment-id'] }}") ||
    !outputs.includes("    value: ${{ steps.resolve.outputs['deployment-url'] }}")
  ) {
    errors.push("the composite action must expose the exact resolved deployment outputs");
  }

  const optionalInputs = actionInputNames.filter(
    (inputName) => !getYamlBlock(inputs, inputName, 2).includes("    required: true"),
  );
  errors.push(...optionalInputs.map((inputName) => `${inputName} must be a required action input`));

  const missingCredentialSteps = credentialStepNames.filter(
    (stepName) => !hasActionTokenMapping(contents, stepName),
  );
  errors.push(
    ...missingCredentialSteps.map(
      (stepName) => `${stepName} must map the explicit API token input`,
    ),
  );

  if (countOccurrences(contents, actionApiTokenMapping) !== credentialStepNames.length) {
    errors.push("only credential-consuming action steps may map the API token input");
  }

  return errors;
}

function createDirectCallerFixture() {
  return [
    "jobs:",
    "  deploy:",
    "    runs-on: ubuntu-latest",
    "    environment:",
    "      name: cloudflare-pages-production",
    "    steps:",
    "      - name: Checkout trusted delivery tooling",
    "        uses: actions/checkout@pinned",
    "        with:",
    "          ref: ${{ github.workflow_sha }}",
    "          persist-credentials: false",
    "      - name: Upload and verify production artifact",
    "        id: upload",
    "        uses: ./.github/actions/pages-upload",
    "        with:",
    "          account-id: ${{ vars.CLOUDFLARE_ACCOUNT_ID }}",
    `          ${callerApiTokenMapping}`,
    "          artifact-id: artifact",
    "          production-url: ${{ vars.CLOUDFLARE_PAGES_PRODUCTION_URL }}",
    "          project-name: ${{ vars.CLOUDFLARE_PAGES_PROJECT_NAME }}",
    "          revision: revision",
  ].join("\n");
}

describe("Pages Environment-backed upload boundary", () => {
  it("rejects reusable or incomplete credential boundaries", () => {
    const validCaller = createDirectCallerFixture();
    const reusableCaller = validCaller.replace(
      "    runs-on: ubuntu-latest",
      "    uses: ./.github/workflows/pages-upload.yml",
    );
    const missingEnvironment = validCaller.replace(
      "      name: cloudflare-pages-production",
      "      name: another-environment",
    );
    const missingToken = validCaller.replace(callerApiTokenMapping, "api-token: unavailable");

    assert.deepEqual(validateDirectEnvironmentCaller(validCaller), []);
    assert.match(
      validateDirectEnvironmentCaller(reusableCaller).join("\n"),
      /ordinary runner job/u,
    );
    assert.match(
      validateDirectEnvironmentCaller(missingEnvironment).join("\n"),
      /bind the production Environment directly/u,
    );
    assert.match(
      validateDirectEnvironmentCaller(missingToken).join("\n"),
      /pass api-token directly/u,
    );
  });

  it("accepts only the direct Environment job and local action contract", async () => {
    const [pagesUploadAction, pagesProduction, formalRelease] = await Promise.all([
      readFile(pagesUploadActionUrl, "utf8"),
      readFile(pagesProductionUrl, "utf8"),
      readFile(formalReleaseUrl, "utf8"),
    ]);

    await assert.rejects(access(pagesUploadWorkflowUrl), { code: "ENOENT" });
    assert.deepEqual(validatePagesUploadAction(pagesUploadAction), []);
    assert.match(
      validatePagesUploadAction(
        pagesUploadAction.replace(actionApiTokenMapping, "CLOUDFLARE_API_TOKEN: unavailable"),
      ).join("\n"),
      /must map the explicit API token input/u,
    );
    assert.deepEqual(validateDirectEnvironmentCaller(pagesProduction), []);
    assert.deepEqual(validateDirectEnvironmentCaller(formalRelease), []);
    assert.ok(
      pagesProduction.includes("artifact-id: ${{ needs.artifact.outputs['artifact-id'] }}"),
    );
    assert.ok(pagesProduction.includes("revision: ${{ needs.context.outputs.revision }}"));
    assert.ok(
      formalRelease.includes("artifact-id: ${{ needs.evidence.outputs['site-artifact-id'] }}"),
    );
    assert.ok(formalRelease.includes("revision: ${{ inputs.revision }}"));
  });
});
