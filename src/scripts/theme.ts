type Theme = "dark" | "light";

const themeButton = document.querySelector<HTMLButtonElement>("[data-theme-toggle]");

function isTheme(value: string | undefined): value is Theme {
  return value === "dark" || value === "light";
}

function getCurrentTheme(): Theme {
  const currentTheme = document.documentElement.dataset.theme;

  return isTheme(currentTheme) ? currentTheme : "light";
}

function updateThemeButton(theme: Theme): void {
  if (themeButton === null) {
    return;
  }

  const label = themeButton.querySelector<HTMLElement>("[data-theme-label]");
  const nextThemeLabel = theme === "dark" ? "라이트 모드" : "다크 모드";

  themeButton.setAttribute("aria-pressed", String(theme === "dark"));

  if (label !== null) {
    label.textContent = nextThemeLabel;
  }
}

function applyTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem("portfolio-theme", theme);
  updateThemeButton(theme);
}

function toggleTheme(): void {
  applyTheme(getCurrentTheme() === "dark" ? "light" : "dark");
}

updateThemeButton(getCurrentTheme());
themeButton?.addEventListener("click", toggleTheme);
