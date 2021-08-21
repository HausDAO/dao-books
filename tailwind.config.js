// eslint-disable-next-line @typescript-eslint/no-var-requires
module.exports = {
  mode: 'jit',
  purge: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f4f9fd',
          100: '#e8f3fc',
          200: '#c6e0f7',
          300: '#a3cef1',
          400: '#5fa9e7',
          500: '#1a84dd',
          600: '#1777c7',
          700: '#1463a6',
          800: '#104f85',
          900: '#0d416c',
        },
      },
    },
  },
  variants: {
    extend: {},
  },
}
