'use client';

import { useEffect, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { api, ApiError } from '@/lib/api';
import Spinner from '@/components/Spinner';

const EXT_TO_LANG: Record<string, string> = {
  ts: 'typescript', tsx: 'tsx', js: 'javascript', jsx: 'jsx', py: 'python',
  java: 'java', go: 'go', rb: 'ruby', php: 'php', c: 'c', cpp: 'cpp',
  cs: 'csharp', html: 'markup', css: 'css', scss: 'scss', json: 'json',
  yml: 'yaml', yaml: 'yaml', md: 'markdown', sql: 'sql', sh: 'bash',
};

export default function CodeViewer({ projectId, fileId, path }: { projectId: string; fileId: string | null; path: string | null }) {
  const [content, setContent] = useState<string | null>(null);
  const [isBinary, setIsBinary] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!fileId) return;
    setLoading(true);
    setError(null);
    api
      .get<{ content: string | null; file: { isBinary: boolean } }>(`/projects/${projectId}/files/${fileId}/content`)
      .then((res) => {
        setContent(res.content);
        setIsBinary(res.file.isBinary);
      })
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Failed to load file'))
      .finally(() => setLoading(false));
  }, [projectId, fileId]);

  if (!fileId) {
    return <div className="flex-1 flex items-center justify-center text-gray-600 text-sm">Select a file to preview it</div>;
  }
  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        <Spinner className="w-5 h-5" />
      </div>
    );
  }
  if (error) return <div className="flex-1 flex items-center justify-center text-critical text-sm">{error}</div>;
  if (isBinary) return <div className="flex-1 flex items-center justify-center text-gray-600 text-sm">Binary file — no preview available</div>;

  const ext = path?.split('.').pop()?.toLowerCase() ?? '';
  const lang = EXT_TO_LANG[ext] ?? 'text';

  return (
    <div className="flex-1 overflow-auto">
      <div className="sticky top-0 bg-panel border-b border-border px-4 py-2 text-xs text-gray-500 font-mono">{path}</div>
      <SyntaxHighlighter
        language={lang}
        style={vscDarkPlus}
        customStyle={{ margin: 0, background: 'transparent', fontSize: 13, padding: '1rem' }}
        showLineNumbers
      >
        {content ?? ''}
      </SyntaxHighlighter>
    </div>
  );
}
