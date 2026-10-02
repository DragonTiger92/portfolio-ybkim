import assert from "node:assert/strict";
import test from "node:test";
import { createScanOptions, formatScanResult, projectScanExecution } from "./secret-scan.mjs";

const base = "a".repeat(40);
const head = "b".repeat(40);
const canary = ["synthetic", "private", "canary"].join("-");
const finding = {
  File: "src/config.ts",
  RuleID: "generic-api-key",
  StartLine: 3,
  Commit: head,
  Secret: canary,
  Match: `api_key=${canary}`,
  Author: canary,
  Message: canary,
};

test("withholds secret, context, identity and both raw process streams", () => {
  const result = projectScanExecution({
    status: 2,
    stdout: JSON.stringify([finding]),
    stderr: "",
  });
  assert.equal(result.status, 2);
  assert.deepEqual(result.findings, [
    { path: "src/config.ts", rule: "generic-api-key", line: 3, commit: head },
  ]);
  assert.ok(!formatScanResult(result).includes(canary));
});

test("fails closed for process errors, timeouts, malformed reports and inconsistent outcomes", () => {
  for (const execution of [
    { status: 0, stdout: "[]", stderr: canary },
    { status: 2, stdout: JSON.stringify([finding]), stderr: canary },
    { status: 1, stdout: "[]", stderr: canary },
    { status: null, error: new Error(canary), stdout: "[]" },
    { status: 0, signal: "SIGTERM", stdout: "[]" },
    { status: 0, stdout: canary },
    { status: 0, stdout: "null" },
    { status: 0, stdout: JSON.stringify([finding]) },
    { status: 2, stdout: "[]" },
  ]) {
    assert.throws(() => projectScanExecution(execution));
  }
  assert.deepEqual(projectScanExecution({ status: 0, stdout: "[]" }), { status: 0, findings: [] });
});

test("rejects unsafe or malformed finding metadata and allows Korean relative paths", () => {
  for (const invalid of [
    { File: "/private/config.ts" },
    { File: "C:\\private\\config.ts" },
    { File: "../config.ts" },
    { RuleID: undefined },
    { RuleID: "::error::" },
    { StartLine: 0 },
    { Commit: "main" },
  ]) {
    assert.throws(() =>
      projectScanExecution({ status: 2, stdout: JSON.stringify([{ ...finding, ...invalid }]) }),
    );
  }
  const result = projectScanExecution({
    status: 2,
    stdout: JSON.stringify([{ ...finding, File: "문서/설정.ts", Commit: "" }]),
  });
  assert.equal(result.findings[0].path, "문서/설정.ts");
});

test("scans only staged changes, HEAD history or the exact PR range", () => {
  assert.deepEqual(createScanOptions("staged"), ["--staged"]);
  const historyOptions = ["--log-opts=--full-history --diff-merges=separate HEAD"];
  assert.deepEqual(createScanOptions("history"), historyOptions);
  assert.deepEqual(createScanOptions("ci", [], { name: "push" }), historyOptions);
  assert.deepEqual(createScanOptions("ci", [], { name: "workflow_dispatch" }), historyOptions);
  assert.deepEqual(
    createScanOptions("ci", [], { pull_request: { base: { sha: base }, head: { sha: head } } }),
    [`--log-opts=--full-history --diff-merges=separate ${base}..${head}`],
  );
  for (const revisions of [["--all", head], [base], [base, "main"], [base, head, "--all"]]) {
    assert.throws(() => createScanOptions("range", revisions));
  }
  assert.throws(() => createScanOptions("ci", [], { name: "pull_request" }));
  assert.throws(() => createScanOptions("directory"));
});
