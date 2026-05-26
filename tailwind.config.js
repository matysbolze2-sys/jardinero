/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        'jd-bg':          '#16261b',
        'jd-surface':     '#1f3225',
        'jd-surface-alt': '#27412e',
        'jd-accent':      '#a6e36b',
        'jd-accent-dim':  '#6c9a3a',
        'jd-accent-ink':  '#0d160f',
        'jd-ink':         '#f1f6ed',
        'jd-ink-muted':   '#a3b8a8',
        'jd-warning':     '#f0b86c',
        'jd-earth':       '#a06840',
        'jd-border':      'rgba(255,255,255,0.10)',
      },
      borderRadius: {
        'sm':   '10px',
        'md':   '18px',
        'lg':   '24px',
        'pill': '999px',
        'card': '18px',
        'chip': '999px',
      },
      fontFamily: {
        display:  ['Plus Jakarta Sans', 'Manrope', 'system-ui', 'sans-serif'],
        sans:     ['Manrope', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        mono:     ['JetBrains Mono', 'monospace'],
        fraunces: ['Fraunces', 'serif'],
      },
      boxShadow: {
        'card': '0 24px 48px -24px rgba(0,0,0,0.55), 0 1px 0 rgba(255,255,255,0.04) inset',
      },
    },
  },
  plugins: [],
}
