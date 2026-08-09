# GitHub Governance Terraform

This Terraform root manages long-lived GitHub repository governance for
`portfolio-ybkim`.

## Managed Scope

- repository feature and merge settings;
- the Dependabot minor-and-patch auto-merge activation variable;
- the Pages production deployment activation variable;
- the `deps:validated` compatibility-attestation label;
- project-specific pull request and release labels;
- Dependabot vulnerability alerts and security updates;
- Secret scanning and push protection; and
- the `main` branch ruleset.

Repository files, Actions workflows, CodeQL default setup, private vulnerability
reporting, GitHub Environments, secrets, and Cloudflare resources are managed elsewhere. GitHub
Issues and Milestones are intentionally not used for project planning.

## Remote State And Execution

This root uses the HCP Terraform CLI integration with remote execution and
remote state:

- organization: `dragontiger92`;
- project: `portfolio-ybkim-infrastructure`;
- workspace: `portfolio-ybkim-github`;
- execution mode: Remote;
- Terraform version: `1.15.6`; and
- automatic apply: disabled.

The broader HCP project groups portfolio infrastructure while this workspace
keeps GitHub governance state separate from future Cloudflare deployment state.
The workspace is CLI-driven and is not connected directly to a VCS repository.

The GitHub provider reads `GITHUB_TOKEN` from a sensitive HCP workspace
environment variable. Never put the token in Terraform configuration,
`*.tfvars`, shell commands, repository files, or Codex prompts.

## Bootstrap And Activation Boundary

The repository-governance bootstrap is complete. Its first owner-reviewed apply
imported the existing repository and security resources before enabling
repository auto-merge, automatic deletion of merged head branches, the strict
`main` ruleset, and `DEPENDABOT_AUTOMERGE_ENABLED=true`.

The external Pages activation prerequisites are also complete:

- `cloudflare-pages-production` permits only `main` and holds the three required
  variable names plus the environment-scoped production upload secret;
- `formal-release` permits only `main`, requires one reviewer, allows self-review,
  and contains no variable or secret;
- the unused Preview Environment has been removed; and
- the production upload credential remains outside Terraform state with the
  reviewed least-privilege scope.

Do not query or print Environment values while verifying this contract. Manual
topic-branch previews remain owner actions and do not use the repository
activation variable or a GitHub Environment.

This source boundary changes the Terraform-managed
`PAGES_DEPLOYMENT_ENABLED` value to `true`. Merge the source while the live
variable is still absent, and require the resulting `Pages Production` run to
report the inactive contract without building or deploying. After merge, upload
only the exact merged `infra/terraform/github` root to HCP Terraform and create
one standard non-targeted plan with automatic apply disabled. Accept only the
activation-variable create with no change, replacement, destroy, import, action,
or additional diagnostic. Apply remains a separate owner decision, and no
follow-up no-op run is required.

## Local Validation

```powershell
terraform fmt -check -recursive
terraform -chdir=infra/terraform/github init -backend=false
terraform -chdir=infra/terraform/github validate
```

Use the Ubuntu Terraform pull-request job as the authoritative validation when
Windows Application Control blocks local Terraform execution. Do not weaken the
local policy or substitute a different provider runtime.

## Remote Activation Run

After the activation source exists on `main`, archive only the exact merged
`infra/terraform/github` subtree. Use the credential-safe HCP Terraform API
workflow to upload one configuration version with automatic run queueing
disabled, then create one standard plan-and-apply run with automatic apply
disabled and no target, replacement, destroy, refresh-only, import, or action
option.

Review only a single create for
`github_actions_variable.pages_deployment_enabled` with no other action. Apply
the same run only after separate owner approval. The source pull request does
not trigger the remote run, and the completed apply does not require a follow-up
no-op run.
