# portfolio-ybkim

웹 개발자로서의 재취직을 목표로 제작 중인 개인 포트폴리오 프로젝트입니다.

이 저장소는 완성된 결과물뿐 아니라, Vanilla TypeScript, HTML, Pure CSS를 기반으로 정적 웹사이트를 설계하고 개선해 가는 과정을 함께 보여주기 위한 작업 공간입니다. GitHub Pages에 배포 가능한 가볍고 빠른 정적 사이트를 목표로 합니다.

## For Recruiters

이 프로젝트에서 중점적으로 보여주고 싶은 역량은 다음과 같습니다.

- 프레임워크에 기대지 않고 브라우저 기본 기술로 UI를 구성하는 능력
- TypeScript를 사용해 작은 코드베이스라도 명확하고 안전하게 관리하는 습관
- CSS 구조, 반응형 레이아웃, 접근성, 성능을 함께 고려하는 구현 방식
- ESLint와 Prettier를 활용해 일관된 코드 품질 기준을 세우고 지키는 태도
- LLM을 실무 도구처럼 활용해 기획, 구현, 검토, 문서화를 반복하는 작업 방식

## Tech Stack

| Area         | Stack                                    |
| ------------ | ---------------------------------------- |
| Markup       | HTML                                     |
| Styling      | CSS                                      |
| Language     | TypeScript                               |
| Build Tool   | Vite                                     |
| Code Quality | ESLint, Prettier, eslint-config-prettier |
| Hosting      | GitHub Pages                             |

## AI-Assisted Workflow

이 프로젝트는 LLM을 단순 코드 생성 도구가 아니라 개발 파트너로 활용하는 방식으로 진행합니다.

- 사용 LLM: OpenAI GPT-5 Codex
- 활용 방식: 요구사항 정리, 구현 방향 검토, 코드 품질 점검, README 및 작업 기록 보강
- 작업 원칙: LLM이 제안한 내용을 그대로 수용하지 않고, 프로젝트 목적과 코드 맥락에 맞는지 검토한 뒤 반영

## Goals

- 웹 개발자로서의 문제 해결 방식과 구현 역량을 보여주는 포트폴리오를 만든다.
- 프레임워크 의존을 최소화하고 브라우저 기본 기술, TypeScript, CSS 설계 역량을 드러낸다.
- GitHub Pages에 배포 가능한 가볍고 빠른 정적 사이트로 유지한다.
- 작업 과정에서 README를 함께 보강해 프로젝트 의도, 구조, 의사결정을 기록한다.

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
pnpm check
pnpm build
pnpm preview
```

- `dev`: Vite 개발 서버를 실행합니다.
- `typecheck`: TypeScript 타입 검사를 실행합니다.
- `lint`: ESLint로 코드와 설정 파일을 검사합니다.
- `lint:fix`: 자동 수정 가능한 ESLint 문제를 수정합니다.
- `format`: Prettier로 전체 파일을 포맷합니다.
- `format:check`: Prettier 포맷 상태를 검사합니다.
- `check`: 타입 검사, ESLint, Prettier 검사를 한 번에 실행합니다.
- `build`: 배포용 정적 파일을 생성합니다.
- `preview`: 빌드 결과를 로컬에서 미리 봅니다.

## Project Structure

```text
.
├── public/
├── src/
│   ├── assets/
│   ├── counter.ts
│   ├── main.ts
│   └── style.css
├── index.html
├── eslint.config.js
├── .prettierrc
├── .prettierignore
├── tsconfig.json
└── package.json
```

## Deployment

GitHub Pages 배포를 목표로 합니다. 배포 방식은 프로젝트 구조가 정리되는 과정에서 확정하고 이 문서에 추가합니다.
