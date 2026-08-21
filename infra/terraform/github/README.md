# GitHub Governance Terraform

This Terraform root manages long-lived GitHub repository governance for
`portfolio-ybkim`.

## Managed Scope

- repository description, public homepage, feature, and merge settings;
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
keeps GitHub governance state separate from Cloudflare delivery and Checkly
monitoring state. The workspace is CLI-driven and is not connected directly to
a VCS repository.

The GitHub provider reads `GITHUB_TOKEN` from a sensitive HCP workspace
environment variable. Never put the token in Terraform configuration,
`*.tfvars`, shell commands, repository files, or Codex prompts.

## Steady State And Activation History

The repository-governance bootstrap and owner-merge transition are complete.
Repository auto-merge remains disabled, merged head branches are deleted
automatically, and the strict `main` ruleset remains active. Dependabot policy
classifies updates and requests owner review without workflow-owned merge
authority.

The external Pages prerequisites are complete:

- `cloudflare-pages-production` accepts only `main` and holds the protected
  production inputs;
- `formal-release` accepts only `main`, retains its reviewer protection, and
  contains no variable or secret;
- the former Preview Environment is removed; and
- the production credential remains outside Terraform state.

The Terraform-managed `PAGES_DEPLOYMENT_ENABLED` value is `true`. Its reviewed
remote apply and first production runs are complete, and the `v1.0.0`,
`v1.0.1`, and later `main` deliveries exercised the active contract. No
provider run or activation mutation is part of PH-003 documentation closeout.

Do not query or print Environment values while verifying this boundary. Manual
topic-branch previews remain owner actions and do not use a GitHub Environment.
Any later activation, credential, repository-metadata, or provider change
requires its own reviewed scope.

## Local Validation

```powershell
terraform fmt -check -recursive
terraform -chdir=infra/terraform/github init -backend=false
terraform -chdir=infra/terraform/github validate
```

Use the Ubuntu Terraform pull-request job as the authoritative validation when
Windows Application Control blocks local Terraform execution. Do not weaken the
local policy or substitute a different provider runtime.

## Activation Completion

The one-create activation run is complete and no activation import, refresh,
plan, apply, or follow-up no-op remains pending. PH-003 closeout does not upload
a Terraform configuration version or create a remote run.
