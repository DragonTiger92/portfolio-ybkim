# Product Backlog

This document is the source of truth for implementation-sized work planned for
the project. A Product Backlog Item (PBI) is smaller than a roadmap phase and is
tracked directly in this version-controlled document. A phase-sized pull request
may implement multiple PBIs and must list them in its metadata.

Requirement-to-PBI relationships are maintained in the
[Requirements Traceability Matrix](requirements-traceability-matrix.md). The
`References` field is reserved for ADRs, policies, or other planning context; it
does not replace requirement traceability.

Each phase heading supplies the `Phase` value for the PBI table beneath it.

## Schema

| Field               | Meaning                                                 |
| ------------------- | ------------------------------------------------------- |
| PBI ID              | Stable identifier for an implementation-sized work item |
| Type                | Primary work category                                   |
| Title               | Short implementation outcome                            |
| Status              | Backlog lifecycle state                                 |
| Phase               | Roadmap phase that owns the work                        |
| Priority            | Relative importance within the roadmap phase            |
| References          | Related ADR, policy, or planning context                |
| Acceptance Criteria | Compact completion signal                               |
| Notes               | Constraints or deferred implementation detail           |

## Status Vocabulary

| Status      | Meaning                                             |
| ----------- | --------------------------------------------------- |
| Backlog     | Identified but not ready to start                   |
| Ready       | Refined enough to begin                             |
| In Progress | Actively being implemented                          |
| Blocked     | Cannot proceed until a named dependency is resolved |
| Done        | Acceptance criteria are satisfied                   |
| Cancelled   | Intentionally removed from the roadmap              |

## When To Add A Feature Specification

A Product Backlog Item answers what outcome should be delivered, when it should
be delivered, and how completion is accepted. A feature specification is an
optional detailed design document for one complex user-facing capability. It
describes behavior such as interaction flows, states, validation, edge cases,
data contracts, and failure handling before implementation.

This project does not require one feature specification per PBI. Functional and
non-functional requirements, PBI acceptance criteria, architecture documents,
and ADRs are sufficient while a feature remains small and understandable. Add a
document under `docs/specifications/` only when a feature:

- spans multiple PBIs or implementation modules;
- has several user-visible states, transitions, or failure paths;
- introduces a data or integration contract that needs independent review; or
- cannot be implemented consistently from its requirements and acceptance
  criteria alone.

When a feature specification is added, link it from the affected PBIs through
`References`; do not use it as a second backlog or duplicate requirement IDs.

## PH-001 Product Foundation Baseline

Content PBIs in this phase also use
[Project Content Inventory](../content/project-content-inventory.md) for
project, link, and publication-boundary planning.

