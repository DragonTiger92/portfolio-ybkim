# Testing Strategy

This static Astro portfolio uses Node.js tests for isolated product logic and
build contracts, and Playwright for browser behavior, accessibility, and visual
comparison. An application API server is not required for an end-to-end test:
the boundary is a visitor's flow through the built site.

## Test Layers And Ownership

| Layer                 | Tool and location                                          | Responsibility                                                                        |
| --------------------- | ---------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Product unit          | `node:test`, `node:assert/strict`, `tests/unit/*.test.mjs` | Availability policy, Gmail URL encoding, project-specific demo requests               |
| Operational unit      | Existing `scripts/*.test.mjs`                              | Governance, delivery, budgets, and validation tools                                   |
| Build integration     | Existing contact-availability tests                        | Generated HTML and contact visibility across availability modes                       |
| Browser / E2E         | Playwright, `tests/*.spec.ts`                              | Navigation, keyboard, themes, clipboard, dialogs, downloads, and responsive behavior  |
| Accessibility         | Playwright and axe-core                                    | Automated checks plus explicit keyboard, focus, structure, and target-size assertions |
| Screenshot regression | Playwright `toHaveScreenshot()`                            | Reviewed pixel changes in a fixed rendering environment                               |

Node.js imports the product TypeScript modules directly. Type stripping does
not typecheck them; the existing Astro typecheck remains mandatory. Keep
product-module imports compatible with both Node.js and Astro. Do not add a
DOM simulator or extract production code solely to imitate browser behavior.

Generated HTML and real-browser assertions cover the current Astro component
contracts. A separate component-test framework is not needed at this scale.
API, database, and load testing become relevant only when those product
boundaries exist. Existing static asset budgets remain the performance gate.

## Behavior Selection

Prefer tests that protect observable policy, failures, or boundary behavior.

- Unit tests cover availability defaults and invalid input, Korean and English
  policy, optional Gmail fields, Unicode and special-character encoding,
  multiline bodies, and demo-request content for each supported project.
- Browser tests cover keyboard navigation and skip links; dialog initial focus,
  focus containment, Escape, and focus restoration; JavaScript-disabled
  content; clipboard rejection, absence, and out-of-order completion; feedback
  timeout and retry; the actual PDF download; and unexpected page errors.
- Use Playwright clock for the three-second feedback timeout instead of waiting
  for wall-clock time. Use locator assertions rather than arbitrary sleeps.
- Inspect all four routes in dark mode with axe-core, and also inspect the
  opened request dialog. Automated accessibility checks complement keyboard
  behavior and human review; they do not replace either.
- A bug fix adds a test that reproduces the observable defect. Avoid copying
  the implementation into assertions, asserting only constants, or storing
  entire generated HTML snapshots.

External Gmail authentication, mail delivery, and external demo applications
are outside ordinary CI. Tests validate the links, local dialog, and request
payload without logging in or sending mail.

## Commands And Gates

Use Node.js `24.18.0`, pnpm `11.10.0`, Playwright `1.63.0`, and
`@axe-core/playwright` `4.13.0`. Existing packages provide all test layers.
Windows PowerShell uses `pnpm.cmd`; CI uses `pnpm`.

| Command                                | Contract                                                       |
| -------------------------------------- | -------------------------------------------------------------- |
| `pnpm.cmd test:unit`                   | Product unit tests without a build or server                   |
| `pnpm.cmd test:unit:coverage`          | Product coverage as a diagnostic report                        |
| `pnpm.cmd test:test-gates`             | Fail-closed Check and artifact approval contracts              |
| `pnpm.cmd test:contact-availability`   | Availability build integration contract                        |
| `pnpm.cmd test:e2e`                    | Fresh build followed by the browser suite                      |
| `pnpm.cmd test:e2e:run`                | Browser suite against an already validated fresh `dist/`       |
| `pnpm.cmd test:a11y` / `test:a11y:run` | Compatibility aliases for the corresponding E2E commands       |
| `pnpm.cmd check`                       | Product unit tests and all existing static/build/browser gates |
| `pnpm test:visual`                     | Pixel comparison in the fixed visual environment               |
| `pnpm test:visual:update`              | Explicit baseline generation in that same environment          |
| `pnpm test:visual:probe`               | Verify an intentional CSS regression produces a pixel diff     |
| `pnpm.cmd preview:test`                | Foreground Astro preview owned and stopped by Playwright       |

Visual commands consume an existing fresh `dist/`; they do not rebuild it.
The runner requires Linux and `PORTFOLIO_VISUAL_IMAGE` matching the pinned image.

The browser configs use Astro's public preview API through `preview:test` so
agent auto-background detection cannot detach the server from Playwright.
Both configs start a fresh server on port 4321 and fail if it is occupied;
they never reuse or terminate an unrelated maintainer-owned server.
The separate `playwright.visual.config.ts` defines the visual projects.

The visual gate is separate from Windows `check`: Edge and platform font
rasterization must not create or approve canonical Linux baselines. General
browser tests continue to use local Windows Edge, CI Chromium, and the existing
WebKit smoke coverage. Mobile projects emulate a viewport and browser; they
are not real-device evidence.

