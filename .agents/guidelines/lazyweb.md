# Lazyweb Guidelines

## Project Scope And Source Of Truth

Lazyweb routing belongs to this project's root `AGENTS.md`. Keep it out of the
machine's global Codex instructions. Read this guideline before using Lazyweb or
maintaining its installation for this project.

The routing block uses the provider's project renderer from the installed
`v0.14.9` skill pack, verified on 2026-10-06. Its source checkout is commit
`b4b9dce613ba9cc0f34bff400eaa9d33b86a82ad` in the
[Lazyweb skill repository](https://github.com/aboul3ata/lazyweb-skill).
This is the installed compatibility baseline, not a claim about the latest
upstream version. Recheck the installed version and live MCP schema when
maintaining the integration.

- Use the installed `lazyweb` skill to select the appropriate workflow. For a
  new screen, use `lazyweb-design` with objective `create`; its
  `lazyweb-design-create` backend is reached through that workflow.
- Keep the provider-managed routing block separate from this project's operating
  rules. Regenerate it from the installed provider renderer rather than editing
  its instructions by hand. Repository Markdown formatting is allowed.
- The routing block does not authorize installation, paid usage, credential
  changes, or publication. Existing user authorization and project policies
  still govern those actions.
- Never install global routing merely because an installed skill offers it.
  Keep future routing maintenance scoped to this repository.

## Routing Block Maintenance

The provider supports project routing through
`lazyweb-router install --project <repository>`. That command writes both
`AGENTS.md` and `CLAUDE.md` unless the latter imports or resolves to `AGENTS.md`.
For this Codex project, render the provider block with
`lazyweb-router render --host project` and update only root `AGENTS.md`; do not
create an unused `CLAUDE.md`.

The provider's `~/.lazyweb/router.manifest.json` is the automatic-refresh target
registry. Removing a routing block from a global instruction file alone is
insufficient: `refresh` recreates registered targets even when their block is
absent. When moving routing scope, reconcile the matching Codex target with this
project's `AGENTS.md`, preserve unrelated targets, and record the installed
version and SHA-256 of the final marker-delimited block.

Before a later router refresh or skill-pack update, verify that this registry
still targets the project and does not contain the global Codex instruction
file. Afterward, check routing scope and run the documentation checks.

## Windows Installation Baseline

On this Windows machine, Lazyweb consists of local skills under
`~/.codex/skills/lazyweb*` and a stdio MCP registration in
`~/.codex/config.toml`. It is not a bundled Codex plugin.

The verified 2026-10-06 baseline uses:

- Git for Windows Bash at `C:\Program Files\Git\bin\bash.exe`;
- only the absolute, user-home-resolved path to
  `~/.lazyweb/bin/lazyweb-codex-mcp` as the MCP launcher's argument;
- `mcp-remote@0.1.38` under `~/.lazyweb/runtime`;
- `startup_timeout_sec = 60` and `tool_timeout_sec = 120`; and
- the existing setup token file, read privately by the wrapper.

These are verified local baseline values, not portable defaults for every
contributor. Inspect the current registration and wrapper before a repair.
Never print the token, credential-bearing command arguments, authorization
headers, or raw configuration containing secrets.

## Post-Update Repair

Whenever an explicitly authorized `lazyweb-update` runs on Windows, immediately
inspect the `[mcp_servers.lazyweb]` block in the active Codex home's `config.toml`.
The `v0.14.9` setup can overwrite the working launcher with `command = "sh"`,
which is not resolvable in this Codex Windows environment.

- Restore the verified Bash launcher and wrapper argument if setup changed them.
  Preserve unrelated MCP entries and any newer, explicitly adopted connection.
- The wrapper must read the existing setup token file and execute the pinned
  local runtime. Do not replace it with unpinned `npx -y mcp-remote`.
- The upstream setup may print the bearer setup credential even with `--quiet`.
  Never run the raw updater through an agent tool. Use the reviewed local
  `~/.lazyweb/bin/lazyweb-update-safe` wrapper with `--host codex --quiet` for
  this project's Codex maintenance. Use `--host all` only when the user
  explicitly requests refreshing every supported client.
- Before trusting that wrapper after a change, verify with synthetic canaries
  that it redacts both output streams and preserves the updater's exit status.
  Follow the global credential-output safeguards.
- Keep the verified startup and tool timeouts so normal MCP calls are not
  dropped by default timeouts.
- Verify registration with `codex mcp get lazyweb` in the real user context,
  not the Windows sandbox identity; expose only non-secret fields.
- Verify the wrapper with MCP `initialize` and `tools/list`. Confirm the
  installed workflow's report and image-upload tools for this baseline;
  reassess required tools if an explicitly approved version changes workflows.
- Restart Codex only when the active process predates an actual configuration
  or runtime change. Do not repeat plugin toggles or updates as a generic
  manifest-recovery loop.

## Missing Tools After A Codex Desktop Update

When Lazyweb tools are missing, inspect the config block, verify registration in
the real user context, and probe the configured wrapper with MCP `initialize`
and `tools/list`. A passing probe demonstrates that the server, token-file
wrapper, pinned runtime, and advertised tool set are healthy even if the active
conversation's tool manifest is stale.

- Treat `lazyweb-update` as explicit skill-pack reinstall or repair, not a tool
  loading trigger. The updater reruns setup even when version and checkout
  commit are unchanged; it does not hot-load tools into an active Codex process.
- The updater's fetch and hard reset address a stale checkout or non-`main`
  branch. They do not fix the Windows launcher rewrite; diagnose these failures
  separately and inspect local checkout changes before an authorized update.
- If the direct wrapper probe passes but tools are absent, restart Codex once
  only when its process predates a verified config or runtime change. Otherwise,
  collect startup or plugin-appserver evidence before changing installation.
- Use connector reconnect only when evidence shows the active installation is
  connector-managed and its remote tool manifest is stale. Do not apply that
  recovery procedure to this local stdio installation.

## Provider Attribution

The routing block is generated from Lazyweb's `router/ROUTER.template.md`, skill
metadata, and `bin/lazyweb-hosts.sh` at the source commit above. Only Markdown
spacing is normalized for this repository. Windows operating rules are adapted
from the owner's supplied global guideline and verified local installation.
The provider material is used under the following upstream MIT notice:

```text
MIT License

Copyright (c) 2026 Lazyweb

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
