module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
      },
      screens: {
        'sm': '640px', // @media (min-width: 640px)
        'md': '768px', // @media (min-width: 768px)
        'lg': '1024px', // @media (min-width: 1024px)
        'xl': '1280px', // @media (min-width: 1280px)
        '2xl': '1536px', // @media (min-width: 1536px)
      }
    }
  },
  variants: {
    extend: {
      ringWidth: ['hover','group-hover', 'active'],
      ringColor: ['hover', 'active'],
      backgroundColor: ['responsive', 'hover','group-hover', 'focus', 'active'],
      animation: ['hover', 'focus','responsive','group-hover', 'motion-safe', 'motion-reduce'],
      cursor: ['hover', 'focus'],
    },
  },
  plugins: [],
}
