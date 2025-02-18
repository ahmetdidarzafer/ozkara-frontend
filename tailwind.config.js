/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'playfair': ['Playfair Display', 'serif'],
        'montserrat': ['Montserrat', 'sans-serif'],
      },
      colors: {
        'luxury': {
          50: '#f7f7f7',
          100: '#e3e3e3',
          200: '#c8c8c8',
          300: '#a4a4a4',
          400: '#818181',
          500: '#666666',
          600: '#515151',
          700: '#434343',
          800: '#383838',
          900: '#313131',
          950: '#1a1a1a',
        },
        'gold': {
          100: '#fff7e6',
          200: '#ffe5b3',
          300: '#ffd280',
          400: '#ffc04d',
          500: '#ffad1a',
          600: '#e69500',
          700: '#b37400',
          800: '#805300',
          900: '#4d3200',
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
  ],
} 