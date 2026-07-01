import { readdir, readFile, stat } from "node:fs/promises";
import { extname, relative, resolve, sep } from "node:path";
import { pathToFileURL } from "node:url";

const ignoredDirectoryNames = new Set([
  ".astro",
  ".git",
  ".terraform",
  ".contexts",
  "build",
  "coverage",
  "dist",
  "node_modules",
  "playwright-report",
  "test-results",
  "tmp",
]);

const ignoredFilePaths = new Set(["pnpm-lock.yaml", "sbom.cdx.json"]);

const fileSizePolicies = [
  {
    label: "agent guideline",
    max: 200,
    matches: (filePath) => filePath.startsWith(".agents/guidelines/") && filePath.endsWith(".md"),
  },
  {
    label: "structured documentation ledger",
    max: 350,
    matches: (filePath) =>
      filePath.startsWith("docs/requirements/") ||
      filePath === "docs/planning/product-backlog.md" ||
      filePath === "docs/planning/requirements-traceability-matrix.md",
  },
  {
    extensions: new Set([".md"]),
    label: "narrative documentation",
    max: 250,
  },
  {
    extensions: new Set([".css"]),
    label: "stylesheet",
    max: 300,
  },
  {
    extensions: new Set([".astro", ".html", ".json", ".jsonc", ".tf", ".yaml", ".yml"]),
    label: "maintained configuration or markup",
    max: 250,
  },
];

function normalizePath(filePath, rootDirectory = process.cwd()) {
  return relative(rootDirectory, resolve(rootDirectory, filePath)).split(sep).join("/");
}

function isIgnoredPath(filePath) {
  if (ignoredFilePaths.has(filePath)) {
    return true;
  }

  return filePath.split("/").some((segment) => ignoredDirectoryNames.has(segment));
}

function getFileSizePolicy(filePath) {
  if (isIgnoredPath(filePath)) {
    return null;
  }

  const extension = extname(filePath).toLowerCase();

  return (
    fileSizePolicies.find((policy) =>
      policy.matches === undefined ? policy.extensions.has(extension) : policy.matches(filePath),
    ) ?? null
  );
}

function countContentLines(content) {
  return content.split(/\r?\n/u).filter((line) => line.trim().length > 0).length;
}

function evaluateContent(filePath, content) {
  const policy = getFileSizePolicy(filePath);

  if (policy === null) {
    return null;
  }

  const lines = countContentLines(content);

  return {
    filePath,
    label: policy.label,
    lines,
    max: policy.max,
    exceedsLimit: lines > policy.max,
  };
}

async function collectFiles(directory, rootDirectory = directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nestedFiles = await Promise.all(
    entries.map((entry) => collectEntryFiles(entry, directory, rootDirectory)),
  );

  return nestedFiles.flat();
}

async function collectEntryFiles(entry, directory, rootDirectory) {
  if (entry.isDirectory() && ignoredDirectoryNames.has(entry.name)) {
    return [];
  }

  const entryPath = resolve(directory, entry.name);

  if (entry.isDirectory()) {
    return collectFiles(entryPath, rootDirectory);
  }

  return entry.isFile() ? [normalizePath(entryPath, rootDirectory)] : [];
}

async function resolveInputFiles(inputPaths, rootDirectory) {
  if (inputPaths.length === 0) {
    return collectFiles(rootDirectory);
  }

  const files = await Promise.all(
    inputPaths.map((inputPath) => resolveInputFile(inputPath, rootDirectory)),
  );

  return files.filter((filePath) => filePath !== null);
}

async function resolveInputFile(inputPath, rootDirectory) {
  const absolutePath = resolve(rootDirectory, inputPath);
  const inputStat = await stat(absolutePath).catch(handleInputError);

  if (inputStat === null) {
    return null;
  }

  return inputStat.isFile() ? normalizePath(absolutePath, rootDirectory) : null;
}

function handleInputError(error) {
  if (error.code === "ENOENT") {
    return null;
  }

  throw error;
}

async function inspectFiles(filePaths, rootDirectory) {
  const results = await Promise.all(
    filePaths.map((filePath) => inspectFile(filePath, rootDirectory)),
  );

  return results.filter((result) => result !== null);
}

async function inspectFile(filePath, rootDirectory) {
  if (getFileSizePolicy(filePath) === null) {
    return null;
  }

  const content = await readFile(resolve(rootDirectory, filePath), "utf8");

  return evaluateContent(filePath, content);
}

function formatViolation(result) {
  return `${result.filePath}: ${result.lines}/${result.max} content lines (${result.label})`;
}

async function run(argumentsList = process.argv.slice(2), rootDirectory = process.cwd()) {
  const strict = argumentsList.includes("--strict");
  const inputPaths = argumentsList.filter((argument) => argument !== "--strict");
  const filePaths = await resolveInputFiles(inputPaths, rootDirectory);
  const results = await inspectFiles(filePaths, rootDirectory);
  const violations = results.filter((result) => result.exceedsLimit);

  if (violations.length === 0) {
    process.stdout.write(`File-size validation passed (${results.length} files checked).\n`);
    return 0;
  }

  const summary = violations.map(formatViolation).join("\n");
  const guidance =
    "Review responsibilities and dependencies before adding content. Split by reason to change, not by arbitrary line ranges.";
  process.stderr.write(`File-size limit exceeded:\n${summary}\n${guidance}\n`);

  return strict ? 1 : 0;
}

const invokedModuleUrl =
  process.argv[1] === undefined ? "" : pathToFileURL(resolve(process.argv[1])).href;

if (import.meta.url === invokedModuleUrl) {
  run().then(
    (exitCode) => {
      process.exitCode = exitCode;
    },
    (error) => {
      process.stderr.write(`${error.stack ?? error.message}\n`);
      process.exitCode = 1;
    },
  );
}

export { countContentLines, evaluateContent, getFileSizePolicy, isIgnoredPath };
