---
title: "portfolio-ybkim"
classification: "개인 공개 프로젝트"
summary: "Astro 정적 사이트 구조, 문서 기반 기획, 아키텍처 결정 기록, 제품 백로그와 품질 검증 절차를 함께 살펴볼 수 있는 포트폴리오 제품입니다."
role: "기획 · 구현"
contribution: "제품 기획, 콘텐츠 경계, Astro 구현, 문서와 품질 검증 절차 전반"
focus: "정적 포트폴리오, 문서화, 품질 검증과 배포 준비"
tags:
  - 아키텍처 설계
  - 하네스 구축
  - 문서 기반 개발
stack:
  - Astro
  - TypeScript
  - Terraform
  - Wrangler
  - Husky
  - Playwright
  - PNPM
order: 1
links:
  - label: "GitHub 저장소"
    href: "https://github.com/DragonTiger92/portfolio-ybkim"
    showOnCard: true
  - label: "문서 맵"
    href: "https://github.com/DragonTiger92/portfolio-ybkim/blob/main/docs/README.md"
  - label: "ADR 목록"
    href: "https://github.com/DragonTiger92/portfolio-ybkim/tree/main/docs/adr"
  - label: "제품 백로그"
    href: "https://github.com/DragonTiger92/portfolio-ybkim/blob/main/docs/planning/product-backlog.md"
  - label: "품질 검증 설정"
    href: "https://github.com/DragonTiger92/portfolio-ybkim/blob/main/package.json"
---

## 해결 과제

채용 담당자와 기술 리뷰어가 소스, 문서, 의사결정, 검증 이력을 함께 확인할 수 있도록 포트폴리오
제품과 그 제작 과정을 하나의 검토 경로로 설계해야 했습니다. 동시에 공개 가능한 정보와 비공개 근거의
경계를 유지해야 했습니다.

## 기여 경계

요구사항과 콘텐츠 공개 경계 정의부터 Astro 정적 구현, 문서 기반 기획, 자동화된 품질 검증까지 제품
전반을 직접 설계하고 구현하였습니다. 실무 작업의 비공개 자료는 공개 저장소에 복사하지 않고 검토된
일반화 문구만 사용하였습니다.

## 구현 접근

Astro의 정적 출력과 개별 프로젝트 상세 페이지를 사용하고, 아키텍처 결정 기록(ADR)과 제품
백로그(PBI)로 제품 결정과 작업 상태를 소스 코드와 함께 관리하였습니다. TypeScript, 의미가 드러나는
HTML, CSS, 접근성, 빌드 검증을 연결하고, 사람과 agent가 각 작업 환경에 맞는 절차로 같은 품질 방향을
따를 수 있도록 공통 규칙과 검증 harness를 구성했습니다.

## 결과

저장소 자체가 구현 결과뿐 아니라 판단 근거와 검증 이력까지 살펴볼 수 있는 사례가 되었습니다. 현재는
PH-002 정적 포트폴리오 구현을 진행하며 Cloudflare Pages 운영 준비로 범위를 확장하고 있습니다.
