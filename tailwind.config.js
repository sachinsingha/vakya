/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", // Enable dark mode via class
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        "fade-in": "fadeIn 1s ease-in-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
      },
      colors: {
        // Optional: custom colors
        gpt: "#60a5fa",
        llama: "#4ade80",
        gemini: "#f472b6",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
      },
    },
  },
  plugins: [
    // Example:
    // require('@tailwindcss/forms'),
    // require('@tailwindcss/typography'),
  ],
};
