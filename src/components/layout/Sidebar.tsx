'use client';

import { useState, useRef, useEffect } from 'react';
import { useApp } from '@/lib/store';
import { cn } from '@/lib/cn';
import { palette, spring } from '@/lib/tokens';
import { motion, AnimatePresence } from 'framer-motion';
import { UserMenu } from '@/components/ui/UserMenu';
import {
  Inbox,
  Pin,
  BookOpen,
  Archive,
  Trash2,
  ChevronLeft,
  ChevronRight,
  FlaskConical,
  Palette,
  Code2,
  Sparkles,
  Plus,
  X,
  Folder,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Navigation items (counts computed dynamically)                     */
/* ------------------------------------------------------------------ */

const navItemDefs = [
  { id: 'inbox' as const, label: 'Inbox', icon: Inbox },
  { id: 'pinned' as const, label: 'Pinned', icon: Pin },
  { id: 'reader' as const, label: 'Reader', icon: BookOpen, hideCount: true },
  { id: 'archive' as const, label: 'Archive', icon: Archive },
  { id: 'trash' as const, label: 'Trash', icon: Trash2 },
];

/* ------------------------------------------------------------------ */
/*  Collection icon map — Lucide only, no emojis                       */
/* ------------------------------------------------------------------ */

const collectionIconMap: Record<string, LucideIcon> = {
  flask: FlaskConical,
  palette: Palette,
  code: Code2,
  sparkles: Sparkles,
  folder: Folder,
};

/* ------------------------------------------------------------------ */
/*  Premium Sidebar                                                    */
/* ------------------------------------------------------------------ */

export function Sidebar() {
  const {
    activeView,
    activeCollectionId,
    collections,
    sidebarOpen,
    bookmarks,
    setActiveView,
    setActiveCollectionId,
    toggleSidebar,
    addCollection,
  } = useApp();

  // Compute dynamic counts from bookmarks
  const navItems = navItemDefs.map((item) => {
    if (item.hideCount) return { ...item, count: null };
    const count = bookmarks.filter((b) => {
      if (item.id === 'inbox') return b.status === 'inbox';
      if (item.id === 'pinned') return b.isPinned;
      if (item.id === 'archive') return b.status === 'archived';
      if (item.id === 'trash') return b.status === 'trash';
      return false;
    }).length;
    return { ...item, count };
  });

  const [addingCollection, setAddingCollection] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (addingCollection && inputRef.current) {
      inputRef.current.focus();
    }
  }, [addingCollection]);

  const handleCreateCollection = () => {
    if (newCollectionName.trim()) {
      const colors = ['#635BFF', '#FF5500', '#34D399', '#FBBF24', '#38BDF8', '#F472B6', '#A78BFA'];
      const newCollection = {
        id: `col-${Date.now()}`,
        tenantId: 't_1',
        name: newCollectionName.trim(),
        slug: newCollectionName.trim().toLowerCase().replace(/\s+/g, '-'),
        colorHex: colors[Math.floor(Math.random() * colors.length)],
        iconIdentifier: 'folder',
        isSmartCollection: false,
        filterRules: {},
        createdAt: new Date(),
      };
      addCollection(newCollection);
      setNewCollectionName('');
      setAddingCollection(false);
      setActiveCollectionId(newCollection.id);
    }
  };

  return (
    <aside
      className={cn(
        'h-full flex flex-col transition-[width] duration-300',
        sidebarOpen ? 'w-64' : 'w-17'
      )}
      style={{
        /* OLED ground + glassmorphism */
        background: `linear-gradient(
          180deg,
          rgba(15, 17, 21, 0.82) 0%,
          rgba(15, 17, 21, 0.68) 100%
        )`,
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        borderRight: `1px solid ${palette.borderSubtle}`,
      }}
    >
      {/* ============================================================ */}
      {/*  Logo                                                        */}
      {/* ============================================================ */}
      <div className="relative flex items-center justify-between px-4 h-14 shrink-0">
        <motion.div
          className="flex items-center gap-2 select-none"
          whileHover={{ scale: 1.04 }}
          transition={{ type: 'spring', ...spring.card }}
        >
          {sidebarOpen && (
            <span
              className="text-xl font-extrabold tracking-[0.18em] uppercase bg-clip-text text-transparent"
              style={{
                fontFamily: 'var(--font-display), "Instrument Serif", Georgia, serif',
                backgroundImage: `linear-gradient(135deg, ${palette.accentPrimary} 0%, #FFaa44 50%, ${palette.accentPrimary} 100%)`,
                WebkitBackgroundClip: 'text',
              }}
            >
              STRATA
            </span>
          )}
          {!sidebarOpen && (
            <span
              className="text-lg font-extrabold bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(135deg, ${palette.accentPrimary}, #FFaa44)`,
                WebkitBackgroundClip: 'text',
              }}
            >
              S
            </span>
          )}
        </motion.div>

        <motion.button
          onClick={toggleSidebar}
          className="p-1.5 rounded-lg"
          style={{ color: palette.textSecondary }}
          whileHover={{
            backgroundColor: 'rgba(255,255,255,0.06)',
            scale: 1.08,
          }}
          whileTap={{ scale: 0.92 }}
          transition={{ type: 'spring', ...spring.card }}
        >
          {sidebarOpen ? <ChevronLeft size={15} /> : <ChevronRight size={15} />}
        </motion.button>

        {/* Bottom fade line */}
        <div
          className="absolute bottom-0 left-3 right-3 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${palette.borderSubtle}, transparent)` }}
        />
      </div>

      {/* ============================================================ */}
      {/*  Navigation                                                   */}
      {/* ============================================================ */}
      <nav className="flex-1 overflow-y-auto px-2.5 pt-3 pb-2 space-y-0.5 scrollbar-none">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id && !activeCollectionId;
          return (
            <motion.button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={cn(
                'group relative w-full flex items-center gap-3 rounded-lg text-[13px] font-medium',
                sidebarOpen ? 'px-3 py-1.75' : 'justify-center px-0 py-1.75'
              )}
              style={{
                color: isActive ? palette.textPrimary : palette.textSecondary,
                fontFamily: 'var(--font-ui), "Geist Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
              }}
              whileHover={{ x: 1.5 }}
              transition={{ type: 'spring', ...spring.card }}
            >
              {/* ---- Active background ---- */}
              {isActive && (
                <motion.div
                  className="absolute inset-0 rounded-lg"
                  layoutId="nav-active"
                  style={{
                    background: 'rgba(255, 85, 0, 0.07)',
                  }}
                  transition={{ type: 'spring', ...spring.triage }}
                />
              )}

              {/* ---- Active left amber glow bar ---- */}
              {isActive && (
                <motion.div
                  className="absolute left-0 top-[15%] bottom-[15%] w-0.75 rounded-full"
                  layoutId="nav-glow"
                  style={{
                    background: palette.accentPrimary,
                    boxShadow: `0 0 10px 2px rgba(255, 85, 0, 0.35), 0 0 20px 4px rgba(255, 85, 0, 0.12)`,
                  }}
                  transition={{ type: 'spring', ...spring.triage }}
                />
              )}

              {/* ---- Icon ---- */}
              <Icon
                size={18}
                className="relative z-10 shrink-0"
                style={{
                  color: isActive ? palette.accentPrimary : undefined,
                  transition: 'color 150ms ease',
                }}
              />

              {/* ---- Label + badge ---- */}
              {sidebarOpen && (
                <>
                  <span className="relative z-10 flex-1 text-left truncate">{item.label}</span>
                  {item.count !== null && (
                    <span
                      className="relative z-10 text-[11px] tabular-nums min-w-5 text-center rounded-full px-1.5 py-px"
                      style={{
                        fontFamily: 'var(--font-mono), "JetBrains Mono", "SF Mono", monospace',
                        backgroundColor: isActive
                          ? 'rgba(255, 85, 0, 0.15)'
                          : 'rgba(255, 255, 255, 0.04)',
                        color: isActive ? palette.accentPrimary : palette.textMuted,
                      }}
                    >
                      {item.count}
                    </span>
                  )}
                </>
              )}

              {/* Hover glow — inactive items */}
              {!isActive && (
                <div
                  className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  style={{ background: 'rgba(255, 255, 255, 0.03)' }}
                />
              )}
            </motion.button>
          );
        })}

        {/* ============================================================ */}
        {/*  Collections                                                  */}
        {/* ============================================================ */}
        {sidebarOpen && (
          <div className="pt-5">
            <div className="flex items-center justify-between px-3 mb-1.5">
              <span
                className="text-[10px] font-semibold uppercase tracking-widest"
                style={{
                  fontFamily: 'var(--font-mono), "JetBrains Mono", "SF Mono", monospace',
                  color: palette.textMuted,
                }}
              >
                Collections
              </span>
              <motion.button
                onClick={() => setAddingCollection(!addingCollection)}
                className="p-1 rounded-md transition-all"
                style={{
                  color: addingCollection ? palette.accentPrimary : palette.textMuted,
                  backgroundColor: addingCollection ? 'rgba(255,85,0,0.1)' : undefined,
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {addingCollection ? <X size={12} /> : <Plus size={12} />}
              </motion.button>
            </div>

            {/* Add collection input */}
            <AnimatePresence>
              {addingCollection && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden px-3 mb-1.5"
                >
                  <form
                    onSubmit={(e) => { e.preventDefault(); handleCreateCollection(); }}
                    className="flex items-center gap-2"
                  >
                    <input
                      ref={inputRef}
                      type="text"
                      value={newCollectionName}
                      onChange={(e) => setNewCollectionName(e.target.value)}
                      placeholder="Collection name..."
                      className="flex-1 px-2.5 py-1.5 rounded-lg text-[13px] outline-none"
                      style={{
                        fontFamily: 'var(--font-ui), -apple-system, sans-serif',
                        backgroundColor: 'rgba(255,255,255,0.04)',
                        border: `1px solid ${palette.borderSubtle}`,
                        color: palette.textPrimary,
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Escape') {
                          setAddingCollection(false);
                          setNewCollectionName('');
                        }
                      }}
                    />
                    <motion.button
                      type="submit"
                      className="p-1.5 rounded-lg"
                      style={{
                        backgroundColor: palette.accentPrimary,
                        color: '#fff',
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Plus size={12} />
                    </motion.button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {collections.map((col) => {
              const isActive = activeView === 'collection' && activeCollectionId === col.id;
              const IconComp = collectionIconMap[col.iconIdentifier] ?? FlaskConical;
              const colCount = bookmarks.filter((b) => b.collectionId === col.id).length;

              return (
                <motion.button
                  key={col.id}
                  onClick={() => setActiveCollectionId(col.id)}
                  className={cn(
                    'group relative w-full flex items-center gap-3 rounded-lg text-[13px] font-medium px-3 py-1.75'
                  )}
                  style={{
                    color: isActive ? palette.textPrimary : palette.textSecondary,
                    fontFamily: 'var(--font-ui), "Geist Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                  }}
                  whileHover={{ x: 1.5 }}
                  transition={{ type: 'spring', ...spring.card }}
                >
                  {/* ---- Active background ---- */}
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 rounded-lg"
                      layoutId="col-active"
                      style={{ background: 'rgba(255, 85, 0, 0.07)' }}
                      transition={{ type: 'spring', ...spring.triage }}
                    />
                  )}

                  {/* ---- Active left amber glow bar ---- */}
                  {isActive && (
                    <motion.div
                      className="absolute left-0 top-[15%] bottom-[15%] w-0.75 rounded-full"
                  layoutId="col-glow"
                      style={{
                        background: palette.accentPrimary,
                        boxShadow: `0 0 10px 2px rgba(255, 85, 0, 0.35), 0 0 20px 4px rgba(255, 85, 0, 0.12)`,
                      }}
                      transition={{ type: 'spring', ...spring.triage }}
                    />
                  )}

                  {/* ---- Color dot / icon ---- */}
                  <span
                    className="relative z-10 flex items-center justify-center w-5 h-5 shrink-0"
                    style={{ color: col.colorHex }}
                  >
                    <IconComp size={16} />
                  </span>

                  <span className="relative z-10 flex-1 text-left truncate">{col.name}</span>

                  {/* ---- Bookmark count ---- */}
                  {colCount > 0 && (
                    <span
                      className="relative z-10 text-[11px] tabular-nums min-w-5 text-center rounded-full px-1.5 py-px"
                      style={{
                        fontFamily: 'var(--font-mono), "JetBrains Mono", "SF Mono", monospace',
                        backgroundColor: isActive
                          ? 'rgba(255, 85, 0, 0.15)'
                          : 'rgba(255, 255, 255, 0.04)',
                        color: isActive ? palette.accentPrimary : palette.textMuted,
                      }}
                    >
                      {colCount}
                    </span>
                  )}

                  {/* ---- Color indicator ---- */}
                  <span
                    className="relative z-10 w-2 h-2 rounded-full shrink-0"
                    style={{
                      backgroundColor: col.colorHex,
                      boxShadow: `0 0 0 1px ${col.colorHex}33`,
                    }}
                  />

                  {/* Hover glow */}
                  <div
                    className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    style={{ background: 'rgba(255, 255, 255, 0.03)' }}
                  />
                </motion.button>
              );
            })}
          </div>
        )}
      </nav>

      {/* ============================================================ */}
      {/*  User section with dropdown menu                              */}
      {/* ============================================================ */}
      <div className="shrink-0 relative px-2.5 pb-3 pt-1">
        {/* Top separator */}
        <div
          className="absolute top-0 left-3 right-3 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${palette.borderSubtle}, transparent)` }}
        />
        <UserMenu />
      </div>
    </aside>
  );
}
