# Project Brief

## Summary

`portfolio-ybkim` is a static portfolio website for a web developer positioned as
a **frontend-specialized full-stack web developer**. The site should present
frontend strength first, then support it with public evidence of implementation
quality, documentation, release awareness, and product-delivery thinking.

The repository itself is part of the portfolio. Its code, docs, checks, and
decision records should show disciplined project execution, not only a finished
visual page.

## Audience

- Recruiters who need a quick view of fit and current job-seeking status.
- Engineering leads who want evidence of implementation quality and ownership.
- Peer developers who may inspect the repository structure and docs.
- Future LLM agents that need project context without reading private material.

## Goals

- Communicate a clear web developer profile with frontend as the entry point.
- Show public-safe project evidence without relying on private or applicant-only
  source material in public docs.
- Keep the site deployable as a static Cloudflare Pages product. Supporting
  GitHub Pages or another host is not a project requirement.
- Maintain concise requirements, architecture, ADR, and security documents.
- Use the repository as a visible example of thoughtful engineering practice.

## Non-Goals

- Do not add a backend runtime to this portfolio project.
- Do not introduce React or another UI framework without an explicit decision.
- Do not publish private repository details, company-confidential workflows, or
  recommendation-letter content.
- Do not place private or applicant-only case-study source material in `docs/`.
- Do not turn `docs/` into an agent guideline folder.

## Success Criteria

- A visitor can understand the developer positioning within the first viewport.
- A technical reviewer can trace major product choices through docs and ADRs.
- Public project claims stay concise, specific, and safe to publish.
- `pnpm.cmd check` remains the preferred full verification path.
