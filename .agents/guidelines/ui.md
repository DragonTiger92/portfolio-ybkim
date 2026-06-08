# UI Guidelines

## UI Structure

When creating or editing UI code:

- Prefer small focused functions and modules.
- Keep DOM queries typed and guarded.
- Avoid large modules with multiple unrelated responsibilities.
- Keep conditional rendering readable.
- Avoid excessive inline logic inside template strings.
- Extract complex derived values before `return`.
- Keep styling clear, accessible, responsive, and appropriate for a portfolio site.

If UI code becomes hard to read because of branching, split it into smaller modules or extract helper functions.

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
