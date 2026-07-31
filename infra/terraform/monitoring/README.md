# Production Monitoring Terraform

This root defines the credential-free PH-003 monitoring contract. It does not
create a Better Stack account, token, monitor, incident, or notification during
the foundation stage. `PBI-032` remains open until the monitors and an actual
DOWN/UP email notification are verified against production.

## Future HCP Terraform Workspace

- organization: `dragontiger92`
- project: `portfolio-ybkim-infrastructure`
- workspace: `portfolio-ybkim-monitoring`
- execution mode: Remote
- Terraform version: `1.15.6`
- automatic apply: disabled

After the owner creates a Better Stack personal team, store a team-scoped Uptime
API token only as the sensitive HCP environment variable
`TF_VAR_betteruptime_api_token`. Store `TF_VAR_production_base_url` as a
non-sensitive workspace environment variable after the canonical HTTPS origin
is live. Do not put either value in repository files or prompts.

## Monitor Contract

The root declares two HTTPS status monitors:

- the canonical homepage; and
- `/assets/brand/logo-mark.svg` as a stable critical asset.

Both use the free-tier 180-second interval, follow redirects, validate TLS and
30-day certificate expiry, send email notifications through the account's
default escalation path, and are protected from accidental destruction. A
separate escalation policy is intentionally excluded from the single-maintainer
baseline.

The owner must verify the recipient, trigger a controlled DOWN/UP test, confirm
the received email, and record retention, privacy, and ownership evidence before
`PBI-032` can be completed.

## Credential-Free Validation

The only commands authorized before account setup are:

```powershell
terraform fmt -check -recursive
terraform -chdir=infra/terraform/monitoring init -backend=false
terraform -chdir=infra/terraform/monitoring providers lock -platform=windows_amd64 -platform=linux_amd64
terraform -chdir=infra/terraform/monitoring validate
```

Do not run refresh, plan, apply, import, destroy, or any Better Stack API command
during the account-free foundation stage.
