'use client';

import { useEffect, useState } from 'react';
import { api, ApiError } from '@/lib/api';
import { useToast } from '@/components/Toast';
import Spinner from '@/components/Spinner';
import EmptyState from '@/components/EmptyState';
import SeverityBadge from '@/components/SeverityBadge';
import ReviewDetail from './ReviewDetail';
import { Paginated, Review } from '@/types/api';

export default function ReviewHistoryPanel({ projectId }: { projectId: string }) {
  const { showToast } = useToast();
  const [reviews, setReviews] = useState<Review[] | null>(null);
  const [search, setSearch] = useState('');
  const [modeFilter, setModeFilter] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');
  const [selected, setSelected] = useState<Review | null>(null);

  async function load() {
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (modeFilter) params.set('mode', modeFilter);
      if (severityFilter) params.set('severity', severityFilter);
      const res = await api.get<Paginated<Review>>(`/projects/${projectId}/reviews?${params.toString()}`);
      setReviews(res.items);
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : 'Failed to load review history', 'error');
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, modeFilter, severityFilter]);

  if (selected) {
    return (
      <div>
        <button onClick={() => setSelected(null)} className="text-sm text-muted hover:text-fg mb-4">
          ← Back to history
        </button>
        <ReviewDetail review={selected} />
      </div>
    );
  }

  return (
    <div>
      <div className="flex gap-3 mb-4">
        <input
          placeholder="Search summaries and issues…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-panel border border-border rounded-lg px-3 py-2 text-sm"
        />
        <select
          value={modeFilter}
          onChange={(e) => setModeFilter(e.target.value)}
          className="bg-panel border border-border rounded-lg px-3 py-2 text-sm"
        >
          <option value="">All modes</option>
          <option value="security">Security</option>
          <option value="performance">Performance</option>
          <option value="quality">Quality</option>
        </select>
        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
          className="bg-panel border border-border rounded-lg px-3 py-2 text-sm"
        >
          <option value="">All severities</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      {reviews === null ? (
        <div className="flex justify-center py-16 text-muted">
          <Spinner className="w-5 h-5" />
        </div>
      ) : reviews.length === 0 ? (
        <EmptyState title="No reviews yet" description="Run your first review from the Review tab." />
      ) : (
        <div className="space-y-2">
          {reviews.map((r) => {
            const counts = r.issues.reduce<Record<string, number>>((acc, i) => {
              acc[i.severity] = (acc[i.severity] ?? 0) + 1;
              return acc;
            }, {});
            return (
              <button
                key={r.id}
                onClick={() => setSelected(r)}
                className="w-full text-left bg-panel border border-border hover:border-accent/50 rounded-xl p-4 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wide text-muted">
                    {r.mode} · {r.scope.replace('_', ' ')}
                  </span>
                  <span className="text-xs text-muted-2">{new Date(r.createdAt).toLocaleString()}</span>
                </div>
                <p className="text-sm text-fg mt-1.5 line-clamp-2">
                  {r.status === 'failed' ? `⚠️ ${r.errorMessage}` : r.summary}
                </p>
                <div className="flex gap-1.5 mt-2">
                  {(['critical', 'high', 'medium', 'low'] as const).map(
                    (sev) => counts[sev] && <SeverityBadge key={sev} severity={sev} />,
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
