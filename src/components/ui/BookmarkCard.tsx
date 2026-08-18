'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import type { Bookmark } from '@/lib/types';
import { palette, spring, typography } from '@/lib/tokens';
import {
  ExternalLink,
  Pin,
  Clock,
  Archive,
  Trash2,
  FileText,
  Play,
  Image as ImageIcon,
  Headphones,
  MessageCircle,
  Code2,
  Film,
} from 'lucide-react';
import Image from 'next/image';

interface BookmarkCardProps {
  bookmark: Bookmark;
  index: number;
  onSelect?: (id: string) => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mediaTypeBadge: Record<string, { icon: any; color: string }> = {
  article: { icon: FileText, color: palette.accentSecondary },
  video: { icon: Play, color: '#EF4444' },
  image: { icon: ImageIcon, color: '#FBBF24' },
  pdf: { icon: Film, color: '#EF4444' },
  audio: { icon: Headphones, color: '#34D399' },
  tweet: { icon: MessageCircle, color: '#38BDF8' },
  source_code: { icon: Code2, color: palette.accentPrimary },
};

export function BookmarkCard({ bookmark, index, onSelect }: BookmarkCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const badge = mediaTypeBadge[bookmark.mediaType] || mediaTypeBadge.article;
  const BadgeIcon = badge.icon;

  return (
    <motion.div
      ref={cardRef}
      className="card-glow group relative cursor-pointer overflow-hidden rounded-2xl"
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        type: 'spring',
        stiffness: spring.card.stiffness,
        damping: spring.card.damping,
        mass: spring.card.mass,
        delay: index * 0.04,
      }}
      whileHover={{
        y: -6,
        scale: 1.015,
        boxShadow: '0 8px 40px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.08)',
        transition: { type: 'spring', stiffness: 400, damping: 25 },
      }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect?.(bookmark.id)}
      style={{
        backgroundColor: palette.surfaceBase,
        border: '0.5px solid rgba(255,255,255,0.06)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
      }}
    >
      {/* Cover Image */}
      {bookmark.coverImageUrl && (
        <div className="relative w-full aspect-16/10 overflow-hidden">
          <Image
            src={bookmark.coverImageUrl}
            alt=""
            fill
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            unoptimized
          />
          {/* Gradient overlay */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(0deg, rgba(8,9,10,0.85) 0%, rgba(8,9,10,0.25) 40%, transparent 70%)',
            }}
          />

          {/* Pinned indicator */}
          {bookmark.isPinned && (
            <div className="absolute top-3 right-3">
              <Pin
                size={13}
                fill="#FBBF24"
                style={{ color: '#FBBF24' }}
              />
            </div>
          )}

          {/* Media type badge */}
          <div
            className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-full"
            style={{
              backgroundColor: `${badge.color}18`,
              border: `1px solid ${badge.color}25`,
              backdropFilter: 'blur(12px)',
            }}
          >
            <BadgeIcon size={10} />
            <span
              className="text-[9px] font-semibold uppercase tracking-widest"
              style={{
                fontFamily: typography.mono,
                color: badge.color,
              }}
            >
              {bookmark.mediaType.replace('_', ' ')}
            </span>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-4 space-y-2.5">
        {/* Title */}
        <h3
          className="text-[15px] font-semibold leading-snug line-clamp-2"
          style={{
            fontFamily: typography.ui,
            color: palette.textPrimary,
          }}
        >
          {bookmark.title}
        </h3>

        {/* Description */}
        {bookmark.description && (
          <p
            className="text-[13px] leading-relaxed line-clamp-2"
            style={{
              fontFamily: typography.ui,
              color: palette.textSecondary,
            }}
          >
            {bookmark.description}
          </p>
        )}

        {/* Tags */}
        {bookmark.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {bookmark.tags.slice(0, 3).map((tag) => (
              <span
                key={tag.id}
                className="px-2 py-0.5 rounded-full text-[10px] font-medium"
                style={{
                  fontFamily: typography.mono,
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  color: palette.textMuted,
                }}
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}

        {/* Meta row: domain · reading time */}
        <div
          className="flex items-center gap-2 pt-1"
          style={{ color: palette.textMuted }}
        >
          <span
            className="text-[11px] uppercase tracking-wider font-medium"
            style={{ fontFamily: typography.mono }}
          >
            {bookmark.domain}
          </span>
          <span
            className="text-[10px]"
            style={{ color: palette.textMuted, opacity: 0.5 }}
          >
            ·
          </span>
          <span
            className="text-[11px] flex items-center gap-1"
            style={{ fontFamily: typography.mono }}
          >
            <Clock size={10} />
            {bookmark.readingTimeMinutes}m
          </span>
        </div>
      </div>

      {/* Hover actions */}
      <div
        className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100"
        style={{ transition: 'opacity 0.15s ease-out' }}
      >
        {[
          { icon: ExternalLink, label: 'Open' },
          { icon: Archive, label: 'Archive' },
          { icon: Trash2, label: 'Delete' },
        ].map(({ icon: Icon, label }) => (
          <button
            key={label}
            title={label}
            className="p-1.5 rounded-lg backdrop-blur-md"
            style={{
              backgroundColor: 'rgba(15,17,21,0.75)',
              color: palette.textSecondary,
              transition: 'background-color 0.15s ease-out',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(30,33,40,0.85)';
              e.currentTarget.style.color = palette.textPrimary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(15,17,21,0.75)';
              e.currentTarget.style.color = palette.textSecondary;
            }}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <Icon size={13} />
          </button>
        ))}
      </div>
    </motion.div>
  );
}