| PBI ID    | Type       | Title                                             | Status      | Priority | References                                                           | Acceptance Criteria                                                        | Notes                                                                                                                           |
| --------- | ---------- | ------------------------------------------------- | ----------- | -------- | -------------------------------------------------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `PBI-001` | Docs       | Build public documentation baseline               | In Progress | P1       | -                                                                    | Public docs map and core documents exist                                   | -                                                                                                                               |
| `PBI-002` | Docs       | Add ADR and SBOM artifacts                        | In Progress | P1       | [ADR-0010](../adr/0010-use-cyclonedx-json-sbom.md)                   | ADRs and the CycloneDX SBOM workflow are reviewable                        | -                                                                                                                               |
| `PBI-003` | Quality    | Establish GitHub Flow and CI baseline             | In Progress | P1       | [ADR-0006](../adr/0006-use-github-flow-and-ci-quality-gates.md)      | Workflow baseline branch is ready for pull request review                  | Uses PH/PBI-linked branch names and docs-based tracking                                                                         |
| `PBI-004` | Content    | Draft intro section copy                          | Ready       | P1       | [Project Brief](project-brief.md)                                    | First-viewport positioning copy exists                                     | -                                                                                                                               |
| `PBI-005` | Content    | Draft project showcase content                    | Ready       | P1       | [Content Model](../architecture/content-model.md)                    | Project summaries and public links are drafted                             | -                                                                                                                               |
| `PBI-016` | Docs       | Normalize planning schema and requirement tracing | In Progress | P1       | [ADR-0008](../adr/0008-use-docs-based-work-tracking.md)              | PBI terminology and complete FR/NFR traceability exist                     | -                                                                                                                               |
| `PBI-017` | Automation | Automate GitHub Milestone lifecycle               | Cancelled   | P1       | [ADR-0008](../adr/0008-use-docs-based-work-tracking.md)              | Legacy synchronization is removed without duplicate work-state stores      | Implemented and bootstrapped, then retired before baseline merge                                                                |
| `PBI-018` | Security   | Establish repository security settings baseline   | In Progress | P1       | [Supply Chain Policy](../security/supply-chain.md)                   | Supported GitHub security controls are enabled and recorded                | Core controls are live; mark Done after the Terraform-managed ruleset is applied following the baseline merge                   |
| `PBI-019` | Quality    | Optimize event-specific quality gates             | Done        | P2       | [ADR-0006](../adr/0006-use-github-flow-and-ci-quality-gates.md)      | Each Git event runs the smallest sufficient verification set               | Staged pre-commit, explicit local completion, comprehensive PR, path-scoped Terraform, and scheduled audit gates are documented |
| `PBI-020` | Security   | Enforce dependency license policy                 | In Progress | P1       | [Supply Chain Policy](../security/supply-chain.md)                   | Pull requests fail for unapproved dependency licenses                      | Treat Dependency Review as a policy gate, not a complete legal audit                                                            |
| `PBI-034` | Infra      | Establish GitHub governance as code               | In Progress | P1       | [GitHub Governance](../architecture/github-governance.md)            | Repository settings and the `main` ruleset have a reviewed Terraform plan  | Keep deployment infrastructure in a separate ownership boundary                                                                 |
| `PBI-035` | Quality    | Enforce file-size and module-boundary guardrails  | Done        | P2       | -                                                                    | Category-specific limits and refactoring guidance are verified             | Uses existing ESLint and dependency-free Node checks                                                                            |
| `PBI-036` | Quality    | Establish semantic web and component baseline     | Done        | P1       | [ADR-0009](../adr/0009-adopt-astro-static-component-architecture.md) | Static routes, reusable UI boundaries, and warning-free web checks exist   | Native semantics, Astro static output, HTML validators, and browser accessibility checks                                        |
| `PBI-037` | Quality    | Add Astro source linting                          | Done        | P2       | [ADR-0009](../adr/0009-adopt-astro-static-component-architecture.md) | Astro templates pass source-aware lint without parser warnings             | Uses `eslint-plugin-astro`; keep rendered accessibility coverage in the existing HTML and browser accessibility gates           |
| `PBI-038` | Security   | Adopt the upstream esbuild security fix           | Done        | P2       | [Supply Chain Policy](../security/supply-chain.md)                   | An Astro-compatible esbuild version removes the low-severity audit finding | Resolved through Astro's declared dependency graph without an `esbuild` override                                                |

### PBI-036 Product Boundary

PBI-036 owns the Astro route shell, reusable component and content boundaries,
responsive structure, and automated semantic-web baseline needed to replace the
generic Vite scaffold. Landing-page copy, project evidence, contact details,
visual refinement, and product acceptance remain PH-002 work. The current page
content is a public-safe structural baseline, not evidence that PH-002 PBIs are
complete.

### PBI-017 Retirement Notes

- The synchronization workflow and bootstrap state were verified before the
  work-tracking model was simplified.
- Existing Issues and Milestones were closed with migration context rather than
  deleted.
- The implementation is removed because ADR-0008 makes planning documents the
  only work-status source of truth.

## PH-002 Static Portfolio Implementation

Implementation PBIs that render project, link, or contact data use
[Project Content Inventory](../content/project-content-inventory.md) as the
planning input alongside the content model.

