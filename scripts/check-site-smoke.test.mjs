import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve, sep } from "node:path";
import { it } from "node:test";

import {
  createProjectStructuredData,
  serializeStructuredData,
} from "../src/data/structured-data.ts";
import { runHttpSmoke, runHttpSmokeWithRetry } from "./check-http-smoke.mjs";
import { createSiteSmokeTargets } from "./site-smoke-contract.mjs";

const origin = "https://portfolio.example";
const projectPath = "/projects/future-project/";
const project = {
  slug: "future-project",
  title: "새 프로젝트 & </script>",
  summary: "공개 요약",
  stack: ["Astro"],
};

function schemaScript(schema) {
  return `<script type="application/ld+json">${serializeStructuredData(schema)}</script>`;
}

function pageHtml(path, schema) {
  return `<html><head><link rel="canonical" href="${origin}${path}">
    ${schema === undefined ? "" : schemaScript(schema)}</head>
    <body><h1 id="portfolio-title">Portfolio</h1></body></html>`;
}

async function withArtifact(check) {
  const directory = await mkdtemp(join(tmpdir(), "portfolio-site-smoke-"));
  const sitemap = `<urlset><url><loc>${origin}/</loc></url><url><loc>${origin}${projectPath}</loc></url></urlset>`;
  const bodies = new Map([
    [
      "/",
      pageHtml("/", { "@context": "https://schema.org", "@type": "ProfilePage", name: "김영빈" }),
    ],
    [projectPath, pageHtml(projectPath, createProjectStructuredData(project, new URL(origin)))],
    ["/sitemap.xml", sitemap],
    ["/robots.txt", `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`],
    ["/assets/brand/logo-mark.svg", '<svg viewBox="0 0 10 10"></svg>'],
    ["/assets/brand/site.webmanifest", '{"short_name":"Portfolio"}'],
  ]);
  try {
    await mkdir(join(directory, "projects", project.slug), { recursive: true });
    await Promise.all([
      writeFile(join(directory, "index.html"), bodies.get("/")),
      writeFile(join(directory, "projects", project.slug, "index.html"), bodies.get(projectPath)),
      writeFile(join(directory, "sitemap.xml"), sitemap),
      writeFile(join(directory, "robots.txt"), bodies.get("/robots.txt")),
    ]);
    await check({ directory, bodies });
  } finally {
    assert.ok(resolve(directory).startsWith(`${resolve(tmpdir())}${sep}portfolio-site-smoke-`));
    await rm(directory, { recursive: true });
  }
}

function fetchBodies(bodies, requests = []) {
  return async (url) => {
    const path = new URL(url).pathname;
    requests.push(path);
    const types = {
      "/sitemap.xml": "application/xml",
      "/robots.txt": "text/plain",
      "/assets/brand/logo-mark.svg": "image/svg+xml",
      "/assets/brand/site.webmanifest": "application/manifest+json",
    };
    return new Response(bodies.get(path) ?? "Missing", {
      status: bodies.has(path) ? 200 : 404,
      headers: { "Content-Type": types[path] ?? "text/html" },
    });
  };
}

it("discovers a future project and checks every route once alongside existing assets", async () => {
  await withArtifact(async ({ directory, bodies }) => {
    const requests = [];
    const paths = await runHttpSmoke({
      baseUrl: origin,
      siteTargets: await createSiteSmokeTargets(directory),
      fetchImplementation: fetchBodies(bodies, requests),
    });
    assert.deepEqual(paths, [
      "/",
      "/assets/brand/logo-mark.svg",
      "/assets/brand/site.webmanifest",
      projectPath,
      "/sitemap.xml",
      "/robots.txt",
    ]);
    assert.deepEqual(requests, paths);
  });
});

