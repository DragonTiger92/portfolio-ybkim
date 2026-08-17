import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { before, describe, it } from "node:test";

import {
  readExecutionAutonomyPolicy,
  validateExecutionAutonomyPolicy,
} from "./validate-execution-autonomy-policy.mjs";

let policy;

const agentsUrl = new URL("../AGENTS.md", import.meta.url);
const operationsUrl = new URL("../.agents/guidelines/operations.md", import.meta.url);
const packageUrl = new URL("../package.json", import.meta.url);

before(async () => {
  policy = await readExecutionAutonomyPolicy();
});

function clonePolicy() {
  return structuredClone(policy);
}

function findOperation(candidate, operationId) {
  return candidate.autonomousOperations.find((operation) => operation.id === operationId);
}

describe("execution autonomy policy", () => {
  it("accepts the repository policy", () => {
    assert.deepEqual(validateExecutionAutonomyPolicy(policy), []);
  });

  it("keeps the policy wired into repository instructions and checks", async () => {
    const [agents, operations, packageContents] = await Promise.all([
      readFile(agentsUrl, "utf8"),
      readFile(operationsUrl, "utf8"),
      readFile(packageUrl, "utf8"),
    ]);
    const packageJson = JSON.parse(packageContents);

    assert.match(agents, /\.agents\/guidelines\/execution-autonomy\.md/u);
    assert.match(operations, /\.agents\/policies\/execution-autonomy\.json/u);
    assert.match(
      packageJson.scripts["test:governance"],
      /validate-execution-autonomy-policy\.test\.mjs/u,
    );
  });

  it("requires a unique import match and a redacting wrapper", () => {
    const candidate = clonePolicy();
    const operation = findOperation(candidate, "terraform_import");
    operation.preconditions = operation.preconditions.filter(
      (condition) =>
        condition !== "exactly_one_remote_object_match" &&
        condition !== "reviewed_redacting_wrapper",
    );

    const errors = validateExecutionAutonomyPolicy(candidate).join("\n");

    assert.match(errors, /exactly_one_remote_object_match/u);
    assert.match(errors, /reviewed_redacting_wrapper/u);
  });

  it("blocks exact-plan apply without replace and destroy protection", () => {
    const candidate = clonePolicy();
    const operation = findOperation(candidate, "terraform_apply_exact_plan");
    operation.preconditions = operation.preconditions.filter(
      (condition) => condition !== "no_replace_or_destroy",
    );
    operation.postconditions = [];

    const errors = validateExecutionAutonomyPolicy(candidate).join("\n");

    assert.match(errors, /no_replace_or_destroy/u);
    assert.match(errors, /post_apply_no_op_plan/u);
  });

  it("keeps merge and auto-merge owner-gated", () => {
    const candidate = clonePolicy();
    candidate.ownerDecisionGates = candidate.ownerDecisionGates.filter(
      (gate) => gate !== "merge_or_auto_merge",
    );
    candidate.autonomousOperations.push({
      id: "merge_or_auto_merge",
      effect: "repository_metadata",
      preconditions: ["checks_pass"],
      postconditions: ["merged"],
    });

    const errors = validateExecutionAutonomyPolicy(candidate).join("\n");

    assert.match(errors, /must never be autonomous/u);
    assert.match(errors, /ownerDecisionGates must include merge_or_auto_merge/u);
  });

  it("requires current-head evidence before Ready", () => {
    const candidate = clonePolicy();
    const operation = findOperation(candidate, "pull_request_ready");
    operation.preconditions = operation.preconditions.filter(
      (condition) => condition !== "current_head_checks_terminal_success",
    );

    assert.match(
      validateExecutionAutonomyPolicy(candidate).join("\n"),
      /current_head_checks_terminal_success/u,
    );
  });
});
