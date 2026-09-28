'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import ThemeToggle from '@/components/ThemeToggle';
import Spinner from '@/components/Spinner';

const REVIEW_MODES = [
  { title: 'Security Review', desc: 'Hardcoded credentials, auth/authorization gaps, missing input validation, injection risks, and unsafe handling of sensitive data.' },
  { title: 'Performance Review', desc: 'Inefficient algorithms, N+1 queries and missing pagination, expensive synchronous operations, and resource-management issues.' },
  { title: 'Code Quality Review', desc: 'Naming, structure, readability, duplication, error handling, and overall maintainability.' },
];

const FEATURES = [
  {
    title: 'Upload & explore code',
    desc: 'Upload a project as a ZIP archive. Files are safely extracted (with path-traversal protection) and browsable in a folder-tree explorer with syntax-highlighted previews.',
  },
  {
    title: 'Structured AI reviews',
    desc: 'Review a single file, a selection of files, or an entire project. Every review returns a summary, a list of issues with severity (Critical/High/Medium/Low), file/line hints, and concrete recommendations — not a wall of unstructured text.',
  },
  {
    title: 'Review history & search',
    desc: 'Every review is saved. Filter by mode or severity and search past summaries and issue titles to revisit what was found before.',
  },
  {
    title: 'Chat with your code',
    desc: 'Ask questions about an uploaded project in plain language. Answers are grounded in the most relevant files for your question — not a blind dump of the whole repository.',
  },
  {
    title: 'Documentation generator',
    desc: 'Generate a README, a setup guide, or API documentation directly from the code you uploaded, on demand.',
  },
  {
    title: 'Architecture analysis',
    desc: 'Get an AI-written summary of a project\u2019s architecture style, key modules, apparent data flow, and structural concerns.',
  },
];

export default function LandingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) router.replace('/dashboard');
  }, [loading, user, router]);

  if (loading || user) {
    return (
      <div className="flex h-screen items-center justify-center text-muted">
        <Spinner className="w-6 h-6" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <span className="font-semibold text-fg">AI Code Review Assistant</span>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/login" className="text-sm text-muted hover:text-fg transition-colors">
              Sign in
            </Link>
            <Link href="/register" className="text-sm bg-accent hover:bg-accent/90 text-white font-medium px-3.5 py-1.5 rounded-lg">
              Get started
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6">
        <section className="py-16 sm:py-24 text-center">
          <h1 className="text-3xl sm:text-4xl font-semibold text-fg max-w-2xl mx-auto leading-tight">
            Upload your code. Get structured, AI-generated code reviews.
          </h1>
          <p className="text-muted mt-4 max-w-xl mx-auto">
            A full-stack tool for developers: upload a project, explore it, run security/performance/quality
            reviews, chat with your codebase, and generate documentation — using whichever AI provider you
            configure, cloud or local.
          </p>
          <div className="flex items-center justify-center gap-3 mt-8">
            <Link href="/register" className="bg-accent hover:bg-accent/90 text-white font-medium px-5 py-2.5 rounded-lg text-sm">
              Create a free account
            </Link>
            <Link href="/login" className="border border-border hover:border-accent/50 text-fg font-medium px-5 py-2.5 rounded-lg text-sm">
              Sign in
            </Link>
          </div>
        </section>

        <section className="py-12 border-t border-border">
          <h2 className="text-xl font-semibold text-fg text-center mb-8">Three focused review modes</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {REVIEW_MODES.map((m) => (
              <div key={m.title} className="bg-panel border border-border rounded-xl p-5">
                <h3 className="font-medium text-fg text-sm mb-1.5">{m.title}</h3>
                <p className="text-sm text-muted">{m.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="py-12 border-t border-border">
          <h2 className="text-xl font-semibold text-fg text-center mb-8">What's included</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {FEATURES.map((f) => (
              <div key={f.title} className="bg-panel border border-border rounded-xl p-5">
                <h3 className="font-medium text-fg text-sm mb-1.5">{f.title}</h3>
                <p className="text-sm text-muted">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="py-12 border-t border-border">
          <h2 className="text-xl font-semibold text-fg text-center mb-3">Bring your own AI provider</h2>
          <p className="text-sm text-muted text-center max-w-xl mx-auto mb-8">
            Nothing is hardcoded to one vendor. Configure any OpenAI-compatible endpoint with a base URL, an
            optional API key, and a model name — the app talks to all of them the same way.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {['OpenAI', 'OpenRouter', 'Groq', 'LM Studio (local)', 'Ollama (local)', 'Any OpenAI-compatible endpoint'].map((p) => (
              <span key={p} className="text-xs text-muted bg-panel border border-border rounded-full px-3 py-1.5">
                {p}
              </span>
            ))}
          </div>
        </section>

        <section className="py-16 text-center border-t border-border">
          <h2 className="text-xl font-semibold text-fg mb-3">Built for real code review workflows</h2>
          <p className="text-sm text-muted max-w-xl mx-auto mb-6">
            JWT authentication, per-project ownership isolation, encrypted AI-provider credentials, and
            path-traversal-safe file handling — the parts of a code-review tool that matter before the
            AI part does.
          </p>
          <Link href="/register" className="bg-accent hover:bg-accent/90 text-white font-medium px-5 py-2.5 rounded-lg text-sm inline-block">
            Create a free account
          </Link>
        </section>
      </main>

      <footer className="border-t border-border py-6 text-center text-xs text-muted-2">
        AI Code Review Assistant — a full-stack engineering project.
      </footer>
    </div>
  );
}
