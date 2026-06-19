# Product Backlog

This document is the source of truth for implementation-sized work planned for
the project. A Product Backlog Item (PBI) is smaller than a roadmap phase and is
normally tracked by one GitHub issue. A phase-sized pull request may close
multiple PBI issues.

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
| Issue               | GitHub issue that tracks execution, if available        |
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

| PBI ID    | Type       | Title                                             | Status      | Priority | Issue | References                                                      | Acceptance Criteria                                                       | Notes                                                                                                         |
| --------- | ---------- | ------------------------------------------------- | ----------- | -------- | ----- | --------------------------------------------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `PBI-001` | Docs       | Build public documentation baseline               | In Progress | P1       | -     | -                                                               | Public docs map and core documents exist                                  | -                                                                                                             |
| `PBI-002` | Docs       | Add ADR and SBOM artifacts                        | In Progress | P1       | -     | [ADR-0003](../adr/0003-use-spdx-json-sbom.md)                   | ADRs and the transitional SBOM are reviewable                             | -                                                                                                             |
| `PBI-003` | Quality    | Establish GitHub Flow and CI baseline             | In Progress | P1       | `#1`  | [ADR-0006](../adr/0006-use-github-flow-and-ci-quality-gates.md) | Workflow baseline branch is ready for pull request review                 | Includes the issue-linked branch naming convention                                                            |
| `PBI-004` | Content    | Draft intro section copy                          | Ready       | P1       | -     | [Project Brief](project-brief.md)                               | First-viewport positioning copy exists                                    | -                                                                                                             |
| `PBI-005` | Content    | Draft project showcase content                    | Ready       | P1       | -     | [Content Model](../architecture/content-model.md)               | Project summaries and public links are drafted                            | -                                                                                                             |
| `PBI-016` | Docs       | Normalize planning schema and requirement tracing | In Progress | P1       | -     | [ADR-0006](../adr/0006-use-github-flow-and-ci-quality-gates.md) | PBI terminology and complete FR/NFR traceability exist                    | -                                                                                                             |
| `PBI-017` | Automation | Automate GitHub Milestone lifecycle               | In Progress | P1       | `#4`  | [ADR-0006](../adr/0006-use-github-flow-and-ci-quality-gates.md) | Milestones, issues, and phase pull requests stay synchronized             | Implementation and bootstrap are verified; mark Done after the workflow runs from `main`                      |
| `PBI-018` | Security   | Establish repository security settings baseline   | In Progress | P1       | `#5`  | [Supply Chain Policy](../security/supply-chain.md)              | Supported GitHub security controls are enabled and recorded               | Core controls are live; mark Done after the Terraform-managed ruleset is applied following the baseline merge |
| `PBI-019` | Quality    | Optimize event-specific quality gates             | In Progress | P2       | `#2`  | [ADR-0006](../adr/0006-use-github-flow-and-ci-quality-gates.md) | Each Git event runs the smallest sufficient verification set              | Keep pre-commit fast and pull-request checks comprehensive                                                    |
| `PBI-020` | Security   | Enforce dependency license policy                 | In Progress | P1       | -     | [Supply Chain Policy](../security/supply-chain.md)              | Pull requests fail for unapproved dependency licenses                     | Treat Dependency Review as a policy gate, not a complete legal audit                                          |
| `PBI-034` | Infra      | Establish GitHub governance as code               | In Progress | P1       | `#3`  | [GitHub Governance](../architecture/github-governance.md)       | Repository settings and the `main` ruleset have a reviewed Terraform plan | Keep deployment infrastructure and milestones in separate ownership boundaries                                |

### PBI-017 Automation Notes

- Synchronize roadmap phases to uniquely named GitHub Milestones without
  creating duplicates.
- Assign issues by reading the roadmap phase selected in the issue form.
- Assign a pull request only when its closing issues resolve to the same
  milestone.
- Reconcile milestone progress after issue or pull request close and reopen
  events.
- Close a milestone only after all associated items are closed and the phase
  integration pull request is merged. Reopen it when tracked work reopens.

## PH-002 Static Portfolio Implementation

| PBI ID    | Type    | Title                                  | Status  | Priority | Issue | References                                                         | Acceptance Criteria                                       | Notes |
| --------- | ------- | -------------------------------------- | ------- | -------- | ----- | ------------------------------------------------------------------ | --------------------------------------------------------- | ----- |
| `PBI-006` | Feature | Add repository and contact navigation  | Backlog | P1       | -     | [Content Model](../architecture/content-model.md)                  | Repository and contact paths are usable                   | -     |
| `PBI-007` | Feature | Implement skills section               | Backlog | P1       | -     | [Content Model](../architecture/content-model.md)                  | Skills are grouped by delivery responsibility             | -     |
| `PBI-008` | Quality | Validate accessibility basics          | Backlog | P1       | -     | -                                                                  | Primary flows pass accessibility review                   | -     |
| `PBI-009` | Quality | Validate performance and static build  | Backlog | P1       | -     | [ADR-0001](../adr/0001-use-static-vite-vanilla-typescript.md)      | Static build and agreed performance checks pass           | -     |
| `PBI-021` | Feature | Implement intro section                | Backlog | P1       | -     | [Project Brief](project-brief.md)                                  | First viewport communicates positioning and action        | -     |
| `PBI-022` | Feature | Implement project showcase             | Backlog | P1       | -     | [Content Model](../architecture/content-model.md)                  | Project evidence is concise and inspectable               | -     |
| `PBI-023` | UI      | Implement adaptive color theme         | Backlog | P1       | -     | -                                                                  | System theme, manual toggle, and persistence work         | -     |
| `PBI-024` | UI      | Implement responsive mobile experience | Backlog | P1       | -     | -                                                                  | Core content and actions work from mobile to desktop      | -     |
| `PBI-025` | Content | Publish portfolio rights notice        | Backlog | P1       | -     | [ADR-0005](../adr/0005-scope-code-license-and-portfolio-rights.md) | Product and asset notices communicate the rights boundary | -     |

