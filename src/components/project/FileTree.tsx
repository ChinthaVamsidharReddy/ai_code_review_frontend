'use client';

import { useState } from 'react';
import clsx from 'clsx';
import { TreeNode } from '@/types/api';

interface Props {
  nodes: TreeNode[];
  selectedFileId?: string | null;
  onSelectFile: (fileId: string, path: string) => void;
  multiSelect?: boolean;
  selectedIds?: Set<string>;
  onToggleSelect?: (fileId: string, path: string) => void;
  depth?: number;
}

export default function FileTree({ nodes, selectedFileId, onSelectFile, multiSelect, selectedIds, onToggleSelect, depth = 0 }: Props) {
  return (
    <div>
      {nodes.map((node) => (
        <TreeItem
          key={node.path}
          node={node}
          selectedFileId={selectedFileId}
          onSelectFile={onSelectFile}
          multiSelect={multiSelect}
          selectedIds={selectedIds}
          onToggleSelect={onToggleSelect}
          depth={depth}
        />
      ))}
    </div>
  );
}

function TreeItem({ node, selectedFileId, onSelectFile, multiSelect, selectedIds, onToggleSelect, depth }: Props & { node: TreeNode }) {
  const [open, setOpen] = useState(depth < 1);

  if (node.type === 'folder') {
    return (
      <div>
        <button
          onClick={() => setOpen((v) => !v)}
          className="w-full flex items-center gap-1.5 px-2 py-1 text-sm text-gray-400 hover:text-white rounded"
          style={{ paddingLeft: 8 + depth * 14 }}
        >
          <span className="text-xs w-3">{open ? '▾' : '▸'}</span>
          <span className="truncate">{node.name}</span>
        </button>
        {open && node.children && (
          <FileTree
            nodes={node.children}
            selectedFileId={selectedFileId}
            onSelectFile={onSelectFile}
            multiSelect={multiSelect}
            selectedIds={selectedIds}
            onToggleSelect={onToggleSelect}
            depth={depth + 1}
          />
        )}
      </div>
    );
  }

  const isSelected = node.fileId === selectedFileId;
  const isChecked = node.fileId && selectedIds?.has(node.fileId);

  return (
    <div
      className={clsx(
        'flex items-center gap-1.5 px-2 py-1 text-sm rounded cursor-pointer group',
        isSelected ? 'bg-accent/15 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5',
      )}
      style={{ paddingLeft: 8 + depth * 14 }}
      onClick={() => node.fileId && onSelectFile(node.fileId, node.path)}
    >
      {multiSelect && (
        <input
          type="checkbox"
          checked={!!isChecked}
          onChange={(e) => {
            e.stopPropagation();
            node.fileId && onToggleSelect?.(node.fileId, node.path);
          }}
          onClick={(e) => e.stopPropagation()}
          className="mr-1"
        />
      )}
      <span className="truncate flex-1">{node.name}</span>
      {node.isBinary && <span className="text-[10px] text-gray-600">bin</span>}
    </div>
  );
}
