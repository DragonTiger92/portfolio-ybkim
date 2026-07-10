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
| `planning/product-backlog.md`                           | Implementation-sized Product Backlog Items   |
| `planning/requirements-traceability-matrix.md`          | Requirement-to-backlog traceability          |
| `process/development-workflow.md`                       | GitHub Flow and branch naming convention     |
| `requirements/functional-requirements.md`               | User-facing behavior requirements            |
| `requirements/non-functional-requirements.md`           | Product quality attributes and constraints   |
| `architecture/overview.md`                              | Static site architecture                     |
| `architecture/information-architecture.md`              | Product sitemap and analytics scope          |
| `architecture/content-model.md`                         | Portfolio content structure                  |
| `architecture/deployment.md`                            | Cloudflare deployment and release model      |
| `architecture/github-governance.md`                     | GitHub settings and IaC ownership            |
| `adr/0001-use-static-vite-vanilla-typescript.md`        | Technology baseline decision                 |
| `adr/0002-separate-public-docs-and-agent-guidelines.md` | Documentation boundary decision              |
| `adr/0003-use-spdx-json-sbom.md`                        | Superseded SPDX SBOM decision                |
| `adr/0004-keep-portfolio-claims-public-safe.md`         | Public-safe claim decision                   |
| `adr/0005-scope-code-license-and-portfolio-rights.md`   | Code/content licensing boundary              |
| `adr/0006-use-github-flow-and-ci-quality-gates.md`      | GitHub Flow and CI quality gate decision     |
| `adr/0007-use-cloudflare-pages-delivery.md`             | Cloudflare delivery and preview decision     |
| `adr/0008-use-docs-based-work-tracking.md`              | Docs-based work tracking decision            |
| `adr/0009-adopt-astro-static-component-architecture.md` | Astro static component architecture decision |
| `adr/0010-use-cyclonedx-json-sbom.md`                   | CycloneDX SBOM format decision               |
| `security/supply-chain.md`                              | Dependency and SBOM policy                   |
| `security/license-compliance.md`                        | Pre-release third-party license review       |
| `operations/production-readiness.md`                    | Production health, monitoring, and recovery  |
| `reference/glossary.md`                                 | Shared terms                                 |
| `content/portfolio-content.md`                          | Public portfolio content model               |
| `content/case-studies.md`                               | Public-safe case study summaries             |
| `content/project-content-inventory.md`                  | Project, surface, and link planning data     |
| `content/portfolio-content-source.md`                   | Implementation-ready portfolio source data   |
| `content/portfolio-copy-source.md`                      | First viewport and project showcase copy     |
| `content/resume-portfolio-boundary.md`                  | Resume and portfolio content boundary        |

## Writing Principles

- Keep each document short enough for a reviewer to scan.
- Prefer public-safe claims over private implementation detail.
- Link related documents instead of duplicating the same explanation.
- Treat IDs such as `FR-001`, `NFR-001`, and `PBI-001` as stable once published.
- Keep confidential evidence in `.contexts/`, not in `docs/`.
- Keep licensing scope aligned with root `LICENSE`, `NOTICE.md`, and the SBOM.
