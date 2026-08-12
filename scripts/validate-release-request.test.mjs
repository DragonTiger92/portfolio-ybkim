import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { describe, it } from "node:test";

import { validateReleaseRequest } from "./validate-release-request.mjs";

const revision = "a".repeat(40);
const releaseEvidenceWorkflowUrl = new URL(
  "../.github/workflows/release-evidence.yml",
  import.meta.url,
);
const exactPullRequestRevision =
  "${{ inputs.revision || github.event.pull_request.head.sha || github.sha }}";
const validRequest = {
  existingTagRevision: undefined,
  isMainAncestor: true,
  packageVersion: "1.1.0",
  retryExistingTag: false,
  revision,
  version: "1.1.0",
};

function countOccurrences(contents, value) {
  return contents.split(value).length - 1;
}

describe("formal release request", () => {
  it("accepts a new package-matched tag for an origin/main revision", () => {
    assert.deepEqual(validateReleaseRequest(validRequest), { tag: "v1.1.0", tagExists: false });
  });

  it("accepts only an explicit same-revision retry for an existing tag", () => {
    assert.deepEqual(
      validateReleaseRequest({
        ...validRequest,
        existingTagRevision: revision,
        retryExistingTag: true,
      }),
      { tag: "v1.1.0", tagExists: true },
    );
    assert.throws(
      () => validateReleaseRequest({ ...validRequest, existingTagRevision: revision }),
      /explicit idempotent retry/u,
    );
  });

  it("rejects version drift, non-main revisions, and immutable-tag movement", () => {
    assert.throws(
      () => validateReleaseRequest({ ...validRequest, packageVersion: "1.0.0" }),
      /must equal package.json/u,
    );
    assert.throws(
      () => validateReleaseRequest({ ...validRequest, isMainAncestor: false }),
      /origin\/main/u,
    );
    assert.throws(
      () => validateReleaseRequest({ ...validRequest, existingTagRevision: "b".repeat(40) }),
      /immutable/u,
    );
  });
});

describe("Release Evidence workflow revision binding", () => {
  it("uses the pull request head before the event SHA fallback", async () => {
    const workflow = await readFile(releaseEvidenceWorkflowUrl, "utf8");

    assert.equal(countOccurrences(workflow, exactPullRequestRevision), 4);
    assert.doesNotMatch(workflow, /inputs\.revision \|\| github\.sha/u);
  });
});
