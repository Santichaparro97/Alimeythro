/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: 'var(--cream)',
        'cream-warm': 'var(--cream-warm)',
        cyan: 'var(--cyan)',
        'cyan-glow': 'var(--cyan-glow)',
        'night-1': 'var(--night-1)',
        'night-2': 'var(--night-2)',
        'navy-tag': 'var(--navy-tag)',
        'orange-cta': 'var(--orange-cta)',
        ink: 'var(--ink)',
        'rug-yellow': 'var(--rug-yellow)',
      },
      fontFamily: {
        display: ['"Sofia Sans Extra Condensed"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        body: ['Nunito', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
