/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,tsx}', './components/**/*.{js,ts,tsx}'],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {},
    colors: {
      primary: '#59A60E',
      secondary: {
        DEFAULT: '#FFC303',
        100: '#fcc81e',
        200: '#ffaf03',
      },
      black: {
        DEFAULT: '#080807',
        100: '#301616',
        200: '#291414',
      },
      gray: {
        100: '#91919F',
        200: '#333333',
      },
      off: {
        100: '#FBF6EE',
      },
      white: {
        DEFAULT: '#FFFFFF',
      },
    },
    fontFamily: {
      pthin: ['Poppins-Thin', 'sans-serif'],
      pextralight: ['Poppins-ExtraLight', 'sans-serif'],
      plight: ['Poppins-Light', 'sans-serif'],
      pregular: ['Poppins-Regular', 'sans-serif'],
      pmedium: ['Poppins-Medium', 'sans-serif'],
      psemibold: ['Poppins-SemiBold', 'sans-serif'],
      pbold: ['Poppins-Bold', 'sans-serif'],
      pextrabold: ['Poppins-ExtraBold', 'sans-serif'],
      pblack: ['Poppins-Black', 'sans-serif'],
    },
  },
  plugins: [],
};
