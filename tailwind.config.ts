import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: {
          50: "#fbfbf7",
          100: "#f6f3ea",
          200: "#efe7d8",
          300: "#e6d9c4",
          400: "#d7c7a8",
          500: "#c8b28a"
        },
        mint: {
          50: "#f0fbf7",
          100: "#dbf4ed",
          200: "#b6e7dc",
          300: "#8dd7c9",
          400: "#66c2b2",
          500: "#3aa79a",
          600: "#2a8b80"
        },
        tealsoft: {
          50: "#f2fbfb",
          100: "#dcf3f3",
          200: "#b7e6e7",
          300: "#8dd5d7",
          400: "#63bec2",
          500: "#3c9ca1",
          600: "#2a7c82"
        },
        ink: {
          700: "#2b2f2e",
          800: "#202423",
          900: "#151918"
        }
      },
      boxShadow: {
        soft: "0 10px 30px rgba(20, 30, 25, 0.08)",
        card: "0 12px 32px rgba(18, 28, 24, 0.12)"
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        }
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out"
      },
      borderRadius: {
        xl: "1.25rem",
        "2xl": "1.5rem",
        "3xl": "2rem"
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-sans-serif"],
        body: ["var(--font-body)", "ui-sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular"]
      }
    }
  },
  plugins: []
};

export default config;
