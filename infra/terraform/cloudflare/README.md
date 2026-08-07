# Cloudflare Terraform

This root defines the PH-003 Cloudflare infrastructure contract. It does not
authorize authentication, import, plan, apply, deployment, or credential
changes by itself. `PBI-012` remains in progress until the staged preview CI
retirement and final no-op verification are complete.

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

The first transition is complete: the Preview Access application is attached
only to the human policy, the two sensitive root outputs are gone, and the owner
successfully reauthenticated from a fresh/private browser session. This
follow-up tracked configuration removes only the detached `preview_ci_smoke`
service-token and reusable-policy blocks. Those two resources remain live until
the separately reviewed destroy apply. Actual credential revocation occurs when
the service token is deleted in that second transition.

Every long-lived resource uses `prevent_destroy`. Changing an attribute that
requires replacement must first fail rather than silently destroy an existing
resource. Removing a resource block also removes its lifecycle guard, so the
two CI-only blocks require a separately reviewed destroy plan.

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

The staged service-token deletion additionally requires the Dashboard permission
`Account / Access: Service Tokens / Edit` (API/provider
`Access: Service Tokens Write`). Keep that permission only through the reviewed
destroy apply and no-op verification, then remove it from the HCP provider token.
This temporary permission is not part of the manual preview credential contract.

Do not put IDs, tokens, Terraform credentials, or `*.tfvars` values in the
repository or an agent prompt. Do not query or print sensitive provider outputs.

## Import-First Boundary

Inventory Pages and Access immediately before any provider operation. Import a
matching live project, policy, token, or application before planning; never
create a duplicate resource to work around state drift.

Every plan must distinguish existing resources from absent resources. Stop for
owner review on any unexpected create, replace, destroy, or provider output.
Apply remains manual and automatic apply remains disabled.

## Staged Preview CI Retirement

Do not combine the two provider transitions:

1. Completed: the first remote plan contained `0 add`, one in-place application
   change, `0 destroy`, and exactly two sensitive root-output removals whose
   values remained unqueried.
2. Completed: after owner-approved apply, the owner successfully reauthenticated
   through human Access from a fresh/private browser session.
3. Current tracked change: remove only the
   `cloudflare_zero_trust_access_policy.preview_ci_smoke` and
   `cloudflare_zero_trust_access_service_token.preview_ci_smoke` blocks.
4. Review a second remote plan containing `0 add`, `0 change`, and exactly two
   destroys. Stop on create, replacement, or any additional change.
5. After owner-approved apply, inventory the four remaining logical objects and
   require a no-op remote plan.
6. Only then remove `Access: Service Tokens Write` from the provider token and
   retire the unused GitHub preview Environment. Revoke its Pages token unless
   the owner explicitly retains it outside GitHub for manual Wrangler uploads.

The two destroy counts are expected from the tracked graph, not authorization
to run a plan or apply. A live plan remains the authority.

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
