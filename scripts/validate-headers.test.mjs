import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { describe, it } from "node:test";

import { parseHeaders, validateHeaders } from "./validate-headers.mjs";

const headersUrl = new URL("../public/_headers", import.meta.url);

describe("Cloudflare Pages header parsing", () => {
  it("rejects orphaned and duplicate headers", () => {
    assert.match(
      parseHeaders("  X-Test: value").errors.join("\n"),
      /header appears before a rule/u,
    );
    assert.match(
      parseHeaders("/*\n  X-Test: first\n  X-Test: second").errors.join("\n"),
      /duplicate x-test header/u,
    );
  });

  it("rejects unsupported patterns and line lengths", () => {
    const longValue = "x".repeat(2_001);
    const errors = parseHeaders(`relative/*/extra/*\n  X-Test: ${longValue}`).errors.join("\n");

    assert.match(errors, /unsupported header rule pattern/u);
    assert.match(errors, /2,000-character limit/u);
  });
});

describe("Cloudflare Pages header contract", () => {
  it("accepts the checked-in security and cache baseline", async () => {
    const contents = await readFile(headersUrl, "utf8");

    assert.deepEqual(validateHeaders(contents), []);
  });

  it("requires MIME protection and forbids pre-verification HSTS", async () => {
    const contents = await readFile(headersUrl, "utf8");
    const withoutMimeProtection = contents.replace("  X-Content-Type-Options: nosniff\n", "");
    const withHsts = `${contents.trimEnd()}\n  Strict-Transport-Security: max-age=31536000\n`;

    assert.match(validateHeaders(withoutMimeProtection).join("\n"), /x-content-type-options/u);
    assert.match(validateHeaders(withHsts).join("\n"), /HSTS is forbidden/u);
  });

  it("requires immutable hashed assets without inheriting the global cache value", async () => {
    const contents = await readFile(headersUrl, "utf8");
    const withoutDetach = contents.replace("/_astro/*\n  ! Cache-Control\n", "/_astro/*\n");

    assert.match(validateHeaders(withoutDetach).join("\n"), /must detach/u);
  });
});
