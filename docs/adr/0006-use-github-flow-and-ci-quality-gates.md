# ADR-0006: Use GitHub Flow And CI Quality Gates

## Status

Accepted; work-tracking decisions superseded by
[ADR-0008](0008-use-docs-based-work-tracking.md)

## Context

The repository is both a portfolio product and evidence of how the project is
planned, reviewed, checked, and released. The workflow should stay lightweight
enough for a single maintainer while still showing production-oriented hygiene.

The initial Vite scaffold remains the public `main` baseline. Project
documentation, harness setup, CI, pull request templates, and
release governance are prepared on a feature branch before being proposed back
to `main`.

## Decision

Use GitHub Flow:

- Keep `main` production-ready.
- Create short-lived branches from the latest `main`.
- Track Phase and PBI work state through version-controlled planning documents.
- Reference the owning Phase and included PBIs in pull requests.
- Run CI quality gates before merging.
- Prefer focused commits inside branches and reviewable pull requests into
  `main`.

Name human-created pull request branches using
`<type>/<ph-NNN|pbi-NNN>-<short-kebab-description>`. Approved prefixes are
`feature`, `fix`, `content`, `docs`, `ci`, `infra`, `security`, `refactor`, and
`chore`. A phase-sized branch uses its Phase ID and may integrate multiple PBIs.
A PBI-sized branch uses its PBI ID. Generated dependency branches and explicitly
temporary `wip/*` branches are exempt.

Keep the complete human-readable workflow and prefix meanings in
[`docs/process/development-workflow.md`](../process/development-workflow.md).

Roadmap phases are outcome-level planning units, and Product Backlog Items are
the implementation-sized planning units. Their status belongs only to
`roadmap.md` and `product-backlog.md`. A pull request is an integration and
review surface, not another backlog.

Use GitHub Actions as the CI quality gate for repository checks. The baseline CI
workflow runs the project check command before merge-oriented work is considered
ready.

Use event-specific checks:

- `pre-commit`: run staged-file lint and formatting through Husky and
  lint-staged so local commits stay fast.
- `pull_request`: run the full project check and dependency review before
  merge-oriented work is considered ready.
- `push` to `main`: run the full project check after integration.
- Future release workflow: build, deploy, generate release notes, and attach a
  release SBOM only after a deployable product surface exists.

Use a pull request template, Dependabot, dependency review, and generated
release-note configuration as lightweight workflow governance. GitHub Issues
and Milestones are not used for project planning.

Use a compact label vocabulary for pull requests and generated release notes:

- Release impact: `release:major`, `release:minor`, `release:patch`,
  `release:not-applicable`.
- Change type: `type:feature`, `type:fix`, `type:content`, `type:ui`,
  `type:a11y`, `type:performance`, `type:security`, `type:docs`, `type:ci`,
  `type:infra`, `type:deps`.

Manage repository settings, labels, supported security controls, and the
`main` ruleset as PH-001 GitHub governance infrastructure through Terraform.
Keep its state and ownership boundary separate from deployment infrastructure.
Deployment workflows, Cloudflare Pages, Cloudflare Access, Wrangler,
deployment Terraform, and release SBOM generation remain deferred until the
portfolio site has a deployable product surface.

## Consequences

- The project gets a docs-to-branch-to-pull-request workflow without
  adopting a heavier Git Flow release-branch model.
- Branch names expose the owning Phase or PBI and change type without requiring a
  reviewer to infer them from commit history.
- CI makes the existing `pnpm` verification path visible in pull requests.
- DevSecOps signals remain lightweight and appropriate for a small static site.
- Applying the final `main` ruleset remains a post-bootstrap operation because
  its required checks must first exist on the default branch.
