import { spawnSync } from "node:child_process";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const gitleaksVersion = "8.30.1";
export const repositoryRoot = fileURLToPath(new URL("../", import.meta.url));
export const gitleaksAssets = {
  "win32-x64": {
    name: "gitleaks_8.30.1_windows_x64.zip",
    sha256: "d29144deff3a68aa93ced33dddf84b7fdc26070add4aa0f4513094c8332afc4e",
  },
  "linux-x64": {
    name: "gitleaks_8.30.1_linux_x64.tar.gz",
    sha256: "551f6fc83ea457d62a0d98237cbad105af8d557003051f41f3e7ca7b3f2470eb",
  },
};

export function getGitleaksInstallation(platform = process.platform, architecture = process.arch) {
  const asset = gitleaksAssets[`${platform}-${architecture}`];
  if (!asset) {
    throw new Error(
      "Gitleaks installation supports this project's Windows x64 and Linux x64 hosts.",
    );
  }

  const directory = resolve(repositoryRoot, ".tools", "gitleaks", gitleaksVersion);
  return {
    ...asset,
    directory,
    executable: resolve(directory, platform === "win32" ? "gitleaks.exe" : "gitleaks"),
    url: `https://github.com/gitleaks/gitleaks/releases/download/v${gitleaksVersion}/${asset.name}`,
  };
}

export function assertGitleaksVersion(executable) {
  const execution = spawnSync(executable, ["version"], {
    encoding: "utf8",
    timeout: 10_000,
    maxBuffer: 64 * 1024,
    windowsHide: true,
  });
  if (execution.status !== 0 || execution.stdout.trim() !== gitleaksVersion) {
    throw new Error(
      "Pinned Gitleaks is unavailable. Run pnpm secrets:install; raw output withheld.",
    );
  }
}
