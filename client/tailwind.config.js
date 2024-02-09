/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      aspectRatio: {
        "2/3": "2 / 3"
      },
      keyframes: {
        "slide-up": {
          from: { bottom: "-100%" },
          to: { bottom: "0" }
        }
      },
      animation: {
        "slide-up": "slide-up .7s ease-in-out"
      }
    }
  },
  plugins: []
};
