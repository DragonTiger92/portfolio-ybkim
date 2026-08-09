# Cloudflare Terraform

This root defines the PH-003 Cloudflare infrastructure contract. It does not
authorize authentication, import, plan, apply, deployment, or credential
changes by itself. The staged preview CI retirement, final inventory, no-op
verification, and temporary provider-permission cleanup are complete.

## Managed Scope

The steady state manages:

- the existing owner identity provider as a data source;
- one Direct Upload Pages project served from its Cloudflare-managed hostname;
- one human account-member Access policy; and
- the Preview Access application attached only to that human policy.

The wildcard Access application intentionally excludes the production Pages
hostname. Custom domains, DNS zones and records, Email Routing, deployments,
public contact copy, analytics, GitHub Environments, and deployment credentials
are outside this root.

The Preview Access application is attached only to the human policy, the two
sensitive root outputs are gone, and the former CI policy and service token are
retired. Every remaining long-lived resource uses `prevent_destroy`; an
attribute change that requires replacement must fail rather than silently
destroy an existing resource.

## HCP Terraform Workspace

- organization: `dragontiger92`
- project: `portfolio-ybkim-infrastructure`
- workspace: `portfolio-ybkim-cloudflare`
- execution mode: Remote
- Terraform version: `1.15.6`
- automatic apply: disabled

Keep workspace variables outside repository files and agent prompts:

| Variable                               | HCP category | Sensitive |
| -------------------------------------- | ------------ | --------- |
| `CLOUDFLARE_API_TOKEN`                 | Environment  | Yes       |
| `TF_VAR_cloudflare_account_id`         | Environment  | No        |
| `TF_VAR_access_identity_provider_id`   | Environment  | No        |
| `TF_VAR_pages_project_name` (optional) | Environment  | No        |

The steady-state provider token needs only the selected account permissions
used by the remaining resources:

- Pages: Dashboard `Account / Cloudflare Pages / Edit`; API/provider
  `Cloudflare Pages Write`.
- Access application and policy: Dashboard
  `Account / Access: Apps and Policies / Edit`; API/provider
  `Access: Apps and Policies Write`.
- Identity-provider lookup: Dashboard
  `Account / Access: Organizations, Identity Providers, and Groups / Read`;
  API/provider `Access: Organizations, Identity Providers, and Groups Read`.

The temporary `Access: Service Tokens Write` permission used during retirement
has been removed from the HCP provider token. Do not restore it without a new,
separately reviewed resource transition. The owner-held manual preview
credential remains a separate Pages-only boundary.

Do not put IDs, tokens, Terraform credentials, or `*.tfvars` values in the
repository or an agent prompt. Do not query or print sensitive provider outputs.

## Import-First Boundary

Inventory Pages and Access immediately before any provider operation. Import a
matching live project, policy, token, or application before planning; never
create a duplicate resource to work around state drift.

Every plan must distinguish existing resources from absent resources. Stop for
owner review on any unexpected create, replace, destroy, or provider output.
Apply remains manual and automatic apply remains disabled. The GitHub production
activation does not require another plan or apply from this Cloudflare root.

## Completed Preview CI Retirement

The retirement preserved separate provider transitions and owner gates:

1. The first apply detached the CI policy from the Preview Access application
   and removed two sensitive root outputs without querying their values.
2. The owner reauthenticated through the remaining human Access policy from a
   fresh/private browser session.
3. The second apply destroyed only the detached CI policy and service token,
   with no create, replacement, or unrelated change.
4. Read-only reconciliation confirmed the four-object steady state, and a later
   standard run remained a no-op.
5. The temporary service-token permission was removed, the unused GitHub Preview
   Environment was deleted, and obsolete credentials were revoked.

The accepted configuration-binding evidence gap is closed by owner decision.
Do not create another Cloudflare run or reopen that evidence without a new
request.

## Credential-Free Validation

These local commands do not contact the configured remote backend when run as
shown:

```powershell
terraform fmt -check -recursive
terraform -chdir=infra/terraform/cloudflare init -backend=false
terraform -chdir=infra/terraform/cloudflare validate
```

Do not run refresh, plan, apply, import, destroy, Pages upload, or any Cloudflare
API command as part of credential-free validation.
