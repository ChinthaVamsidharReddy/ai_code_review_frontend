'use client';

import { useState } from 'react';
import { api, ApiError } from '@/lib/api';
import { useToast } from '@/components/Toast';
import Spinner from '@/components/Spinner';
import MarkdownView from '@/components/MarkdownView';

type DocType = 'readme' | 'setup_guide' | 'api_documentation';

const DOC_LABELS: Record<DocType, string> = {
  readme: 'README.md',
  setup_guide: 'Setup Guide',
  api_documentation: 'API Documentation',
};

export default function DocsPanel({ projectId }: { projectId: string }) {
  const { showToast } = useToast();
  const [generating, setGenerating] = useState<string | null>(null);
  const [output, setOutput] = useState<{ label: string; markdown: string } | null>(null);

  async function generateDoc(docType: DocType) {
    setGenerating(docType);
    setOutput(null);
    try {
      const res = await api.post<{ docType: string; markdown: string }>(`/projects/${projectId}/docs/generate`, { docType });
      setOutput({ label: DOC_LABELS[docType], markdown: res.markdown });
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : 'Failed to generate documentation', 'error');
    } finally {
      setGenerating(null);
    }
  }

  async function analyzeArchitecture() {
    setGenerating('architecture');
    setOutput(null);
    try {
      const res = await api.post<{ markdown: string }>(`/projects/${projectId}/architecture-analysis`, {});
      setOutput({ label: 'Architecture Analysis', markdown: res.markdown });
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : 'Failed to analyze architecture', 'error');
    } finally {
      setGenerating(null);
    }
  }

  function copy() {
    if (!output) return;
    navigator.clipboard.writeText(output.markdown);
    showToast('Copied to clipboard', 'success');
  }

  return (
    <div className="grid md:grid-cols-[220px_1fr] gap-6">
      <div className="space-y-2">
        <p className="text-xs text-muted uppercase tracking-wide mb-1">Documentation Generator</p>
        {(['readme', 'setup_guide', 'api_documentation'] as DocType[]).map((t) => (
          <button
            key={t}
            onClick={() => generateDoc(t)}
            disabled={!!generating}
            className="w-full text-left text-sm px-3 py-2 rounded-lg border border-border text-fg hover:border-accent/50 disabled:opacity-50 flex items-center justify-between"
          >
            {DOC_LABELS[t]}
            {generating === t && <Spinner />}
          </button>
        ))}
        <p className="text-xs text-muted uppercase tracking-wide mt-4 mb-1">Architecture</p>
        <button
          onClick={analyzeArchitecture}
          disabled={!!generating}
          className="w-full text-left text-sm px-3 py-2 rounded-lg border border-border text-fg hover:border-accent/50 disabled:opacity-50 flex items-center justify-between"
        >
          Analyze architecture
          {generating === 'architecture' && <Spinner />}
        </button>
      </div>

      <div>
        {generating ? (
          <div className="flex items-center justify-center h-64 text-muted text-sm gap-2">
            <Spinner /> Generating…
          </div>
        ) : output ? (
          <div className="bg-panel border border-border rounded-xl">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
              <span className="text-sm font-medium text-fg">{output.label}</span>
              <button onClick={copy} className="text-xs text-accent hover:underline">
                Copy Markdown
              </button>
            </div>
            <div className="p-4 overflow-auto max-h-[500px]">
              <MarkdownView markdown={output.markdown} />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-64 text-muted-2 text-sm text-center px-8">
            Generate a document or architecture summary from your uploaded code.
          </div>
        )}
      </div>
    </div>
  );
}
