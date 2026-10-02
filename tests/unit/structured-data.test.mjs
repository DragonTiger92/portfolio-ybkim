import assert from "node:assert/strict";
import test from "node:test";

import {
  createProjectStructuredData,
  serializeStructuredData,
} from "../../src/data/structured-data.ts";

const site = new URL("https://portfolio-ybkim.pages.dev");
const project = Object.freeze({
  slug: "new-project",
  title: "새 프로젝트",
  summary: "공개 콘텐츠를 바탕으로 작성한 프로젝트 요약입니다.",
  stack: Object.freeze(["Astro", "TypeScript"]),
});

test("generates deterministic structured data without modifying or retaining the input stack", () => {
  const structuredData = createProjectStructuredData(project, site);

  assert.deepEqual(structuredData, createProjectStructuredData(project, site));
  assert.deepEqual(structuredData["@graph"][1].keywords, project.stack);
  assert.notEqual(structuredData["@graph"][1].keywords, project.stack);
  assert.equal(site.href, "https://portfolio-ybkim.pages.dev/");
});

test("links a new project's page, work and visible breadcrumb using the configured origin", () => {
  const customSite = new URL("https://portfolio.example/base/");
  const structuredData = createProjectStructuredData(project, customSite);
  const [page, work, breadcrumb] = structuredData["@graph"];
  const canonicalUrl = "https://portfolio.example/projects/new-project/";

  assert.equal(structuredData["@context"], "https://schema.org");
  assert.equal(page["@type"], "WebPage");
  assert.equal(work["@type"], "CreativeWork");
  assert.equal(breadcrumb["@type"], "BreadcrumbList");
  assert.equal(page.url, canonicalUrl);
  assert.equal(work.url, canonicalUrl);
  assert.equal(page["@id"], `${canonicalUrl}#webpage`);
  assert.equal(work["@id"], `${canonicalUrl}#project`);
  assert.equal(breadcrumb["@id"], `${canonicalUrl}#breadcrumb`);
  assert.equal(page.mainEntity["@id"], work["@id"]);
  assert.equal(work.mainEntityOfPage["@id"], page["@id"]);
  assert.equal(page.breadcrumb["@id"], breadcrumb["@id"]);
  assert.deepEqual(breadcrumb.itemListElement, [
    {
      "@type": "ListItem",
      position: 1,
      name: "프로젝트 목록",
      item: "https://portfolio.example/#projects",
    },
    { "@type": "ListItem", position: 2, name: project.title, item: canonicalUrl },
  ]);
});

test("uses visible content and omits inferred ownership, dates, images and unrelated fields", () => {
  const structuredData = createProjectStructuredData(
    { ...project, role: "팀 리드", links: [{ label: "데모", href: "https://example.com" }] },
    site,
  );
  const [page, work] = structuredData["@graph"];

  for (const entity of [page, work]) {
    assert.equal(entity.name, project.title);
    assert.equal(entity.description, project.summary);
    assert.equal(entity.inLanguage, "ko");
  }

  assert.deepEqual(Object.keys(work).sort(), [
    "@id",
    "@type",
    "description",
    "inLanguage",
    "keywords",
    "mainEntityOfPage",
    "name",
    "url",
  ]);
});

test("omits keywords for an empty stack while still generating the project page", () => {
  const structuredData = createProjectStructuredData({ ...project, stack: [] }, site);

  assert.equal(Object.hasOwn(structuredData["@graph"][1], "keywords"), false);
  assert.equal(structuredData["@graph"][0].name, project.title);
});

test("serializes Korean, quotes and script-closing content as safe, reversible JSON", () => {
  const unsafeProject = {
    ...project,
    title: '한글 "프로젝트" & <검토>',
    summary: '</script><script>alert("schema")</script>\n요약 & 확인',
    stack: ["<HTML>", "A&B"],
  };
  const structuredData = createProjectStructuredData(unsafeProject, site);
  const serialized = serializeStructuredData(structuredData);

  assert.equal(serialized.includes("<"), false);
  assert.equal(serialized.includes("\\u003c/script>"), true);
  assert.deepEqual(JSON.parse(serialized), structuredData);
});

test("preserves the existing landing ProfilePage through the shared serializer", () => {
  const profile = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: { "@type": "Person", name: "김용범" },
    url: site.href,
  };

  assert.deepEqual(JSON.parse(serializeStructuredData(profile)), profile);
});
