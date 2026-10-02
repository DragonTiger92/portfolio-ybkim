import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { posix, resolve, win32 } from "node:path";
import { repositoryRoot } from "./gitleaks-tool.mjs";

const scanTimeoutMilliseconds = 120_000;
const maximumReportBytes = 16 * 1024 * 1024;
const revisionPattern = /^[a-f0-9]{40}$/u;

function assertRelativeFindingPath(path) {
  if (!path || posix.isAbsolute(path) || win32.isAbsolute(path) || path.split("/").includes("..")) {
    throw new Error("Invalid finding path.");
  }
}

function assertFindingMetadata(finding) {
  if (typeof finding.RuleID !== "string" || !/^[a-z][a-z0-9-]{0,80}$/u.test(finding.RuleID)) {
    throw new Error("Invalid finding rule.");
  }
  if (!Number.isSafeInteger(finding.StartLine) || finding.StartLine < 1) {
    throw new Error("Invalid finding line.");
  }
  if (finding.Commit !== "" && !revisionPattern.test(finding.Commit)) {
    throw new Error("Invalid finding revision.");
  }
}

function projectFinding(finding) {
  const path = typeof finding.File === "string" ? finding.File.replaceAll("\\", "/") : "";
  assertRelativeFindingPath(path);
  assertFindingMetadata(finding);
  return { path, rule: finding.RuleID, line: finding.StartLine, commit: finding.Commit };
}

export function projectScanExecution(execution) {
  if (
    execution.error ||
    execution.signal ||
    execution.stderr?.trim() ||
    ![0, 2].includes(execution.status)
  ) {
    throw new Error("Secret scanner failed; raw stdout and stderr withheld.");
  }
  const report = JSON.parse(execution.stdout);
  if (!Array.isArray(report) || (execution.status === 0) !== (report.length === 0)) {
    throw new Error("Incomplete or inconsistent secret scan report.");
  }
  return { status: execution.status, findings: report.map(projectFinding) };
}

export function createScanOptions(mode, revisions = [], event) {
  if (mode === "ci") {
    return createCiScanOptions(revisions, event);
  }
  if (mode === "range") {
    assertRangeRevisions(revisions);
    return [`--log-opts=--full-history --diff-merges=separate ${revisions[0]}..${revisions[1]}`];
  }
  if (revisions.length !== 0) {
    throw new Error("Unexpected scan arguments.");
  }
  if (mode === "staged") {
    return ["--staged"];
  }
  if (mode === "history") {
    return ["--log-opts=--full-history --diff-merges=separate HEAD"];
  }
  throw new Error("Expected staged, history, ci, or range with two full commit SHAs.");
}

function assertRangeRevisions(revisions) {
  if (revisions.length !== 2 || !revisions.every((ref) => revisionPattern.test(ref))) {
    throw new Error("A scan range requires two full commit SHAs.");
  }
}

function createCiScanOptions(revisions, event) {
  if (revisions.length !== 0) {
    throw new Error("Unexpected CI scan arguments.");
  }
  if (event?.pull_request) {
    return createScanOptions("range", [event.pull_request.base.sha, event.pull_request.head.sha]);
  }
  if (["push", "workflow_dispatch"].includes(event?.name)) {
    return createScanOptions("history");
  }
  throw new Error("Unsupported CI scan event.");
}

function assertCompleteHistory(root, options) {
  if (options.includes("--staged")) {
    return;
  }
  const execution = spawnSync("git", ["rev-parse", "--is-shallow-repository"], {
    cwd: root,
    encoding: "utf8",
    timeout: 10_000,
    windowsHide: true,
  });
  if (execution.status !== 0 || execution.stdout.trim() !== "false") {
    throw new Error("A complete Git checkout is required for history or range scanning.");
  }
}

export function scanRepository({ executable, options, root = repositoryRoot }) {
  if (existsSync(resolve(root, ".gitleaksignore"))) {
    throw new Error(
      "Unreviewed ignore files are not supported; use the reviewed scanner configuration.",
    );
  }
  assertCompleteHistory(root, options);
  const args = [
    "git",
    root,
    ...options,
    "--config",
    resolve(repositoryRoot, ".gitleaks.toml"),
    "--redact=100",
    "--no-banner",
    "--no-color",
    "--log-level=error",
    "--timeout=110",
    "--ignore-gitleaks-allow",
    "--exit-code=2",
    "--report-format=json",
    "--report-path=-",
  ];
  // Capture both streams. Only the allowlisted report projection leaves this process.
  const execution = spawnSync(executable, args, {
    cwd: root,
    encoding: "utf8",
    timeout: scanTimeoutMilliseconds,
    maxBuffer: maximumReportBytes,
    windowsHide: true,
  });
  return projectScanExecution(execution);
}

export function formatScanResult(result) {
  return JSON.stringify({ findings: result.findings, count: result.findings.length });
}
