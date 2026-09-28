'use client';

import { useTheme } from '@/lib/theme-context';

const OPTIONS: { value: 'light' | 'dark' | 'system'; label: string; icon: string }[] = [
  { value: 'light', label: 'Light', icon: '☀️' },
  { value: 'dark', label: 'Dark', icon: '🌙' },
  { value: 'system', label: 'System', icon: '🖥️' },
];

export default function ThemeToggle() {
  const { preference, setPreference } = useTheme();
  return (
    <div className="flex items-center gap-0.5 bg-panel-alt border border-border rounded-full p-0.5">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => setPreference(opt.value)}
          title={opt.label}
          aria-label={`${opt.label} theme`}
          className={`w-7 h-7 grid place-items-center rounded-full text-xs transition-colors ${
            preference === opt.value ? 'bg-accent text-white' : 'text-muted hover:text-fg'
          }`}
        >
          {opt.icon}
        </button>
      ))}
    </div>
  );
}
