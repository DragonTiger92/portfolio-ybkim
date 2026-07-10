import assert from "node:assert/strict";
import test from "node:test";

import { validatePullRequestMetadata } from "./validate-pr-metadata.mjs";

const validBody = `
## Roadmap Phase
- [x] \`PH-001\`

## Included Product Backlog Items
- \`PBI-019\`

## Release Impact
- [x] \`release:not-applicable\`

## Change Type
- [x] \`type:ci\`
`;

test("accepts a PBI-linked branch and complete metadata", () => {
  const errors = validatePullRequestMetadata({
    actor: "DragonTiger92",
    body: validBody,
    headRef: "ci/pbi-019-quality-gates",
  });

  assert.deepEqual(errors, []);
});

test("requires the branch tracking ID in the PR body", () => {
  const errors = validatePullRequestMetadata({
    actor: "DragonTiger92",
    body: validBody.replace("PBI-019", "PBI-020"),
    headRef: "ci/pbi-019-quality-gates",
  });

  assert.match(errors.join("\n"), /PBI-019/);
});

test("accepts a phase integration branch", () => {
  const errors = validatePullRequestMetadata({
    actor: "DragonTiger92",
    body: validBody,
    headRef: "feature/ph-001-product-foundation-baseline",
  });

  assert.deepEqual(errors, []);
});

test("rejects an unsupported branch prefix", () => {
  const errors = validatePullRequestMetadata({
    actor: "DragonTiger92",
    body: validBody,
    headRef: "work/pbi-019-quality-gates",
  });

  assert.match(errors.join("\n"), /Branch name/);
});

test("requires one phase and one release impact", () => {
  const errors = validatePullRequestMetadata({
    actor: "DragonTiger92",
    body: validBody
      .replace("- [x] `PH-001`", "- [ ] `PH-001`")
      .replace("- [x] `release:not-applicable`", "- [ ] `release:not-applicable`"),
    headRef: "ci/pbi-019-quality-gates",
  });

  assert.match(errors.join("\n"), /exactly one roadmap phase/);
  assert.match(errors.join("\n"), /exactly one release impact/);
});

test("allows Dependabot generated branch metadata", () => {
  const errors = validatePullRequestMetadata({
    actor: "dependabot[bot]",
    body: "",
    headRef: "dependabot/npm_and_yarn/vite-9",
  });

  assert.deepEqual(errors, []);
});
