import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

export function assertSuccessfulTestGates({ quality, visual }) {
  if (quality !== "success" || visual !== "success") {
    throw new Error(`Test gates must both succeed (quality=${quality}, visual=${visual}).`);
  }
}

const invokedModuleUrl =
  process.argv[1] === undefined ? "" : pathToFileURL(resolve(process.argv[1])).href;

function reportFailure(failure) {
  process.stderr.write(`${failure instanceof Error ? failure.message : String(failure)}\n`);
  return 1;
}

if (import.meta.url === invokedModuleUrl) {
  process.exitCode = await Promise.resolve()
    .then(() =>
      assertSuccessfulTestGates({
        quality: process.env.QUALITY_RESULT,
        visual: process.env.VISUAL_RESULT,
      }),
    )
    .then(() => 0)
    .catch(reportFailure);
}
