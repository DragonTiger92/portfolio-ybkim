import assert from "node:assert/strict";
import test from "node:test";

import {
  parseClosingIssueNumbers,
  parseRoadmap,
  parseRoadmapPhase,
} from "./sync-github-milestones.mjs";

test("parses roadmap phase rows", () => {
  const phases = parseRoadmap(`
| Phase | Name | Status | Release Target | Goal |
| --- | --- | --- | --- | --- |
| \`PH-001\` | Product Foundation Baseline | In Progress | No production tag | Establish governance |
| \`PH-002\` | Static Portfolio Implementation | Planned | No production tag | Build the site |
`);

  assert.deepEqual(phases, [
    {
      goal: "Establish governance",
      id: "PH-001",
      name: "Product Foundation Baseline",
      releaseTarget: "No production tag",
      status: "In Progress",
    },
    {
      goal: "Build the site",
      id: "PH-002",
      name: "Static Portfolio Implementation",
      releaseTarget: "No production tag",
      status: "Planned",
    },
  ]);
});

test("parses issue-form and manual roadmap phase headings", () => {
  assert.equal(parseRoadmapPhase("## Roadmap Phase\n\n`PH-001`"), "PH-001");
  assert.equal(parseRoadmapPhase("### Roadmap phase\n\nPH-002"), "PH-002");
});

test("deduplicates closing issue references", () => {
  assert.deepEqual(parseClosingIssueNumbers("Closes #1\nFixes #2\nResolves #1"), [1, 2]);
});
