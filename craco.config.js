// https://resir014.xyz/posts/2019/03/13/using-typescript-absolute-paths-in-cra-20
const path = require('path')

module.exports = {
  webpack: {
    alias: {
      // Another example for using a wildcard character
      '@': path.resolve(__dirname, './src/'),
    },
  },
  style: {
    postcss: {
      plugins: [require('tailwindcss'), require('autoprefixer')],
    },
  },
}
