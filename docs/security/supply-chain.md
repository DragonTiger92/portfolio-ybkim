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

## Automated Review

- Dependabot checks npm package metadata and GitHub Actions updates on a weekly
  schedule.
- Dependency Review runs on pull requests to inspect newly introduced
  dependencies and license changes.
- Copyleft license families that could conflict with the repository licensing
  intent are denied at the pull-request review gate.
- Release notes are generated from pull request metadata and labels when a
  GitHub Release is created.

## Repository Licensing

- Source code and build/configuration files are licensed under the MIT License.
- Portfolio content, docs, personal text, visual design content, images, and
  other non-code materials are All Rights Reserved unless otherwise stated.
- The human-readable licensing boundary is documented in root `NOTICE.md`.

## Verification

- Parse `sbom.spdx.json` as JSON after regeneration.
- Run `pnpm.cmd format:check` before completion.
- Run `pnpm.cmd check` before treating a release candidate as ready.
