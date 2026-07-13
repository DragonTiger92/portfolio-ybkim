# GitHub Governance Architecture

GitHub repository governance is the PH-001 infrastructure-as-code boundary.
Deployment infrastructure remains a PH-003 concern with separate Terraform
state.

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

| Trigger                     | Required work                                                             | Purpose                                                                    |
| --------------------------- | ------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Local docs iteration        | `pnpm.cmd check:docs`                                                     | Validate documentation without repeating the full gate                     |
| Local source iteration      | Focused lint, formatter, build, browser, or failing-stage command         | Give fast feedback without repeating the full gate                         |
| Local `pre-commit`          | Staged ESLint fixes and Prettier formatting through lint-staged           | Keep the commit feedback loop fast                                         |
| Local `pre-push`            | `pnpm check:static`                                                       | Block static-analysis, build, and HTML regressions                         |
| Local completion / PR prep  | Full `pnpm.cmd check`                                                     | Verify the complete change once before handoff                             |
| Pull request                | `Check` (`pnpm check`), `Dependency Review`, and `PR Metadata`            | Gate merge readiness and policy metadata                                   |
| Dependabot pull request     | Policy classification; routine auto-merge; exceptional review attestation | Route updates by metadata, breaking markers, and `deps:validated` evidence |
| Terraform-related PR change | Terraform format, provider initialization without backend, and validation | Reject invalid IaC before merge                                            |
| Push to `main`              | `Check` (`pnpm check`)                                                    | Verify the integrated default branch                                       |
| Weekly schedule             | `pnpm audit --audit-level moderate`                                       | Surface dependency advisories without blocking a PR                        |
| Manual dispatch             | Security audit or Terraform validation as needed                          | Support owner-driven recovery and explicit rechecks                        |

`pnpm check:docs` includes warning-free Markdown linting, strict documentation
file-size validation, and Prettier formatting for `docs/`, `.agents/`, and
`AGENTS.md`. `pnpm check:static` includes warning-free type checking and
linting, strict file size, governance tests, formatting, the Astro production
build, HTML validation, and W3C Nu validation. `pnpm check` adds Playwright and
axe-core browser checks, including semantic structure and 44-by-44 CSS-pixel
target checks. Terraform planning and apply are deliberately absent from pull
requests until durable remote state and owner credentials are configured.

The pre-push hook runs the static subset so obvious standards failures do not
leave the workstation. Browser installation and rendering remain in the explicit
local completion check and pull request CI. CI repeats the full check in a clean
Linux runner as the authoritative merge gate.

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

## Bootstrap

The ruleset cannot be applied before the baseline workflows exist on `main`.
The first baseline pull request is therefore a documented bootstrap exception:
Terraform is formatted, initialized without a backend, and validated on the
feature branch; the imported plan and active ruleset are applied only after the
baseline merge and remote-state configuration.

This post-merge governance closure belongs to `PH-001`, not `PH-003`. It may run
before `PH-002` implementation so subsequent feature work is protected by the
final repository checks and `main` ruleset. Cloudflare Pages, DNS, preview
access, production smoke checks, and release operations remain separate `PH-003`
deployment concerns.

The same Terraform apply owns `allow_auto_merge = true`,
`delete_branch_on_merge = true`, and the
`DEPENDABOT_AUTOMERGE_ENABLED = true` Actions variable. Until that apply also
activates the strict `main` ruleset, the Dependabot workflow classifies updates
but cannot enable patch auto-merge. This keeps repository automation from
becoming active before its required-check and branch-lifecycle safeguards.
