# ADR-0011: Use Owner-Driven Pages Previews

## Status

Accepted

## Context

The portfolio uses GitHub Flow and occasionally needs production-like remote QA
before a topic branch is merged. The original ADR-0007 preview decision added
automatic pull-request deployments, a credential-bearing GitHub Environment,
and an Access service token so CI could smoke-check protected deployments.

The single maintainer does not need a remote preview for every eligible pull
request. Keeping automation and non-human credentials for an occasional owner
action broadens the security and operations surface without proportional value.

## Decision

Supersede only the automated-preview portion of ADR-0007.

- The owner may manually deploy the current human GitHub Flow topic branch to
  the existing Direct Upload Pages project when remote QA is useful.
- Use the repository-pinned Wrangler version, a clean revision equal to the
  pushed topic-branch tip, and the locally checked `dist/` output.
- Pass the actual topic branch and full revision as Pages deployment metadata.
  Do not create a synthetic preview branch or use `main` for this purpose.
- Keep the wildcard Preview Access application and human account-member policy.
- Do not maintain a GitHub preview Environment, automatic preview workflow, CI
  Access service token, Service Auth policy, or automated preview smoke check.
- The owner signs in through Access and completes preview QA manually. Preview
  acceptance is optional review evidence, not a required GitHub status check.
- Keep ADR-0007's production, formal-release, tagging, and rollback decisions.

## Consequences

- Preview credentials and lifecycle state are limited to the human owner.
- The deployed preview maps directly to the branch under review.
- Preview QA is deliberately manual and does not claim automated coverage.
- Preview deployment frequency and evidence depend on owner judgment.
- The production contract remains active with exact-artifact GitHub Actions
  delivery and public smoke checks; `v1.0.0`, `v1.0.1`, and subsequent `main`
  deliveries exercised that boundary.
- The CI-only Access and GitHub preview resources were retired through the
  staged provider sequence. The human Preview Access boundary remains.
