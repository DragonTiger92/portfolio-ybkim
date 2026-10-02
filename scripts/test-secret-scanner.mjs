import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { randomBytes } from "node:crypto";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { assertGitleaksVersion, getGitleaksInstallation } from "./gitleaks-tool.mjs";
import { createScanOptions, formatScanResult, scanRepository } from "./secret-scan.mjs";

function git(root, args) {
  const execution = spawnSync("git", ["-c", "core.hooksPath=disabled-hooks", ...args], {
    cwd: root,
    encoding: "utf8",
    timeout: 10_000,
    windowsHide: true,
  });
  if (execution.status !== 0) {
    throw new Error("Synthetic Git operation failed.");
  }
  return execution.stdout.trim();
}

function assertBlocked(result, canary) {
  if (
    result.status !== 2 ||
    result.findings.length === 0 ||
    formatScanResult(result).includes(canary)
  ) {
    throw new Error("Synthetic detection or redaction failed.");
  }
}

function assertScanRejected(scan) {
  assert.throws(scan, "Scanner accepted an invalid or incomplete input.");
}

async function testMergeAndFailurePaths(root, executable) {
  const base = git(root, ["rev-parse", "HEAD"]);
  git(root, ["switch", "-c", "synthetic-merge"]);
  await writeFile(join(root, "branch.txt"), "Safe branch content.\n");
  git(root, ["add", "branch.txt"]);
  git(root, ["commit", "-m", "safe branch"]);
  git(root, ["switch", "main"]);
  git(root, ["merge", "--no-ff", "--no-commit", "synthetic-merge"]);
  const canary = randomBytes(24).toString("hex");
  await writeFile(join(root, "merge-only.txt"), `api_key = "${canary}"\n`);
  git(root, ["add", "merge-only.txt"]);
  git(root, ["commit", "-m", "synthetic merge-only canary"]);
  const head = git(root, ["rev-parse", "HEAD"]);
  const result = scanRepository({
    root,
    executable,
    options: createScanOptions("range", [base, head]),
  });
  assertBlocked(result, canary);
  if (
    !result.findings.some((finding) => finding.path === "merge-only.txt" && finding.commit === head)
  ) {
    throw new Error("Merge-only canary was missed.");
  }
  assertScanRejected(() =>
    scanRepository({
      root,
      executable,
      options: createScanOptions("range", ["c".repeat(40), head]),
    }),
  );
  await writeFile(join(root, ".gitleaksignore"), "");
  assertScanRejected(() =>
    scanRepository({ root, executable, options: createScanOptions("history") }),
  );
  await rm(join(root, ".gitleaksignore"));
  const shallowRoot = join(root, "shallow-checkout");
  git(root, ["clone", "--depth", "1", pathToFileURL(root).href, shallowRoot]);
  assertScanRejected(() =>
    scanRepository({ root: shallowRoot, executable, options: createScanOptions("history") }),
  );
}

async function runCanaryTest(root, executable) {
  git(root, ["init", "--initial-branch=main"]);
  git(root, ["config", "user.name", "Synthetic test"]);
  git(root, ["config", "user.email", "synthetic@example.invalid"]);
  await writeFile(join(root, "README.md"), "Synthetic secret scanner test.\n");
  git(root, ["add", "README.md"]);
  git(root, ["commit", "-m", "safe initial content"]);
  const base = git(root, ["rev-parse", "HEAD"]);
  const canary = randomBytes(24).toString("hex");
  await writeFile(join(root, "untracked.txt"), `api_key = "${canary}"\n`);
  const clean = scanRepository({ root, executable, options: createScanOptions("staged") });
  if (clean.status !== 0) {
    throw new Error("Staged scan inspected untracked content.");
  }
  await writeFile(join(root, "config.txt"), `api_key = "${canary}" # gitleaks:allow\n`);
  git(root, ["add", "config.txt"]);
  assertBlocked(scanRepository({ root, executable, options: createScanOptions("staged") }), canary);
  git(root, ["commit", "-m", "synthetic canary"]);
  await writeFile(join(root, "config.txt"), "Safe replacement.\n");
  git(root, ["add", "config.txt"]);
  git(root, ["commit", "-m", "remove synthetic canary"]);
  const head = git(root, ["rev-parse", "HEAD"]);
  assertBlocked(
    scanRepository({ root, executable, options: createScanOptions("range", [base, head]) }),
    canary,
  );
  assertBlocked(
    scanRepository({ root, executable, options: createScanOptions("history") }),
    canary,
  );
}

async function run() {
  const { executable } = getGitleaksInstallation();
  assertGitleaksVersion(executable);
  const root = await mkdtemp(join(tmpdir(), "portfolio-gitleaks-canary-"));
  try {
    await runCanaryTest(root, executable);
    await testMergeAndFailurePaths(root, executable);
  } finally {
    await removeCanaryRepository(root);
  }
  process.stdout.write(
    "Secret scanner canary passed: staged, range, history, merge-only, invalid refs, ignore/shallow rejection and redaction.\n",
  );
}

async function removeCanaryRepository(root) {
  if (dirname(root) !== resolve(tmpdir())) {
    throw new Error("Unexpected temporary test path; cleanup refused.");
  }
  await rm(root, { recursive: true, force: true });
}

await run().catch(() => {
  console.error("Secret scanner canary failed; synthetic values and raw process output withheld.");
  process.exitCode = 1;
});
