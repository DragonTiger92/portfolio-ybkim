# Supply Chain Notes

## Package Policy

- Use `pnpm` only. On Windows PowerShell, prefer `pnpm.cmd`.
- Keep direct dependency versions exact in `package.json`.
- Do not add or update dependencies without an explicit decision.
- Prefer platform-native solutions for this small static site.

## SBOM

The SBOM is stored at the repository root as `sbom.spdx.json`.

| Field        | Value                                                         |
| ------------ | ------------------------------------------------------------- |
| Format       | SPDX 2.3 JSON                                                 |
| Scope        | npm package graph and repository-level license intent         |
| Source       | `package.json`, `pnpm-lock.yaml`, local install metadata      |
| Root license | `MIT AND LicenseRef-Portfolio-Materials-All-Rights-Reserved`  |
| Dependencies | `NOASSERTION` when a package license is not locally confirmed |
| Update       | Regenerate after dependency or project license changes        |

Future production release automation is expected to replace the manual root
SBOM workflow with a CI-generated CycloneDX JSON SBOM attached to each GitHub
Release. Until that release workflow is implemented, the root SPDX artifact
remains the current baseline.

CycloneDX does not use SPDX `NOASSERTION` as a required placeholder. The release
workflow should preserve missing license metadata as unresolved or omitted
generator output, validate the generated schema, and route unknown license data
to policy review instead of inventing a license conclusion.

## Automated Review

- Dependabot checks npm package metadata and GitHub Actions updates on a weekly
  schedule.
- A weekly, manually repeatable security-audit workflow runs
  `pnpm audit --audit-level moderate` as an advisory signal outside the pull
  request merge gate.
- Dependency Review runs on pull requests to inspect newly introduced
  dependencies and license changes.
- Dependency Review acts as the CI License Audit policy gate by allowing only
  reviewed dependency license identifiers. It reduces license-policy risk but
  is not a complete legal audit of copied source, media assets, notices, or
  license obligations outside dependency metadata.
- Repository security setup should enable Dependency Graph, Dependabot alerts,
  Dependabot security updates, secret scanning, and push protection where the
  repository and account support them.
- CodeQL default setup should scan JavaScript and TypeScript with the `extended`
  query suite. The `main` ruleset should reject analyzer
  errors and high-or-higher security alerts after the bootstrap merge.
- Secret scanning and push protection should remain enabled. Non-provider
  patterns, validity checks, and AI-based generic detection remain optional or
  unavailable until repository support and signal quality are confirmed.
- Sensitive vulnerability reports should use GitHub private vulnerability
  reporting rather than a public discussion or work item.
- Release notes are generated from pull request metadata and labels when a
  GitHub Release is created.

## Repository Licensing

- Source code and build/configuration files are licensed under the MIT License.
- Portfolio content, docs, personal text, visual design content, images, and
  other non-code materials are All Rights Reserved unless otherwise stated.
- The human-readable licensing boundary is documented in root `NOTICE.md`.
- Third-party code, images, fonts, media, and copied material follow the
  [Pre-Release License Compliance Review](license-compliance.md).

## Verification

- Parse `sbom.spdx.json` as JSON after regeneration.
- Run `pnpm.cmd format:check` before completion.
- Run `pnpm.cmd check` before treating a release candidate as ready.
