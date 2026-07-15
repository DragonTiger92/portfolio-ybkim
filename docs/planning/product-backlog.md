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

| PBI ID    | Type       | Title                                             | Status    | Priority | References                                                                                                                  | Acceptance Criteria                                                                         | Notes                                                                                                                                          |
| --------- | ---------- | ------------------------------------------------- | --------- | -------- | --------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `PBI-001` | Docs       | Build public documentation baseline               | Done      | P1       | -                                                                                                                           | Public docs map and core documents exist                                                    | Documentation map and core public docs are reviewable under `docs/`                                                                            |
| `PBI-002` | Docs       | Add ADR and SBOM artifacts                        | Done      | P1       | [ADR-0010](../adr/0010-use-cyclonedx-json-sbom.md)                                                                          | ADRs and the CycloneDX SBOM workflow are reviewable                                         | CycloneDX command, ADR, and supply-chain notes are reviewable; generated SBOM remains local/release artifact                                   |
| `PBI-003` | Quality    | Establish GitHub Flow and CI baseline             | Done      | P1       | [ADR-0006](../adr/0006-use-github-flow-and-ci-quality-gates.md)                                                             | Workflow baseline branch is ready for pull request review                                   | CI, PR metadata, dependency review, pull request template, and PH/PBI-linked branch guidance are ready for PR review                           |
| `PBI-004` | Content    | Draft intro section copy                          | Done      | P1       | [Project Brief](project-brief.md)                                                                                           | First-viewport positioning copy exists                                                      | Exact first-viewport copy is frozen in [Landing Page Copy](../content/landing-page-copy.md)                                                    |
| `PBI-005` | Content    | Draft project showcase content                    | Done      | P1       | [Content Model](../architecture/content-model.md)                                                                           | Project summaries and public links are drafted                                              | Project card and detail copy seeds are frozen in [Landing Page Copy](../content/landing-page-copy.md)                                          |
| `PBI-046` | Design     | Define Phase 2 wireframe brief                    | Done      | P1       | [Phase 2 Wireframe Brief](../design/phase-2-wireframe-brief.md)                                                             | Landing and project-detail composition, CTA hierarchy, and responsive placement are defined | Markdown low-fi brief only; no Figma, image mockup, or high-fidelity design draft; implementation PBIs remain in PH-002                        |
| `PBI-016` | Docs       | Normalize planning schema and requirement tracing | Done      | P1       | [ADR-0008](../adr/0008-use-docs-based-work-tracking.md)                                                                     | PBI terminology and complete FR/NFR traceability exist                                      | Product Backlog and Requirements Traceability Matrix now carry the PH/PBI work-state model                                                     |
| `PBI-017` | Automation | Automate GitHub Milestone lifecycle               | Cancelled | P1       | [ADR-0008](../adr/0008-use-docs-based-work-tracking.md)                                                                     | Legacy synchronization is removed without duplicate work-state stores                       | Implemented and bootstrapped, then retired before baseline merge                                                                               |
| `PBI-018` | Security   | Establish repository security settings baseline   | Done      | P1       | [Supply Chain Policy](../security/supply-chain.md)                                                                          | Supported GitHub security controls are enabled and recorded                                 | Terraform-managed security controls and the active `Protect main` ruleset were verified through the GitHub API                                 |
| `PBI-019` | Quality    | Optimize event-specific quality gates             | Done      | P2       | [ADR-0006](../adr/0006-use-github-flow-and-ci-quality-gates.md)                                                             | Each Git event runs the smallest sufficient verification set                                | Staged pre-commit, explicit local completion, comprehensive PR, path-scoped Terraform, and scheduled audit gates are documented                |
| `PBI-020` | Security   | Enforce dependency license policy                 | Done      | P1       | [Supply Chain Policy](../security/supply-chain.md)                                                                          | Pull requests fail for unapproved dependency licenses                                       | Dependency Review uses the reviewed license allow-list; this remains a policy gate, not a complete legal audit                                 |
| `PBI-047` | Automation | Define Dependabot update lifecycle                | Done      | P1       | [Supply Chain Policy](../security/supply-chain.md), [GitHub Governance](../architecture/github-governance.md)               | Dependency updates are classified, safely routed, owner-visible, and cleaned up after merge | Patch, minor, and reviewed major paths were exercised; merged branches were removed and failed bot updates were replaced with recorded context |
| `PBI-048` | Quality    | Refine topic branch and worktree lifecycle        | Done      | P2       | [Development Workflow](../process/development-workflow.md), [ADR-0006](../adr/0006-use-github-flow-and-ci-quality-gates.md) | Phase, PBI, stacked, automation, and worktree branch boundaries are explicit                | Preserve lightweight GitHub Flow; use additional branches only when they improve review, verification, delivery, or rollback boundaries        |
| `PBI-034` | Infra      | Establish GitHub governance as code               | Done      | P1       | [GitHub Governance](../architecture/github-governance.md)                                                                   | Repository settings and the `main` ruleset have a reviewed Terraform plan                   | The owner-reviewed HCP Terraform plan imported existing controls and applied repository settings, labels, variables, and the active ruleset    |
| `PBI-035` | Quality    | Enforce file-size and module-boundary guardrails  | Done      | P2       | -                                                                                                                           | Category-specific limits and refactoring guidance are verified                              | Uses existing ESLint and dependency-free Node checks                                                                                           |
| `PBI-036` | Quality    | Establish semantic web and component baseline     | Done      | P1       | [ADR-0009](../adr/0009-adopt-astro-static-component-architecture.md)                                                        | Static routes, reusable UI boundaries, and warning-free web checks exist                    | Native semantics, Astro static output, HTML validators, and browser accessibility checks                                                       |
| `PBI-037` | Quality    | Add Astro source linting                          | Done      | P2       | [ADR-0009](../adr/0009-adopt-astro-static-component-architecture.md)                                                        | Astro templates pass source-aware lint without parser warnings                              | Uses `eslint-plugin-astro`; keep rendered accessibility coverage in the existing HTML and browser accessibility gates                          |
| `PBI-038` | Security   | Adopt the upstream esbuild security fix           | Done      | P2       | [Supply Chain Policy](../security/supply-chain.md)                                                                          | An Astro-compatible esbuild version removes the low-severity audit finding                  | Resolved through Astro's declared dependency graph without an `esbuild` override                                                               |

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

