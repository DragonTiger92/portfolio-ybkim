# Cloudflare Pages Delivery

This runbook defines the activation and operating boundary for GitHub Actions
plus Wrangler Direct Upload. It does not authorize credential changes,
Terraform apply, deployment, tag creation, or release publication by itself.

## Delivery Model

Keep the existing Cloudflare Pages project in Direct Upload mode. GitHub Actions
builds and verifies one exact-revision `dist/` artifact, then invokes the pinned
repository Wrangler version. Do not create a second Git-integrated Pages project
or use a floating `npx wrangler` download.

The reusable boundaries are:

- `site-artifact.yml`: check, build, manifest, and upload the exact artifact;
- `pages-upload.yml`: revalidate, upload, resolve the full-SHA deployment, and
  smoke-check it;
- `pages-preview.yml`: build eligible PR artifacts without credentials;
- `pages-preview-deploy.yml`: use trusted default-branch tooling for automatic
  and reviewed manual preview uploads;
- `pages-production.yml`: automatic `main` delivery and operational redeploys;
- `release-evidence.yml`: SBOM and ScanCode evidence; and
- `formal-release.yml`: explicit version/revision validation, production
  acceptance, annotated tag, and GitHub Release.

## GitHub Configuration Contract

Keep the repository variable `PAGES_DEPLOYMENT_ENABLED` set to `false` until all
other setup and acceptance work is complete.

| GitHub Environment            | Variables                                                                                   | Secrets                                                                  |
| ----------------------------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `cloudflare-pages-production` | `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_PAGES_PROJECT_NAME`, `CLOUDFLARE_PAGES_PRODUCTION_URL` | `CLOUDFLARE_API_TOKEN`                                                   |
| `cloudflare-pages-preview`    | `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_PAGES_PROJECT_NAME`                                    | `CLOUDFLARE_API_TOKEN`, `CF_ACCESS_CLIENT_ID`, `CF_ACCESS_CLIENT_SECRET` |
| `formal-release`              | None                                                                                        | None; use deployment protection and the workflow-scoped `GITHUB_TOKEN`   |

Never print values while checking configuration. Verify only environment and
secret names, update timestamps, and protection metadata. Restrict the
Cloudflare token to the selected account and Pages project capabilities needed
for upload and deployment lookup.

## Authenticated Preview Acceptance

The wildcard preview Access application keeps its human allow policy and adds a
dedicated CI service token through a `Service Auth` (`non_identity`) policy.
The preview smoke check sends the standard Cloudflare Access client ID and
secret headers to the exact deployment URL, then verifies the homepage and a
stable brand asset. A normal `Allow` policy is not a substitute for the service
authentication policy.

Automatic preview delivery uses a two-workflow trust boundary. The
`pull_request` workflow builds and checks the PR head without secrets. After it
completes, a default-branch `workflow_run` re-evaluates the PR metadata,
downloads the named full-SHA artifact, and executes only trusted `main` delivery
tooling inside the credential-bearing GitHub Environment. Do not replace this
with `pull_request_target` or execute PR scripts after secrets are available.

Before activation:

1. inventory Pages and Access again and import equivalent live resources;
2. review a Cloudflare Terraform plan with no replacement or destroy action;
3. apply only after owner approval;
4. let the owner transfer the sensitive service-token values directly to the
   preview GitHub Environment;
5. manually dispatch one preview and review its URL and authenticated smoke
   evidence; and
6. set `PAGES_DEPLOYMENT_ENABLED=true` only through a separate reviewed change.

## Release Tags

Ordinary previews, `main` deployments, and operational-state redeployments do
not create tags. Only `formal-release.yml` may create an unsigned annotated
`vX.Y.Z` tag.

The request supplies a full `origin/main` revision and `X.Y.Z`. The validator
requires that revision's `package.json.version` to match, prevents an existing
tag from moving, and allows an explicit retry only when the existing tag peels
to the same revision. The workflow deploys and smoke-checks first, then creates
the tag and publishes the GitHub Release with JSON evidence artifacts.

## Failure And Rollback Boundary

A failed check, manifest comparison, upload, deployment resolution, or smoke
check creates no tag. Keep the activation variable false while investigating
configuration failures. A failed formal release after successful production
smoke may be retried idempotently; it must never move an existing tag.

Rollback selects a prior successful production deployment and reruns the public
smoke check. Preview deployments are not production rollback targets. Do not
change provider resources, credentials, production aliases, or tags as an
unreviewed diagnostic shortcut.
