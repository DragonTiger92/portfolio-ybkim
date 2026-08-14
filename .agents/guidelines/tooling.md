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

For machine-consumed values that must remain exact, command timeout planning,
and project-budget headroom, also follow
`execution-integrity-and-budgets.md`. Output-bounding guidance never authorizes
shortening Base64, signed URLs, hashes, opaque identifiers, or serialized
payloads passed to another tool.

## Windows Shell Compatibility

Use the Codex native Windows agent with PowerShell for this Windows-hosted
workspace. WSL is not required for ordinary project work.

- Write agent-run commands in PowerShell syntax. Do not paste Bash-only syntax
  such as `export`, heredocs, `/dev/null`, or `rm -rf` into PowerShell.
- Treat the shell declared by the active Codex environment as authoritative.
  Translate commands for that shell before execution instead of trial-running a
  command written for another shell and retrying after it fails.
- Keep one shell responsible for each command. Use Git Bash only when reproducing
  an explicitly Bash-specific workflow, and invoke it as a separate process
  rather than piping PowerShell output into Bash.
- From PowerShell, continue to use `pnpm.cmd` for project commands. This selects
  the Windows command shim deterministically and avoids dependence on PowerShell
  script-shim resolution.
- Treat `package.json` scripts as package-manager command-shell syntax. A script
  that works through `pnpm.cmd` is not necessarily valid when pasted directly
  into Windows PowerShell 5.1.
- Prefer vendor-installed executable shims and normal `PATH` discovery. Use an
  absolute executable path only for diagnosis or when a tool is not yet visible
  in the inherited environment.
- After changing user `PATH` or installing a CLI, restart the terminal, Codex app,
  or thread that must inherit it. Verify PowerShell resolution with `Get-Command`
  and Git Bash resolution with `type -a` before changing configuration again.
- Do not hardcode the user or machine `PATH` in project `.codex/config.toml` merely
  to repair a stale process environment.
- Do not use `Start-Process` from a foreground agent tool to detach a long-running
  development or preview server, especially with redirected standard output or
  error streams. The tool harness may continue waiting on the descendant process
  and stop accepting steering even after the shell command appears complete. Use
  a managed long-running command facility, track its exact process ID, and stop it
  explicitly after verification.
- If PowerShell blocks vendor `.ps1` shims, inspect all execution-policy scopes
  first. Prefer the Codex-documented `RemoteSigned` policy at `CurrentUser` scope;
  do not weaken `LocalMachine`, Group Policy, or use `Bypass`/`Unrestricted`
  without an explicit need and approval.
- On this Windows PowerShell 5.1 environment, the current-user profile normalizes
  console input, console output, and native-process pipelines to UTF-8 without a
  BOM. Do not assume that this also changes legacy file-cmdlet defaults.
- Read a known UTF-8 file with `Get-Content -Encoding UTF8`. Do not write source
  files with `Out-File`, `Set-Content`, shell redirection, or another command whose
  Windows PowerShell 5.1 encoding is implicit; use the repository editing and
  formatting tools instead.
- PowerShell 7 may be installed side by side through Microsoft's recommended
  WinGet package when its features are needed. Do not require it while the native
  Windows PowerShell agent and project checks remain compatible.

## Windows Sandbox Diagnostics

Prefer the native Windows sandbox with the narrowest writable-workspace and
network permissions that can complete the approved task. Do not weaken the
sandbox or switch to unrestricted execution merely to suppress a permission
prompt.

The project may use the vendor-installed `pnpm.cmd` shim discovered through
`PATH` when its resolved version matches the `packageManager` contract and the
active sandbox can execute it, use the selected package store, and access the
project installation. Do not vendor a second pnpm binary, hardcode its
machine-specific path, or force a repository-local store solely to avoid
sandbox approval prompts.

Treat launcher execution, package-store access, project `node_modules` access,
network access, and protected Git metadata as separate diagnostic boundaries.
A writable project tree does not imply that `.git` metadata is writable, and a
Git permission prompt is not evidence that pnpm must be reinstalled. If a
reproducible package-manager failure remains after one bounded diagnostic,
propose the narrowest reviewed ACL, store, or permission-profile change before
changing repository package-manager configuration.

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
