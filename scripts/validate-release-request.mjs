import { execFile } from "node:child_process";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { promisify } from "node:util";

import { assertFullRevision } from "./create-artifact-manifest.mjs";

const execFileAsync = promisify(execFile);
const versionPattern = /^(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)$/u;

export function validateReleaseRequest({
  existingTagRevision,
  isMainAncestor,
  packageVersion,
  retryExistingTag,
  revision,
  version,
}) {
  assertFullRevision(revision);
  assertReleaseVersion({ packageVersion, version });
  assertMainRevision(isMainAncestor);

  const tag = `v${version}`;
  assertTagState({ existingTagRevision, retryExistingTag, revision });

  return { tag, tagExists: existingTagRevision !== undefined };
}

function assertReleaseVersion({ packageVersion, version }) {
  if (!versionPattern.test(version)) {
    throw new Error("Release version must use X.Y.Z without a leading v.");
  }

  if (packageVersion !== version) {
    throw new Error("Release version must equal package.json version at the requested revision.");
  }
}

function assertMainRevision(isMainAncestor) {
  if (!isMainAncestor) {
    throw new Error("Release revision must be contained in origin/main.");
  }
}

function assertTagState({ existingTagRevision, retryExistingTag, revision }) {
  if (existingTagRevision === undefined && retryExistingTag) {
    throw new Error("Existing-tag retry was requested, but the release tag does not exist.");
  }

  if (existingTagRevision !== undefined && existingTagRevision !== revision) {
    throw new Error("Existing release tag points to a different revision and is immutable.");
  }

  if (existingTagRevision !== undefined && !retryExistingTag) {
    throw new Error("Release tag already exists; use the explicit idempotent retry path.");
  }
}

async function getGitOutput(argumentsList) {
  const { stdout } = await execFileAsync("git", argumentsList, { encoding: "utf8" });

  return stdout.trim();
}

async function readTagRevision(tag) {
  return await getGitOutput(["rev-parse", "--verify", `refs/tags/${tag}^{commit}`]).catch(
    handleMissingTag,
  );
}

function handleMissingTag(error) {
  if (error?.code === 128) {
    return undefined;
  }

  throw error;
}

function isAncestorOfMain(revision) {
  return execFileAsync("git", ["merge-base", "--is-ancestor", revision, "origin/main"])
    .then(() => true)
    .catch(handleNonAncestor);
}

function handleNonAncestor(error) {
  if (error?.code === 1) {
    return false;
  }

  throw error;
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
  const revision = requireOption(argumentsList, "--revision");
  const version = requireOption(argumentsList, "--version");
  const packageJson = JSON.parse(await getGitOutput(["show", `${revision}:package.json`]));
  const validation = validateReleaseRequest({
    existingTagRevision: await readTagRevision(`v${version}`),
    isMainAncestor: await isAncestorOfMain(revision),
    packageVersion: packageJson.version,
    retryExistingTag: argumentsList.includes("--retry-existing-tag"),
    revision,
    version,
  });

  process.stdout.write(`tag=${validation.tag}\ntag-exists=${validation.tagExists}\n`);
  return 0;
}

function reportFailure(error) {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`Release request validation failed: ${message}\n`);
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
