const autoprefixer = require('autoprefixer');
const tailwindcss = require('tailwindcss');

/** @type {import('postcss').Config} */
module.exports = {
  plugins: [
    tailwindcss,
    autoprefixer,
  ],
} 