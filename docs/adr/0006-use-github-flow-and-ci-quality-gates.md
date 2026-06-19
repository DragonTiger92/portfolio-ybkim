# ADR-0006: Use GitHub Flow And CI Quality Gates

## Status

Accepted

## Context

The repository is both a portfolio product and evidence of how the project is
planned, reviewed, checked, and released. The workflow should stay lightweight
enough for a single maintainer while still showing production-oriented hygiene.

The initial Vite scaffold remains the public `main` baseline. Project
documentation, harness setup, CI, issue templates, pull request templates, and
release governance are prepared on a feature branch before being proposed back
to `main`.

## Decision

Use GitHub Flow:

- Keep `main` production-ready.
- Create short-lived branches from the latest `main`.
- Track work through GitHub issues.
- Link pull requests to issues with GitHub closing keywords such as `Closes`,
  `Fixes`, or `Resolves`.
- Run CI quality gates before merging.
- Prefer focused commits inside branches and reviewable pull requests into
  `main`.

Name human-created pull request branches using
`<type>/<issue-number>-<short-kebab-description>`. Approved prefixes are
`feature`, `fix`, `content`, `docs`, `ci`, `infra`, `security`, `refactor`, and
`chore`. A phase-sized branch uses its primary tracking issue number even when
its pull request closes multiple related issues. Generated dependency branches
and explicitly temporary `wip/*` branches are exempt.

Keep the complete human-readable workflow and prefix meanings in
[`docs/process/development-workflow.md`](../process/development-workflow.md).

Roadmap phases are milestone-level outcomes. GitHub Milestones mirror the
documented roadmap phases. Product Backlog Items are the usual unit of issue
tracking, and each GitHub issue should normally track one PBI or one similarly
sized defect or maintenance task. A pull request may close multiple issues when
it completes a phase-sized milestone branch.

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

Use repository issue templates, a pull request template, Dependabot, dependency
review, and generated release-note configuration as lightweight workflow
governance.

GitHub Milestones are planning containers, not release automation by
themselves. Implement their lifecycle automation through idempotent GitHub
Actions and GitHub API operations tracked by `PBI-017`. The automation should
create or update phase milestones, assign issues from issue-form phase data,
inherit a pull request milestone from its closing issues, and reconcile
milestone state after close, reopen, and merge events. A milestone closes only
when its tracked work is closed and its phase integration pull request is
merged.

Use a compact label vocabulary for issues, pull requests, and generated release
notes:

- Release impact: `release:major`, `release:minor`, `release:patch`,
  `release:not-applicable`.
- Change type: `type:feature`, `type:fix`, `type:content`, `type:ui`,
  `type:a11y`, `type:performance`, `type:security`, `type:docs`, `type:ci`,
  `type:infra`, `type:deps`.

The first workflow-baseline issue may be created manually because the issue
templates do not exist on `main` until this branch is merged. Later issues
should use the repository templates.

Deployment workflows, Cloudflare Pages, Cloudflare Access, Wrangler, Terraform,
and release SBOM generation are intentionally deferred until the portfolio site
has a deployable product surface.

## Consequences

- The project gets a standard issue-to-branch-to-pull-request workflow without
  adopting a heavier Git Flow release-branch model.
- Branch names expose the primary issue and change type without requiring a
  reviewer to infer them from commit history.
- CI makes the existing `pnpm` verification path visible in pull requests.
- DevSecOps signals remain lightweight and appropriate for a small static site.
- Some repository settings, such as labels and branch protection, may still need
  manual setup or later Terraform-managed configuration.
