# Deployment Architecture

Cloudflare Pages is the selected production-hosting target. GitHub Pages is not
a supported target. The existing Direct Upload Pages project remains the
hosting boundary, while GitHub Actions invokes the pinned Wrangler CLI for
reviewable preview, production, and formal-release delivery.

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
- Production uses the Cloudflare-managed `*.pages.dev` hostname returned by the
  Pages project. A purchased custom domain is not a launch dependency.
- Astro routes are generated for the selected root deployment path. Do not add a
  GitHub Pages project-path base solely as an obsolete production default.
- No application server runtime, database, or backend API is required.
- Post-launch visitor analytics should use provider-managed aggregate telemetry
  by default; a custom server-side collector requires a future ADR.
- Content should be bundled at build time or embedded as static source.
- Compatibility with another hosting provider is not a release acceptance
  criterion.

## Platform Components

| Component               | Responsibility                                              | Phase / State                         |
| ----------------------- | ----------------------------------------------------------- | ------------------------------------- |
| GitHub repository       | Source, pull requests, tags, and release metadata           | PH-001 baseline                       |
| GitHub Actions          | CI, protected preview orchestration, and production release | Source-ready; live activation pending |
| Astro                   | Produce the deployable `dist/` static artifact              | Existing build tool                   |
| Wrangler                | Upload an approved `dist/` artifact to Cloudflare Pages     | Pinned deployment implementation      |
| Cloudflare Pages        | Store deployments and serve static files through the edge   | Existing Direct Upload project        |
| Cloudflare Access       | Protect previews and authenticate CI smoke checks           | Human policy live; CI policy pending  |
| Terraform               | Manage long-lived GitHub and Cloudflare configuration       | GitHub root exists; Cloudflare PH-003 |
| GitHub Releases         | Record production notes and release artifacts such as SBOMs | PH-003 planned                        |
| Checkly                 | Detect production URL, critical-asset, and TLS failure      | Selected for post-v1 PH-003 work      |
| Privacy-aware analytics | Measure aggregate route and content interest after launch   | PH-004 planned                        |

There is no separately managed staging machine, origin application server,
database server, or logging server in the baseline architecture.

The exact Cloudflare Terraform resources and durable remote-state backend are
selected during PH-003. The baseline manages one Direct Upload Pages project
and preview Access boundary without a DNS zone, custom-domain binding, or Email
Routing resource.

## Direct Upload Readiness

Wrangler Direct Upload is the accepted delivery implementation. The repository
pins `wrangler@4.114.0`, validates the `dist/` inventory and Cloudflare
`_headers`, creates and revalidates an exact-revision file digest manifest, and
uses reusable build and Pages-upload workflows. The upload workflow resolves
the successful deployment through the Pages API by full commit SHA, branch, and
environment instead of trusting Wrangler's seven-character list display.

The workflows are inactive by default. `PAGES_DEPLOYMENT_ENABLED` must equal
`true` before any build with credentials or upload job runs. Its Terraform
baseline remains `false` until the named GitHub Environments, least-privilege
Cloudflare token, Access service token, and owner-visible smoke acceptance are
ready. Follow the [Pages delivery runbook](../operations/pages-delivery.md) for
the scoped GitHub configuration and activation sequence.

Activation follows live Cloudflare scope and Access verification. The
`cloudflare-pages-production` and `cloudflare-pages-preview` GitHub Environments
supply the least-privilege API token plus account, project, and production URL
variables. The workflow then uploads and smoke-checks the exact artifact;
eligible pull-request previews reuse that path only after Access acceptance.

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
- Give CI a dedicated Access service token and `Service Auth` (`non_identity`)
  policy. Store its client ID and secret only in the preview GitHub Environment;
  the smoke checker sends both headers without printing them.
- Until that Access boundary is verified, create remote previews only through an
  owner-reviewed `workflow_dispatch`.
- After `PBI-065` is activated, automatically deploy same-repository, non-draft
  pull requests whose head branch starts with `feature/`, `fix/`, or `content/`.
  Run the deployment only after required checks pass and deploy the exact checked
  revision.
