# Cloudflare Terraform

This root defines the PH-003 Cloudflare infrastructure contract without
performing account authentication, imports, plans, applies, or deployments.
`PBI-012` remains in progress until the live resources and no-op plan are
verified.

## Managed Scope

- the existing production zone and owner identity provider as data sources;
- one Direct Upload Pages project, its apex custom-domain binding, and the
  proxied apex CNAME required by the provider;
- an account-scoped Access policy and application for
  `*.portfolio-ybkim.pages.dev`;
- the existing verified Email Routing destination, zone settings, and one
  receive-only contact rule; and
- non-sensitive names and hostnames as outputs.

The wildcard Access application intentionally excludes the production
`portfolio-ybkim.pages.dev` hostname and the custom apex domain. DNS records,
other than the Pages apex CNAME, deployments, public contact copy, analytics,
and unrelated zone settings are not managed by this root.

Every long-lived resource uses `prevent_destroy`. Changing an attribute that
requires replacement, including the verified destination address, must first
fail rather than silently destroy the existing resource. Removing that guard is
a separate owner-reviewed operation.

## Future HCP Terraform Workspace

- organization: `dragontiger92`
- project: `portfolio-ybkim-infrastructure`
- workspace: `portfolio-ybkim-cloudflare`
- execution mode: Remote
- Terraform version: `1.15.6`
- automatic apply: disabled

Store these workspace variables only after the owner has enabled MFA, confirmed
the zone, and created the Zero Trust organization:

| Variable                               | HCP category | Sensitive |
| -------------------------------------- | ------------ | --------- |
| `CLOUDFLARE_API_TOKEN`                 | Environment  | Yes       |
| `TF_VAR_cloudflare_account_id`         | Environment  | No        |
| `TF_VAR_production_zone_name`          | Environment  | No        |
| `TF_VAR_access_identity_provider_id`   | Environment  | No        |
| `TF_VAR_email_destination_address`     | Environment  | Yes       |
| `TF_VAR_pages_project_name` (optional) | Environment  | No        |

The Cloudflare API token should be scoped only to the selected account and zone
with the provider-documented permissions needed by this root:

- Zone / Zone / Read;
- Zone / DNS / Edit;
- Account / Cloudflare Pages / Edit;
- Account / Access: Apps and Policies / Edit;
- Account / Access: Organizations, Identity Providers, and Groups / Read;
- Account / Email Routing Addresses / Edit;
- Zone / Email Routing Rules / Edit; and
- Zone / Zone Settings / Edit.

Do not put IDs, tokens, destination addresses, Terraform credentials, or
`*.tfvars` values in the repository or an agent prompt.

## Bootstrap And Import Order

Do not run `plan` or `apply` until all account-dependent prerequisites are
complete. In particular, create the destination from the Cloudflare dashboard,
complete its inbox verification, and confirm it remains verified before
importing it.

Import existing Email Routing state in this order:

1. `cloudflare_email_routing_address.portfolio_destination` with
   `<account_id>/<destination_address_identifier>`;
2. `cloudflare_email_routing_settings.production` with `<zone_id>`; and
3. `cloudflare_email_routing_rule.portfolio_contact` with
   `<zone_id>/<rule_identifier>`.

Then import any pre-existing Pages project, Pages domain, apex DNS record,
Access policy, and Access application before the first plan. The DNS record
import form is `<zone_id>/<dns_record_id>`. Never create a duplicate Access
application when the dashboard's preview-protection toggle already created one.
The first reviewed plan must contain no replacement or destroy action. After
apply, run a second plan and require no changes.

## Credential-Free Validation

The only commands authorized before account setup are:

```powershell
terraform fmt -check -recursive
terraform -chdir=infra/terraform/cloudflare init -backend=false
terraform -chdir=infra/terraform/cloudflare providers lock -platform=windows_amd64 -platform=linux_amd64
terraform -chdir=infra/terraform/cloudflare validate
```

Do not run refresh, plan, apply, import, destroy, Pages upload, or any Cloudflare
API command during the account-free foundation stage.
