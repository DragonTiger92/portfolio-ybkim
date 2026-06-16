# Architecture Overview

`portfolio-ybkim` is a static frontend application built with Vite, Vanilla
TypeScript, HTML, and pure CSS.

## System Shape

```text
Source files
  -> Vite build
  -> static assets in dist/
  -> GitHub Pages project-site hosting
  -> browser
```

## Responsibilities

| Area             | Responsibility                                       |
| ---------------- | ---------------------------------------------------- |
| HTML             | Document entry point and static metadata             |
| TypeScript       | DOM rendering and interaction behavior               |
| CSS              | Layout, visual design, responsiveness, accessibility |
| `docs/`          | Public project documentation                         |
| `.agents/`       | Agent-only operational guidance                      |
| `.contexts/`     | Gitignored private evidence and source context       |
| `sbom.spdx.json` | Machine-readable dependency inventory                |

## Constraints

- The site must not require a backend runtime.
- The project must preserve static GitHub Pages compatibility.
- React or another UI framework must not be introduced without a new decision.
- Public docs and site copy must not expose private company material.
