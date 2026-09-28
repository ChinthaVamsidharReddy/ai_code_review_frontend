'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import TopNav from '@/components/TopNav';
import Spinner from '@/components/Spinner';
import { useToast } from '@/components/Toast';
import { api, ApiError } from '@/lib/api';
import { Project, TreeNode } from '@/types/api';
import FileTree from '@/components/project/FileTree';
import CodeViewer from '@/components/project/CodeViewer';
import UploadPanel from '@/components/project/UploadPanel';
import ReviewPanel from '@/components/project/ReviewPanel';
import ReviewHistoryPanel from '@/components/project/ReviewHistoryPanel';
import ChatPanel from '@/components/project/ChatPanel';
import DocsPanel from '@/components/project/DocsPanel';

type Tab = 'explorer' | 'review' | 'history' | 'chat' | 'docs';

const TABS: { id: Tab; label: string }[] = [
  { id: 'explorer', label: 'Code Explorer' },
  { id: 'review', label: 'Run Review' },
  { id: 'history', label: 'Review History' },
  { id: 'chat', label: 'Chat with Code' },
  { id: 'docs', label: 'Docs & Architecture' },
];

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>();
  const projectId = params.id;
  const { showToast } = useToast();

  const [project, setProject] = useState<Project | null>(null);
  const [tree, setTree] = useState<TreeNode[]>([]);
  const [tab, setTab] = useState<Tab>('explorer');
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadAll() {
    try {
      const [p, t] = await Promise.all([
        api.get<Project>(`/projects/${projectId}`),
        api.get<TreeNode[]>(`/projects/${projectId}/files/tree`),
      ]);
      setProject(p);
      setTree(t);
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : 'Failed to load project', 'error');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  return (
    <ProtectedRoute>
      <TopNav crumb={project?.name} />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {loading ? (
          <div className="flex justify-center py-24 text-muted">
            <Spinner className="w-6 h-6" />
          </div>
        ) : !project ? (
          <p className="text-muted text-sm">Project not found.</p>
        ) : (
          <>
            <div className="mb-6">
              <h1 className="text-xl font-semibold text-fg">{project.name}</h1>
              {project.description && <p className="text-sm text-muted mt-1">{project.description}</p>}
            </div>

            <div className="flex gap-1 border-b border-border mb-6 overflow-x-auto">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`px-4 py-2.5 text-sm whitespace-nowrap border-b-2 -mb-px transition-colors ${
                    tab === t.id ? 'border-accent text-fg' : 'border-transparent text-muted hover:text-fg'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {tab === 'explorer' && (
              <div>
                <div className="mb-4">
                  <UploadPanel projectId={projectId} onUploaded={loadAll} />
                </div>
                {tree.length === 0 ? (
                  <p className="text-sm text-muted-2 text-center py-16">No files uploaded yet. Drop a ZIP archive above to get started.</p>
                ) : (
                  <div className="grid md:grid-cols-[280px_1fr] gap-0 md:gap-4 h-[70vh] max-h-[640px] md:h-[560px] border border-border rounded-xl overflow-hidden">
                    <div className="overflow-auto border-b md:border-b-0 md:border-r border-border py-2 max-h-[40vh] md:max-h-none">
                      <FileTree
                        nodes={tree}
                        selectedFileId={selectedFileId}
                        onSelectFile={(fileId, path) => {
                          setSelectedFileId(fileId);
                          setSelectedPath(path);
                        }}
                      />
                    </div>
                    <div className="flex flex-col overflow-hidden">
                      <CodeViewer projectId={projectId} fileId={selectedFileId} path={selectedPath} />
                    </div>
                  </div>
                )}
              </div>
            )}

            {tab === 'review' &&
              (tree.length === 0 ? (
                <p className="text-sm text-muted-2 text-center py-16">Upload code first to request a review.</p>
              ) : (
                <ReviewPanel projectId={projectId} tree={tree} />
              ))}

            {tab === 'history' && <ReviewHistoryPanel projectId={projectId} />}

            {tab === 'chat' &&
              (tree.length === 0 ? (
                <p className="text-sm text-muted-2 text-center py-16">Upload code first to chat with it.</p>
              ) : (
                <ChatPanel projectId={projectId} />
              ))}

            {tab === 'docs' &&
              (tree.length === 0 ? (
                <p className="text-sm text-muted-2 text-center py-16">Upload code first to generate documentation.</p>
              ) : (
                <DocsPanel projectId={projectId} />
              ))}
          </>
        )}
      </main>
    </ProtectedRoute>
  );
}
