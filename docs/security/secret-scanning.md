# Secret Scanning

GitHub secret scanning and push protection remain enabled independently of CI.
Gitleaks adds generic API-key, private-key, and supported provider-pattern checks
to local staged changes and CI. Detection is heuristic: zero findings do not
prove that every password or confidential value is absent.

## Setup And Commands

Use the reviewed [Gitleaks 8.30.1 release](https://github.com/gitleaks/gitleaks/releases/tag/v8.30.1).
The installer supports the project's Windows x64 and Linux x64 hosts, downloads
only the official archive, and verifies the SHA-256 pinned in
`scripts/gitleaks-tool.mjs` before extraction. It retains the upstream MIT license
under gitignored `.tools/gitleaks/8.30.1/`. No npm package or lockfile change is
needed. Review version, platform checksums, release age, and compatibility before
updating the pin; never silently download a floating latest release in a hook.

```powershell
pnpm.cmd secrets:install
pnpm.cmd secrets:self-test
pnpm.cmd secrets:staged
pnpm.cmd secrets:history
```

- Run install once per checkout and again after an approved pin change.
- Run the synthetic self-test before the first real scan. It checks detection,
  redaction, staged isolation, and secrets removed later in Git history.
- `secrets:staged` scans the index before lint-staged can print source errors.
  Missing or mismatched scanner versions block the commit instead of skipping.
- `secrets:history` scans history reachable from the current `HEAD`, including
  deleted content and merge-commit additions. Check out `main` for the
  default-branch audit. Shallow checkouts are rejected for history/range scans.
- `secrets:range <base-sha> <head-sha>` accepts two full 40-character commit SHAs
  and scans additions in that commit range. It does not accept arbitrary Git
  options or refs.
- `test:secrets` verifies safe result projection and failure handling without
  requiring the binary or network; it is part of `pnpm.cmd check`.

## CI And Scope

The CI `Secret Scan` job uses read-only repository permissions, a complete Git
checkout without persisted credentials, the pinned installer, and the synthetic
self-test. `secrets:ci` reads the event's PR base/head SHAs for pull requests;
pushes to `main` and manual CI runs scan current `HEAD` history. Quality depends
on this job, so the existing required `Check` fails when scanning fails or is
cancelled. No provider credentials, validation requests, or paid scanner service
are needed.

Do not scan unrelated refs, private local context, or untracked/ignored workspace
files. Public files already committed remain within the history scan even if a
later ignore rule would exclude them. Local `.env` and `.env.*` files remain
ignored; tracked `.env.example` and `.env.*.example` templates must contain
placeholders only. Ignore rules cannot protect tracked files or forced additions.

## Output And Exceptions

The wrapper captures stdout and stderr, requests full redaction, and emits only
repository-relative paths, rule IDs, line numbers, revisions, and counts. Errors,
malformed reports, timeouts, and inconsistent exit codes fail closed. Raw output,
matched values, source snippets, identities, JSON/SARIF reports, and report
artifacts must not be published. Canary fixtures exist only in task-owned
temporary repositories and are removed after the self-test.

Keep the upstream rules through `.gitleaks.toml`. Review false positives
individually with narrowly scoped, documented configuration exceptions. Inline
`gitleaks:allow` comments are ignored; `.gitleaksignore` files are rejected so an
untracked local file cannot silently bypass the scanner. Never accept all
findings as a baseline or disable broad rule categories.

GitHub non-provider patterns and validity checks require account/repository
support. Validity checks contact issuers to assess detected tokens and improve
triage rather than detection coverage. Keep automated validation and revocation
outside this baseline; adopting them requires a separate decision about provider
requests and credential effects. Follow the root
[Security Policy](../../SECURITY.md#secret-prevention-and-response) to revoke or
rotate suspected exposures before coordinating any history cleanup.
