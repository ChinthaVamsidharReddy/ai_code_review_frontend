'use client';

import { useRef, useState } from 'react';
import { api, ApiError } from '@/lib/api';
import { useToast } from '@/components/Toast';
import Spinner from '@/components/Spinner';

export default function UploadPanel({ projectId, onUploaded }: { projectId: string; onUploaded: () => void }) {
  const { showToast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function upload(file: File) {
    if (!file.name.toLowerCase().endsWith('.zip')) {
      showToast('Only .zip archives are supported', 'error');
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await api.upload<{ fileCount: number }>(`/projects/${projectId}/files/upload/zip`, formData);
      showToast(`Uploaded ${res.fileCount} file(s)`, 'success');
      onUploaded();
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : 'Upload failed', 'error');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file) upload(file);
      }}
      onClick={() => inputRef.current?.click()}
      className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
        dragOver ? 'border-accent bg-accent/5' : 'border-border hover:border-muted-2'
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".zip"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) upload(file);
          e.target.value = '';
        }}
      />
      {uploading ? (
        <div className="flex items-center justify-center gap-2 text-sm text-muted">
          <Spinner /> Extracting and indexing…
        </div>
      ) : (
        <>
          <p className="text-sm text-fg">Drop a .zip archive here, or click to browse</p>
          <p className="text-xs text-muted-2 mt-1">Re-uploading replaces this project's current files</p>
        </>
      )}
    </div>
  );
}
