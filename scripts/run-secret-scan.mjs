import { readFile } from "node:fs/promises";
import { assertGitleaksVersion, getGitleaksInstallation } from "./gitleaks-tool.mjs";
import { createScanOptions, formatScanResult, scanRepository } from "./secret-scan.mjs";

async function run() {
  const [mode, ...revisions] = process.argv.slice(2);
  const event =
    mode === "ci" ? JSON.parse(await readFile(process.env.GITHUB_EVENT_PATH, "utf8")) : {};
  event.name = process.env.GITHUB_EVENT_NAME;
  const options = createScanOptions(mode, revisions, event);
  const { executable } = getGitleaksInstallation();
  assertGitleaksVersion(executable);
  const result = scanRepository({ executable, options });
  process.stdout.write(`${formatScanResult(result)}\n`);
  process.exitCode = result.status;
}

await run().catch(() => {
  console.error(
    "Secret scan failed. Check the pinned installation and commit range; raw output withheld.",
  );
  process.exitCode = 1;
});
