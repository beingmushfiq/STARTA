'use client';

import { useApp } from '@/lib/store';
import { cn } from '@/lib/cn';
import { palette, spring } from '@/lib/tokens';
import { motion } from 'framer-motion';
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
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Navigation items                                                   */
/* ------------------------------------------------------------------ */

const navItems = [
  { id: 'inbox' as const, label: 'Inbox', icon: Inbox, count: 4 },
  { id: 'pinned' as const, label: 'Pinned', icon: Pin, count: 3 },
  { id: 'reader' as const, label: 'Reader', icon: BookOpen, count: null },
  { id: 'archive' as const, label: 'Archive', icon: Archive, count: 12 },
  { id: 'trash' as const, label: 'Trash', icon: Trash2, count: null },
];

/* ------------------------------------------------------------------ */
/*  Collection icon map — Lucide only, no emojis                       */
/* ------------------------------------------------------------------ */

const collectionIconMap: Record<string, LucideIcon> = {
  flask: FlaskConical,
  palette: Palette,
  code: Code2,
  sparkles: Sparkles,
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
    setActiveView,
    setActiveCollectionId,
    toggleSidebar,
  } = useApp();

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
        {sidebarOpen && collections.length > 0 && (
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
            </div>

            {collections.map((col) => {
              const isActive = activeView === 'collection' && activeCollectionId === col.id;
              const IconComp = collectionIconMap[col.iconIdentifier] ?? FlaskConical;

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
