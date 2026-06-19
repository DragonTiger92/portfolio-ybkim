# Package And Supply Chain Security

## Package Manager

Use `pnpm` only.

Do not use:

- `npm install`
- `yarn`
- `bun install`

On Windows PowerShell, prefer `pnpm.cmd` because plain `pnpm` can fail under execution policy restrictions.

Unless explicitly requested, do not modify the lockfile manually.

Preferred commands:

```bash
pnpm.cmd install
pnpm.cmd dev
pnpm.cmd build
pnpm.cmd lint
```

If a command does not exist in `package.json`, report that clearly instead of inventing an alternative.

## Dependency Mutation Policy

Do not run package installation or dependency mutation commands unless the user explicitly requests or approves the exact action.

This includes:

- `pnpm install`
- `pnpm add`
- `pnpm update`
- `pnpm dlx`
- `pnpm import`

When dependency installation is approved, use `pnpm` only and respect the repository's `pnpm-workspace.yaml` security settings:

- direct dependency versions must be pinned exactly in `package.json`
- new installs must use the configured package cooldown period before accepting newly published packages
- dependency lifecycle build scripts must remain strict and explicit

## External Tool And Version Freshness

Do not select an externally distributed package or CLI version from model
memory alone.

Before requesting approval to install or upgrade an external tool:

1. Query a live authoritative source, such as the configured package-manager
   repository, the vendor's official release feed, or the tool's official
   repository.
2. Cross-check the package identity, publisher, stable version, and release
   channel. Do not substitute alpha, beta, release-candidate, or similarly
   pre-release builds for a stable release unless the user explicitly requests
   one.
3. State the exact version, query date, and authoritative source in the
   user-facing approval request. Explicitly distinguish live verification from
   model-memory knowledge.
4. Pin the exact version in the install command when the package manager supports
   it.
5. If live verification fails or sources disagree, stop and explain the
   uncertainty instead of installing a remembered version.

After installation:

- Verify the installed binary's version and resolved executable path.
- Report whether the installed version matches the approved version.
- Record only non-secret provenance information; never expose repository tokens,
  package credentials, or private registry configuration.

## Current pnpm Hardening Intent

The repository should use:

- exact direct dependency versions in `package.json`
- `savePrefix: ""`
- `minimumReleaseAge: 10080`
- `minimumReleaseAgeIgnoreMissingTime: false`
- `minimumReleaseAgeStrict: true`
- `verifyDepsBeforeRun: error`
- `strictDepBuilds: true`

## Dependency Rules

Before adding a dependency:

1. Check whether the task can be solved with existing tools.
2. Prefer platform or framework-native solutions.
3. Explain why the dependency is needed.
4. Confirm that it fits the project size and purpose.

Do not add dependencies for trivial utilities.

## Preferred Verification

For verification, prefer non-mutating checks first:

```bash
pnpm.cmd audit --audit-level moderate
pnpm.cmd typecheck
pnpm.cmd lint
pnpm.cmd format:check
pnpm.cmd build
```
