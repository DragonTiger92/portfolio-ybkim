import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

import { assertFullRevision } from "./create-artifact-manifest.mjs";

const environments = new Set(["preview", "production"]);

function assertEnvironment(environment) {
  if (!environments.has(environment)) {
    throw new Error("Pages deployment environment must be preview or production.");
  }
}

function assertSafeBranch(branch) {
  if (!/^[a-zA-Z0-9][a-zA-Z0-9/._-]*$/u.test(branch)) {
    throw new Error("Pages deployment branch contains unsupported characters.");
  }
}

function toResolvedDeployment(deployment) {
  const url = new URL(deployment.url);
  assertDeploymentId(deployment.id);
  assertPagesUrl(url);

  return {
    branch: deployment.deployment_trigger.metadata.branch,
    environment: deployment.environment,
    id: deployment.id,
    url: url.href,
  };
}

function assertDeploymentId(deploymentId) {
  if (!/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/u.test(deploymentId)) {
    throw new Error("Resolved Pages deployment ID must be a UUID.");
  }
}

function assertPagesUrl(url) {
  if (
    url.protocol !== "https:" ||
    !url.hostname.endsWith(".pages.dev") ||
    url.pathname !== "/" ||
    url.search !== "" ||
    url.hash !== "" ||
    url.username !== "" ||
    url.password !== ""
  ) {
    throw new Error("Resolved Pages deployment URL must be a credential-free Pages HTTPS origin.");
  }
}

export function selectPagesDeployment({ branch, deployments, environment, revision }) {
  assertFullRevision(revision);
  assertEnvironment(environment);
  assertSafeBranch(branch);

  const matches = deployments
    .filter((deployment) => matchesDeployment(deployment, { branch, environment, revision }))
    .toSorted((left, right) => Date.parse(right.created_on) - Date.parse(left.created_on));

  if (matches.length === 0) {
    throw new Error("No successful Pages deployment matches the exact revision and branch.");
  }

  return toResolvedDeployment(matches[0]);
}

function matchesDeployment(deployment, expected) {
  const metadata = deployment.deployment_trigger?.metadata;

  return (
    deployment.environment === expected.environment &&
    metadata?.branch === expected.branch &&
    metadata?.commit_hash === expected.revision &&
    deployment.latest_stage?.status === "success"
  );
}

function readOption(argumentsList, option) {
  const optionIndex = argumentsList.indexOf(option);

  return optionIndex === -1 ? undefined : argumentsList[optionIndex + 1];
}

function requireValue(value, label) {
  if (value === undefined || value === "") {
    throw new Error(`${label} is required.`);
  }

  return value;
}

async function fetchDeployments({ accountId, apiToken, fetchImplementation, projectName }) {
  const endpoint = new URL(
    `https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(accountId)}/pages/projects/${encodeURIComponent(projectName)}/deployments`,
  );
  endpoint.searchParams.set("per_page", "20");

  const response = await fetchImplementation(endpoint, {
    headers: { Authorization: `Bearer ${apiToken}` },
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    throw new Error(`Cloudflare Pages deployment lookup returned HTTP ${response.status}.`);
  }

  const payload = await response.json();

  if (payload.success !== true || !Array.isArray(payload.result)) {
    throw new Error("Cloudflare Pages deployment lookup returned an unexpected response.");
  }

  return payload.result;
}

function delay(milliseconds) {
  return new Promise((resolveDelay) => setTimeout(resolveDelay, milliseconds));
}

export async function resolvePagesDeployment({
  accountId,
  apiToken,
  branch,
  environment,
  fetchImplementation = fetch,
  projectName,
  revision,
  attempts = 10,
  retryDelayMilliseconds = 3_000,
}) {
  return resolveDeploymentAttempt(
    { accountId, apiToken, branch, environment, fetchImplementation, projectName, revision },
    attempts,
    retryDelayMilliseconds,
  );
}

function resolveDeploymentAttempt(options, attemptsRemaining, retryDelayMilliseconds) {
  return fetchDeployments(options)
    .then((deployments) => selectPagesDeployment({ ...options, deployments }))
    .catch((error) =>
      retryDeploymentResolution({
        attemptsRemaining,
        error,
        options,
        retryDelayMilliseconds,
      }),
    );
}

async function retryDeploymentResolution({
  attemptsRemaining,
  error,
  options,
  retryDelayMilliseconds,
}) {
  if (attemptsRemaining <= 1) {
    throw error;
  }

  await delay(retryDelayMilliseconds);
  return resolveDeploymentAttempt(options, attemptsRemaining - 1, retryDelayMilliseconds);
}

async function execute(argumentsList) {
  const deployment = await resolvePagesDeployment({
    accountId: requireValue(process.env.CLOUDFLARE_ACCOUNT_ID, "CLOUDFLARE_ACCOUNT_ID"),
    apiToken: requireValue(process.env.CLOUDFLARE_API_TOKEN, "CLOUDFLARE_API_TOKEN"),
    branch: requireValue(readOption(argumentsList, "--branch"), "--branch"),
    environment: requireValue(readOption(argumentsList, "--environment"), "--environment"),
    projectName: requireValue(readOption(argumentsList, "--project-name"), "--project-name"),
    revision: requireValue(readOption(argumentsList, "--revision"), "--revision"),
  });

  process.stdout.write(
    `deployment-id=${deployment.id}\ndeployment-url=${deployment.url}\ndeployment-branch=${deployment.branch}\n`,
  );
  return 0;
}

function reportFailure(error) {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`Pages deployment resolution failed: ${message}\n`);
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
