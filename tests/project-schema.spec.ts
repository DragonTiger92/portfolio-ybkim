import type { ProjectStructuredData } from "../src/data/structured-data";
import { expect, test, type Page } from "./helpers/browser";

async function expectProjectSchema(page: Page, projectUrl: string): Promise<void> {
  const projectPath = new URL(projectUrl).pathname;
  await page.goto(projectPath);

  const scripts = page.locator('script[type="application/ld+json"]');
  await expect(scripts).toHaveCount(1);
  const structuredDataText = await scripts.textContent();

  if (structuredDataText === null) {
    throw new Error(`Expected project structured data for ${projectPath}.`);
  }

  const structuredData = JSON.parse(structuredDataText) as ProjectStructuredData;
  expect(structuredData["@context"]).toBe("https://schema.org");
  expect(structuredData["@graph"]).toHaveLength(3);
  const [webPage, work, breadcrumb] = structuredData["@graph"];
  const title = await page.locator("h1").innerText();
  const summary = await page.locator(".project-summary").innerText();
  const stack = await page.locator(".project-stack .tag-list li").allTextContents();
  const canonicalUrl = await page.locator('link[rel="canonical"]').getAttribute("href");
  const breadcrumbLabel = await page.locator(".breadcrumb a").innerText();
  const breadcrumbPath = await page.locator(".breadcrumb a").getAttribute("href");

  expect(canonicalUrl).toBe(projectUrl);
  expect(webPage).toEqual({
    "@id": `${projectUrl}#webpage`,
    "@type": "WebPage",
    name: title,
    description: summary,
    url: projectUrl,
    inLanguage: "ko",
    mainEntity: { "@id": `${projectUrl}#project` },
    breadcrumb: { "@id": `${projectUrl}#breadcrumb` },
  });
  expect(work).toEqual({
    "@id": `${projectUrl}#project`,
    "@type": "CreativeWork",
    name: title,
    description: summary,
    url: projectUrl,
    inLanguage: "ko",
    ...(stack.length > 0 ? { keywords: stack } : {}),
    mainEntityOfPage: { "@id": webPage["@id"] },
  });
  expect(breadcrumbPath).toBe("/#projects");
  expect(breadcrumb).toEqual({
    "@id": `${projectUrl}#breadcrumb`,
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: breadcrumbLabel,
        item: new URL(breadcrumbPath ?? "", projectUrl).href,
      },
      { "@type": "ListItem", position: 2, name: title, item: projectUrl },
    ],
  });
  await expect(page.locator('.breadcrumb [aria-current="page"]')).toHaveText(title);
}

test("publishes content-matching schema on every project detail in the sitemap", async ({
  page,
  request,
}) => {
  const sitemapResponse = await request.get("/sitemap.xml");
  expect(sitemapResponse.ok()).toBe(true);
  const sitemapBody = await sitemapResponse.text();
  const projectUrls = [...sitemapBody.matchAll(/<loc>(.*?)<\/loc>/gu)]
    .map((match) => match[1])
    .filter((url) => new URL(url).pathname.startsWith("/projects/"));

  expect(projectUrls.length).toBeGreaterThan(0);

  for (const projectUrl of projectUrls) {
    await test.step(projectUrl, () => expectProjectSchema(page, projectUrl));
  }
});
