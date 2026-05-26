/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Urbanist', 'sans-serif'],
        // Design-system fonts, backed by tokens (tokens.css)
        headline: ['var(--font-headline)'],
        body: ['var(--font-body)'],
        serif: ['var(--font-serif)'],
        mono: ['var(--font-mono)'],
      },
      // Design-system type scale — role-named keys (no collision with
      // Tailwind's xs/sm/lg/...), each backed by a token + paired line-height.
      fontSize: {
        display: ['var(--text-display)', { lineHeight: 'var(--leading-display)' }],
        h1: ['var(--text-h1)', { lineHeight: 'var(--leading-h1)' }],
        h2: ['var(--text-h2)', { lineHeight: 'var(--leading-h2)' }],
        h3: ['var(--text-h3)', { lineHeight: 'var(--leading-h3)' }],
        h4: ['var(--text-h4)', { lineHeight: 'var(--leading-h4)' }],
        intro: ['var(--text-intro)', { lineHeight: 'var(--leading-intro)' }],
        'body-lg': ['var(--text-body-lg)', { lineHeight: 'var(--leading-body-lg)' }],
        'body-md': ['var(--text-body)', { lineHeight: 'var(--leading-body)' }],
        'body-sm': ['var(--text-body-sm)', { lineHeight: 'var(--leading-body-sm)' }],
        label: ['var(--text-label)', { lineHeight: 'var(--leading-label)' }],
        caption: ['var(--text-caption)', { lineHeight: 'var(--leading-caption)' }],
      },
      // Re-point the standard weight keys at tokens. Values equal Tailwind's
      // defaults, so existing usage is unaffected — now token-driven.
      fontWeight: {
        thin: 'var(--font-weight-thin)',
        light: 'var(--font-weight-light)',
        normal: 'var(--font-weight-regular)',
        medium: 'var(--font-weight-medium)',
        bold: 'var(--font-weight-bold)',
      },
      // Token spacing under t-shirt keys (no collision with the numeric scale
      // the existing site uses).
      spacing: {
        xs: 'var(--space-1)',
        sm: 'var(--space-2)',
        md: 'var(--space-4)',
        lg: 'var(--space-6)',
        xl: 'var(--space-8)',
        '2xl': 'var(--space-10)',
        '3xl': 'var(--space-12)',
      },
      borderRadius: {
        token: 'var(--radius-md)',
        'token-sm': 'var(--radius-sm)',
      },
      colors: {
        space: {
          950: '#050507',
          900: '#0a0a0f',
          800: '#13131f',
        },
        // Semantic design-system palette, backed by tokens.
        bg: 'var(--color-bg)',
        surface: 'var(--color-surface)',
        'surface-strong': 'var(--color-surface-strong)',
        text: 'var(--color-text)',
        muted: 'var(--color-muted)',
        faint: 'var(--color-faint)',
        border: 'var(--color-border)',
        'border-strong': 'var(--color-border-strong)',
        accent: 'var(--color-accent)',
        'accent-hover': 'var(--color-accent-hover)',
        'accent-contrast': 'var(--color-accent-contrast)',
        panel: 'var(--color-panel)',
        'panel-chip': 'var(--color-panel-chip)',
        highlight: 'var(--color-highlight)',
        'highlight-contrast': 'var(--color-highlight-contrast)',
        'status-live': 'var(--color-status-live)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        danger: 'var(--color-danger)',
        info: 'var(--color-info)',
        // Editorial primitives (raw values) for utility-based pages.
        brand: 'var(--color-brand)',
        cream: 'var(--color-cream)',
        paper: 'var(--color-paper)',
        'paper-warm': 'var(--color-paper-warm)',
        ink: 'var(--color-ink)',
        'ink-soft': 'var(--color-ink-soft)',
        // NOTE: do not remap Tailwind's `white`/`black` to a var() — that
        // breaks opacity modifiers (e.g. bg-white/[0.04]) used by the app
        // pages, since an alpha can't be injected into a CSS var. Tokenize
        // black/white per-use via arbitrary values instead.
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};
