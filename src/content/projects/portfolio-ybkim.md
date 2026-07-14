---
title: "portfolio-ybkim"
classification: "Portfolio Product"
summary: "Astro 정적 사이트 구조, 문서 기반 기획, ADR, PBI, 품질 게이트를 함께 검토할 수 있는 현재 포트폴리오 제품입니다."
role: "Owner · Implementer"
contribution: "제품 기획, 콘텐츠 경계, Astro 구현, 문서와 품질 게이트 전반"
focus: "정적 포트폴리오, 문서화, 품질 검증과 배포 준비"
tags:
  - Static Architecture
  - Docs-led Delivery
  - Quality Gates
stack:
  - Astro
  - TypeScript
  - Semantic HTML
  - CSS
  - pnpm
order: 1
links:
  - label: "GitHub 저장소"
    href: "https://github.com/DragonTiger92/portfolio-ybkim"
    showOnCard: true
  - label: "문서 맵"
    href: "https://github.com/DragonTiger92/portfolio-ybkim/blob/main/docs/README.md"
  - label: "ADR 목록"
    href: "https://github.com/DragonTiger92/portfolio-ybkim/tree/main/docs/adr"
  - label: "Product Backlog"
    href: "https://github.com/DragonTiger92/portfolio-ybkim/blob/main/docs/planning/product-backlog.md"
  - label: "품질 게이트"
    href: "https://github.com/DragonTiger92/portfolio-ybkim/blob/main/package.json"
---

## 문제

채용 담당자와 기술 리뷰어가 소스, 문서, 의사결정, 검증 이력을 함께 확인할 수 있도록 포트폴리오
제품과 그 제작 과정을 하나의 검토 경로로 설계해야 했습니다. 동시에 공개 가능한 정보와 private
evidence의 경계를 유지해야 했습니다.

## 기여 경계

요구사항과 content boundary 정의부터 Astro 정적 구현, 문서 기반 planning, 자동화된 quality gate까지
제품 전반을 직접 설계하고 구현합니다. 전문 작업의 private source는 공개 저장소에 복사하지 않고
검토된 일반화 문구만 사용합니다.

## 접근

Astro의 static output과 first-depth project route를 사용하고, 10개 ADR과 40개 이상의 PBI로 제품 결정과
작업 상태를 source와 함께 관리합니다. TypeScript, semantic HTML, CSS, accessibility, build 검증을 하나의
canonical gate로 연결해 사람과 agent의 변경이 같은 기준을 통과하게 구성했습니다.

## 결과

Repository 자체가 구현 결과뿐 아니라 판단 근거와 검증 이력까지 탐색할 수 있는 case study가 되었습니다.
현재는 PH-002 정적 포트폴리오 구현을 진행하며 Cloudflare Pages production readiness로 범위를 확장하고
있습니다.
