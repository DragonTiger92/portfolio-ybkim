const copyEmailButton = document.querySelector<HTMLButtonElement>("[data-copy-email]");
const copyEmailStatus = document.querySelector<HTMLElement>("[data-copy-email-status]");

function writeEmailToClipboard(email: string): Promise<boolean> {
  return Promise.resolve()
    .then(() => navigator.clipboard.writeText(email))
    .then(
      () => true,
      () => false,
    );
}

async function copyEmail(): Promise<void> {
  const email = copyEmailButton?.dataset.email;

  if (!email || !copyEmailStatus) {
    return;
  }

  const didCopy = await writeEmailToClipboard(email);

  copyEmailStatus.textContent = didCopy
    ? "이메일 주소를 복사했습니다."
    : "자동 복사를 사용할 수 없습니다. 표시된 이메일 주소를 직접 복사해 주세요.";
}

copyEmailButton?.addEventListener("click", copyEmail);
