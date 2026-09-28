'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import TopNav from '@/components/TopNav';
import EmptyState from '@/components/EmptyState';
import Spinner from '@/components/Spinner';
import { useToast } from '@/components/Toast';
import { api, ApiError } from '@/lib/api';
import { AiProvider } from '@/types/api';

const PROVIDER_PRESETS: Record<string, { baseUrl: string; hint: string }> = {
  openai: { baseUrl: 'https://api.openai.com/v1', hint: 'Requires a paid OpenAI API key' },
  openrouter: { baseUrl: 'https://openrouter.ai/api/v1', hint: 'Has free models — get a key at openrouter.ai' },
  'lm-studio': { baseUrl: 'http://localhost:1234/v1', hint: 'Run LM Studio locally with a model loaded; no API key needed' },
  ollama: { baseUrl: 'http://localhost:11434/v1', hint: 'Run `ollama serve`; no API key needed' },
  custom: { baseUrl: '', hint: 'Any OpenAI-compatible /chat/completions endpoint' },
};

export default function ProvidersPage() {
  const { showToast } = useToast();
  const [providers, setProviders] = useState<AiProvider[] | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    providerType: 'openrouter',
    baseUrl: PROVIDER_PRESETS.openrouter.baseUrl,
    apiKey: '',
    model: '',
    isDefault: false,
  });

  async function load() {
    try {
      setProviders(await api.get<AiProvider[]>('/ai-providers'));
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : 'Failed to load providers', 'error');
    }
  }

  useEffect(() => {
    load();
  }, []);

  function onTypeChange(providerType: string) {
    setForm((f) => ({ ...f, providerType, baseUrl: PROVIDER_PRESETS[providerType]?.baseUrl ?? f.baseUrl }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/ai-providers', form);
      showToast('Provider added', 'success');
      setShowForm(false);
      setForm({ name: '', providerType: 'openrouter', baseUrl: PROVIDER_PRESETS.openrouter.baseUrl, apiKey: '', model: '', isDefault: false });
      load();
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : 'Failed to add provider', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  async function onDelete(id: string) {
    if (!confirm('Remove this AI provider?')) return;
    try {
      await api.del(`/ai-providers/${id}`);
      load();
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : 'Failed to remove provider', 'error');
    }
  }

  async function onToggleEnabled(p: AiProvider) {
    try {
      await api.patch(`/ai-providers/${p.id}`, { enabled: !p.enabled });
      load();
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : 'Failed to update provider', 'error');
    }
  }

  async function onSetDefault(p: AiProvider) {
    try {
      await api.patch(`/ai-providers/${p.id}`, { isDefault: true });
      showToast(`"${p.name}" is now the default provider`, 'success');
      load();
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : 'Failed to update provider', 'error');
    }
  }

  return (
    <ProtectedRoute>
      <TopNav crumb="AI Providers" />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-fg">AI Providers</h1>
            <p className="text-sm text-muted mt-1">
              Configure any OpenAI-compatible endpoint — cloud or local. Nothing is hardcoded; API keys are encrypted at rest.
            </p>
          </div>
          <button
            onClick={() => setShowForm((v) => !v)}
            className="bg-accent hover:bg-accent/90 text-white text-sm font-medium px-4 py-2 rounded-lg"
          >
            + Add provider
          </button>
        </div>

        {showForm && (
          <form onSubmit={onSubmit} className="bg-panel border border-border rounded-xl p-5 mb-6 space-y-3">
            <input
              required
              placeholder="Label (e.g. OpenRouter — Llama 3.1 free)"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm"
            />
            <select
              value={form.providerType}
              onChange={(e) => onTypeChange(e.target.value)}
              className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm"
            >
              <option value="openai">OpenAI</option>
              <option value="openrouter">OpenRouter</option>
              <option value="lm-studio">LM Studio (local)</option>
              <option value="ollama">Ollama (local)</option>
              <option value="custom">Custom OpenAI-compatible</option>
            </select>
            <p className="text-xs text-muted">{PROVIDER_PRESETS[form.providerType]?.hint}</p>
            <input
              required
              placeholder="Base URL"
              value={form.baseUrl}
              onChange={(e) => setForm({ ...form, baseUrl: e.target.value })}
              className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm font-mono"
            />
            <input
              type="password"
              placeholder="API key (optional for local providers)"
              value={form.apiKey}
              onChange={(e) => setForm({ ...form, apiKey: e.target.value })}
              className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm"
            />
            <input
              required
              placeholder="Model name (e.g. meta-llama/llama-3.1-8b-instruct:free)"
              value={form.model}
              onChange={(e) => setForm({ ...form, model: e.target.value })}
              className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm font-mono"
            />
            <label className="flex items-center gap-2 text-sm text-muted">
              <input
                type="checkbox"
                checked={form.isDefault}
                onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}
              />
              Use as default provider
            </label>
            <div className="flex gap-2 justify-end">
              <button type="button" onClick={() => setShowForm(false)} className="text-sm text-muted px-3 py-2">
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="bg-accent hover:bg-accent/90 disabled:opacity-60 text-white text-sm font-medium px-4 py-2 rounded-lg flex items-center gap-2"
              >
                {submitting && <Spinner />}
                Save
              </button>
            </div>
          </form>
        )}

        {providers === null ? (
          <div className="flex justify-center py-16 text-muted">
            <Spinner className="w-6 h-6" />
          </div>
        ) : providers.length === 0 ? (
          <EmptyState
            title="No AI providers configured"
            description="Add OpenRouter, Groq, LM Studio, or any OpenAI-compatible endpoint to enable reviews and chat."
          />
        ) : (
          <div className="space-y-3">
            {providers.map((p) => (
              <div key={p.id} className="bg-panel border border-border rounded-xl p-4 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium text-fg text-sm flex items-center gap-2 flex-wrap">
                    {p.name}
                    {p.isDefault && <span className="text-xs bg-accent/20 text-accent px-2 py-0.5 rounded-full">default</span>}
                    {!p.enabled && <span className="text-xs bg-muted-2/20 text-muted px-2 py-0.5 rounded-full">disabled</span>}
                  </p>
                  <p className="text-xs text-muted mt-1 font-mono truncate">
                    {p.baseUrl} · {p.model} {p.hasApiKey ? '· key set' : '· no key'}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {!p.isDefault && (
                    <button onClick={() => onSetDefault(p)} className="text-xs text-muted hover:text-accent whitespace-nowrap">
                      Set default
                    </button>
                  )}
                  <button
                    onClick={() => onToggleEnabled(p)}
                    aria-label={p.enabled ? 'Disable provider' : 'Enable provider'}
                    className={`relative w-9 h-5 rounded-full transition-colors ${p.enabled ? 'bg-accent' : 'bg-muted-2/40'}`}
                  >
                    <span
                      className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                        p.enabled ? 'translate-x-[18px]' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                  <button onClick={() => onDelete(p.id)} className="text-xs text-muted hover:text-critical whitespace-nowrap">
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </ProtectedRoute>
  );
}
