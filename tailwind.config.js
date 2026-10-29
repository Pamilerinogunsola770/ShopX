/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          orange: '#f97316',
          red: '#ef4444',
          ink: '#111111',
        },
      },
      boxShadow: {
        glass: '0 18px 48px rgba(17, 17, 17, 0.12)',
      },
    },
  },
  plugins: [],
}
