# Landing Page Copy

This document freezes Phase 2 copy seeds for the landing first viewport and
public project showcase. It complements
[Portfolio Content Source](portfolio-content-source.md), which owns the broader
project, link, skill, resume, and disclosure source data.

Keep this file public-safe. Private evidence may inform generalized professional
copy, but private source text, internal system names, endpoints, credentials,
screenshots, and confidential architecture must not be copied here.

## Intro Copy Source Data

Use the following first-viewport copy as the Phase 2 implementation seed. The
implementation may adjust line breaks for responsive layout, but it should keep
the meaning, hierarchy, and action order intact.

| Element       | Exact Copy                                                                                                                   | Product Role                                                                                    |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Status tag    | `함께할 팀을 찾고 있습니다`                                                                                                  | Recruiter-facing availability cue                                                               |
| Eyebrow       | `프론트엔드에 강한 웹 개발자`                                                                                                | Compact Korean role framing without leading with a tool list                                    |
| Page heading  | `웹 개발자 김용범의 포트폴리오`                                                                                              | Concise page identity for the document outline                                                  |
| Positioning   | `사용자가 이해하기 쉬운 UI와 오래 관리할 수 있는 웹 제품을 만듭니다.`                                                        | Above-the-fold positioning statement rendered as paragraph copy                                 |
| Lead          | `프론트엔드 구현에 강점을 둔 개발자 김용범입니다. 데이터 흐름을 명확히 설계하고, 문서와 검증 가능한 결과물을 함께 남깁니다.` | Human-readable summary of UI care, maintainability, and verification                            |
| Support copy  | `Astro로 만든 이 사이트와 Karly, Book-Kong, 공개 가능한 실무 작업에 구현·협업·인수인계 경험을 담았습니다.`                   | Evidence bridge into project showcase and professional highlights                               |
| Primary CTA   | `이메일로 연락하기`                                                                                                          | Recruiter contact through the ready public portfolio email                                      |
| Secondary CTA | `GitHub 보기`                                                                                                                | Technical reviewer path to public source and contribution history                               |
| Tertiary CTA  | `이력서 PDF`                                                                                                                 | Direct resume download after the reviewed Korean PDF remains available at the public asset path |

Do not add a phone number, home address, production URL, or custom-domain email
to the first viewport before the relevant Phase 3 decisions. Do not rewrite the
intro as a React, Next.js, or framework preference statement; tools may appear
later as supporting evidence where they are relevant.

## Project Showcase Copy Seed

Render the public-source project showcase as three inspectable project cards in
the order below. Each card should point to a detail page and expose public links
only after the destination is rechecked during implementation.

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

Professional highlights should appear as a separate section below the
public-source showcase. They may use the public-safe labels from
[Portfolio Content Source](portfolio-content-source.md#project-source-data), but
they must not be promoted as inspectable source-code case studies unless a later
disclosure review approves a public route, screenshot, or source artifact.
