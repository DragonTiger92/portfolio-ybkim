import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { validateReleaseRequest } from "./validate-release-request.mjs";

const revision = "a".repeat(40);
const validRequest = {
  existingTagRevision: undefined,
  isMainAncestor: true,
  packageVersion: "1.1.0",
  retryExistingTag: false,
  revision,
  version: "1.1.0",
};

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
