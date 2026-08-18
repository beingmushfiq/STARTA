'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { palette, typography, planLimits, type PlanTier } from '@/lib/tokens';
import { Crown, Zap } from 'lucide-react';

interface PlanBadgeProps {
  tier: PlanTier;
  bookmarkCount?: number;
  onUpgrade?: () => void;
}

export function PlanBadge({ tier, bookmarkCount = 0, onUpgrade }: PlanBadgeProps) {
  const limit = planLimits[tier].maxBookmarks;
  const usagePercent = limit === Infinity ? 0 : Math.min((bookmarkCount / limit) * 100, 100);

  return (
    <div
      className="rounded-xl p-4 space-y-3"
      style={{
        backgroundColor: palette.surfaceBase,
        border: `0.5px solid ${palette.borderSubtle}`,
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {tier === 'pro' ? (
            <Crown size={16} style={{ color: palette.accentPrimary }} />
          ) : (
            <Zap size={16} style={{ color: palette.accentSecondary }} />
          )}
          <span
            className="text-sm font-semibold uppercase tracking-wider"
            style={{
              fontFamily: typography.mono,
              color: tier === 'pro' ? palette.accentPrimary : palette.accentSecondary,
            }}
          >
            {tier}
          </span>
        </div>
        {tier === 'free' && onUpgrade && (
          <button
            onClick={onUpgrade}
            className="px-3 py-1 rounded-lg text-xs font-medium transition-all hover:opacity-90"
            style={{
              fontFamily: typography.ui,
              backgroundColor: palette.accentPrimary,
              color: '#fff',
            }}
          >
            Upgrade to Pro
          </button>
        )}
      </div>

      {tier === 'free' && (
        <>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span style={{ fontFamily: typography.mono, color: palette.textMuted }}>
                Bookmarks
              </span>
              <span style={{ fontFamily: typography.mono, color: palette.textSecondary }}>
                {bookmarkCount} / {limit}
              </span>
            </div>
            <div
              className="h-1.5 rounded-full overflow-hidden"
              style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${usagePercent}%` }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="h-full rounded-full"
                style={{
                  backgroundColor:
                    usagePercent > 80 ? '#EF4444' : palette.accentSecondary,
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            {[
              { label: 'Semantic Search', value: false },
              { label: 'Full Archive', value: false },
              { label: 'Audio TTS', value: false },
              { label: 'Upload', value: '10MB' },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="flex items-center gap-1.5 text-[10px]"
                style={{ fontFamily: typography.mono, color: palette.textMuted }}
              >
                <span style={{ color: value ? '#34D399' : '#EF4444' }}>
                  {value ? '✓' : '✕'}
                </span>
                {label}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function enforceQuota(tier: PlanTier, currentUsage: number) {
  const limit = planLimits[tier].maxBookmarks;
  if (currentUsage >= limit) {
    throw new Error(
      `QUOTA_EXCEEDED: Upgrade to Pro to save more than ${limit} items.`
    );
  }
}
