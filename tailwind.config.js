module.exports = {
  mode: 'jit',
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: {
          200: '#6D94CE',
          300: '#1A84DD',
          500: '#0E1235',
          700: '#050A1B',
        },
        secondary: {
          50: '#fefdf7',
          100: '#fefaef',
          200: '#fcf3d8',
          300: '#faecc1',
          400: '#f6dd92',
          500: '#f2cf63',
          600: '#daba59',
          700: '#b69b4a',
          800: '#917c3b',
          900: '#776531',
        },
        tertiary: {
          50: '#fff4f7',
          100: '#ffe8ef',
          200: '#ffc7d6',
          300: '#ffa5bd',
          400: '#fe618c',
          500: '#fe1d5b',
          600: '#e51a52',
          700: '#bf1644',
          800: '#981137',
          900: '#7c0e2d',
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
