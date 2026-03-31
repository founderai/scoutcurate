/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        scout:   ["'Nunito'", "sans-serif"],
        curate:  ["'Playfair Display'", "serif"],
        sans:    ["'Inter'", "sans-serif"],
      },
      colors: {
        scout: {
          primary: "#FF6B35",
          light:   "#FFF3ED",
          dark:    "#CC4A1A",
          subtle:  "#FFF0E8",
        },
        curate: {
          primary: "#0F3D2E",
          gold:    "#C6A75E",
          bg:      "#F5F1EB",
          card:    "#FFFFFF",
          subtle:  "#EDE9E2",
          muted:   "#6B6359",
          border:  "#DDD6CC",
        },
        "rose-gold": {
          DEFAULT: "#B76E79",
          light:   "#F5E6E8",
          dark:    "#9A5560",
          muted:   "#D4A0A8",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
}
