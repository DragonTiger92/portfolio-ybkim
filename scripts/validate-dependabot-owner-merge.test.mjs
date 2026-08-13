import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { describe, it } from "node:test";

const actionsUrl = new URL("../infra/terraform/github/actions.tf", import.meta.url);
const repositoryUrl = new URL("../infra/terraform/github/repository.tf", import.meta.url);
const workflowUrl = new URL("../.github/workflows/dependabot-policy.yml", import.meta.url);

describe("Dependabot owner merge contract", () => {
  it("keeps merge authority with the owner", async () => {
    const [actions, repository, workflow] = await Promise.all([
      readFile(actionsUrl, "utf8"),
      readFile(repositoryUrl, "utf8"),
      readFile(workflowUrl, "utf8"),
    ]);

    assert.match(workflow, /name: Request Owner Merge Review/u);
    assert.match(workflow, /gh pr edit "\$PR_URL" --add-reviewer/u);
    assert.match(workflow, /## Dependabot owner merge evidence/u);
    assert.doesNotMatch(workflow, /gh pr merge|--auto|DEPENDABOT_AUTOMERGE_ENABLED/u);
    assert.doesNotMatch(workflow, /contents: write/u);
    assert.match(repository, /allow_auto_merge\s+= false/u);
    assert.doesNotMatch(actions, /DEPENDABOT_AUTOMERGE_ENABLED/u);
  });
});
