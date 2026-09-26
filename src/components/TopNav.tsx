'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';

export default function TopNav({ crumb }: { crumb?: string }) {
  const { user, logout } = useAuth();
  return (
    <header className="border-b border-border bg-panel/60 backdrop-blur sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          <Link href="/dashboard" className="font-semibold text-white hover:text-accent transition-colors">
            AI Code Review
          </Link>
          {crumb && (
            <>
              <span className="text-gray-600">/</span>
              <span className="text-gray-400">{crumb}</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/providers" className="text-gray-400 hover:text-white transition-colors">
            AI Providers
          </Link>
          <span className="text-gray-600">{user?.email}</span>
          <button onClick={() => logout()} className="text-gray-400 hover:text-white transition-colors">
            Log out
          </button>
        </div>
      </div>
    </header>
  );
}
