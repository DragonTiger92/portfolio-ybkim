---
title: "portfolio-ybkim"
summary: "작은 포트폴리오에도 요구사항, 문서, 접근성과 quality gate를 연결한 현재 진행형 프로젝트입니다."
role: "Owner · Implementer"
focus: "정적 포트폴리오, 문서화, 품질 검증과 배포 준비"
stack:
  - Astro
  - TypeScript
  - CSS
  - pnpm
order: 1
links:
  - label: "GitHub 저장소"
    href: "https://github.com/DragonTiger92/portfolio-ybkim"
---

## 문제

완성 화면뿐 아니라 요구사항을 정리하고 구현을 검증하는 과정까지 개발 역량의 근거로 보여줄 필요가
있었습니다. 동시에 공개 가능한 정보와 private evidence의 경계도 유지해야 했습니다.

## 접근

정적 배포 제약 안에서 문서 기반 planning, ADR, TypeScript와 CSS 품질 기준을 source와 함께 관리했습니다.
Agent 작업도 동일한 lint, format, accessibility와 build gate를 통과하도록 구성했습니다.

## 결과

Repository 자체가 구현 결과와 작업 방식을 함께 검토할 수 있는 case study가 되도록 발전시키고 있습니다.
현재는 Cloudflare Pages 배포와 production readiness를 향해 단계적으로 진행 중입니다.
