# Security Policy

## Supported Scope

`portfolio-ybkim` is a personal static portfolio project. It does not currently
provide a backend service, user accounts, or a production API.

## Supported Version

Security review applies to the current `main` branch and the latest public
deployment after releases begin. Older commits and unreleased topic branches
are not maintained as separate supported versions.

## Reporting A Vulnerability

Do not open a public issue for a suspected vulnerability or exposed secret.
Use GitHub's private vulnerability reporting flow for this repository so the
maintainer can investigate before disclosure.

Include the affected path or revision, expected impact, reproduction steps, and
any suggested mitigation that can be shared safely. Do not include real secrets
or third-party personal data in the report.

## Private Material

Private or confidential source material must not be published in this
repository. Keep it in owner-controlled storage outside the public repository,
and publish only disclosure-reviewed summaries.

## Secret Prevention And Response

Keep credentials in the existing protected GitHub Environment or provider secret
store. Never put them in source, public documentation, frontend bundles, or build
artifacts. Astro `PUBLIC_` variables are public browser inputs and must not contain
secrets.

Local `.env` and `.env.*` files are ignored. Only disclosure-reviewed
`.env.example` and `.env.*.example` templates with placeholders may be tracked.
Ignore rules do not protect already tracked files or prevent forced additions.

Keep GitHub secret scanning and push protection enabled. Local hooks and CI also
run the pinned Gitleaks scanner. See the
[secret detection policy](docs/security/secret-scanning.md)
for coverage limits and future scanner requirements.

Treat a potentially exposed credential as compromised: notify the maintainer
privately, revoke or rotate it at its issuer, update its protected consumers, and
verify recovery. Removing the text from a commit alone does not invalidate it.
Review affected history, logs, and artifacts after containment; coordinate any
history rewrite separately. Record only sanitized paths, revisions, timestamps,
and conclusions, never credential values or raw scanner reports.
