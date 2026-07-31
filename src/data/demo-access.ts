import { createGmailComposeUrl } from "./contact";

const requestSubjectPrefix = "[Portfolio Demo Access]";

function createRequestBody(projectTitle: string): string {
  return [
    "안녕하세요, 김용범 님.",
    "",
    `${projectTitle} 데모 계정을 요청드립니다.`,
    "",
    "소속 / 채용 포지션:",
    "검토 종료일 (기본 7일):",
    "암호 수신 연락처:",
    "",
    "채용 검토에만 사용하겠습니다.",
  ].join("\n");
}

export function createDemoAccessRequest(projectTitle: string) {
  const subject = `${requestSubjectPrefix} ${projectTitle}`;
  const body = createRequestBody(projectTitle);

  return {
    gmailUrl: createGmailComposeUrl({ body, subject }),
  } as const;
}
