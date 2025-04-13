/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // 👈 ensures all your components are scanned
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}