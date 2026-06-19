# Project Guidelines

## Overview

This repository contains `portfolio-ybkim`, a personal portfolio website.

The project currently uses:

- Vite
- HTML
- Pure CSS
- Vanilla TypeScript
- pnpm
- Git
- GitHub

Do not introduce React or another UI framework unless explicitly requested.

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
- If content belongs in another document or an agent-only reference, mention that in the work report instead of hiding it in public project docs.

## Confidential Context

Content under `.contexts/` is confidential by default.

- Do not copy `.contexts/` content into `docs/`, `README.md`, website copy, commit messages, pull request text, or public reports unless the user explicitly asks to publish a specific item.
- Use private source material only to derive public-safe, recruiter-readable summaries.
- Remove or abstract company-confidential implementation details, internal workflow details, endpoints, infrastructure identifiers, private repository paths, and personal contact information before writing public docs.
- If a private source is needed as evidence, keep the evidence note in `.contexts/` and write only the sanitized claim in public files.

## Deployment Awareness

This project is expected to be deployed as a static frontend site through GitHub Pages project-site hosting at a URL like `https://username.github.io/portfolio-ybkim/`.

Do not assume a custom domain or a GitHub Pages user/organization root site unless explicitly requested.

When changing build or routing behavior:

- Check Vite configuration.
- Keep Vite `base` aligned with the GitHub Pages repository path.
- Do not assume server-side runtime support.
- Avoid features that require a backend unless explicitly planned.
- Keep static deployment compatibility in mind.

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
