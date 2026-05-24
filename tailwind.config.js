/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        'green-light': '#EAF3DE',
        'green-mid':   '#97C459',
        'green-dark':  '#3B6D11',
        'amber':       '#FAC775',
        'amber-dark':  '#C27C12',
        'cream':       '#FAF8F3',
        'ink':         '#1A2010',
        'muted':       '#6B7A5C',
        'border-j':    '#DDE8CC',
      },
      fontFamily: {
        fraunces: ['Fraunces', 'serif'],
        sans:     ['DM Sans', 'sans-serif'],
      },
      borderRadius: {
        card: '16px',
        chip: '20px',
      },
    },
  },
  plugins: [],
}

