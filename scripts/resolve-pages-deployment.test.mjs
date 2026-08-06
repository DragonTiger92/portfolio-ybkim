import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { selectPagesDeployment } from "./resolve-pages-deployment.mjs";

const revision = "a".repeat(40);

function deployment(overrides = {}) {
  return {
    created_on: "2026-08-06T01:00:00Z",
    deployment_trigger: { metadata: { branch: "feature/pbi-065-preview", commit_hash: revision } },
    environment: "preview",
    id: "11111111-1111-4111-8111-111111111111",
    latest_stage: { status: "success" },
    url: "https://deployment-id.portfolio.pages.dev/",
    ...overrides,
  };
}

describe("Pages deployment selection", () => {
  it("selects the newest successful exact-revision deployment", () => {
    const selected = selectPagesDeployment({
      branch: "feature/pbi-065-preview",
      deployments: [
        deployment(),
        deployment({
          created_on: "2026-08-06T02:00:00Z",
          id: "22222222-2222-4222-8222-222222222222",
        }),
      ],
      environment: "preview",
      revision,
    });

    assert.equal(selected.id, "22222222-2222-4222-8222-222222222222");
  });

  it("rejects short-SHA, branch, environment, and failed-status approximations", () => {
    assert.throws(
      () =>
        selectPagesDeployment({
          branch: "feature/pbi-065-preview",
          deployments: [
            deployment({
              deployment_trigger: {
                metadata: { branch: "feature/pbi-065-preview", commit_hash: revision.slice(0, 7) },
              },
            }),
            deployment({ environment: "production" }),
            deployment({ latest_stage: { status: "failure" } }),
          ],
          environment: "preview",
          revision,
        }),
      /No successful Pages deployment matches/u,
    );
  });
});
