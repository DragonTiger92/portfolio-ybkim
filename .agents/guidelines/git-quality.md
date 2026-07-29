# Git And Quality Guidelines

## Git And Commits

- Use Conventional Commits style for commit messages.
- If the working directory or staging area contains multiple concerns, separate them into focused commits.
- When one file contains changes for more than one concern, stage only the
  current concern with `git add --patch -- <path>` or an equivalent
  patch-staging interface. Prefer splitting a hunk before editing it manually.
- If a mixed hunk cannot be separated with confidence, leave it unstaged and
  reshape the working-tree change into reviewable hunks. Do not discard,
  overwrite, or temporarily hide user-owned changes merely to make staging
  convenient.
- Before committing a partially staged file, review both sides of the boundary:

```bash
git diff --cached -- <path>
git diff -- <path>
git status --short
```

- Confirm that the staged patch is coherent without the remaining unstaged
  change. Avoid broad staging commands such as `git add .` or `git add -A` when
  the intended commit covers only one concern.
- Remember that ordinary checks run against the complete working tree, including
  unstaged changes. If those changes can affect the result, verify the exact
  staged snapshot separately or report that limitation rather than attributing
  the combined result to the commit alone.
- After the commit, confirm that every intentionally unstaged change remains
  intact.
- For Codex-led work, include the official co-author trailer in the commit message footer:

```txt
Co-authored-by: Codex <noreply@openai.com>
```

- Do not use informal suffixes such as `(agent-led)` in the commit subject to indicate agent authorship.

Do not create commits unless explicitly requested.

## Branch Names

Follow the public workflow in `docs/process/development-workflow.md`.

- Name human-created pull request branches
  `<type>/<ph-NNN|pbi-NNN>-<short-kebab-description>`.
- Use only the documented type prefixes and create from the latest `main` unless
  an explicit exception applies.
- Treat `feature/`, `fix/`, and `content/` as the planned automatic protected
  preview allow-list. Do not select or change a prefix merely to force or bypass
  preview deployment; use the documented manual path when another branch type
  needs remote QA.
- Choose a Phase branch when related PBIs genuinely benefit from one integration
  baseline. Choose a PBI branch when independent review, verification, rollback,
  or delivery is useful; do not create branches merely to mirror chat sessions.
- Treat a branch as a review and integration boundary, not a session boundary.
  Resume the same branch across sessions while its concern remains active, and
  start a new branch when a new concern needs an independent boundary.
- Keep one active branch per worktree. Use separate worktrees for parallel
  branches so dirty changes and verification results cannot cross concerns.
- Do not rename, delete, or replace a local or remote branch without user
  approval.

## Exceptional Branches

- Use stacked branches only when a child change truly depends on an unmerged
  parent. Base the child pull request on the parent, record the parent pull
  request and merge order in the template's `Notes`, integrate bottom-up, and
  retarget or update the child after the parent reaches `main`.

## Pull Request And Branch Lifecycle

- After a human-created pull request is merged, confirm that its head commit is
  an ancestor of `main` before deleting the local topic branch. Confirm the
  remote topic branch was deleted or delete it with owner approval.
- Treat automation pull requests and their generated branches as one lifecycle.
  An open Dependabot pull request normally accounts for one remote branch; the
  branch is not stale merely because it appears in the repository branch list.
- Do not bulk-close automation pull requests based only on their count or a
  failed check. Inspect each update and the first failing gate, then merge,
  repair, defer, ignore, or close it with a reason appropriate to that update.
- When closing an abandoned or superseded pull request manually, leave a concise
  comment that records the reason and the replacement pull request or commit
  when one exists. Confirm its remote branch is removed after close.
- Preserve an unmerged `wip/*` branch until its commits and ownership are
  understood. A temporary name is not sufficient evidence that its work is
  disposable.
- Let `Sync Open PR Branches` update open, same-repository pull request branches
  that target `main`. Do not duplicate that automation with a bulk local merge.
- Before synchronizing a retained human topic branch that has no open pull
  request, confirm ownership and a clean worktree, merge the latest
  `origin/main`, run the branch-appropriate verification, and push without
  rebasing or force-pushing.
