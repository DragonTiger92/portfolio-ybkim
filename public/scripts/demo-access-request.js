(() => {
  function getDialogElements() {
    const dialog = document.querySelector("#demo-access-dialog");

    if (!dialog) return undefined;

    const continueLink = dialog.querySelector("[data-demo-access-continue]");
    const copyButton = dialog.querySelector("[data-demo-access-copy]");
    const template = dialog.querySelector("#demo-request-template");
    const status = dialog.querySelector("[data-demo-access-status]");

    if (!continueLink || !copyButton || !template || !status) return undefined;

    return { continueLink, copyButton, dialog, status, template };
  }

  function hasNavigationOverride(event) {
    return event.button !== 0 || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey;
  }

  function openRequestDialog(event, trigger, elements) {
    if (hasNavigationOverride(event) || typeof elements.dialog.showModal !== "function") return;

    const url = new URL(trigger.href);

    event.preventDefault();
    elements.template.value = [
      `받는 사람: ${url.searchParams.get("to") ?? ""}`,
      `제목: ${url.searchParams.get("su") ?? ""}`,
      "",
      url.searchParams.get("body") ?? "",
    ].join("\n");
    elements.status.textContent = "";
    elements.continueLink.href = trigger.href;
    elements.dialog.showModal();
  }

  function showCopyFailure(elements) {
    elements.template.focus();
    elements.template.select();
    elements.status.textContent = "복사하지 못했습니다. 선택된 양식을 직접 복사해 주세요.";
  }

  function copyRequestTemplate(elements) {
    Promise.resolve()
      .then(() => navigator.clipboard.writeText(elements.template.value))
      .then(
        () => {
          elements.status.textContent = "메일 양식을 복사했습니다.";
        },
        () => showCopyFailure(elements),
      );
  }

  const elements = getDialogElements();

  if (!elements) return;

  document.querySelectorAll("[data-demo-access-trigger]").forEach((trigger) => {
    trigger.addEventListener("click", (event) => openRequestDialog(event, trigger, elements));
  });
  elements.continueLink.addEventListener("click", () => elements.dialog.close());
  elements.copyButton.addEventListener("click", () => copyRequestTemplate(elements));
})();
