import { spawnSync } from "node:child_process";

import { assertVisualEnvironment } from "./visual-test-environment.mjs";

function runVisualTests(argumentsList) {
  assertVisualEnvironment();
  const isUpdate = argumentsList.includes("--update");
  const isProbe = argumentsList.includes("--probe");
  const forwardedArguments = argumentsList.filter(
    (argument) => argument !== "--update" && argument !== "--probe",
  );
  const probeArguments = isProbe
    ? ["--grep", "detects intentional screenshot regression", "--project", "desktop-light"]
    : [];
  const execution = spawnSync(
    process.execPath,
    [
      "node_modules/@playwright/test/cli.js",
      "test",
      "--config=playwright.visual.config.ts",
      `--update-snapshots=${isUpdate ? "all" : "none"}`,
      ...probeArguments,
      ...forwardedArguments,
    ],
    {
      stdio: "inherit",
      env: { ...process.env, PORTFOLIO_VISUAL_PROBE: isProbe ? "1" : "0" },
    },
  );

  if (execution.error) {
    throw execution.error;
  }

  return execution.status ?? 1;
}

function reportFailure(failure) {
  process.stderr.write(`${failure instanceof Error ? failure.message : String(failure)}\n`);
  return 1;
}

process.exitCode = await Promise.resolve()
  .then(() => runVisualTests(process.argv.slice(2)))
  .catch(reportFailure);
