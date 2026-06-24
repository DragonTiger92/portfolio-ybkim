import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  countContentLines,
  evaluateContent,
  getFileSizePolicy,
  isIgnoredPath,
} from "./validate-file-size.mjs";

describe("file-size policy", () => {
  it("uses specific limits before the general Markdown limit", () => {
    assert.equal(getFileSizePolicy(".agents/guidelines/engineering.md").max, 200);
    assert.equal(getFileSizePolicy("docs/requirements/non-functional-requirements.md").max, 350);
    assert.equal(getFileSizePolicy("docs/architecture/overview.md").max, 250);
  });

  it("applies source-adjacent limits without duplicating the JS and TS ESLint rule", () => {
    assert.equal(getFileSizePolicy("src/style.css").max, 300);
    assert.equal(getFileSizePolicy("infra/terraform/github/repository.tf").max, 250);
    assert.equal(getFileSizePolicy("src/main.ts"), null);
  });

  it("ignores generated, dependency, private-context, and temporary paths", () => {
    assert.equal(isIgnoredPath("pnpm-lock.yaml"), true);
    assert.equal(isIgnoredPath("sbom.spdx.json"), true);
    assert.equal(isIgnoredPath("node_modules/example/README.md"), true);
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
});
