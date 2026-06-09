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

## Quality Checks

Before claiming completion, run available checks when possible.

Preferred order:

```bash
pnpm.cmd typecheck
pnpm.cmd lint:strict
pnpm.cmd format:check
pnpm.cmd build
```

If the project later adds formatting, type-checking, or test scripts, also use the relevant commands, for example:

```bash
pnpm.cmd format
pnpm.cmd typecheck
pnpm.cmd test
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
