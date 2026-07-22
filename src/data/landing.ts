interface CompanyProjectHighlight {
  action?: {
    href: string;
    label: string;
  };
  description: string;
  tags: string[];
  title: string;
}

interface LandingScopeCopy {
  projects: {
    companyGroup: {
      description: string;
      title: string;
    };
    publicGroup: {
      title: string;
    };
  };
}

export const landingScopeCopy = {
  projects: {
    companyGroup: {
      description:
        "회사에서 비즈니스 목적으로 수행한 실무 프로젝트입니다. 비공개 소스 코드를 포함한 내부 정보는 제외하였습니다.",
      title: "회사 비공개 프로젝트",
    },
    publicGroup: {
      title: "공개 프로젝트",
    },
  },
} as const satisfies LandingScopeCopy;

export const companyProjectHighlights: CompanyProjectHighlight[] = [
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
