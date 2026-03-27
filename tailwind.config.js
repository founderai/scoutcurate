/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  darkMode: "class",
  content: ["./**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        scout: ["'Nunito'", "sans-serif"],
        curate: ["'Playfair Display'", "serif"],
      },
      colors: {
        scout: {
          primary: "#FF6B35",
          secondary: "#FFD166",
          bg: "#FFF9F0",
          card: "#FFFFFF",
          accent: "#06D6A0",
        },
        curate: {
          primary: "#C9A84C",
          secondary: "#2D2D2D",
          bg: "#1A1A1A",
          card: "#252525",
          accent: "#E8D5A3",
          muted: "#888888",
        },
      },
      animation: {
        pulse_slow: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "spin-slow": "spin 3s linear infinite",
      },
    },
  },
  plugins: [],
}
