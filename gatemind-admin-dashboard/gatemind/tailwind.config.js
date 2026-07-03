/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        void: 'rgb(var(--c-void) / <alpha-value>)',
        base: 'rgb(var(--c-base) / <alpha-value>)',
        surface: 'rgb(var(--c-surface) / <alpha-value>)',
        elevated: 'rgb(var(--c-elevated) / <alpha-value>)',
        'border-subtle': 'rgb(var(--c-border-subtle) / <alpha-value>)',
        'border-default': 'rgb(var(--c-border-default) / <alpha-value>)',
        'text-primary': 'rgb(var(--c-text-primary) / <alpha-value>)',
        'text-secondary': 'rgb(var(--c-text-secondary) / <alpha-value>)',
        'text-muted': 'rgb(var(--c-text-muted) / <alpha-value>)',
        signal: 'rgb(var(--c-signal) / <alpha-value>)',
        cyan: 'rgb(var(--c-cyan) / <alpha-value>)',
        violet: 'rgb(var(--c-violet) / <alpha-value>)',
        danger: 'rgb(var(--c-danger) / <alpha-value>)',
        success: 'rgb(var(--c-success) / <alpha-value>)',
      },
      boxShadow: {
        card: '0 1px 2px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.03)',
        elevated: '0 8px 30px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.04)',
        glow: '0 0 0 1px rgba(34,211,238,0.25), 0 0 24px rgba(34,211,238,0.15)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'packet-flow': 'packetFlow 6s linear infinite',
        'fade-up': 'fadeUp 0.6s ease-out both',
        'scan-line': 'scanLine 2.5s linear infinite',
      },
      keyframes: {
        packetFlow: {
          '0%': { offsetDistance: '0%', opacity: '0' },
          '5%': { opacity: '1' },
          '95%': { opacity: '1' },
          '100%': { offsetDistance: '100%', opacity: '0' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scanLine: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
      },
    },
  },
  plugins: [],
}
