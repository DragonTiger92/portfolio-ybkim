# Cloudflare Pages Delivery

This runbook defines the operating boundary for Cloudflare Pages Direct Upload.
It does not authorize credential changes, Terraform plan or apply, deployment,
tag creation, or release publication by itself.

## Delivery Model

Keep the existing Cloudflare Pages project in Direct Upload mode. Do not create
a second Git-integrated Pages project or use a floating Wrangler download.

Preview and production deliberately use different operating paths:

- Preview is an owner-initiated upload from the current GitHub Flow topic branch
  with the pinned repository Wrangler version. Cloudflare Access authenticates
  the owner, and the owner performs browser QA manually.
- Production and formal releases use GitHub Actions to build, validate, upload,
  resolve, and smoke-check one exact-revision artifact.

There is no automatic pull-request preview workflow, GitHub-hosted manual
preview workflow, CI Access service token, or automated preview smoke check.
Preview work does not create tags or GitHub Releases.

The production workflow boundaries are:

- `site-artifact.yml`: check, build, manifest, and upload the exact artifact;
- `pages-upload.yml`: revalidate, upload, resolve, and publicly smoke-check a
  production artifact;
- `pages-production.yml`: automatic `main` delivery and reviewed operational
  redeploys;
- `release-evidence.yml`: SBOM and ScanCode evidence; and
- `formal-release.yml`: explicit version and revision validation, production
  acceptance, annotated tag, and GitHub Release publication.

After exact deployment resolution, the production action runs the read-only
canonical smoke up to four times. It uses exponential backoff of 5, 10, and 20
seconds, for at most 35 seconds of scheduled retry wait. Every attempt checks
the homepage, critical logo, and web manifest again. Build, artifact download,
manifest validation, upload, and exact deployment resolution still run once.

Intermediate retry messages contain only the attempt count and wait duration.
The final failure preserves the checked path and failure category, stops the
delivery, and does not authorize rerunning the failed job or workflow because a
rerun would repeat the upload and other side effects.

## GitHub Configuration Contract

Keep the repository variable `PAGES_DEPLOYMENT_ENABLED` set to `false` until the
production path is ready for a separate owner-reviewed activation.

| GitHub Environment            | Variables                                                                                   | Secrets                                                     |
| ----------------------------- | ------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| `cloudflare-pages-production` | `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_PAGES_PROJECT_NAME`, `CLOUDFLARE_PAGES_PRODUCTION_URL` | `CLOUDFLARE_API_TOKEN`                                      |
| `formal-release`              | None                                                                                        | None; use protection and the workflow-scoped `GITHUB_TOKEN` |

The activation variable gates only credential-bearing GitHub production and
formal-release jobs. Local manual previews remain explicit owner actions.
After the preview CI contract is retired, delete the unused
`cloudflare-pages-preview` Environment through the reviewed teardown sequence.

Never print values while checking configuration. Verify only names, update
timestamps, and protection metadata. Restrict the production upload token to
the selected account and Pages capabilities needed for upload and deployment
lookup.

## Manual Protected Preview

The deployment branch must be the actual active human topic branch. Do not
create a synthetic preview branch, upload `main` as a preview, change the branch
prefix to obtain a deployment, or deploy Dependabot or `wip/*` work.

### Verify The Exact Topic Revision

Run these checks in the owner terminal. They accept no credentials; do not paste
their output into public notes.

```powershell
$codexTaskBranch = git branch --show-current
if ($LASTEXITCODE -ne 0) { throw "Could not resolve the current branch." }
$codexTaskBranch = ([string]$codexTaskBranch).Trim()

$codexTaskBranchPattern = '^(content|feature|fix|docs|ci|infra|security|refactor|chore)/(ph|pbi)-\d{3}-[a-z0-9]+(?:-[a-z0-9]+)*$'
if ($codexTaskBranch -notmatch $codexTaskBranchPattern) {
  throw "Preview requires a valid human topic branch."
}

$codexTaskRevision = git rev-parse HEAD
if ($LASTEXITCODE -ne 0) { throw "Could not resolve the local revision." }
$codexTaskRevision = ([string]$codexTaskRevision).Trim()

git fetch --prune origin
if ($LASTEXITCODE -ne 0) { throw "Could not refresh the remote topic branch." }

$codexTaskWorktreeState = git status --porcelain
if ($LASTEXITCODE -ne 0) { throw "Could not inspect the worktree." }
if ($codexTaskWorktreeState) { throw "Preview requires a clean worktree." }

$codexTaskRemoteRevision = git rev-parse "origin/$codexTaskBranch"
if ($LASTEXITCODE -ne 0) { throw "The pushed topic branch was not found." }
$codexTaskRemoteRevision = ([string]$codexTaskRemoteRevision).Trim()
if ($codexTaskRevision -ne $codexTaskRemoteRevision) {
  throw "Local HEAD must equal the pushed topic-branch revision."
}

pnpm.cmd check
if ($LASTEXITCODE -ne 0) { throw "The canonical project check failed." }
```

The completed check leaves the verified static output in `dist/`. Do not edit
the output between the check and upload.

### Authenticate And Upload

Prefer the owner-held, account-scoped Pages-only API token. The GitHub secret
value cannot be read back; use only the owner's original credential. This block
prompts without placing the token or account ID in command history, limits them
to the current process, restores any prior values, and checks the upload exit
code:

