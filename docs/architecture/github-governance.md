# GitHub Governance Architecture

GitHub repository governance is the PH-001 infrastructure-as-code boundary.
PH-003 deployment and monitoring infrastructure use separate Terraform roots
and state boundaries.

## Ownership Boundaries

| Surface                                                   | Owner                                         |
| --------------------------------------------------------- | --------------------------------------------- |
| Repository settings, Actions variables, and custom labels | GitHub Terraform root                         |
| `main` branch ruleset                                     | GitHub Terraform root                         |
| Vulnerability alerts and security updates                 | GitHub Terraform root                         |
| Secret scanning feature flags                             | GitHub Terraform root                         |
| CodeQL and private vulnerability reporting                | GitHub-managed settings via owner API         |
| Pull request template                                     | Version-controlled `.github/` file            |
| GitHub Actions workflows                                  | Version-controlled `.github/workflows/`       |
| Phase and PBI work status                                 | Version-controlled planning documents         |
| Credentials and secrets                                   | GitHub secure settings, never Terraform state |
| Cloudflare Pages, Access, and DNS                         | Separate PH-003 Terraform root                |

## Main Ruleset

The desired `main` ruleset:

- requires pull requests;
- requires `Check`, `Dependency Review`, and `PR Metadata`;
- requires CodeQL results and blocks analyzer errors or high-and-higher
  security alerts;
- requires the branch to be current with `main`;
- requires review conversations to be resolved;
- blocks branch deletion and force pushes; and
- permits merge and squash methods without requiring another person's approval.

The approval count remains zero because this repository has one maintainer and
does not accept external contributions. The pull request, automated checks, and
self-review checklist provide the merge evidence instead. No administrator
bypass is configured, so an emergency exception requires an explicit ruleset
change with an auditable Terraform diff.

Branch-name pattern rules are not managed through the GitHub ruleset because
the provider documents that rule as enterprise-only. `PR Metadata` enforces the
public branch naming convention instead.

## Quality Gate Matrix

| Trigger                     | Required work                                                                | Purpose                                                                    |
| --------------------------- | ---------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Local docs iteration        | `pnpm.cmd check:docs`                                                        | Validate documentation without repeating the full gate                     |
| Local source iteration      | Focused lint, formatter, build, browser, or failing-stage command            | Give fast feedback without repeating the full gate                         |
| Local `pre-commit`          | Staged ESLint fixes and Prettier formatting through lint-staged              | Keep the commit feedback loop fast                                         |
| Local `pre-push`            | `pnpm check:static`                                                          | Block static-analysis, build, and HTML regressions                         |
| Local completion / PR prep  | Full `pnpm.cmd check`                                                        | Verify the complete change once before handoff                             |
| Pull request                | `Check` (`pnpm check`), `Dependency Review`, and `PR Metadata`               | Gate merge readiness and policy metadata                                   |
| Merged pull request         | Compare and update eligible open PR branches through `Sync Open PR Branches` | Preserve the integrated `main` history in active same-repository work      |
| Dependabot pull request     | Policy classification, required checks, and owner merge review               | Route updates by metadata, breaking markers, and `deps:validated` evidence |
| Terraform-related PR change | Terraform format, provider initialization without backend, and validation    | Reject invalid IaC before merge                                            |
| Push to `main`              | `Check` (`pnpm check`)                                                       | Verify the integrated default branch                                       |
| Enabled push to `main`      | Exact artifact, Wrangler Direct Upload, full-SHA resolution, public smoke    | Publish the integrated revision without creating a release tag             |
| Owner-selected topic branch | Local full check, manual Wrangler preview, and owner browser QA              | Inspect an exact pushed revision in the protected remote boundary          |
| Formal release dispatch     | Version/revision validation, evidence, production smoke, tag, GitHub Release | Publish one immutable `vX.Y.Z` product release after deployment acceptance |
| Weekly schedule             | `pnpm audit --audit-level moderate`                                          | Surface dependency advisories without blocking a PR                        |
| Manual dispatch             | Security audit or Terraform validation as needed                             | Support owner-driven recovery and explicit rechecks                        |

`pnpm check:docs` includes warning-free Markdown linting, strict documentation
file-size validation, and Prettier formatting for `docs/`, `.agents/`, and
`AGENTS.md`. `pnpm check:static` includes warning-free type checking and
linting, strict maintained-file size, governance and static-budget tests,
formatting, the Astro production build, deterministic `dist/` budget validation,
HTML validation, and W3C Nu validation. `pnpm check` adds Playwright and
axe-core Chromium checks, including semantic structure and 44-by-44 CSS-pixel
target checks, plus a focused WebKit smoke suite for core rendering and
interaction compatibility.

The pull-request Terraform workflow deliberately stops at formatting,
backend-free initialization, and configuration validation. Account-backed plans
and applies use the established HCP Terraform remote boundaries and remain
separate owner-reviewed operations rather than pull-request checks.

