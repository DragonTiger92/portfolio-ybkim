# Engineering Guidelines

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

## Practical Design Heuristics

Use these heuristics to keep changes small, understandable, and aligned with the project:

- YAGNI: do not build speculative features, extension points, configuration layers, or generic abstractions before there is a concrete need.
- KISS: prefer the simplest design that fully satisfies the current requirement.
- SRP: keep each module, function, and component focused on one clear responsibility.
- SoC: keep UI rendering, state changes, validation, data transformation, configuration, and side effects separated when it improves readability.
- DRY with judgment: remove meaningful duplication, but do not abstract code that only looks similar while serving different reasons to change.
- High cohesion, low coupling: keep related logic close together and avoid unnecessary cross-module knowledge.
- Explicit over implicit: prefer visible data flow, named helpers, and clear inputs/outputs over hidden mutation or ambient assumptions.
- Fail fast: validate required assumptions near the boundary and return early when work cannot proceed.
- Least power: use the narrowest tool, API, type, or abstraction that solves the problem.
- Locality: prefer changes near the relevant feature unless shared behavior genuinely needs a shared home.

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

## Cohesion And Coupling

Prefer high cohesion and low coupling at the feature, module, and function levels.

High cohesion means that code kept together serves one capability or one reason to
change. Low coupling means that a module can change without requiring unrelated
modules to know or change its internal details.

When organizing or refactoring code:

- Keep feature-specific rendering, state, validation, data transformation, and
  types close to that feature until another real consumer needs them.
- Give each module a clear responsibility and avoid generic dumping grounds such
  as broad `utils`, `helpers`, or `common` modules with unrelated exports.
- Expose narrow, explicit contracts. Pass the data a dependency needs instead of
  exposing DOM structure, mutable internals, or an entire state object.
- Keep dependency direction understandable. Avoid circular imports, hidden global
  state, cross-module mutation, and modules that reach through another module's
  abstraction boundary.
- Extract shared code only when consumers share the same behavior and reason to
  change, not merely similar syntax.
- Do not add dependency injection, registries, event buses, or indirection solely
  to reduce the appearance of coupling. Use the simplest explicit dependency that
  supports the current design.

Before extracting a module, ask:

1. Does the extracted code have a distinct reason to change?
2. Can its responsibility and contract be named precisely?
3. Does the extraction reduce knowledge between callers and implementation?
4. Will related changes remain local, or will one feature now require edits across
   more files?

If extraction only moves lines while increasing navigation or shared knowledge,
keep the code together and choose a better boundary.

## File Size And Refactoring Trigger

File-size limits are review triggers for responsibility and readability, not a
substitute for design judgment. The enforced limits are:

| File category                              | Content-line limit |
| ------------------------------------------ | -----------------: |
| JavaScript and TypeScript                  |                250 |
| CSS                                        |                300 |
| HTML, JSON, JSONC, YAML, and Terraform     |                250 |
| Narrative Markdown                         |                250 |
| Requirements and selected planning ledgers |                350 |
| Agent guideline Markdown                   |                200 |

ESLint counts JavaScript and TypeScript after skipping blank and comment-only
lines. `pnpm.cmd lint:size` counts non-empty lines for the other maintained text
files. Generated artifacts, dependency directories, private `.contexts/` source,
and temporary `tmp/` material are excluded.

When a file reaches or exceeds its limit before requested content is added:

1. Read the whole file and inspect its imports, callers, tests, and related docs.
2. Identify responsibilities and reasons to change that are already mixed.
3. Choose a boundary that increases cohesion and reduces knowledge between
   modules.
4. Refactor first, preserving public behavior and explicit data flow.
5. Add the requested content to the module that owns that responsibility.
6. Run the focused checks and then `pnpm.cmd check` when feasible.

Do not split by arbitrary line ranges, create numbered `part1` or `part2` files,
move unrelated exports into a generic utility module, or introduce barrel files
only to hide a growing dependency surface. A narrowly scoped exception is
acceptable only when the file is a cohesive registry or generated artifact and
the reason is documented beside the policy.

## Control Flow and Block Depth

The project intends to enforce strict block-depth quality rules through ESLint, Husky, and lint-staged.

Current policy:

- Prefer block depth `1`.
- Warn at block depth `2`, so a human can still commit intentionally when the tradeoff is justified.
- Error at block depth `3` and deeper.
- Agent-led work must run strict lint with `--max-warnings 0`, so warnings are fixed before completion.
- Pre-commit quality checks through Git hooks

Write code to avoid deep nesting from the beginning.

Prefer early returns:

```ts
function getLabel(value: string | null) {
  if (!value) {
    return "Unknown";
  }

  return value.trim();
}
```

When branching grows:

- Use early return.
- Extract guard clauses.
- Extract small helper functions.
- Split complex UI branches into smaller functions or modules.
- Keep validation, data transformation, state updates, and UI rendering in separate focused steps when it improves readability.
- Avoid nested ternaries.
- Avoid deeply nested `if`, `for`, `while`, `switch`, and callback structures.

## Constants

Do not declare capital-letter constants inside functions.

Prefer module-scope constants:

```ts
const maxItemCount = 5;

function Example() {
  return null;
}
```

For values reused across files, use a dedicated constants file when appropriate.

Use naming consistent with the existing codebase. If the project already uses uppercase constants at module scope, follow that convention only at module scope.

## TypeScript

Follow TypeScript best practices:

- Prefer precise types over broad types.
- Avoid unnecessary type assertions.
- Avoid suppressing TypeScript errors without explanation.
- Do not use `// @ts-ignore` unless explicitly justified.
- Prefer `unknown` over `any` when handling uncertain external values.
- Keep shared types stable and understandable.
- Do not create overly generic types unless the codebase genuinely benefits from them.
