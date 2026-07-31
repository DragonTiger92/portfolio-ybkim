import { createHash } from "node:crypto";
import { readFile, readdir } from "node:fs/promises";
import { relative, resolve, sep } from "node:path";

function toPosixPath(path) {
  return path.split(sep).join("/");
}

export function assertSupportedEntry(entry, entryPath) {
  if (entry.isSymbolicLink()) {
    throw new Error(`Symbolic links are not allowed in site artifacts: ${entryPath}`);
  }

  if (!entry.isDirectory() && !entry.isFile()) {
    throw new Error(`Unsupported artifact entry type: ${entryPath}`);
  }
}

async function walkArtifactDirectory(rootDirectory, currentDirectory) {
  const entries = await readdir(currentDirectory, { withFileTypes: true });
  const files = [];

  for (const entry of entries.toSorted((left, right) => left.name.localeCompare(right.name))) {
    files.push(...(await collectArtifactEntry(rootDirectory, currentDirectory, entry)));
  }

  return files;
}

async function collectArtifactEntry(rootDirectory, currentDirectory, entry) {
  const entryPath = resolve(currentDirectory, entry.name);
  const artifactPath = toPosixPath(relative(rootDirectory, entryPath));

  assertSupportedEntry(entry, artifactPath);

  if (entry.isDirectory()) {
    return walkArtifactDirectory(rootDirectory, entryPath);
  }

  return [{ absolutePath: entryPath, path: artifactPath }];
}

function rethrowArtifactDirectoryError(error, rootDirectory) {
  if (error?.code === "ENOENT" || error?.code === "ENOTDIR") {
    throw new Error(`Artifact directory not found: ${rootDirectory}`, { cause: error });
  }

  throw error;
}

export async function listArtifactFiles(directory = "dist") {
  const rootDirectory = resolve(directory);

  return walkArtifactDirectory(rootDirectory, rootDirectory).catch((error) =>
    rethrowArtifactDirectoryError(error, rootDirectory),
  );
}

export async function inspectArtifactFile(file) {
  const contents = await readFile(file.absolutePath);

  return {
    bytes: contents.byteLength,
    path: file.path,
    sha256: createHash("sha256").update(contents).digest("hex"),
  };
}
