# Supply Chain Security

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

## Version Pinning

- Pin direct package dependencies to exact versions in `package.json`.
- Keep the resolved transitive dependency graph in `pnpm-lock.yaml`.
- Pin standalone CLI installations to the exact approved version when the
  installer supports it.
- Pin newly introduced third-party GitHub Actions to an immutable commit SHA
  when practical, and retain the human-readable release version in a comment.
- Do not describe a floating major tag, version range, or remembered version as
  an exact pin.

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

## Dependabot Manual Review

When a Dependabot pull request requests owner review, treat it as a request for
evidence-based repository inspection rather than automatic rejection.

1. Identify the ecosystem, dependency type, update type, changed manifests, and
   explicit breaking markers from the pull request and Dependabot commit.
2. Read the upstream release notes, migration notes, and security advisory when
   available; use primary sources.
3. Search the repository for the dependency's imports, commands, configuration,
   inputs, outputs, permissions, and generated artifacts.
4. Compare the proposed manifest and lockfile diff with the package's actual
   role and check for unexpected transitive churn.
5. With owner authorization for dependency execution, run the smallest focused
   verification and then `pnpm.cmd check` before recommending merge.
6. When the evidence supports the update, add the Terraform-managed
   `deps:validated` label. This attests repository-specific compatibility and
   records that the update is ready for an owner merge decision after required
   checks pass.
7. Ask the owner to decide whether and when to merge, then confirm merge and
   branch cleanup. Escalate without applying the
   label when impact is materially high, evidence conflicts, required checks
   fail without a safe fix, or uncertainty remains after inspection.

Codex can perform this review when the owner resumes or starts a task with the
pull request in scope. Repository GitHub Actions do not independently start a
Codex desktop task, so the owner review notification remains the handoff trigger.
