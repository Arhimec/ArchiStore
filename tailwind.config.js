/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: "#0b1329",
          800: "#131d38",
          700: "#1c2b4f",
          600: "#273b6b",
        },
        amber: {
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
        },
        bronze: {
          400: "#fbbf24",
          500: "#d97706",
          600: "#92400e",
        }
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};
