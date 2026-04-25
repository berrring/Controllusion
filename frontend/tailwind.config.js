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
          50: '#f4f6ff',
          100: '#eef2ff',
          200: '#dfe6ff',
          300: '#cfd7ff',
          400: '#8f85ff',
          500: '#6756f5',
          600: '#4c42e8',
          700: '#4339d6',
          800: '#3525cd',
          900: '#261a93',
        },
      },
      boxShadow: {
        soft: '0 20px 34px -24px rgba(76, 66, 232, 0.55)',
        panel: '0 24px 55px -34px rgba(15, 23, 42, 0.16)',
      },
    },
  },
  plugins: [],
};
