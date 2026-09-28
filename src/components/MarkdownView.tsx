'use client';

import { useMemo } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

/**
 * Renders AI-generated Markdown (Architecture Analysis, generated docs) as
 * actual formatted HTML instead of a raw-text <pre> block — headings,
 * lists, code blocks, tables, etc. all render naturally. Output is passed
 * through DOMPurify before being injected: this content originates from an
 * AI provider response, which is untrusted input as far as the frontend is
 * concerned, so it's sanitized the same way any external HTML would be.
 */
export default function MarkdownView({ markdown }: { markdown: string }) {
  const html = useMemo(() => {
    const raw = marked.parse(markdown, { async: false, breaks: true, gfm: true }) as string;
    return DOMPurify.sanitize(raw);
  }, [markdown]);

  return (
    <div
      className="prose prose-sm max-w-none prose-headings:font-semibold prose-pre:border prose-pre:border-border prose-img:rounded-lg"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
