# Project Guidelines

## Overview

This repository contains `portfolio-ybkim`, a personal portfolio website.

The project currently uses:

- Astro in static output mode
- Semantic HTML
- Pure CSS
- Vanilla TypeScript
- pnpm
- Git
- GitHub

Astro components are the repository's page and reusable UI composition model.
Do not introduce React, another UI renderer, or a CSS framework unless explicitly
requested and justified by a concrete product need.

The portfolio should prioritize maintainability, readability, accessibility, responsive layout, and clear presentation of the developer's work.

## Documentation And Reference Surfaces

Keep public project documentation readable for both human maintainers and LLM agents.

- Treat `docs/` as public project documentation. It may be read by recruiters, reviewers, and LLM agents.
- Use `docs/` only for ordinary project documents such as requirements, architecture, ADRs, planning notes, public content models, and supply-chain notes.
- Use `.agents/` for agent-only operational guidance, harness rules, handoffs, and workflow references.
- Use `.contexts/` only for private or confidential source context. It must stay gitignored.
- When working on public project docs, start from `docs/README.md`; it is the document map for `docs/`.
- When adding, moving, or deleting a public doc, update `docs/README.md` in the same change.
- Keep root-level references, such as `AGENTS.md` and `README.md`, concise and aligned with the broader documentation structure.
- When turning notes or drafts into docs, remove scratch instructions, agent-only prompts, and planning asides unless they are part of the documented requirement.
- Prefer clear headings, stable terminology, explicit assumptions, and short rationale over private shorthand.
- Treat document size as a navigation signal rather than splitting prose at an
  arbitrary line number. When a document approaches its category limit, split by
  audience, topic, or ownership and keep an index or summary at the original path.
- Keep structured requirement and planning ledgers cohesive while their repeated
  sections remain easy to scan; use a higher limit than narrative documents and
  split only when a stable domain boundary exists.
- If content belongs in another document or an agent-only reference, mention that in the work report instead of hiding it in public project docs.

## Naming And Terminology

Prefer standard, widely recognized names for documents, directories, sections,
and other project entities when a conventional term exists. Good names reduce
the reader's cost of understanding the abstraction before they can evaluate the
content.

- Use established product, documentation, and software-delivery terms such as
  `Product Backlog`, `Roadmap`, `Requirements Traceability Matrix`, `Content
Model`, `Content Inventory`, `Wireframe Brief`, `Architecture`, `ADR`,
  `Runbook`, and `Glossary` when they accurately describe the entity.
- Avoid project-local abstractions, clever labels, or agent-only shorthand in
  public docs unless the document explicitly defines the term and the custom
  abstraction is worth its maintenance cost.
- Prefer the plainest specific name over a broader invented name. For example,
  use `Landing Page Copy` for landing-page text seeds instead of a vague copy
  ledger name.
- Preserve stable identifiers such as `PH-001`, `PBI-040`, `FR-001`, ADR
  numbers, route paths, and published asset paths unless a requested migration
  explicitly covers the rename.
- Before renaming an existing document, check references and weigh the clarity
  gain against link churn, Git history noise, and reviewer confusion.
- When renaming a public doc, update `docs/README.md`, planning references, and
  inbound links in the same change.

## Confidential Context

Content under `.contexts/` is confidential by default.

- Do not copy `.contexts/` content into `docs/`, `README.md`, website copy, commit messages, pull request text, or public reports unless the user explicitly asks to publish a specific item.
- Use private source material only to derive public-safe, recruiter-readable summaries.
- Remove or abstract company-confidential implementation details, internal workflow details, endpoints, infrastructure identifiers, private repository paths, and personal contact information before writing public docs.
- If a private source is needed as evidence, keep the evidence note in `.contexts/` and write only the sanitized claim in public files.

## Deployment Awareness

This project is expected to be deployed as a static frontend site through
Cloudflare Pages. GitHub Pages is not a supported production target.

Do not assume a custom domain until it is explicitly adopted during PH-003.

When changing build or routing behavior:

- Check Astro configuration and generated routes.
- Keep Astro output static and URLs compatible with the Cloudflare Pages root.
- Do not assume server-side runtime support.
- Avoid features that require a backend unless explicitly planned.
- Keep Cloudflare Pages static deployment compatibility in mind.

## Portfolio Content Currency

Treat the `portfolio-ybkim` project detail entry as a maintained description of
the product, not as phase-frozen copy.

- When a phase changes the product's implemented scope, deployment state,
  evidence links, or reviewable outcome, re-check
  `src/content/projects/portfolio-ybkim.md` in the same concern.
- Keep the summary, contribution boundary, implementation approach, and result
  aligned with reviewed public project truth. Do not copy temporary handoff
  status, private context, or an unverified future plan into recruiter-facing
  copy.
- Preserve deliberately stable aggregate wording such as `40개 이상의 PBI`
  unless the owner requests a more precise count or the wording becomes
  materially misleading.

## Out of Scope Unless Requested

Do not perform the following unless explicitly requested:

- Large-scale refactoring
- Full design system redesign
- Dependency migration
- Package manager migration
- Framework migration
- Deployment workflow changes
- GitHub Actions setup
- Husky/lint-staged setup
- ESLint rule changes
- Prettier setup changes
- Branch protection changes
- Commit creation
- Remote repository changes
