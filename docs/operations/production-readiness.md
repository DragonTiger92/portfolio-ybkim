# Production Readiness

This document defines the minimum operational health model for the static
portfolio. It intentionally avoids server-oriented controls that do not provide
meaningful evidence for a static edge-hosted site.

## Health Model

A static site has no long-running application process whose internal state can
be represented by a traditional `/health` endpoint. Production health should be
measured through externally observable behavior.

| Signal                | Minimum Evidence                                         |
| --------------------- | -------------------------------------------------------- |
| Deployment validity   | The intended release and build are deployed              |
| Homepage availability | Production URL returns a successful HTTP response        |
| Content integrity     | A stable page marker or expected metadata is present     |
| Asset availability    | At least one release-critical asset returns successfully |
| Domain and TLS        | Production hostname resolves and its certificate works   |
| Release correlation   | Failure evidence identifies the deployed version         |

A small static build metadata file may expose a public release version and
build timestamp, but it must contain no secret and must not be the only health
signal.

## Deployment Smoke Check

`PBI-031` should run after a production deployment and before the release is
considered complete.

- Request the canonical production URL, not only a preview URL.
- Require a successful response, expected content marker, and critical asset.
- Confirm that production is not protected by preview authentication.
- Record the checked URL and release version in workflow evidence.
- Fail release completion and invoke the documented rollback path when the smoke
  check fails.

## Production Observability And Alerting

`PBI-032` establishes the proportionate observability baseline before PH-003
closes. It uses Checkly as the external synthetic monitor so checks continue
when the repository workflow is idle or unavailable. Implement Checkly after
the `v1.0.0` release, `PBI-069`, and the CI/CD deployment contract are stable,
but before PH-003 closes.

A scheduled GitHub Actions probe may supplement the monitor but should not be
the only uptime signal because scheduled runs can be delayed and public
repository schedules are disabled after prolonged inactivity.

Use the selected infrastructure components' built-in deployment, request, error,
DNS, TLS, and provider-status signals before adding another logging system.
Document which operational question each signal answers, how it correlates to a
release, where alerts arrive, who acknowledges them, and the minimum useful
retention. Keep credentials and private operational evidence out of the
repository.

Start without a contractual SLA. The initial operational objective is to detect
that the canonical homepage or a critical asset is unavailable and notify the
project owner promptly. Define a numerical SLO only after real operating data
makes it useful.

### Checkly Implementation Contract

Migrate the existing Better Stack Terraform root before using it. Until that
migration is reviewed, do not provide Better Stack credentials or run refresh,
plan, apply, import, destroy, or provider API commands from the monitoring root.
At implementation time, verify the current official Checkly provider in the
Terraform Registry and obtain owner approval for its exact stable version before
changing the provider and lockfile.

The steady state contains two Terraform-managed URL monitors:

- the canonical homepage; and
- one stable release-critical asset.

Run them every two minutes across Tokyo and Singapore in round-robin order.
Require HTTP 200, allow same-origin redirects, verify TLS, and warn 30 days
before certificate expiry. Keep the email alert channel owner-managed in the
Checkly UI so its destination does not enter Terraform state. Terraform receives
only the selected alert-channel identifier and attaches its subscription to each
managed monitor.

The HCP Terraform input contract is:

- `TF_VAR_checkly_api_key`: sensitive;
- `TF_VAR_checkly_account_id`: sensitive;
- `TF_VAR_checkly_alert_channel_id`: sensitive; and
- `TF_VAR_production_base_url`: non-sensitive.

Inventory existing Checkly resources before mutation and use import-first
handling where applicable. Stop for owner review before any create, replace,
destroy, apply, or provider-version change. Verify alert delivery without
failing Production: create a transient monitor for a same-origin 404 path,
confirm the DOWN alert, switch it to the homepage to confirm recovery, then
remove only that test monitor through a separately reviewed plan.

## Incident And Rollback Readiness

`PBI-033` should produce a concise runbook covering:

- alert ownership and acknowledgement;
- confirmation from a second network or probe;
- recent deployment, DNS, TLS, and provider-status checks;
- rollback to the last known-good production deployment;
- post-rollback smoke verification;
- a short incident note with cause, impact, and follow-up PBI; and
- escalation to the hosting provider when rollback does not restore service.

The selected hosting implementation must verify its actual rollback mechanism.
For the selected Cloudflare Pages target, only successful production
deployments are rollback targets; preview deployments are not.

## Logging Boundary

Do not add application logging merely to imitate a server architecture. Basic
PH-003 readiness under `PBI-032` uses deployment evidence, availability probes,
and provider-native request, error, and status signals. Do not add a custom
collector, logging server, or post-launch optimization item without a concrete
gap observed in production and a new architecture decision that accepts its
privacy, security, and maintenance cost.

Visitor-interest analytics belong to `PBI-015`, not the PH-003 health model.
Keep route, referrer, and outbound-action metrics aggregate and privacy-aware.
Do not add a server-side collector, analytics proxy, database, or private
dashboard unless a future ADR accepts the additional architecture, security, and
operations scope.