```powershell
$codexTaskHadApiToken = Test-Path Env:CLOUDFLARE_API_TOKEN
$codexTaskPriorApiToken = if ($codexTaskHadApiToken) { $env:CLOUDFLARE_API_TOKEN } else { $null }
$codexTaskHadAccountId = Test-Path Env:CLOUDFLARE_ACCOUNT_ID
$codexTaskPriorAccountId = if ($codexTaskHadAccountId) { $env:CLOUDFLARE_ACCOUNT_ID } else { $null }
$codexTaskSecureToken = Read-Host "Paste the reviewed Pages-only API token" -AsSecureString
$codexTaskTokenPointer = [IntPtr]::Zero

try {
  $codexTaskTokenPointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($codexTaskSecureToken)
  $env:CLOUDFLARE_API_TOKEN = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($codexTaskTokenPointer)
  $env:CLOUDFLARE_ACCOUNT_ID = Read-Host "Enter the reviewed Cloudflare account ID"
  $codexTaskPagesProject = Read-Host "Enter the reviewed Pages project name"

  if ($env:CLOUDFLARE_ACCOUNT_ID -notmatch '^[0-9a-f]{32}$') { throw "Invalid account ID." }
  if ($codexTaskPagesProject -notmatch '^[a-z0-9](?:[a-z0-9-]{0,56}[a-z0-9])?$') {
    throw "Invalid Pages project name."
  }

  pnpm.cmd exec wrangler pages deploy dist `
    --project-name "$codexTaskPagesProject" `
    --branch "$codexTaskBranch" `
    --commit-hash "$codexTaskRevision" `
    --commit-message "Manual preview $codexTaskRevision" `
    --commit-dirty=false
  if ($LASTEXITCODE -ne 0) { throw "Manual preview upload failed." }
} finally {
  if ($codexTaskHadApiToken) { $env:CLOUDFLARE_API_TOKEN = $codexTaskPriorApiToken }
  else { Remove-Item Env:CLOUDFLARE_API_TOKEN -ErrorAction SilentlyContinue }

  if ($codexTaskHadAccountId) { $env:CLOUDFLARE_ACCOUNT_ID = $codexTaskPriorAccountId }
  else { Remove-Item Env:CLOUDFLARE_ACCOUNT_ID -ErrorAction SilentlyContinue }

  if ($codexTaskTokenPointer -ne [IntPtr]::Zero) {
    [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($codexTaskTokenPointer)
  }
  $codexTaskSecureToken.Dispose()
  $codexTaskPriorApiToken = $null
  $codexTaskPriorAccountId = $null
  $codexTaskPagesProject = $null
}
```

Do not store the token in repository files, persistent environment settings,
task logs, or prompts. If the owner no longer holds the Pages-only token, either
create a replacement with the reviewed narrow scope or deliberately accept the
broader OAuth scopes requested by `pnpm.cmd exec wrangler login --use-keyring`.

The explicit non-production branch makes the Direct Upload a preview. Keep the
returned deployment location in owner-controlled notes rather than repository
configuration or agent logs.

### Manual QA

Sign in through the human Cloudflare Access policy and verify at minimum:

1. the deployed revision and branch match the intended topic branch;
2. every generated route loads and navigation remains same-origin;
3. the homepage, project content, resume, and release-critical assets render;
4. light and dark themes plus narrow and wide layouts remain usable;
5. metadata, response headers, downloads, and contact behavior are correct; and
6. the browser console and network panel show no unexplained failures.

Record the branch, full revision, and sanitized QA result in pull-request Notes
when the preview supports a review. Keep the deployment location, authentication
details, and sensitive evidence owner-controlled. Manual preview QA is not a
required GitHub check and does not produce automated smoke evidence.

## Staged Preview CI Teardown

Use separate owner-reviewed provider transitions:

1. merge the workflow and source retirement and confirm no preview run is active;
2. plan and apply removal of the CI policy attachment from the Preview Access
   application, expecting no create, replace, or destroy action and exactly two
   sensitive root output removals whose values must remain unqueried;
3. verify human Access against an existing protected preview; validate the next
   owner-needed topic-branch upload with the manual procedure above;
4. remove the detached CI policy and service-token resource blocks, then review
   a plan containing only those two destroys and no create or replace action;
5. apply only after approval, confirm the remaining Pages project, human policy,
   identity provider, and Preview Access application, then require a no-op plan;
6. delete the unused preview GitHub Environment; revoke its Pages upload token
   unless the owner explicitly retains it outside GitHub as the manual Wrangler
   credential; and
7. remove the temporary `Access: Service Tokens Write` permission from the HCP
   Terraform provider token after service-token deletion succeeds.

Stop at every unexpected provider action. Never expose sensitive Terraform
outputs or use credential mutation as a diagnostic shortcut.

## Release Tags And Failure Boundary

Ordinary previews, `main` deployments, and operational-state redeployments do
not create tags. Only `formal-release.yml` may create an unsigned annotated
`vX.Y.Z` tag after the canonical production smoke check passes.

A failed check, manifest comparison, upload, deployment resolution, or final
production smoke attempt creates no tag. Do not rerun the delivery merely to
repeat its smoke step. Enter the incident and rollback decision path instead;
rollback selects a prior successful production deployment and reruns the public
smoke check, and preview deployments are not production rollback targets.
