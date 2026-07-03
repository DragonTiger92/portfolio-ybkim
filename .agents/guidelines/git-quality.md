# Git And Quality Guidelines

## Git And Commits

- Use Conventional Commits style for commit messages.
- If the working directory or staging area contains multiple concerns, separate them into focused commits.
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
- Do not rename, delete, or replace a local or remote branch without user
  approval.

## Quality Checks

Choose the smallest check that gives meaningful feedback while work is still
in progress. Before claiming final completion for agent-led work, PR prep, or a
change that touches source code, package metadata, configuration, CI, generated
HTML, accessibility behavior, or runtime behavior, run the canonical project
check when possible:

```bash
pnpm.cmd check
```

The check runs type checking, strict linting, strict file-size validation,
governance and file-size tests, formatting verification, the production Astro
build, strict HTML checks, W3C Nu validation, and browser accessibility tests in
fail-fast order. After it passes, do not rerun every component command separately.

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
pnpm.cmd format:check
pnpm.cmd build:bundle
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
