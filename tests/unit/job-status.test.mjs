import assert from "node:assert/strict";
import test from "node:test";

import { getJobStatusContent, resolveJobStatusCode } from "../../src/data/job-status.ts";

test("defaults missing and empty build-time status values to actively looking", () => {
  assert.equal(resolveJobStatusCode(undefined), "actively-looking");
  assert.equal(resolveJobStatusCode(""), "actively-looking");
});

test("accepts each supported build-time status", () => {
  assert.equal(resolveJobStatusCode("actively-looking"), "actively-looking");
  assert.equal(resolveJobStatusCode("not-looking"), "not-looking");
});

for (const invalidStatus of ["paused", "ACTIVELY-LOOKING", " ", " not-looking "]) {
  test(`rejects unsupported status ${JSON.stringify(invalidStatus)} instead of changing policy`, () => {
    assert.throws(() => resolveJobStatusCode(invalidStatus), {
      message: `Invalid PORTFOLIO_JOB_STATUS "${invalidStatus}". Expected one of: actively-looking, not-looking.`,
    });
  });
}

test("keeps actively-looking contact policy consistent across both locales", () => {
  assert.deepEqual(getJobStatusContent("ko", "actively-looking"), {
    acceptsEmailContact: true,
    fieldLabel: "구직 상태",
    valueLabel: "구직 중",
  });
  assert.deepEqual(getJobStatusContent("en", "actively-looking"), {
    acceptsEmailContact: true,
    fieldLabel: "Job Search Status",
    valueLabel: "Actively Looking",
  });
});

test("keeps unavailable contact policy consistent across both locales", () => {
  assert.deepEqual(getJobStatusContent("ko", "not-looking"), {
    acceptsEmailContact: false,
    fieldLabel: "구직 상태",
    valueLabel: "구직 중이 아님",
  });
  assert.deepEqual(getJobStatusContent("en", "not-looking"), {
    acceptsEmailContact: false,
    fieldLabel: "Job Search Status",
    valueLabel: "Currently Not Looking",
  });
});
