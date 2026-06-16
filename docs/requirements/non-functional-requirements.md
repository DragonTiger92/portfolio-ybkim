# Non-Functional Requirements

This document defines quality attributes and constraints that apply across the
portfolio site.

## NFR-001: Accessibility

| Field    | Value         |
| -------- | ------------- |
| Category | Accessibility |
| Status   | Draft         |
| Severity | High          |

The site must be accessible by default.

### Verification

- Use semantic HTML for document structure and navigation.
- Preserve visible focus states for interactive elements.
- Provide meaningful text alternatives for non-decorative images.
- Review keyboard navigation for all primary actions.

## NFR-002: Performance

| Field    | Value       |
| -------- | ----------- |
| Category | Performance |
| Status   | Draft       |
| Severity | High        |

The portfolio should remain lightweight and fast as a static site.

### Verification

- Avoid unnecessary runtime dependencies.
- Keep image and asset usage intentional.
- Confirm `pnpm.cmd build` succeeds before release.
- Prefer static content over client-side data fetching for portfolio copy.

## NFR-003: Maintainability

| Field    | Value           |
| -------- | --------------- |
| Category | Maintainability |
| Status   | Draft           |
| Severity | High            |

The project should be easy to inspect, modify, and verify.

### Verification

- Keep TypeScript, DOM rendering, styling, and content data responsibilities
  clear.
- Keep docs and ADRs updated when project structure changes.
- Run the available checks before claiming implementation completion.

## NFR-004: Public Information Safety

| Field    | Value   |
| -------- | ------- |
| Category | Privacy |
| Status   | Draft   |
| Severity | High    |

Public files must not disclose private company material or sensitive personal
information.

### Verification

- Keep private evidence in gitignored `.contexts/`.
- Do not publish recommendation-letter content on the web portfolio.
- Remove private repository paths, internal endpoints, infra identifiers, and
  company-confidential workflow detail from public docs and site copy.

## NFR-005: Static Hosting Compatibility

| Field    | Value      |
| -------- | ---------- |
| Category | Deployment |
| Status   | Draft      |
| Severity | High       |

The site must remain compatible with GitHub Pages project-site hosting.

### Verification

- Keep Vite `base` aligned with `/portfolio-ybkim/`.
- Avoid backend runtime assumptions.
- Keep client-side routing optional or static-hosting safe.