| PBI ID    | Type    | Title                                   | Status      | Priority | References                                                                                                                                   | Acceptance Criteria                                                                            | Notes                                                                                                                                                                                                |
| --------- | ------- | --------------------------------------- | ----------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `PBI-006` | Feature | Add repository and contact navigation   | Backlog     | P1       | [Content Model](../architecture/content-model.md)                                                                                            | Repository and contact paths are usable                                                        | -                                                                                                                                                                                                    |
| `PBI-007` | Feature | Implement skills section                | Backlog     | P1       | [Content Model](../architecture/content-model.md)                                                                                            | Skills are grouped by delivery responsibility                                                  | -                                                                                                                                                                                                    |
| `PBI-008` | Quality | Validate accessibility basics           | Backlog     | P1       | -                                                                                                                                            | Primary flows pass accessibility review                                                        | -                                                                                                                                                                                                    |
| `PBI-009` | Quality | Validate performance and static build   | Backlog     | P1       | [ADR-0009](../adr/0009-adopt-astro-static-component-architecture.md)                                                                         | Static build and agreed performance checks pass                                                | Start performance metrics at the production-like deployment level; define a small performance budget before adding a gate; consider Lighthouse lab evidence; feed agreed asset checks into `PBI-039` |
| `PBI-021` | Feature | Implement intro section                 | Backlog     | P1       | [Project Brief](project-brief.md)                                                                                                            | First viewport communicates positioning and action                                             | -                                                                                                                                                                                                    |
| `PBI-022` | Feature | Implement project showcase              | Backlog     | P1       | [Content Model](../architecture/content-model.md)                                                                                            | Project evidence is concise and inspectable                                                    | -                                                                                                                                                                                                    |
| `PBI-023` | UI      | Implement adaptive color theme          | Backlog     | P1       | -                                                                                                                                            | System theme, manual toggle, and persistence work                                              | -                                                                                                                                                                                                    |
| `PBI-024` | UI      | Implement responsive mobile experience  | Backlog     | P1       | -                                                                                                                                            | Core content and actions work from mobile to desktop                                           | -                                                                                                                                                                                                    |
| `PBI-025` | Content | Publish portfolio rights notice         | Backlog     | P1       | [ADR-0005](../adr/0005-scope-code-license-and-portfolio-rights.md)                                                                           | Product and asset notices communicate the rights boundary                                      | -                                                                                                                                                                                                    |
| `PBI-040` | Content | Structure portfolio content source data | Done        | P1       | [Project Content Inventory](../content/project-content-inventory.md), [Portfolio Content Source](../content/portfolio-content-source.md)     | Project, contact, link, skill, and disclosure source data are implementation-ready             | Ready public projects are separated from deferred professional evidence; private source is summarized only through disclosure-safe boundaries                                                        |
| `PBI-041` | Content | Rewrite public resume artifact          | In Progress | P1       | [Resume And Portfolio Boundary](../content/resume-portfolio-boundary.md), [Portfolio Content Source](../content/portfolio-content-source.md) | Reviewed editable resume source and public-safe PDF artifact are ready or consciously deferred | Initial Korean and English private DOCX drafts exist; metrics, publication review, and final PDF export remain                                                                                       |

## PH-003 Deployment And Operations Readiness

| PBI ID    | Type       | Title                                           | Status  | Priority | References                                                                                             | Acceptance Criteria                                                                    | Notes                                                                                                                                                                                         |
| --------- | ---------- | ----------------------------------------------- | ------- | -------- | ------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `PBI-010` | Deploy     | Verify static deployment path                   | Backlog | P2       | [Deployment Architecture](../architecture/deployment.md)                                               | Deployment path is verified end to end                                                 | -                                                                                                                                                                                             |
| `PBI-011` | Release    | Establish release deployment workflow           | Backlog | P1       | [ADR-0007](../adr/0007-use-cloudflare-pages-delivery.md)                                               | A controlled production release can publish `v1.0.0`                                   | Share one deployment implementation between automatic `main` deploys and manual formal releases; tag after smoke checks                                                                       |
| `PBI-012` | Infra      | Define infrastructure as code baseline          | Backlog | P2       | [Deployment Architecture](../architecture/deployment.md)                                               | Managed infrastructure scope is explicit                                               | Select Cloudflare resource scope and a durable remote-state backend during PH-003                                                                                                             |
| `PBI-026` | Security   | Protect the preview environment                 | Backlog | P1       | [Deployment Architecture](../architecture/deployment.md)                                               | Preview access is authenticated and auditable                                          | Deploy manually with `workflow_dispatch`; select the Cloudflare Access identity policy during implementation                                                                                  |
| `PBI-027` | Release    | Publish generated release notes                 | Backlog | P1       | [Release Configuration](../../.github/release.yml)                                                     | GitHub Release notes reflect merged pull requests                                      | -                                                                                                                                                                                             |
| `PBI-028` | Security   | Generate and attach a CycloneDX release SBOM    | Backlog | P1       | [ADR-0010](../adr/0010-use-cyclonedx-json-sbom.md), [Supply Chain Policy](../security/supply-chain.md) | Each production GitHub Release includes a validated CycloneDX JSON SBOM                | See SBOM release notes below                                                                                                                                                                  |
| `PBI-029` | Discovery  | Add launch discovery metadata                   | Backlog | P1       | -                                                                                                      | Production pages expose minimum search and social metadata                             | -                                                                                                                                                                                             |
| `PBI-030` | Compliance | Establish pre-release license compliance review | Backlog | P1       | [License Compliance](../security/license-compliance.md)                                                | No unresolved third-party material ships in a public production release                | Combine automated evidence collection with owner approval                                                                                                                                     |
| `PBI-031` | Operations | Run post-deployment production smoke checks     | Backlog | P1       | [Production Readiness](../operations/production-readiness.md)                                          | A failed homepage or critical-asset check blocks or rolls back release completion      | Do not treat a static health file as the only signal                                                                                                                                          |
| `PBI-032` | Operations | Establish uptime monitoring and alerting        | Backlog | P1       | [Production Readiness](../operations/production-readiness.md)                                          | External probes detect production unavailability and notify the owner                  | Select the provider during implementation                                                                                                                                                     |
| `PBI-033` | Operations | Document incident response and rollback         | Backlog | P1       | [Production Readiness](../operations/production-readiness.md)                                          | Production failures have a tested owner, triage path, and rollback procedure           | Keep the runbook proportional to a single-maintainer static site                                                                                                                              |
| `PBI-039` | Quality    | Regulate and verify image asset formats         | Backlog | P2       | [Deployment Architecture](../architecture/deployment.md)                                               | CI or release workflow verifies agreed image format, optimization, and budget criteria | Implement after real asset inventory and performance budget exist; do not add image-processing dependencies or deployment workflow changes before the exact optimization approach is selected |

