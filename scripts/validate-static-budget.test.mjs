import assert from "node:assert/strict";
import { resolve } from "node:path";
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
});

describe("static build measurement", () => {
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
  it("fails clearly when the build directory is missing", async () => {
    await assert.rejects(
      collectStaticBuildEntries(resolve(".missing-static-budget-fixture")),
      /Static build directory not found/u,
    );
  });
});
