export interface TechStackItem {
  icon?: {
    slug: string;
  };
  name: string;
}

export interface TechStackGroup {
  label: string;
  items: TechStackItem[];
}

export interface CapabilityGroup {
  automation: string;
  description: string;
  evidence: string;
  evidenceLink: {
    href: string;
    label: string;
  };
  standard: string;
  title: string;
}

function withBrandMark(name: string, slug: string): TechStackItem {
  return { icon: { slug }, name };
}

export const techStackGroups: TechStackGroup[] = [
  {
    label: "언어",
    items: [
      withBrandMark("TypeScript", "typescript"),
      withBrandMark("Python", "python"),
      withBrandMark("Solidity", "solidity"),
    ],
  },
  {
    label: "프론트엔드",
    items: [
      withBrandMark("Next.js", "nextdotjs"),
      withBrandMark("Tailwind CSS", "tailwindcss"),
      withBrandMark("TanStack Query", "reactquery"),
      withBrandMark("Framer Motion", "framer"),
      withBrandMark("jQuery", "jquery"),
      withBrandMark("Bootstrap v5", "bootstrap"),
    ],
  },
  {
    label: "백엔드 · API",
    items: [
      withBrandMark("Django", "django"),
      withBrandMark("FastAPI", "fastapi"),
      withBrandMark("SQLAlchemy", "sqlalchemy"),
      { name: "Alembic" },
    ],
  },
  {
    label: "데이터베이스 · 스토리지",
    items: [{ name: "Amazon S3" }, withBrandMark("PostgreSQL", "postgresql")],
  },
  {
    label: "클라우드 · 인프라",
    items: [
      { name: "Amazon EC2 (Linux)" },
      withBrandMark("Docker", "docker"),
      withBrandMark("Terraform", "terraform"),
      withBrandMark("Nginx", "nginx"),
      { name: "Amazon Route 53" },
    ],
  },
  {
    label: "DevOps · CI/CD",
    items: [withBrandMark("GitHub Actions", "githubactions"), { name: "Amazon CodeDeploy" }],
  },
  {
    label: "테스트 · 품질",
    items: [
      withBrandMark("Vitest", "vitest"),
      withBrandMark("Playwright", "playwright"),
      withBrandMark("Mock Service Worker", "mockserviceworker"),
      withBrandMark("ESLint", "eslint"),
      { name: "Husky" },
    ],
  },
  {
    label: "보안 · 소프트웨어 공급망",
    items: [{ name: "Certbot" }, withBrandMark("Dependabot", "github"), { name: "CycloneDX" }],
  },
  {
    label: "버전 관리 · 협업",
    items: [
      withBrandMark("GitHub", "github"),
      withBrandMark("Notion", "notion"),
      withBrandMark("Slack", "slack"),
      withBrandMark("Storybook", "storybook"),
    ],
  },
];

export const capabilityGroups: CapabilityGroup[] = [
  {
    title: "기계적인 품질 피드백",
    description: "개발 규칙을 편집, commit, CI 단계에서 반복 확인하는 feedback loop로 연결합니다.",
    standard: "파일 성격별 line budget · 중첩 depth 2 경고, depth 3 오류",
    automation: "ESLint · Husky · Agent strict lint",
    evidence: "Agent 완료 검증에서는 warning까지 실패로 처리",
    evidenceLink: {
      href: "https://github.com/DragonTiger92/portfolio-ybkim/blob/main/eslint.config.js",
      label: "ESLint 규칙",
    },
  },
  {
    title: "안전한 Agent 개발 환경",
    description:
      "반복 가능한 작업은 agent가 CLI로 실행할 수 있게 만들고, 외부 연결과 비밀 정보, 파괴적 작업은 권한 경계 안에 둡니다.",
    standard: "도구별 guideline · sandbox · 승인 경계",
    automation: "Terraform · Dependabot · CLI",
    evidence: "저장소 설정, ruleset과 update 정책을 코드로 관리",
    evidenceLink: {
      href: "https://github.com/DragonTiger92/portfolio-ybkim/tree/main/infra/terraform/github",
      label: "Terraform 구성",
    },
  },
  {
    title: "문서 Architecture와 작업 추적",
    description:
      "요구사항에서 구현 근거까지 이어지는 문서 구조로 작업의 맥락과 의사결정을 다음 참여자가 추적할 수 있게 합니다.",
    standard: "요구사항 → Phase roadmap → PBI backlog",
    automation: "Docs lint · traceability matrix",
    evidence: "ADR과 content boundary로 결정 책임을 분리",
    evidenceLink: {
      href: "https://github.com/DragonTiger92/portfolio-ybkim/tree/main/docs",
      label: "문서 구조",
    },
  },
  {
    title: "웹 표준과 접근성",
    description:
      "Semantic markup을 기준으로 구현하고, 표준 validator와 접근성 검사를 저장소의 반복 가능한 검증 절차에 포함합니다.",
    standard: "Semantic HTML · WCAG A·AA",
    automation: "vnu · html-validate · Playwright · axe",
    evidence: "Heading, landmark와 pointer target까지 browser test로 확인",
    evidenceLink: {
      href: "https://github.com/DragonTiger92/portfolio-ybkim/blob/main/tests/accessibility.spec.ts",
      label: "접근성 검증",
    },
  },
  {
    title: "자동화된 회귀 검증",
    description:
      "브라우저와 단위 검증을 필요한 품질 영역에 배치해 agent coding 결과가 기존 동작과 layout을 깨뜨리지 않는지 확인합니다.",
    standard: "사용자 동작 · responsive layout · validator 경계 조건",
    automation: "Playwright browser test · Node unit test",
    evidence: "Wide·narrow layout과 custom validator를 회귀 검증",
    evidenceLink: {
      href: "https://github.com/DragonTiger92/portfolio-ybkim/tree/main/tests",
      label: "Test suite",
    },
  },
];
