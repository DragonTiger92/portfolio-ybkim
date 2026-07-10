# ADR-0009: Adopt Astro Static Component Architecture

## Status

Accepted

## Context

The product has one landing page and a small set of first-depth project-detail
pages. Page shells, project summaries, metadata, and navigation repeat enough to
need explicit component and content boundaries, but the site does not need a
client-side application runtime or a virtual DOM.

The original Vite and imperative DOM scaffold kept the runtime small but made
page-level reuse, typed content, and semantic document review increasingly
manual. The project also needs generated HTML that can be checked before browser
tests and deployed unchanged to Cloudflare Pages.

## Decision

Use Astro in static output mode as the page, layout, and component architecture.
Keep TypeScript for typed content and progressive interactions, pure layered CSS
for styling, and native HTML semantics as the accessibility baseline.

Use an Astro content collection for project-detail metadata and Markdown. Keep
the information architecture shallow: `/` for discovery and
`/projects/{slug}/` for project details. Do not add a client UI renderer or CSS
framework until a concrete interaction or styling need justifies another ADR.

## Consequences

- Repeated page and project UI has named, cohesive component boundaries.
- Project data is validated at build time and remains separate from presentation.
- Every route produces static HTML suitable for local standards validation and
  Cloudflare Pages.
- Most pages ship no client JavaScript; behavior is added as small progressive
  enhancements.
- Astro and its build-time dependencies become part of the maintained toolchain.
- ADR-0001 is superseded, while its lightweight static-hosting intent remains.
