/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        xs: '0 0 1px rgba(0, 0, 0, 0.03)', // ultra-light custom shadow
      },
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
  
}
