'use client';

import { useEffect, useCallback, useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { MobileNav } from '@/components/layout/MobileNav';
import { CommandPalette } from '@/components/ui/CommandPalette';
import { AddBookmarkModal } from '@/components/ui/AddBookmarkModal';
import { useApp } from '@/lib/store';
import { palette } from '@/lib/tokens';

export function AppShell({ children }: { children: React.ReactNode }) {
  const { toggleCommandPalette, commandPaletteOpen } = useApp();
  const [addModalOpen, setAddModalOpen] = useState(false);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        toggleCommandPalette();
      }
      if (e.key === 'Escape' && commandPaletteOpen) {
        toggleCommandPalette();
      }
    },
    [toggleCommandPalette, commandPaletteOpen]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div
      className="flex h-screen w-screen overflow-hidden relative"
      style={{ backgroundColor: palette.bgGround }}
    >
      {/* Ambient background glow */}
      <div className="ambient-glow" />

      {/* Desktop sidebar */}
      <div className="hidden md:flex relative z-10">
        <Sidebar />
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-hidden relative z-10 flex flex-col">
        {children}
      </main>

      {/* Mobile bottom nav */}
      <div className="md:hidden relative z-10">
        <MobileNav onAdd={() => setAddModalOpen(true)} />
      </div>

      <CommandPalette />
      <AddBookmarkModal open={addModalOpen} onClose={() => setAddModalOpen(false)} />
    </div>
  );
}
