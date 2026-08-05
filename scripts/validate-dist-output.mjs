import { execFile } from "node:child_process";
import { access, readFile } from "node:fs/promises";
import { extname, posix, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { promisify } from "node:util";

import { listArtifactFiles } from "./artifact-files.mjs";

const execFileAsync = promisify(execFile);
const referenceFileExtensions = new Set([".css", ".html", ".js", ".mjs", ".webmanifest"]);
const requiredPublicPaths = ["assets/resume/resume-ybkim.pdf"];

function uniqueSorted(values) {
  return [...new Set(values)].toSorted();
}

function normalizeReference(reference) {
  const path = reference.split(/[?#]/u, 1)[0];

  if (!path?.startsWith("/") || path.startsWith("//")) {
    return null;
  }

  const normalized = posix.normalize(path).replace(/^\/+/u, "");

  if (normalized.startsWith("../")) {
    return null;
  }

  return normalized;
}

export function extractRootReferences(contents) {
  const attributePattern = /(?:href|src)\s*=\s*["'](\/[^"'<>]*)["']/giu;
  const jsonPropertyPattern = /["'](?:href|src)["']\s*:\s*["'](\/[^"'<>]*)["']/giu;
  const cssUrlPattern = /url\(\s*["']?(\/[^)"'?#]+)[^)]*\)/giu;
  const astroAssetPattern = /(\/_astro\/[a-z0-9._~/-]+)/giu;
  const patterns = [attributePattern, jsonPropertyPattern, cssUrlPattern, astroAssetPattern];
  const references = patterns.flatMap((pattern) =>
    [...contents.matchAll(pattern)]
      .map((match) => normalizeReference(match[1]))
      .filter((reference) => reference !== null),
  );

  return uniqueSorted(references);
}

function referenceCandidates(reference) {
  if (reference === "" || reference.endsWith("/")) {
    return [`${reference}index.html`];
  }

  if (posix.extname(reference) === "") {
    return [reference, `${reference}/index.html`];
  }

  return [reference];
}

function resolveReference(reference, actualPaths) {
  return referenceCandidates(reference).find((candidate) => actualPaths.has(candidate));
}

function evaluateRootReference(reference, actualPaths) {
  const resolvedReference = resolveReference(reference, actualPaths);

  if (resolvedReference === undefined) {
    return {
      requiredPath: null,
      unresolvedReference: reference === "" ? "/" : `/${reference}`,
    };
  }

  return {
    requiredPath: resolvedReference.startsWith("_astro/") ? resolvedReference : null,
    unresolvedReference: null,
  };
}

export function evaluateDistOutput({
  actualPaths,
  expectedPublicPaths,
  expectedRoutePaths,
  rootReferences,
}) {
  const actual = new Set(actualPaths);
  const referenceResults = rootReferences.map((reference) =>
    evaluateRootReference(reference, actual),
  );
  const required = new Set([
    ...expectedPublicPaths,
    ...expectedRoutePaths,
    ...referenceResults.map(({ requiredPath }) => requiredPath).filter(Boolean),
  ]);
  const missing = [...required].filter((path) => !actual.has(path));
  const unresolvedReferences = referenceResults
    .map(({ unresolvedReference }) => unresolvedReference)
    .filter(Boolean);

  const unexpected = [...actual].filter((path) => !required.has(path));

  return {
    missing: uniqueSorted(missing),
    unexpected: uniqueSorted(unexpected),
    unresolvedReferences: uniqueSorted(unresolvedReferences),
  };
}

async function listTrackedPaths(pathspec) {
  const { stdout } = await execFileAsync("git", ["ls-files", "--", pathspec], {
    encoding: "utf8",
  });

  return stdout.split(/\r?\n/u).filter(Boolean);
}

async function collectExpectedPublicPaths() {
  const trackedPublicPaths = await listTrackedPaths("public");
  const normalizedTrackedPaths = trackedPublicPaths.map((path) => path.replace(/^public\//u, ""));
  const existingTrackedPaths = (
    await Promise.all(
      normalizedTrackedPaths.map(async (path) => ({
        exists: await access(resolve("public", path)).then(
          () => true,
          () => false,
        ),
        path,
      })),
    )
  )
    .filter(({ exists }) => exists)
    .map(({ path }) => path);

  return uniqueSorted([...existingTrackedPaths, ...requiredPublicPaths]);
}

async function collectExpectedRoutePaths() {
  const projectSources = await listTrackedPaths("src/content/projects");
  const projectRoutes = projectSources
    .filter((path) => extname(path) === ".md")
    .map((path) => `projects/${posix.basename(path, ".md")}/index.html`);

  return ["index.html", ...projectRoutes];
}

async function collectRootReferences(files) {
  const references = await Promise.all(
    files
      .filter((file) => referenceFileExtensions.has(extname(file.path)))
      .map(async (file) => extractRootReferences(await readFile(file.absolutePath, "utf8"))),
  );

  return uniqueSorted(references.flat());
}

function formatFailures(result) {
  return [
    ["Missing expected output", result.missing],
    ["Unexpected output", result.unexpected],
    ["Unresolved local reference", result.unresolvedReferences],
  ]
    .filter(([, entries]) => entries.length > 0)
    .map(([label, entries]) => `${label}:\n${entries.map((entry) => `- ${entry}`).join("\n")}`)
    .join("\n");
}

export async function validateDistOutput(buildDirectory = "dist") {
  const files = await listArtifactFiles(buildDirectory);
  const result = evaluateDistOutput({
    actualPaths: files.map((file) => file.path),
    expectedPublicPaths: await collectExpectedPublicPaths(),
    expectedRoutePaths: await collectExpectedRoutePaths(),
    rootReferences: await collectRootReferences(files),
  });
  const failures = formatFailures(result);

  if (failures !== "") {
    throw new Error(failures);
  }

  return files.length;
}

async function validateDistFromArguments(argumentsList) {
  const fileCount = await validateDistOutput(resolve(argumentsList[0] ?? "dist"));
  process.stdout.write(`Static output contract passed (${fileCount} files checked).\n`);
  return 0;
}

function reportDistValidationFailure(error) {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`Static output validation failed: ${message}\n`);
  return 1;
}

export async function run(argumentsList = process.argv.slice(2)) {
  return validateDistFromArguments(argumentsList).catch(reportDistValidationFailure);
}

const invokedModuleUrl =
  process.argv[1] === undefined ? "" : pathToFileURL(resolve(process.argv[1])).href;

if (import.meta.url === invokedModuleUrl) {
  process.exitCode = await run();
}
