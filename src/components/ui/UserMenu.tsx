'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp, type AppTheme, type FontSize, type Density } from '@/lib/store';
import { palette, typography } from '@/lib/tokens';
import {
  Settings,
  Palette,
  LogOut,
  User,
  Crown,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/cn';

export function UserMenu() {
  const {
    isAuthenticated,
    user,
    appTheme,
    fontSize,
    density,
    setAppTheme,
    setFontSize,
    setDensity,
    logout,
    setActiveView,
  } = useApp();

  const [open, setOpen] = useState(false);
  const [subPage, setSubPage] = useState<'main' | 'appearance' | 'account'>('main');
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open]);

  const resetMenu = () => { setSubPage('main'); };

  if (!isAuthenticated || !user) {
    return (
      <a
        href="/login"
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all hover:bg-white/5"
        style={{
          fontFamily: typography.ui,
          color: palette.accentPrimary,
          border: `1px solid ${palette.accentPrimary}30`,
        }}
      >
        <User size={16} />
        <span>Sign In</span>
      </a>
    );
  }

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <button
        onClick={() => { setOpen(!open); resetMenu(); }}
        className={cn(
          'flex items-center gap-3 rounded-xl px-2.5 py-2.5 w-full transition-all',
          open && 'bg-white/4'
        )}
        style={{ background: open ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.02)' }}
      >
        <div className="relative shrink-0">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
            style={{
              background: `linear-gradient(135deg, ${palette.accentPrimary}22, ${palette.accentSecondary}22)`,
              color: palette.accentPrimary,
              border: user.planTier === 'pro' ? `2px solid ${palette.accentPrimary}` : '2px solid transparent',
              boxShadow: user.planTier === 'pro' ? '0 0 12px 2px rgba(255,85,0,0.2)' : 'none',
            }}
          >
            {user.name[0]}
          </div>
          {user.planTier === 'pro' && (
            <div
              className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #FF5500, #FFaa44)',
                boxShadow: '0 0 6px 2px rgba(255,85,0,0.25)',
              }}
            >
              <Crown size={8} className="text-white" strokeWidth={3} />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0 text-left">
          <div className="flex items-center gap-1.5">
            <p className="text-[13px] font-medium truncate" style={{ color: palette.textPrimary }}>
              {user.name}
            </p>
            {user.planTier === 'pro' && (
              <span
                className="text-[9px] font-bold uppercase px-1.5 py-px rounded-full leading-none"
                style={{
                  fontFamily: typography.mono,
                  background: 'linear-gradient(135deg, rgba(255,85,0,0.18), rgba(255,170,68,0.12))',
                  color: palette.accentPrimary,
                  border: '1px solid rgba(255,85,0,0.2)',
                }}
              >
                PRO
              </span>
            )}
          </div>
          <p className="text-[11px] truncate mt-0.5" style={{ fontFamily: typography.mono, color: palette.textMuted }}>
            {user.email}
          </p>
        </div>
        <ChevronRight size={14} style={{ color: palette.textMuted, opacity: open ? 1 : 0.5 }} />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            className="absolute bottom-full left-0 right-0 mb-2 rounded-xl overflow-hidden"
            style={{
              backgroundColor: palette.surfaceFloating,
              border: `0.5px solid ${palette.borderMedium}`,
              boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
              backdropFilter: 'blur(24px) saturate(180%)',
            }}
          >
            {subPage === 'main' && (
              <div className="py-1.5">
                {/* User header */}
                <div className="px-3 py-2.5 border-b" style={{ borderColor: palette.borderSubtle }}>
                  <p className="text-[13px] font-medium" style={{ color: palette.textPrimary }}>{user.name}</p>
                  <p className="text-[11px] mt-0.5" style={{ fontFamily: typography.mono, color: palette.textMuted }}>{user.email}</p>
                </div>

                {/* Menu items */}
                <div className="py-1">
                  <MenuItem
                    icon={User}
                    label="Account"
                    onClick={() => setSubPage('account')}
                  />
                  <MenuItem
                    icon={Palette}
                    label="Appearance"
                    onClick={() => setSubPage('appearance')}
                  />
                  <MenuItem
                    icon={Settings}
                    label="Settings"
                    onClick={() => { setActiveView('inbox'); window.location.href = '/settings'; }}
                  />
                </div>

                {/* Divider */}
                <div className="mx-3 h-px" style={{ backgroundColor: palette.borderSubtle }} />

                {/* Sign out */}
                <div className="py-1">
                  <MenuItem
                    icon={LogOut}
                    label="Sign Out"
                    onClick={() => { logout(); setOpen(false); }}
                    danger
                  />
                </div>
              </div>
            )}

            {subPage === 'appearance' && (
              <div className="py-1.5">
                <SubpageHeader title="Appearance" onBack={resetMenu} />

                {/* Theme */}
                <div className="px-3 py-2">
                  <p className="text-[10px] font-semibold uppercase tracking-widest mb-2" style={{ fontFamily: typography.mono, color: palette.textMuted }}>
                    Theme
                  </p>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(['dark', 'sepia', 'light'] as AppTheme[]).map((t) => (
                      <button
                        key={t}
                        onClick={() => setAppTheme(t)}
                        className={cn(
                          'flex flex-col items-center gap-1.5 p-2.5 rounded-lg text-[11px] font-medium transition-all',
                          appTheme === t ? 'ring-1' : 'hover:bg-white/4'
                        )}
                        style={{
                          fontFamily: typography.mono,
                          backgroundColor: appTheme === t ? 'rgba(255,85,0,0.08)' : 'transparent',
                          color: appTheme === t ? palette.accentPrimary : palette.textSecondary,
                          boxShadow: appTheme === t ? `0 0 0 1px ${palette.accentPrimary}40` : 'none',
                        }}
                      >
                        <div
                          className="w-full h-6 rounded-md"
                          style={{
                            backgroundColor: t === 'dark' ? '#060709' : t === 'sepia' ? '#F5E6D3' : '#FFFFFF',
                            border: `1px solid ${palette.borderSubtle}`,
                          }}
                        />
                        <span className="capitalize">{t}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Font size */}
                <div className="px-3 py-2">
                  <p className="text-[10px] font-semibold uppercase tracking-widest mb-2" style={{ fontFamily: typography.mono, color: palette.textMuted }}>
                    Font Size
                  </p>
                  <div className="flex gap-1.5">
                    {(['small', 'medium', 'large'] as FontSize[]).map((s) => (
                      <button
                        key={s}
                        onClick={() => setFontSize(s)}
                        className={cn(
                          'flex-1 py-2 rounded-lg text-[11px] font-medium transition-all text-center',
                          fontSize === s ? 'ring-1' : 'hover:bg-white/4'
                        )}
                        style={{
                          fontFamily: typography.mono,
                          backgroundColor: fontSize === s ? 'rgba(255,85,0,0.08)' : 'transparent',
                          color: fontSize === s ? palette.accentPrimary : palette.textSecondary,
                          boxShadow: fontSize === s ? `0 0 0 1px ${palette.accentPrimary}40` : 'none',
                          fontSize: s === 'small' ? '10px' : s === 'large' ? '14px' : '12px',
                        }}
                      >
                        {s === 'small' ? 'A' : s === 'medium' ? 'A' : 'A'}
                        <span className="block mt-0.5 capitalize">{s}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Density */}
                <div className="px-3 py-2">
                  <p className="text-[10px] font-semibold uppercase tracking-widest mb-2" style={{ fontFamily: typography.mono, color: palette.textMuted }}>
                    Density
                  </p>
                  <div className="flex gap-1.5">
                    {(['compact', 'comfortable', 'spacious'] as Density[]).map((d) => (
                      <button
                        key={d}
                        onClick={() => setDensity(d)}
                        className={cn(
                          'flex-1 py-2 rounded-lg text-[11px] font-medium transition-all text-center capitalize',
                          density === d ? 'ring-1' : 'hover:bg-white/4'
                        )}
                        style={{
                          fontFamily: typography.mono,
                          backgroundColor: density === d ? 'rgba(255,85,0,0.08)' : 'transparent',
                          color: density === d ? palette.accentPrimary : palette.textSecondary,
                          boxShadow: density === d ? `0 0 0 1px ${palette.accentPrimary}40` : 'none',
                        }}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {subPage === 'account' && (
              <div className="py-1.5">
                <SubpageHeader title="Account" onBack={resetMenu} />

                <div className="px-3 py-3 space-y-3">
                  {/* Avatar */}
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold"
                      style={{
                        background: `linear-gradient(135deg, ${palette.accentPrimary}22, ${palette.accentSecondary}22)`,
                        color: palette.accentPrimary,
                      }}
                    >
                      {user.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: palette.textPrimary }}>{user.name}</p>
                      <p className="text-[11px]" style={{ fontFamily: typography.mono, color: palette.textMuted }}>{user.email}</p>
                    </div>
                  </div>

                  {/* Plan */}
                  <div
                    className="flex items-center justify-between p-2.5 rounded-lg"
                    style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: `0.5px solid ${palette.borderSubtle}` }}
                  >
                    <div className="flex items-center gap-2">
                      <Crown size={14} style={{ color: palette.accentPrimary }} />
                      <span className="text-[12px] font-medium" style={{ color: palette.textPrimary }}>
                        {user.planTier === 'pro' ? 'Pro Plan' : 'Free Plan'}
                      </span>
                    </div>
                    {user.planTier === 'free' && (
                      <button
                        className="text-[10px] px-2 py-1 rounded-md font-medium"
                        style={{ backgroundColor: palette.accentPrimary, color: '#fff' }}
                      >
                        Upgrade
                      </button>
                    )}
                    {user.planTier === 'pro' && (
                      <span className="text-[10px] px-2 py-1 rounded-md" style={{ color: palette.textMuted }}>
                        Active
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Helper Components ────────────────────────────── */

function MenuItem({
  icon: Icon,
  label,
  onClick,
  danger,
}: {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] font-medium transition-colors hover:bg-white/4"
      style={{
        fontFamily: typography.ui,
        color: danger ? '#EF4444' : palette.textSecondary,
      }}
    >
      <Icon size={15} />
      <span>{label}</span>
    </button>
  );
}

function SubpageHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div
      className="flex items-center gap-2 px-3 py-2.5 border-b"
      style={{ borderColor: palette.borderSubtle }}
    >
      <button
        onClick={onBack}
        className="p-1 rounded-md hover:bg-white/5 transition-colors"
        style={{ color: palette.textSecondary }}
      >
        <ChevronRight size={14} className="rotate-180" />
      </button>
      <span className="text-[13px] font-semibold" style={{ color: palette.textPrimary }}>
        {title}
      </span>
    </div>
  );
}
