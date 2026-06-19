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
  `^(${allowedPrefixes.join("|")})/([1-9]\\d*)-[a-z0-9]+(?:-[a-z0-9]+)*$`,
);
const trustedAutomation = new Set(["dependabot[bot]"]);

function countSelected(body, valuePattern) {
  return [...body.matchAll(/^- \[[xX]\] `([^`]+)`/gm)].filter((match) =>
    valuePattern.test(match[1]),
  ).length;
}

function hasClosingReference(body, issueNumber) {
  const keyword = String.raw`(?:close[sd]?|fix(?:e[sd])?|resolve[sd]?)`;
  return new RegExp(`${keyword}\\s+#${issueNumber}\\b`, "i").test(body);
}

function validateBranch(body, branchMatch) {
  if (!branchMatch) {
    return ["Branch name must match <type>/<issue-number>-<short-kebab-description>."];
  }

  if (!hasClosingReference(body, branchMatch[2])) {
    return [
      `PR body must close the branch issue with Closes #${branchMatch[2]} or an equivalent keyword.`,
    ];
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
