# portfolio-ybkim

웹 개발자로서의 재취직을 위한 개인 포트폴리오 프로젝트입니다. Vanilla TypeScript, HTML, Pure CSS를 기반으로 구현하고 GitHub Pages에 정적 사이트로 배포할 예정입니다.

## Tech Stack

- Vite
- TypeScript
- HTML
- CSS
- ESLint
- Prettier

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