## PH-003 Deployment And Operations Readiness

| PBI ID    | Type       | Title                                           | Status  | Priority | Issue | References                                                                                        | Acceptance Criteria                                                               | Notes                                                                                                                   |
| --------- | ---------- | ----------------------------------------------- | ------- | -------- | ----- | ------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `PBI-010` | Deploy     | Verify static deployment path                   | Backlog | P2       | -     | [Deployment Architecture](../architecture/deployment.md)                                          | Deployment path is verified end to end                                            | -                                                                                                                       |
| `PBI-011` | Release    | Establish release deployment workflow           | Backlog | P1       | -     | [ADR-0007](../adr/0007-use-cloudflare-pages-delivery.md)                                          | A controlled production release can publish `v1.0.0`                              | Share one deployment implementation between automatic `main` deploys and manual formal releases; tag after smoke checks |
| `PBI-012` | Infra      | Define infrastructure as code baseline          | Backlog | P2       | -     | [Deployment Architecture](../architecture/deployment.md)                                          | Managed infrastructure scope is explicit                                          | Select Cloudflare resource scope and a durable remote-state backend during PH-003                                       |
| `PBI-026` | Security   | Protect the preview environment                 | Backlog | P1       | -     | [Deployment Architecture](../architecture/deployment.md)                                          | Preview access is authenticated and auditable                                     | Deploy manually with `workflow_dispatch`; select the Cloudflare Access identity policy during implementation            |
| `PBI-027` | Release    | Publish generated release notes                 | Backlog | P1       | -     | [Release Configuration](../../.github/release.yml)                                                | GitHub Release notes reflect merged pull requests                                 | -                                                                                                                       |
| `PBI-028` | Security   | Generate and attach a CycloneDX release SBOM    | Backlog | P1       | -     | [ADR-0003](../adr/0003-use-spdx-json-sbom.md), [Supply Chain Policy](../security/supply-chain.md) | Each production GitHub Release includes a validated CycloneDX JSON SBOM           | See SBOM migration notes below                                                                                          |
| `PBI-029` | Discovery  | Add launch discovery metadata                   | Backlog | P1       | -     | -                                                                                                 | Production pages expose minimum search and social metadata                        | -                                                                                                                       |
| `PBI-030` | Compliance | Establish pre-release license compliance review | Backlog | P1       | -     | [License Compliance](../security/license-compliance.md)                                           | No unresolved third-party material ships in a public production release           | Combine automated evidence collection with owner approval                                                               |
| `PBI-031` | Operations | Run post-deployment production smoke checks     | Backlog | P1       | -     | [Production Readiness](../operations/production-readiness.md)                                     | A failed homepage or critical-asset check blocks or rolls back release completion | Do not treat a static health file as the only signal                                                                    |
| `PBI-032` | Operations | Establish uptime monitoring and alerting        | Backlog | P1       | -     | [Production Readiness](../operations/production-readiness.md)                                     | External probes detect production unavailability and notify the owner             | Select the provider during implementation                                                                               |
| `PBI-033` | Operations | Document incident response and rollback         | Backlog | P1       | -     | [Production Readiness](../operations/production-readiness.md)                                     | Production failures have a tested owner, triage path, and rollback procedure      | Keep the runbook proportional to a single-maintainer static site                                                        |

### PBI-028 SBOM Migration Notes

- Add `@cyclonedx/cdxgen` as an exact development dependency only when this PBI
  is implemented.
- Generate CycloneDX JSON during the production release workflow, attach it to
  the GitHub Release, and do not commit generated release SBOM files.
- Validate the generated document against the selected CycloneDX schema.
- Do not translate SPDX `NOASSERTION` into CycloneDX. Preserve missing license
  metadata as unresolved or omitted generator output and require policy review
  instead of inventing a conclusion.
- Verify that the root component represents the MIT code license and the All
  Rights Reserved portfolio-material boundary using a valid named license or
  SPDX expression supported by the selected CycloneDX version.
- Remove `sbom.spdx.json` and supersede ADR-0003 only when the release workflow
  becomes the authoritative SBOM process.

## PH-004 Post-Launch Optimization

| PBI ID    | Type       | Title                               | Status  | Priority | Issue | References | Acceptance Criteria                                             | Notes |
| --------- | ---------- | ----------------------------------- | ------- | -------- | ----- | ---------- | --------------------------------------------------------------- | ----- |
| `PBI-013` | Discovery  | Improve post-launch discoverability | Backlog | P2       | -     | -          | SEO, AEO, and GEO improvements are evidence-based               | -     |
| `PBI-014` | Operations | Optimize post-launch observability  | Backlog | P2       | -     | -          | Monitoring and logging improvements follow operational evidence | -     |
| `PBI-015` | Analytics  | Add privacy-aware visitor analytics | Backlog | P2       | -     | -          | Analytics approach and review metrics are documented            | -     |

## Priority Vocabulary

| Priority | Meaning                                    |
| -------- | ------------------------------------------ |
| P1       | Required for the next meaningful milestone |
| P2       | Valuable but can follow the core milestone |
| P3       | Optional improvement or exploration        |
