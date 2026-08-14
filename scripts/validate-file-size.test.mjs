import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  countContentLines,
  evaluateContent,
  getFileSizePolicy,
  isIgnoredPath,
  resolveInputFiles,
} from "./validate-file-size.mjs";

describe("file-size policy", () => {
  it("uses specific limits before the general Markdown limit", () => {
    assert.equal(getFileSizePolicy(".agents/guidelines/engineering.md").max, 200);
    assert.equal(getFileSizePolicy(".agents/handoffs/2026-08-14-example-handoff.md").max, 350);
    assert.equal(getFileSizePolicy("docs/requirements/non-functional-requirements.md").max, 350);
    assert.equal(getFileSizePolicy("docs/architecture/overview.md").max, 250);
  });

  it("applies source-adjacent limits without duplicating the JS and TS ESLint rule", () => {
    assert.equal(getFileSizePolicy("src/style.css").max, 300);
    assert.equal(getFileSizePolicy("src/pages/index.astro").max, 250);
    assert.equal(getFileSizePolicy("infra/terraform/github/repository.tf").max, 250);
    assert.equal(getFileSizePolicy("src/main.ts"), null);
  });

  it("ignores generated, dependency, private-context, and temporary paths", () => {
    assert.equal(isIgnoredPath("pnpm-lock.yaml"), true);
    assert.equal(isIgnoredPath("sbom.cdx.json"), true);
    assert.equal(isIgnoredPath("node_modules/example/README.md"), true);
    assert.equal(isIgnoredPath("test-results/failure/error-context.md"), true);
    assert.equal(isIgnoredPath(".contexts/private-notes.md"), true);
    assert.equal(isIgnoredPath("tmp/draft.md"), true);
  });
});

describe("file-size evaluation", () => {
  it("counts non-empty content lines", () => {
    assert.equal(countContentLines("first\n\n  \nsecond\n"), 2);
  });

  it("reports content that exceeds its category limit", () => {
    const content = Array.from({ length: 251 }, () => "content").join("\n");
    const result = evaluateContent("docs/architecture/overview.md", content);

    assert.equal(result.lines, 251);
    assert.equal(result.max, 250);
    assert.equal(result.exceedsLimit, true);
  });

  it("enforces the session handoff boundary", () => {
    const allowedContent = Array.from({ length: 350 }, () => "content").join("\n");
    const exceededContent = `${allowedContent}\ncontent`;
    const allowedResult = evaluateContent(".agents/handoffs/example-handoff.md", allowedContent);
    const exceededResult = evaluateContent(".agents/handoffs/example-handoff.md", exceededContent);

    assert.equal(allowedResult.label, "session handoff");
    assert.equal(allowedResult.lines, 350);
    assert.equal(allowedResult.max, 350);
    assert.equal(allowedResult.exceedsLimit, false);
    assert.equal(exceededResult.lines, 351);
    assert.equal(exceededResult.exceedsLimit, true);
  });
});

describe("file-size input resolution", () => {
  it("expands directory arguments into maintained files", async () => {
    const files = await resolveInputFiles(["docs", "AGENTS.md", "tmp"], process.cwd());

    assert.equal(files.includes("docs/README.md"), true);
    assert.equal(files.includes("AGENTS.md"), true);
    assert.equal(
      files.some((filePath) => filePath.startsWith("tmp/")),
      false,
    );
  });
});
