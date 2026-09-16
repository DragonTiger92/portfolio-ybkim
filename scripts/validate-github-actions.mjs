import { readdir, readFile } from "node:fs/promises";
import { basename, relative, resolve, sep } from "node:path";
import { pathToFileURL } from "node:url";

const actionUsePattern =
  /^\s*(?:-\s*)?uses:\s*(?:"([^"]+)"|'([^']+)'|([^#\s]+))\s*(?:#\s*(\S+).*)?$/u;
const immutableShaPattern = /^[a-f\d]{40}$/iu;
const releaseVersionPattern = /^v\d+(?:\.\d+){0,2}(?:[-+][\dA-Za-z.-]+)?$/u;

function normalizePath(filePath, rootDirectory) {
  return relative(rootDirectory, filePath).split(sep).join("/");
}

function parseActionUse(line) {
  const match = line.match(actionUsePattern);

  if (match === null) {
    return null;
  }

  return {
    target: match[1] ?? match[2] ?? match[3],
    version: match[4],
  };
}

function isLocalOrContainerUse(target) {
  return target.startsWith("./") || target.startsWith("docker://");
}

function validateImmutableRef(candidate, errors) {
  if (immutableShaPattern.test(candidate.ref)) {
    return true;
  }

  errors.push(
    `${candidate.location}: ${candidate.actionPath} must be pinned to a 40-character commit SHA.`,
  );
  return false;
}

function validateReleaseVersion(candidate, errors) {
  if (releaseVersionPattern.test(candidate.version ?? "")) {
    return true;
  }

  errors.push(
    `${candidate.location}: ${candidate.actionPath} must include a same-line release comment such as # v1.`,
  );
  return false;
}

function parseExternalAction(actionUse, location, errors) {
  if (isLocalOrContainerUse(actionUse.target)) {
    return null;
  }

  const separatorIndex = actionUse.target.lastIndexOf("@");
  const actionPath = actionUse.target.slice(0, separatorIndex);
  const actionSegments = actionPath.split("/");

  if (separatorIndex <= 0 || actionSegments.length < 2) {
    errors.push(`${location}: external uses must use owner/repository@ref syntax.`);
    return null;
  }

  const ref = actionUse.target.slice(separatorIndex + 1);
  const identity = actionSegments.slice(0, 2).join("/").toLowerCase();
  const candidate = { actionPath, identity, location, ref, version: actionUse.version };
  const hasImmutableRef = validateImmutableRef(candidate, errors);
  const hasReleaseVersion = validateReleaseVersion(candidate, errors);

  if (!hasImmutableRef || !hasReleaseVersion) {
    return null;
  }

  return { identity, ref: ref.toLowerCase(), version: actionUse.version };
}

function reportConsistency(action, location, validation) {
  const existing = validation.indexedActions.get(action.identity);

  if (existing === undefined) {
    validation.indexedActions.set(action.identity, { ...action, location });
    return;
  }

  if (existing.ref === action.ref && existing.version === action.version) {
    return;
  }

  validation.errors.push(
    `${location}: ${action.identity} uses ${action.ref} (${action.version}), but ${existing.location} uses ${existing.ref} (${existing.version}).`,
  );
}

export function validateGitHubActionSources(sources) {
  const errors = [];
  const indexedActions = new Map();
  const validation = { errors, indexedActions };

  for (const source of sources) {
    const lines = source.content.split(/\r?\n/u);

    lines.forEach((line, index) => {
      const actionUse = parseActionUse(line);

      if (actionUse === null) {
        return;
      }

      const location = `${source.path}:${index + 1}`;
      const action = parseExternalAction(actionUse, location, errors);

      if (action !== null) {
        reportConsistency(action, location, validation);
      }
    });
  }

  return errors;
}

async function collectFiles(directory, matches) {
  const entries = await readdir(directory, { withFileTypes: true }).catch((error) => {
    if (error.code === "ENOENT") {
      return [];
    }

    throw error;
  });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = resolve(directory, entry.name);

      if (entry.isDirectory()) {
        return collectFiles(entryPath, matches);
      }

      return entry.isFile() && matches(entryPath) ? [entryPath] : [];
    }),
  );

  return files.flat();
}

export async function readGitHubActionSources(rootDirectory = process.cwd()) {
  const workflowsDirectory = resolve(rootDirectory, ".github/workflows");
  const actionsDirectory = resolve(rootDirectory, ".github/actions");
  const workflowFiles = await collectFiles(workflowsDirectory, (filePath) =>
    /\.ya?ml$/iu.test(filePath),
  );
  const actionFiles = await collectFiles(actionsDirectory, (filePath) =>
    /^action\.ya?ml$/iu.test(basename(filePath)),
  );
  const filePaths = [...workflowFiles, ...actionFiles].sort();

  return Promise.all(
    filePaths.map(async (filePath) => ({
      path: normalizePath(filePath, rootDirectory),
      content: await readFile(filePath, "utf8"),
    })),
  );
}

async function run() {
  const sources = await readGitHubActionSources();
  const errors = validateGitHubActionSources(sources);

  if (errors.length === 0) {
    process.stdout.write(
      `GitHub Action pin validation passed (${sources.length} files checked).\n`,
    );
    return 0;
  }

  process.stderr.write(`${errors.map((error) => `- ${error}`).join("\n")}\n`);
  return 1;
}

function reportFailure(error) {
  process.stderr.write(`${error.stack ?? error.message}\n`);
  return 1;
}

const invokedModuleUrl =
  process.argv[1] === undefined ? "" : pathToFileURL(resolve(process.argv[1])).href;

if (import.meta.url === invokedModuleUrl) {
  process.exitCode = await run().catch(reportFailure);
}
