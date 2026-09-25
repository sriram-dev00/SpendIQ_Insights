/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        base: '#050505',
        surface: {
          DEFAULT: '#080A09',
          alt: '#0D0F0E',
          card: '#101412',
          border: '#1A211D',
          hover: '#161C19',
        },
        brand: {
          primary: '#00D084',
          deep: '#003D2B',
          secondary: '#006B45',
          light: '#33E09E',
          dim: '#002B1E',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#E2E8F0',
          muted: '#A7ADA9',
          dim: '#64748B',
        },
        accent: {
          income: '#10B981',
          expense: '#F43F5E',
          savings: '#0EA5E9',
          investment: '#A855F7',
          budget: '#F59E0B',
          goal: '#14B8A6',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'glow-sm': '0 0 15px -3px rgba(0, 208, 132, 0.15)',
        'glow-md': '0 0 25px -5px rgba(0, 208, 132, 0.25)',
        'card': '0 4px 20px -2px rgba(0, 0, 0, 0.5)',
      }
    },
  },
  plugins: [],
}
