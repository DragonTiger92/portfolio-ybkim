import { pathToFileURL } from "node:url";

const allowedPrefixes = [
  "feature",
  "fix",
  "content",
  "docs",
  "ci",
  "infra",
  "security",
  "refactor",
  "chore",
];

const branchPattern = new RegExp(
  `^(${allowedPrefixes.join("|")})/((?:ph|pbi)-\\d{3})-[a-z0-9]+(?:-[a-z0-9]+)*$`,
);
const trustedAutomation = new Set(["dependabot[bot]"]);

function countSelected(body, valuePattern) {
  return [...body.matchAll(/^- \[[xX]\] `([^`]+)`/gm)].filter((match) =>
    valuePattern.test(match[1]),
  ).length;
}

function validateBranch(body, branchMatch) {
  if (!branchMatch) {
    return ["Branch name must match <type>/<ph-NNN|pbi-NNN>-<short-kebab-description>."];
  }

  const trackingId = branchMatch[2].toUpperCase();

  if (!new RegExp(`\\b${trackingId}\\b`).test(body)) {
    return [`PR body must reference the branch tracking ID ${trackingId}.`];
  }

  return [];
}

function validateExactlyOneSelection(body, pattern, message) {
  return countSelected(body, pattern) === 1 ? [] : [message];
}

export function validatePullRequestMetadata({ actor, body, headRef }) {
  if (trustedAutomation.has(actor)) {
    return [];
  }

  const errors = [];
  const branchMatch = branchPattern.exec(headRef);

  errors.push(...validateBranch(body, branchMatch));

  if (!/\bPBI-\d{3}\b/.test(body)) {
    errors.push("PR body must list at least one PBI ID.");
  }

  errors.push(
    ...validateExactlyOneSelection(
      body,
      /^PH-\d{3}$/,
      "PR body must select exactly one roadmap phase.",
    ),
    ...validateExactlyOneSelection(
      body,
      /^release:/,
      "PR body must select exactly one release impact.",
    ),
  );

  if (countSelected(body, /^type:/) === 0) {
    errors.push("PR body must select at least one change type.");
  }

  return errors;
}

function run() {
  const errors = validatePullRequestMetadata({
    actor: process.env.PR_ACTOR ?? "",
    body: process.env.PR_BODY ?? "",
    headRef: process.env.PR_HEAD_REF ?? "",
  });

  if (errors.length === 0) {
    return;
  }

  for (const error of errors) {
    console.error(`- ${error}`);
  }

  process.exitCode = 1;
}

const isDirectExecution =
  process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isDirectExecution) {
  run();
}
