'use client';

import type React from 'react';
import { motion } from 'framer-motion';
import { palette, typography, type PlanTier } from '@/lib/tokens';
import { PlanBadge } from '@/components/ui/PlanBadge';
import { mockBookmarks, mockUser, mockTenant } from '@/lib/mock-data';
import {
  ArrowLeft,
  User,
  CreditCard,
  Keyboard,
  Info,
} from 'lucide-react';

export default function SettingsPage() {
  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: palette.bgGround }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-4 px-6 h-14 border-b"
        style={{ borderColor: palette.borderSubtle }}
      >
        <a
          href="/"
          className="p-2 rounded-lg transition-colors hover:bg-white/5"
          style={{ color: palette.textSecondary }}
        >
          <ArrowLeft size={16} />
        </a>
        <h1
          className="text-lg font-semibold"
          style={{ fontFamily: typography.ui, color: palette.textPrimary }}
        >
          Settings
        </h1>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8 space-y-8">
        {/* Profile */}
        <Section title="Profile" icon={User}>
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold"
              style={{ backgroundColor: `${palette.accentPrimary}20`, color: palette.accentPrimary }}
            >
              {mockUser.displayName[0]}
            </div>
            <div>
              <p
                className="font-medium"
                style={{ fontFamily: typography.ui, color: palette.textPrimary }}
              >
                {mockUser.displayName}
              </p>
              <p
                className="text-sm"
                style={{ fontFamily: typography.mono, color: palette.textMuted }}
              >
                {mockUser.email}
              </p>
            </div>
          </div>
        </Section>

        {/* Subscription */}
        <Section title="Subscription" icon={CreditCard}>
          <PlanBadge
            tier={mockTenant.planTier as PlanTier}
            bookmarkCount={mockBookmarks.length}
          />
        </Section>

        {/* Keyboard Shortcuts */}
        <Section title="Keyboard Shortcuts" icon={Keyboard}>
          <div className="space-y-2">
            {[
              { key: 'J / K', desc: 'Navigate items' },
              { key: 'Enter', desc: 'Open in Reader' },
              { key: 'E', desc: 'Archive' },
              { key: 'D', desc: 'Delete' },
              { key: '⌘K', desc: 'Command palette' },
              { key: 'C', desc: 'Collection selector' },
              { key: 'T', desc: 'Tag input' },
              { key: 'O', desc: 'Open original' },
            ].map(({ key, desc }) => (
              <div
                key={key}
                className="flex items-center justify-between py-1.5"
              >
                <span
                  className="text-sm"
                  style={{ fontFamily: typography.ui, color: palette.textSecondary }}
                >
                  {desc}
                </span>
                <kbd
                  className="text-[11px] px-2 py-1 rounded"
                  style={{
                    fontFamily: typography.mono,
                    color: palette.textMuted,
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    border: `0.5px solid ${palette.borderSubtle}`,
                  }}
                >
                  {key}
                </kbd>
              </div>
            ))}
          </div>
        </Section>

        {/* About */}
        <Section title="About" icon={Info}>
          <div className="space-y-2 text-sm" style={{ fontFamily: typography.mono, color: palette.textMuted }}>
            <p>STRATA v1.0.0</p>
            <p>Visual Knowledge & Bookmarking Engine</p>
            <p>Built with Next.js, Framer Motion, and Tailwind CSS</p>
          </div>
        </Section>
      </div>
    </div>
  );
}

function Section({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl overflow-hidden"
      style={{
        backgroundColor: palette.surfaceBase,
        border: `0.5px solid ${palette.borderSubtle}`,
      }}
    >
      <div
        className="flex items-center gap-2 px-5 py-3 border-b"
        style={{ borderColor: palette.borderSubtle }}
      >
        <Icon size={16} style={{ color: palette.accentPrimary }} />
        <span
          className="text-sm font-semibold"
          style={{ fontFamily: typography.ui, color: palette.textPrimary }}
        >
          {title}
        </span>
      </div>
      <div className="p-5">{children}</div>
    </motion.div>
  );
}
