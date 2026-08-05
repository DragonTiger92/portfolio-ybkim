import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { describe, it } from "node:test";

import {
  collectStaticBuildEntries,
  countInlineJavaScriptBytes,
  evaluateStaticBudget,
  measureStaticBuild,
  staticBudget,
} from "./validate-static-budget.mjs";

function createEntry(path, bytes, inlineJavaScriptBytes = 0) {
  return {
    bytes,
    extension: path.slice(path.lastIndexOf(".")),
    inlineJavaScriptBytes,
    path,
  };
}

describe("inline JavaScript measurement", () => {
  it("counts executable inline scripts without counting external or data scripts", () => {
    const html = [
      "<script>const first = true;</script>",
      '<script type="module">const second = true;</script>',
      '<script data-src="deferred">const third = true;</script>',
      '<script type="text/javascript; charset=utf-8">const fourth = true;</script>',
      '<script data-note=" type=application/ld+json">const fifth = true;</script>',
      '<script src="/app.js"></script>',
      '<script type=application/ld+json>{"name":"portfolio"}</script>',
    ].join("");

    assert.equal(
      countInlineJavaScriptBytes(html),
      Buffer.byteLength(
        "const first = true;const second = true;const third = true;const fourth = true;const fifth = true;",
        "utf8",
      ),
    );
  });

  it("recognizes browser-tolerated script end tag syntax", () => {
    const firstScript = "const first = true;";
    const secondScript = "const second = true;";
    const thirdScript = "const third = true;";
    const fourthScript = "const fourth = true;";
    const fifthScript = "const fifth = true;";
    const sixthScript = "const sixth = true;";
    const html = [
      `<script>${firstScript}</script >`,
      `<script type="module">${secondScript}</script data-note="parser error">`,
      `<script>${thirdScript}</script data-note=<parser-error>`,
      `<script>${fourthScript}</script data-note=a"b>`,
      `<script>${fifthScript}</script data-note=a="b>`,
      `<script>${sixthScript}</script data-note=a='b>`,
    ].join("");
    const expectedScript = [
      firstScript,
      secondScript,
      thirdScript,
      fourthScript,
      fifthScript,
      sixthScript,
    ].join("");

    assert.equal(countInlineJavaScriptBytes(html), Buffer.byteLength(expectedScript, "utf8"));
  });

  it("rejects invalid tag-name boundaries without truncating script content", () => {
    const script = 'const value = "</script-x></script:foo></script=foo>";';
    const html = `<script>${script}</script><script-x>not JavaScript</script-x>`;

    assert.equal(countInlineJavaScriptBytes(html), Buffer.byteLength(script, "utf8"));
  });

  it("keeps quoted angle brackets inside opening attributes", () => {
    const script = "const quoted = true;";
    const html = `<script data-note="a>b">${script}</script>`;

    assert.equal(countInlineJavaScriptBytes(html), Buffer.byteLength(script, "utf8"));
  });

  it("uses ASCII-only case folding for HTML script tags", () => {
    const script = "const uppercase = true;";
    const html = `<SCRIPT>${script}</SCRIPT><ſcript>not JavaScript</ſcript>`;

    assert.equal(countInlineJavaScriptBytes(html), Buffer.byteLength(script, "utf8"));
  });
});

describe("static build measurement", () => {
  it("uses the reviewed v1 static budget baseline", () => {
    assert.deepEqual(staticBudget, {
      maxHtmlBytes: 40 * 1024,
      maxNonDownloadBytes: 64 * 1024,
      maxPdfBytes: 600 * 1024,
      totalCssBytes: 32 * 1024,
      totalHtmlBytes: 80 * 1024,
      totalJavaScriptBytes: 8 * 1024,
      totalNonDownloadBytes: 320 * 1024,
    });
  });

  it("separates route, executable, download, and non-download totals", () => {
    const metrics = measureStaticBuild([
      createEntry("index.html", 100, 20),
      createEntry("styles.css", 200),
      createEntry("app.js", 50),
      createEntry("module.mjs", 60),
      createEntry("logo.svg", 300),
      createEntry("resume.pdf", 400),
    ]);

    assert.deepEqual(metrics, {
      fileCount: 6,
      htmlFileCount: 1,
      maxHtmlBytes: 100,
      maxNonDownloadBytes: 300,
      maxPdfBytes: 400,
      totalCssBytes: 200,
      totalHtmlBytes: 100,
      totalJavaScriptBytes: 130,
      totalNonDownloadBytes: 710,
    });
  });

  it("reports only metrics that exceed their reviewed limit", () => {
    const metrics = measureStaticBuild([createEntry("index.html", 101)]);
    const budget = { ...staticBudget, maxHtmlBytes: 100 };

    assert.deepEqual(evaluateStaticBudget(metrics, budget), [
      {
        actual: 101,
        comparison: "maximum",
        label: "largest HTML document",
        limit: 100,
      },
    ]);
  });

  it("accepts metrics at the exact reviewed limits", () => {
    const metrics = {
      fileCount: 1,
      htmlFileCount: 1,
      maxHtmlBytes: staticBudget.maxHtmlBytes,
      maxNonDownloadBytes: staticBudget.maxNonDownloadBytes,
      maxPdfBytes: staticBudget.maxPdfBytes,
      totalCssBytes: staticBudget.totalCssBytes,
      totalHtmlBytes: staticBudget.totalHtmlBytes,
      totalJavaScriptBytes: staticBudget.totalJavaScriptBytes,
      totalNonDownloadBytes: staticBudget.totalNonDownloadBytes,
    };

    assert.deepEqual(evaluateStaticBudget(metrics), []);
  });

  it("requires at least one generated HTML document", () => {
    const metrics = measureStaticBuild([createEntry("styles.css", 100)]);

    assert.equal(evaluateStaticBudget(metrics)[0].label, "HTML document count");
  });
});

describe("static build input", () => {
  it("measures HTML contents and non-HTML file sizes from opened files", async () => {
    const buildDirectory = await mkdtemp(join(tmpdir(), "portfolio-static-budget-"));
    const html = "<script>const measured = true;</script>";
    const asset = Buffer.alloc(128);

    try {
      await Promise.all([
        writeFile(join(buildDirectory, "index.html"), html),
        writeFile(join(buildDirectory, "asset.bin"), asset),
      ]);
      const entries = await collectStaticBuildEntries(buildDirectory);
      const htmlEntry = entries.find((entry) => entry.path === "index.html");
      const assetEntry = entries.find((entry) => entry.path === "asset.bin");

      assert.equal(htmlEntry?.bytes, Buffer.byteLength(html, "utf8"));
      assert.equal(htmlEntry?.inlineJavaScriptBytes, Buffer.byteLength("const measured = true;"));
      assert.equal(assetEntry?.bytes, asset.byteLength);
      assert.equal(assetEntry?.inlineJavaScriptBytes, 0);
    } finally {
      await rm(buildDirectory, { force: true, recursive: true });
    }
  });

  it("fails clearly when the build directory is missing", async () => {
    await assert.rejects(
      collectStaticBuildEntries(resolve(".missing-static-budget-fixture")),
      /Static build directory not found/u,
    );
  });
});
