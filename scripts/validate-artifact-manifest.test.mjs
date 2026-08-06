import assert from "node:assert/strict";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, it } from "node:test";

import { buildArtifactManifest } from "./create-artifact-manifest.mjs";
import { validateArtifactManifest } from "./validate-artifact-manifest.mjs";

const revision = "a".repeat(40);

describe("artifact manifest validation", () => {
  it("accepts an unchanged exact-revision artifact", async () => {
    const root = await mkdtemp(join(tmpdir(), "portfolio-artifact-validation-"));
    const buildDirectory = join(root, "dist");
    const manifestPath = join(root, "manifest.json");

    try {
      await mkdir(buildDirectory);
      await writeFile(join(buildDirectory, "index.html"), "<h1>Portfolio</h1>");
      const manifest = await buildArtifactManifest({ buildDirectory, revision });
      await writeFile(manifestPath, JSON.stringify(manifest));

      assert.deepEqual(
        await validateArtifactManifest({ buildDirectory, manifestPath, revision }),
        manifest,
      );
    } finally {
      await rm(root, { force: true, recursive: true });
    }
  });

  it("rejects a changed artifact", async () => {
    const root = await mkdtemp(join(tmpdir(), "portfolio-artifact-tamper-"));
    const buildDirectory = join(root, "dist");
    const manifestPath = join(root, "manifest.json");
    const indexPath = join(buildDirectory, "index.html");

    try {
      await mkdir(buildDirectory);
      await writeFile(indexPath, "original");
      await writeFile(
        manifestPath,
        JSON.stringify(await buildArtifactManifest({ buildDirectory, revision })),
      );
      await writeFile(indexPath, "changed");

      await assert.rejects(
        validateArtifactManifest({ buildDirectory, manifestPath, revision }),
        /do not match the exact-revision manifest/u,
      );
    } finally {
      await rm(root, { force: true, recursive: true });
    }
  });
});
