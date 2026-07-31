import assert from "node:assert/strict";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { describe, it } from "node:test";

import {
  imageAssetBudget,
  parseIcoDimensions,
  parsePngDimensions,
  validateImageAssets,
  validateSvgMarkup,
} from "./validate-image-assets.mjs";

function createPng(width, height, bytes = 33) {
  const contents = Buffer.alloc(bytes);
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]).copy(contents);
  contents.writeUInt32BE(13, 8);
  contents.write("IHDR", 12, "ascii");
  contents.writeUInt32BE(width, 16);
  contents.writeUInt32BE(height, 20);
  return contents;
}

function createIco(width, height) {
  const contents = Buffer.alloc(23);
  contents.writeUInt16LE(1, 2);
  contents.writeUInt16LE(1, 4);
  contents[6] = width === 256 ? 0 : width;
  contents[7] = height === 256 ? 0 : height;
  contents.writeUInt32LE(1, 14);
  contents.writeUInt32LE(22, 18);
  return contents;
}

async function withFixture(run) {
  const directory = await mkdtemp(join(tmpdir(), "portfolio-images-"));

  try {
    await run(directory);
  } finally {
    await rm(directory, { force: true, recursive: true });
  }
}

describe("PNG validation", () => {
  it("reads IHDR dimensions and rejects invalid signatures or dimensions", () => {
    assert.deepEqual(parsePngDimensions(createPng(1200, 630)), { height: 630, width: 1200 });
    assert.throws(() => parsePngDimensions(Buffer.alloc(33)), /PNG signature/u);
    assert.throws(() => parsePngDimensions(createPng(0, 630)), /positive PNG dimensions/u);
  });
});

describe("ICO validation", () => {
  it("reads directory dimensions, including the ICO 256-pixel sentinel", () => {
    assert.deepEqual(parseIcoDimensions(createIco(256, 256)), [{ height: 256, width: 256 }]);
  });

  it("rejects invalid headers and out-of-file directory entries", () => {
    assert.throws(() => parseIcoDimensions(Buffer.alloc(6)), /valid ICO header/u);
    const invalidOffset = createIco(16, 16);
    invalidOffset.writeUInt32LE(24, 18);
    assert.throws(() => parseIcoDimensions(invalidOffset), /outside the file/u);
  });
});

describe("SVG validation", () => {
  it("requires a positive root viewBox for ordinary SVG files", () => {
    assert.deepEqual(validateSvgMarkup('<svg viewBox="0 0 24 24"></svg>', "logo.svg"), {
      viewBox: [0, 0, 24, 24],
    });
    assert.throws(() => validateSvgMarkup("<svg></svg>", "logo.svg"), /must declare a viewBox/u);
    assert.throws(
      () => validateSvgMarkup('<svg viewBox="0 0 0 24"></svg>', "logo.svg"),
      /width and height must be positive/u,
    );
  });

  it("parses many leading comments without regular-expression backtracking", () => {
    const comments = "<!--safe-->".repeat(4096);
    const markup = `\uFEFF<?xml version="1.0"?>\n${comments}<svg viewBox="0 0 24 24"></svg>`;

    assert.deepEqual(validateSvgMarkup(markup, "commented-logo.svg"), {
      viewBox: [0, 0, 24, 24],
    });
    assert.throws(
      () => validateSvgMarkup("<!--unterminated<svg></svg>", "invalid.svg"),
      /must have an SVG root element/u,
    );
  });

  it("requires every symbol in icons.svg to declare a viewBox", () => {
    const validSprite = [
      "<svg>",
      '<symbol id="first" viewBox="0 0 16 16"></symbol>',
      '<symbol id="second" viewBox="0 0 24 24"></symbol>',
      "</svg>",
    ].join("");
    const invalidSprite = '<svg><symbol id="missing"></symbol></svg>';

    assert.equal(validateSvgMarkup(validSprite, "icons.svg").symbolViewBoxes.length, 2);
    assert.throws(
      () => validateSvgMarkup(invalidSprite, "icons.svg"),
      /symbol 1 must declare a viewBox/u,
    );
  });
});

describe("public image inventory", () => {
  it("accepts the checked-in public image inventory", async () => {
    const result = await validateImageAssets(resolve("public"));

    assert.ok(result.assets.length > 0);
    assert.ok(result.totalBytes <= imageAssetBudget.maxTotalBytes);
  });

  it("rejects unsupported image-like extensions", async () => {
    await withFixture(async (directory) => {
      await writeFile(join(directory, "photo.webp"), Buffer.alloc(1));
      await assert.rejects(validateImageAssets(directory), /unsupported image extension \.webp/u);
    });
  });

  it("enforces per-file and aggregate image budgets", async () => {
    await withFixture(async (directory) => {
      await writeFile(
        join(directory, "oversized.png"),
        createPng(1, 1, imageAssetBudget.maxFileBytes + 1),
      );
      await assert.rejects(validateImageAssets(directory), /exceeds the 64 KiB image limit/u);
    });

    await withFixture(async (directory) => {
      await Promise.all(
        Array.from({ length: 5 }, (_, index) =>
          writeFile(join(directory, `${index}.png`), createPng(1, 1, 60 * 1024)),
        ),
      );
      await assert.rejects(validateImageAssets(directory), /256 KiB aggregate limit/u);
    });
  });

  it("enforces the optional social preview dimensions", async () => {
    await withFixture(async (directory) => {
      const brandDirectory = join(directory, "assets", "brand");
      await mkdir(brandDirectory, { recursive: true });
      await writeFile(join(brandDirectory, "social-preview.png"), createPng(1200, 600));
      await assert.rejects(validateImageAssets(directory), /exactly 1200x630 pixels/u);
    });
  });
});
