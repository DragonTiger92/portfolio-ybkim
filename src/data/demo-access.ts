import { createGmailComposeUrl } from "./contact";

const requestSubjectPrefix = "[Portfolio Demo Access]";

function createRequestBody(projectTitle: string): string {
  return [
    "안녕하세요, 김용범 님.",
    "",
    `${projectTitle} 데모 검토를 위한 테스트 계정을 요청드립니다.`,
    "",
    "소속 / 채용 포지션 (선택):",
    "검토 종료 예정일 (선택, 미입력 시 7일):",
    "보안 링크 암호를 받을 별도 연락 채널 (선택, 전달 전 협의 가능):",
    "",
    "테스트 계정은 채용 검토 목적으로만 사용하겠습니다.",
  ].join("\n");
}

export function createDemoAccessRequestUrl(projectTitle: string): string {
  return createGmailComposeUrl({
    body: createRequestBody(projectTitle),
    subject: `${requestSubjectPrefix} ${projectTitle}`,
  });
}
