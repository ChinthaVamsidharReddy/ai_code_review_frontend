'use client';

import { useEffect, useRef, useState } from 'react';
import { api, ApiError } from '@/lib/api';
import { useToast } from '@/components/Toast';
import Spinner from '@/components/Spinner';
import { ChatMessage, ChatSession } from '@/types/api';

export default function ChatPanel({ projectId }: { projectId: string }) {
  const { showToast } = useToast();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [question, setQuestion] = useState('');
  const [asking, setAsking] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  async function loadSessions() {
    try {
      const res = await api.get<ChatSession[]>(`/projects/${projectId}/chat/sessions`);
      setSessions(res);
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : 'Failed to load chat sessions', 'error');
    }
  }

  async function loadMessages(sessionId: string) {
    try {
      const res = await api.get<ChatMessage[]>(`/projects/${projectId}/chat/sessions/${sessionId}/messages`);
      setMessages(res);
      setActiveSessionId(sessionId);
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : 'Failed to load messages', 'error');
    }
  }

  useEffect(() => {
    loadSessions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function ask(e: React.FormEvent) {
    e.preventDefault();
    if (!question.trim()) return;
    setAsking(true);
    const q = question;
    setQuestion('');
    // Optimistically show the user's question immediately.
    setMessages((prev) => [
      ...prev,
      { id: `temp-${Date.now()}`, sessionId: activeSessionId ?? '', role: 'user', content: q, contextFilePaths: [], createdAt: new Date().toISOString() },
    ]);
    try {
      const res = await api.post<{ session: ChatSession; assistantMessage: ChatMessage }>(`/projects/${projectId}/chat/ask`, {
        question: q,
        sessionId: activeSessionId ?? undefined,
      });
      setActiveSessionId(res.session.id);
      await loadMessages(res.session.id);
      loadSessions();
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : 'Failed to send message', 'error');
    } finally {
      setAsking(false);
    }
  }

  return (
    <div className="grid md:grid-cols-[220px_1fr] gap-3 md:gap-4 h-[70vh] max-h-[640px] md:h-[560px]">
      <div className="border border-border rounded-xl overflow-auto">
        <button
          onClick={() => {
            setActiveSessionId(null);
            setMessages([]);
          }}
          className="w-full text-left text-sm px-3 py-2.5 border-b border-border text-accent hover:bg-fg/5"
        >
          + New chat
        </button>
        {sessions.map((s) => (
          <button
            key={s.id}
            onClick={() => loadMessages(s.id)}
            className={`w-full text-left text-sm px-3 py-2.5 border-b border-border truncate ${
              s.id === activeSessionId ? 'bg-accent/10 text-fg' : 'text-muted hover:text-fg'
            }`}
          >
            {s.title}
          </button>
        ))}
      </div>

      <div className="border border-border rounded-xl flex flex-col">
        <div className="flex-1 overflow-auto p-4 space-y-3">
          {messages.length === 0 && (
            <p className="text-sm text-muted-2 text-center py-12">
              Ask something about this codebase — e.g. &ldquo;How does authentication work?&rdquo;
            </p>
          )}
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[80%] rounded-xl px-3 py-2 text-sm whitespace-pre-wrap ${
                  m.role === 'user' ? 'bg-accent text-white' : 'bg-panel border border-border text-fg'
                }`}
              >
                {m.content}
                {m.contextFilePaths.length > 0 && (
                  <p className="text-[11px] opacity-60 mt-1.5 font-mono">context: {m.contextFilePaths.join(', ')}</p>
                )}
              </div>
            </div>
          ))}
          {asking && (
            <div className="flex justify-start">
              <div className="bg-panel border border-border rounded-xl px-3 py-2 text-sm text-muted flex items-center gap-2">
                <Spinner /> Thinking…
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
        <form onSubmit={ask} className="border-t border-border p-3 flex gap-2">
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask about this codebase…"
            className="flex-1 bg-surface border border-border rounded-lg px-3 py-2 text-sm"
          />
          <button
            type="submit"
            disabled={asking}
            className="bg-accent hover:bg-accent/90 disabled:opacity-60 text-white text-sm font-medium px-4 py-2 rounded-lg"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
