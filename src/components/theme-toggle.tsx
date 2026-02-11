"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

function applyTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem("blog-theme", theme);
}

export function ThemeToggle(): JSX.Element {
  const [theme, setTheme] = useState<Theme>("light");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("blog-theme");
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const nextTheme: Theme = stored === "dark" || stored === "light" ? stored : systemDark ? "dark" : "light";

    setTheme(nextTheme);
    applyTheme(nextTheme);
    setReady(true);
  }, []);

  const onToggle = (): void => {
    const nextTheme: Theme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    applyTheme(nextTheme);
  };

  return (
    <button type="button" className="action-button" onClick={onToggle} aria-label="切换主题" disabled={!ready}>
      {theme === "light" ? "深色" : "浅色"}
    </button>
  );
}
