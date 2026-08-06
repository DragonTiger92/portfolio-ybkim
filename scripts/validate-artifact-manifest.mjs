import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

import { assertFullRevision, buildArtifactManifest } from "./create-artifact-manifest.mjs";

export async function validateArtifactManifest({ buildDirectory, manifestPath, revision }) {
  assertFullRevision(revision);

  const savedManifest = JSON.parse(await readFile(manifestPath, "utf8"));
  const actualManifest = await buildArtifactManifest({ buildDirectory, revision });

  assert.deepEqual(
    savedManifest,
    actualManifest,
    "Downloaded artifact contents do not match the exact-revision manifest.",
  );

  return actualManifest;
}

function readOption(argumentsList, option) {
  const optionIndex = argumentsList.indexOf(option);

  return optionIndex === -1 ? undefined : argumentsList[optionIndex + 1];
}

function requireOption(argumentsList, option) {
  const value = readOption(argumentsList, option);

  if (value === undefined || value === "") {
    throw new Error(`Missing required option ${option}.`);
  }

  return value;
}

async function execute(argumentsList) {
  const manifest = await validateArtifactManifest({
    buildDirectory: resolve(readOption(argumentsList, "--build-dir") ?? "dist"),
    manifestPath: resolve(
      readOption(argumentsList, "--manifest") ?? "tmp/delivery/site-artifact-manifest.json",
    ),
    revision: requireOption(argumentsList, "--revision"),
  });

  process.stdout.write(
    `Artifact manifest validated for ${manifest.revision} (${manifest.artifact.fileCount} files).\n`,
  );
  return 0;
}

function reportFailure(error) {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`Artifact manifest validation failed: ${message}\n`);
  return 1;
}

export async function run(argumentsList = process.argv.slice(2)) {
  return execute(argumentsList).catch(reportFailure);
}

const invokedModuleUrl =
  process.argv[1] === undefined ? "" : pathToFileURL(resolve(process.argv[1])).href;

if (import.meta.url === invokedModuleUrl) {
  process.exitCode = await run();
}
