# ADR-0003: Use SPDX JSON SBOM

## Status

Superseded by [ADR-0010](0010-use-cyclonedx-json-sbom.md)

## Context

The project should include a Software Bill of Materials (SBOM) as part of its
supply-chain hygiene. SBOMs are most useful when they are machine-readable.

## Decision

Keep the SBOM as `sbom.spdx.json` in SPDX 2.3 JSON format at the repository
root. Keep human-readable dependency policy in `docs/security/supply-chain.md`.

## Consequences

- Tools and reviewers can inspect the SBOM as structured data.
- The root artifact is easy to find.
- The companion docs can stay short and focused on policy rather than duplicating
  package inventory.
