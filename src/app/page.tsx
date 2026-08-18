'use client';

import React, { useEffect } from 'react';
import { AppProvider, useApp } from '@/lib/store';
import { AppShell } from '@/components/layout/AppShell';
import { BookmarksView } from '@/components/views/BookmarksView';
import { CursorHighlight } from '@/components/layout/CursorHighlight';
import { mockBookmarks, mockCollections, mockTags } from '@/lib/mock-data';

function AppInit() {
  const { setBookmarks, setCollections, setTags } = useApp();

  useEffect(() => {
    setBookmarks(mockBookmarks);
    setCollections(mockCollections);
    setTags(mockTags);
  }, [setBookmarks, setCollections, setTags]);

  return null;
}

function AppContent() {
  return (
    <>
      <AppInit />
      <CursorHighlight />
      <AppShell>
        <BookmarksView />
      </AppShell>
    </>
  );
}

export default function Home() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
