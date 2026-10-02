import { isDeepStrictEqual } from "node:util";
import { readFile } from "node:fs/promises";
import { isAbsolute, relative, resolve } from "node:path";

function requireMatch(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function attribute(attributes, name) {
  return new RegExp(`\\s${name}\\s*=\\s*(["'])(.*?)\\1`, "iu").exec(attributes)?.[2];
}

function pageMetadata(html, path) {
  const canonicals = [...html.matchAll(/<link\b([^>]*)>/giu)]
    .filter((match) => attribute(match[1], "rel")?.toLowerCase() === "canonical")
    .map((match) => attribute(match[1], "href"));
  const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\b[^>]*>/giu)].filter(
    (match) => attribute(match[1], "type")?.toLowerCase() === "application/ld+json",
  );
  requireMatch(canonicals.length === 1 && canonicals[0], `${path} must have one canonical URL.`);
  requireMatch(scripts.length <= 1, `${path} must not have duplicate JSON-LD scripts.`);
  // Historical rollback artifacts and other page types may intentionally have no schema.
  const structuredData = scripts.length === 0 ? null : JSON.parse(scripts[0][2]);
  return { canonical: canonicals[0], scriptCount: scripts.length, structuredData };
}

function sitemapUrls(xml) {
  requireMatch(/<urlset\b/iu.test(xml), "/sitemap.xml must contain a urlset.");
  const urls = [...xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gu)].map((match) => match[1]);
  requireMatch(urls.length > 0, "/sitemap.xml must list public routes.");
  requireMatch(new Set(urls).size === urls.length, "/sitemap.xml contains duplicate routes.");
  return urls.sort();
}

function validateRouteUrl(url, origin) {
  const validUrl =
    url.origin === origin && !url.search && !url.hash && !url.username && !url.password;
  const validPath = url.pathname.endsWith("/") && !/%2f|%5c/iu.test(url.pathname);
  requireMatch(
    validUrl && validPath,
    "Artifact sitemap must list same-origin directory routes only.",
  );
}

function routeFile(directory, url, origin) {
  validateRouteUrl(url, origin);
  const decodedPath = decodeURIComponent(url.pathname);
  const file = resolve(directory, `.${decodedPath}`, "index.html");
  const localPath = relative(directory, file);
  requireMatch(
    !isAbsolute(localPath) && !localPath.startsWith("..") && !decodedPath.includes("\\"),
    "Artifact sitemap route escapes the build directory.",
  );
  return file;
}

async function pageTarget(directory, canonical, origin) {
  const url = new URL(canonical);
  const html = await readFile(routeFile(directory, url, origin), "utf8");
  const expected = pageMetadata(html, url.pathname);
  requireMatch(
    expected.canonical === canonical,
    `${url.pathname} artifact canonical differs from sitemap.`,
  );
  return {
    path: url.pathname,
    contentType: "text/html",
    validate(body) {
      const actual = pageMetadata(body, url.pathname);
      requireMatch(
        actual.canonical === canonical,
        `${url.pathname} canonical differs from checked artifact.`,
      );
      requireMatch(
        actual.scriptCount === expected.scriptCount,
        `${url.pathname} JSON-LD count differs from checked artifact.`,
      );
      requireMatch(
        isDeepStrictEqual(actual.structuredData, expected.structuredData),
        `${url.pathname} JSON-LD differs from checked artifact.`,
      );
    },
  };
}

// Reads this site's validated static HTML/XML output, not arbitrary HTML or sitemap indexes.
export async function createSiteSmokeTargets(buildDirectory) {
  const directory = resolve(buildDirectory);
  const [sitemap, robots] = await Promise.all([
    readFile(resolve(directory, "sitemap.xml"), "utf8"),
    readFile(resolve(directory, "robots.txt"), "utf8"),
  ]);
  const urls = sitemapUrls(sitemap);
  const homepage = urls.find((url) => new URL(url).pathname === "/");
  requireMatch(homepage, "Artifact sitemap must include the homepage.");
  const origin = new URL(homepage).origin;
  const pages = await Promise.all(urls.map((url) => pageTarget(directory, url, origin)));
  return [
    ...pages,
    {
      path: "/sitemap.xml",
      contentType: ["application/xml", "text/xml"],
      validate(body) {
        requireMatch(
          isDeepStrictEqual(sitemapUrls(body), urls),
          "/sitemap.xml routes differ from checked artifact.",
        );
      },
    },
    {
      path: "/robots.txt",
      contentType: "text/plain",
      validate(body) {
        requireMatch(body.trim() === robots.trim(), "/robots.txt differs from checked artifact.");
      },
    },
  ];
}
