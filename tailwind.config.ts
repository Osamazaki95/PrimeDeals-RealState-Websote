import type { Config } from 'tailwindcss';

/**
 * Brand tokens come straight from the Prime Deals design file.
 * Light/dark values live as CSS variables in src/styles/globals.css,
 * so you change a colour in ONE place and the whole site follows.
 */
const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        surface2: 'var(--surface-2)',
        cream: 'var(--cream)',
        ink: 'var(--ink)',
        muted: 'var(--muted)',
        line: 'var(--line)',
        brand: {
          DEFAULT: 'var(--brand)',
          hi: 'var(--brand-hi)',
          on: 'var(--on-brand)',
        },
        gold: 'var(--gold)',
      },
      fontFamily: {
        sans: ['var(--font-latin)', 'system-ui', 'sans-serif'],
        arabic: ['var(--font-arabic)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      borderRadius: { xl: '14px', '2xl': '18px' },
      boxShadow: {
        card: '0 18px 50px -24px rgba(16,32,31,.28)',
        cardDark: '0 18px 50px -24px rgba(0,0,0,.7)',
      },
      maxWidth: { shell: '1280px' },
      transitionTimingFunction: { cine: 'cubic-bezier(.2,.8,.2,1)' },
      keyframes: {
        rise: { '0%': { opacity: '0', transform: 'translateY(26px)' }, '100%': { opacity: '1', transform: 'none' } },
        fade: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        kenburns: { '0%': { transform: 'scale(1.06)' }, '100%': { transform: 'scale(1.18) translate3d(-1.5%,-1.5%,0)' } },
        pulseRing: { '0%,100%': { opacity: '.35', transform: 'scale(1)' }, '50%': { opacity: '.9', transform: 'scale(1.35)' } },
      },
      animation: {
        rise: 'rise .8s cubic-bezier(.2,.8,.2,1) both',
        fade: 'fade .5s ease both',
        kenburns: 'kenburns 22s ease-in-out infinite alternate',
        pulseRing: 'pulseRing 2.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
export default config;
