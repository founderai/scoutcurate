/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        scout: ["'Nunito'", "sans-serif"],
        curate: ["'Playfair Display'", "serif"],
        sans: ["'Inter'", "sans-serif"],
      },
      colors: {
        scout: {
          primary: "#FF6B35",
          light: "#FFF3ED",
          dark: "#CC4A1A",
        },
        curate: {
          primary: "#C9A84C",
          bg: "#1A1A1A",
          card: "#252525",
          accent: "#E8D5A3",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
}
