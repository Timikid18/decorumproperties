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
        // DECORUM navy — the dominant brand color (logo blue)
        brand: {
          50: "#EEF3FB",
          100: "#DCE6F7",
          200: "#B5CBEE",
          300: "#88AADF",
          400: "#5480C4",
          500: "#2E55A6",
          600: "#1F4189",
          700: "#163270",
          800: "#0F2657",
          900: "#0A1C42",
          950: "#061229",
        },
        // DECORUM strong red — used sparingly for CTAs/highlights
        accent: {
          50: "#FEF2F3",
          100: "#FDE3E6",
          200: "#FBC5CB",
          300: "#F79AA5",
          400: "#F06070",
          500: "#E13342",
          600: "#C81E2E",
          700: "#A81724",
          800: "#8B1621",
          900: "#741820",
        },
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