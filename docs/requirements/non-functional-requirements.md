# Non-Functional Requirements

This document defines quality attributes and constraints that apply across the
portfolio site.

## NFR-001: Accessible Semantic Content

| Field               | Value                  |
| ------------------- | ---------------------- |
| Category            | Accessibility          |
| Status              | Draft                  |
| Severity            | High                   |
| Applicability       | WebFE                  |
| Verification Method | Manual, StaticAnalysis |

The site must use semantic content structure and accessible interaction patterns
so visitors can understand and navigate the portfolio without relying only on
visual presentation.

### NFR-001 Verification

- Use semantic HTML for landmarks, sections, headings, links, and buttons.
- Keep heading order meaningful and tied to document structure.
- Preserve visible focus states for interactive elements.
- Provide meaningful text alternatives for non-decorative images.
- Review keyboard navigation for all primary actions.

## NFR-002: Lightweight Static Delivery

| Field               | Value                  |
| ------------------- | ---------------------- |
| Category            | Performance            |
| Status              | Draft                  |
| Severity            | High                   |
| Applicability       | WebFE                  |
| Verification Method | StaticAnalysis, Manual |

The portfolio must stay lightweight enough to build and load as a static site
without unnecessary runtime dependencies or client-side data fetching.

### NFR-002 Verification

- Avoid unnecessary runtime dependencies.
- Keep image and asset usage intentional.
- Confirm `pnpm.cmd build` succeeds before release.
- Prefer static content over client-side data fetching for portfolio copy.

## NFR-003: Inspectable And Verifiable Project Structure

| Field               | Value                              |
| ------------------- | ---------------------------------- |
| Category            | Maintainability                    |
| Status              | Draft                              |
| Severity            | High                               |
| Applicability       | All                                |
| Verification Method | CodeReview, StaticAnalysis, Manual |

The project must remain easy for a reviewer or future maintainer to inspect,
modify, and verify from the repository.

### NFR-003 Verification

- Keep TypeScript, DOM rendering, styling, and content data responsibilities
  clear.
- Keep public docs mapped from `docs/README.md`.
- Keep docs and ADRs updated when project structure changes.
- Run the available checks before claiming implementation completion.

## NFR-004: Public Information Safety

| Field               | Value                 |
| ------------------- | --------------------- |
| Category            | Compliance            |
| Status              | Draft                 |
| Severity            | High                  |
| Applicability       | All                   |
| Verification Method | Checklist, CodeReview |

Public files must not disclose private company material or sensitive personal
information.

### NFR-004 Verification

- Use only public or disclosure-reviewed source material for public project
  summaries.
- Keep private evidence in gitignored `.contexts/`.
- Keep applicant-only or private work evidence out of public case-study source
  docs unless it receives a fresh disclosure review.
- Do not publish recommendation-letter content on the web portfolio.
- Remove private repository paths, internal endpoints, infra identifiers, and
  company-confidential workflow detail from public docs and site copy.
- Use only the selected public contact channels in website contact actions.

## NFR-005: Static GitHub Pages Compatibility

| Field               | Value                     |
| ------------------- | ------------------------- |
| Category            | Deployment                |
| Status              | Draft                     |
| Severity            | High                      |
| Applicability       | WebFE                     |
| Verification Method | StaticAnalysis, Checklist |

The site must remain compatible with GitHub Pages project-site hosting and Vite
static build output.

### NFR-005 Verification

- Keep Vite `base` aligned with `/portfolio-ybkim/`.
- Avoid backend runtime assumptions.
- Keep client-side routing optional or static-hosting safe.
