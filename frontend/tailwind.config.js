/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#FC4C02',
          ui:      '#FC5200',
          hover:   '#CC4200',
          light:   '#FFF0EA',
        },
        surface: '#F0F0F5',
        success: '#1DB954',
        text: {
          primary:   '#242428',
          secondary: '#999999',
        }
      }
    }
  },
  plugins: [],
}
