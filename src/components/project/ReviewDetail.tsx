'use client';

import SeverityBadge from '@/components/SeverityBadge';
import { Review } from '@/types/api';

const SEVERITY_ORDER = { critical: 0, high: 1, medium: 2, low: 3 } as const;

export default function ReviewDetail({ review }: { review: Review }) {
  if (review.status === 'failed') {
    return (
      <div className="bg-critical/10 border border-critical/30 rounded-xl p-4">
        <p className="text-sm text-critical font-medium">Review failed</p>
        <p className="text-sm text-gray-400 mt-1">{review.errorMessage}</p>
      </div>
    );
  }

  const sortedIssues = [...review.issues].sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]);
  const counts = review.issues.reduce<Record<string, number>>((acc, i) => {
    acc[i.severity] = (acc[i.severity] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      <div className="bg-panel border border-border rounded-xl p-4">
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
          <span className="uppercase tracking-wide bg-white/5 px-2 py-0.5 rounded-full">{review.mode}</span>
          <span>·</span>
          <span>{review.scope.replace('_', ' ')}</span>
          <span>·</span>
          <span>{new Date(review.createdAt).toLocaleString()}</span>
          {review.aiModel && (
            <>
              <span>·</span>
              <span className="font-mono">{review.aiModel}</span>
            </>
          )}
        </div>
        <p className="text-sm text-gray-200">{review.summary}</p>
        {Object.keys(counts).length > 0 && (
          <div className="flex gap-2 mt-3">
            {(['critical', 'high', 'medium', 'low'] as const).map(
              (sev) => counts[sev] && (
                <span key={sev} className="text-xs text-gray-400">
                  <SeverityBadge severity={sev} /> ×{counts[sev]}
                </span>
              ),
            )}
          </div>
        )}
      </div>

      {sortedIssues.length === 0 ? (
        <p className="text-sm text-gray-500 py-6 text-center">No significant issues found for this review mode. 🎉</p>
      ) : (
        <div className="space-y-3">
          {sortedIssues.map((issue) => (
            <div key={issue.id} className="bg-panel border border-border rounded-xl p-4">
              <div className="flex items-start justify-between gap-3">
                <h4 className="text-sm font-medium text-white">{issue.title}</h4>
                <SeverityBadge severity={issue.severity} />
              </div>
              {(issue.filePath || issue.lineHint) && (
                <p className="text-xs text-gray-500 font-mono mt-1">
                  {issue.filePath}
                  {issue.lineHint ? ` — ${issue.lineHint}` : ''}
                </p>
              )}
              <p className="text-sm text-gray-400 mt-2">{issue.description}</p>
              {issue.recommendation && (
                <div className="mt-2 text-sm bg-accent/5 border border-accent/20 rounded-lg px-3 py-2">
                  <span className="text-accent text-xs font-medium">Recommendation: </span>
                  <span className="text-gray-300">{issue.recommendation}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {review.generalRecommendations.length > 0 && (
        <div className="bg-panel border border-border rounded-xl p-4">
          <h4 className="text-sm font-medium text-white mb-2">General recommendations</h4>
          <ul className="list-disc list-inside text-sm text-gray-400 space-y-1">
            {review.generalRecommendations.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