| PBI ID    | Type    | Title                                   | Status  | Priority | References                                                                                                                                                                                                         | Acceptance Criteria                                                                                             | Notes                                                                                                                                                                                                                                                                            |
| --------- | ------- | --------------------------------------- | ------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `PBI-006` | Feature | Add repository and contact navigation   | Backlog | P1       | [Content Model](../architecture/content-model.md)                                                                                                                                                                  | Repository and contact paths are usable                                                                         | -                                                                                                                                                                                                                                                                                |
| `PBI-007` | Feature | Implement skills section                | Backlog | P1       | [Content Model](../architecture/content-model.md)                                                                                                                                                                  | Skills are grouped by delivery responsibility                                                                   | -                                                                                                                                                                                                                                                                                |
| `PBI-008` | Quality | Validate accessibility basics           | Done    | P1       | -                                                                                                                                                                                                                  | Primary flows pass accessibility review                                                                         | Rendered heading outlines, titled sectioning elements, pointer targets, responsive overflow, and automated WCAG checks pass on desktop and mobile; page identity remains separate from paragraph-like positioning copy                                                           |
| `PBI-009` | Quality | Validate performance and static build   | Backlog | P1       | [ADR-0009](../adr/0009-adopt-astro-static-component-architecture.md)                                                                                                                                               | Static build and agreed performance checks pass                                                                 | Start performance metrics at the production-like deployment level; define a small performance budget before adding a gate; consider Lighthouse lab evidence; feed agreed asset checks into `PBI-039`                                                                             |
| `PBI-021` | Feature | Implement intro section                 | Done    | P1       | [Project Brief](project-brief.md)                                                                                                                                                                                  | First viewport communicates positioning and action                                                              | Korean UI copy uses direct, natural phrasing for the job-status cue, role framing, and evidence bridge                                                                                                                                                                           |
| `PBI-022` | Feature | Implement project showcase              | Done    | P1       | [Content Model](../architecture/content-model.md)                                                                                                                                                                  | Project evidence is concise and inspectable                                                                     | Korean-facing classifications, roles, tags, and explanatory copy are localized while product and technology names remain intact                                                                                                                                                  |
| `PBI-023` | UI      | Implement adaptive color theme          | Done    | P1       | -                                                                                                                                                                                                                  | System theme, manual toggle, and persistence work                                                               | Owner-provided blue identity now drives accessible light and dark tokens; browser theme color follows system changes until an explicit persisted choice is made                                                                                                                  |
| `PBI-024` | UI      | Implement responsive mobile experience  | Done    | P1       | -                                                                                                                                                                                                                  | Core content and actions work from mobile to desktop                                                            | Asymmetric intro, featured public case study, editorial professional-work list, and project evidence sidebar preserve the same reading order from 390px to wide desktop; dedicated layout regression tests cover both compositions                                               |
| `PBI-025` | Content | Publish portfolio rights notice         | Done    | P1       | [ADR-0005](../adr/0005-scope-code-license-and-portfolio-rights.md)                                                                                                                                                 | Product and asset notices communicate the rights boundary                                                       | Root notice, Korean footer, and reviewed-material register communicate the owner-provided generated brand subset and its All Rights Reserved boundary                                                                                                                            |
| `PBI-040` | Content | Structure portfolio content source data | Done    | P1       | [Project Content Inventory](../content/project-content-inventory.md), [Portfolio Content Source](../content/portfolio-content-source.md)                                                                           | Project, contact, link, skill, and disclosure source data are implementation-ready                              | Ready public projects are separated from deferred professional evidence; private source is summarized only through disclosure-safe boundaries                                                                                                                                    |
| `PBI-041` | Content | Rewrite public resume artifact          | Done    | P1       | [Resume And Portfolio Boundary](../content/resume-portfolio-boundary.md), [Portfolio Content Source](../content/portfolio-content-source.md)                                                                       | Reviewed editable resume source and public-safe PDF artifact are ready or consciously deferred                  | Final Korean PDF is published at `/assets/resume/yb-kim-resume.pdf` after content revision, draft-footer removal, privacy review, and visual QA; the English companion remains application-only for the initial Korean portfolio                                                 |
| `PBI-043` | UI      | Add recruiter job-status tag            | Done    | P1       | [Project Brief](project-brief.md), [Project Content Inventory](../content/project-content-inventory.md)                                                                                                            | A recruiter-visible job-seeking status tag appears in the agreed above-the-fold intro position                  | Treat this as the explicit job-status element within the broader intro-section implementation; decide final label and exact placement during implementation; candidate labels include availability-oriented wording such as available for opportunities or not currently looking |
| `PBI-044` | Feature | Add recruiter contact CTA               | Done    | P1       | [Content Model](../architecture/content-model.md), [Portfolio Content Source](../content/portfolio-content-source.md)                                                                                              | Recruiters can contact the owner through a clear primary landing-page CTA                                       | Treat this as the landing-page primary contact action within the broader contact/navigation model; use selected public contact channels; do not add a separate contact route unless a later IA decision changes the first implementation scope                                   |
| `PBI-045` | Content | Freeze Phase 2 content input            | Done    | P1       | [Project Content Inventory](../content/project-content-inventory.md), [Portfolio Content Source](../content/portfolio-content-source.md), [Resume And Portfolio Boundary](../content/resume-portfolio-boundary.md) | Phase 2 project, contact, link, skill, resume-action, and disclosure inputs are approved or explicitly deferred | Three public-source project details, generalized professional highlights, ready contact actions, grouped skills, a live Korean resume action, owner-approved Karly/Book-Kong media eligibility, and Phase 3 deferrals are frozen; implementation PBIs remain open                |

