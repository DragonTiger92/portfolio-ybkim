const portfolioThemeStorageKey = "portfolio-theme";
let portfolioSavedTheme;

/* eslint-disable clean-code/warn-depth-two -- Web Storage can throw even when the API exists, and the pre-paint fallback must stay synchronous. */
try {
  portfolioSavedTheme = sessionStorage.getItem(portfolioThemeStorageKey);
} catch {
  portfolioSavedTheme = null;
}
/* eslint-enable clean-code/warn-depth-two */

const portfolioPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
const portfolioSystemTheme = portfolioPrefersDark ? "dark" : "light";
const portfolioTheme =
  portfolioSavedTheme === "dark" || portfolioSavedTheme === "light"
    ? portfolioSavedTheme
    : portfolioSystemTheme;
const portfolioThemeColor = portfolioTheme === "dark" ? "#0d1117" : "#f8fafc";

document.documentElement.dataset.theme = portfolioTheme;
document.querySelector("[data-theme-color]")?.setAttribute("content", portfolioThemeColor);
