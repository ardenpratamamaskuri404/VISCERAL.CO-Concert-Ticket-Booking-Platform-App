/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        obsidian: {
          DEFAULT: '#14110F',
          dark: '#0D0B0A',
          card: '#1A1613',
          surface: '#241F1C',
          border: '#332C28'
        },
        gold: {
          DEFAULT: '#C89B3C',
          light: '#F0CE7A',
          dark: '#9C7A2E',
          glow: 'rgba(200, 155, 60, 0.25)'
        },
        oxblood: {
          DEFAULT: '#7A2E2E',
          dark: '#4A1B1B',
          light: '#9E3B3B',
          muted: '#542020'
        },
        brand: {
          darkText: '#211D1A',
          lightText: '#F3EFE9',
          bgLight: '#FAFAFA',
          cardLight: '#FFFFFF'
        }
      },
      fontFamily: {
        sans: ['Inter', 'Poppins', 'sans-serif'],
      },
      boxShadow: {
        'gold-glow': '0 0 25px -5px rgba(200, 155, 60, 0.3)',
        'obsidian-glow': '0 10px 30px -5px rgba(20, 17, 15, 0.15)',
        'oxblood-glow': '0 0 20px -5px rgba(122, 46, 46, 0.4)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      }
    },
  },
  plugins: [],
}
