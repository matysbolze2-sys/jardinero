/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg-base':       '#0D1208',
        'bg-card':       '#151E0F',
        'bg-elevated':   '#1C2914',
        'bg-input':      '#1F2E14',
        'green-acid':    '#7BC900',
        'green-mid':     '#4A8A20',
        'green-dim':     '#2D5A10',
        'green-muted':   '#3D5C2A',
        'text-primary':  '#F0F7E8',
        'text-secondary':'#8FAF78',
        'text-muted':    '#516640',
        'amber-warm':    '#FAC775',
        'red-alert':     '#E05A3A',
        'border-dim':    'rgba(123,201,0,0.12)',
        'border-mid':    'rgba(123,201,0,0.25)',
        'border-glow':   'rgba(123,201,0,0.5)',
      },
      borderRadius: {
        'sm':   '8px',
        'md':   '14px',
        'lg':   '20px',
        'xl':   '28px',
        'full': '9999px',
        'card': '20px',
        'chip': '9999px',
      },
      fontFamily: {
        fraunces: ['Fraunces', 'serif'],
        sans:     ['DM Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
