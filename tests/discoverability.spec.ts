import { expect, test, type Page } from "@playwright/test";

const productionOrigin = "https://portfolio-ybkim.pages.dev";
const socialPreviewUrl = `${productionOrigin}/assets/brand/social-preview.png`;
const socialPreviewAlt = "portfolio-ybkim - 개발자 김용범의 포트폴리오";

const indexablePages = [
  {
    description:
      "프론트엔드 구현을 중심으로 프로젝트 결과, 기술 의사결정, 문서화와 자동 검증 과정을 함께 보여주는 웹 개발자 김용범의 포트폴리오입니다.",
    route: "/",
    title: "개발자 김용범의 포트폴리오",
  },
  {
    description:
      "Astro 정적 사이트 구조, 문서 기반 기획, 아키텍처 결정 기록, 제품 백로그와 품질 검증 절차를 함께 살펴볼 수 있는 포트폴리오 제품입니다.",
    route: "/projects/portfolio-ybkim/",
    title: "portfolio-ybkim | 개발자 김용범의 포트폴리오",
  },
  {
    description:
      "Vanilla JavaScript 팀 프로젝트에서 상품 목록·상세 UI, 의미 있는 HTML 구조, CSS 변수 기반 스타일링을 구현한 초기 프론트엔드 실습입니다.",
    route: "/projects/karly/",
    title: "Karly | 개발자 김용범의 포트폴리오",
  },
  {
    description:
      "독서 기록 SPA 팀 리드로 일정과 협업을 조율하고 데이터 사전 로딩·조회 흐름, Storybook 지원 도구, 접근성 도우미를 구현했습니다.",
    route: "/projects/book-kong/",
    title: "Book-Kong | 개발자 김용범의 포트폴리오",
  },
] as const;

async function expectPageMetadata(
  page: Page,
  expected: (typeof indexablePages)[number],
): Promise<void> {
  const canonicalUrl = `${productionOrigin}${expected.route}`;

  await expect(page).toHaveTitle(expected.title);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    "content",
    expected.description,
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", canonicalUrl);
  await expect(page.locator('meta[property="og:type"]')).toHaveAttribute("content", "website");
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
    "content",
    expected.title,
  );
  await expect(page.locator('meta[property="og:description"]')).toHaveAttribute(
    "content",
    expected.description,
  );
  await expect(page.locator('meta[property="og:site_name"]')).toHaveAttribute(
    "content",
    "개발자 김용범의 포트폴리오",
  );
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute("content", canonicalUrl);
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    "content",
    socialPreviewUrl,
  );
  await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute("content", "1200");
  await expect(page.locator('meta[property="og:image:height"]')).toHaveAttribute("content", "630");
  await expect(page.locator('meta[property="og:image:alt"]')).toHaveAttribute(
    "content",
    socialPreviewAlt,
  );
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
    "content",
    "summary_large_image",
  );
  await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute(
    "content",
    expected.title,
  );
  await expect(page.locator('meta[name="twitter:description"]')).toHaveAttribute(
    "content",
    expected.description,
  );
  await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute(
    "content",
    socialPreviewUrl,
  );
  await expect(page.locator('meta[name="twitter:image:alt"]')).toHaveAttribute(
    "content",
    socialPreviewAlt,
  );
}

for (const indexablePage of indexablePages) {
  test(`publishes accurate discovery metadata for ${indexablePage.route}`, async ({ page }) => {
    await page.goto(indexablePage.route);
    await expectPageMetadata(page, indexablePage);
  });
}

test("publishes public-safe ProfilePage structured data on the landing page", async ({ page }) => {
  await page.goto("/");

  const structuredDataText = await page.locator('script[type="application/ld+json"]').textContent();

  if (structuredDataText === null) {
    throw new Error("Expected landing page structured data.");
  }

  const structuredData: unknown = JSON.parse(structuredDataText);

  expect(structuredData).toMatchObject({
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: {
      "@type": "Person",
      jobTitle: "웹 개발자",
      name: "김용범",
      sameAs: ["https://github.com/DragonTiger92"],
      url: `${productionOrigin}/`,
    },
    name: "개발자 김용범의 포트폴리오",
    url: `${productionOrigin}/`,
  });
});

test("publishes a minimal robots contract and public sitemap", async ({ request }) => {
  const robotsResponse = await request.get("/robots.txt");
  const sitemapResponse = await request.get("/sitemap.xml");

  expect(robotsResponse.ok()).toBe(true);
  expect(robotsResponse.headers()["content-type"]).toContain("text/plain");
  expect(await robotsResponse.text()).toBe(
    `User-agent: *\nAllow: /\nSitemap: ${productionOrigin}/sitemap.xml\n`,
  );

  expect(sitemapResponse.ok()).toBe(true);
  expect(sitemapResponse.headers()["content-type"]).toMatch(/^(?:application|text)\/xml\b/u);

  const sitemapBody = await sitemapResponse.text();
  const sitemapUrls = [...sitemapBody.matchAll(/<loc>(.*?)<\/loc>/gu)].map((match) => match[1]);
  const expectedUrls = indexablePages.map(({ route }) => `${productionOrigin}${route}`).sort();

  expect(sitemapUrls.sort()).toEqual(expectedUrls);
  expect(sitemapBody).not.toMatch(/(?:@|\.contexts|tmp\/|[A-Za-z]:\\)/u);
  expect(sitemapBody).not.toContain("<lastmod>");
  expect(sitemapBody).not.toContain("<changefreq>");
  expect(sitemapBody).not.toContain("<priority>");
});
