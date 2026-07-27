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
  evidenceLinks: Array<{
    href: string;
    label: string;
  }>;
  features: string[];
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
      { name: "SQL" },
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
    features: [
      "개발 단계별로 강화되는 품질 기준",
      "Agent 완료는 warning-free, 일반 lint는 예외 대응용으로 분리",
    ],
    automation: "ESLint · pre-commit hook · warning-free 품질 게이트",
    evidence: "개발 규칙과 작업 완료·commit·push·CI 단계별 품질 게이트를 공개합니다.",
    evidenceLinks: [
      {
        href: "https://github.com/DragonTiger92/portfolio-ybkim/blob/main/eslint.config.js",
        label: "ESLint 품질 규칙",
      },
      {
        href: "https://github.com/DragonTiger92/portfolio-ybkim/blob/main/docs/architecture/github-governance.md#quality-gate-matrix",
        label: "품질 게이트 설계",
      },
    ],
  },
  {
    title: "안전한 Agent 개발 환경",
    description:
      "반복 작업은 Agent guideline을 따라 일관되게 실행하고, 외부 연결·비밀 정보·파괴적 작업은 sandbox와 명시적 승인 경계 안에서 통제합니다.",
    standard: "작업별 guideline · sandbox 격리 · 명시적 승인",
    features: ["반복 작업과 고위험 작업의 실행 경계 분리"],
    automation: "Agent guideline harness · sandbox · 승인 절차",
    evidence: "Agent 실행 규칙과 GitHub ruleset·update 정책을 저장소에서 관리합니다.",
    evidenceLinks: [
      {
        href: "https://github.com/DragonTiger92/portfolio-ybkim/blob/main/AGENTS.md",
        label: "Agent 운영 기준",
      },
      {
        href: "https://github.com/DragonTiger92/portfolio-ybkim/tree/main/infra/terraform/github",
        label: "Terraform 구성",
      },
    ],
  },
  {
    title: "문서 Architecture와 작업 추적",
    description:
      "요구사항에서 구현 근거까지 이어지는 문서 구조로 개발자 본인·Agent·recruiter가 작업 맥락과 의사결정을 추적할 수 있게 합니다.",
    standard: "요구사항 → Phase roadmap → PBI backlog",
    features: ["요구사항부터 구현 근거까지 이어지는 추적성"],
    automation: "Docs lint · traceability matrix",
    evidence: "ADR과 content boundary로 결정 책임을 분리",
    evidenceLinks: [
      {
        href: "https://github.com/DragonTiger92/portfolio-ybkim/tree/main/docs",
        label: "문서 구조",
      },
    ],
  },
  {
    title: "웹 표준과 접근성",
    description:
      "Semantic markup을 기준으로 구현하고, 표준 validator와 접근성 검사를 저장소의 반복 가능한 검증 절차에 포함합니다.",
    standard: "Semantic HTML · WCAG A·AA",
    features: ["표준 적합성과 실제 browser 동작을 함께 검증"],
    automation: "vnu · html-validate · Playwright · axe",
    evidence: "Heading, landmark와 pointer target까지 browser test로 확인",
    evidenceLinks: [
      {
        href: "https://github.com/DragonTiger92/portfolio-ybkim/blob/main/tests/accessibility.spec.ts",
        label: "접근성 검증",
      },
    ],
  },
  {
    title: "자동화된 회귀 검증",
    description:
      "브라우저와 단위 검증을 필요한 품질 영역에 배치해 agent coding 결과가 기존 동작과 layout을 깨뜨리지 않는지 확인합니다.",
    standard: "사용자 동작 · responsive layout · validator 경계 조건",
    features: ["변경 위험에 맞춘 browser·unit 검증"],
    automation: "Playwright browser test · Node unit test",
    evidence: "Wide·narrow layout과 custom validator를 회귀 검증",
    evidenceLinks: [
      {
        href: "https://github.com/DragonTiger92/portfolio-ybkim/tree/main/tests",
        label: "Test suite",
      },
    ],
  },
];
