/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cacao: {
          950: '#1B120D', // roasted cacao, fondo principal
          900: '#241811',
          800: '#2E2016',
          700: '#4A3323',
          600: '#6B4A30',
          500: '#8B5E34',
        },
        gold: {
          400: '#D9B679',
          500: '#C89B5C', // acento tostado
          600: '#A87D42',
        },
        cream: {
          50: '#FBF8F3',
          100: '#F5EFE6',
          200: '#E8DCC8',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Work Sans"', 'sans-serif'],
      },
      letterSpacing: {
        widest2: '0.25em',
      },
    },
  },
  plugins: [],
}
