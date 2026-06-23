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

Before claiming completion, run the canonical project check when possible:

```bash
pnpm.cmd check
```

The check runs type checking, strict linting, governance tests, formatting verification,
and the production Vite bundle in fail-fast order. After it passes, do not rerun every
component command separately.

If the check fails, rerun only the failing stage or use these commands for focused work:

```bash
pnpm.cmd typecheck
pnpm.cmd lint:strict
pnpm.cmd test:governance
pnpm.cmd format:check
pnpm.cmd build:bundle
```

Use the standalone `pnpm.cmd build` when the task specifically requires a complete build
that includes its own type check.

For formatting fixes or ordinary local lint feedback, use the relevant focused command:

```bash
pnpm.cmd format
pnpm.cmd lint
```

If checks fail:

1. Report the failing command.
2. Summarize the error.
3. Fix only relevant issues.
4. Re-run the check when possible.

Do not claim that checks passed unless they were actually run.

## Husky And lint-staged

The project may later use Husky and lint-staged to enforce pre-commit quality checks.

When adding or modifying this setup:

- Keep hooks minimal and fast.
- Prefer running lint and formatting only on staged files.
- Avoid expensive full builds in pre-commit unless explicitly required.
- Ensure the setup works on Windows.
- Ensure commands use `pnpm`.
- Do not add Git hooks that modify unrelated files unexpectedly.
- Document any new script added to `package.json`.

Suggested direction:

```txt
pre-commit -> lint-staged -> ESLint / formatter on staged files
```

Use `pnpm.cmd lint` for ordinary local lint feedback. Use `pnpm.cmd lint:strict` for agent-led completion checks and CI-style verification because it treats warnings as failures.

Do not implement Husky or lint-staged unless explicitly requested.
