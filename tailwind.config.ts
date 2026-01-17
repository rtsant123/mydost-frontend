import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          50: "#f5f7fb",
          100: "#e9edf6",
          200: "#cfd8ea",
          300: "#b4c2de",
          400: "#8e9fc8",
          500: "#6b7eb3",
          600: "#51619b",
          700: "#3b4779",
          800: "#2b3457",
          900: "#1c223b"
        }
      },
      boxShadow: {
        card: "0 10px 30px -20px rgba(15, 23, 42, 0.35)"
      }
    }
  },
  plugins: []
};

export default config;
