# AGENTS.md

## Project Overview

This repository contains `portfolio-ybkim`, a personal portfolio website.

The project currently uses the following stack:

- Vite
- Vanilla TypeScript
- HTML
- Pure CSS
- TypeScript
- pnpm
- Git
- GitHub

Do not introduce React or another UI framework unless explicitly requested.

The portfolio should prioritize maintainability, readability, accessibility, responsive layout, and clear presentation of the developer's work.

## Working Principles

Before making changes:

1. Inspect the existing file structure.
2. Read relevant files before editing.
3. Understand the requested change and its impact.
4. Keep the change scope as small as possible.
5. Do not rewrite unrelated code.
6. Do not perform broad refactoring unless explicitly requested.
7. Prefer simple, clear solutions over clever abstractions.
8. Explain assumptions when the codebase does not provide enough information.

## Package Manager

Use `pnpm` only.

Do not use:

- `npm install`
- `yarn`
- `bun install`

Unless explicitly requested, do not modify the lockfile manually.

Preferred commands:

```bash
pnpm install
pnpm dev
pnpm build
pnpm lint
```

If a command does not exist in `package.json`, report that clearly instead of inventing an alternative.

## Code Style

Write code that is easy to read, review, and maintain.

Follow these rules:

- Prefer TypeScript-safe code.
- Avoid `any` unless there is a clear reason.
- Prefer explicit types for exported functions, shared utilities, and public interfaces.
- Keep functions small and focused.
- Avoid deeply nested control flow.
- Prefer early returns over nested `if` blocks.
- Avoid unnecessary abstraction.
- Avoid hidden side effects.
- Keep naming descriptive and consistent with the existing codebase.
- Do not introduce a new dependency unless there is a strong reason.

## Separation of Concerns

Keep responsibilities separated by purpose.

For UI code:

- UI rendering should stay in clear DOM-rendering modules or small focused functions.
- Reusable logic should be extracted into utilities when it meaningfully improves clarity.
- Constants should be placed at module scope or in a dedicated constants file when reused.
- Types should be colocated with the feature when local, or moved to shared type files when reused.
- API-related code should not be mixed directly into UI rendering code unless the existing project structure clearly does so.

Do not over-separate files only for theoretical purity. Extract only when it improves readability, reuse, testability, or maintainability.

## UI Structure Guidelines

When creating or editing UI code:

- Prefer small focused functions and modules.
- Keep DOM queries typed and guarded.
- Avoid large modules with multiple unrelated responsibilities.
- Keep conditional rendering readable.
- Avoid excessive inline logic inside template strings.
- Extract complex derived values before `return`.
- Keep styling clear, accessible, responsive, and appropriate for a portfolio site.

If UI code becomes hard to read because of branching, split it into smaller modules or extract helper functions.

## Control Flow and Block Depth

The project intends to enforce strict block-depth quality rules through ESLint, Husky, and lint-staged.

Expected direction:

- Warning level around block depth `1`
- Error level around block depth `2`
- Pre-commit quality checks through Git hooks

Therefore, code should be written to avoid deep nesting from the beginning.

Prefer this style:

```ts
function getLabel(value: string | null) {
  if (!value) {
    return "Unknown";
  }

  return value.trim();
}
```

Avoid this style:

```ts
function getLabel(value: string | null) {
  if (value) {
    if (value.trim()) {
      return value.trim();
    }
  }

  return "Unknown";
}
```

When branching grows:

- Use early return.
- Extract guard clauses.
- Extract small helper functions.
- Split complex UI branches into smaller functions or modules.
- Avoid nested ternaries.
- Avoid deeply nested `if`, `for`, `while`, `switch`, and callback structures.

## Constants

Do not declare capital-letter constants inside functions.

Avoid this:

```ts
function Example() {
  const MAX_ITEM_COUNT = 5;

  return null;
}
```

Prefer this:

```ts
const maxItemCount = 5;

function Example() {
  return null;
}
```

For values reused across files, use a dedicated constants file when appropriate.

Use naming consistent with the existing codebase. If the project already uses uppercase constants at module scope, follow that convention only at module scope.

## TypeScript Guidelines

