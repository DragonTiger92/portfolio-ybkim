import assert from "node:assert/strict";
import test from "node:test";

import { publicContact } from "../../src/data/contact.ts";
import { createDemoAccessRequest } from "../../src/data/demo-access.ts";

for (const projectTitle of ["Karly", "Book-Kong", "portfolio-ybkim", "한글 데모 & A+B #1"]) {
  test(`creates a complete Gmail access request for ${projectTitle}`, () => {
    const url = new URL(createDemoAccessRequest(projectTitle).gmailUrl);
    const body = url.searchParams.get("body");

    assert.equal(url.origin, "https://mail.google.com");
    assert.equal(url.pathname, "/mail/");
    assert.equal(url.searchParams.get("view"), "cm");
    assert.equal(url.searchParams.get("to"), publicContact.email);
    assert.equal(url.searchParams.get("su"), `[Portfolio Demo Access] ${projectTitle}`);
    assert.ok(body.startsWith("안녕하세요, 김용범 님.\n\n"));
    assert.ok(body.includes(`\n${projectTitle} 데모 계정을 요청드립니다.\n`));
    assert.ok(body.includes("소속 / 채용 포지션:"));
    assert.ok(body.includes("검토 종료일 (기본 7일):"));
    assert.ok(body.includes("암호 수신 연락처:"));
    assert.ok(body.endsWith("\n\n채용 검토에만 사용하겠습니다."));
    assert.equal(url.hash, "");
  });
}

test("keeps successive project requests independent", () => {
  const first = createDemoAccessRequest("Karly");
  const second = createDemoAccessRequest("Book-Kong");

  assert.notEqual(first.gmailUrl, second.gmailUrl);
  assert.equal(new URL(first.gmailUrl).searchParams.get("su"), "[Portfolio Demo Access] Karly");
  assert.equal(
    new URL(second.gmailUrl).searchParams.get("su"),
    "[Portfolio Demo Access] Book-Kong",
  );
});
