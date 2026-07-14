# Roadmap

The roadmap is the source of truth for phase-level outcomes and status, not a
fixed calendar promise. Product Backlog Items provide the implementation-sized
view, while GitHub Pull Requests provide review and CI integration without
duplicating roadmap state in GitHub Issues or Milestones.

| Phase    | Name                                | Status      | Release Target        | Goal                                                                |
| -------- | ----------------------------------- | ----------- | --------------------- | ------------------------------------------------------------------- |
| `PH-001` | Product Foundation Baseline         | Completed   | No production tag     | Establish docs, workflow, governance, and content base              |
| `PH-002` | Static Portfolio Implementation     | In Progress | No production tag     | Complete the portfolio content and experience                       |
| `PH-003` | Deployment And Operations Readiness | Planned     | `v1.0.0`              | Prepare release, deployment, contact routing, and operations        |
| `PH-004` | Post-Launch Optimization            | Planned     | `v1.1.0+` or `v1.0.x` | Improve discoverability, English reach, observability, and insights |

## Phase Notes

- `PH-001` combines the earlier documentation and content baselines so the
  repository, governance model, and public-safe portfolio content are ready
  before product completion. Its Astro page shell is an executable architecture
  baseline rather than acceptance of the PH-002 portfolio experience.
- `PH-002` implements the static portfolio site and applies the quality and
  accessibility harness created during the foundation phase.
- `PH-003` prepares production deployment, release governance, infrastructure
  management, custom-domain contact email routing, release notes, release SBOM
  generation, pre-release license compliance, production smoke checks, uptime
  monitoring, rollback readiness, and minimum discoverability metadata needed
  before launch.
- `PH-004` covers post-launch SEO, AEO, GEO, English portfolio content through
  an agreed localization model, privacy-aware route analytics, and evidence-driven
  observability refinement after the first operations-ready deployment exists.

Quality and accessibility are cross-cutting gates. The project should establish
their harness during `PH-001`, apply them during `PH-002`, and keep them visible
in deployment and post-launch work when relevant.

Production release tags begin at `PH-003`. Earlier phases can be merged through
pull requests, but they do not receive production Git tags because they do not
publish an operations-ready product. `PH-004` uses minor versions for meaningful
post-launch capabilities and patch versions for corrections or small
improvements.

## Status Vocabulary

| Status      | Meaning                                         |
| ----------- | ----------------------------------------------- |
| Planned     | Defined but not yet active                      |
| In Progress | The phase outcome is actively being implemented |
| Completed   | The phase outcome and integration are complete  |
| Cancelled   | The phase was intentionally removed             |
