# Phase 2 Wireframe Brief

This document defines the low-fidelity screen composition brief for the initial
static portfolio implementation. It is not a Figma file, image mockup, or
high-fidelity visual draft. Use it with the root [Design Harness](../../DESIGN.md)
and the public content sources when implementing `PH-002`.

## Source Inputs

- [Landing Page Copy](../content/landing-page-copy.md) owns exact intro
  and public project showcase copy seeds.
- [Portfolio Content Source](../content/portfolio-content-source.md) owns
  project, link, contact, skill, resume, and disclosure boundaries.
- [Project Content Inventory](../content/project-content-inventory.md) owns
  project classification, public treatment, and surface readiness.
- `DESIGN.md` remains the visual language guide; this brief only fixes layout,
  hierarchy, and content placement.

## Artifact Boundary

- Produce Markdown implementation guidance only.
- Do not create Figma, screenshots, image mockups, or high-fidelity visual
  drafts for `PH-001`.
- Keep responsive behavior as composition guidance, not pixel-perfect device
  breakpoints.
- Do not expose private professional source, internal names, private URLs,
  credentials, endpoints, screenshots, or confidential architecture.

## Landing Page Section Order

1. Intro / first viewport.
2. Public project showcase.
3. Professional highlights.
4. Skills and delivery capabilities.
5. Process and delivery review path.
6. Contact and footer.

## First Viewport Layout

```txt
┌──────────────────────────────────────────────────────┐
│ status tag                                           │
│ Web Developer · Frontend-focused delivery             │
│                                                      │
│ H1: 사용자 이해 + 유지보수 가능한 웹 제품             │
│ Lead: frontend-centered delivery, data flow, docs, QA │
│                                                      │
│ [Gmail에서 메일 쓰기] [이메일 주소 복사]              │
│ [GitHub 보기] [이력서 PDF]                            │
└──────────────────────────────────────────────────────┘
```

- Primary CTA: `Gmail에서 메일 쓰기` in a new browser context with the public
  portfolio email pre-addressed.
- Contact fallback: keep the email address visible and copyable through
  `이메일 주소 복사`, with clear interaction feedback.
- Secondary CTA: `GitHub 보기` in a new browser context, targeting the owner's
  GitHub profile.
- Tertiary CTA: `이력서 PDF`.
- Keep the `portfolio-ybkim` source repository within that project's card and
  detail evidence. Do not repeat it as a broad first-viewport, standalone
  repository-section, or footer action.
- Do not add a separate contact route or resume route for the first
  implementation.

Pair the intro with one compact, portfolio-wide review guide:

- eyebrow: `포트폴리오 검토 안내`;
- title: `공개 근거와 경험 요약`;
- `공개 프로젝트`: the three projects whose source or result can be
  inspected;
- `실무 경험`: the three disclosure-safe professional summaries;
- `검토 순서`: `프로젝트 → 실무 경험 → 역량 → 작업 방식`.

Use a named complementary `aside` with a definition list so each label and
value remains explicit. Derive counts from the rendered data. Do not mix a
portfolio-wide label with project-specific implementation details such as the
`portfolio-ybkim` technology stack.

## Project Showcase Structure

Render three public-source project cards in this order:

1. `portfolio-ybkim`.
2. `Karly`.
3. `Book-Kong`.

Frame the section with `공개 프로젝트` / `프로젝트` and explain that the
three cards expose source or deployment results, owner role, implementation
scope, and public evidence.

Each card should include:

- project title;
- short summary from [Landing Page Copy](../content/landing-page-copy.md);
- compact tags or capability cues;
- detail-page link;
- public repository and demo links where available and rechecked.

Project cards should make the source-review path obvious without forcing every
card into the same link set. `portfolio-ybkim` should emphasize repository,
docs, ADRs, backlog, and checks. `Karly` and `Book-Kong` should emphasize public
repository and deployed demo links.

## Professional Highlights Placement

Place professional highlights after the public project showcase. This gives the
portfolio room to show core professional work while keeping source-code case
studies limited to inspectable public projects.

Use three generalized highlight cards:

1. Academy information and consultation web service.
2. Science-question concept and solution-logic structuring tool.
3. Internal science education content production and review platform.

The academy highlight may link its public product URL. The other two
professional highlights should not expose private URLs, source, routes,
screenshots, workflows, or internal names.

Frame this section with `공개 범위로 요약` / `실무 경험`. Explain that
private material and internal details are excluded, and give every highlight
the visible `실무 경험 · 공개 범위 요약` scope cue so it is not mistaken for
an inspectable public-source case study.

## Skills, Process, Contact, Footer Flow

- Skills: use responsibility-centered groups from Portfolio Content Source,
  not a proficiency-ranked tool list.
- Process: show planning, implementation, verification, documentation, and
  handoff as delivery habits.
- Contact: keep Gmail web compose primary, provide a visible and copyable email
  fallback, use the GitHub profile as the secondary broad action, and keep the
  resume download available.
- Footer: include the GitHub profile, email, resume, and rights notice. Add the
  production URL only after the Phase 3 decision exists.

## Project Detail Template

Each public-source detail page should follow this content order:

1. Project title, classification, and concise summary.
2. Problem or product context.
3. Owner role and contribution boundary.
4. Implementation approach.
5. Outcome or reviewable result.
6. Public evidence links.
7. Stack or tool notes as supporting proof.
8. Previous/next navigation back to the project showcase.

Professional highlights do not need detail routes in the first implementation.
If a later scope adds one, reopen disclosure review before creating the route.

## Responsive Composition Notes

- Narrow widths: stack intro copy, actions, cards, and detail sections in the
  same hierarchy; keep primary CTA before secondary actions.
- Intermediate widths: allow project cards to form a two-column layout only when
  summaries remain readable.
- Wide widths: keep the first viewport visually calm, with CTA grouping and line
  length constrained for desktop recruiter review.
- At every width, avoid horizontal overflow and preserve the same content and
  action hierarchy.

## Copy Source And Disclosure Boundaries

- Copy source: use Landing Page Copy for intro and public project card/detail
  seeds.
- Data source: use Portfolio Content Source for links, contacts, resume path,
  skills, professional highlight labels, and disclosure decisions.
- Media source: Karly and Book-Kong media may be selected only after exact-asset
  privacy, attribution, and presentation-context review.
- Professional media: keep screenshots and private media out of the first
  implementation unless separately approved later.
