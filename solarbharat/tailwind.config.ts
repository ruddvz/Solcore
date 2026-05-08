import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        sb: {
          bg: '#0a0f1e',
          surface: '#0d1a2e',
          accent: '#071a0e',
          gold: '#fbbf24',
          goldDark: '#f59e0b',
          green: '#22c55e',
          greenDark: '#16a34a',
          greenMuted: '#86efac',
          orange: '#f97316',
          red: '#ef4444',
          blue: '#0ea5e9',
          purple: '#8b5cf6',
          grey: '#6b7280',
        },
      },
      fontFamily: {
        sans: ['var(--font-dm)', 'Segoe UI', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Roboto', 'sans-serif'],
        heading: ['var(--font-syne)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jb-mono)', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
    },
  },
  plugins: [],
}
export default config
