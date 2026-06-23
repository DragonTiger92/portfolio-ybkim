# Tooling Guidelines

## External Software Version Freshness

This procedure applies when selecting or installing an externally distributed
dependency package, CLI, GitHub Action, or similar development tool.

Do not select a version from model memory alone.

Before requesting approval to install or upgrade external software:

1. Query a live authoritative source, such as the configured package registry,
   the vendor's official release feed, or the tool's official repository.
2. Cross-check the package identity, publisher, stable version, and release
   channel. Do not substitute an alpha, beta, release candidate, or other
   prerelease for a stable release unless the user explicitly requests it.
3. State the exact version, query date, and authoritative source in the
   user-facing proposal. Explicitly distinguish live verification from model
   memory.
4. Pin the exact version in the install command when the installer supports it.
5. If live verification fails or authoritative sources disagree, stop and
   explain the uncertainty instead of proposing a remembered version.

After installation:

- Verify the installed version and resolved executable or package identity.
- Report whether the installed version matches the approved version.
- Record only non-secret provenance information. Never expose repository tokens,
  package credentials, or private registry configuration.

## Agent Output Hygiene

Keep command and file output bounded so useful diagnostics remain visible without
flooding the agent context.

- Inspect file names, sizes, counts, or a diff summary before reading large content.
- Scope searches by path, file type, and match count. Prefer targeted `rg` queries over
  recursive directory dumps.
- Use `git status --short`, `git diff --stat`, `git diff --name-only`, or a targeted diff
  before requesting a full repository diff.
- Read only the relevant range or matching entries from logs, lockfiles, generated
  manifests, SBOM files, and large documentation files.
- Run the canonical verification command once. If it fails, summarize the relevant
  error and rerun only the failing stage or a narrower reproduction.
- When inspecting CI, start with the failed job or step instead of loading every job log.
- Do not suppress warnings or errors from authoritative checks merely to reduce output.
  Prefer filtering successful progress output only when the savings are material.

## Windows Sandbox Diagnostics

On this Windows workspace, `spawn EPERM` from Node.js or Vite, or a local executable
reported as unavailable through `pnpm exec`, can be caused by the Codex sandbox rather
than the project.

1. Capture one concise diagnostic and do not repeat the same noisy command in the same
   sandbox.
2. Confirm the executable exists in the project before treating it as missing.
3. When the command is required for verification, rerun it once in an approved external
   Windows PowerShell environment.
4. Report the sandbox result and the external result separately. Do not use this path to
   dismiss an ordinary code or configuration failure.

Keep machine-specific resolved diagnostics in the user's global Codex memory or
other machine-local state rather than in a completed repository handoff.
