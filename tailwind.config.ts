import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        surface: '#0b0f17',
        panel: '#111827',
        border: '#1f2937',
        accent: '#6366f1',
        critical: '#ef4444',
        high: '#f97316',
        medium: '#eab308',
        low: '#3b82f6',
      },
    },
  },
  plugins: [],
};
export default config;
