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

`PORTFOLIO_JOB_STATUS` is an optional non-public build variable. It accepts
`actively-looking` or `not-looking`, defaults to `actively-looking`, and fails
the build for any other value. Because Astro resolves it while generating the
static artifact, visitors cannot restore an omitted email action by changing
client-side state. Changing the status requires a new build and deployment.

### Build Runtime Contract

The account-free `PBI-010` foundation selects Node.js `24.18.0` and pnpm
`11.10.0` as exact build-tool contracts in `.node-version`, `package.json`, and
GitHub Actions. Cloudflare Pages receives a checked `dist/` artifact through
Direct Upload, so it does not run a separate application build or server
runtime.

Before accepting the contract, run the frozen install and canonical build in a
clean environment, record the effective Node.js and pnpm versions, and compare
the generated route and static-budget results with CI. Do not add an application
server runtime; Node.js remains a build-time tool only.

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
| GitHub Actions           | CI, protected preview orchestration, and production release | CI in PH-001; deployment in PH-003      |
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

## Direct Upload Readiness

Wrangler Direct Upload remains the accepted delivery direction. The account-free
foundation pins the latest cooldown-eligible stable `wrangler@4.114.0`, validates
the `dist/` inventory and Cloudflare `_headers`, creates an exact-revision file
digest manifest, provides a configurable HTTP smoke checker, and exposes a
`workflow_call` build-and-artifact workflow. It intentionally has no Pages
upload command, deployment trigger, GitHub environment, or Cloudflare
credential.

PH-003 makes Direct Upload operational in this order:

1. `PBI-012` and `PBI-010` confirm the managed Cloudflare scope, Pages project,
   production target, and configuration ownership.
2. `PBI-011` live-verifies a stable Wrangler release, pins the exact approved
   version under the repository's pnpm policy, and invokes it through the shared
   deployment implementation.
3. The protected GitHub environment supplies the non-public deployment
   configuration. `CLOUDFLARE_API_TOKEN` remains a least-privilege secret, and
   the workflow receives the matching `CLOUDFLARE_ACCOUNT_ID` and Pages project
   name without committing owner-specific values.
4. The workflow builds and verifies `dist/`, uploads that exact directory with
   Wrangler Direct Upload, runs production smoke checks, and preserves
   deployment and rollback evidence.
5. `PBI-065` reuses the checked build and upload path for eligible pull request
   revisions only after `PBI-026` verifies the preview Access policy.

The checked preview-eligibility module rejects drafts, forks, Dependabot,
unsupported branch prefixes, malformed revisions, and a head revision that no
longer matches the checked SHA. It does not itself trigger or authorize a
preview deployment.

Do not use a floating `npx wrangler` download in CI. Dependency installation,
Cloudflare resource creation, and credential configuration occur only during
the owning PH-003 PBIs with explicit owner approval.

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
- Protect preview hostnames through Cloudflare Access. The exact identity
  provider and allowlist are selected while implementing `PBI-026`.
- Until that Access boundary is verified, create remote previews only through an
  owner-reviewed `workflow_dispatch`.
- After `PBI-065` is activated, automatically deploy same-repository, non-draft
  pull requests whose head branch starts with `feature/`, `fix/`, or `content/`.
  Run the deployment only after required checks pass and deploy the exact checked
  revision.
- Keep `docs/`, `ci/`, `infra/`, `security/`, `refactor/`, and `chore/` branches
  manual by default. Exclude Dependabot, forks, drafts, `wip/*`, and invalid
  branch names from automatic credential-bearing preview jobs.
- Do not tag ordinary previews. Use an `-rc.N` tag only when the deployed preview
  is an actual candidate for the target production release.

The preview workflow must use the `pull_request` event rather than
`pull_request_target`, keep permissions least-privileged, and use one concurrency
group per pull request so a newer revision cancels a stale preview run. Record
the eligibility decision, source revision, protected preview URL, and smoke-check
result in the job summary. Retain complete logs for diagnosis, but review the
summary and first failed step before loading verbose output.

The existing `PR Metadata` gate rejects invalid human branch names. `PBI-065`
must also encode the allow-list in the deployment workflow's eligibility job so
the public workflow and agent guidance are not the only controls.

## Deployment Workflow Boundary

The accepted orchestration direction is GitHub Actions plus Wrangler Direct
Upload, not Cloudflare Git integration. A reusable production-deployment
workflow should be callable by both the automatic and manual entry points.
PH-003 implements:

1. full repository checks and a reproducible Astro build;
2. automatic protected previews for the documented branch allow-list plus a
   manually dispatched exception path;
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

### Operational State Redeployment

A build-time operational input can change the generated static artifact without
changing source code. Do not create a source commit, merge commit, release tag,
or GitHub Release solely to change such an input.

`PBI-011` provides a manually dispatched path that:

1. accepts an explicit, already reviewed `main` revision and a validated
   operational input;
2. runs the same checks, build, output-policy validation, Direct Upload, and
   production smoke checks as the reusable production deployment;
3. records the source revision, non-secret input selection, GitHub Actions run,
   and Cloudflare Pages deployment; and
4. supports rollback to the prior successful Pages deployment or a repeat run
   with the prior validated input.

This path still creates a new build and Pages deployment because the static
files change. It avoids manufacturing source history for an operational state
change while preserving the static, privacy-oriented output boundary.

## Release Checks

- Run `pnpm.cmd check` before treating a release candidate as ready.
- Verify built asset paths under the selected production base path.
- Review public copy for private information before publishing.

## Production Response Policy

`PBI-060` owns the first-release response-header and cache contract at the
Cloudflare edge. Implement the policy through a version-controlled Pages
configuration or another reviewable provider-native surface selected during
PH-003.

The baseline covers CSP, MIME sniffing protection, referrer policy, permissions
policy, framing protection, and cache behavior. Keep the policy proportional to
this static site:

- allow external style and font delivery only for the pinned Pretendard resource
  already reviewed through jsDelivr;
- do not require self-hosting that font without production reliability or policy
  evidence;
- verify browser-written theme and navigation state before tightening inline
  style-related CSP directives;
- cache content-hashed build assets as immutable while keeping HTML and stable
  public downloads on separately reviewed rules; and
- inspect response headers and rerun production smoke behavior against the real
  Cloudflare URL rather than treating a configuration file as sufficient proof.

Do not preselect HSTS or custom-domain-only behavior before the production domain
and TLS ownership are settled.

The account-free baseline is versioned in `public/_headers`. It keeps HTML and
stable public output on revalidation, makes only content-hashed `/_astro/`
assets immutable, permits the pinned jsDelivr stylesheet and font origin, and
retains the narrowly required inline-style affordance for browser-written
navigation state. Static validation does not complete `PBI-060`; the real
Cloudflare response headers and browser behavior still require live review.

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
