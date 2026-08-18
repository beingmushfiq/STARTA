'use client';

import { BookmarkCard } from './BookmarkCard';
import type { Bookmark } from '@/lib/types';
import { useApp } from '@/lib/store';
import { palette, typography } from '@/lib/tokens';
import { Inbox, Clock, ExternalLink, Archive, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface MasonryGridProps {
  bookmarks: Bookmark[];
}

function BookmarkListItem({
  bookmark,
  index,
  onSelect,
}: {
  bookmark: Bookmark;
  index: number;
  onSelect?: (id: string) => void;
}) {
  const { updateBookmark, removeBookmark } = useApp();

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03, duration: 0.3 }}
      className="group flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 hover:bg-white/[0.03]"
      style={{ borderBottom: `1px solid ${palette.borderSubtle}` }}
      onClick={() => onSelect?.(bookmark.id)}
    >
      {/* Thumbnail */}
      {bookmark.coverImageUrl ? (
        <div className="relative w-16 h-12 rounded-lg overflow-hidden shrink-0">
          <Image
            src={bookmark.coverImageUrl}
            alt=""
            fill
            className="object-cover"
            sizes="64px"
            unoptimized
          />
        </div>
      ) : (
        <div
          className="w-16 h-12 rounded-lg shrink-0 flex items-center justify-center"
          style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}
        >
          <Inbox size={16} style={{ color: palette.textMuted }} />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h4
          className="text-sm font-medium truncate"
          style={{ fontFamily: typography.ui, color: palette.textPrimary }}
        >
          {bookmark.title}
        </h4>
        <div className="flex items-center gap-2 mt-0.5">
          <span
            className="text-[11px] uppercase tracking-wider"
            style={{ fontFamily: typography.mono, color: palette.textMuted }}
          >
            {bookmark.domain}
          </span>
          <span className="text-[10px]" style={{ color: palette.textMuted, opacity: 0.5 }}>·</span>
          <span
            className="text-[11px] flex items-center gap-1"
            style={{ fontFamily: typography.mono, color: palette.textMuted }}
          >
            <Clock size={10} />
            {bookmark.readingTimeMinutes}m
          </span>
        </div>
      </div>

      {/* Tags */}
      {bookmark.tags.length > 0 && (
        <div className="hidden md:flex items-center gap-1.5">
          {bookmark.tags.slice(0, 2).map((tag) => (
            <span
              key={tag.id}
              className="px-2 py-0.5 rounded-full text-[10px]"
              style={{
                fontFamily: typography.mono,
                backgroundColor: 'rgba(255,255,255,0.04)',
                color: palette.textMuted,
              }}
            >
              {tag.name}
            </span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          title="Open"
          className="p-1.5 rounded-lg hover:bg-white/5"
          style={{ color: palette.textSecondary }}
          onClick={(e) => { e.stopPropagation(); window.open(bookmark.url, '_blank'); }}
        >
          <ExternalLink size={14} />
        </button>
        <button
          title="Archive"
          className="p-1.5 rounded-lg hover:bg-white/5"
          style={{ color: palette.textSecondary }}
          onClick={(e) => {
            e.stopPropagation();
            updateBookmark(bookmark.id, { status: 'archived' });
          }}
        >
          <Archive size={14} />
        </button>
        <button
          title="Delete"
          className="p-1.5 rounded-lg hover:bg-white/5"
          style={{ color: palette.textSecondary }}
          onClick={(e) => {
            e.stopPropagation();
            updateBookmark(bookmark.id, { status: 'trash' });
          }}
        >
          <Trash2 size={14} />
        </button>
      </div>
    </motion.div>
  );
}

export function MasonryGrid({ bookmarks }: MasonryGridProps) {
  const { selectBookmark, setActiveView, viewMode } = useApp();

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

  const handleSelect = (id: string) => {
    selectBookmark(id);
    setActiveView('reader');
  };

  // List view
  if (viewMode === 'list') {
    return (
      <div className="p-5 sm:p-6">
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            backgroundColor: palette.surfaceBase,
            border: `1px solid ${palette.borderSubtle}`,
          }}
        >
          {bookmarks.map((bookmark, i) => (
            <BookmarkListItem
              key={bookmark.id}
              bookmark={bookmark}
              index={i}
              onSelect={handleSelect}
            />
          ))}
        </div>
      </div>
    );
  }

  // Grid view (masonry)
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
              onSelect={handleSelect}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
