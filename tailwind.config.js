const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      width: {
        'w-fit': 'fit-content',
      },
      fontFamily: {
        popins: ['Popins'],
      },
    },
    screens: {
      xs: '320px',
      ...defaultTheme.screens,
    },
  },

  plugins: [require('@tailwindcss/forms')],
}
