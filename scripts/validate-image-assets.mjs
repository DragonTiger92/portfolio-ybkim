import { readFile } from "node:fs/promises";
import { extname, resolve } from "node:path";
import { pathToFileURL } from "node:url";

import { listArtifactFiles } from "./artifact-files.mjs";
import { findSvgRootAttributes } from "./svg-root-parser.mjs";

const kibibyte = 1024;
const pngSignature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const supportedExtensions = new Set([".ico", ".png", ".svg"]);
const imageLikeExtensions = new Set([
  ".apng",
  ".avif",
  ".bmp",
  ".cur",
  ".gif",
  ".heic",
  ".heif",
  ".ico",
  ".jpeg",
  ".jpg",
  ".jxl",
  ".png",
  ".psd",
  ".svg",
  ".svgz",
  ".tif",
  ".tiff",
  ".webp",
]);
const symbolPattern = /<symbol\b([^>]*)>/gu;
const viewBoxPattern = /(?:^|\s)viewBox\s*=\s*(["'])(.*?)\1/su;

export const imageAssetBudget = Object.freeze({
  maxFileBytes: 64 * kibibyte,
  maxTotalBytes: 256 * kibibyte,
  socialPreviewHeight: 630,
  socialPreviewPath: "assets/brand/social-preview.png",
  socialPreviewWidth: 1200,
});

function assertBufferLength(contents, minimumBytes, label) {
  if (contents.byteLength < minimumBytes) {
    throw new Error(`${label} is truncated.`);
  }
}

export function parsePngDimensions(contents, path = "PNG image") {
  assertBufferLength(contents, 33, path);

  if (!contents.subarray(0, pngSignature.byteLength).equals(pngSignature)) {
    throw new Error(`${path} does not have a PNG signature.`);
  }

  if (contents.readUInt32BE(8) !== 13 || contents.toString("ascii", 12, 16) !== "IHDR") {
    throw new Error(`${path} does not start with a valid PNG IHDR chunk.`);
  }

  const width = contents.readUInt32BE(16);
  const height = contents.readUInt32BE(20);

  if (width === 0 || height === 0) {
    throw new Error(`${path} must declare positive PNG dimensions.`);
  }

  return { height, width };
}

function parseIcoEntry(contents, { directoryEnd, index, path }) {
  const entryOffset = 6 + index * 16;
  const width = contents[entryOffset] || 256;
  const height = contents[entryOffset + 1] || 256;
  const imageBytes = contents.readUInt32LE(entryOffset + 8);
  const imageOffset = contents.readUInt32LE(entryOffset + 12);

  if (imageBytes === 0) {
    throw new Error(`${path} ICO entry ${index + 1} has no image data.`);
  }

  if (imageOffset < directoryEnd || imageOffset + imageBytes > contents.byteLength) {
    throw new Error(`${path} ICO entry ${index + 1} points outside the file.`);
  }

  return { height, width };
}

export function parseIcoDimensions(contents, path = "ICO image") {
  assertBufferLength(contents, 6, path);

  if (contents.readUInt16LE(0) !== 0 || contents.readUInt16LE(2) !== 1) {
    throw new Error(`${path} does not have a valid ICO header.`);
  }

  const imageCount = contents.readUInt16LE(4);

  if (imageCount === 0) {
    throw new Error(`${path} must contain at least one ICO directory entry.`);
  }

  const directoryEnd = 6 + imageCount * 16;
  assertBufferLength(contents, directoryEnd, `${path} ICO directory`);

  return Array.from({ length: imageCount }, (_, index) =>
    parseIcoEntry(contents, { directoryEnd, index, path }),
  );
}

function parseViewBox(attributes, label) {
  const match = attributes.match(viewBoxPattern);

  if (!match) {
    throw new Error(`${label} must declare a viewBox.`);
  }

  const values = match[2]
    .trim()
    .split(/[\s,]+/u)
    .map(Number);

  if (values.length !== 4 || !values.every(Number.isFinite)) {
    throw new Error(`${label} has an invalid viewBox.`);
  }

  if (values[2] <= 0 || values[3] <= 0) {
    throw new Error(`${label} viewBox width and height must be positive.`);
  }

  return values;
}

function parseSymbolViewBoxes(markup, path) {
  const symbols = [...markup.matchAll(symbolPattern)];

  if (symbols.length === 0) {
    throw new Error(`${path} must contain at least one SVG symbol.`);
  }

  return symbols.map((match, index) => parseViewBox(match[1], `${path} symbol ${index + 1}`));
}

export function validateSvgMarkup(markup, path = "SVG image") {
  const rootAttributes = findSvgRootAttributes(markup);

  if (rootAttributes === null) {
    throw new Error(`${path} must have an SVG root element.`);
  }

  if (path === "icons.svg") {
    return { symbolViewBoxes: parseSymbolViewBoxes(markup, path) };
  }

  return { viewBox: parseViewBox(rootAttributes, `${path} SVG root`) };
}

function assertFileBudget(path, bytes) {
  if (bytes > imageAssetBudget.maxFileBytes) {
    throw new Error(`${path} exceeds the 64 KiB image limit (${bytes} bytes).`);
  }
}

function inspectSupportedImage(extension, contents, path) {
  if (extension === ".png") {
    return parsePngDimensions(contents, path);
  }

  if (extension === ".ico") {
    return { images: parseIcoDimensions(contents, path) };
  }

  return validateSvgMarkup(contents.toString("utf8"), path);
}

async function inspectPublicFile(file) {
  const extension = extname(file.path).toLowerCase();

  if (!imageLikeExtensions.has(extension)) {
    return null;
  }

  if (!supportedExtensions.has(extension)) {
    throw new Error(`${file.path} uses unsupported image extension ${extension}.`);
  }

  const contents = await readFile(file.absolutePath);
  assertFileBudget(file.path, contents.byteLength);

  return {
    bytes: contents.byteLength,
    details: inspectSupportedImage(extension, contents, file.path),
    extension,
    path: file.path,
  };
}

function assertSocialPreviewContract(assets) {
  const socialPreview = assets.find(({ path }) => path === imageAssetBudget.socialPreviewPath);

  if (!socialPreview) {
    return;
  }

  const { height, width } = socialPreview.details;

  if (
    width !== imageAssetBudget.socialPreviewWidth ||
    height !== imageAssetBudget.socialPreviewHeight
  ) {
    throw new Error("assets/brand/social-preview.png must be exactly 1200x630 pixels.");
  }
}

export async function validateImageAssets(publicDirectory = resolve("public")) {
  const files = await listArtifactFiles(publicDirectory);
  const assets = (await Promise.all(files.map(inspectPublicFile))).filter(Boolean);
  const totalBytes = assets.reduce((total, asset) => total + asset.bytes, 0);

  if (totalBytes > imageAssetBudget.maxTotalBytes) {
    throw new Error(`Public images exceed the 256 KiB aggregate limit (${totalBytes} bytes).`);
  }

  assertSocialPreviewContract(assets);

  return { assets, totalBytes };
}

function reportValidationFailure(error) {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`Image asset validation failed: ${message}\n`);
  return 1;
}

async function validateFromArguments(argumentsList) {
  const { assets, totalBytes } = await validateImageAssets(resolve(argumentsList[0] ?? "public"));
  process.stdout.write(
    `Image asset contract passed (${assets.length} files, ${totalBytes} bytes).\n`,
  );
  return 0;
}

export async function run(argumentsList = process.argv.slice(2)) {
  return validateFromArguments(argumentsList).catch(reportValidationFailure);
}

const invokedModuleUrl =
  process.argv[1] === undefined ? "" : pathToFileURL(resolve(process.argv[1])).href;

if (import.meta.url === invokedModuleUrl) {
  process.exitCode = await run();
}