- Do not synchronize work that is already merged. Confirm the topic tip is an
  ancestor of `main`, then delete the branch. Exclude Dependabot, `wip/*`,
  fork-owned branches, and dirty detached worktrees from retained-branch bulk
  synchronization.

## Quality Checks

Choose the smallest check that gives meaningful feedback while work is still
in progress. Before claiming final completion for agent-led work, PR prep, or a
change that touches source code, package metadata, configuration, CI, generated
HTML, accessibility behavior, or runtime behavior, run the canonical project
check when possible:

```bash
pnpm.cmd check
```

The check runs type checking, strict linting, strict maintained-file validation,
governance, file-size, and static-budget tests, formatting verification, the
production Astro build, deterministic `dist/` budget validation, strict HTML
checks, W3C Nu validation, and browser accessibility tests in fail-fast order.
After it passes, do not rerun every component command separately.

For a documentation-only iteration that only touches `docs/`, `.agents/`, or
`AGENTS.md`, use the focused docs check for the active feedback loop:

```bash
pnpm.cmd check:docs
```

The docs check runs warning-free Markdown linting, strict documentation
file-size validation, and Prettier verification for public docs and agent
guidance. It does not replace the canonical check for source changes, generated
content, build output, CI changes, package metadata, accessibility, or runtime
behavior.

If the check fails, rerun only the failing stage or use these commands for focused work:

```bash
pnpm.cmd check:docs
pnpm.cmd typecheck
pnpm.cmd lint:strict
pnpm.cmd lint:size:strict
pnpm.cmd test:governance
pnpm.cmd test:file-size
pnpm.cmd test:static-budget
pnpm.cmd format:check
pnpm.cmd build:bundle
pnpm.cmd validate:static-budget
pnpm.cmd validate:html:strict
pnpm.cmd validate:standards:strict
pnpm.cmd test:a11y
```

`pnpm.cmd test:a11y` creates a fresh Astro build before starting Playwright so a
focused browser run cannot silently validate stale `dist/` output. The internal
`test:a11y:run` script assumes a fresh build and is used only after
`check:static` inside the canonical `check` sequence.

Use the standalone `pnpm.cmd build` when the task specifically requires a complete build
that includes its own type check.

For formatting fixes or ordinary local lint feedback, use the relevant focused command:

```bash
pnpm.cmd format
pnpm.cmd lint
pnpm.cmd lint:size
```

If checks fail:

1. Report the failing command.
2. Summarize the error.
3. Fix only relevant issues.
4. Re-run the check when possible.

Do not claim that checks passed unless they were actually run.

## Husky And lint-staged

Husky and lint-staged are active. The current flow is:

```txt
pre-commit -> pnpm exec lint-staged -> staged ESLint fixes -> staged formatting -> staged file-size feedback
```

Keep this hook staged-file-only and fast:

- Keep hooks minimal and fast.
- Prefer running lint and formatting only on staged files.
- Avoid expensive full builds in pre-commit unless explicitly required.
- Ensure the setup works on Windows.
- Ensure commands use `pnpm`.
- Do not add Git hooks that modify unrelated files unexpectedly.
- Document any new script added to `package.json`.

The pre-push hook runs `pnpm check:static`. It intentionally excludes browser
tests to keep local pushes predictable while still blocking type, lint, size,
format, build, HTML, and standards failures. Pull request CI remains the
authoritative full gate and also runs the browser accessibility suite.

Use `pnpm.cmd lint` for ordinary local lint feedback. Use `pnpm.cmd lint:strict` for agent-led completion checks and CI-style verification because it treats warnings as failures.

File-size validation follows the same intent: staged-file and ordinary local runs
report advisory feedback, while `pnpm.cmd lint:size:strict` fails agent-led and
completion checks when a maintained file exceeds its category limit.

The same warning policy applies across static-analysis tools: ordinary human
commands may show advisory warnings, but agent-led completion, pre-push, and CI
commands must treat warnings as failures. Suppressions require a narrow,
documented reason and must not be added merely to make a gate green.

The public event-to-gate source of truth is the Quality Gate Matrix in
`docs/architecture/github-governance.md`.
