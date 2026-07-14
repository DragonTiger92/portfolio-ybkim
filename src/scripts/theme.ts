type Theme = "dark" | "light";

const themeButton = document.querySelector<HTMLButtonElement>("[data-theme-toggle]");
const themeColorMeta = document.querySelector<HTMLMetaElement>("[data-theme-color]");
const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");

const themeColors: Record<Theme, string> = {
  dark: "#0d1117",
  light: "#f8fafc",
};

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

function renderTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme;
  themeColorMeta?.setAttribute("content", themeColors[theme]);
  updateThemeButton(theme);
}

function applyTheme(theme: Theme): void {
  renderTheme(theme);
  localStorage.setItem("portfolio-theme", theme);
}

function toggleTheme(): void {
  applyTheme(getCurrentTheme() === "dark" ? "light" : "dark");
}

function followSystemTheme(event: MediaQueryListEvent): void {
  if (isTheme(localStorage.getItem("portfolio-theme") ?? undefined)) {
    return;
  }

  renderTheme(event.matches ? "dark" : "light");
}

updateThemeButton(getCurrentTheme());
themeButton?.addEventListener("click", toggleTheme);
systemTheme.addEventListener("change", followSystemTheme);
