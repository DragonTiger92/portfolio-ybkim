import { getCollection } from "astro:content";
import type { APIRoute } from "astro";

export const prerender = true;

const escapeMarkdownLabel = (value: string) => value.replace(/[\\[\]]/gu, "\\$&");

export const GET: APIRoute = async ({ site }) => {
  if (site === undefined) {
    throw new Error("Astro site configuration is required for llms.txt.");
  }

  const projects = await getCollection("projects");
  const projectLinks = projects
    .toSorted((first, second) => first.id.localeCompare(second.id))
    .map(
      ({ id, data }) =>
        `- [${escapeMarkdownLabel(data.title)}](${new URL(`/projects/${id}/`, site).href}): ${data.summary}`,
    );
  const body = [
    "# 개발자 김용범의 포트폴리오",
    "",
    "> 프론트엔드 구현을 중심으로 프로젝트 결과, 기술 의사결정, 문서화와 자동 검증 과정을 함께 보여주는 웹 개발자 김용범의 포트폴리오입니다.",
    "",
    "프로젝트 상세 페이지에서 역할, 기여 범위, 구현 접근과 공개 근거를 확인할 수 있습니다.",
    "",
    "## 포트폴리오",
    "",
    `- [포트폴리오 홈](${new URL("/", site).href}): 개발자 소개, 프로젝트 목록과 기술 역량.`,
    "",
    "## 프로젝트",
    "",
    ...projectLinks,
    "",
  ].join("\n");

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
