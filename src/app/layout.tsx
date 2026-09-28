import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';
import { ThemeProvider } from '@/lib/theme-context';
import { ToastProvider } from '@/components/Toast';

export const metadata: Metadata = {
  title: 'AI Code Review Assistant',
  description: 'Upload source code and get structured, AI-generated code reviews.',
};

// Runs before React hydrates so the correct theme is set on the very first
// paint — without this, a user whose OS is set to dark would see a flash
// of the light theme (or vice versa) while ThemeProvider's effect runs.
const THEME_INIT_SCRIPT = `
(function () {
  try {
    var pref = localStorage.getItem('themePreference');
    var systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var theme = pref === 'light' || pref === 'dark' ? pref : (systemDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') document.documentElement.classList.add('dark');
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body>
        <ThemeProvider>
          <ToastProvider>
            <AuthProvider>{children}</AuthProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
