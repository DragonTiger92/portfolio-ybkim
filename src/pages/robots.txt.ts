import type { APIRoute } from "astro";

export const prerender = true;

export const GET: APIRoute = ({ site }) => {
  if (site === undefined) {
    throw new Error("Astro site configuration is required for robots.txt.");
  }

  const sitemapUrl = new URL("/sitemap.xml", site);
  const body = ["User-agent: *", "Allow: /", `Sitemap: ${sitemapUrl.href}`, ""].join("\n");

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
