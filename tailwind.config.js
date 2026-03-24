/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
municipal: {
          blue: {
            50: '#eff6ff',
            500: '#1e40af',
            600: '#1d4ed8',
            900: '#1e3a8a'
          }
        }
      }
    },
  },
  plugins: [],
}
