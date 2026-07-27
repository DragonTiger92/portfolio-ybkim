import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";

import { getJobStatusContent, resolveJobStatusCode } from "../src/data/job-status.ts";

const unavailableStatus = "not-looking";
const publicEmail = "dczwtu12b+portfolio@gmail.com";

test("keeps Korean and English unavailable labels on one status policy", () => {
  const koreanStatus = getJobStatusContent("ko", unavailableStatus);
  const englishStatus = getJobStatusContent("en", unavailableStatus);

  assert.equal(koreanStatus.valueLabel, "구직 중이 아님");
  assert.equal(englishStatus.valueLabel, "Currently Not Looking");
  assert.equal(koreanStatus.acceptsEmailContact, false);
  assert.equal(englishStatus.acceptsEmailContact, false);
});

test("defaults safely and rejects unsupported build-time status values", () => {
  assert.equal(resolveJobStatusCode(undefined), "actively-looking");
  assert.equal(resolveJobStatusCode(""), "actively-looking");
  assert.equal(resolveJobStatusCode(unavailableStatus), unavailableStatus);
  assert.throws(() => resolveJobStatusCode("paused"), /Invalid PORTFOLIO_JOB_STATUS "paused"/);
});

test("omits email data and actions from a not-looking static build", async () => {
  const outputDirectory = path.join(tmpdir(), `portfolio-contact-${process.pid}-${Date.now()}`);
  const astroCli = path.resolve("node_modules/astro/bin/astro.mjs");

  try {
    const build = spawnSync(process.execPath, [astroCli, "build", "--outDir", outputDirectory], {
      cwd: process.cwd(),
      encoding: "utf8",
      env: {
        ...process.env,
        PORTFOLIO_JOB_STATUS: unavailableStatus,
      },
    });

    assert.equal(build.status, 0, build.stderr || build.stdout);

    const landingHtml = await readFile(path.join(outputDirectory, "index.html"), "utf8");

    assert.match(landingHtml, /구직 중이 아님/);
    assert.match(landingHtml, /현재 이메일 연락을 받고 있지 않습니다\./);
    assert.match(landingHtml, /https:\/\/github\.com\/DragonTiger92/);
    assert.match(landingHtml, /\/assets\/resume\/yb-kim-resume\.pdf/);
    assert.doesNotMatch(landingHtml, new RegExp(publicEmail.replace(/[+.]/g, "\\$&")));
    assert.doesNotMatch(landingHtml, /mail\.google\.com\/mail/);
    assert.doesNotMatch(landingHtml, /data-copy-email/);
  } finally {
    await rm(outputDirectory, { force: true, recursive: true });
  }
});