### PBI-028 SBOM Release Notes

- Generate CycloneDX JSON during the production release workflow, attach it to
  the GitHub Release, and do not commit generated release SBOM files.
- Validate the generated document against the selected CycloneDX schema.
- Do not translate SPDX `NOASSERTION` into CycloneDX. Preserve missing license
  metadata as unresolved or omitted generator output and require policy review
  instead of inventing a conclusion.
- Verify that the root component represents the MIT code license and the All
  Rights Reserved portfolio-material boundary using a valid named license or
  SPDX expression supported by the selected CycloneDX version.
- Reuse the root `pnpm.cmd sbom:cyclonedx` command unless release automation
  needs a narrower artifact path.

### PBI-039 Image Asset Format Notes

- The current tracked image assets are `public/favicon.svg` and
  `public/icons.svg`; both are vector UI assets and are not WebP conversion
  candidates.
- Prefer SVG for icons, logos, diagrams, simple marks, UI symbols, and other
  vector artwork that needs sharp scaling, small source size, themeable styling,
  or source-level editability.
- Do not convert SVG to WebP merely for uniformity. Convert only if the source is
  no longer meaningfully vector, such as a complex embedded raster illustration,
  and the generated raster output is smaller and visually acceptable.
- Serve suitable photographic, illustrative, screenshot, or other raster images
  as WebP when WebP is smaller at acceptable visual quality.
- Keep PNG or JPEG only when they are source assets, required fallbacks, or better
  for precision-critical review than the generated WebP.
- Keep original source images reviewable for rights, attribution, editing, and
  future re-encoding; generated WebP derivatives should not become the only
  source asset.
- Do not convert tiny files, already-optimized files, or precision-critical
  images when WebP does not provide a meaningful size or delivery benefit.
- Defer automation until `PBI-009` defines the performance budget and real asset
  inventory. Start with verification of built output before adding conversion
  tooling.
- If a future pipeline generates or verifies image derivatives, check dimensions,
  file format, `alt` text, fallback behavior where needed, license/rights
  records, and absence of private source material in deployed assets.

## PH-004 Post-Launch Optimization

| PBI ID    | Type       | Title                               | Status  | Priority | References                                                              | Acceptance Criteria                                                             | Notes                                                                                                                                                                                 |
| --------- | ---------- | ----------------------------------- | ------- | -------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `PBI-013` | Discovery  | Improve post-launch discoverability | Backlog | P2       | -                                                                       | SEO, AEO, and GEO improvements are evidence-based                               | Evaluate Lighthouse SEO signals alongside manual metadata review when a public production URL exists; skip bot-dependent crawl or search-index evidence on Access-protected previews  |
| `PBI-014` | Operations | Optimize post-launch observability  | Backlog | P2       | [Production Readiness](../operations/production-readiness.md)           | Monitoring and logging improvements follow operational evidence                 | Keep provider, CDN, request, and error signals separate from route-interest analytics unless one observed question needs both                                                         |
| `PBI-015` | Analytics  | Add privacy-aware visitor analytics | Backlog | P2       | [Information Architecture](../architecture/information-architecture.md) | Route, referrer, outbound action, disclosure, and review metrics are documented | Prefer Cloudflare Web Analytics or a comparable cookie-less tool; treat GA4 as non-default because it adds cookie and consent review; do not add a server component without a new ADR |

## Priority Vocabulary

| Priority | Meaning                                    |
| -------- | ------------------------------------------ |
| P1       | Required for the next meaningful milestone |
| P2       | Valuable but can follow the core milestone |
| P3       | Optional improvement or exploration        |