## PH-003 Deployment And Operations Readiness

| PBI ID    | Type       | Title                                           | Status  | Priority | References                                                                                                                     | Acceptance Criteria                                                                                         | Notes                                                                                                                                                                                         |
| --------- | ---------- | ----------------------------------------------- | ------- | -------- | ------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `PBI-010` | Deploy     | Verify static deployment path                   | Backlog | P2       | [Deployment Architecture](../architecture/deployment.md)                                                                       | Deployment path is verified end to end                                                                      | -                                                                                                                                                                                             |
| `PBI-011` | Release    | Establish release deployment workflow           | Backlog | P1       | [ADR-0007](../adr/0007-use-cloudflare-pages-delivery.md)                                                                       | A controlled production release can publish `v1.0.0`                                                        | Share one deployment implementation between automatic `main` deploys and manual formal releases; tag after smoke checks                                                                       |
| `PBI-012` | Infra      | Define infrastructure as code baseline          | Backlog | P2       | [Deployment Architecture](../architecture/deployment.md)                                                                       | Managed infrastructure scope is explicit                                                                    | Select Cloudflare resource scope and a durable remote-state backend during PH-003                                                                                                             |
| `PBI-026` | Security   | Protect the preview environment                 | Backlog | P1       | [Deployment Architecture](../architecture/deployment.md)                                                                       | Preview access is authenticated and auditable                                                               | Deploy manually with `workflow_dispatch`; select the Cloudflare Access identity policy during implementation                                                                                  |
| `PBI-027` | Release    | Publish generated release notes                 | Backlog | P1       | [Release Configuration](../../.github/release.yml)                                                                             | GitHub Release notes reflect merged pull requests                                                           | -                                                                                                                                                                                             |
| `PBI-028` | Security   | Generate and attach a CycloneDX release SBOM    | Backlog | P1       | [ADR-0010](../adr/0010-use-cyclonedx-json-sbom.md), [Supply Chain Policy](../security/supply-chain.md)                         | Each production GitHub Release includes a validated CycloneDX JSON SBOM                                     | See SBOM release notes below                                                                                                                                                                  |
| `PBI-029` | Discovery  | Add launch discovery metadata                   | Backlog | P1       | -                                                                                                                              | Production pages expose minimum search and social metadata                                                  | Add Open Graph and Twitter metadata only after PH-003 establishes the production origin; replace or localize the unused English social preview before shipping it                             |
| `PBI-030` | Compliance | Establish pre-release license compliance review | Backlog | P1       | [License Compliance](../security/license-compliance.md)                                                                        | No unresolved third-party material ships in a public production release                                     | Combine automated evidence collection with owner approval                                                                                                                                     |
| `PBI-031` | Operations | Run post-deployment production smoke checks     | Backlog | P1       | [Production Readiness](../operations/production-readiness.md)                                                                  | A failed homepage or critical-asset check blocks or rolls back release completion                           | Do not treat a static health file as the only signal                                                                                                                                          |
| `PBI-032` | Operations | Establish uptime monitoring and alerting        | Backlog | P1       | [Production Readiness](../operations/production-readiness.md)                                                                  | External probes detect production unavailability and notify the owner                                       | Select the provider during implementation                                                                                                                                                     |
| `PBI-033` | Operations | Document incident response and rollback         | Backlog | P1       | [Production Readiness](../operations/production-readiness.md)                                                                  | Production failures have a tested owner, triage path, and rollback procedure                                | Keep the runbook proportional to a single-maintainer static site                                                                                                                              |
| `PBI-039` | Quality    | Regulate and verify image asset formats         | Backlog | P2       | [Deployment Architecture](../architecture/deployment.md)                                                                       | CI or release workflow verifies agreed image format, optimization, and budget criteria                      | Implement after real asset inventory and performance budget exist; do not add image-processing dependencies or deployment workflow changes before the exact optimization approach is selected |
| `PBI-049` | Infra      | Configure custom-domain contact email routing   | Backlog | P2       | [Deployment Architecture](../architecture/deployment.md), [Project Content Inventory](../content/project-content-inventory.md) | A verified custom-domain contact address delivers incoming mail to the existing portfolio Gmail destination | Use receive-only Cloudflare Email Routing after domain adoption; keep the ready Gmail contact as the fallback until routing passes verification                                               |

