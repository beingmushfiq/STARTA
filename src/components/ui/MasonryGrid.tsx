'use client';

import { BookmarkCard } from './BookmarkCard';
import type { Bookmark } from '@/lib/types';
import { useApp } from '@/lib/store';
import { palette, typography } from '@/lib/tokens';
import { Inbox } from 'lucide-react';
import { motion } from 'framer-motion';

interface MasonryGridProps {
  bookmarks: Bookmark[];
}

export function MasonryGrid({ bookmarks }: MasonryGridProps) {
  const { selectBookmark, setActiveView } = useApp();

  if (bookmarks.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center h-96 gap-5"
      >
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center"
          style={{
            backgroundColor: palette.accentPrimaryDim,
            border: `1px solid ${palette.accentPrimary}20`,
          }}
        >
          <Inbox size={24} style={{ color: palette.accentPrimary }} />
        </div>
        <div className="text-center space-y-1.5">
          <p
            className="text-sm font-medium"
            style={{ fontFamily: typography.ui, color: palette.textPrimary }}
          >
            Your inbox is empty
          </p>
          <p
            className="text-xs"
            style={{ fontFamily: typography.mono, color: palette.textMuted }}
          >
            Press{' '}
            <kbd
              className="px-1.5 py-0.5 rounded"
              style={{
                backgroundColor: 'rgba(255,255,255,0.05)',
                border: `0.5px solid ${palette.borderSubtle}`,
              }}
            >
              ⌘K
            </kbd>{' '}
            to add your first bookmark
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="p-5 sm:p-6">
      <div
        className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4"
        style={{ columnFill: 'balance' }}
      >
        {bookmarks.map((bookmark, i) => (
          <div key={bookmark.id} className="mb-4 break-inside-avoid">
            <BookmarkCard
              bookmark={bookmark}
              index={i}
              onSelect={(id) => {
                selectBookmark(id);
                setActiveView('reader');
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
