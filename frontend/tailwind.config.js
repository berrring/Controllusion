/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Nunito Sans', 'ui-sans-serif', 'system-ui'],
        display: ['Manrope', 'ui-sans-serif', 'system-ui'],
        ui: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        brand: {
          50: '#EEF5FF',
          100: '#DCE9FF',
          200: '#BFD5FF',
          300: '#9CBEFF',
          400: '#77A5FF',
          500: '#5C91FF',
          600: '#4F80FF',
          700: '#3F6AE2',
          800: '#3456B7',
          900: '#2E4A97',
        },
      },
      boxShadow: {
        soft: '0 20px 34px -24px rgba(79, 128, 255, 0.55)',
        panel: '0 24px 55px -34px rgba(15, 23, 42, 0.16)',
      },
    },
  },
  plugins: [],
};
