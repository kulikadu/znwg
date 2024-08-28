/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{html,vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      backgroundColor: {
        'custom-color': '#2f9bf8', // 自定义颜色
        'custom-dark': '#4a4a4a' // 另一个自定义颜色
      }
    }
  },
  plugins: []
}
