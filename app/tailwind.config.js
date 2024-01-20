/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      aspectRatio: {
        "2/3": "2 / 3"
      }
    }
  },
  plugins: []
};
