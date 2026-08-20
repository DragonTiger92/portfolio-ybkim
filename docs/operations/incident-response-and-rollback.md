# Incident Response And Rollback

This runbook defines the single-maintainer response path for the static
Cloudflare Pages production site. It does not authorize a deployment, workflow
dispatch, credential change, provider mutation, tag, GitHub Release, or cleanup
by itself.

## Ownership And Entry Conditions

The project owner acknowledges production incidents and decides whether a
production mutation may proceed. Enter this runbook after one of these signals:

- a failed post-deployment canonical smoke check;
- a Checkly DOWN notification;
- a Cloudflare deployment, DNS, TLS, or provider-status signal; or
- a user report confirmed by a second independent network or probe.

Do not roll back from one transient observation while the canonical smoke,
steady monitors, and provider status all remain healthy.

## Secret-Safe Triage

1. Record the KST observation and owner-acknowledgement times.
2. Confirm the homepage and a release-critical asset from a second network or
   independent probe.
3. Identify the intended full `main` revision and latest completed production
   workflow without exposing Environment or provider values.
4. Review recent production deployment conclusions, DNS and TLS behavior, and
   official Cloudflare status.
5. Classify the failure as deployment-specific, provider-wide,
   client-specific, or unresolved.

Keep credentials, account or deployment identifiers, notification
destinations, protected deployment locations, raw provider output, and private
incident evidence outside the repository and public reports.

## Response Decision

- Observe and escalate a provider-wide incident when a prior deployment would
  use the same failing provider surface.
- Use a fresh operational redeploy of a reviewed revision when only a
  build-time availability input must be restored.
- Use Cloudflare Pages native rollback when evidence implicates the active
  deployment and a prior known-good production deployment is available.
- Never rerun a historical upload workflow merely to repeat its smoke step.
- Never use Formal Release for rollback or recovery.

The rollback target must be a uniquely identified, previously successful
production deployment. Prefer the newest known-good full `origin/main`
revision that is an ancestor of current `main` and passed canonical smoke.
Preview deployments are not rollback targets.

Cloudflare documents that a project can roll back to a previous successful
production deployment and later roll back again to a newer deployment. See
[Cloudflare Pages Rollbacks](https://developers.cloudflare.com/pages/configuration/rollbacks/).

## Native Rollback Preconditions

Before the owner confirms a native production rollback:

- obtain the separate owner Deployment approval;
- require exact local, remote, and live `main` identity for the incident record;
- require no active Pages Production or Formal Release run;
- confirm the target is a unique successful Production deployment, not a
  Preview deployment;
- identify the current deployment to preserve as a possible restore target;
- confirm the canonical and independent-monitor baseline when the incident
  still allows it; and
- record only the full target and restore revisions, sanitized conclusions, and
  KST timestamps.

Stop on revision drift, an active conflicting run, a missing or ambiguous
deployment, an unhealthy pre-drill baseline, or an unexpected provider state.

## Execute And Verify Native Rollback

1. The owner uses the existing Cloudflare dashboard session to confirm native
   rollback to the selected successful Production deployment.
2. Resolve the active production revision through a secret-safe read-only
   projection.
3. Run the canonical public smoke against the homepage, critical asset, and web
   manifest.
4. Confirm the independent Checkly signal returns to or remains in its expected
   healthy state.
5. Record the active full revision, KST action time, and smoke and monitor
   conclusions.

Do not create or move a tag, publish or edit a GitHub Release, mutate Terraform,
or rerun an old workflow.

## Recovery And Restore

For a real incident, retain the known-good production deployment until the
cause is fixed and a reviewed recovery revision is ready. Normal pull request,
merge, and automatic production gates apply to that recovery.

For a controlled rollback drill, the owner uses native rollback again to select
the preserved newer successful Production deployment for exact current `main`.
Repeat the active-revision projection, canonical smoke, and independent Checkly
verification. The drill succeeds only when production again resolves to current
`main` and no production run remains active.

## Break-Glass Exact-Revision Redeploy

Use this fallback only when native rollback or native restoration is unavailable
or unsuccessful and the owner has approved the exact deployment.

Dispatch a new `Pages Production` run from `main` with:

- the approved full `origin/main` revision; and
- the previously validated public job-status input.

The workflow must run the current trusted check, build, manifest, upload, exact
deployment-resolution, and canonical-smoke path. This creates a new production
deployment; it does not rerun or reuse a historical workflow execution. It
creates no tag or GitHub Release.

Stop if the requested revision is not a full `origin/main` ancestor, inputs
drift, a production run is active, or any workflow gate fails.

## Controlled Drill Boundary

A drill uses only a pre-approved pair of successful Production deployments:

1. revalidate both full revisions, deployment uniqueness, current `main`, zero
   active production runs, canonical health, and independent monitoring;
2. perform native rollback and verify the known-good revision;
3. perform native restoration and verify exact current `main`; and
4. record the two revisions, KST timestamps, and sanitized smoke and probe
   conclusions.

A drill is not evidence of an actual outage, cause, or impact. Do not create an
incident PBI solely because the controlled state change occurred as designed.

## Failure And Escalation

If rollback smoke fails, attempt only the pre-approved native restore. If native
restore also fails, use the pre-approved break-glass exact-revision redeploy.
After any unexpected failure, recover the last approved state if possible and
stop the closeout flow.

Escalate to Cloudflare when provider status, DNS or TLS behavior, or a failed
known-good recovery indicates that changing the deployed revision cannot
restore service. Open a focused follow-up PBI when repository source, workflow,
configuration, or monitoring remediation is required.

## Incident Record

Record only:

- KST detection, acknowledgement, action, and recovery times;
- a sanitized signal and impact summary;
- current, rollback, and restored full revisions;
- workflow, smoke, and monitoring conclusions;
- cause classification; and
- a follow-up PBI or provider escalation when required.

Do not store protected values or raw provider output in the incident note.
