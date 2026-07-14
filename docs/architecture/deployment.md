# Deployment Architecture

Cloudflare Pages is the selected production-hosting target. GitHub Pages is not
a supported target. Provider-specific deployment implementation is deferred to
`PH-003 Deployment And Operations Readiness`.

## Build Flow

```text
pnpm.cmd build
  -> astro check
  -> astro build
  -> dist/
```

The generated `dist/` directory is the deployable artifact.

## Hosting Assumptions

- Production uses a Cloudflare Pages project when the PH-003 decision is
  implemented.
- Astro routes are generated for the selected root deployment path. Do not add a
  GitHub Pages project-path base solely as an obsolete production default.
- No application server runtime, database, or backend API is required.
- Post-launch visitor analytics should use provider-managed aggregate telemetry
  by default; a custom server-side collector requires a future ADR.
- Content should be bundled at build time or embedded as static source.
- Compatibility with another hosting provider is not a release acceptance
  criterion.

## Platform Components

| Component                | Responsibility                                              | Phase / State                           |
| ------------------------ | ----------------------------------------------------------- | --------------------------------------- |
| GitHub repository        | Source, pull requests, tags, and release metadata           | PH-001 baseline                         |
| GitHub Actions           | CI, manual preview orchestration, and production release    | CI in PH-001; deployment in PH-003      |
| Astro                    | Produce the deployable `dist/` static artifact              | Existing build tool                     |
| Wrangler                 | Upload an approved `dist/` artifact to Cloudflare Pages     | PH-003 planned                          |
| Cloudflare Pages         | Store deployments and serve static files through the edge   | PH-003 planned                          |
| Cloudflare Access        | Protect selected preview deployments from public access     | PH-003 planned                          |
| Terraform                | Manage long-lived GitHub and Cloudflare configuration       | GitHub root exists; Cloudflare PH-003   |
| GitHub Releases          | Record production notes and release artifacts such as SBOMs | PH-003 planned                          |
| External synthetic probe | Detect production URL or critical-asset failure             | Provider selected in PH-003             |
| Privacy-aware analytics  | Measure aggregate route and content interest after launch   | PH-004 planned                          |
| Cloudflare DNS and TLS   | Serve an optional custom domain securely                    | Only if a custom domain is adopted      |
| Cloudflare Email Routing | Receive domain contact mail at the portfolio Gmail address  | `PBI-049`, after custom-domain adoption |

There is no separately managed staging machine, origin application server,
database server, or logging server in the baseline architecture.

The exact Cloudflare Terraform resources and durable remote-state backend are
intentionally selected during PH-003. Deferring those choices is expected while
the Cloudflare account, domain, Access policy, and deployment resources do not
yet exist.

## Static Artifact And Serving Model

- Astro renders routes, content, and imported assets into `dist/`.
- Content-hashed build assets under `dist/assets/` are treated as immutable for
  one deployment.
- GitHub Actions uploads `dist/` through Wrangler; the generated directory is
  not committed to Git.
- Cloudflare Pages retains deployment artifacts and serves the selected
  production or preview artifact from its edge network.
- GitHub Releases hold release evidence such as notes and SBOM files. They are
  not the runtime storage used to serve the website unless a future decision
  explicitly attaches the site bundle.

## Preview And Staging Model

Use the term **protected preview environment** rather than implying a dedicated
staging server. A protected preview can serve the staging purpose for remote QA,
but it is a Cloudflare Pages deployment with its own URL and static artifact.

- Verify every build locally with the normal check/build path and use
  `astro preview` when browser inspection is needed.
- Create a remote preview manually through `workflow_dispatch` only when shared
  QA, production-like edge serving, or release-candidate evidence is useful.
- Protect preview hostnames through Cloudflare Access. The exact identity
  provider and allowlist are selected while implementing `PBI-026`.
- Do not tag ordinary previews. Use an `-rc.N` tag only when the deployed preview
  is an actual candidate for the target production release.

## Deployment Workflow Boundary

The accepted orchestration direction is GitHub Actions plus Wrangler Direct
Upload, not Cloudflare Git integration. A reusable production-deployment
workflow should be callable by both the automatic and manual entry points.
PH-003 implements:

1. full repository checks and a reproducible Astro build;
2. optional, manually dispatched protected preview deployment;
3. automatic production deployment on each push to `main`;
4. production smoke checks and rollback evidence; and
5. production tag, generated release notes, and CycloneDX SBOM publication.

The automatic `main` workflow deploys and smoke-checks the integrated commit but
does not create a release tag for every deployment. A manually triggered formal
release workflow accepts an explicit version and reviewed `main` revision, then
uses the same production-deployment implementation.

The formal release order is:

1. validate the version, revision, permissions, and absence of a duplicate tag;
2. run checks, build the site, and generate release artifacts such as the SBOM;
3. deploy the exact build to Cloudflare Pages production;
4. pass production smoke checks against the canonical URL;
5. create and push the `vX.Y.Z` tag for the deployed revision; and
6. publish the GitHub Release with generated notes and release artifacts.

This is transaction-like orchestration rather than a literal cross-platform
transaction. A failure before smoke-check success creates no release tag. A
failure while creating the tag or GitHub Release leaves a verified production
deployment that the owner can finalize through an idempotent retry without
inventing a different version.

## Release Checks

- Run `pnpm.cmd check` before treating a release candidate as ready.
- Verify built asset paths under the selected production base path.
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

## Roadmap Release Targets

The first production public release is planned for `PH-003` and should use
`v1.0.0`.

Earlier roadmap phases do not receive production Git tags because they prepare
documentation, workflow, content, and implementation readiness without
publishing an operations-ready product. During `PH-003`, release candidates may
use `v1.0.0-rc.N` before the final `v1.0.0` tag.

Post-launch work in `PH-004` should use `v1.1.0` or later minor versions for
meaningful new capabilities such as analytics or discovery improvements, and
`v1.0.x` patch versions for corrections, small accessibility fixes, link fixes,
or deployment-safe refinements.
