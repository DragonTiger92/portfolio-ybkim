(() => {
  const savedTheme = localStorage.getItem("portfolio-theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const systemTheme = prefersDark ? "dark" : "light";
  const theme = savedTheme === "dark" || savedTheme === "light" ? savedTheme : systemTheme;
  const themeColor = theme === "dark" ? "#0d1117" : "#f8fafc";

  document.documentElement.dataset.theme = theme;
  document.querySelector("[data-theme-color]")?.setAttribute("content", themeColor);
})();
