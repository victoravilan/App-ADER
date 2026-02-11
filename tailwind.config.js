/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ader-blue': '#0057b8',
        'ader-green': '#4CAF50',
        'ader-light-green': '#81C784',
        'background-light': '#F5F5F5',
        'text-light': '#333333',
      },
      fontFamily: {
        sans: ['"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}