Credential-bearing Cloudflare Pages jobs require
`PAGES_DEPLOYMENT_ENABLED=true`. That value is now the managed steady state
after the production Environments and protected inputs completed their
owner-reviewed activation gates. A push to `main` therefore builds, deploys,
resolves, and smoke-checks its exact revision. Secrets remain
Environment-scoped and outside Terraform state; changing activation or
credentials remains a separate operation. Optional previews are local owner
actions and do not use a GitHub Environment or status check.

`Sync Open PR Branches` runs after a pull request is merged into `main` and can
also be dispatched manually. It compares open, same-repository pull requests
whose base is `main`, then calls GitHub's update-branch API only when the head is
behind. Dependabot, `wip/*`, fork-owned, non-`main`-based, and unopened branches
remain outside the mutation boundary. A conflict or stale head SHA fails the
workflow so the owner can resolve it without hidden history rewriting.

The workflow does not check out or execute pull request code. It uses the
repository-scoped `GITHUB_TOKEN` with only the contents and pull-request write
permissions required by the update-branch endpoint. GitHub may require owner
approval before checks triggered by a `GITHUB_TOKEN` branch update run; do not
treat the update request alone as completed PR validation.

The pre-push hook runs the static subset so obvious standards failures do not
leave the workstation. Browser installation and rendering remain in the explicit
local completion check and pull request CI. CI repeats the full check in a clean
Linux runner as the authoritative merge gate.

Every external GitHub Action reference must use a verified immutable commit SHA
with the reviewed release tag retained in a comment. Dependabot may propose SHA
updates, but a floating major tag is not the repository's final workflow form.

The required `Check` workflow runs for every pull request without path filters.
The repository is small, documentation and configuration are included in lint and
format checks, and an always-reported `Check` context avoids leaving the required
ruleset check pending. Specialized Terraform validation remains path-scoped.

The governance tests inside `pnpm check` verify the metadata validator's code.
The separate `PR Metadata` workflow applies that validator to the current pull
request, so the two stages have different responsibilities.

### Subresource Integrity Scope

HTML Validate does not require Subresource Integrity (SRI) for Astro-generated
same-origin styles and scripts. These resources are emitted with content-hashed
filenames and deployed with the HTML as one static artifact. A blanket SRI rule
would add build integration without protecting against an origin compromise that
can replace both the HTML and its same-origin assets.

Prefer self-hosting when a future feature needs a script or stylesheet. If an
external origin is necessary, review that resource explicitly and require SRI
with the appropriate CORS configuration when the provider publishes stable
integrity-compatible assets. W3C Nu validation remains authoritative for HTML
and CSS conformance; this scoped SRI decision is a separate security policy.

## Security And Quality Baseline

- Use GitHub CodeQL default setup with the `extended` query suite
  for JavaScript and TypeScript.
- Keep Secret scanning and push protection enabled.
- Keep Dependabot alerts and security updates enabled.
- Accept sensitive reports only through GitHub private vulnerability reporting.
- Treat non-provider pattern detection and secret validity checks as unavailable
  while GitHub keeps those settings disabled for the current repository.

CodeQL default setup and private vulnerability reporting are explicit
provider-boundary exceptions. They are verified through GitHub's API rather than
represented as Terraform resources. Do not add a generic REST Terraform
provider solely to cover these two settings.

## State And Execution Boundary

HCP Terraform stores and executes this root under organization
`dragontiger92`, project `portfolio-ybkim-infrastructure`, and workspace
`portfolio-ybkim-github`. The project is the broader portfolio-infrastructure
grouping; the workspace is the state boundary for `infra/terraform/github`.
Cloudflare delivery and Checkly monitoring use their own Terraform roots and
remote workspaces, keeping deployment and observability state separate from
GitHub governance.

The workspace uses Remote execution, Terraform `1.15.6`, disabled automatic
apply, and a CLI-driven workflow without a direct VCS connection. The GitHub
provider credential is a fine-grained PAT stored only as the workspace's
sensitive `GITHUB_TOKEN` environment variable. Terraform plans may run only
after CLI authentication and backend initialization; apply still requires
explicit owner approval after reviewing the plan.

## Bootstrap

The bootstrap sequence is complete. Baseline workflows reached `main` before
the ruleset was activated, then the HCP Terraform backend was configured. The
first owner-reviewed remote apply imported the existing repository and security
controls before activating the managed settings and ruleset.

The PH-001 governance bootstrap protects all later work. PH-003 subsequently
established the separate Pages, protected-preview, production-smoke,
observability, and formal-release baselines, including `v1.0.0` and `v1.0.1`.
Those systems retain their separate ownership and approval boundaries after the
phase closes.

The owner-merge Terraform source sets `allow_auto_merge = false` and retains
`delete_branch_on_merge = true`. The Dependabot workflow classifies each update,
records the policy evidence, and requests owner review; no Actions variable or
workflow credential authorizes a merge. Any later repository-setting change
remains a separate owner-reviewed provider gate.
