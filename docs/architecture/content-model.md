# Content Model

The portfolio content should be structured around evidence, not around a long
tool list.

## Core Content Types

| Type              | Purpose                                           |
| ----------------- | ------------------------------------------------- |
| Profile Summary   | Introduce the developer positioning in one screen |
| Skill Group       | Connect capabilities to delivery responsibility   |
| Case Study        | Show a project problem, role, action, and result  |
| Project Detail    | Give each case study a stable first-depth route   |
| Project Link      | Send visitors to public repositories or demos     |
| Contact Action    | Provide a safe next step for recruiters           |
| Documentation Cue | Show that the repository is intentionally managed |

## Page Model

- `/` is the landing page and the only top-level discovery surface.
- `/projects/{slug}/` is the first-depth project-detail route.
- Project metadata is validated by the Astro content collection schema.
- A reusable project card links landing-page summaries to project details.
- Each project detail owns its title, summary, role, focus, stack, order, links,
  and Markdown narrative.
- Route and section-level sitemap decisions are tracked in
  [Information Architecture](information-architecture.md).
- Candidate project, surface, and link decisions are tracked in
  [Project Content Inventory](../content/project-content-inventory.md) before
  implementation copy or wireframes are finalized.
- Implementation-ready project, link, contact, skill, and disclosure source data
  is tracked in [Portfolio Content Source](../content/portfolio-content-source.md).

## Skill Groups

- Frontend implementation: UI structure, TypeScript, CSS, accessibility.
- Product delivery: planning, scope control, documentation, review.
- Integration literacy: API concepts, data flow, and typed boundaries.
- Deployment literacy: static hosting, build artifacts, and release checks.
- Maintenance mindset: readable structure, documentation, and verification.

## Public Claim Rule

Every strong claim should be backed by one of these public-safe forms:

- A public repository artifact.
- A public project summary.
- A public document in this repository.
- A public product URL approved by the owner.
- A resume or recommendation artifact shared directly during applications, not
  published on the portfolio site.

Applicant-only or private evidence can support private preparation, but it must
not become public content without a fresh disclosure review.
