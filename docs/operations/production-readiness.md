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

## Uptime Monitoring And Alerting

`PBI-032` should use an external synthetic monitor so checks continue when the
repository workflow is idle or unavailable. Provider selection is deferred until
implementation and should favor a suitable free tier, HTTPS checks, configurable
intervals, email alerting, and low maintenance.

A scheduled GitHub Actions probe may supplement the monitor but should not be
the only uptime signal because scheduled runs can be delayed and public
repository schedules are disabled after prolonged inactivity.

Start without a contractual SLA. The initial operational objective is to detect
that the canonical homepage or a critical asset is unavailable and notify the
project owner promptly. Define a numerical SLO only after real operating data
makes it useful.

## Incident And Rollback Readiness

`PBI-033` should produce a concise runbook covering:

- alert ownership and acknowledgement;
- confirmation from a second network or probe;
- recent deployment, DNS, TLS, and provider-status checks;
- rollback to the last known-good production deployment;
- post-rollback smoke verification;
- a short incident note with cause, impact, and follow-up issue; and
- escalation to the hosting provider when rollback does not restore service.

The selected hosting implementation must verify its actual rollback mechanism.
For the selected Cloudflare Pages target, only successful production
deployments are rollback targets; preview deployments are not.

## Logging Boundary

Do not add application logging merely to imitate a server architecture. Basic
PH-003 readiness uses deployment evidence, availability probes, and provider
status. `PBI-014` in PH-004 may add CDN analytics, request visibility, or error
logging only when an observed operational question justifies the privacy and
maintenance cost.
