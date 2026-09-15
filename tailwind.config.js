/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        command: {
          950: '#070b14',
          900: '#0c1322',
          850: '#111a2e',
          800: '#17233d',
          700: '#233354',
          600: '#344b75',
        },
        risk: {
          low: '#10b981',       // Emerald
          moderate: '#f59e0b',  // Amber
          high: '#f97316',      // Orange
          critical: '#ef4444',  // Crimson
        }
      },
      animation: {
        'pulse-subtle': 'pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
      }
    },
  },
  plugins: [],
}
