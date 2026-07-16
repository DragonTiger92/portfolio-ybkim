interface ProfessionalHighlight {
  action?: {
    href: string;
    label: string;
  };
  description: string;
  tags: string[];
  title: string;
}

interface LandingScopeCopy {
  heroProof: {
    eyebrow: string;
    professionalExperience: {
      detail: string;
      label: string;
    };
    publicProjects: {
      detail: string;
      label: string;
    };
    reviewOrder: {
      label: string;
      value: string;
    };
    title: string;
  };
  heroSupport: string;
  professionalExperience: {
    description: string;
    eyebrow: string;
    scopeLabel: string;
    title: string;
  };
  projects: {
    description: string;
    eyebrow: string;
  };
}

export const landingScopeCopy = {
  heroProof: {
    eyebrow: "포트폴리오 검토 안내",
    professionalExperience: {
      detail: "공개 가능한 범위로 요약",
      label: "실무 경험",
    },
    publicProjects: {
      detail: "소스와 결과 확인 가능",
      label: "공개 프로젝트",
    },
    reviewOrder: {
      label: "검토 순서",
      value: "프로젝트 → 실무 경험 → 역량 → 작업 방식",
    },
    title: "공개 근거와 경험 요약",
  },
  heroSupport:
    "Astro로 만든 이 포트폴리오와 Karly, Book-Kong은 소스와 결과를 확인할 수 있는 공개 프로젝트입니다. 실무 경험은 공개 가능한 범위에서 역할과 기여를 요약했습니다.",
  professionalExperience: {
    description:
      "비공개 자료와 내부 세부사항은 제외하고, 공개 가능한 범위에서 확인된 역할과 기여를 요약했습니다.",
    eyebrow: "공개 범위로 요약",
    scopeLabel: "실무 경험 · 공개 범위 요약",
    title: "실무 경험",
  },
  projects: {
    description:
      "소스 또는 배포 결과를 확인할 수 있는 세 프로젝트입니다. 각 카드에서 맡은 역할과 구현 범위, 공개 근거를 함께 살펴볼 수 있습니다.",
    eyebrow: "공개 프로젝트",
  },
} as const satisfies LandingScopeCopy;

export const professionalHighlights: ProfessionalHighlight[] = [
  {
    title: "학원 정보·상담 웹 서비스",
    description:
      "학원 정보 탐색과 상담 신청을 잇는 공개 서비스에서 기획, 화면 구성, API·데이터 연동, 배포 준비와 인수인계까지 맡았습니다.",
    tags: ["기획부터 인수인계", "화면 · API · 데이터", "공개 서비스"],
    action: {
      label: "공개 서비스 보기",
      href: "https://academy.shine-edu.kr/",
    },
  },
  {
    title: "과학 문항 개념·풀이 논리 구조화 도구",
    description:
      "로그인과 세션 처리, 초기 목록과 입력 화면, 타입 경계, 서버 상태 조회 흐름을 구현하고 후속 작업자가 이어갈 수 있도록 인계했습니다.",
    tags: ["프론트엔드 기반 구축", "타입 경계", "인수인계"],
  },
  {
    title: "과학 교육 콘텐츠 제작·검수 플랫폼",
    description:
      "기존 내부 업무 플랫폼을 인수받아 데이터 일관성을 지키고 파일 처리를 안전하게 다듬었습니다. 복구 절차와 운영 문서도 함께 정비했습니다.",
    tags: ["인수받은 시스템", "안정성", "문서화"],
  },
];

export const skillGroups = [
  {
    title: "프론트엔드 구현",
    description: "의미가 드러나는 HTML, TypeScript, CSS와 접근성을 제품 구조 안에서 함께 다룹니다.",
  },
  {
    title: "제품 전달",
    description: "요구사항, 범위, 문서와 검증 기준을 구현 과정과 연결합니다.",
  },
  {
    title: "통합 이해",
    description: "API, 데이터 흐름, 배포와 릴리스 경계를 이해하고 협업합니다.",
  },
  {
    title: "유지보수",
    description: "명확한 책임, 타입 안정성과 자동화된 품질 검증 절차를 중요하게 생각합니다.",
  },
];
