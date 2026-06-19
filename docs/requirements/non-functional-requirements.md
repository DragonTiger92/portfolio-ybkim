# Non-Functional Requirements

This document defines quality attributes and constraints that apply across the
portfolio site. Implementation and verification are tracked through the
[Requirements Traceability Matrix](../planning/requirements-traceability-matrix.md).

## Schema

| Field               | Meaning                                                    |
| ------------------- | ---------------------------------------------------------- |
| Category            | Quality or constraint domain                               |
| Status              | Draft, Approved, Implemented, Verified, or Retired         |
| Severity            | Impact if the constraint is not satisfied                  |
| Applicability       | Product surface to which the constraint applies            |
| Verification Method | Primary evidence used to evaluate the requirement          |
| Source              | Stakeholder or upstream document that established the need |

## NFR-001: Accessible Semantic Content

| Field               | Value                                         |
| ------------------- | --------------------------------------------- |
| Category            | Accessibility                                 |
| Status              | Draft                                         |
| Severity            | High                                          |
| Applicability       | WebFE                                         |
| Verification Method | Manual, StaticAnalysis                        |
| Source              | [Project Brief](../planning/project-brief.md) |

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

| Field               | Value                                                         |
| ------------------- | ------------------------------------------------------------- |
| Category            | Performance                                                   |
| Status              | Draft                                                         |
| Severity            | High                                                          |
| Applicability       | WebFE                                                         |
| Verification Method | StaticAnalysis, Manual                                        |
| Source              | [ADR-0001](../adr/0001-use-static-vite-vanilla-typescript.md) |

The portfolio must stay lightweight enough to build and load as a static site
without unnecessary runtime dependencies or client-side data fetching.

### NFR-002 Verification

- Avoid unnecessary runtime dependencies.
- Keep image and asset usage intentional.
- Confirm `pnpm.cmd build` succeeds before release.
- Prefer static content over client-side data fetching for portfolio copy.

## NFR-003: Inspectable And Verifiable Project Structure

| Field               | Value                                         |
| ------------------- | --------------------------------------------- |
| Category            | Maintainability                               |
| Status              | Draft                                         |
| Severity            | High                                          |
| Applicability       | All                                           |
| Verification Method | CodeReview, StaticAnalysis, Manual            |
| Source              | [Project Brief](../planning/project-brief.md) |

The project must remain easy for a reviewer or future maintainer to inspect,
modify, and verify from the repository.

### NFR-003 Verification

- Keep TypeScript, DOM rendering, styling, and content data responsibilities
  clear.
- Keep public docs mapped from `docs/README.md`.
- Keep docs and ADRs updated when project structure changes.
- Run the available checks before claiming implementation completion.

## NFR-004: Public Information Safety

| Field               | Value                                                        |
| ------------------- | ------------------------------------------------------------ |
| Category            | Compliance                                                   |
| Status              | Draft                                                        |
| Severity            | High                                                         |
| Applicability       | All                                                          |
| Verification Method | Checklist, CodeReview                                        |
| Source              | [ADR-0004](../adr/0004-keep-portfolio-claims-public-safe.md) |

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

## NFR-005: Static Cloudflare Deployment

| Field               | Value                                                    |
| ------------------- | -------------------------------------------------------- |
| Category            | Deployment                                               |
| Status              | Draft                                                    |
| Severity            | High                                                     |
| Applicability       | WebFE                                                    |
| Verification Method | StaticAnalysis, Checklist                                |
| Source              | [ADR-0007](../adr/0007-use-cloudflare-pages-delivery.md) |

The site must deploy to Cloudflare Pages as static build output without an
application server or backend runtime. Compatibility with another hosting
provider is not required.

### NFR-005 Verification

- Configure Vite asset paths for the Cloudflare Pages root path.
- Avoid backend runtime assumptions.
- Keep client-side routing optional or static-hosting safe.
- Verify the generated build locally and on the selected static host.

## NFR-006: Responsive Usability

| Field               | Value                 |
| ------------------- | --------------------- |
| Category            | Usability             |
| Status              | Draft                 |
| Severity            | High                  |
| Applicability       | WebFE                 |
| Verification Method | Manual, BrowserReview |
| Source              | Project Owner         |

The portfolio must preserve readable content, coherent layout, and usable
controls across supported mobile and desktop viewports.

### NFR-006 Verification

- Check representative narrow mobile, tablet, and desktop viewports.
- Prevent unintended horizontal overflow and text clipping.
- Keep touch targets and controls usable without layout shifts.
- Confirm that dynamic content does not overlap adjacent content.

## NFR-007: Intellectual Property And License Boundary

| Field               | Value                                                              |
| ------------------- | ------------------------------------------------------------------ |
| Category            | Compliance                                                         |
| Status              | Draft                                                              |
| Severity            | High                                                               |
| Applicability       | All                                                                |
| Verification Method | Checklist, CodeReview                                              |
| Source              | [ADR-0005](../adr/0005-scope-code-license-and-portfolio-rights.md) |

The repository and product must keep the MIT-licensed code boundary distinct
from All Rights Reserved portfolio materials and third-party asset terms.

### NFR-007 Verification

- Keep root `LICENSE` and `NOTICE.md` language aligned.
- Review product notices and third-party attribution before release.
- Do not represent protected portfolio materials as MIT-licensed code.
- Record exceptions close to the affected asset or in a linked attribution
  surface.

