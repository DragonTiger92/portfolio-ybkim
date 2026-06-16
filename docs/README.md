# Project Documentation

This directory contains the public project documentation for `portfolio-ybkim`.
The documents are written for human readers and LLM agents, but they are still
ordinary project docs: requirements, architecture, decisions, planning, content
models, and supply-chain notes.

Agent-only guidelines and private source context belong outside this directory.
Use `.agents/` for operational guidance and `.contexts/` for gitignored private
evidence.

## Document Map

| Path                                                    | Purpose                                      |
| ------------------------------------------------------- | -------------------------------------------- |
| `planning/project-brief.md`                             | Project purpose, audience, and boundaries    |
| `planning/roadmap.md`                                   | Delivery phases and current priorities       |
| `planning/work-items.md`                                | Implementation and documentation backlog     |
| `requirements/functional-requirements.md`               | User-facing behavior requirements            |
| `requirements/non-functional-requirements.md`           | Quality, privacy, accessibility, performance |
| `architecture/overview.md`                              | Static site architecture                     |
| `architecture/content-model.md`                         | Portfolio content structure                  |
| `architecture/deployment.md`                            | GitHub Pages deployment model                |
| `adr/0001-use-static-vite-vanilla-typescript.md`        | Technology baseline decision                 |
| `adr/0002-separate-public-docs-and-agent-guidelines.md` | Documentation boundary decision              |
| `adr/0003-use-spdx-json-sbom.md`                        | SBOM format decision                         |
| `adr/0004-keep-portfolio-claims-public-safe.md`         | Public-safe claim decision                   |
| `adr/0005-scope-code-license-and-portfolio-rights.md`   | Code/content licensing boundary              |
| `security/supply-chain.md`                              | Dependency and SBOM policy                   |
| `reference/glossary.md`                                 | Shared terms                                 |
| `content/portfolio-content.md`                          | Public portfolio content model               |
| `content/case-studies.md`                               | Public-safe case study summaries             |

## Writing Principles

- Keep each document short enough for a reviewer to scan.
- Prefer public-safe claims over private implementation detail.
- Link related documents instead of duplicating the same explanation.
- Treat IDs such as `FR-001`, `NFR-001`, and `WI-001` as stable once published.
- Keep confidential evidence in `.contexts/`, not in `docs/`.
- Keep licensing scope aligned with root `LICENSE`, `NOTICE.md`, and the SBOM.