const corruptions = [
  ["missing detail", projectPath, () => undefined, /returned HTTP 404/u],
  ["missing JSON-LD", projectPath, () => pageHtml(projectPath, undefined), /JSON-LD.*differs/u],
  [
    "duplicate JSON-LD",
    projectPath,
    (body) => body + schemaScript(createProjectStructuredData(project, new URL(origin))),
    /duplicate JSON-LD/u,
  ],
  [
    "invalid JSON-LD",
    projectPath,
    (body) => body.replace('{"@context"', '{broken"@context"'),
    /failed content validation/u,
  ],
  [
    "stale project summary",
    projectPath,
    (body) => body.replaceAll(project.summary, "Old summary"),
    /JSON-LD differs/u,
  ],
  [
    "wrong canonical",
    projectPath,
    (body) => body.replace(`href="${origin}`, 'href="https://wrong.example'),
    /canonical differs/u,
  ],
  [
    "duplicate canonical",
    projectPath,
    (body) =>
      body.replace("</head>", `<link rel="canonical" href="${origin}${projectPath}"></head>`),
    /one canonical/u,
  ],
  ["landing regression", "/", (body) => body.replace("ProfilePage", "WebPage"), /JSON-LD differs/u],
  [
    "missing sitemap project",
    "/sitemap.xml",
    (body) => body.replace(`<url><loc>${origin}${projectPath}</loc></url>`, ""),
    /routes differ/u,
  ],
  [
    "duplicate sitemap route",
    "/sitemap.xml",
    (body) => body.replace("</urlset>", `<url><loc>${origin}/</loc></url></urlset>`),
    /duplicate routes/u,
  ],
  ["crawler blocked", "/robots.txt", () => "User-agent: *\nDisallow: /", /robots.txt differs/u],
];
for (const [name, path, corrupt, expectedError] of corruptions) {
  it(`rejects ${name}`, async () => {
    await withArtifact(async ({ directory, bodies }) => {
      const siteTargets = await createSiteSmokeTargets(directory);
      const body = corrupt(bodies.get(path));
      if (body === undefined) {
        bodies.delete(path);
      } else {
        bodies.set(path, body);
      }
      await assert.rejects(
        runHttpSmoke({ baseUrl: origin, siteTargets, fetchImplementation: fetchBodies(bodies) }),
        expectedError,
      );
    });
  });
}

it("ignores JSON whitespace and HTML attribute order", async () => {
  await withArtifact(async ({ directory, bodies }) => {
    const siteTargets = await createSiteSmokeTargets(directory);
    bodies.set(
      projectPath,
      bodies
        .get(projectPath)
        .replace('rel="canonical" href=', 'REL="canonical" HREF=')
        .replaceAll("<script", "<SCRIPT")
        .replaceAll("</script>", "</SCRIPT\t\n bar>")
        .replace('{"@context"', '{\n "@context"'),
    );
    await runHttpSmoke({
      baseUrl: origin,
      siteTargets,
      fetchImplementation: fetchBodies(bodies),
    });
  });
});

it("retries the complete smoke after stale schema", async () => {
  await withArtifact(async ({ directory, bodies }) => {
    const siteTargets = await createSiteSmokeTargets(directory);
    const requests = [];
    const waits = [];
    const original = bodies.get(projectPath);
    bodies.set(projectPath, original.replaceAll(project.summary, "Old summary"));
    await runHttpSmokeWithRetry({
      baseUrl: origin,
      attempts: 2,
      siteTargets,
      fetchImplementation: fetchBodies(bodies, requests),
      waitImplementation: async (delay) => {
        waits.push(delay);
        bodies.set(projectPath, original);
      },
    });
    assert.deepEqual(waits, [5000]);
    assert.equal(requests.filter((path) => path === "/").length, 2);
    assert.equal(requests.filter((path) => path === projectPath).length, 2);
  });
});

for (const url of [
  "https://other.example/projects/new/",
  `${origin}/projects/new/?q=1`,
  `${origin}/projects/%5c..%5c/`,
]) {
  it(`rejects unsafe artifact route ${url}`, async () => {
    await withArtifact(async ({ directory }) => {
      const path = join(directory, "sitemap.xml");
      await writeFile(path, (await readFile(path, "utf8")).replace(`${origin}${projectPath}`, url));
      await assert.rejects(
        createSiteSmokeTargets(directory),
        /same-origin directory routes|escapes/u,
      );
    });
  });
}

it("accepts the text/xml sitemap media type used by production", async () => {
  await withArtifact(async ({ directory, bodies }) => {
    const fetchImplementation = async (url) => {
      const response = await fetchBodies(bodies)(url);
      if (new URL(url).pathname === "/sitemap.xml") {
        response.headers.set("Content-Type", "text/xml; charset=utf-8");
      }
      return response;
    };
    await runHttpSmoke({
      baseUrl: origin,
      siteTargets: await createSiteSmokeTargets(directory),
      fetchImplementation,
    });
  });
});

it("checks historical artifact schema expectations", async () => {
  await withArtifact(async ({ directory, bodies }) => {
    bodies.set(projectPath, pageHtml(projectPath, undefined));
    await writeFile(
      join(directory, "projects", project.slug, "index.html"),
      bodies.get(projectPath),
    );
    const siteTargets = await createSiteSmokeTargets(directory);
    await runHttpSmoke({ baseUrl: origin, siteTargets, fetchImplementation: fetchBodies(bodies) });
    bodies.set(projectPath, pageHtml(projectPath, null));
    await assert.rejects(
      runHttpSmoke({ baseUrl: origin, siteTargets, fetchImplementation: fetchBodies(bodies) }),
      /JSON-LD.*differs/u,
    );
  });
});
