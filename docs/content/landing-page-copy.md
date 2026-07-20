# Landing Page Copy

This document freezes Phase 2 copy seeds for the landing first viewport and
unified project showcase. It complements
[Portfolio Content Source](portfolio-content-source.md), which owns the broader
project, link, skill, resume, and disclosure source data.

Keep this file public-safe. Private evidence may inform generalized professional
copy, but private source text, internal system names, endpoints, credentials,
screenshots, and confidential architecture must not be copied here.

## Intro Copy Source Data

Use the following first-viewport copy as the Phase 2 implementation seed. The
implementation may adjust line breaks for responsive layout, but it should keep
the meaning, hierarchy, and action order intact.

| Element          | Exact Copy                                                       | Product Role                                                                            |
| ---------------- | ---------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Status field     | `구직 상태` / `구직 중`                                          | Locale-aware recruiter availability field                                               |
| Page heading     | `웹 개발자 김용범의 포트폴리오`                                  | Visually hidden page-level heading kept in the document outline                         |
| Positioning      | `최종 사용자와 개발자 모두를 만족시키는 제품 구현을 지향합니다.` | Visible above-the-fold positioning statement rendered as paragraph copy                 |
| Primary CTA      | `Gmail에서 메일 쓰기`                                            | Browser-based recruiter contact through the ready public portfolio email                |
| Contact fallback | `이메일 주소 복사`                                               | Visible, copyable contact path that does not depend on a configured default mail client |
| Secondary CTA    | `GitHub 프로필`                                                  | Owner GitHub profile and contribution overview                                          |
| Tertiary CTA     | `이력서 PDF 다운로드`                                            | Text plus a vector download icon identifies local-file download before activation       |

The contact fallback reuses one polite live-status region. Each copy attempt
replaces the current message, resets its timer, and clears the message after
three seconds so repeated clicks never append duplicate feedback.

## Header And Hero Presentation Contract

Keep the exact first-viewport copy above while refining its visual hierarchy:

| Surface               | Visible Content                                                  | Presentation Contract                                                                                          |
| --------------------- | ---------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Header wordmark       | `김용범 포트폴리오`                                              | Present one concise site title rather than a heading-and-description lockup                                    |
| Global navigation     | `프로젝트`, `역량`                                               | Keep only the two landing destinations that remain after the Process section is retired                        |
| Theme control         | Existing light/dark mode action                                  | Keep it discoverable and fully operable, but visually secondary to identity, navigation, and recruiter actions |
| Job-status metadata   | `구직 상태` / `구직 중`                                          | Render static profile metadata; do not style or expose it as a toggle, button, switch, or selectable control   |
| Positioning statement | `최종 사용자와 개발자 모두를 만족시키는 제품 구현을 지향합니다.` | Keep paragraph semantics and visually accent only `최종 사용자` and `개발자`                                   |

The two positioning accents may use restrained color, weight, or an inline
surface treatment, but they must preserve the sentence's reading order and
remain understandable without color. Do not enlarge the positioning statement
until it overwhelms the contact actions. Do not render a separate role eyebrow,
visible title row, supporting description, or complementary review-guide card in
the intro unless a later owner review reintroduces one.

Open `Gmail에서 메일 쓰기` in a new browser context with the public portfolio
email pre-addressed. Keep the email address visible and copyable through
`이메일 주소 복사`, and provide clear interaction feedback. Open `GitHub 프로필`
in a new browser context and point it to the owner's GitHub profile. Keep the
`portfolio-ybkim` source repository link within that project's card and detail
evidence rather than repeating it as a broad landing-page action.

Keep the first viewport as one focused composition. Let spacing separate the CTA
row from the visible email/copy row, and use a vector download icon outside the
underlined resume label. Project counts, evidence boundaries, and implementation
details belong in the Projects and Skills sections rather than a parallel hero
guide.

## Landing Section Scope Copy

| Element                       | Exact Copy                                                                                                                                                 |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Projects heading              | `프로젝트`                                                                                                                                                 |
| Projects description          | `소스와 배포 결과를 확인할 수 있는 공개 결과물부터 회사에서 수행한 비공개 비즈니스 프로젝트까지, 개발 작업을 성격과 공개 범위에 따라 한곳에 정리했습니다.` |
| Public-result group heading   | `공개 결과물`                                                                                                                                              |
| Company-project group heading | `회사 비공개 프로젝트`                                                                                                                                     |
| Company-card scope label      | `회사 비즈니스 프로젝트 · 공개 범위 요약`                                                                                                                  |

