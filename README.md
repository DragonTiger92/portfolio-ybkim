# portfolio-ybkim

웹 개발자로서의 재취직을 목표로 제작 중인 개인 포트폴리오 프로젝트입니다. 포지셔닝은 **FE 중심 풀스택 웹 개발자(Frontend-specialized full-stack web developer)** 입니다.

이 저장소는 완성된 결과물뿐 아니라, Astro의 정적 생성, TypeScript,
시맨틱 HTML(semantic HTML), Pure CSS를 기반으로 웹사이트를 설계하고
개선해 가는 과정을 함께 보여주기 위한 작업 공간입니다. Cloudflare
Pages에 배포하는 가볍고 빠른 정적 사이트를 목표로 합니다.

## For Recruiters

이 프로젝트에서 중점적으로 보여주고 싶은 역량은 다음과 같습니다.

- 프론트엔드 구현을 중심으로 제품 흐름을 끝까지 이해하고 다루는 역량
- TypeScript를 사용해 작은 코드베이스라도 명확하고 안전하게 관리하는 습관
- CSS 구조, 반응형 레이아웃, 접근성, 성능을 함께 고려하는 구현 방식
- 요구사항, 아키텍처, ADR, SBOM 등 프로젝트 문서를 정리하는 태도
- LLM을 실무 도구처럼 활용해 기획, 구현, 검토, 문서화를 반복하는 작업 방식

## Documentation

프로젝트 문서는 [`docs/`](docs/)에 정리합니다. `docs/`는 공개 가능한 일반 프로젝트 문서만 담고, agent-only guideline은 `.agents/`, private source context는 gitignored `.contexts/`에 둡니다.

Root [`DESIGN.md`](DESIGN.md)는 이 포트폴리오의 디자인 판단 기준을
정리한 harness입니다. 사람이 읽을 수 있게 작성하되, 새 UI를 만들거나
수정하는 LLM agent가 기존 token, layout, accessibility, coherence 결정을
반복 적용할 수 있게 하는 데 중점을 둡니다.

주요 문서:

- [Design Harness](DESIGN.md)
- [Project Brief](docs/planning/project-brief.md)
- [Functional Requirements](docs/requirements/functional-requirements.md)
- [Non-Functional Requirements](docs/requirements/non-functional-requirements.md)
- [Architecture Overview](docs/architecture/overview.md)
- [ADR](docs/adr/)
- [Supply Chain Notes](docs/security/supply-chain.md)

## License And Notice

Source code and build/configuration files required to run this portfolio project
are licensed under the [MIT License](LICENSE).

Portfolio content, documentation, personal descriptions, visual design content,
images, and other non-code materials are Copyright (c) 2026 YB Kim. All rights
reserved unless otherwise stated. See [NOTICE.md](NOTICE.md).

This repository is public for portfolio review. External contributions, pull
requests, issue-based suggestions, and unsolicited project proposals are not
accepted.

## Tech Stack

| Area         | Stack                                   |
| ------------ | --------------------------------------- |
| Markup       | Astro, semantic HTML                    |
| Styling      | CSS                                     |
| Language     | TypeScript                              |
| Build Tool   | Astro                                   |
| Code Quality | ESLint, Prettier, HTML Validate, W3C Nu |
| Testing      | Playwright, axe-core                    |
| Hosting      | Cloudflare Pages                        |

## AI-Assisted Workflow

이 프로젝트는 LLM을 단순 코드 생성 도구가 아니라 개발 파트너로 활용하는 방식으로 진행합니다.

- 사용 LLM: OpenAI GPT-5 Codex
- 활용 방식: 요구사항 정리, 구현 방향 검토, 코드 품질 점검, README 및 작업 기록 보강
- 작업 원칙: LLM이 제안한 내용을 그대로 수용하지 않고, 프로젝트 목적과 코드 맥락에 맞는지 검토한 뒤 반영

## Goals

- 웹 개발자로서의 문제 해결 방식과 구현 역량을 보여주는 포트폴리오를 만든다.
- 프레임워크 의존을 최소화하고 브라우저 기본 기술, TypeScript, CSS 설계 역량을 드러낸다.
- Cloudflare Pages에 배포하는 가볍고 빠른 정적 사이트로 유지한다.
- 작업 과정에서 README와 docs를 함께 보강해 프로젝트 의도, 구조, 의사결정을 기록한다.
- 공개 포트폴리오 문구는 근거 있게 작성하되, 회사 내부 자료나 private project 세부사항은 노출하지 않는다.

## Getting Started

```bash
pnpm install
pnpm dev
```

## Scripts

```bash
pnpm dev
pnpm typecheck
pnpm lint
pnpm lint:fix
pnpm format
pnpm format:check
pnpm test:a11y
pnpm test:static-budget
pnpm sbom:cyclonedx
pnpm check:static
pnpm check
pnpm build:bundle
pnpm build
pnpm preview
pnpm validate:static-budget
```

- `dev`: Astro 개발 서버를 실행합니다.
- `typecheck`: Astro와 TypeScript 타입 검사를 실행합니다.
- `lint`: ESLint로 코드와 설정 파일을 검사합니다.
- `lint:fix`: 자동 수정 가능한 ESLint 문제를 수정합니다.
- `format`: Prettier로 전체 파일을 포맷합니다.
- `format:check`: Prettier 포맷 상태를 검사합니다.
- `test:a11y`: 최신 Astro build를 생성한 뒤 browser accessibility test를 실행합니다.
- `test:static-budget`: 정적 산출물 예산 validator의 단위 테스트를 실행합니다.
- `sbom:cyclonedx`: root CycloneDX SBOM을 재생성합니다.
- `check:static`: 타입, lint, 파일 크기, 포맷, Astro 빌드, 정적 산출물 예산, HTML 표준을 검사합니다.
- `check`: 정적 검사에 실제 브라우저 접근성 검사를 더해 전체 품질 gate를 실행합니다.
- `build:bundle`: 타입 검사를 반복하지 않고 Astro 정적 산출물을 생성합니다.
- `build`: 배포용 정적 파일을 생성합니다.
- `preview`: 빌드 결과를 로컬에서 미리 봅니다.
- `validate:static-budget`: 최신 `dist/`의 deterministic raw-byte 예산을 검사합니다.

## Project Structure

```text
.
├── public/
├── docs/
├── DESIGN.md
├── src/
│   ├── components/
│   ├── content/projects/
│   ├── layouts/
│   ├── pages/
│   ├── scripts/
│   └── styles/
├── tests/
├── astro.config.mjs
├── playwright.config.ts
├── eslint.config.js
├── LICENSE
├── NOTICE.md
├── .prettierrc
├── .prettierignore
├── SECURITY.md
├── tsconfig.json
└── package.json
```

## Deployment

Cloudflare Pages 배포를 목표로 합니다. Astro는 static output과 루트 경로를
사용하며, 배포 workflow와 Cloudflare 인프라는 PH-003에서 구현합니다.
