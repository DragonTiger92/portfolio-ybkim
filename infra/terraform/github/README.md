# GitHub Governance Terraform

This Terraform root manages long-lived GitHub repository governance for
`portfolio-ybkim`.

## Managed Scope

- repository feature and merge settings;
- project-specific issue labels;
- Dependabot vulnerability alerts and security updates; and
- the `main` branch ruleset.

Milestones, issue assignment, repository files, Actions workflows, secrets, and
Cloudflare resources are managed elsewhere.

## Bootstrap Boundary

Do not apply this root before the workflow-baseline pull request is merged. The
desired ruleset requires `Check`, `Dependency Review`, and `PR Metadata`, which
must exist on `main` first. The bootstrap pull request is the one-time exception
to the final ruleset.

Before the first apply:

1. Configure a durable remote Terraform backend. Local `*.tfstate` files are
   ignored only as a safety net and are not the accepted operational backend.
2. Provide a least-privilege GitHub token through the `GITHUB_TOKEN` environment
   variable. Do not put it in a `.tfvars` file.
3. Review the import plan for the existing repository and security resources.
4. Confirm that the expected status check names have run on `main`.

## Local Validation

```powershell
terraform fmt -check -recursive
terraform -chdir=infra/terraform/github init -backend=false
terraform -chdir=infra/terraform/github validate
```

Use a credentialed `terraform plan` only after the remote backend decision is
complete. Apply remains a deliberate owner action; it is not triggered by pull
requests.
