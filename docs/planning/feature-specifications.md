# Feature Specifications

This document tracks planned implementation units at the level that can become
GitHub issues. A feature specification is smaller than a roadmap phase and more
concrete than a functional or non-functional requirement.

Roadmap phases define milestone-level outcomes and should be mirrored as GitHub
Milestones when managed in GitHub. GitHub issues should usually map to one
feature specification item, while pull requests may close one or more issues
when they complete a phase-sized milestone branch.

## Schema

| Field      | Meaning                                                |
| ---------- | ------------------------------------------------------ |
| Spec ID    | Stable identifier for a planned implementation unit    |
| Type       | Primary work type                                      |
| Driver     | Requirement, project decision, or operational driver   |
| Title      | Short description of the implementation outcome        |
| Status     | Draft, Planned, In Progress, Blocked, Done, or Dropped |
| Phase      | Roadmap phase that owns the work                       |
| Priority   | Relative importance within the current roadmap         |
| Issue      | GitHub issue that tracks execution, if available       |
| Acceptance | Compact completion signal for planning and review      |

## Specification Index

| Spec ID  | Type    | Driver             | Title                                  | Status      | Phase    | Priority | Issue | Acceptance                                 |
| -------- | ------- | ------------------ | -------------------------------------- | ----------- | -------- | -------- | ----- | ------------------------------------------ |
| `FS-001` | Docs    | Project Governance | Build public documentation baseline    | In Progress | `PH-001` | P1       | -     | Public docs map and core docs exist        |
| `FS-002` | Docs    | Project Governance | Add ADR and SBOM artifacts             | In Progress | `PH-001` | P1       | -     | ADRs and baseline SBOM are reviewable      |
| `FS-003` | Quality | Project Governance | Establish GitHub Flow and CI baseline  | In Progress | `PH-001` | P1       | `#1`  | Workflow baseline branch is PR-ready       |
| `FS-004` | Content | `FR-001`           | Draft intro section copy               | Planned     | `PH-001` | P1       | -     | First viewport positioning copy exists     |
| `FS-005` | Content | `FR-002`           | Draft project showcase content         | Planned     | `PH-001` | P1       | -     | Project summaries and links are drafted    |
| `FS-006` | Feature | `FR-003`           | Add repository and contact navigation  | Draft       | `PH-002` | P1       | -     | Repository and contact paths are usable    |
| `FS-007` | Feature | `FR-004`           | Implement skills section               | Draft       | `PH-002` | P1       | -     | Skills are grouped by responsibility       |
| `FS-008` | Quality | `NFR-001`          | Validate accessibility basics          | Draft       | `PH-002` | P1       | -     | Primary flows pass accessibility review    |
| `FS-009` | Quality | `NFR-002`          | Validate performance and static build  | Draft       | `PH-002` | P1       | -     | Static build and performance are checked   |
| `FS-010` | Deploy  | `NFR-005`          | Verify static deployment path          | Draft       | `PH-003` | P2       | -     | Deployment path is verified end to end     |
| `FS-011` | Deploy  | Release Governance | Establish release deployment workflow  | Draft       | `PH-003` | P1       | -     | Release deployment workflow is defined     |
| `FS-012` | Infra   | Infrastructure     | Define infrastructure as code baseline | Draft       | `PH-003` | P2       | -     | Managed infrastructure scope is explicit   |
| `FS-013` | Growth  | Discovery          | Improve post-launch discoverability    | Draft       | `PH-004` | P2       | -     | SEO, AEO, and GEO improvements are scoped  |
| `FS-014` | Ops     | Operations         | Evaluate monitoring and logging needs  | Draft       | `PH-004` | P2       | -     | Observability needs and tools are chosen   |
| `FS-015` | Insight | Visitor Insight    | Add privacy-aware visitor analytics    | Draft       | `PH-004` | P2       | -     | Analytics approach and review metric exist |

## Priority Vocabulary

| Priority | Meaning                                    |
| -------- | ------------------------------------------ |
| P1       | Required for the next meaningful milestone |
| P2       | Valuable but can follow the core milestone |
| P3       | Optional improvement or exploration        |
