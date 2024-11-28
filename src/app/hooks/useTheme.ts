// src/app/hooks/useTheme.ts

import { useEffect, useState } from "react";

export default function useTheme() {
  // Define o estado inicial baseado no localStorage ou no tema claro por padrão
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") || "light"; // Padrão é "light"
    }
    return "light"; // No servidor, use 'light' como fallback
  });

  useEffect(() => {
    // Aplica o tema na tag <html>
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return { theme, toggleTheme };
}