Do not render section indices or blue eyebrow copy above landing-page section
headings. Keep subgroup context in the adjacent descriptions and the visible
company-card scope label.

## Skills Copy And Evidence

Render `역량` after Projects and remove the separate `작업 방식` section. The
section contains two review layers:

1. `기술 스택`: the exact reviewed resume inventory, grouped under Korean
   implementation-role labels; and
2. `구현 역량`: a compact matrix with `설계 기준`, `자동화 경로`, and
   `확인 근거` columns.

The five capability rows are `기계적인 품질 피드백`,
`안전한 Agent 개발 환경`, `문서 Architecture와 작업 추적`,
`웹 표준과 접근성`, and `자동화된 회귀 검증`. Public evidence links should
target the corresponding repository configuration, infrastructure, docs, or
test surface. Do not call the current browser-geometry tests pixel-diff visual
regression.

Use local SVG technology marks only when the reviewed asset source provides the
actual brand. Keep the visible technology name as the accessible meaning and
use a typographic fallback when no approved mark is available. Render reviewed
marks with their pinned Simple Icons brand color on a theme-aware surface; color
remains decorative and never replaces the visible name.

Do not add a phone number, home address, production URL, or custom-domain email
to the first viewport before the relevant Phase 3 decisions. Do not rewrite the
intro as a React, Next.js, or framework preference statement; tools may appear
later as supporting evidence where they are relevant.

## Project Showcase Copy Seed

Within the unified Projects section, render the public-result group as three
inspectable project cards in the order below. Each card should point to a detail
page and expose public links only after the destination is rechecked during
implementation. Use `개인 공개 프로젝트` for `portfolio-ybkim` and
`부트캠프 공개 팀 프로젝트` for Karly and Book-Kong.

### `portfolio-ybkim`

- Card title: `portfolio-ybkim`
- Card summary:
  `Astro 정적 사이트 구조, 문서 기반 기획, ADR, PBI, 품질 검증 절차를 함께
살펴볼 수 있는 현재 포트폴리오 제품입니다.`
- Primary detail angle:
  Explain how the repository itself shows product planning, static architecture,
  content boundaries, and verification discipline.
- Suggested evidence links:
  source repository, documentation map, ADR list, product backlog, quality-gate
  scripts.
- Detail copy seed:
  `채용 담당자와 기술 리뷰어가 소스, 문서, 의사결정, 검증 이력을 함께
확인할 수 있도록 포트폴리오 제품과 그 제작 과정을 하나의 검토 경로로
설계했습니다.`

### `Karly`

- Card title: `Karly`
- Card summary:
  `Vanilla JavaScript 팀 프로젝트에서 상품 목록·상세 UI, 의미 있는 HTML
구조, CSS 변수 기반 스타일링을 구현한 초기 프론트엔드 실습입니다.`
- Primary detail angle:
  Present hands-on DOM, semantic markup, styling, and team-delivery evidence
  through public repository and demo links.
- Suggested evidence links:
  public repository, deployed demo, owner-approved design reference or media
  after exact-asset review.
- Detail copy seed:
  `프레임워크보다 웹 기본기와 팀 협업을 먼저 검증한 프로젝트로, 상품
탐색 흐름과 UI 구조를 직접 구현하며 접근 가능한 마크업과 유지보수 가능한
스타일 구조를 실습했습니다.`

### `Book-Kong`

- Card title: `Book-Kong`
- Card summary:
  `독서 기록 SPA 팀 리드로 일정과 협업을 조율하고 데이터 사전 로딩·조회
흐름, Storybook 지원 도구, 접근성 도우미를 구현했습니다.`
- Primary detail angle:
  Present team leadership, component thinking, server-state user experience, and
  reviewable frontend support utilities.
- Suggested evidence links:
  public repository, deployed demo, owner-created design or media assets after
  exact-asset review.
- Detail copy seed:
  `팀 리드로 구현 범위와 협업 흐름을 조율하면서 사용자가 끊김 없이 독서
기록을 탐색할 수 있도록 데이터 조회 흐름과 UI 검증 보조 도구를
정리했습니다.`

Company projects appear as the second subgroup within the same Projects section,
below the public-result cards. They may use the public-safe labels from
[Portfolio Content Source](portfolio-content-source.md#project-source-data), but
they must not be promoted as inspectable source-code case studies unless a later
disclosure review approves a public route, screenshot, or source artifact. Keep
the visible `회사 비즈니스 프로젝트 · 공개 범위 요약` scope label on every
company-project item so each item remains understandable outside the surrounding
group.
