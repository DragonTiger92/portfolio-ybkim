# Roadmap

The roadmap is the source of truth for phase-level outcomes and status, not a
fixed calendar promise. Product Backlog Items provide the implementation-sized
view, while GitHub Pull Requests provide review and CI integration without
duplicating roadmap state in GitHub Issues or Milestones.

| Phase    | Name                                | Status    | Release Target    | Goal                                                        |
| -------- | ----------------------------------- | --------- | ----------------- | ----------------------------------------------------------- |
| `PH-001` | Product Foundation Baseline         | Completed | No production tag | Establish docs, workflow, governance, and content base      |
| `PH-002` | Static Portfolio Implementation     | Completed | No production tag | Complete the portfolio content and experience               |
| `PH-003` | Deployment And Operations Readiness | Completed | `v1.0.0`          | Prepare release, deployment, public contact, and operations |
| `PH-004` | Post-Launch Optimization            | Deferred  | No active target  | Refine discoverability, English reach, and product insights |

## Phase Notes

- `PH-001` combines the earlier documentation and content baselines so the
  repository, governance model, and public-safe portfolio content are ready
  before product completion. Its Astro page shell is an executable architecture
  baseline rather than acceptance of the PH-002 portfolio experience.
- `PH-002` completed the static portfolio site and applied the quality and
  accessibility harness created during the foundation phase.
- `PH-003` completed the reviewed infrastructure-ownership boundary, production
  deployment and release governance, the existing Gmail contact channel, v1
  portfolio narrative and resume, generated release notes and SBOM evidence,
  license compliance, canonical smoke, uptime monitoring, rollback readiness,
  and launch discovery metadata. It shipped the `v1.0.0` launch and `v1.0.1`
  maintenance release on the Cloudflare-managed Pages origin. The 2026-08-21
  post-release drill then rolled production back natively to `d028fb4`, verified
  canonical and Checkly health, restored exact current `main` at `e032cb1`, and
  repeated provider, canonical, monitoring, and workflow verification. No
  purchased domain is required.
- `PH-004` was deferred by the owner on 2026-08-21 after PH-003 closeout. Its
  remaining `PBI-013`, `PBI-015`, and `PBI-042` work does not enter refinement,
  scheduling, implementation, or phase-closure checks while deferred;
  `PBI-014` remains cancelled. Reactivation requires an explicit owner decision
  that returns the phase to `Planned` and each selected PBI to `Backlog` or
  `Ready`.

Quality and accessibility are cross-cutting gates. The project should establish
their harness during `PH-001`, apply them during `PH-002`, and keep them visible
in deployment and post-launch work when relevant.

Production release tags begin at `PH-003`. Earlier phases can be merged through
pull requests, but they do not receive production Git tags because they do not
publish an operations-ready product. If reactivated, `PH-004` uses minor
versions for meaningful post-launch capabilities and patch versions for
corrections or small improvements.

## Status Vocabulary

| Status      | Meaning                                         |
| ----------- | ----------------------------------------------- |
| Planned     | Defined but not yet active                      |
| In Progress | The phase outcome is actively being implemented |
| Deferred    | Paused until an explicit owner reactivation     |
| Completed   | The phase outcome and integration are complete  |
| Cancelled   | The phase was intentionally removed             |
