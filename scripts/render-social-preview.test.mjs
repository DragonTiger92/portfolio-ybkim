import { readFile } from "node:fs/promises";
import test from "node:test";

import { strict as assert } from "node:assert";

import {
  socialPreviewHeight,
  socialPreviewSourcePath,
  socialPreviewWidth,
  validateSocialPreviewMarkup,
} from "./render-social-preview.mjs";

test("keeps the simplified social-preview composition contract", async () => {
  const markup = await readFile(socialPreviewSourcePath, "utf8");

  assert.doesNotThrow(() => validateSocialPreviewMarkup(markup));
  assert.match(markup, new RegExp(`width="${socialPreviewWidth}"`, "u"));
  assert.match(markup, new RegExp(`height="${socialPreviewHeight}"`, "u"));
  assert.match(markup, /<circle id="brand-point" cx="104" cy="177" r="17" fill="#60a5fa" \/>/u);
  assert.match(markup, /gradientUnits="userSpaceOnUse"/u);
  assert.match(markup, />portfolio-ybkim<\/text>/u);
});

test("rejects redundant copy and underline decoration", () => {
  const redundantCopy =
    '<svg viewBox="0 0 1200 630"><linearGradient gradientUnits="userSpaceOnUse"/><g id="brand-mark"/><circle id="brand-point"/><text id="product-name">portfolio-ybkim</text><text>프로젝트 결과</text></svg>';
  const underline =
    '<svg viewBox="0 0 1200 630"><linearGradient gradientUnits="userSpaceOnUse"/><g id="brand-mark"/><circle id="brand-point"/><text id="product-name">portfolio-ybkim</text><line/></svg>';

  assert.throws(() => validateSocialPreviewMarkup(redundantCopy));
  assert.throws(() => validateSocialPreviewMarkup(underline));
});
