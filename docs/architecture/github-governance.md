# GitHub Governance Architecture

GitHub repository governance is the PH-001 infrastructure-as-code boundary.
Deployment infrastructure remains a PH-003 concern with separate Terraform
state.

## Ownership Boundaries

| Surface                                    | Owner                                         |
| ------------------------------------------ | --------------------------------------------- |
| Repository settings and custom labels      | GitHub Terraform root                         |
| `main` branch ruleset                      | GitHub Terraform root                         |
| Vulnerability alerts and security updates  | GitHub Terraform root                         |
| Secret scanning feature flags              | GitHub Terraform root                         |
| CodeQL and private vulnerability reporting | GitHub-managed settings via owner API         |
| Pull request template                      | Version-controlled `.github/` file            |
| GitHub Actions workflows                   | Version-controlled `.github/workflows/`       |
| Phase and PBI work status                  | Version-controlled planning documents         |
| Credentials and secrets                    | GitHub secure settings, never Terraform state |
| Cloudflare Pages, Access, and DNS          | Separate PH-003 Terraform root                |

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

| Trigger                     | Required work                                                             | Purpose                                             |
| --------------------------- | ------------------------------------------------------------------------- | --------------------------------------------------- |
| Local `pre-commit`          | Staged ESLint and Prettier checks through lint-staged                     | Keep the commit feedback loop fast                  |
| Pull request                | `Check`, `Dependency Review`, and `PR Metadata`                           | Gate merge readiness and policy metadata            |
| Terraform-related PR change | Terraform format, provider initialization without backend, and validation | Reject invalid IaC before merge                     |
| Push to `main`              | Full `pnpm check`                                                         | Verify the integrated default branch                |
| Weekly schedule             | `pnpm audit --audit-level moderate`                                       | Surface dependency advisories without blocking a PR |
| Manual dispatch             | Security audit or Terraform validation as needed                          | Support owner-driven recovery and explicit rechecks |

`pnpm check` includes type checking, strict lint, governance tests, formatting,
and the production build. Terraform planning and apply are deliberately absent
from pull requests until durable remote state and owner credentials are
configured.

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