Follow TypeScript best practices:

- Prefer precise types over broad types.
- Avoid unnecessary type assertions.
- Avoid suppressing TypeScript errors without explanation.
- Do not use `// @ts-ignore` unless explicitly justified.
- Prefer `unknown` over `any` when handling uncertain external values.
- Keep shared types stable and understandable.
- Do not create overly generic types unless the codebase genuinely benefits from them.

## Accessibility

The portfolio should be accessible by default.

When editing UI:

- Use semantic HTML where possible.
- Use buttons for actions and links for navigation.
- Provide meaningful `alt` text for images.
- Ensure interactive elements are keyboard accessible.
- Avoid removing focus styles without replacing them.
- Preserve readable text contrast.

## Styling

The current stylesheet is mostly Vite scaffold styling, so do not treat it as a mature design system or a source of visual direction.

Do not introduce a new styling approach unless explicitly requested.

The current project uses global CSS in `src/style.css`, CSS custom properties, and responsive media queries. Continue with this general approach unless the requested change clearly requires something else.

When styling:

- Keep class names or style utilities readable.
- Avoid duplicated styling logic.
- Prefer reusable patterns after they are intentionally established.
- Do not introduce global CSS changes without checking their impact.
- Maintain responsive behavior.

## Git and Commit Guidelines

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
pnpm typecheck
pnpm lint
pnpm format:check
pnpm build
```

If the project later adds formatting, type-checking, or test scripts, also use the relevant commands, for example:

```bash
pnpm format
pnpm typecheck
pnpm test
```

If checks fail:

1. Report the failing command.
2. Summarize the error.
3. Fix only relevant issues.
4. Re-run the check when possible.

Do not claim that checks passed unless they were actually run.

## Husky and lint-staged

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

Do not implement Husky or lint-staged unless explicitly requested.

## File Editing Rules

When editing files:

- Preserve existing formatting where reasonable.
- Do not reorder imports unnecessarily.
- Do not rename files without a clear reason.
- Do not move files unless the requested task requires it.
- Do not delete code unless it is clearly unused or explicitly requested.
- Do not modify generated files unless necessary.
- Do not modify environment files or secrets.
- Do not introduce placeholder code into production paths.

## Dependency Rules

Before adding a dependency:

1. Check whether the task can be solved with existing tools.
2. Prefer platform or framework-native solutions.
3. Explain why the dependency is needed.
4. Confirm that it fits the project size and purpose.

Do not add dependencies for trivial utilities.

## Environment and Secrets

Do not commit secrets.

Do not expose:

- API keys
- access tokens
- private credentials
- `.env` values
- deployment secrets

If environment variables are needed, use example names and document them without real values.

## Deployment Awareness

This project is expected to be deployed as a static frontend site through GitHub Pages project-site hosting at a URL like `https://username.github.io/portfolio-ybkim/`.

Do not assume a custom domain or a GitHub Pages user/organization root site unless explicitly requested.

When changing build or routing behavior:

- Check Vite configuration.
- Keep Vite `base` aligned with the GitHub Pages repository path.
- Do not assume server-side runtime support.
- Avoid features that require a backend unless explicitly planned.
- Keep static deployment compatibility in mind.

## Response Style for Codex

When reporting work:

- Summarize what changed.
- List files changed.
- Mention checks run.
- Mention checks not run and why.
- Mention assumptions clearly.
- Keep explanations concise but complete.

Preferred completion format:

```txt
Changed:
- ...

Checked:
- ...

Notes:
- ...
```

## Out of Scope Unless Requested

Do not perform the following unless explicitly requested:

- Large-scale refactoring
- Full design system redesign
- Dependency migration
- Package manager migration
- Framework migration
- Deployment workflow changes
- GitHub Actions setup
- Husky/lint-staged setup
- ESLint rule changes
- Prettier setup changes
- Branch protection changes
- Commit creation
- Remote repository changes

## Priority

When instructions conflict, follow this priority:

1. User's explicit request
2. Existing codebase conventions
3. This `AGENTS.md`
4. General best practices

If the correct action is unclear, stop and ask for clarification before making broad changes.
