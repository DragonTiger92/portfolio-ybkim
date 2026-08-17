import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

import {
  allowedEffects,
  requiredGlobalInvariants,
  requiredOperationContracts,
  requiredOwnerDecisionGates,
} from "./execution-autonomy-contract.mjs";

const policyUrl = new URL("../.agents/policies/execution-autonomy.json", import.meta.url);

function validateStringArray(value, label, errors) {
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
    errors.push(`${label} must be an array of strings.`);
    return new Set();
  }

  const values = new Set(value);

  if (values.size !== value.length) {
    errors.push(`${label} must not contain duplicates.`);
  }

  return values;
}

function requireValues({ actual, required, label }, errors) {
  errors.push(
    ...required
      .filter((value) => !actual.has(value))
      .map((value) => `${label} must include ${value}.`),
  );
}

function indexOperation(operation, { indexed, errors }) {
  if (typeof operation?.id !== "string") {
    errors.push("Every autonomous operation must have a string id.");
    return;
  }

  if (indexed.has(operation.id)) {
    errors.push(`autonomousOperations must not duplicate ${operation.id}.`);
    return;
  }

  if (!allowedEffects.has(operation.effect)) {
    errors.push(`${operation.id} has an unsupported effect.`);
  }

  const preconditions = validateStringArray(
    operation.preconditions,
    `${operation.id}.preconditions`,
    errors,
  );
  const postconditions = validateStringArray(
    operation.postconditions,
    `${operation.id}.postconditions`,
    errors,
  );
  indexed.set(operation.id, { preconditions, postconditions });
}

function indexOperations(operations, errors) {
  if (!Array.isArray(operations)) {
    errors.push("autonomousOperations must be an array.");
    return new Map();
  }

  const indexed = new Map();

  for (const operation of operations) {
    indexOperation(operation, { indexed, errors });
  }

  return indexed;
}

function validateHeader(policy, errors) {
  if (policy?.version !== 1) {
    errors.push("Policy version must be 1.");
  }

  if (policy?.defaultDisposition !== "owner_decision") {
    errors.push("Default disposition must remain owner_decision.");
  }
}

function validateGlobalInvariants(policy, errors) {
  const globalInvariants = validateStringArray(
    policy?.globalInvariants,
    "globalInvariants",
    errors,
  );
  requireValues(
    {
      actual: globalInvariants,
      required: requiredGlobalInvariants,
      label: "globalInvariants",
    },
    errors,
  );
}

function validateOperationContract([operationId, contract], operations, errors) {
  if (!operations.has(operationId)) {
    errors.push(`autonomousOperations must include ${operationId}.`);
    return;
  }

  requireValues(
    {
      actual: operations.get(operationId).preconditions,
      required: contract.preconditions,
      label: `${operationId}.preconditions`,
    },
    errors,
  );
  requireValues(
    {
      actual: operations.get(operationId).postconditions,
      required: contract.postconditions,
      label: `${operationId}.postconditions`,
    },
    errors,
  );
}

function validateOperationContracts(operations, errors) {
  for (const contract of Object.entries(requiredOperationContracts)) {
    validateOperationContract(contract, operations, errors);
  }

  if (operations.has("merge_or_auto_merge")) {
    errors.push("merge_or_auto_merge must never be autonomous.");
  }
}

function validateOwnerDecisionGates(policy, operations, errors) {
  const ownerDecisionGates = validateStringArray(
    policy?.ownerDecisionGates,
    "ownerDecisionGates",
    errors,
  );
  requireValues(
    {
      actual: ownerDecisionGates,
      required: requiredOwnerDecisionGates,
      label: "ownerDecisionGates",
    },
    errors,
  );

  errors.push(
    ...[...operations.keys()]
      .filter((operationId) => ownerDecisionGates.has(operationId))
      .map((operationId) => `${operationId} cannot be both autonomous and owner-gated.`),
  );
}

export function validateExecutionAutonomyPolicy(policy) {
  const errors = [];

  validateHeader(policy, errors);
  validateGlobalInvariants(policy, errors);

  const operations = indexOperations(policy?.autonomousOperations, errors);

  validateOperationContracts(operations, errors);
  validateOwnerDecisionGates(policy, operations, errors);

  return errors;
}

export async function readExecutionAutonomyPolicy() {
  return JSON.parse(await readFile(policyUrl, "utf8"));
}

async function run() {
  const policy = await readExecutionAutonomyPolicy();
  const errors = validateExecutionAutonomyPolicy(policy);

  if (errors.length === 0) {
    process.stdout.write("Execution autonomy policy validation passed.\n");
    return 0;
  }

  process.stderr.write(`${errors.map((error) => `- ${error}`).join("\n")}\n`);
  return 1;
}

function reportFailure(error) {
  process.stderr.write(`${error.stack ?? error.message}\n`);
  return 1;
}

const invokedModuleUrl = process.argv[1] === undefined ? "" : pathToFileURL(process.argv[1]).href;

if (import.meta.url === invokedModuleUrl) {
  process.exitCode = await run().catch(reportFailure);
}
