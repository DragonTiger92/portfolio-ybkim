import assert from "node:assert/strict";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, it } from "node:test";

import {
  assertFullRevision,
  buildArtifactManifest,
  createTreeDigest,
} from "./create-artifact-manifest.mjs";

const revision = "a".repeat(40);

describe("artifact revision", () => {
  it("requires a full lowercase Git SHA", () => {
    assert.doesNotThrow(() => assertFullRevision(revision));
    assert.throws(() => assertFullRevision("abc123"), /full lowercase 40-character/u);
    assert.throws(() => assertFullRevision("A".repeat(40)), /full lowercase 40-character/u);
  });
});

describe("artifact manifest", () => {
  it("records sorted file digests and a deterministic tree digest", async () => {
    const buildDirectory = await mkdtemp(join(tmpdir(), "portfolio-artifact-"));

    try {
      await mkdir(join(buildDirectory, "assets"));
      await Promise.all([
        writeFile(join(buildDirectory, "index.html"), "<h1>Portfolio</h1>"),
        writeFile(join(buildDirectory, "assets", "logo.svg"), "<svg viewBox='0 0 1 1'/>"),
      ]);

      const firstManifest = await buildArtifactManifest({ buildDirectory, revision });
      const secondManifest = await buildArtifactManifest({ buildDirectory, revision });

      assert.deepEqual(firstManifest, secondManifest);
      assert.deepEqual(
        firstManifest.artifact.files.map((file) => file.path),
        ["assets/logo.svg", "index.html"],
      );
      assert.equal(
        firstManifest.artifact.treeDigest,
        createTreeDigest(firstManifest.artifact.files),
      );
      assert.equal(
        firstManifest.artifact.totalBytes,
        firstManifest.artifact.files.reduce((total, file) => total + file.bytes, 0),
      );
    } finally {
      await rm(buildDirectory, { force: true, recursive: true });
    }
  });

  it("changes the tree digest when file contents change", async () => {
    const buildDirectory = await mkdtemp(join(tmpdir(), "portfolio-artifact-change-"));
    const filePath = join(buildDirectory, "index.html");

    try {
      await writeFile(filePath, "first");
      const firstManifest = await buildArtifactManifest({ buildDirectory, revision });

      await writeFile(filePath, "second");
      const secondManifest = await buildArtifactManifest({ buildDirectory, revision });

      assert.notEqual(firstManifest.artifact.treeDigest, secondManifest.artifact.treeDigest);
    } finally {
      await rm(buildDirectory, { force: true, recursive: true });
    }
  });
});
