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

## Header Hierarchy

Use one visible home-link wordmark, `김용범 포트폴리오`, rather than a
heading-and-description identity lockup. At desktop widths, let the GNB use the
available header space so `프로젝트` and `역량` have comfortable separation
instead of clustering beside the wordmark. Remove the retired Process anchor.

Keep the theme control visible, keyboard-accessible, and fully operable, but
style it as a neutral secondary utility. It must not use the same visual weight
as the site identity, primary contact action, or other recruiter-critical
features. Preserve the same priority and usable target sizes when the header
reflows at narrower widths.

## Landing Page Section Order

1. Intro / first viewport.
2. Projects, with public-result and company-confidential subgroups.
3. Skills, with technology inventory and implementation evidence.
4. Contact and footer.

## First Viewport Layout

```txt
┌──────────────────────────────────────────────────────┐
│ hidden H1: 웹 개발자 김용범의 포트폴리오              │
│ static metadata: 구직 상태 · 구직 중                  │
│                                                       │
│ Positioning: 최종 사용자와 개발자 모두를 만족시키는   │
│              제품 구현을 지향합니다.                  │
│                                                      │
│ [Gmail에서 메일 쓰기] [이메일 주소 복사]              │
│ [GitHub 프로필] [이력서 PDF 다운로드 + icon]          │
└──────────────────────────────────────────────────────┘
```

- Render `구직 상태` / `구직 중` as static metadata, not as a toggle,
  button, switch, or selectable control.
- Keep the concise page-level `h1` available to the document outline but
  visually hidden. Do not render the previous role eyebrow, visible title row,
  or supporting description.
- Keep the positioning statement as paragraph content with restrained type
  scale and readable line length. Apply small, non-color-only emphasis only to
  `최종 사용자` and `개발자`.
- Preserve the exact PBI-058 CTA copy. Removing the review guide does not change
  action destinations or disclosure boundaries.
- Primary CTA: `Gmail에서 메일 쓰기` in a new browser context with the public
  portfolio email pre-addressed.
- Contact fallback: keep the email address visible and copyable through
  `이메일 주소 복사`, with clear interaction feedback.
- Secondary CTA: `GitHub 프로필` in a new browser context, targeting the owner's
  GitHub profile.
- Tertiary CTA: `이력서 PDF 다운로드`, paired with a visible vector download
  icon that reinforces the local-file download behavior without using a text
  glyph that receives the label underline.
- Keep the `portfolio-ybkim` source repository within that project's card and
  detail evidence. Do not repeat it as a broad first-viewport, standalone
  repository-section, or footer action.
- Do not add a separate contact route or resume route for the first
  implementation.
- Do not render a parallel review-guide card. Use one readable intro measure and
  whitespace to keep positioning, action links, and the email row recognizable;
  leave project evidence and scope explanations to the sections that own them.

## Unified Projects Structure

Use one `프로젝트` section because all six entries describe development
projects. Separate them by evidence and disclosure boundary inside that section;
do not imply that public projects and professional work are mutually exclusive.

### Public Results

Render three public-source project cards in this order:

1. `portfolio-ybkim`.
2. `Karly`.
3. `Book-Kong`.

Use `공개 결과물` as the subgroup heading and explain in the adjacent
description that the three cards expose source or deployment results, owner
role, implementation scope, and public evidence. Use the per-card
classifications `개인 공개 프로젝트` and `부트캠프 공개 팀 프로젝트` to make
project origin recognizable without treating publicness as the project's
purpose.

Each card should include:

- project title;
- short summary from [Landing Page Copy](../content/landing-page-copy.md);
- owner role;
- compact tags or capability cues;
- detail-page link;
- public repository and demo links where available and rechecked.

Use the project title and reviewable content as each card's identity. Do not add
initial-based marks, duplicate wordmarks, logo-like placeholders, or another
decorative panel solely to fill space. A real project logo or screenshot
requires a separate rights and asset review before publication.

Project cards should make the source-review path obvious without forcing every
card into the same link set. `portfolio-ybkim` should emphasize repository,
docs, ADRs, backlog, and checks. `Karly` and `Book-Kong` should emphasize public
repository and deployed demo links.

### Company-Confidential Business Projects

Place company-project summaries after the public-result cards within the same
Projects section. Keep the quieter list treatment so the entries read as real
business work without suggesting that their private source can be inspected.

Use three generalized highlight cards:

1. Academy information and consultation web service.
2. Science-question concept and solution-logic structuring tool.
3. Internal science education content production and review platform.

The academy project may link its public product URL. The other two company
projects should not expose private URLs, source, routes,
screenshots, workflows, or internal names.

Use `회사 비공개 프로젝트` as the subgroup heading. Explain that each project
was performed by a practitioner for company business, while private material
and internal details are excluded. Give every item the visible
`회사 비즈니스 프로젝트 · 공개 범위 요약` scope cue.

## Skills, Contact, Footer Flow

- Skills: begin with a `기술 스택` article that groups the reviewed resume
  inventory by implementation role without proficiency rankings. Use local SVG
  brand marks in their pinned Simple Icons colors as supplementary identifiers
  and a typographic fallback when an approved mark is unavailable. Visible names
  retain the accessible meaning in both themes.
- Capability evidence: follow the inventory with a responsive matrix. Compare
  mechanical quality feedback, agent harness safety, documentation
  architecture, standards and accessibility, and automated regression through
  `설계 기준`, `자동화 경로`, and `확인 근거` columns.
- Working method: keep planning, implementation, verification, documentation,
  and handoff evidence inside the capability matrix rather than a separate
  Process section.
- Contact: keep Gmail web compose primary, provide a visible and copyable email
  fallback, use the GitHub profile as the secondary broad action, and keep the
  resume download available.
- Footer: keep the rights notice and GitHub profile visible without duplicating
  the first-viewport email and resume actions. Add the production URL only
  after the Phase 3 decision exists.

Do not render decorative section indices or blue eyebrow copy above landing
section headings. Preserve project-card classifications and item ordering where
they communicate evidence type rather than top-level IA numbering.

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

Company-confidential projects do not need detail routes in the first
implementation. If a later scope adds one, reopen disclosure review before
creating the route.

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
  skills, company-project labels, and disclosure decisions.
- Media source: Karly and Book-Kong media may be selected only after exact-asset
  privacy, attribution, and presentation-context review.
- Professional media: keep screenshots and private media out of the first
  implementation unless separately approved later.