### PBI-049 Custom-Domain Email Routing Notes

- Select the production domain and one public contact address such as
  `contact@{production-domain}` or `hello@{production-domain}` before configuring
  routing.
- Add and verify `dczwtu12b+portfolio@gmail.com` as the routing destination, then
  configure the required Cloudflare-managed email DNS records and one explicit
  address rule.
- Send a delivery test from an account other than the destination. Confirm that
  the message reaches the Gmail inbox and that the intended filter or label can
  identify it.
- Publish the custom-domain address only after the delivery test passes. Keep the
  existing Gmail contact available as the rollback path if routing is disabled
  or fails.
- Keep paid mailboxes, custom send-as or reply-from behavior, Email Workers,
  catch-all routing, and separate message storage outside this PBI.

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

| PBI ID    | Type       | Title                               | Status  | Priority | References                                                                                                            | Acceptance Criteria                                                                                                      | Notes                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| --------- | ---------- | ----------------------------------- | ------- | -------- | --------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `PBI-013` | Discovery  | Improve post-launch discoverability | Backlog | P2       | -                                                                                                                     | SEO, AEO, and GEO improvements are evidence-based                                                                        | Evaluate Lighthouse SEO signals alongside manual metadata review when a public production URL exists; skip bot-dependent crawl or search-index evidence on Access-protected previews                                                                                                                                                                                                                                                   |
| `PBI-014` | Operations | Optimize post-launch observability  | Backlog | P2       | [Production Readiness](../operations/production-readiness.md)                                                         | Monitoring and logging improvements follow operational evidence                                                          | Keep provider, CDN, request, and error signals separate from route-interest analytics unless one observed question needs both                                                                                                                                                                                                                                                                                                          |
| `PBI-015` | Analytics  | Add privacy-aware visitor analytics | Backlog | P2       | [Information Architecture](../architecture/information-architecture.md)                                               | Route, referrer, outbound action, disclosure, and review metrics are documented                                          | Prefer Cloudflare Web Analytics or a comparable cookie-less tool; treat GA4 as non-default because it adds cookie and consent review; do not add a server component without a new ADR                                                                                                                                                                                                                                                  |
| `PBI-042` | Feature    | Provide English portfolio content   | Backlog | P2       | [Content Model](../architecture/content-model.md), [Portfolio Content Source](../content/portfolio-content-source.md) | Recruiter-critical English content and a discoverable locale control are available through the agreed localization model | Use Astro's built-in i18n routing, the standard `Intl` API where locale-sensitive formatting is needed, structured locale content, and project-owned validation scripts; keep shared UI separate from locale content; decide the exact static route model during Phase 4; design the locale control to fit the portfolio's UX, accessibility, and visual language; do not add a third-party i18n package without a new documented need |

## Priority Vocabulary

| Priority | Meaning                                    |
| -------- | ------------------------------------------ |
| P1       | Required for the next meaningful milestone |
| P2       | Valuable but can follow the core milestone |
| P3       | Optional improvement or exploration        |
