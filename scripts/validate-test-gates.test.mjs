import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { assertSuccessfulTestGates } from "./validate-test-gates.mjs";
import { assertVisualEnvironment, visualContainerImage } from "./visual-test-environment.mjs";

async function readWorkflow(path) {
  return (await readFile(path, "utf8")).replaceAll("\r\n", "\n");
}

test("accepts only successful quality and visual outcomes", () => {
  assert.doesNotThrow(() => assertSuccessfulTestGates({ quality: "success", visual: "success" }));

  for (const outcome of ["failure", "cancelled", "skipped", undefined, ""]) {
    assert.throws(() => assertSuccessfulTestGates({ quality: outcome, visual: "success" }));
    assert.throws(() => assertSuccessfulTestGates({ quality: "success", visual: outcome }));
  }
});

test("failed visual gate produces a failing CLI exit code", () => {
  const execution = spawnSync(process.execPath, ["scripts/validate-test-gates.mjs"], {
    encoding: "utf8",
    env: { ...process.env, QUALITY_RESULT: "success", VISUAL_RESULT: "failure" },
  });

  assert.equal(execution.status, 1);
  assert.match(execution.stderr, /visual=failure/u);
});

test("rejects missing or different visual environments without updating snapshots", () => {
  assert.doesNotThrow(() =>
    assertVisualEnvironment("linux", { PORTFOLIO_VISUAL_IMAGE: visualContainerImage }),
  );
  assert.throws(() =>
    assertVisualEnvironment("win32", { PORTFOLIO_VISUAL_IMAGE: visualContainerImage }),
  );
  assert.throws(() => assertVisualEnvironment("linux", {}));
  assert.throws(() => assertVisualEnvironment("linux", { PORTFOLIO_VISUAL_IMAGE: "other" }));
});

test("required Check and delivery outputs depend on both gates", async () => {
  const [ci, artifact] = await Promise.all([
    readWorkflow(".github/workflows/ci.yml"),
    readWorkflow(".github/workflows/site-artifact.yml"),
  ]);
  const check = ci.slice(ci.indexOf("  check:\n"));
  const approval = artifact.slice(artifact.indexOf("  artifact:\n"));

  assert.ok(
    check.includes(
      "name: ${{ github.event_name == 'workflow_dispatch' && inputs.update-baselines && 'Baseline Candidates' || 'Check' }}",
    ),
  );
  assert.ok(check.includes("if: ${{ always() }}"));
  assert.ok(check.includes("needs: [quality, visual]"));
  assert.ok(check.includes("QUALITY_RESULT: ${{ needs.quality.result }}"));
  assert.ok(check.includes("VISUAL_RESULT: ${{ needs.visual.result }}"));
  assert.ok(check.includes("run: node scripts/validate-test-gates.mjs"));
  assert.ok(
    ci.includes(
      "update-baselines: ${{ github.event_name == 'workflow_dispatch' && inputs.update-baselines }}",
    ),
  );
  assert.ok(approval.includes("needs: [build, visual]"));
  assert.ok(approval.includes("QUALITY_RESULT: ${{ needs.build.result }}"));
  assert.ok(approval.includes("VISUAL_RESULT: ${{ needs.visual.result }}"));
  assert.ok(approval.includes("run: node scripts/validate-test-gates.mjs"));
  assert.ok(artifact.includes("value: ${{ jobs.artifact.outputs['artifact-id'] }}"));
  assert.ok(artifact.includes("artifact-id: ${{ needs.build.outputs.artifact-id }}"));
});

test("visual calls reuse the exact manifested dist even from a manual release caller", async () => {
  const workflow = await readWorkflow(".github/workflows/visual-tests.yml");

  assert.ok(workflow.includes(`image: ${visualContainerImage}`));
  assert.ok(workflow.includes(`PORTFOLIO_VISUAL_IMAGE: ${visualContainerImage}`));
  assert.ok(workflow.includes("ref: ${{ github.workflow_sha }}"));
  assert.ok(workflow.includes("if: ${{ inputs.artifact-id != '' }}"));
  assert.ok(workflow.includes("artifact-ids: ${{ inputs.artifact-id }}"));
  assert.ok(
    workflow.includes('run: node scripts/validate-artifact-manifest.mjs --revision "$REVISION"'),
  );
  assert.ok(workflow.includes("if: ${{ inputs.artifact-id == '' }}"));
  assert.ok(!workflow.includes("github.event_name"));
  assert.equal(workflow.match(/run: pnpm test:visual\n/gu)?.length, 3);
  assert.ok(workflow.includes("run: pnpm test:visual:probe"));
  assert.ok(workflow.includes("if: ${{ inputs.update-baselines }}"));
  assert.ok(workflow.includes("contents: read"));
});
