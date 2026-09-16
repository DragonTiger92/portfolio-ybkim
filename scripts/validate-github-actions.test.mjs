import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  readGitHubActionSources,
  validateGitHubActionSources,
} from "./validate-github-actions.mjs";

const firstSha = "1111111111111111111111111111111111111111";
const secondSha = "2222222222222222222222222222222222222222";

function source(path, content) {
  return { path, content };
}

describe("GitHub Action pin validation", () => {
  it("accepts immutable, documented, consistent external actions", () => {
    const errors = validateGitHubActionSources([
      source(".github/workflows/ci.yml", `uses: actions/checkout@${firstSha} # v7`),
      source(
        ".github/actions/deploy/action.yml",
        `uses: actions/checkout@${firstSha} # v7\nuses: ./.github/actions/local\nuses: docker://node:24`,
      ),
    ]);

    assert.deepEqual(errors, []);
  });

  it("rejects floating refs and missing release comments", () => {
    const errors = validateGitHubActionSources([
      source(".github/workflows/ci.yml", "uses: actions/checkout@v7"),
    ]).join("\n");

    assert.match(errors, /40-character commit SHA/u);
    assert.match(errors, /same-line release comment/u);
  });

  it("rejects inconsistent pins for the same action repository", () => {
    const errors = validateGitHubActionSources([
      source(".github/workflows/ci.yml", `uses: acme/action/setup@${firstSha} # v1.0.0`),
      source(
        ".github/actions/deploy/action.yaml",
        `uses: acme/action/publish@${secondSha} # v2.0.0`,
      ),
    ]).join("\n");

    assert.match(errors, /acme\/action uses/u);
    assert.match(errors, /.github\/workflows\/ci.yml:1/u);
    assert.match(errors, /.github\/actions\/deploy\/action.yaml:1/u);
  });

  it("rejects inconsistent release comments for one immutable pin", () => {
    const errors = validateGitHubActionSources([
      source(".github/workflows/ci.yml", `uses: acme/action@${firstSha} # v1`),
      source(".github/actions/deploy/action.yml", `uses: acme/action@${firstSha} # v1.0.0`),
    ]).join("\n");

    assert.match(errors, /v1\.0\.0/u);
    assert.match(errors, /v1\)/u);
  });

  it("accepts every checked-in workflow and composite action", async () => {
    const sources = await readGitHubActionSources();

    assert.ok(sources.some(({ path }) => path.startsWith(".github/workflows/")));
    assert.ok(sources.some(({ path }) => path.startsWith(".github/actions/")));
    assert.deepEqual(validateGitHubActionSources(sources), []);
  });
});
