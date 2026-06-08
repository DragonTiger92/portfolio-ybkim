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

## Control Flow and Block Depth

The project intends to enforce strict block-depth quality rules through ESLint, Husky, and lint-staged.

Expected direction:

- Warning level around block depth `1`
- Error level around block depth `2`
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
