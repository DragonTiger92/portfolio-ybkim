# Deployment Architecture

The intended deployment target is GitHub Pages project-site hosting.

## Build Flow

```text
pnpm.cmd build
  -> tsc
  -> vite build
  -> dist/
```

The generated `dist/` directory is the deployable artifact.

## Hosting Assumptions

- The repository path is `portfolio-ybkim`.
- Vite `base` should remain `/portfolio-ybkim/` unless the hosting model changes.
- No server-side runtime, database, or API is available from GitHub Pages.
- Content should be bundled at build time or embedded as static source.

## Release Checks

- Run `pnpm.cmd check` before treating a release candidate as ready.
- Verify built asset paths under the project-site base path.
- Review public copy for private information before publishing.

## Release Versioning

Production releases use SemVer-style Git tags in the form `vX.Y.Z`.

Version increments are based on the user-visible product change:

- Major (`X`): significant repositioning, information architecture changes,
  core user experience changes, or public URL structure changes.
- Minor (`Y`): new sections, case studies, portfolio capabilities, or notable
  content and presentation improvements.
- Patch (`Z`): corrections, styling adjustments, accessibility fixes,
  performance fixes, link fixes, and other small behavior-preserving changes.

Release candidate tags use the form `vX.Y.Z-rc.N` only when a preview or
staging deployment is being evaluated as a production candidate.

The `N` value starts at `1` for each target release version and increments for
each new candidate of the same version. For example, `v1.2.0-rc.1` can be
followed by `v1.2.0-rc.2`, then the final production tag `v1.2.0`.

Ordinary feature branch previews do not require Git tags. A production release
tag should represent a meaningful public release, and the final version bump is
decided intentionally rather than inferred automatically from every deployment.
