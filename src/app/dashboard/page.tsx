'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import TopNav from '@/components/TopNav';
import EmptyState from '@/components/EmptyState';
import Spinner from '@/components/Spinner';
import { useToast } from '@/components/Toast';
import { api, ApiError } from '@/lib/api';
import { Paginated, Project } from '@/types/api';

export default function DashboardPage() {
  const { showToast } = useToast();
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [creating, setCreating] = useState(false);

  async function load(q?: string) {
    try {
      const res = await api.get<Paginated<Project>>(`/projects${q ? `?search=${encodeURIComponent(q)}` : ''}`);
      setProjects(res.items);
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : 'Failed to load projects', 'error');
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    try {
      await api.post('/projects', { name, description: description || undefined });
      showToast('Project created', 'success');
      setShowCreate(false);
      setName('');
      setDescription('');
      load();
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : 'Failed to create project', 'error');
    } finally {
      setCreating(false);
    }
  }

  async function onDelete(id: string) {
    if (!confirm('Delete this project? This cannot be undone.')) return;
    try {
      await api.del(`/projects/${id}`);
      showToast('Project deleted', 'success');
      load(search);
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : 'Failed to delete project', 'error');
    }
  }

  return (
    <ProtectedRoute>
      <TopNav />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-fg">Projects</h1>
            <p className="text-sm text-muted mt-1">Upload code, request AI reviews, and chat with your codebase.</p>
          </div>
          <button
            onClick={() => setShowCreate((v) => !v)}
            className="bg-accent hover:bg-accent/90 text-white text-sm font-medium px-4 py-2 rounded-lg"
          >
            + New project
          </button>
        </div>

        {showCreate && (
          <form onSubmit={onCreate} className="bg-panel border border-border rounded-xl p-5 mb-6 space-y-3">
            <input
              required
              placeholder="Project name (e.g. Portfolio Website)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <textarea
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <div className="flex gap-2 justify-end">
              <button type="button" onClick={() => setShowCreate(false)} className="text-sm text-muted px-3 py-2">
                Cancel
              </button>
              <button
                type="submit"
                disabled={creating}
                className="bg-accent hover:bg-accent/90 disabled:opacity-60 text-white text-sm font-medium px-4 py-2 rounded-lg flex items-center gap-2"
              >
                {creating && <Spinner />}
                Create
              </button>
            </div>
          </form>
        )}

        <input
          placeholder="Search projects…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            load(e.target.value);
          }}
          className="w-full bg-panel border border-border rounded-lg px-3 py-2 text-sm mb-6 focus:outline-none focus:ring-2 focus:ring-accent"
        />

        {projects === null ? (
          <div className="flex justify-center py-16 text-muted">
            <Spinner className="w-6 h-6" />
          </div>
        ) : projects.length === 0 ? (
          <EmptyState title="No projects yet" description="Create a project to upload code and start requesting AI reviews." />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((p) => (
              <div key={p.id} className="bg-panel border border-border rounded-xl p-4 hover:border-accent/50 transition-colors group">
                <Link href={`/projects/${p.id}`}>
                  <h3 className="font-medium text-fg truncate">{p.name}</h3>
                  <p className="text-sm text-muted mt-1 line-clamp-2 h-10">{p.description || 'No description'}</p>
                  <p className="text-xs text-muted-2 mt-3">Created {new Date(p.createdAt).toLocaleDateString()}</p>
                </Link>
                <button
                  onClick={() => onDelete(p.id)}
                  className="mt-3 text-xs text-muted-2 hover:text-critical transition-colors opacity-0 group-hover:opacity-100"
                >
                  Delete project
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </ProtectedRoute>
  );
}
