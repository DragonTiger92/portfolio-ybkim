import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { chmod, mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  assertGitleaksVersion,
  getGitleaksInstallation,
  gitleaksVersion,
} from "./gitleaks-tool.mjs";

function extractArchive(archivePath, directory) {
  const extraction = spawnSync("tar", ["-xf", archivePath, "-C", directory], {
    timeout: 30_000,
    windowsHide: true,
    stdio: "pipe",
  });
  if (extraction.status !== 0) {
    throw new Error("Verified Gitleaks archive extraction failed.");
  }
}

async function installGitleaks() {
  const installation = getGitleaksInstallation();
  const response = await fetch(installation.url, { signal: AbortSignal.timeout(60_000) });
  if (!response.ok) {
    throw new Error("Official Gitleaks archive download failed.");
  }

  const archive = Buffer.from(await response.arrayBuffer());
  const checksum = createHash("sha256").update(archive).digest("hex");
  if (checksum !== installation.sha256) {
    throw new Error("Gitleaks archive checksum mismatch; installation refused.");
  }

  const temporaryDirectory = await mkdtemp(join(tmpdir(), "portfolio-gitleaks-install-"));
  try {
    const archivePath = join(temporaryDirectory, installation.name);
    await writeFile(archivePath, archive);
    await mkdir(installation.directory, { recursive: true });
    extractArchive(archivePath, installation.directory);
    await chmod(installation.executable, 0o755);
    assertGitleaksVersion(installation.executable);
  } finally {
    await rm(temporaryDirectory, { recursive: true, force: true });
  }

  process.stdout.write(
    `Installed Gitleaks ${gitleaksVersion}; official archive SHA-256 verified.\n`,
  );
}

await installGitleaks().catch(() => {
  console.error("Gitleaks installation failed; raw downloader and process output withheld.");
  process.exitCode = 1;
});
