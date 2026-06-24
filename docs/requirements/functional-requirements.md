# Functional Requirements

This document is the source of truth for user-facing behavior. Requirement
implementation and verification are tracked through the
[Requirements Traceability Matrix](../planning/requirements-traceability-matrix.md).

## Schema

| Field    | Meaning                                                    |
| -------- | ---------------------------------------------------------- |
| Status   | Draft, Approved, Implemented, Verified, or Retired         |
| Priority | Relative product importance                                |
| Source   | Stakeholder or upstream document that established the need |

## FR-001: Intro Section

| Field    | Value                                         |
| -------- | --------------------------------------------- |
| Status   | Draft                                         |
| Priority | P1                                            |
| Source   | [Project Brief](../planning/project-brief.md) |

The site must provide a first-viewport intro section that clearly presents YB
Kim as a frontend-specialized full-stack web developer.

### FR-001 Acceptance Criteria

- The headline or primary copy communicates frontend strength and full-stack
  delivery breadth.
- Current job-seeking status is easy to understand without scrolling deeply.
- The first viewport includes a clear next action such as project review,
  resume/contact access, or repository inspection.

## FR-002: Project Showcase

| Field    | Value                                             |
| -------- | ------------------------------------------------- |
| Status   | Draft                                             |
| Priority | P1                                                |
| Source   | [Content Model](../architecture/content-model.md) |

The site must provide a scannable project showcase section.

### FR-002 Acceptance Criteria

- Each project item includes a title, short summary, role or focus, and relevant
  stack or capability tags.
- Each landing-page project item links to a first-depth project-detail page.
- A project detail links to a public repository or demo when one is available
  and does not invent a public destination when one is unavailable.
- Project summaries are concise enough for recruiter review.

## FR-003: Repository And Contact Navigation

| Field    | Value                                         |
| -------- | --------------------------------------------- |
| Status   | Draft                                         |
| Priority | P1                                            |
| Source   | [Project Brief](../planning/project-brief.md) |

Visitors must be able to access the public GitHub repository and contact paths.

### FR-003 Acceptance Criteria

- Repository access is visible from persistent or repeated navigation.
- Contact actions use the contact channels selected for the public portfolio.
- Labels make the destination and purpose clear.

## FR-004: Skills Section

| Field    | Value                                             |
| -------- | ------------------------------------------------- |
| Status   | Draft                                             |
| Priority | P1                                                |
| Source   | [Content Model](../architecture/content-model.md) |

The site must provide a skills section that explains the developer's delivery
capabilities.

### FR-004 Acceptance Criteria

- Skills are grouped by delivery responsibility, not only by tool name.
- Skill groups align with the portfolio content model.
- The section stays short enough to scan from a recruiter or engineering-review
  context.

## FR-005: Adaptive Color Theme

| Field    | Value         |
| -------- | ------------- |
| Status   | Draft         |
| Priority | P1            |
| Source   | Project Owner |

Visitors must be able to use the portfolio in a light or dark color theme.

### FR-005 Acceptance Criteria

- The initial theme follows the visitor's system preference when no explicit
  choice has been saved.
- A visible control lets the visitor switch between light and dark themes.
- The explicit choice persists in the same browser.

## FR-006: Responsive Mobile Experience

| Field    | Value         |
| -------- | ------------- |
| Status   | Draft         |
| Priority | P1            |
| Source   | Project Owner |

Visitors must be able to review the core portfolio content and use its primary
actions from mobile through desktop viewports.

### FR-006 Acceptance Criteria

- Navigation, project content, contact actions, and theme controls remain usable
  on mobile and desktop layouts.
- Content order preserves the intended recruiter review path at each layout.
- Responsive changes do not hide required information or primary actions.

## FR-007: Portfolio Rights Notice

| Field    | Value                                                              |
| -------- | ------------------------------------------------------------------ |
| Status   | Draft                                                              |
| Priority | P1                                                                 |
| Source   | [ADR-0005](../adr/0005-scope-code-license-and-portfolio-rights.md) |

The product must communicate that portfolio content, documentation, personal
text, images, and other non-code assets are All Rights Reserved unless otherwise
stated.

### FR-007 Acceptance Criteria

- A footer or equivalent legal surface communicates the portfolio-material
  rights boundary and links to the repository notice when appropriate.
- Assets with different terms display the required attribution or license near
  the asset or in a linked attribution surface.
- The notice does not imply that the MIT License covers protected portfolio
  materials.
