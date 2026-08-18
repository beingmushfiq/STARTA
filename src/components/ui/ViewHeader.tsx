'use client';

import { useApp } from '@/lib/store';
import { palette, typography } from '@/lib/tokens';
import { Search, LayoutGrid, LayoutList, Plus, Zap } from 'lucide-react';

interface ViewHeaderProps {
  onAdd?: () => void;
  onTriage?: () => void;
}

export function ViewHeader({ onAdd, onTriage }: ViewHeaderProps) {
  const {
    activeView,
    activeCollectionId,
    collections,
    bookmarks,
    toggleCommandPalette,
  } = useApp();

  const labels: Record<string, string> = {
    inbox: 'Inbox',
    pinned: 'Pinned',
    reader: 'Reader',
    archive: 'Archive',
    trash: 'Trash',
    collection: '',
    search: 'Search',
  };

  const viewLabel =
    activeView === 'collection'
      ? collections.find((c) => c.id === activeCollectionId)?.name || 'Collection'
      : labels[activeView] || 'Bookmarks';

  const filteredCount = bookmarks.filter((b) => {
    if (activeView === 'inbox') return b.status === 'inbox';
    if (activeView === 'pinned') return b.isPinned;
    if (activeView === 'archive') return b.status === 'archived';
    if (activeView === 'collection') return b.collectionId === activeCollectionId;
    return true;
  }).length;

  return (
    <div
      className="flex items-center justify-between px-6 h-16 shrink-0"
      style={{ borderBottom: `1px solid ${palette.borderSubtle}` }}
    >
      {/* Left: View title + count badge */}
      <div className="flex items-center gap-3">
        <h1
          className="text-lg font-bold tracking-tight"
          style={{ fontFamily: typography.ui, color: palette.textPrimary }}
        >
          {viewLabel}
        </h1>
        <span
          className="text-[11px] px-2 py-0.5 rounded-full font-medium tabular-nums"
          style={{
            fontFamily: typography.mono,
            backgroundColor: 'rgba(255,255,255,0.05)',
            color: palette.textMuted,
          }}
        >
          {filteredCount}
        </span>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1.5">
        {/* Search */}
        <button
          onClick={toggleCommandPalette}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all duration-200 hover:bg-white/5 active:scale-[0.97]"
          style={{
            fontFamily: typography.ui,
            color: palette.textSecondary,
            border: `1px solid ${palette.borderSubtle}`,
          }}
        >
          <Search size={14} />
          <span className="hidden sm:inline">Search</span>
          <kbd
            className="text-[10px] ml-0.5 px-1.5 py-0.5 rounded font-medium"
            style={{
              fontFamily: typography.mono,
              color: palette.textMuted,
              backgroundColor: 'rgba(255,255,255,0.04)',
            }}
          >
            ⌘K
          </kbd>
        </button>

        {/* Grid view */}
        <button
          className="p-2 rounded-lg transition-all duration-200 hover:bg-white/5 active:scale-[0.95]"
          style={{ color: palette.textSecondary }}
        >
          <LayoutGrid size={16} />
        </button>

        {/* List view */}
        <button
          className="p-2 rounded-lg transition-all duration-200 hover:bg-white/5 active:scale-[0.95]"
          style={{ color: palette.textMuted }}
        >
          <LayoutList size={16} />
        </button>

        {/* Triage — inbox only */}
        {activeView === 'inbox' && onTriage && (
          <button
            onClick={onTriage}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-white/5 active:scale-[0.97]"
            style={{
              fontFamily: typography.ui,
              color: palette.accentSecondary,
              border: `1px solid ${palette.accentSecondary}30`,
            }}
          >
            <Zap size={14} />
            <span className="hidden sm:inline">Triage</span>
          </button>
        )}

        {/* Add — amber */}
        <button
          onClick={onAdd}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 hover:brightness-110 active:scale-[0.97]"
          style={{
            fontFamily: typography.ui,
            backgroundColor: '#FF5500',
            color: '#fff',
          }}
        >
          <Plus size={14} />
          <span className="hidden sm:inline">Add</span>
        </button>
      </div>
    </div>
  );
}
