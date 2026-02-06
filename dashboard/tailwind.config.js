/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#0a0e14',
        'bg-secondary': '#141922',
        'bg-tertiary': '#1a1f2e',
        'accent-green': '#00ff88',
        'accent-red': '#ff3366',
        'accent-blue': '#00d4ff',
        'accent-yellow': '#ffbb00',
        'text-primary': '#e0e6ed',
        'text-secondary': '#8892a6',
        'border-color': '#2d3748',
        // Keeping original aegis colors just in case
        aegis: {
          900: '#0a0a0a',
          800: '#171717',
          700: '#262626',
          accent: '#ef4444',
          success: '#10b981',
          warning: '#f59e0b',
        }
      },
      fontFamily: {
        'tactical': ['Rajdhani', 'sans-serif'],
        'mono': ['Roboto Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
