const copyEmailButton = document.querySelector<HTMLButtonElement>("[data-copy-email]");
const copyEmailStatus = document.querySelector<HTMLElement>("[data-copy-email-status]");
const copyEmailFeedbackDuration = 3000;

let copyEmailStatusTimeout: number | undefined;
let latestCopyRequestId = 0;

function writeEmailToClipboard(email: string): Promise<boolean> {
  return Promise.resolve()
    .then(() => navigator.clipboard.writeText(email))
    .then(
      () => true,
      () => false,
    );
}

function cancelCopyEmailStatusTimeout(): void {
  if (copyEmailStatusTimeout === undefined) {
    return;
  }

  window.clearTimeout(copyEmailStatusTimeout);
  copyEmailStatusTimeout = undefined;
}

function showCopyEmailStatus(message: string): void {
  if (!copyEmailStatus) {
    return;
  }

  cancelCopyEmailStatusTimeout();
  copyEmailStatus.textContent = message;
  copyEmailStatusTimeout = window.setTimeout(() => {
    copyEmailStatus.textContent = "";
    copyEmailStatusTimeout = undefined;
  }, copyEmailFeedbackDuration);
}

async function copyEmail(): Promise<void> {
  const email = copyEmailButton?.dataset.email;

  if (!email || !copyEmailStatus) {
    return;
  }

  const copyRequestId = ++latestCopyRequestId;

  cancelCopyEmailStatusTimeout();

  const didCopy = await writeEmailToClipboard(email);

  if (copyRequestId !== latestCopyRequestId) {
    return;
  }

  showCopyEmailStatus(
    didCopy
      ? "이메일 주소를 복사했습니다."
      : "자동 복사를 사용할 수 없습니다. 표시된 이메일 주소를 직접 복사해 주세요.",
  );
}

copyEmailButton?.addEventListener("click", copyEmail);
