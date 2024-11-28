// src/components/ThemeToggleButton.tsx
"use client";

import useTheme from "../hooks/useTheme";

export default function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme();

  return (
    <span
      onClick={toggleTheme}
      className="p-6 rounded-full h-2 flex border items-center justify-center border-gray-300 dark:border-zinc-600 cursor-pointer"
    >
      {theme === "light" ? (
        <span className="text-gray-900">🌞 Ligth mode</span>
      ) : (
        <span className="text-gray-100">🌙 Dark mode</span>
      )}
    </span>
  );
}
