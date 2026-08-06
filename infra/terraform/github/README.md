# GitHub Governance Terraform

This Terraform root manages long-lived GitHub repository governance for
`portfolio-ybkim`.

## Managed Scope

- repository feature and merge settings;
- the Dependabot minor-and-patch auto-merge activation variable;
- the default-disabled Pages deployment activation variable;
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

## Bootstrap Boundary

Do not apply this root before the workflow-baseline pull request is merged. The
desired ruleset requires `Check`, `Dependency Review`, and `PR Metadata`, which
must exist on `main` first. The bootstrap pull request is the one-time exception
to the final ruleset.

Before the first apply:

1. Confirm the configured HCP project and workspace exist with Remote execution,
   Terraform `1.15.6`, and automatic apply disabled. Local `*.tfstate` files are
   ignored only as a safety net and are not the accepted operational backend.
2. Confirm the least-privilege GitHub token exists only as the sensitive
   `GITHUB_TOKEN` HCP workspace environment variable.
3. Authenticate the local Terraform CLI to HCP Terraform without exposing its
   user token.
4. Review the import plan for the existing repository and security resources.
5. Confirm that the expected status check names have run on `main`.

The first apply enables repository auto-merge, automatic deletion of merged
head branches, the strict `main` ruleset, and
`DEPENDABOT_AUTOMERGE_ENABLED=true` together. Do not create that Actions
variable manually before the ruleset is active.

`PAGES_DEPLOYMENT_ENABLED` is intentionally managed as `false` while the Pages
pipeline is source-only. A later owner-reviewed activation must first provision
the named GitHub Environments and their scoped Cloudflare configuration, apply
the Access service-token policy, complete an authenticated preview smoke test,
and then change this managed value to `true` in a separate reviewed change.

## Local Validation

```powershell
terraform fmt -check -recursive
terraform -chdir=infra/terraform/github init -backend=false
terraform -chdir=infra/terraform/github validate
```

## First Remote Run

After this backend configuration exists on `main`:

```powershell
terraform login
terraform -chdir=infra/terraform/github init
terraform -chdir=infra/terraform/github validate
terraform -chdir=infra/terraform/github plan
```

The plan must not replace or destroy the existing repository. Review imports,
repository settings, the `Protect main` ruleset, managed labels, security
resources, and the Dependabot activation variable before proceeding. Apply
remains a deliberate owner action after plan review; it is not triggered by
pull requests.
