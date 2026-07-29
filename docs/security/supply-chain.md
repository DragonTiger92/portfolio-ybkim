# Supply Chain Notes

## Package Policy

- Use `pnpm` only. On Windows PowerShell, prefer `pnpm.cmd`.
- Keep direct dependency versions exact in `package.json`.
- Do not add or update dependencies without an explicit decision.
- Prefer platform-native solutions for this small static site.
- Keep peer dependencies explicit. `autoInstallPeers` is disabled so optional
  peers do not silently enter the graph.

## SBOM

The CycloneDX SBOM is generated on demand as `sbom.cdx.json`. The generated file
is intentionally gitignored because cdxgen output can include
environment-specific paths and timestamps.

| Field        | Value                                                    |
| ------------ | -------------------------------------------------------- |
| Format       | CycloneDX JSON 1.6                                       |
| Scope        | JavaScript package graph and repository package metadata |
| Output       | Local or release artifact, not committed to Git          |
| Source       | `package.json`, `pnpm-lock.yaml`, local install metadata |
| Generator    | `@cyclonedx/cdxgen` through `pnpm.cmd sbom:cyclonedx`    |
| Dependencies | Unresolved license metadata remains generator output     |
| Update       | Regenerate after dependency or project license changes   |

Future production release automation is expected to attach a validated
CycloneDX JSON SBOM to each GitHub Release. Until that release workflow is
implemented, the pinned generator and command are the reviewable baseline.

CycloneDX does not use SPDX `NOASSERTION` as a required placeholder. The release
workflow should preserve missing license metadata as unresolved or omitted
generator output, validate the generated schema, and route unknown license data
to policy review instead of inventing a license conclusion.

## Transitive Dependency Decisions

- `yaml` is temporarily overridden only for the
  `yaml-language-server@1.20.0` path to exact version `2.8.3`. The Astro
  language service path pins vulnerable `yaml@2.7.1`, while `2.8.3` is the first
  patched version. A patched upstream path exists through newer
  `volar-service-yaml` and `yaml-language-server` releases, but the installed
  `@astrojs/language-server` version still pins the older service package.
  Remove the targeted override when the installed Astro language-service graph
  declares a patched version itself.
- The low-severity `esbuild@0.27.7` development-server advisory was resolved
  by upgrading Astro to a version that declares the patched `esbuild@0.28.1`
  range through its normal dependency graph. Do not reintroduce an `esbuild`
  override unless an upstream-compatible path is unavailable.

## Automated Review

- Dependabot checks npm package metadata and GitHub Actions updates on a weekly
  schedule.
- GitHub Actions version updates use a seven-day cooldown before Dependabot can
  propose them. Security updates remain eligible immediately and are not delayed
  by the cooldown.
- Dependabot requests owner review only when an update is major, indirect,
  unclassified, non-SemVer, grouped ambiguously, or carries an explicit breaking
  marker. The review request is the owner notification and manual-action trigger;
  GitHub notification delivery remains an account-level preference.
- Apply this update policy per pull request:

  | Update                                            | Handling                                                                                                  |
  | ------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
  | Direct npm dependency, SemVer patch or minor      | Enable auto-merge only after the PH-001 activation gate and all required checks pass                      |
  | GitHub Action, SemVer patch or minor              | Use the same gated auto-merge path; workflow and permission regressions remain covered by required checks |
  | Major, indirect, unknown, or non-SemVer           | Request owner or Codex-assisted review of compatibility and change scope                                  |
  | Explicit breaking marker                          | Disable automation and request owner review regardless of the reported SemVer level                       |
  | `deps:validated` after repository-specific review | Enable auto-merge after required checks, including for major, indirect, or explicitly breaking updates    |

- SemVer communicates compatibility intent, not proof of compatibility. For this
  small, repairable portfolio, a direct patch or minor update is accepted when
  Dependabot reports an unambiguous ecosystem and dependency type, no explicit
  breaking marker exists, and the repository's complete required checks pass.
  Security updates use the same eligibility test. Major, indirect, grouped
  ambiguously, and unclassified updates remain manual.
- Dependabot writes `dependency-type` and `update-type` fields into its generated
  commit metadata. The policy workflow reads those fields through the GitHub
  pull-request commits API and derives `npm_and_yarn` or `github_actions` from
  the generated head branch. A maintainer can inspect the same evidence in the
  pull request commit message or with `gh api repos/{owner}/{repo}/pulls/{pr}/commits`.
- Required checks provide systematic evidence: `Check` validates types, lint,
  governance, formatting, build output, HTML, standards, and browser behavior;
  Dependency Review rejects moderate-or-higher vulnerabilities and unapproved
  licenses; CodeQL covers supported static security analysis. These checks can
  establish repository compatibility within their coverage, but cannot prove
  the absence of every upstream behavioral defect.
- `deps:validated` is an explicit compatibility attestation, not a risk label.
  Apply it only after an owner-authorized human or Codex review traces the
  dependency's repository usage, reads primary-source release or migration
  notes, inspects manifest and lockfile scope, and obtains passing relevant
  checks. The label lets a reviewed major or exceptional update use the same
  check-gated merge and branch-cleanup path as a routine update.
- `DEPENDABOT_AUTOMERGE_ENABLED` is a Terraform-managed repository variable.
  It must not be enabled independently of repository auto-merge, strict required
  checks, and automatic merged-branch deletion.
- After a Dependabot pull request merges, GitHub deletes its head branch through
  the Terraform-managed `delete_branch_on_merge` repository setting. A closed,
  unmerged update requires an owner-recorded reason and may need a Dependabot
  ignore rule to prevent recreation.
- A weekly, manually repeatable security-audit workflow runs
  `pnpm audit --audit-level moderate` as an advisory signal outside the pull
  request merge gate.
- Dependency Review runs on pull requests to inspect newly introduced
  dependencies and license changes.
- Dependency Review acts as the CI License Audit policy gate by allowing only
  reviewed dependency license identifiers. It reduces license-policy risk but
  is not a complete legal audit of copied source, media assets, notices, or
  license obligations outside dependency metadata.
- The Dependency Review workflow uses package-specific license exceptions for
  reviewed transitive tooling packages whose license expressions include
  documentation, native binary, or bundled-library terms that are too broad for
  the global allow-list. Keep those exceptions version-specific and review them
  again when the package version changes.
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

- Parse generated `sbom.cdx.json` as JSON after regeneration.
- Regenerate the root CycloneDX SBOM with `pnpm.cmd sbom:cyclonedx` after
  dependency or project license changes.
- Run `pnpm.cmd format:check` before completion.
- Run `pnpm.cmd check` before treating a release candidate as ready.
