'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '@/lib/store';
import { palette, spring, typography } from '@/lib/tokens';
import {
  ArrowLeft,
  ExternalLink,
  Clock,
  Settings2,
  Minus,
  Plus,
  Moon,
  Sun,
  Volume2,
  BookOpen,
  ChevronUp,
} from 'lucide-react';
import Image from 'next/image';

export function ReaderView() {
  const {
    selectedBookmarkId,
    bookmarks,
    readerColumnWidth,
    readerDarkMode,
    setReaderColumnWidth,
    toggleReaderDarkMode,
    setActiveView,
  } = useApp();

  const [showSettings, setShowSettings] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const bookmark = bookmarks.find((b) => b.id === selectedBookmarkId);

  const isDark = readerDarkMode;
  const bgColor = isDark ? palette.bgGround : '#FAF9F7';
  const surfaceColor = isDark ? palette.surfaceBase : '#F0EEEB';
  const textColor = isDark ? palette.textPrimary : '#111827';
  const textSecondary = isDark ? palette.textSecondary : '#6B7280';
  const textMuted = isDark ? palette.textMuted : '#8A909E';
  const borderColor = isDark ? palette.borderSubtle : 'rgba(0,0,0,0.08)';
  const headerBg = isDark ? `${palette.bgGround}CC` : '#FAF9F7CC';
  const hoverBg = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)';

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      const maxScroll = scrollHeight - clientHeight;
      const progress = maxScroll > 0 ? Math.min((scrollTop / maxScroll) * 100, 100) : 0;
      setScrollProgress(progress);
      setShowScrollTop(scrollTop > 400);
    };

    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
      setScrollProgress(0);
      setShowScrollTop(false);
    }
  }, [selectedBookmarkId]);

  const scrollToTop = () => {
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!bookmark) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: 'spring',
          stiffness: spring.reader.stiffness,
          damping: spring.reader.damping,
          mass: spring.reader.mass,
        }}
        className="flex flex-col items-center justify-center h-full gap-6"
        style={{ backgroundColor: bgColor }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center"
            style={{
              background: isDark
                ? 'linear-gradient(135deg, rgba(255,85,0,0.12), rgba(255,85,0,0.04))'
                : 'linear-gradient(135deg, rgba(255,85,0,0.10), rgba(255,85,0,0.03))',
              border: `1px solid ${isDark ? 'rgba(255,85,0,0.15)' : 'rgba(255,85,0,0.12)'}`,
            }}
          >
            <BookOpen size={32} style={{ color: palette.accentPrimary, opacity: 0.8 }} />
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="text-center"
        >
          <p
            className="text-base mb-1.5"
            style={{
              fontFamily: typography.ui,
              color: textColor,
              fontWeight: 500,
            }}
          >
            No article selected
          </p>
          <p
            className="text-sm"
            style={{
              fontFamily: typography.ui,
              color: textMuted,
            }}
          >
            Choose a bookmark from the inbox to begin reading
          </p>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{
        type: 'spring',
        stiffness: spring.reader.stiffness,
        damping: spring.reader.damping,
        mass: spring.reader.mass,
      }}
      className="h-full flex flex-col"
      style={{ backgroundColor: bgColor }}
    >
      {/* Reading Progress Bar */}
      <div
        className="sticky top-0 left-0 right-0 z-50"
        style={{ height: 2, backgroundColor: borderColor }}
      >
        <motion.div
          className="h-full"
          style={{
            width: `${scrollProgress}%`,
            backgroundColor: palette.accentPrimary,
            boxShadow: scrollProgress > 0
              ? `0 0 8px ${palette.accentPrimary}66`
              : 'none',
          }}
          transition={{ duration: 0.1 }}
        />
      </div>

      {/* Header */}
      <div
        className="sticky top-0.5 z-40 flex items-center justify-between px-4 sm:px-6 h-14 shrink-0"
        style={{
          backgroundColor: headerBg,
          backdropFilter: 'blur(16px) saturate(180%)',
          WebkitBackdropFilter: 'blur(16px) saturate(180%)',
          borderBottom: `1px solid ${borderColor}`,
        }}
      >
        <button
          onClick={() => setActiveView('inbox')}
          className="flex items-center gap-2 text-sm rounded-lg px-2.5 py-1.5 transition-all"
          style={{
            fontFamily: typography.ui,
            color: textSecondary,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = hoverBg;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <ArrowLeft size={16} />
          <span className="hidden sm:inline">Back</span>
        </button>

        <div className="flex items-center gap-1">
          <button
            className="p-2 rounded-lg transition-all"
            style={{ color: textSecondary }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = hoverBg;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            title="Text-to-speech"
          >
            <Volume2 size={16} />
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-lg transition-all"
            style={{
              color: showSettings ? palette.accentPrimary : textSecondary,
              backgroundColor: showSettings
                ? isDark
                  ? 'rgba(255,85,0,0.1)'
                  : 'rgba(255,85,0,0.08)'
                : 'transparent',
            }}
            onMouseEnter={(e) => {
              if (!showSettings) e.currentTarget.style.backgroundColor = hoverBg;
            }}
            onMouseLeave={(e) => {
              if (!showSettings) e.currentTarget.style.backgroundColor = 'transparent';
            }}
            title="Reader settings"
          >
            <Settings2 size={16} />
          </button>
          <button
            onClick={() => window.open(bookmark.url, '_blank')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ml-1"
            style={{
              fontFamily: typography.ui,
              backgroundColor: palette.accentPrimary,
              color: '#fff',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.9';
              e.currentTarget.style.transform = 'scale(1.02)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <ExternalLink size={12} />
            <span className="hidden sm:inline">Open Original</span>
            <span className="sm:hidden">Open</span>
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden shrink-0"
          style={{
            borderBottom: `1px solid ${borderColor}`,
            backgroundColor: surfaceColor,
          }}
        >
          <div className="px-4 sm:px-6 py-3.5 flex flex-wrap items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-3">
              <span
                className="text-xs uppercase tracking-wider"
                style={{
                  fontFamily: typography.mono,
                  color: textMuted,
                  letterSpacing: '0.08em',
                }}
              >
                Width
              </span>
              <button
                onClick={() => setReaderColumnWidth(Math.max(50, readerColumnWidth - 5))}
                className="p-1.5 rounded-md transition-all"
                style={{
                  color: readerColumnWidth <= 50 ? textMuted : textSecondary,
                  backgroundColor: hoverBg,
                }}
                disabled={readerColumnWidth <= 50}
              >
                <Minus size={13} />
              </button>
              <span
                className="text-xs w-10 text-center tabular-nums"
                style={{
                  fontFamily: typography.mono,
                  color: palette.textPrimary,
                }}
              >
                {readerColumnWidth}ch
              </span>
              <button
                onClick={() => setReaderColumnWidth(Math.min(75, readerColumnWidth + 5))}
                className="p-1.5 rounded-md transition-all"
                style={{
                  color: readerColumnWidth >= 75 ? textMuted : textSecondary,
                  backgroundColor: hoverBg,
                }}
                disabled={readerColumnWidth >= 75}
              >
                <Plus size={13} />
              </button>
            </div>

            <div
              className="hidden sm:block"
              style={{
                width: 1,
                height: 20,
                backgroundColor: borderColor,
              }}
            />

            <button
              onClick={toggleReaderDarkMode}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-all"
              style={{
                fontFamily: typography.mono,
                color: textSecondary,
                backgroundColor: hoverBg,
              }}
            >
              {isDark ? <Sun size={13} /> : <Moon size={13} />}
              {isDark ? 'Light mode' : 'Dark mode'}
            </button>
          </div>
        </motion.div>
      )}

      {/* Scrollable Content */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto" style={{ scrollBehavior: 'smooth' }}>
        <article
          className="mx-auto py-8 sm:py-12 px-5 sm:px-6 pb-24"
          style={{ maxWidth: `${readerColumnWidth}ch` }}
        >
          {/* Cover Image */}
          {bookmark.coverImageUrl && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="mb-8 sm:mb-10 rounded-xl overflow-hidden"
              style={{
                aspectRatio: '16 / 9',
                backgroundColor: isDark ? palette.surfaceBase : '#E8E6E3',
              }}
            >
              <Image
                src={bookmark.coverImageUrl}
                alt={bookmark.title}
                width={800}
                height={450}
                className="w-full h-full object-cover"
                priority
              />
            </motion.div>
          )}

          {/* Meta */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="flex items-center flex-wrap gap-2 sm:gap-3 mb-5 sm:mb-6"
          >
            <span
              className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] uppercase tracking-wider font-medium"
              style={{
                fontFamily: typography.mono,
                backgroundColor: isDark ? 'rgba(255,85,0,0.1)' : 'rgba(255,85,0,0.08)',
                color: palette.accentPrimary,
                letterSpacing: '0.06em',
              }}
            >
              {bookmark.domain}
            </span>
            <span className="flex items-center gap-1 text-[11px]" style={{ color: textMuted, fontFamily: typography.mono }}>
              <Clock size={10} />
              {bookmark.readingTimeMinutes} min
            </span>
            <span className="text-[11px] uppercase tracking-wider" style={{ fontFamily: typography.mono, color: textMuted }}>
              {bookmark.mediaType}
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="text-3xl sm:text-4xl md:text-[2.75rem] leading-[1.15] mb-5 sm:mb-6"
            style={{
              fontFamily: typography.display,
              color: textColor,
              fontWeight: 400,
              letterSpacing: '-0.01em',
            }}
          >
            {bookmark.title}
          </motion.h1>

          {/* Author */}
          {bookmark.author && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28, duration: 0.4 }}
              className="text-sm mb-6 sm:mb-8"
              style={{
                fontFamily: typography.ui,
                color: textSecondary,
              }}
            >
              by{' '}
              <span style={{ color: textColor, fontWeight: 500 }}>
                {bookmark.author}
              </span>
            </motion.p>
          )}

          {/* Amber Accent Line */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mb-8 sm:mb-10 origin-left"
            style={{
              width: 48,
              height: 2,
              backgroundColor: palette.accentPrimary,
            }}
          />

          {/* Body Content */}
          <div
            className="space-y-6"
            style={{
              fontFamily: typography.ui,
              color: textSecondary,
              lineHeight: 1.8,
              fontSize: '1.0625rem',
            }}
          >
            {bookmark.description && (
              <p
                className="text-lg sm:text-xl leading-relaxed"
                style={{
                  fontFamily: typography.display,
                  color: textColor,
                  lineHeight: 1.6,
                  fontWeight: 400,
                }}
              >
                {bookmark.description}
              </p>
            )}

            <p>
              This is a preview of the bookmarked article content. In production, the full content
              would be extracted by the Ingestion Worker pipeline using Mozilla Readability, converted
              to clean Markdown, and rendered here with rich typography.
            </p>

            <p>
              The Reader view supports adjustable column widths (50ch&ndash;75ch), dark and light modes,
              automated text-to-speech for hands-free consumption, and a distraction-free layout
              designed for deep reading sessions.
            </p>

            <h2
              className="text-xl sm:text-2xl mt-10 mb-4"
              style={{
                fontFamily: typography.display,
                color: textColor,
                fontWeight: 400,
              }}
            >
              Key Takeaways
            </h2>

            <ul className="space-y-3 list-none">
              {[
                'Zero-latency local-first data synchronization',
                'Physics-based kinetic animations for every interaction',
                'Intelligent content extraction and semantic search',
                'Frictionless onboarding with Google SSO',
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3"
                  style={{ color: textSecondary }}
                >
                  <span
                    className="mt-2.5 w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: palette.accentPrimary }}
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Tags */}
          {bookmark.tags.length > 0 && (
            <div
              className="mt-12 sm:mt-16 pt-8 sm:pt-10"
              style={{ borderTop: `1px solid ${borderColor}` }}
            >
              <div className="flex flex-wrap gap-2">
                {bookmark.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="px-3.5 py-1.5 rounded-full text-xs font-medium"
                    style={{
                      fontFamily: typography.mono,
                      backgroundColor: isDark
                        ? 'rgba(255,255,255,0.05)'
                        : 'rgba(0,0,0,0.05)',
                      color: textMuted,
                      border: `1px solid ${borderColor}`,
                    }}
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </article>
      </div>

      {/* Scroll to Top */}
      {showScrollTop && (
        <motion.button
          initial={{ opacity: 0, y: 8, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50 p-3 rounded-full transition-all"
          style={{
            backgroundColor: isDark ? palette.surfaceFloating : '#fff',
            border: `1px solid ${borderColor}`,
            color: textSecondary,
            boxShadow: isDark
              ? '0 4px 24px rgba(0,0,0,0.4)'
              : '0 4px 24px rgba(0,0,0,0.12)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = palette.accentPrimary;
            e.currentTarget.style.borderColor = isDark
              ? 'rgba(255,85,0,0.3)'
              : 'rgba(255,85,0,0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = textSecondary;
            e.currentTarget.style.borderColor = borderColor;
          }}
        >
          <ChevronUp size={18} />
        </motion.button>
      )}
    </motion.div>
  );
}
