const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  purge: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './screens/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      keyframes: {
        // https://www.florin-pop.com/blog/2019/03/css-pulse-effect/
        'pulse-shadow-cranberry': {
          '0%': {
            transform: 'scale(0.95)',
            'box-shadow': '0 0 0 0 rgba(221, 85, 121, 0.7)'
          },
          '70%': {
            transform: 'scale(1)',
            'box-shadow': '0 0 0 10px rgba(221, 85, 121, 0)'
          },
          '100%': {
            transform: 'scale(0.95)',
            'box-shadow': '0 0 0 0 rgba(221, 85, 121, 0)'
          }
        },
        'pulse-shadow-lavenderGray': {
          '0%': {
            transform: 'scale(0.95)',
            'box-shadow': '0 0 0 0 rgba(195, 184, 216, 0.7)'
          },
          '70%': {
            transform: 'scale(1)',
            'box-shadow': '0 0 0 10px rgba(195, 184, 216, 0)'
          },
          '100%': {
            transform: 'scale(0.95)',
            'box-shadow': '0 0 0 0 rgba(195, 184, 216, 0)'
          }
        }
      },
      animation: {
        'pulse-shadow-cranberry': 'pulse-shadow-cranberry 2s infinite',
        'pulse-shadow-lavenderGray': 'pulse-shadow-lavenderGray 2s infinite'
      }
    },

    // https://chir.ag/projects/name-that-color/
    colors: {
      white: '#ffffff',
      fiord: '#414f6e',
      lavenderGray: '#c3b8d8',
      firefly: '#060c19',
      'firefly-light': '#091429',
      periwinkle: '#d1ceff',
      outrageousOrange: '#fa5b30',
      botticelli: '#d9e1ec',

      seance: '#7c15b3',
      cranberry: '#dd5579',
      bittersweet: '#ff6b65',
      cerise: '#dd3b83'
    },

    stroke: (theme) => ({
      fiord: theme('colors.fiord')
    }),

    fontFamily: {
      body: ['Inter', 'sans-serif']
    },

    fontSize: {
      ...defaultTheme.fontSize,
      '3xl-2': '2em'
    },

    backgroundSize: {
      'w-screen': '100vw'
    }
  },
  variants: {
    extend: {}
  },
  plugins: [require('@tailwindcss/aspect-ratio')]
};
