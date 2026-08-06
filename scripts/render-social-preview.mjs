import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

import { chromium } from "@playwright/test";

export const socialPreviewSourcePath = resolve("src/assets/brand/social-preview.svg");
export const socialPreviewOutputPath = resolve("public/assets/brand/social-preview.png");
export const socialPreviewWidth = 1200;
export const socialPreviewHeight = 630;

const removedCopyPattern = /(?:개발자 김용범의 포트폴리오|프로젝트 결과)/u;
const textElementPattern = /<text\b/gu;
const lineElementPattern = /<line(?:\s|\/?\s*>)/u;

function assertMarkupContract(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

export function validateSocialPreviewMarkup(markup) {
  assertMarkupContract(
    markup.includes(`viewBox="0 0 ${socialPreviewWidth} ${socialPreviewHeight}"`),
    "Social preview source must use the 1200 by 630 viewBox.",
  );
  assertMarkupContract(
    ['id="brand-mark"', 'id="brand-point"', 'id="product-name"'].every((marker) =>
      markup.includes(marker),
    ),
    "Social preview source must retain the brand mark, intersection point, and product name.",
  );
  assertMarkupContract(
    markup.includes('gradientUnits="userSpaceOnUse"'),
    "Social preview mark must retain the canonical user-space gradient.",
  );
  assertMarkupContract(
    (markup.match(textElementPattern) ?? []).length === 1,
    "Social preview source must contain only the product-name text element.",
  );
  assertMarkupContract(
    !removedCopyPattern.test(markup) && !lineElementPattern.test(markup),
    "Social preview source must not restore removed copy or an underline.",
  );
}

export async function renderSocialPreview({
  sourcePath = socialPreviewSourcePath,
  outputPath = socialPreviewOutputPath,
} = {}) {
  const markup = await readFile(sourcePath, "utf8");
  validateSocialPreviewMarkup(markup);

  const browser = await chromium.launch({ headless: true });

  try {
    const page = await browser.newPage({
      deviceScaleFactor: 2,
      viewport: { height: socialPreviewHeight, width: socialPreviewWidth },
    });

    await page.setContent(`<style>html,body{margin:0}</style>${markup}`);
    await page.locator("svg").screenshot({
      animations: "disabled",
      caret: "hide",
      path: outputPath,
      scale: "css",
    });
  } finally {
    await browser.close();
  }

  return outputPath;
}

async function run() {
  const outputPath = await renderSocialPreview();
  process.stdout.write(`Social preview rendered to ${outputPath}.\n`);
}

const invokedModuleUrl =
  process.argv[1] === undefined ? "" : pathToFileURL(resolve(process.argv[1])).href;

if (import.meta.url === invokedModuleUrl) {
  await run();
}
