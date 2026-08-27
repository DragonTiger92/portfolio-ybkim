# portfolio-ybkim

웹 개발자 김용범의 프로젝트 결과와 구현 판단을 함께 살펴볼 수 있는 정적 포트폴리오입니다. 방문자는 공개 프로젝트와 역량을 빠르게 확인할 수 있고, 기술 리뷰어는 같은 저장소에서 요구사항, 아키텍처 결정, 코드와 품질 검증 근거를 추적할 수 있습니다.

제품의 진행 우선순위와 계획은 [Roadmap](docs/planning/roadmap.md)에서 관리합니다.

## 제품 정의

`portfolio-ybkim`은 프론트엔드 구현을 중심으로 다음 역량을 보여주는 제품입니다.

- 의미가 드러나는 HTML과 접근 가능한 상호작용을 설계하는 능력
- TypeScript와 Astro를 사용해 정적 웹 제품을 구조화하는 능력
- Pure CSS로 반응형 레이아웃과 light/dark theme를 일관되게 구현하는 능력
- 요구사항, ADR, 제품 백로그와 검증 절차를 코드와 함께 관리하는 능력
- 공개 가능한 근거와 비공개 자료의 경계를 유지하는 제품 판단

페이지의 콘텐츠뿐 아니라 저장소의 구조와 검증 과정도 포트폴리오 결과물에 포함됩니다.

## 검토 포인트

- landing page에서 개발자 포지셔닝, 공개 프로젝트와 기술 역량을 한 흐름으로 탐색할 수 있습니다.
- 각 공개 프로젝트는 별도 상세 route에서 역할, 기여 범위, 구현 접근과 결과를 설명합니다.
- 공개 저장소의 요구사항, ADR와 Product Backlog를 통해 구현 의도를 추적할 수 있습니다.
- 정적 분석, standards validation, accessibility와 browser regression test로 결과를 반복 검증합니다.
- resume와 외부 링크는 공개 검토에 필요한 최소 범위로 연결합니다.

## 아키텍처와 기술

| 영역            | 선택                                    |
| --------------- | --------------------------------------- |
| Rendering       | Astro static output                     |
| Markup          | Semantic HTML                           |
| Styling         | Pure CSS, CSS custom properties         |
| Language        | TypeScript                              |
| Content         | Astro content collections, Markdown     |
| Quality         | ESLint, Prettier, HTML Validate, W3C Nu |
| Browser testing | Playwright, axe-core                    |
| Delivery        | Cloudflare Pages                        |

사이트는 application server 없이 정적 artifact로 생성됩니다. 콘텐츠, route, component, style과 검증 책임을 분리하고 Cloudflare Pages root에서 동작하는 shallow information architecture를 유지합니다.

## 저장소 검토 경로

- [Project Brief](docs/planning/project-brief.md): 제품 목적, 대상과 경계
- [Documentation Map](docs/README.md): public project document 전체 구조
- [Architecture Overview](docs/architecture/overview.md): 정적 사이트 구성과 책임
- [Architecture Decision Records](docs/adr/): 주요 기술·운영 결정
- [Product Backlog](docs/planning/product-backlog.md): 구현 단위와 acceptance criteria
- [Development Workflow](docs/process/development-workflow.md): branch, review와 품질 gate
- [Design Harness](DESIGN.md): UI의 시각·반응형·접근성 방향

## 로컬 검증

저장소는 Node.js `24.18.0`과 pnpm `11.10.0`을 기준으로 합니다. Windows PowerShell에서는 다음과 같이 실행합니다.

```powershell
pnpm.cmd install --frozen-lockfile
pnpm.cmd dev
```

전체 제품 검증은 하나의 canonical command로 수행합니다.

```powershell
pnpm.cmd check
```

이 명령은 type checking, strict lint, repository policy와 budget 검증, static build, HTML standards validation 및 browser accessibility test를 순서대로 실행합니다.

## 배포와 릴리스 모델

배포 대상은 Cloudflare Pages이며 Preview와 Production을 분리합니다. 배포 후보는 검증된 `dist/` artifact와 source revision의 관계를 보존하고, Production 배포 후 smoke 검증이 성공한 revision만 `vX.Y.Z` 형식의 annotated Git tag와 GitHub Release의 대상이 됩니다.

배포 구조, 보안 header, artifact evidence와 release 정책은 [Deployment Architecture](docs/architecture/deployment.md)에서 확인할 수 있습니다.

## AI-Assisted Workflow

LLM은 요구사항 정리, 구현 대안 검토, 코드 작성과 검증 보조에 사용합니다. 제안된 결과는 저장소의 공개 규칙, 제품 요구사항과 실제 검증 결과를 기준으로 사람이 검토하며, agent 전용 운영 지침과 public project documentation의 경계를 분리합니다.

## License And Notice

Source code and build/configuration files required to run this portfolio project are licensed under the [MIT License](LICENSE).

Portfolio content, documentation, personal descriptions, visual design content, images, and other non-code materials are Copyright (c) 2026 YB Kim. All rights reserved unless otherwise stated. See [NOTICE.md](NOTICE.md).

This repository is public for portfolio review. External contributions, pull requests, issue-based suggestions, and unsolicited project proposals are not accepted.
