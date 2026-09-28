'use client';

import { useEffect, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { api, ApiError } from '@/lib/api';
import Spinner from '@/components/Spinner';
import { useTheme } from '@/lib/theme-context';

const EXT_TO_LANG: Record<string, string> = {
  ts: 'typescript', tsx: 'tsx', js: 'javascript', jsx: 'jsx', py: 'python',
  java: 'java', go: 'go', rb: 'ruby', php: 'php', c: 'c', cpp: 'cpp',
  cs: 'csharp', html: 'markup', css: 'css', scss: 'scss', json: 'json',
  yml: 'yaml', yaml: 'yaml', md: 'markdown', sql: 'sql', sh: 'bash',
};

export default function CodeViewer({ projectId, fileId, path }: { projectId: string; fileId: string | null; path: string | null }) {
  const { effectiveTheme } = useTheme();
  const [content, setContent] = useState<string | null>(null);
  const [isBinary, setIsBinary] = useState(false);
  const [missing, setMissing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!fileId) return;
    setLoading(true);
    setError(null);
    setMissing(false);
    api
      .get<{ content: string | null; missing: boolean; file: { isBinary: boolean } }>(`/projects/${projectId}/files/${fileId}/content`)
      .then((res) => {
        setContent(res.content);
        setIsBinary(res.file.isBinary);
        setMissing(res.missing);
      })
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Failed to load file'))
      .finally(() => setLoading(false));
  }, [projectId, fileId]);

  if (!fileId) {
    return <div className="flex-1 flex items-center justify-center text-muted-2 text-sm">Select a file to preview it</div>;
  }
  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted">
        <Spinner className="w-5 h-5" />
      </div>
    );
  }
  if (error) return <div className="flex-1 flex items-center justify-center text-critical text-sm">{error}</div>;
  if (missing) {
    return (
      <div className="flex-1 flex items-center justify-center text-center px-8">
        <div>
          <p className="text-sm text-fg">This file's content isn't available on the server right now.</p>
          <p className="text-xs text-muted mt-1.5 max-w-sm">
            The file is indexed but its stored bytes weren't found. Re-uploading this project's ZIP from the Code Explorer tab
            will restore it.
          </p>
        </div>
      </div>
    );
  }
  if (isBinary) return <div className="flex-1 flex items-center justify-center text-muted-2 text-sm">Binary file — no preview available</div>;

  const ext = path?.split('.').pop()?.toLowerCase() ?? '';
  const lang = EXT_TO_LANG[ext] ?? 'text';

  return (
    <div className="flex-1 overflow-auto">
      <div className="sticky top-0 bg-panel border-b border-border px-4 py-2 text-xs text-muted font-mono">{path}</div>
      <SyntaxHighlighter
        language={lang}
        style={effectiveTheme === 'dark' ? vscDarkPlus : oneLight}
        customStyle={{ margin: 0, background: 'transparent', fontSize: 13, padding: '1rem' }}
        showLineNumbers
      >
        {content ?? ''}
      </SyntaxHighlighter>
    </div>
  );
}
