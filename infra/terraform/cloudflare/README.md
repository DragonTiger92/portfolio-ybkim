# Cloudflare Terraform

This root defines the PH-003 Cloudflare infrastructure contract without
performing account authentication, imports, plans, applies, or deployments.
`PBI-012` remains in progress until the live resources and no-op plan are
verified.

## Managed Scope

- the existing owner identity provider as a data source;
- one Direct Upload Pages project served from its Cloudflare-managed
  `*.pages.dev` subdomain;
- account-scoped human and CI service-token Access policies plus the preview
  Access application under the provider-returned Pages subdomain; and
- non-sensitive names and hostnames plus sensitive, one-time CI token transfer
  outputs.

The wildcard Access application intentionally excludes the production Pages
hostname. Custom domains, DNS zones and records, Email Routing, deployments,
public contact copy, and analytics are not managed by this root. The portfolio
keeps its existing Gmail contact address and does not require a purchased
domain.

Every long-lived resource uses `prevent_destroy`. Changing an attribute that
requires replacement must first fail rather than silently destroy the existing
resource. Removing that guard is a separate owner-reviewed operation.

The CI policy uses Cloudflare Access `Service Auth` (`non_identity`) with a
dedicated service token. The authenticated preview smoke check sends its client
ID and secret through the standard `CF-Access-Client-Id` and
`CF-Access-Client-Secret` headers. Those values belong only in the
`cloudflare-pages-preview` GitHub Environment. Never copy them into repository
variables, workflow inputs, logs, or documentation.

## Future HCP Terraform Workspace

- organization: `dragontiger92`
- project: `portfolio-ybkim-infrastructure`
- workspace: `portfolio-ybkim-cloudflare`
- execution mode: Remote
- Terraform version: `1.15.6`
- automatic apply: disabled

Store these workspace variables only after the owner has enabled MFA and
created the Zero Trust organization:

| Variable                               | HCP category | Sensitive |
| -------------------------------------- | ------------ | --------- |
| `CLOUDFLARE_API_TOKEN`                 | Environment  | Yes       |
| `TF_VAR_cloudflare_account_id`         | Environment  | No        |
| `TF_VAR_access_identity_provider_id`   | Environment  | No        |
| `TF_VAR_pages_project_name` (optional) | Environment  | No        |

The Cloudflare API token should be scoped only to the selected account with the
provider-documented permissions needed by this root:

- Account / Cloudflare Pages / Edit;
- Account / Access: Apps and Policies / Edit;
- Account / Access: Organizations, Identity Providers, and Groups / Read.

Do not put IDs, tokens, Terraform credentials, or `*.tfvars` values in the
repository or an agent prompt.

## Bootstrap And Import Order

Do not run `plan` or `apply` until all account-dependent prerequisites are
complete. Import any pre-existing Direct Upload Pages project, Access policy,
service token, and Access application before the first plan. Never create a
duplicate Access application or service token when an equivalent live resource
already exists.

Re-inventory Pages/Workers and Access immediately before planning. Import any
matching Direct Upload project, policy, token, or application if one exists.
Otherwise, the first reviewed plan should create only resources proven absent
from the live account. It must contain no replacement or destroy action. After
apply, transfer the service-token values through an owner-visible secret-safe
procedure, then run a second plan and require no changes.

Do not read the sensitive Terraform outputs through an agent tool. The owner
must place `preview_ci_access_client_id` and
`preview_ci_access_client_secret` directly into the scoped GitHub Environment,
then confirm only the secret names and metadata—not their values—for review.

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
