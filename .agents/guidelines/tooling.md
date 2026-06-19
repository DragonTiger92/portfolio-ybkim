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
