# UI Guidelines

## Design Reference

When creating or editing visible UI, use root `DESIGN.md` together with this
file. `DESIGN.md` defines the product design intent and small token vocabulary;
this file defines operational implementation rules for HTML, CSS,
responsiveness, and accessibility.

Do not treat `DESIGN.md` as a mandate to build a broad design system. Use it to
keep new UI coherent with the portfolio's existing visual axes.

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

- Prefer native HTML semantics. Add ARIA only when native elements cannot express
  the required role, name, state, or relationship.
- Use buttons for actions and links for navigation.
- Provide meaningful `alt` text for images.
- Ensure interactive elements are keyboard accessible.
- Avoid removing focus styles without replacing them.
- Preserve readable text contrast.
- Give each generated page exactly one visible `main` landmark and one page-level
  `h1`.
- Use `section` and `article` only for independently meaningful content, and give
  each one an accessible heading. Do not add an artificial hidden heading to
  `main`; `main` is a landmark, not sectioning content that requires a heading.
- Keep heading levels logical. The landing-page `h1` is "개발자 김용범의
  포트폴리오"; a project-detail page uses its project title as `h1`.
- Prefer concise noun phrases for headings when they still describe the content
  accurately and read naturally in a heading outline.
- Use native `header`, `nav`, `main`, `article`, `section`, `aside`, and `footer`
  landmarks according to their content model instead of using generic containers
  with redundant roles.
- Keep pointer targets at least 44 by 44 CSS pixels unless an equivalent target
  for the same action is available nearby or another documented WCAG exception
  applies.

Automated accessibility and standards checks are a safety net, not proof of full
conformance. Preserve manual review for keyboard order, content meaning, zoom,
reflow, contrast, and assistive-technology behavior.

## Styling

The project uses layered pure CSS and CSS custom properties. Treat the shared
tokens as a small product vocabulary, not as a promise to build a general-purpose
design system. Add a token or reusable pattern only when it represents an actual
shared decision.

When styling:

- Keep every visible state coherent: spacing, radius, shadow, color, typography,
  and control sizing should look like one committed product decision.
- Prefer existing token families for color, typography, spacing, radius,
  elevation, interaction, and layout before introducing a new local value.
- Add a new token or visual family only when it represents a product-wide
  decision; otherwise keep the exception narrow and explain it near the change.
- Keep class names or style utilities readable.
- Avoid duplicated styling logic.
- Prefer reusable patterns after they are intentionally established.
- Do not introduce global CSS changes without checking their impact.
- Maintain responsive behavior.
- Prefer logical properties and values such as `margin-inline`, `padding-block`,
  and `inset-inline-start` so layout remains writing-mode resilient.
- Treat desktop recruiter review as the primary product presentation while
  preserving the same content and actions at narrow and intermediate widths.
- Use mobile-first responsive CSS: write the narrow-width baseline first, then
  add content-driven `min-width` breakpoints as the composition gains room. The
  term describes CSS composition order, not a product priority above desktop.
- Do not copy device breakpoint catalogs.
- Test both narrow and wide viewports. Avoid horizontal scrolling, preserve
  readable line lengths, and let grids collapse according to available space.
