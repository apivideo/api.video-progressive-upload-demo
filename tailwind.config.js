const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  purge: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './screens/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},

    // https://chir.ag/projects/name-that-color/
    colors: {
      white: '#ffffff',
      'firefly-light': '#091429',
      firefly: '#060c19',
      lavenderGray: '#c3b8d8',
      fiord: '#414f6e',
      periwinkle: '#d1ceff'
    },

    fontFamily: {
      body: ['Inter', 'sans-serif']
    },

    fontSize: {
      ...defaultTheme.fontSize,
      '3xl-2': '2em'
    }
  },
  variants: {
    extend: {}
  },
  plugins: [require('@tailwindcss/aspect-ratio')]
};
