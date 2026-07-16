import { readdir, readFile, stat } from "node:fs/promises";
import { extname, relative, resolve, sep } from "node:path";
import { pathToFileURL } from "node:url";

const kibibyte = 1024;

export const staticBudget = Object.freeze({
  maxHtmlBytes: 24 * kibibyte,
  maxNonDownloadBytes: 64 * kibibyte,
  maxPdfBytes: 600 * kibibyte,
  totalCssBytes: 32 * kibibyte,
  totalHtmlBytes: 48 * kibibyte,
  totalJavaScriptBytes: 8 * kibibyte,
  totalNonDownloadBytes: 160 * kibibyte,
});

const javaScriptExtensions = new Set([".cjs", ".js", ".mjs"]);
const javaScriptMimeTypes = new Set([
  "application/ecmascript",
  "application/javascript",
  "application/x-ecmascript",
  "application/x-javascript",
  "text/ecmascript",
  "text/javascript",
  "text/javascript1.0",
  "text/javascript1.1",
  "text/javascript1.2",
  "text/javascript1.3",
  "text/javascript1.4",
  "text/javascript1.5",
  "text/jscript",
  "text/livescript",
  "text/x-ecmascript",
  "text/x-javascript",
]);

function getAttributeValue(attributes, targetName) {
  const attributePattern =
    /(?:^|\s)([^\s"'<>/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/gu;
  const attribute = [...attributes.matchAll(attributePattern)].find(
    (match) => match[1].toLowerCase() === targetName,
  );

  if (attribute === undefined) {
    return undefined;
  }

  return attribute[2] ?? attribute[3] ?? attribute[4] ?? "";
}

function isExecutableInlineScript(attributes) {
  if (getAttributeValue(attributes, "src") !== undefined) {
    return false;
  }

  const scriptType = getAttributeValue(attributes, "type")?.trim().toLowerCase() ?? "";

  if (scriptType === "" || scriptType === "module") {
    return true;
  }

  const mimeEssence = scriptType.split(";", 1)[0].trim();

  return javaScriptMimeTypes.has(mimeEssence);
}

export function countInlineJavaScriptBytes(html) {
  const scriptPattern = /<script\b([^>]*)>([\s\S]*?)<\/script>/giu;

  return [...html.matchAll(scriptPattern)]
    .filter((match) => isExecutableInlineScript(match[1]))
    .reduce((total, match) => total + Buffer.byteLength(match[2], "utf8"), 0);
}

async function listBuildFiles(directory) {
  const directoryEntries = await readdir(directory, { withFileTypes: true });
  const nestedFiles = await Promise.all(
    directoryEntries.map((entry) => {
      const entryPath = resolve(directory, entry.name);

      return entry.isDirectory() ? listBuildFiles(entryPath) : [entryPath];
    }),
  );

  return nestedFiles.flat();
}

export async function collectStaticBuildEntries(buildDirectory = resolve("dist")) {
  const buildStats = await stat(buildDirectory).catch(() => null);

  if (buildStats?.isDirectory() !== true) {
    throw new Error(`Static build directory not found: ${buildDirectory}`);
  }

  const filePaths = await listBuildFiles(buildDirectory);

  return Promise.all(
    filePaths.map(async (filePath) => {
      const fileStats = await stat(filePath);
      const extension = extname(filePath).toLowerCase();
      const html = extension === ".html" ? await readFile(filePath, "utf8") : "";

      return {
        bytes: fileStats.size,
        extension,
        inlineJavaScriptBytes: countInlineJavaScriptBytes(html),
        path: relative(buildDirectory, filePath).split(sep).join("/"),
      };
    }),
  );
}

function sumBytes(entries) {
  return entries.reduce((total, entry) => total + entry.bytes, 0);
}

function maxBytes(entries) {
  return entries.reduce((largest, entry) => Math.max(largest, entry.bytes), 0);
}

export function measureStaticBuild(entries) {
  const htmlEntries = entries.filter((entry) => entry.extension === ".html");
  const cssEntries = entries.filter((entry) => entry.extension === ".css");
  const javaScriptEntries = entries.filter((entry) => javaScriptExtensions.has(entry.extension));
  const pdfEntries = entries.filter((entry) => entry.extension === ".pdf");
  const nonDownloadEntries = entries.filter((entry) => entry.extension !== ".pdf");
  const inlineJavaScriptBytes = htmlEntries.reduce(
    (total, entry) => total + entry.inlineJavaScriptBytes,
    0,
  );

  return {
    fileCount: entries.length,
    htmlFileCount: htmlEntries.length,
    maxHtmlBytes: maxBytes(htmlEntries),
    maxNonDownloadBytes: maxBytes(nonDownloadEntries),
    maxPdfBytes: maxBytes(pdfEntries),
    totalCssBytes: sumBytes(cssEntries),
    totalHtmlBytes: sumBytes(htmlEntries),
    totalJavaScriptBytes: sumBytes(javaScriptEntries) + inlineJavaScriptBytes,
    totalNonDownloadBytes: sumBytes(nonDownloadEntries),
  };
}

const metricDefinitions = [
  { budgetKey: "maxHtmlBytes", label: "largest HTML document", metricKey: "maxHtmlBytes" },
  { budgetKey: "totalHtmlBytes", label: "aggregate HTML", metricKey: "totalHtmlBytes" },
  { budgetKey: "totalCssBytes", label: "aggregate CSS", metricKey: "totalCssBytes" },
  {
    budgetKey: "totalJavaScriptBytes",
    label: "emitted and inline executable JavaScript",
    metricKey: "totalJavaScriptBytes",
  },
  {
    budgetKey: "totalNonDownloadBytes",
    label: "non-download output",
    metricKey: "totalNonDownloadBytes",
  },
  {
    budgetKey: "maxNonDownloadBytes",
    label: "largest non-download file",
    metricKey: "maxNonDownloadBytes",
  },
  { budgetKey: "maxPdfBytes", label: "largest PDF", metricKey: "maxPdfBytes" },
];

export function evaluateStaticBudget(metrics, budget = staticBudget) {
  const violations = metricDefinitions
    .map((definition) => ({
      actual: metrics[definition.metricKey],
      comparison: "maximum",
      label: definition.label,
      limit: budget[definition.budgetKey],
    }))
    .filter((result) => result.actual > result.limit);

  if (metrics.htmlFileCount > 0) {
    return violations;
  }

  return [
    { actual: 0, comparison: "minimum", label: "HTML document count", limit: 1 },
    ...violations,
  ];
}

function formatBytes(bytes) {
  return `${(bytes / kibibyte).toFixed(2)} KiB`;
}

function formatMetricReport(metrics, budget = staticBudget) {
  return metricDefinitions
    .map((definition) => {
      const actual = metrics[definition.metricKey];
      const limit = budget[definition.budgetKey];

      return `- ${definition.label}: ${formatBytes(actual)} / ${formatBytes(limit)}`;
    })
    .join("\n");
}

function reportBudgetResult(metrics) {
  const violations = evaluateStaticBudget(metrics);
  const report = formatMetricReport(metrics);

  if (violations.length === 0) {
    process.stdout.write(
      `Static build budget passed (${metrics.fileCount} files checked).\n${report}\n`,
    );
    return 0;
  }

  const summary = violations
    .map((violation) => {
      const operator = violation.comparison === "minimum" ? "<" : ">";

      return `- ${violation.label}: ${violation.actual} ${operator} ${violation.limit}`;
    })
    .join("\n");
  process.stderr.write(`Static build budget exceeded:\n${summary}\n${report}\n`);
  return 1;
}

async function validateBuildDirectory(buildDirectory) {
  const entries = await collectStaticBuildEntries(buildDirectory);
  const metrics = measureStaticBuild(entries);

  return reportBudgetResult(metrics);
}

function reportValidationFailure(error) {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`Static build budget validation failed: ${message}\n`);
  return 1;
}

export async function run(argumentsList = process.argv.slice(2)) {
  const buildDirectory = resolve(argumentsList[0] ?? "dist");

  return validateBuildDirectory(buildDirectory).catch(reportValidationFailure);
}

const invokedModuleUrl =
  process.argv[1] === undefined ? "" : pathToFileURL(resolve(process.argv[1])).href;

if (import.meta.url === invokedModuleUrl) {
  process.exitCode = await run();
}
