import { createHash } from "node:crypto";
import { execFile } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, isAbsolute, relative, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { promisify } from "node:util";

import { inspectArtifactFile, listArtifactFiles } from "./artifact-files.mjs";

const execFileAsync = promisify(execFile);
const fullRevisionPattern = /^[0-9a-f]{40}$/u;

export function assertFullRevision(revision) {
  if (!fullRevisionPattern.test(revision)) {
    throw new Error("Artifact revision must be a full lowercase 40-character Git SHA.");
  }
}

export function createTreeDigest(files) {
  return createHash("sha256").update(JSON.stringify(files)).digest("hex");
}

export async function buildArtifactManifest({ buildDirectory = "dist", revision }) {
  assertFullRevision(revision);

  const files = await Promise.all(
    (await listArtifactFiles(buildDirectory)).map(inspectArtifactFile),
  );

  return {
    schemaVersion: 1,
    revision,
    artifact: {
      algorithm: "sha256",
      treeDigest: createTreeDigest(files),
      fileCount: files.length,
      totalBytes: files.reduce((total, file) => total + file.bytes, 0),
      files,
    },
  };
}

async function getGitOutput(argumentsList) {
  const { stdout } = await execFileAsync("git", argumentsList, { encoding: "utf8" });

  return stdout.trim();
}

export async function assertExactGitRevision(revision) {
  assertFullRevision(revision);

  const headRevision = await getGitOutput(["rev-parse", "HEAD"]);

  if (headRevision !== revision) {
    throw new Error(
      `Requested revision ${revision} does not match checked out HEAD ${headRevision}.`,
    );
  }

  const trackedChanges = await getGitOutput(["status", "--porcelain=v1", "--untracked-files=no"]);

  if (trackedChanges !== "") {
    throw new Error("Tracked working-tree changes prevent an exact-revision artifact claim.");
  }
}

function readOption(argumentsList, option) {
  const optionIndex = argumentsList.indexOf(option);

  return optionIndex === -1 ? undefined : argumentsList[optionIndex + 1];
}

function assertOutputOutsideBuild(buildDirectory, outputPath) {
  const outputRelativePath = relative(buildDirectory, outputPath);

  if (
    outputRelativePath === "" ||
    (!outputRelativePath.startsWith("..") && !isAbsolute(outputRelativePath))
  ) {
    throw new Error("Artifact manifest output must be outside the build directory.");
  }
}

export async function createArtifactManifest({
  buildDirectory = resolve("dist"),
  outputPath = resolve("tmp/delivery/site-artifact-manifest.json"),
  revision,
}) {
  await assertExactGitRevision(revision);
  assertOutputOutsideBuild(buildDirectory, outputPath);

  const manifest = await buildArtifactManifest({ buildDirectory, revision });

  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");

  return manifest;
}

async function createManifestFromArguments(argumentsList) {
  const revision =
    readOption(argumentsList, "--revision") ?? (await getGitOutput(["rev-parse", "HEAD"]));
  const buildDirectory = resolve(readOption(argumentsList, "--build-dir") ?? "dist");
  const outputPath = resolve(
    readOption(argumentsList, "--output") ?? "tmp/delivery/site-artifact-manifest.json",
  );
  const manifest = await createArtifactManifest({ buildDirectory, outputPath, revision });

  process.stdout.write(
    `Artifact manifest created for ${manifest.revision} (${manifest.artifact.fileCount} files, ${manifest.artifact.treeDigest}).\n`,
  );
  return 0;
}

function reportManifestCreationFailure(error) {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`Artifact manifest creation failed: ${message}\n`);
  return 1;
}

export async function run(argumentsList = process.argv.slice(2)) {
  return createManifestFromArguments(argumentsList).catch(reportManifestCreationFailure);
}

const invokedModuleUrl =
  process.argv[1] === undefined ? "" : pathToFileURL(resolve(process.argv[1])).href;

if (import.meta.url === invokedModuleUrl) {
  process.exitCode = await run();
}
