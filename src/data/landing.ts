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
    tags: ["기획 및 제품 설계", "아키텍처 구현", "1인 유지보수성 확보"],
    action: {
      label: "공개 서비스 보기",
      href: "https://academy.shine-edu.kr/",
    },
  },
  {
    title: "과학 문항 개념·풀이 논리 구조화 도구",
    description:
      "인증 흐름과 초기 UI mockup을 포함한 프론트엔드 구조 전반을 구축 후, 다음 작업자가 프론트엔드 작업을 이어나갈 수 있도록 인계했습니다.",
    tags: ["프론트엔드 구축", "로그인 흐름 설계", "API 응답·도메인 타입 분리"],
  },
  {
    title: "과학 교육 콘텐츠 제작·검수 플랫폼",
    description:
      "기존 내부 업무 플랫폼을 인수받아 운영 안정성을 보강하고, 트러블 슈팅 도구를 만들어 운영상 발생하는 문제들을 해결하였습니다. 또한 제품 인계를 위한 문서 작업 등을 진행하였습니다.",
    tags: ["인수인계", "풀스택", "트러블 슈팅"],
  },
];