The required CI `Check` must aggregate the ordinary and visual gates. A failed,
canceled, or unexpectedly skipped dependency must not produce a successful
required status. Site Artifact must validate its own generated `dist/` before
handing those same files to delivery. A local passing `check` alone does not
establish that the visual gate passed.
For an isolated CI approval test without deployment, dispatch
`gh workflow run ci.yml --ref <branch> -f verify-site-artifact=true`.
This calls the real Site Artifact workflow with baseline updates disabled.

Coverage has no initial percentage threshold. Review whether meaningful
normal, error, and boundary behavior is protected; use the product coverage
report to find omissions. Node.js built-in coverage is experimental and is not
evidence of product correctness. Keep operational script coverage separate
from the product report.

## Visual Baselines And Review

The initial matrix contains 12 images: each of these three targets is captured
in desktop/mobile and light/dark combinations.

- Full landing page.
- Full Karly detail page.
- Open Karly demo-request dialog.

Use Chromium with desktop `1440 × 900` and mobile `390 × 844`, DPR `1`, locale
`ko-KR`, and timezone `Asia/Seoul`. Use the official
`mcr.microsoft.com/playwright:v1.63.0-noble` image pinned to registry digest
`sha256:eff16c30e6f3f4af0a03fa4b706120d5e9b0891c344a27d64559aff5900a4a27`.
The installed Playwright version, image version, and browser must agree.
Docker installation on the maintainer's Windows computer is not required;
canonical capture runs in CI.

The first 12 baselines cover `actively-looking`. The existing browser suite also
assumes this state; `not-looking` is covered by unit and build integration tests,
but is not yet supported by the full browser/delivery gate. A new availability
state needs reviewed visual evidence rather than masking or rewriting content.

Before capture, fix availability, theme, and initial scroll; wait for images
and `document.fonts.ready`; and verify that the expected CDN font loaded
successfully. A fallback-font screenshot is a failed precondition, not a new
baseline. Disable animations and hide the caret. Do not mask primary content.

Start with `threshold: 0.2` and `maxDiffPixels: 0`. Keep existing geometric and
CSS assertions: they explain layout intent, while pixel comparisons detect
changes across the rendered surface. Do not raise the tolerance to conceal a
failure.

Baseline updates are deliberate review operations:

1. Dispatch `.github/workflows/visual-tests.yml` for the intended source
   revision with `update-baselines: true`. It builds the site, runs in the same
   pinned container, returns an artifact, and never commits files.
   Before the new workflow is registered on the default branch, use the existing
   CI workflow entry point with the intended branch:
   `gh workflow run ci.yml --ref <branch> -f update-baselines=true`.
   This explicit manual run reuses the checked build artifact for capture;
   ordinary pull requests and pushes never update baselines. A manual update
   run reports `Baseline Candidates` instead of the required `Check`, so its
   success cannot approve uncommitted PNGs or satisfy the pull request gate.
2. Review expected/actual/diff images and record why each intended change is
   acceptable. Review newly added baselines as rendered images as well.
3. Copy only the accepted baseline PNGs into the repository. Commit them with
   their source change only through the normal approved Git workflow.
4. Compare against the accepted baselines twice in the fixed environment.
   Confirm that a temporary CSS change fails comparison and creates a diff,
   then remove the temporary change and verify success.

Repeat visual review when Playwright, the image digest, browser, or fonts
change. Never update baselines automatically after a failing test.
Diagnostics include expected/actual/diff images, traces, and HTML reports; CI
retains them for 14 days. Only reviewed baseline PNGs belong in Git.

## Reliability And Adoption Evidence

Initial adoption status: canonical baseline PNGs and fixed-container validation
are pending. Use the manual workflow to produce reviewable PNGs before claiming
that screenshot comparison is operational.

CI allows at most one retry. A test that passes only on retry is still flaky:
track its name, failing revision, diagnostic artifact, and resolution. Do not
increase retries, add arbitrary sleeps, or suppress assertions to make a gate
green. Resolve timing through browser-observable readiness and deterministic
inputs.

The screenshot gate is not fully adopted until all 12 canonical PNGs exist,
two consecutive comparisons pass in the pinned container, the CSS-change
probe produces a failure and diff, and CI failure demonstrably blocks both the
required `Check` and delivery of Site Artifact. Until that evidence exists,
report visual testing as pending validation and keep public portfolio claims
about pixel comparison unchanged.

Visual and approval tooling comes from the calling workflow revision; candidate
`dist/` is downloaded and checked against its requested-revision manifest.
Historical revisions that do not match the reviewed baselines cannot pass this
new gate automatically. Use the existing owner-approved native rollback path
for known-good deployments; restoring a historical source through a fresh build
requires matching reviewed test evidence.

Related documents: [Development Workflow](development-workflow.md),
[GitHub Governance](../architecture/github-governance.md), and
[Pages Delivery](../operations/pages-delivery.md).
