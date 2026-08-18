'use client';

import React, { useMemo, useState } from 'react';
import { useApp } from '@/lib/store';
import { MasonryGrid } from '@/components/ui/MasonryGrid';
import { ViewHeader } from '@/components/ui/ViewHeader';
import { AddBookmarkModal } from '@/components/ui/AddBookmarkModal';
import { ReaderView } from '@/components/reader/ReaderView';
import { TriageView } from './TriageView';
import { useKeyboardNav } from '@/hooks/useKeyboardNav';

export function BookmarksView() {
  const { activeView, activeCollectionId, bookmarks, triageMode, setTriageMode } = useApp();
  const [addModalOpen, setAddModalOpen] = useState(false);

  const isReader = activeView === 'reader';
  const isTriage = triageMode && activeView === 'inbox';

  const filteredBookmarks = useMemo(() => {
    switch (activeView) {
      case 'inbox':
        return bookmarks.filter((b) => b.status === 'inbox');
      case 'pinned':
        return bookmarks.filter((b) => b.isPinned);
      case 'archive':
        return bookmarks.filter((b) => b.status === 'archived');
      case 'trash':
        return bookmarks.filter((b) => b.status === 'trash');
      case 'collection':
        return bookmarks.filter((b) => b.collectionId === activeCollectionId);
      case 'reader':
        return [];
      default:
        return bookmarks;
    }
  }, [activeView, activeCollectionId, bookmarks]);

  useKeyboardNav(filteredBookmarks);

  if (isReader) {
    return <ReaderView />;
  }

  if (isTriage) {
    return <TriageView />;
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <ViewHeader
        onAdd={() => setAddModalOpen(true)}
        onTriage={() => setTriageMode(true)}
      />
      <div className="flex-1 overflow-y-auto pb-20 md:pb-0">
        <MasonryGrid bookmarks={filteredBookmarks} />
      </div>
      <AddBookmarkModal open={addModalOpen} onClose={() => setAddModalOpen(false)} />
    </div>
  );
}