## NFR-008: Dependency License And Supply Chain Policy

| Field               | Value                                              |
| ------------------- | -------------------------------------------------- |
| Category            | Security, Compliance                               |
| Status              | Draft                                              |
| Severity            | High                                               |
| Applicability       | Repository                                         |
| Verification Method | AutomatedReview, CodeReview                        |
| Source              | [Supply Chain Policy](../security/supply-chain.md) |

Dependency changes must be reviewable for known vulnerabilities, declared
licenses, version intent, and package provenance before integration.

### NFR-008 Verification

- Keep direct dependencies exactly pinned and the lockfile reviewable.
- Run Dependency Review for pull requests that change dependencies.
- Reject dependency licenses outside the reviewed allowlist until manually
  approved.
- Use Dependabot and supported GitHub security alerts to surface maintenance and
  vulnerability work.
- Treat automated license metadata as a policy signal, not a complete legal
  compliance opinion.

## NFR-009: Release Traceability

| Field               | Value                                                    |
| ------------------- | -------------------------------------------------------- |
| Category            | Release, Maintainability                                 |
| Status              | Draft                                                    |
| Severity            | High                                                     |
| Applicability       | Repository, Production                                   |
| Verification Method | AutomatedReview, Checklist                               |
| Source              | [Deployment Architecture](../architecture/deployment.md) |

Each production release must be traceable to a version, source revision,
release notes, deployed build, and machine-readable dependency inventory.

### NFR-009 Verification

- Use the approved SemVer tag for each production release.
- Generate release notes from merged pull request metadata.
- Attach a validated release SBOM without committing generated release artifacts.
- Keep release workflow evidence available from GitHub Actions and GitHub
  Releases.

## NFR-010: Search And Social Discoverability

| Field               | Value                  |
| ------------------- | ---------------------- |
| Category            | Discoverability        |
| Status              | Draft                  |
| Severity            | Medium                 |
| Applicability       | WebFE, Production      |
| Verification Method | StaticAnalysis, Manual |
| Source              | Project Owner          |

Public portfolio pages must expose accurate metadata for search engines, social
sharing, and answer-oriented discovery without overstating portfolio claims.

### NFR-010 Verification

- Provide accurate page titles, descriptions, canonical URLs, and social
  metadata for the production URL.
- Keep crawl and index directives aligned with the deployed environment.
- Validate structured or answer-oriented metadata before publishing it.

## NFR-011: Privacy-Aware Telemetry

| Field               | Value                         |
| ------------------- | ----------------------------- |
| Category            | Privacy, Observability        |
| Status              | Draft                         |
| Severity            | High                          |
| Applicability       | Production                    |
| Verification Method | ArchitectureReview, Checklist |
| Source              | Project Owner                 |

Monitoring, logging, and visitor analytics must remain proportional to the
portfolio's operational needs and respect visitor privacy.

### NFR-011 Verification

- Select telemetry only after documenting the operational or product question
  it answers.
- Minimize collected identifiers and retention.
- Disclose analytics or tracking behavior where required.
- Add consent controls when the selected tool or jurisdiction requires them.
- Keep telemetry credentials and private operational data out of the repository.

## NFR-012: Third-Party Material License Compliance

| Field               | Value                                                          |
| ------------------- | -------------------------------------------------------------- |
| Category            | Compliance                                                     |
| Status              | Draft                                                          |
| Severity            | High                                                           |
| Applicability       | Repository, Production                                         |
| Verification Method | AutomatedReview, Checklist, Manual                             |
| Source              | [License Compliance Review](../security/license-compliance.md) |

No public production release may distribute third-party code, images, fonts,
media, or other material without an identifiable source, reviewed usage terms,
and satisfied notice or attribution obligations.

### NFR-012 Verification

- Maintain an inventory of third-party material and its source, license,
  modifications, obligations, evidence, and disposition.
- Scan source and packaged material with a pinned license and copyright detection
  tool before the first production release and after relevant changes.
- Review copied snippets, media, fonts, and generated assets manually because
  package metadata and scanners cannot establish complete legal compliance.
- Add required attribution and license text to the appropriate repository or
  product surface.
- Block release while shipped material has an unknown, rejected, or unresolved
  disposition.
- Preserve scan and approval evidence with the release workflow.

## NFR-013: Production Health And Recovery

| Field               | Value                                                         |
| ------------------- | ------------------------------------------------------------- |
| Category            | Reliability, Operations                                       |
| Status              | Draft                                                         |
| Severity            | High                                                          |
| Applicability       | Production                                                    |
| Verification Method | AutomatedReview, SyntheticMonitoring, RunbookReview           |
| Source              | [Production Readiness](../operations/production-readiness.md) |

The production portfolio must provide externally verifiable availability,
failure notification, and a practical recovery path appropriate for a static
site maintained by one owner.

### NFR-013 Verification

- Run a post-deployment smoke check against the canonical production URL and a
  release-critical asset.
- Use an external synthetic monitor to detect production unavailability and
  notify the project owner.
- Correlate health evidence with the deployed release version.
- Keep a concise incident triage and rollback runbook.
- Verify the selected host's rollback mechanism before the first public release.
- Confirm recovery with the same smoke checks used after deployment.
