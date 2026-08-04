import { getCollection } from "astro:content";
import type { APIRoute } from "astro";

export const prerender = true;

const escapeXml = (value: string) =>
  value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

export const GET: APIRoute = async ({ site }) => {
  if (site === undefined) {
    throw new Error("Astro site configuration is required for sitemap.xml.");
  }

  const projects = await getCollection("projects");
  const projectPaths = projects.map(({ id }) => `/projects/${id}/`).sort();
  const canonicalUrls = ["/", ...projectPaths].map((path) => new URL(path, site).href);
  const entries = canonicalUrls.map((url) => `  <url><loc>${escapeXml(url)}</loc></url>`);
  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries,
    "</urlset>",
    "",
  ].join("\n");

  return new Response(body, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};
