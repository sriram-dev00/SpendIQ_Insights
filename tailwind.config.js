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
        base: 'var(--bg-base)',
        surface: {
          DEFAULT: 'var(--bg-surface)',
          alt: 'var(--bg-surface-alt)',
          card: 'var(--bg-surface-card)',
          elevated: 'var(--bg-surface-elevated)',
          border: 'var(--border-color)',
          hover: 'var(--bg-surface-hover)',
        },
        brand: {
          primary: '#00FF00',
          deep: '#00FF00',
          secondary: '#00CC00',
          light: '#33FF33',
          dim: 'var(--brand-dim)',
          text: 'var(--brand-text)',
        },
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
          dim: 'var(--text-dim)',
        },
        accent: {
          income: '#00AA00',
          expense: '#D32F2F',
          savings: '#0066CC',
          investment: '#6B21A8',
          budget: '#D97706',
          goal: '#00AA00',
        }
      },
      borderRadius: {
        none: '0px',
        sm: '2px',
        DEFAULT: '4px',
        md: '6px',
        lg: '8px',
        xl: '8px',
        '2xl': '8px',
      },
      fontFamily: {
        sans: ['Space Grotesk', 'Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'Courier New', 'monospace'],
      },
      boxShadow: {
        'none': 'none',
        'glow-sm': '0 0 0 1px #00FF00',
        'glow-md': '0 0 0 2px #00FF00',
        'card': 'none',
        'retro': '2px 2px 0px 0px var(--border-color)',
        'focus': '0 0 0 2px #00FF00',
      }
    },
  },
  plugins: [],
}
