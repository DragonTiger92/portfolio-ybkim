---
title: "Book-Kong"
classification: "Public Source Project"
summary: "독서 기록 SPA 팀 리드로 일정과 협업을 조율하고 데이터 사전 로딩·조회 흐름, Storybook 유틸리티, 접근성 도우미를 구현했습니다."
role: "Frontend contributor · Team lead"
contribution: "팀 리드, 데이터 prefetch·query 흐름, Storybook 유틸리티, 접근성 도우미"
focus: "Component 설계, server-state UX와 팀 단위 작업 조율"
tags:
  - React
  - Server-State UX
  - Team Leadership
stack:
  - React
  - JavaScript
  - CSS
order: 3
links:
  - label: "팀 저장소"
    href: "https://github.com/FRONTENDSCHOOL8/Book-Kong"
    showOnCard: true
  - label: "배포 데모"
    href: "https://bookong.netlify.app/"
    showOnCard: true
---

## 프로젝트 맥락

팀 리드로 구현 범위와 협업 흐름을 조율하면서 사용자가 끊김 없이 독서 기록을 탐색할 수 있도록 데이터
조회 흐름과 UI 검증 보조 도구를 정리한 React SPA 프로젝트입니다.

## 기여 경계

일정과 작업 분배를 조율하고, server-state 사전 로딩과 조회 흐름, Storybook 지원 유틸리티, 접근성
도우미를 구현했습니다. 다른 팀원이 담당한 화면과 기능은 팀 결과로만 설명합니다.

## 구현 접근

사용자가 다음 화면을 기다리는 시간을 줄이도록 필요한 데이터를 미리 조회하고, 반복되는 UI 검증을
지원하는 Storybook 유틸리티와 접근성 helper를 정리했습니다. Component는 재사용 횟수보다 책임과 변경
이유를 기준으로 나누었습니다.

## 결과

공개 저장소와 배포 데모에서 팀의 독서 기록 흐름과 구현 결과를 확인할 수 있습니다. 이 경험은 데이터
흐름, component boundary, 팀 delivery를 함께 판단하는 기반이 되었습니다.
