'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import ThemeToggle from './ThemeToggle';

export default function TopNav({ crumb }: { crumb?: string }) {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="border-b border-border bg-panel/60 backdrop-blur sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm min-w-0">
          <Link href="/dashboard" className="font-semibold text-fg hover:text-accent transition-colors shrink-0">
            AI Code Review
          </Link>
          {crumb && (
            <>
              <span className="text-muted-2 hidden sm:inline">/</span>
              <span className="text-muted truncate hidden sm:inline">{crumb}</span>
            </>
          )}
        </div>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-4 text-sm">
          <Link href="/providers" className="text-muted hover:text-fg transition-colors whitespace-nowrap">
            AI Providers
          </Link>
          <span className="text-muted-2 truncate max-w-[160px]">{user?.email}</span>
          <ThemeToggle />
          <button onClick={() => logout()} className="text-muted hover:text-fg transition-colors whitespace-nowrap">
            Log out
          </button>
        </div>

        {/* Mobile: theme toggle always visible + a menu for the rest */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Menu"
            className="w-9 h-9 grid place-items-center rounded-lg border border-border text-fg"
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-border bg-panel px-4 py-3 flex flex-col gap-3 text-sm">
          {crumb && <span className="text-muted">{crumb}</span>}
          <Link href="/providers" className="text-muted hover:text-fg" onClick={() => setMenuOpen(false)}>
            AI Providers
          </Link>
          <span className="text-muted-2">{user?.email}</span>
          <button onClick={() => logout()} className="text-left text-muted hover:text-fg">
            Log out
          </button>
        </div>
      )}
    </header>
  );
}
