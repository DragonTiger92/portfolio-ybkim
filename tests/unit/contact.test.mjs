import assert from "node:assert/strict";
import test from "node:test";

import { createGmailComposeUrl, publicContact } from "../../src/data/contact.ts";

test("creates a Gmail compose link without optional draft fields", () => {
  const url = new URL(createGmailComposeUrl());

  assert.equal(url.origin, "https://mail.google.com");
  assert.equal(url.pathname, "/mail/");
  assert.equal(url.searchParams.get("view"), "cm");
  assert.equal(url.searchParams.get("fs"), "1");
  assert.equal(url.searchParams.get("to"), publicContact.email);
  assert.equal(url.searchParams.has("su"), false);
  assert.equal(url.searchParams.has("body"), false);
});

test("omits empty subject and body fields", () => {
  const url = new URL(createGmailComposeUrl({ subject: "", body: "" }));

  assert.equal(url.searchParams.has("su"), false);
  assert.equal(url.searchParams.has("body"), false);
});

test("accepts a subject without a body", () => {
  const url = new URL(createGmailComposeUrl({ subject: "채용 문의" }));

  assert.equal(url.searchParams.get("su"), "채용 문의");
  assert.equal(url.searchParams.has("body"), false);
});

test("accepts a body without a subject", () => {
  const url = new URL(createGmailComposeUrl({ body: "안녕하세요.\n포트폴리오를 검토했습니다." }));

  assert.equal(url.searchParams.get("body"), "안녕하세요.\n포트폴리오를 검토했습니다.");
  assert.equal(url.searchParams.has("su"), false);
});

test("preserves Korean, reserved characters and line breaks without query injection", () => {
  const subject = "채용 문의 & 검토 + 100% #1?";
  const body = "안녕하세요, 김용범 님.\nA+B & C=1\n#검토? / 100%\r\n감사합니다.";
  const url = new URL(createGmailComposeUrl({ subject, body }));

  assert.equal(url.searchParams.get("to"), publicContact.email);
  assert.equal(url.searchParams.get("su"), subject);
  assert.equal(url.searchParams.get("body"), body);
  assert.deepEqual([...url.searchParams.keys()], ["view", "fs", "to", "su", "body"]);
  assert.equal(url.hash, "");
});
