# Discoverability Guidelines

Use this guideline for SEO, AEO, GEO, metadata, canonical URLs, robots, sitemap,
structured data, social previews, Search Console, or answer/generative search
work.

## Intent

Keep discoverability useful and small. The portfolio needs enough metadata and
crawl clarity for recruiters, engineering reviewers, search engines, and AI
search surfaces to understand the site. It does not need an SEO growth stack,
content farm, or ranking-chasing workflow.

## Required Context

Before changing discoverability behavior, inspect the current route and metadata
implementation, then read only the matching public docs:

- `docs/planning/project-brief.md` for audience, goals, and non-goals.
- `docs/architecture/information-architecture.md` for route and sitemap scope.
- `docs/architecture/content-model.md` for public content boundaries.
- `docs/requirements/non-functional-requirements.md` for `NFR-010` and public
  safety constraints.
- `docs/planning/product-backlog.md` for `PBI-029` and `PBI-013` scope.

Check current official search guidance when changing crawler, metadata,
structured data, or AI search behavior. Prefer primary sources such as Google
Search Central and Astro docs over SEO blog posts.

## Scope Rules

- Treat SEO, AEO, and GEO as one minimum discoverability surface unless the user
  explicitly asks for a separate strategy.
- Optimize for clear human understanding first; metadata should summarize real
  visible content and public-safe claims.
- Preserve static Cloudflare Pages compatibility. Do not add a backend, runtime
  service, database, or crawler API.
- Do not add dependencies for sitemap, robots, metadata, validation, or social
  previews unless the user explicitly approves the exact package action.
- Do not hard-code a custom domain before PH-003 selects the canonical
  production URL.
- Do not create extra routes only to target search queries, answer engines, or
  generative AI prompts.
- Do not add hidden text, keyword stuffing, doorway pages, mass query pages, or
  content that is not useful to portfolio visitors.

## Minimal Baseline

For each indexable production page, prefer:

- one clear `<title>` tied to the page purpose;
- one concise `meta description` matching visible content;
- a canonical URL only after the production origin is known;
- stable Korean `lang` and page copy unless the product intentionally adds
  localization;
- Open Graph and Twitter metadata only when the title, description, canonical
  URL, and image rights are known;
- semantic headings and links that make the review path clear without metadata;
- public-safe project summaries that do not expose private evidence.

For robots and sitemap work:

- Keep `robots.txt` minimal. Use it to guide compliant crawlers, not to hide
  sensitive information.
- Do not block CSS, JavaScript, or required static assets that crawlers need to
  render the page.
- Add `Sitemap:` only when a production sitemap URL is known.
- Generate or publish a sitemap only for URLs intended for public search
  results.
- Use `noindex` only for a named reason, such as non-production, duplicate, or
  disclosure-sensitive surfaces.

For structured data:

- Add it only when it reflects visible page content and a concrete search
  surface benefits from it.
- Prefer small, obvious schemas such as `Person`, `ProfilePage`,
  `BreadcrumbList`, or `WebSite` only if the page content supports them.
- Do not mark up exaggerated claims, private evidence, unpublished contact
  channels, or data that is absent from the page.
- Validate generated structured data before claiming completion.

## AEO And GEO Boundaries

AEO and GEO should not become parallel content systems. In this project they
mean:

- write concise summaries that answer a recruiter or reviewer question;
- keep headings, project facts, role, focus, stack, and links explicit;
- make public evidence easy to quote, inspect, and trace;
- avoid generic AI-generated advice pages or prompt-targeted variants;
- rely on the same public-safe claim rules used for normal portfolio content.

When in doubt, improve the actual page clarity instead of adding search-only
metadata.

## Verification

Run `pnpm.cmd check` when feasible. For focused discoverability work, also
inspect the built HTML or generated static files for:

- expected `title`, description, canonical, and social metadata;
- intended `robots.txt` and sitemap output;
- no accidental private URLs, internal paths, or unpublished contact details;
- structured data that matches visible page content.

Use external validation tools only when the target URL or generated artifact is
available. Do not treat Search Console, rich-result validation, or crawl evidence
as required before the site has a public production URL.

## Escalation Triggers

Update public docs or propose an ADR before adding:

- a new top-level route or public URL structure change;
- a dependency, integration, or workflow solely for SEO tooling;
- server-side rendering, API routes, Workers, or crawler-specific responses;
- analytics or search-console data collection beyond the accepted PH-004 scope;
- structured data that changes public claims or legal/contact representation.
