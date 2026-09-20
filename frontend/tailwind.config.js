/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          blue: '#00f3ff',
          purple: '#bc13fe',
          green: '#00ff66'
        },
        dark: {
          bg: '#0a0a0f',
          surface: '#12121a',
          card: 'rgba(255, 255, 255, 0.03)'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 10px #00f3ff, 0 0 20px #00f3ff' },
          '100%': { boxShadow: '0 0 20px #bc13fe, 0 0 30px #bc13fe' }
        }
      }
    },
  },
  plugins: [],
}
