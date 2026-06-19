import assert from "node:assert/strict";
import test from "node:test";

import { validatePullRequestMetadata } from "./validate-pr-metadata.mjs";

const validBody = `
Closes #19

## Roadmap Phase / Milestone
- [x] \`PH-001\`

## Included Product Backlog Items
- \`PBI-019\`

## Release Impact
- [x] \`release:not-applicable\`

## Change Type
- [x] \`type:ci\`
`;

test("accepts an issue-linked branch and complete metadata", () => {
  const errors = validatePullRequestMetadata({
    actor: "DragonTiger92",
    body: validBody,
    headRef: "ci/19-quality-gates",
  });

  assert.deepEqual(errors, []);
});

test("requires the branch issue to be closed by the PR", () => {
  const errors = validatePullRequestMetadata({
    actor: "DragonTiger92",
    body: validBody.replace("Closes #19", "Closes #20"),
    headRef: "ci/19-quality-gates",
  });

  assert.match(errors.join("\n"), /Closes #19/);
});

test("rejects an unsupported branch prefix", () => {
  const errors = validatePullRequestMetadata({
    actor: "DragonTiger92",
    body: validBody,
    headRef: "work/19-quality-gates",
  });

  assert.match(errors.join("\n"), /Branch name/);
});

test("requires one phase and one release impact", () => {
  const errors = validatePullRequestMetadata({
    actor: "DragonTiger92",
    body: validBody
      .replace("- [x] `PH-001`", "- [ ] `PH-001`")
      .replace("- [x] `release:not-applicable`", "- [ ] `release:not-applicable`"),
    headRef: "ci/19-quality-gates",
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
