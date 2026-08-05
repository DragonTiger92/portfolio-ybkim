import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { assertSupportedEntry } from "./artifact-files.mjs";
import { evaluateDistOutput, extractRootReferences } from "./validate-dist-output.mjs";

function createEntry(type) {
  return {
    isDirectory: () => type === "directory",
    isFile: () => type === "file",
    isSymbolicLink: () => type === "symlink",
  };
}

describe("artifact entry validation", () => {
  it("rejects symbolic links and unsupported entries", () => {
    assert.throws(
      () => assertSupportedEntry(createEntry("symlink"), "linked.css"),
      /Symbolic links are not allowed/u,
    );
    assert.throws(
      () => assertSupportedEntry(createEntry("socket"), "server.sock"),
      /Unsupported artifact entry type/u,
    );
  });

  it("accepts files and directories", () => {
    assert.doesNotThrow(() => assertSupportedEntry(createEntry("file"), "index.html"));
    assert.doesNotThrow(() => assertSupportedEntry(createEntry("directory"), "_astro"));
  });
});

describe("static output references", () => {
  it("extracts local HTML, manifest, CSS, and Astro asset references", () => {
    const contents = [
      '<link href="/_astro/site.hash.css?cache=1">',
      '<img src="/assets/logo.svg#mark">',
      '{"src": "/assets/icon.png"}',
      'background: url("/assets/pattern.svg")',
      'import("/_astro/chunk.hash.js")',
    ].join("\n");

    assert.deepEqual(extractRootReferences(contents), [
      "_astro/chunk.hash.js",
      "_astro/site.hash.css",
      "assets/icon.png",
      "assets/logo.svg",
      "assets/pattern.svg",
    ]);
  });
});

describe("static output contract", () => {
  const validInput = {
    actualPaths: [
      "_astro/app.hash.js",
      "assets/logo.svg",
      "assets/resume/resume-ybkim.pdf",
      "index.html",
      "projects/demo/index.html",
    ],
    expectedPublicPaths: ["assets/logo.svg", "assets/resume/resume-ybkim.pdf"],
    expectedRoutePaths: ["index.html", "projects/demo/index.html"],
    rootReferences: ["", "_astro/app.hash.js", "assets/logo.svg", "projects/demo/"],
  };

  it("accepts tracked public files, generated routes, and referenced Astro assets", () => {
    assert.deepEqual(evaluateDistOutput(validInput), {
      missing: [],
      unexpected: [],
      unresolvedReferences: [],
    });
  });

  it("reports missing, unexpected, and unresolved output independently", () => {
    assert.deepEqual(
      evaluateDistOutput({
        ...validInput,
        actualPaths: ["extra.txt", "index.html"],
      }),
      {
        missing: ["assets/logo.svg", "assets/resume/resume-ybkim.pdf", "projects/demo/index.html"],
        unexpected: ["extra.txt"],
        unresolvedReferences: ["/_astro/app.hash.js", "/assets/logo.svg", "/projects/demo/"],
      },
    );
  });
});
