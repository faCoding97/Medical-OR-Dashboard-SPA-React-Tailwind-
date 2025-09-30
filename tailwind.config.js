/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        medic: {
          base: "#0b1220",
          mint: "#49E1B8",
          pulse: "#F43F5E",
          grid: "#0C1A2B",
        },
      },
      boxShadow: {
        glow: "0 0 40px rgba(73, 225, 184, .25)",
      },
    },
  },
  plugins: [],
};
