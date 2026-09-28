import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

const config: Config = {
  darkMode: 'class', // toggled by ThemeProvider alongside data-theme; used as an
  // escape hatch for third-party plugin utilities (e.g. dark:prose-invert).
  // Our own semantic colors (surface/panel/border/fg/muted/accent) don't
  // need this — they resolve through CSS variables that flip automatically
  // with the data-theme attribute, so most components never need a dark:
  // prefix at all.
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        surface: 'rgb(var(--bg) / <alpha-value>)',
        panel: 'rgb(var(--panel) / <alpha-value>)',
        'panel-alt': 'rgb(var(--panel-alt) / <alpha-value>)',
        border: 'rgb(var(--border) / <alpha-value>)',
        fg: 'rgb(var(--fg) / <alpha-value>)',
        muted: 'rgb(var(--muted) / <alpha-value>)',
        'muted-2': 'rgb(var(--muted-2) / <alpha-value>)',
        accent: 'rgb(var(--accent) / <alpha-value>)',
        critical: '#ef4444',
        high: '#f97316',
        medium: '#eab308',
        low: '#3b82f6',
      },
      typography: () => ({
        DEFAULT: {
          css: {
            '--tw-prose-body': 'rgb(var(--fg))',
            '--tw-prose-headings': 'rgb(var(--fg))',
            '--tw-prose-lead': 'rgb(var(--muted))',
            '--tw-prose-links': 'rgb(var(--accent))',
            '--tw-prose-bold': 'rgb(var(--fg))',
            '--tw-prose-counters': 'rgb(var(--muted))',
            '--tw-prose-bullets': 'rgb(var(--muted))',
            '--tw-prose-hr': 'rgb(var(--border))',
            '--tw-prose-quotes': 'rgb(var(--fg))',
            '--tw-prose-quote-borders': 'rgb(var(--border))',
            '--tw-prose-captions': 'rgb(var(--muted))',
            '--tw-prose-code': 'rgb(var(--fg))',
            '--tw-prose-pre-code': 'rgb(var(--fg))',
            '--tw-prose-pre-bg': 'rgb(var(--panel-alt))',
            '--tw-prose-th-borders': 'rgb(var(--border))',
            '--tw-prose-td-borders': 'rgb(var(--border))',
            maxWidth: 'none',
            code: { backgroundColor: 'rgb(var(--panel-alt))', padding: '0.15rem 0.35rem', borderRadius: '0.3rem', fontWeight: '500' },
            'code::before': { content: 'none' },
            'code::after': { content: 'none' },
          },
        },
      }),
    },
  },
  plugins: [typography],
};
export default config;
