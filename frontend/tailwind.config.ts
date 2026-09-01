import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // DECORUM navy — the dominant brand color (CSS-variable driven for themes)
        brand: {
          50: "hsl(var(--brand-50) / <alpha-value>)",
          100: "hsl(var(--brand-100) / <alpha-value>)",
          200: "hsl(var(--brand-200) / <alpha-value>)",
          300: "hsl(var(--brand-300) / <alpha-value>)",
          400: "hsl(var(--brand-400) / <alpha-value>)",
          500: "hsl(var(--brand-500) / <alpha-value>)",
          600: "hsl(var(--brand-600) / <alpha-value>)",
          700: "hsl(var(--brand-700) / <alpha-value>)",
          800: "hsl(var(--brand-800) / <alpha-value>)",
          900: "hsl(var(--brand-900) / <alpha-value>)",
          950: "hsl(var(--brand-950) / <alpha-value>)",
        },
        // DECORUM strong red — used sparingly for CTAs/highlights
        accent: {
          50: "hsl(var(--accent-50) / <alpha-value>)",
          100: "hsl(var(--accent-100) / <alpha-value>)",
          200: "hsl(var(--accent-200) / <alpha-value>)",
          300: "hsl(var(--accent-300) / <alpha-value>)",
          400: "hsl(var(--accent-400) / <alpha-value>)",
          500: "hsl(var(--accent-500) / <alpha-value>)",
          600: "hsl(var(--accent-600) / <alpha-value>)",
          700: "hsl(var(--accent-700) / <alpha-value>)",
          800: "hsl(var(--accent-800) / <alpha-value>)",
          900: "hsl(var(--accent-900) / <alpha-value>)",
        },
        // Theme-aware page background (white in light, deep navy in dark)
        surface: "hsl(var(--surface) / <alpha-value>)",
        // Theme-aware primary text (navy in light, near-white in dark)
        ink: "hsl(var(--ink) / <alpha-value>)",
      },
      boxShadow: {
        card: "0 1px 2px rgba(10, 28, 66, 0.06), 0 4px 16px rgba(10, 28, 66, 0.06)",
        "card-hover": "0 2px 4px rgba(10, 28, 66, 0.08), 0 12px 32px rgba(10, 28, 66, 0.12)",
        soft: "0 4px 24px rgba(10, 28, 66, 0.10)",
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
      },
      letterSpacing: {
        tightest: "-0.03em",
      },
    },
  },
  plugins: [],
};
export default config;