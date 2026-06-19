# Roadmap

The roadmap uses phases as milestone-level outcomes, not fixed calendar
promises. Each phase should be mirrored as a GitHub Milestone when managed in
GitHub, while individual GitHub issues usually track feature specification
items.

| Phase    | Name                                | Status      | Release Target        | Goal                                                    |
| -------- | ----------------------------------- | ----------- | --------------------- | ------------------------------------------------------- |
| `PH-001` | Product Foundation Baseline         | In Progress | No production tag     | Establish docs, workflow, governance, and content base  |
| `PH-002` | Static Portfolio Implementation     | Draft       | No production tag     | Replace the Vite scaffold with the portfolio experience |
| `PH-003` | Deployment And Operations Readiness | Draft       | `v1.0.0`              | Prepare release, deploy, and operations workflows       |
| `PH-004` | Post-Launch Optimization            | Draft       | `v1.1.0+` or `v1.0.x` | Improve discoverability, observability, and insights    |

## Phase Notes

- `PH-001` combines the earlier documentation and content baselines so the
  repository, governance model, and public-safe portfolio content are ready
  before product implementation.
- `PH-002` implements the static portfolio site and applies the quality and
  accessibility harness created during the foundation phase.
- `PH-003` prepares production deployment, release governance, infrastructure
  management, release notes, release SBOM generation, and minimum
  discoverability metadata needed before launch.
- `PH-004` covers post-launch SEO, AEO, GEO, analytics, monitoring, and logging
  refinement after the first operations-ready deployment exists.

Quality and accessibility are cross-cutting gates. The project should establish
their harness during `PH-001`, apply them during `PH-002`, and keep them visible
in deployment and post-launch work when relevant.

Production release tags begin at `PH-003`. Earlier phases can be merged through
pull requests, but they do not receive production Git tags because they do not
publish an operations-ready product. `PH-004` uses minor versions for meaningful
post-launch capabilities and patch versions for corrections or small
improvements.
