'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/lib/store';
import { palette, spring, typography } from '@/lib/tokens';
import {
  Archive,
  Trash2,
  Tag,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Keyboard,
  Grip,
} from 'lucide-react';
import Image from 'next/image';

type SwipeResult = 'archived' | 'deleted' | null;

export function TriageView() {
  const { bookmarks, setActiveView, updateBookmark } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [swipeResult, setSwipeResult] = useState<SwipeResult>(null);

  const inboxBookmarks = bookmarks.filter((b) => b.status === 'inbox');
  const current = inboxBookmarks[currentIndex];

  const goNext = useCallback(() => {
    if (currentIndex < inboxBookmarks.length - 1) {
      setDirection(1);
      setCurrentIndex((i) => i + 1);
    }
  }, [currentIndex, inboxBookmarks.length]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex((i) => i - 1);
    }
  }, [currentIndex]);

  const archive = useCallback(() => {
    if (current) {
      setSwipeResult('archived');
      updateBookmark(current.id, { status: 'archived' });
      setTimeout(() => {
        setSwipeResult(null);
        goNext();
      }, 400);
    }
  }, [current, updateBookmark, goNext]);

  const trash = useCallback(() => {
    if (current) {
      setSwipeResult('deleted');
      updateBookmark(current.id, { status: 'trash' });
      setTimeout(() => {
        setSwipeResult(null);
        goNext();
      }, 400);
    }
  }, [current, updateBookmark, goNext]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'e') archive();
      if (e.key === 'd' || e.key === 'Delete') trash();
      if (e.key === 'ArrowRight' || e.key === 'j') goNext();
      if (e.key === 'ArrowLeft' || e.key === 'k') goPrev();
      if (e.key === 'Escape') setActiveView('inbox');
      if (e.key === ' ') {
        e.preventDefault();
        if (current) window.open(current.url, '_blank');
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [archive, trash, goNext, goPrev, setActiveView, current]);

  // --- Empty state: all caught up ---
  if (!current) {
    return (
      <div className="h-full flex flex-col items-center justify-center" style={{ backgroundColor: palette.bgGround }}>
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center gap-5"
        >
          {/* Decorative ring */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex items-center justify-center w-24 h-24"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 rounded-full"
              style={{
                border: `1.5px dashed ${palette.textMuted}`,
                opacity: 0.3,
              }}
            />
            <BookOpen
              size={32}
              style={{ color: palette.accentPrimary, opacity: 0.8 }}
            />
          </motion.div>

          <div className="flex flex-col items-center gap-2">
            <motion.h2
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="text-2xl font-bold"
              style={{ fontFamily: typography.ui, color: palette.textPrimary }}
            >
              All caught up!
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45, duration: 0.4 }}
              className="text-sm"
              style={{ fontFamily: typography.ui, color: palette.textSecondary }}
            >
              No more items in your inbox.
            </motion.p>
          </div>

          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setActiveView('inbox')}
            className="mt-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={{
              fontFamily: typography.ui,
              backgroundColor: palette.accentPrimary,
              color: '#fff',
              boxShadow: `0 8px 30px rgba(255, 85, 0, 0.3)`,
            }}
          >
            Back to Inbox
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col relative overflow-hidden" style={{ backgroundColor: palette.bgGround }}>
      {/* Swipe feedback overlays */}
      <AnimatePresence>
        {swipeResult === 'archived' && (
          <motion.div
            key="archive-flash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 z-40 pointer-events-none flex items-center justify-center"
            style={{ backgroundColor: 'rgba(52, 211, 153, 0.12)' }}
          >
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="flex items-center gap-3 px-5 py-3 rounded-2xl"
              style={{
                backgroundColor: 'rgba(52, 211, 153, 0.15)',
                border: `1px solid rgba(52, 211, 153, 0.3)`,
                backdropFilter: 'blur(12px)',
              }}
            >
              <Archive size={18} style={{ color: palette.success }} />
              <span className="text-sm font-semibold" style={{ fontFamily: typography.ui, color: palette.success }}>
                Archived
              </span>
            </motion.div>
          </motion.div>
        )}
        {swipeResult === 'deleted' && (
          <motion.div
            key="delete-flash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 z-40 pointer-events-none flex items-center justify-center"
            style={{ backgroundColor: 'rgba(239, 68, 68, 0.12)' }}
          >
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="flex items-center gap-3 px-5 py-3 rounded-2xl"
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                border: `1px solid rgba(239, 68, 68, 0.3)`,
                backdropFilter: 'blur(12px)',
              }}
            >
              <Trash2 size={18} style={{ color: palette.danger }} />
              <span className="text-sm font-semibold" style={{ fontFamily: typography.ui, color: palette.danger }}>
                Deleted
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div
        className="flex items-center justify-between px-4 sm:px-6 h-14 shrink-0"
        style={{ borderBottom: `1px solid ${palette.borderSubtle}` }}
      >
        <button
          onClick={() => setActiveView('inbox')}
          className="flex items-center gap-1.5 text-sm transition-all hover:gap-2.5"
          style={{ fontFamily: typography.ui, color: palette.textSecondary }}
        >
          <ChevronLeft size={15} strokeWidth={2} />
          <span className="hidden sm:inline">Exit Triage</span>
        </button>

        <div className="flex items-center gap-3">
          <span
            className="text-sm font-semibold tracking-tight"
            style={{ fontFamily: typography.ui, color: palette.textPrimary }}
          >
            Focus Stream
          </span>
          {inboxBookmarks.length > 0 && (
            <span
              className="text-[11px] px-2.5 py-0.5 rounded-full font-medium tabular-nums"
              style={{
                fontFamily: typography.mono,
                backgroundColor: `${palette.accentPrimary}18`,
                color: palette.accentPrimary,
                letterSpacing: '0.02em',
              }}
            >
              {currentIndex + 1} / {inboxBookmarks.length}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          <div
            className="p-1.5 rounded-lg"
            style={{ color: palette.textMuted }}
          >
            <Grip size={14} />
          </div>
        </div>
      </div>

      {/* Card area */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-8 py-4 min-h-0">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current.id}
            custom={direction}
            initial={{ opacity: 0, x: direction > 0 ? 280 : -280, scale: 0.92, rotateY: direction > 0 ? 8 : -8 }}
            animate={{ opacity: 1, x: 0, scale: 1, rotateY: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -280 : 280, scale: 0.92, rotateY: direction > 0 ? -8 : 8 }}
            transition={{
              type: 'spring',
              stiffness: spring.triage.stiffness,
              damping: spring.triage.damping,
              mass: spring.triage.mass,
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.35}
            onDragEnd={(_, info) => {
              if (info.offset.x > 100) archive();
              else if (info.offset.x < -100) trash();
            }}
            className="w-full max-w-md rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing select-none"
            style={{
              backgroundColor: palette.surfaceBase,
              border: `1px solid ${palette.borderSubtle}`,
              boxShadow: `
                0 0 0 1px ${palette.borderSubtle},
                0 4px 12px rgba(0,0,0,0.25),
                0 16px 48px rgba(0,0,0,0.4),
                0 40px 100px rgba(0,0,0,0.35)
              `,
            }}
          >
            {/* Cover image */}
            {current.coverImageUrl && (
              <div className="relative w-full aspect-video">
                <Image
                  src={current.coverImageUrl}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 512px"
                  unoptimized
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(to bottom, transparent 30%, rgba(15,17,21,0.95) 100%)',
                  }}
                />
                {/* Drag hint on image */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 rounded-full"
                  style={{
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <Grip size={10} style={{ color: palette.textMuted }} />
                  <span className="text-[9px] font-medium" style={{ fontFamily: typography.mono, color: palette.textMuted }}>
                    drag to triage
                  </span>
                </div>
              </div>
            )}

            {/* Card content */}
            <div className="p-5 sm:p-6 space-y-3">
              {/* Media type badge + meta */}
              <div className="flex items-center justify-between gap-3">
                <span
                  className="text-[10px] uppercase tracking-widest font-semibold px-2.5 py-0.5 rounded-full shrink-0"
                  style={{
                    fontFamily: typography.mono,
                    color: palette.accentPrimary,
                    backgroundColor: `${palette.accentPrimary}14`,
                    border: `1px solid ${palette.accentPrimary}22`,
                  }}
                >
                  {current.mediaType.replace('_', ' ')}
                </span>
                <span
                  className="text-[11px] truncate"
                  style={{ fontFamily: typography.mono, color: palette.textMuted }}
                >
                  {current.domain} · {current.readingTimeMinutes}m read
                </span>
              </div>

              {/* Title */}
              <h2
                className="text-xl sm:text-2xl font-bold leading-tight tracking-tight"
                style={{ fontFamily: typography.ui, color: palette.textPrimary }}
              >
                {current.title}
              </h2>

              {/* Description */}
              {current.description && (
                <p
                  className="text-sm leading-relaxed line-clamp-3"
                  style={{ fontFamily: typography.ui, color: palette.textSecondary }}
                >
                  {current.description}
                </p>
              )}

              {/* Tags */}
              {current.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {current.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full"
                      style={{
                        fontFamily: typography.mono,
                        color: palette.textMuted,
                        backgroundColor: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.06)',
                      }}
                    >
                      <Tag size={8} />
                      {tag.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 pb-4 sm:pb-6 px-4 shrink-0">
        {[
          {
            icon: ChevronLeft,
            label: 'Prev',
            action: goPrev,
            shortcut: 'K',
            disabled: currentIndex === 0,
          },
          {
            icon: Trash2,
            label: 'Delete',
            action: trash,
            shortcut: 'D',
            color: palette.danger,
          },
          {
            icon: Archive,
            label: 'Archive',
            action: archive,
            shortcut: 'E',
            color: palette.accentPrimary,
          },
          {
            icon: BookOpen,
            label: 'Read',
            action: () => {
              if (current) window.open(current.url, '_blank');
            },
            shortcut: 'Space',
            color: palette.accentSecondary,
          },
          {
            icon: ChevronRight,
            label: 'Next',
            action: goNext,
            shortcut: 'J',
            disabled: currentIndex >= inboxBookmarks.length - 1,
          },
        ].map(({ icon: Icon, label, action, shortcut, color, disabled }) => (
          <motion.button
            key={label}
            whileHover={{ scale: disabled ? 1 : 1.08, y: disabled ? 0 : -2 }}
            whileTap={{ scale: disabled ? 1 : 0.92 }}
            onClick={action}
            disabled={disabled}
            className="flex flex-col items-center gap-1.5 p-2.5 sm:p-3 rounded-xl transition-all"
            style={{
              color: disabled ? palette.textMuted : color || palette.textSecondary,
              opacity: disabled ? 0.35 : 1,
              cursor: disabled ? 'not-allowed' : 'pointer',
              backgroundColor: disabled ? 'transparent' : 'rgba(255,255,255,0.02)',
            }}
          >
            <Icon size={20} strokeWidth={1.75} />
            <span
              className="text-[9px] font-semibold tracking-wider uppercase"
              style={{ fontFamily: typography.mono, color: palette.textMuted }}
            >
              {shortcut}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Keyboard hint */}
      <div
        className="flex items-center justify-center gap-3 pb-3 text-[10px] shrink-0"
        style={{ fontFamily: typography.mono, color: palette.textMuted }}
      >
        <span className="flex items-center gap-1.5">
          <Keyboard size={11} />
          Swipe or use keyboard to triage
        </span>
      </div>
    </div>
  );
}
