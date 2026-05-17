/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2D6A4F',
          dark: '#1B4332',
        },
        secondary: '#52B788',
        accent: '#F4A261',
        background: '#F8F9FA',
        card: '#FFFFFF',
        text: {
          main: '#1A1A2E',
          muted: '#6C757D'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 2px 16px rgba(0,0,0,0.08)',
      }
    },
  },
  plugins: [],
}
