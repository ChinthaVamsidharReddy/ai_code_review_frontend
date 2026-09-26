'use client';

import { useState } from 'react';
import { api, ApiError } from '@/lib/api';
import { useToast } from '@/components/Toast';
import Spinner from '@/components/Spinner';
import FileTree from './FileTree';
import ReviewDetail from './ReviewDetail';
import { Review, ReviewMode, ReviewScope, TreeNode } from '@/types/api';

export default function ReviewPanel({ projectId, tree }: { projectId: string; tree: TreeNode[] }) {
  const { showToast } = useToast();
  const [mode, setMode] = useState<ReviewMode>('security');
  const [scope, setScope] = useState<ReviewScope>('project');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<Review | null>(null);

  function toggleSelect(fileId: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(fileId) ? next.delete(fileId) : next.add(fileId);
      return next;
    });
  }

  async function runReview() {
    if (scope !== 'project' && selectedIds.size === 0) {
      showToast('Select at least one file first', 'error');
      return;
    }
    setRunning(true);
    setResult(null);
    try {
      const review = await api.post<Review>(`/projects/${projectId}/reviews`, {
        mode,
        scope,
        fileIds: scope === 'project' ? undefined : Array.from(selectedIds),
      });
      setResult(review);
      if (review.status === 'failed') {
        showToast('Review failed — see details below', 'error');
      } else {
        showToast('Review complete', 'success');
      }
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : 'Failed to run review', 'error');
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="grid md:grid-cols-[280px_1fr] gap-6">
      <div className="space-y-4">
        <div>
          <label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-wide">Review mode</label>
          <div className="flex flex-col gap-1">
            {(['security', 'performance', 'quality'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`text-left text-sm px-3 py-2 rounded-lg border ${
                  mode === m ? 'bg-accent/15 border-accent text-white' : 'border-border text-gray-400 hover:text-white'
                }`}
              >
                {m === 'security' ? 'Security review' : m === 'performance' ? 'Performance review' : 'Code quality review'}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-wide">Scope</label>
          <select
            value={scope}
            onChange={(e) => setScope(e.target.value as ReviewScope)}
            className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm"
          >
            <option value="project">Entire project</option>
            <option value="multi_file">Selected files</option>
            <option value="single_file">Single file</option>
          </select>
        </div>

        {scope !== 'project' && (
          <div>
            <label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-wide">
              Select {scope === 'single_file' ? 'a file' : 'files'} ({selectedIds.size} selected)
            </label>
            <div className="border border-border rounded-lg max-h-64 overflow-auto py-1">
              <FileTree
                nodes={tree}
                onSelectFile={(fileId) => {
                  if (scope === 'single_file') setSelectedIds(new Set([fileId]));
                  else toggleSelect(fileId);
                }}
                multiSelect={scope === 'multi_file'}
                selectedIds={selectedIds}
                onToggleSelect={(fileId) => toggleSelect(fileId)}
                selectedFileId={scope === 'single_file' ? Array.from(selectedIds)[0] : undefined}
              />
            </div>
          </div>
        )}

        <button
          onClick={runReview}
          disabled={running}
          className="w-full bg-accent hover:bg-accent/90 disabled:opacity-60 text-white text-sm font-medium px-4 py-2.5 rounded-lg flex items-center justify-center gap-2"
        >
          {running && <Spinner />}
          Run review
        </button>
      </div>

      <div>
        {running ? (
          <div className="flex items-center justify-center h-64 text-gray-500 text-sm gap-2">
            <Spinner /> Reviewing code — this can take a moment…
          </div>
        ) : result ? (
          <ReviewDetail review={result} />
        ) : (
          <div className="flex items-center justify-center h-64 text-gray-600 text-sm text-center px-8">
            Choose a mode and scope, then run a review. Results appear here.
          </div>
        )}
      </div>
    </div>
  );
}
