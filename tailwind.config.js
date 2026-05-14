/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#121212',
          light: '#1A1A1A',
          lighter: '#222222'
        },
        accent: {
          gold: '#D4AF37',
          blue: '#3B82F6', // Muted further with opacity in usage
        },
        text: {
          DEFAULT: '#FFFFFF',
          muted: '#A1A1AA'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'premium': '0 4px 30px rgba(0, 0, 0, 0.5)',
        'card': '0 10px 40px rgba(0, 0, 0, 0.3)'
      }
    },
  },
  plugins: [],
}
