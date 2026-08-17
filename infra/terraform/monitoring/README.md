# Checkly production monitoring

This Terraform root defines the external production-availability signals for the portfolio.
It manages only Checkly URL monitors. The existing remote backend remains unchanged and is
not part of the provider migration.

## Steady state

| Terraform address                    | Target                        | Purpose               |
| ------------------------------------ | ----------------------------- | --------------------- |
| `checkly_url_monitor.homepage`       | Canonical production origin   | Homepage availability |
| `checkly_url_monitor.critical_asset` | `/assets/brand/logo-mark.svg` | Stable asset delivery |

Both monitors use the following explicit contract:

- active, two-minute checks;
- the Checkly Hobby plan's Singapore and North California locations in round-robin mode;
- TLS verification and redirect following enabled;
- an HTTP status assertion requiring `200`;
- one retry after 60 seconds in the same region;
- run-based alerting after the first failed run, with reminders disabled;
- one active subscription to an owner-managed alert channel; and
- `prevent_destroy` for the steady resources.

The provider cannot enforce a same-origin redirect chain. Confirm that invariant separately
against the deployed targets before applying or accepting runtime evidence.

## Inputs

Supply these values only through protected Terraform workspace variables or an equivalent
secret-safe runtime mechanism. Do not put values in source, command arguments, plans, logs,
pull requests, or evidence notes.

| Environment input                 | Terraform type | Sensitive | Contract                                      |
| --------------------------------- | -------------- | --------- | --------------------------------------------- |
| `TF_VAR_checkly_api_key`          | `string`       | Yes       | Non-empty API credential                      |
| `TF_VAR_checkly_account_id`       | `string`       | Yes       | Non-empty account selector                    |
| `TF_VAR_checkly_alert_channel_id` | `number`       | Yes       | Positive integer channel ID                   |
| `TF_VAR_production_base_url`      | `string`       | No        | HTTPS origin without path, query, or fragment |

This root intentionally does not manage a `checkly_alert_channel` resource. The owner-managed
channel must be verified separately for failure, recovery, and 30-day SSL-expiry notifications.
Notification destinations must not enter Terraform state.

The Checkly Hobby plan location contract is Singapore (`ap-southeast-1`) and North California
(`us-west-1`). Revalidate both locations against the active account entitlement before
inventory, planning, or apply; do not silently substitute locations or change the account
tier.

## Provider and lockfile gate

The source pins `checkly/checkly` exactly. Before regenerating the lockfile, revalidate the
latest stable provider version from official sources. Provider selection and lockfile changes
are a separately reviewed gate.

When that gate is approved, use backend-disabled initialization, create checksums for both
supported runner platforms, and validate the root:

```powershell
terraform -chdir=infra/terraform/monitoring init -backend=false -upgrade
terraform -chdir=infra/terraform/monitoring providers lock `
  -platform=windows_amd64 -platform=linux_amd64 checkly/checkly
terraform -chdir=infra/terraform/monitoring validate
```

Review the resulting lockfile without manual edits. It must contain exactly the pinned Checkly
provider, include Windows and Linux checksums, and contain no legacy provider entry.

## Import-first workflow

Account inventory, state inspection, imports, plans, and applies are independent hard gates.
Keep their output secret-safe and reduce any report to resource types, Terraform addresses,
counts, actions, and pass/fail results.

Before planning:

1. Confirm the selected alert channel is owner-managed and unique.
2. Inventory URL monitors matching each target and expected ownership.
3. Import an existing match into its single steady address.
4. Classify a target as a create only after confirming that no matching monitor exists.

Stop on duplicates, ownership conflicts, an unexpected resource type, a remote object already
bound to another address, legacy state, or an orphan provider. Reconcile those conditions under
a separate approval before continuing.

## Plan and apply guardrails

Do not print a raw plan or saved-plan content. Project only action counts by approved resource
address. Stop on any unexpected create, update, replace, destroy, unrelated resource action, or
branch/head drift.

Apply only the exact reviewed plan under a separate approval. After apply, require exactly two
managed steady URL monitors and a no-op plan. This root does not authorize changes to another
provider or deployment of the production site.

## Controlled alert verification

The alert proof is a separate, controlled production gate. Use an uncommitted
`alert-verification.tf` only after confirming that the designated path returns a real `404` and
that its redirect chain stays on the production origin.

The transient resource must:

1. expect `200` from the controlled `404` path and produce a DOWN notification;
2. change only its URL to the homepage and produce a recovery notification; and
3. be removed under a distinct plan showing exactly one transient destroy.

Never commit or push the transient source. After removal, require the two steady resources and
another no-op plan.

## Evidence boundary

Record only the event type, KST timestamp, and pass/fail outcome for alert proof. Keep account
details, channel destinations, resource IDs, provider responses, and raw Terraform output out
of repository documentation.

The minimum documented evidence-retention baseline is seven days for raw results and 30 days
for aggregates. If the active entitlement is longer, record only the confirmed safe duration,
without account identifiers or billing details.
