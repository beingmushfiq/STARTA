'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/lib/store';
import { palette, typography } from '@/lib/tokens';
import {
  Search,
  Inbox,
  Pin,
  BookOpen,
  Archive,
  Plus,
  ArrowRight,
  Zap,
} from 'lucide-react';

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon: React.ElementType;
  action: () => void;
  category: 'navigation' | 'action' | 'search';
}

export function CommandPalette() {
  const {
    commandPaletteOpen,
    toggleCommandPalette,
    bookmarks,
    setActiveView,
    addBookmark,
  } = useApp();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const commands: CommandItem[] = useMemo(
    () => [
      ...bookmarks.map((b) => ({
        id: `bookmark-${b.id}`,
        label: b.title,
        description: b.domain,
        icon: BookOpen,
        action: () => {
          toggleCommandPalette();
        },
        category: 'search' as const,
      })),
      {
        id: 'nav-inbox',
        label: 'Go to Inbox',
        description: 'View your inbox bookmarks',
        icon: Inbox,
        action: () => {
          setActiveView('inbox');
          toggleCommandPalette();
        },
        category: 'navigation' as const,
      },
      {
        id: 'nav-pinned',
        label: 'Go to Pinned',
        description: 'View pinned bookmarks',
        icon: Pin,
        action: () => {
          setActiveView('pinned');
          toggleCommandPalette();
        },
        category: 'navigation' as const,
      },
      {
        id: 'nav-archive',
        label: 'Go to Archive',
        description: 'View archived bookmarks',
        icon: Archive,
        action: () => {
          setActiveView('archive');
          toggleCommandPalette();
        },
        category: 'navigation' as const,
      },
      {
        id: 'action-add',
        label: 'Add Bookmark',
        description: 'Save a new URL or document',
        icon: Plus,
        action: () => {
          toggleCommandPalette();
        },
        category: 'action' as const,
      },
    ],
    [bookmarks, setActiveView, addBookmark, toggleCommandPalette]
  );

  const filtered = useMemo(() => {
    if (!query) return commands;
    const q = query.toLowerCase();
    return commands.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        (c.description && c.description.toLowerCase().includes(q))
    );
  }, [query, commands]);

  const grouped = useMemo(() => {
    const groups: { title: string; items: CommandItem[] }[] = [];
    const bookmarkItems = filtered.filter((c) => c.category === 'search');
    const otherItems = filtered.filter((c) => c.category !== 'search');
    if (bookmarkItems.length > 0) {
      groups.push({ title: 'Bookmarks', items: bookmarkItems });
    }
    if (otherItems.length > 0) {
      groups.push({ title: 'Commands', items: otherItems });
    }
    return groups;
  }, [filtered]);

  useEffect(() => {
    if (commandPaletteOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [commandPaletteOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && filtered[selectedIndex]) {
      filtered[selectedIndex].action();
    }
  };

  // Flat index counter for mapping grouped items back to the flat filtered list
  let flatIndex = 0;

  return (
    <AnimatePresence>
      {commandPaletteOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0"
            style={{
              zIndex: 100,
              backgroundColor: 'rgba(6,7,9,0.7)',
              backdropFilter: 'blur(12px)',
            }}
            onClick={toggleCommandPalette}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -12 }}
            transition={{
              type: 'spring',
              stiffness: 350,
              damping: 30,
            }}
            className="fixed top-[14%] left-1/2 -translate-x-1/2 w-full max-w-140"
            style={{ zIndex: 101 }}
          >
            <div
              className="border-gradient rounded-2xl overflow-hidden"
              style={{
                backgroundColor: palette.surfaceFloating,
                boxShadow: '0 32px 100px rgba(0,0,0,0.6)',
                backdropFilter: 'blur(40px) saturate(200%)',
              }}
            >
              {/* Search input */}
              <div
                className="flex items-center gap-3 px-5 h-14 border-b"
                style={{ borderColor: palette.borderSubtle }}
              >
                <Search size={18} style={{ color: palette.textMuted }} />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search bookmarks, run commands..."
                  className="flex-1 bg-transparent text-[15px] outline-none placeholder:text-[#525866]"
                  style={{
                    fontFamily: typography.ui,
                    color: palette.textPrimary,
                    caretColor: palette.accentPrimary,
                  }}
                />
                <kbd
                  className="text-[10px] px-1.5 py-0.5 rounded border"
                  style={{
                    fontFamily: typography.mono,
                    color: palette.textMuted,
                    borderColor: palette.borderSubtle,
                  }}
                >
                  ESC
                </kbd>
              </div>

              {/* Results */}
              <div
                ref={listRef}
                className="max-h-80 overflow-y-auto py-2"
                style={{ scrollbarWidth: 'thin' }}
              >
                {filtered.length === 0 ? (
                  <div className="px-5 py-10 text-center">
                    <div
                      className="inline-flex items-center justify-center w-10 h-10 rounded-xl mb-3"
                      style={{ backgroundColor: 'rgba(255,85,0,0.08)' }}
                    >
                      <Zap size={18} style={{ color: palette.accentPrimary }} />
                    </div>
                    <p
                      className="text-sm"
                      style={{
                        color: palette.textMuted,
                        fontFamily: typography.ui,
                      }}
                    >
                      No results found
                    </p>
                    <p
                      className="text-xs mt-1"
                      style={{
                        color: palette.textMuted,
                        fontFamily: typography.mono,
                        opacity: 0.6,
                      }}
                    >
                      Try a different search term
                    </p>
                  </div>
                ) : (
                  grouped.map((group) => (
                    <div key={group.title}>
                      <div
                        className="px-5 pt-3 pb-1 text-[10px] font-semibold uppercase tracking-widest"
                        style={{
                          fontFamily: typography.mono,
                          color: palette.textMuted,
                        }}
                      >
                        {group.title}
                      </div>
                      {group.items.map((item) => {
                        const currentIndex = flatIndex++;
                        const Icon = item.icon;
                        const isSelected = currentIndex === selectedIndex;
                        return (
                          <button
                            key={item.id}
                            onClick={item.action}
                            className="w-full flex items-center gap-3 px-5 py-2.5 text-left transition-all duration-100"
                            style={{
                              backgroundColor: isSelected
                                ? 'rgba(255,85,0,0.06)'
                                : 'transparent',
                            }}
                            onMouseEnter={() => setSelectedIndex(currentIndex)}
                          >
                            <div
                              className="flex items-center justify-center w-7 h-7 rounded-lg transition-colors duration-100"
                              style={{
                                backgroundColor: isSelected
                                  ? 'rgba(255,85,0,0.1)'
                                  : 'rgba(255,255,255,0.04)',
                              }}
                            >
                              <Icon
                                size={14}
                                style={{
                                  color: isSelected
                                    ? palette.accentPrimary
                                    : item.category === 'action'
                                    ? palette.accentPrimary
                                    : palette.textMuted,
                                }}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p
                                className="text-[13px] font-medium truncate"
                                style={{
                                  fontFamily: typography.ui,
                                  color: palette.textPrimary,
                                }}
                              >
                                {item.label}
                              </p>
                              {item.description && (
                                <p
                                  className="text-[11px] truncate"
                                  style={{
                                    fontFamily: typography.mono,
                                    color: palette.textMuted,
                                  }}
                                >
                                  {item.description}
                                </p>
                              )}
                            </div>
                            {isSelected && (
                              <motion.div
                                initial={{ opacity: 0, x: -4 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.12 }}
                              >
                                <ArrowRight
                                  size={14}
                                  style={{ color: palette.accentPrimary }}
                                />
                              </motion.div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div
                className="flex items-center gap-4 px-5 py-2.5 border-t text-[11px]"
                style={{
                  borderColor: palette.borderSubtle,
                  fontFamily: typography.mono,
                  color: palette.textMuted,
                }}
              >
                <span className="flex items-center gap-1">
                  <kbd
                    className="inline-flex items-center justify-center w-5 h-5 rounded text-[9px] border"
                    style={{
                      borderColor: palette.borderSubtle,
                      backgroundColor: 'rgba(255,255,255,0.03)',
                    }}
                  >
                    ↑
                  </kbd>
                  <kbd
                    className="inline-flex items-center justify-center w-5 h-5 rounded text-[9px] border"
                    style={{
                      borderColor: palette.borderSubtle,
                      backgroundColor: 'rgba(255,255,255,0.03)',
                    }}
                  >
                    ↓
                  </kbd>
                  <span className="ml-0.5">navigate</span>
                </span>
                <span className="flex items-center gap-1">
                  <kbd
                    className="inline-flex items-center justify-center w-5 h-5 rounded text-[9px] border"
                    style={{
                      borderColor: palette.borderSubtle,
                      backgroundColor: 'rgba(255,255,255,0.03)',
                    }}
                  >
                    ↵
                  </kbd>
                  <span className="ml-0.5">select</span>
                </span>
                <span className="flex items-center gap-1">
                  <kbd
                    className="inline-flex items-center justify-center px-1.5 h-5 rounded text-[9px] border"
                    style={{
                      borderColor: palette.borderSubtle,
                      backgroundColor: 'rgba(255,255,255,0.03)',
                    }}
                  >
                    esc
                  </kbd>
                  <span className="ml-0.5">close</span>
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
