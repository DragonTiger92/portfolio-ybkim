import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const allowedBranchPattern =
  /^(?:content|feature|fix)\/(?:ph|pbi)-\d{3}-[a-z0-9]+(?:-[a-z0-9]+)*$/u;
const fullRevisionPattern = /^[0-9a-f]{40}$/u;

function result(eligible, reason) {
  return { eligible, reason };
}

function isDependabot(actor, headRef) {
  return actor.toLowerCase() === "dependabot[bot]" || headRef.startsWith("dependabot/");
}

function hasValidRevisions(headSha, checkedSha) {
  return fullRevisionPattern.test(headSha) && fullRevisionPattern.test(checkedSha);
}

export function evaluatePreviewEligibility({
  actor,
  baseRepository,
  checkedSha,
  headRef,
  headRepository,
  headSha,
  isDraft,
}) {
  if (isDependabot(actor, headRef)) {
    return result(false, "dependabot");
  }

  if (baseRepository.toLowerCase() !== headRepository.toLowerCase()) {
    return result(false, "fork");
  }

  if (isDraft) {
    return result(false, "draft");
  }

  if (!allowedBranchPattern.test(headRef)) {
    return result(false, "branch-prefix");
  }

  if (!hasValidRevisions(headSha, checkedSha)) {
    return result(false, "invalid-sha");
  }

  if (headSha !== checkedSha) {
    return result(false, "stale-sha");
  }

  return result(true, "eligible");
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

function parseDraft(value) {
  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  throw new Error("--draft must be true or false.");
}

function execute(argumentsList) {
  const evaluation = evaluatePreviewEligibility({
    actor: requireOption(argumentsList, "--actor"),
    baseRepository: requireOption(argumentsList, "--base-repository"),
    checkedSha: requireOption(argumentsList, "--checked-sha"),
    headRef: requireOption(argumentsList, "--head-ref"),
    headRepository: requireOption(argumentsList, "--head-repository"),
    headSha: requireOption(argumentsList, "--head-sha"),
    isDraft: parseDraft(requireOption(argumentsList, "--draft")),
  });

  process.stdout.write(`eligible=${evaluation.eligible}\nreason=${evaluation.reason}\n`);
  return 0;
}

function reportFailure(error) {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`Preview eligibility evaluation failed: ${message}\n`);
  return 1;
}

export function run(argumentsList = process.argv.slice(2)) {
  return Promise.resolve()
    .then(() => execute(argumentsList))
    .catch(reportFailure);
}

const invokedModuleUrl =
  process.argv[1] === undefined ? "" : pathToFileURL(resolve(process.argv[1])).href;

if (import.meta.url === invokedModuleUrl) {
  process.exitCode = await run();
}
