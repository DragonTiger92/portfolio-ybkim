type Theme = "dark" | "light";

const themeStorageKey = "portfolio-theme";
const themeButton = document.querySelector<HTMLButtonElement>("[data-theme-toggle]");
const themeColorMeta = document.querySelector<HTMLMetaElement>("[data-theme-color]");
const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
let storedThemePreference: string | undefined;

/* eslint-disable clean-code/warn-depth-two -- Web Storage can throw even when the API exists, so runtime initialization mirrors the pre-paint fallback. */
try {
  storedThemePreference = sessionStorage.getItem(themeStorageKey) ?? undefined;
} catch {
  storedThemePreference = undefined;
}
/* eslint-enable clean-code/warn-depth-two */

let themeOverride = isTheme(storedThemePreference) ? storedThemePreference : undefined;

const themeColors: Record<Theme, string> = {
  dark: "#0d1117",
  light: "#f8fafc",
};

function isTheme(value: string | undefined): value is Theme {
  return value === "dark" || value === "light";
}

function getCurrentTheme(): Theme {
  const currentTheme = document.documentElement.dataset.theme;

  return isTheme(currentTheme) ? currentTheme : getSystemTheme();
}

function getSystemTheme(): Theme {
  return systemTheme.matches ? "dark" : "light";
}

function updateThemeButton(theme: Theme): void {
  if (themeButton === null) {
    return;
  }

  themeButton.setAttribute("aria-pressed", String(theme === "dark"));
}

function renderTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme;
  themeColorMeta?.setAttribute("content", themeColors[theme]);
  updateThemeButton(theme);
}

function applyTheme(theme: Theme): void {
  themeOverride = theme;
  renderTheme(theme);
  sessionStorage.setItem(themeStorageKey, theme);
}

function toggleTheme(): void {
  applyTheme(getCurrentTheme() === "dark" ? "light" : "dark");
}

function followSystemTheme(event: MediaQueryListEvent): void {
  if (themeOverride !== undefined) {
    return;
  }

  renderTheme(event.matches ? "dark" : "light");
}

renderTheme(themeOverride ?? getCurrentTheme());
themeButton?.addEventListener("click", toggleTheme);
systemTheme.addEventListener("change", followSystemTheme);
