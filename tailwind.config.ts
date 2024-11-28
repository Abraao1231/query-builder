import type { Config } from "tailwindcss";

export default {
  darkMode: 'class',  // Isso garante que a alternância de temas use a classe "dark"

  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        darkBackground: '#1e293b',
        darkForeground: '#334155',
        darkText: '#f1f5f9',
        darkBorder: '#475569',
      },
    },
  },
  plugins: [],
} satisfies Config;
