# ADR-0010: Use CycloneDX JSON SBOM

## Status

Accepted

## Context

The project needs a machine-readable Software Bill of Materials (SBOM). The
earlier SPDX JSON artifact worked as a bootstrap baseline, but maintaining a
custom generator created unnecessary churn whenever the dependency graph
changed.

## Decision

Generate CycloneDX JSON with the pinned `@cyclonedx/cdxgen` development
dependency through `pnpm.cmd sbom:cyclonedx`. The command writes local output to
`sbom.cdx.json`, but the generated file is not committed.

The generator must not install dependencies while producing the SBOM. Missing
license metadata should remain unresolved generator output rather than being
translated into invented license conclusions.

## Consequences

- SBOM regeneration uses a maintained CycloneDX tool instead of a custom script.
- The generated artifact remains easy to find locally while avoiding
  environment-specific path and timestamp churn in Git.
- Production release automation can reuse the same SBOM format when release
  artifact publication is implemented.
- The dependency graph includes the SBOM generator itself, so supply-chain
  review should treat it as part of the quality tooling surface.
