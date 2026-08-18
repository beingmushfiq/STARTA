'use client';

import { useEffect, useCallback } from 'react';
import { useApp } from '@/lib/store';

export function useKeyboardNav(filteredBookmarks: { id: string }[]) {
  const {
    focusedIndex,
    setFocusedIndex,
    selectBookmark,
    toggleCommandPalette,
    setActiveView,
    activeView,
    updateBookmark,
  } = useApp();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Ignore if inside an input or command palette is open
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) return;

      switch (e.key) {
        case 'j':
        case 'ArrowDown':
          e.preventDefault();
          setFocusedIndex(Math.min(focusedIndex + 1, filteredBookmarks.length - 1));
          break;
        case 'k':
        case 'ArrowUp':
          if (!e.metaKey && !e.ctrlKey) {
            e.preventDefault();
            setFocusedIndex(Math.max(focusedIndex - 1, 0));
          }
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          if (filteredBookmarks[focusedIndex]) {
            selectBookmark(filteredBookmarks[focusedIndex].id);
            setActiveView('reader');
          }
          break;
        case 'e':
          if (filteredBookmarks[focusedIndex]) {
            updateBookmark(filteredBookmarks[focusedIndex].id, { status: 'archived' });
          }
          break;
        case 'Delete':
        case 'Backspace':
          if (filteredBookmarks[focusedIndex]) {
            updateBookmark(filteredBookmarks[focusedIndex].id, { status: 'trash' });
          }
          break;
        case 'o':
          if (filteredBookmarks[focusedIndex]) {
            const b = filteredBookmarks[focusedIndex];
            window.open(`/api/bookmarks/${b.id}/url`, '_blank');
          }
          break;
        case 'c':
          if (!e.metaKey && !e.ctrlKey) {
            // Open collection selector
          }
          break;
        case 't':
          if (!e.metaKey && !e.ctrlKey) {
            // Focus tag input
          }
          break;
      }
    },
    [focusedIndex, filteredBookmarks, setFocusedIndex, selectBookmark, toggleCommandPalette, setActiveView, updateBookmark]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
