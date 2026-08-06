import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

import { evaluatePreviewEligibility } from "./evaluate-preview-eligibility.mjs";

const revision = "a".repeat(40);
const scriptPath = fileURLToPath(new URL("./evaluate-preview-eligibility.mjs", import.meta.url));
const eligibleInput = {
  actor: "DragonTiger92",
  baseRepository: "DragonTiger92/portfolio-ybkim",
  checkedSha: revision,
  headRef: "feature/pbi-065-protected-previews",
  headRepository: "dragontiger92/PORTFOLIO-YBKIM",
  headSha: revision,
  isDraft: false,
};

describe("preview eligibility", () => {
  it("allows an exact checked revision from an eligible same-repository branch", () => {
    assert.deepEqual(evaluatePreviewEligibility(eligibleInput), {
      eligible: true,
      reason: "eligible",
    });
  });

  it("rejects Dependabot before other policy checks", () => {
    assert.deepEqual(evaluatePreviewEligibility({ ...eligibleInput, actor: "dependabot[bot]" }), {
      eligible: false,
      reason: "dependabot",
    });
  });

  it("rejects forks and drafts", () => {
    assert.equal(
      evaluatePreviewEligibility({
        ...eligibleInput,
        headRepository: "contributor/portfolio-ybkim",
      }).reason,
      "fork",
    );
    assert.equal(evaluatePreviewEligibility({ ...eligibleInput, isDraft: true }).reason, "draft");
  });

  it("allows only feature, fix, and content branch contracts", () => {
    assert.equal(
      evaluatePreviewEligibility({
        ...eligibleInput,
        headRef: "infra/ph-003-cloudflare",
      }).reason,
      "branch-prefix",
    );
    assert.equal(
      evaluatePreviewEligibility({
        ...eligibleInput,
        headRef: "feature/untracked-description",
      }).reason,
      "branch-prefix",
    );
  });

  it("rejects malformed and stale revisions", () => {
    assert.equal(
      evaluatePreviewEligibility({ ...eligibleInput, checkedSha: "abc123" }).reason,
      "invalid-sha",
    );
    assert.equal(
      evaluatePreviewEligibility({
        ...eligibleInput,
        checkedSha: "b".repeat(40),
      }).reason,
      "stale-sha",
    );
  });

  it("maps synchronous CLI validation failures to exit code 1", () => {
    const execution = spawnSync(process.execPath, [scriptPath], { encoding: "utf8" });

    assert.equal(execution.status, 1);
    assert.match(
      execution.stderr,
      /Preview eligibility evaluation failed: Missing required option --actor\./u,
    );
  });
});
