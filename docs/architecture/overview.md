# Architecture Overview

`portfolio-ybkim` is a statically generated multi-page application built with
Astro, TypeScript, semantic HTML, and pure CSS.

## System Shape

```text
Astro pages, components, and content collections
  -> Astro static build
  -> static assets in dist/
  -> Cloudflare Pages hosting
  -> browser
```

## Responsibilities

| Area             | Responsibility                                       |
| ---------------- | ---------------------------------------------------- |
| Astro pages      | Route ownership, document structure, and metadata    |
| Components       | Reusable presentation with explicit data contracts   |
| Content          | Typed project-detail data and Markdown narratives    |
| TypeScript       | Progressive interaction behavior                     |
| CSS              | Layout, visual design, responsiveness, accessibility |
| `docs/`          | Public project documentation                         |
| `.agents/`       | Agent-only operational guidance                      |
| `.contexts/`     | Gitignored private evidence and source context       |
| `sbom.spdx.json` | Machine-readable dependency inventory                |

## Constraints

- The site must not require a backend runtime.
- The supported production target is Cloudflare Pages. GitHub Pages and other
  static hosts are outside the compatibility contract.
- Astro renders HTML at build time. Client JavaScript is added only for a
  concrete interaction.
- React, another UI renderer, or a CSS framework must not be introduced without
  a new decision.
- Public docs and site copy must not expose private company material.
