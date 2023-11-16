/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./dist/index.html", "./dist/assets/**/*.{css,js}"],
  theme: {
    extend: {
      colors: {
        'main-blue': '#748cf1',
        'main-gray': '#efefef',
        'white': '#fff',
        'smoke-white': '#eaeaea',
        'load-blue': "#2c3e50",
      }
    },
    screens: {
      'lg': '992px'
    },
    keyframes:{
      loaderAnimate: {
        '0%':{
          boxShadow: '-72px 0 white inset'
        },
        '100%':{
          boxShadow: '48px 0 white inset'
        },
      }
    },
    animation:{
      loaderAnimate:'loaderAnimate 1s linear infinite'
    }
  },
  plugins: [],
}