- Keep `docs/`, `ci/`, `infra/`, `security/`, `refactor/`, and `chore/` branches
  manual by default. Exclude Dependabot, forks, drafts, `wip/*`, and invalid
  branch names from automatic credential-bearing preview jobs.
- Do not tag previews. Identify a production candidate by its full Git revision,
  checked artifact manifest, and evidence run until post-deployment Production
  smoke checks authorize the final release tag.

The preview workflow must use the `pull_request` event rather than
`pull_request_target`, keep its artifact build unprivileged, and use one
concurrency group per pull request. A default-branch `workflow_run` revalidates
the completed build before trusted tooling enters the credential-bearing
environment. Record the revision, preview URL, and authenticated smoke result.

The existing `PR Metadata` gate rejects invalid human branch names. `PBI-065`
must also encode the allow-list in the deployment workflow's eligibility job so
the public workflow and agent guidance are not the only controls.

## Deployment Workflow Boundary

The accepted orchestration direction is GitHub Actions plus Wrangler Direct
Upload, not Cloudflare Git integration. A reusable production-deployment
workflow is callable by automatic and manual entry points. The source contract
implements:

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

GitHub Environment creation, secret transfer, Cloudflare Terraform apply,
activation, and the first live run remain separate owner-reviewed operations.

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

Evaluate HSTS only after the live `*.pages.dev` production hostname and response
behavior are verified. Do not add custom-domain-only behavior to this baseline.

The account-free baseline is versioned in `public/_headers`. It keeps HTML and
stable public output on revalidation, makes only content-hashed `/_astro/`
assets immutable, permits the pinned jsDelivr stylesheet and font origin, and
retains the narrowly required inline-style affordance for browser-written
navigation state. Static validation does not complete `PBI-060`; the real
Cloudflare response headers and browser behavior still require live review.

## Release Versioning

Production releases use unsigned annotated Git tags in the form `vX.Y.Z`. The
tag version must equal the selected revision's `package.json.version`, and the
tag must peel to the exact revision already deployed and verified in Production.

Version increments are based on the user-visible product change:

- Major (`X`): significant repositioning, information architecture changes,
  core user experience changes, or public URL structure changes.
- Minor (`Y`): new sections, case studies, portfolio capabilities, or notable
  content and presentation improvements.
- Patch (`Z`): corrections, styling adjustments, accessibility fixes,
  performance fixes, link fixes, and other small behavior-preserving changes.

Preview deployments, ordinary `main` deployments, and operational-state
redeployments do not receive Git tags. Release candidates are identified by
their full Git revision and checked artifact rather than a `-rc.N` tag. A
production release tag represents a meaningful public release, and the final
version bump is decided intentionally rather than inferred from a deployment.

The formal release workflow is the only CI/CD path allowed to create a tag. It
must accept an explicit `X.Y.Z` version and full `main` revision, verify their
identity before deployment, and create the annotated tag only after Production
smoke checks succeed. A published tag is immutable: do not move, replace, or
delete it. Corrections use the next patch version, and rollback never moves an
existing tag.

If GitHub Release publication fails after tag creation, an idempotent retry is
allowed only when the existing tag peels to the same reviewed revision. A
different revision or version requires a new release decision rather than tag
mutation.

`scripts/validate-release-request.mjs` is the code-layer harness for that
policy. It rejects malformed versions, `package.json` version drift,
non-`origin/main` revisions, an existing tag that peels elsewhere, and an
unacknowledged retry. The workflow creates an unsigned annotated tag only after
the reusable production upload has resolved the exact deployment and the
canonical public smoke check has passed.

## Roadmap Release Targets

The first production public release is planned for `PH-003` and should use
`v1.0.0`.

Earlier roadmap phases do not receive production Git tags because they prepare
documentation, workflow, content, and implementation readiness without
publishing an operations-ready product. During `PH-003`, release candidates use
their full revision and checked artifact before the final `v1.0.0` tag.

Post-launch work in `PH-004` should use `v1.1.0` or later minor versions for
meaningful new capabilities such as analytics or discovery improvements, and
`v1.0.x` patch versions for corrections, small accessibility fixes, link fixes,
or deployment-safe refinements.
