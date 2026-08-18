'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { palette, spring, typography } from '@/lib/tokens';
import { X, Link, Loader2 } from 'lucide-react';

interface AddBookmarkModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (url: string, title?: string) => void;
}

export function AddBookmarkModal({ open, onClose, onSubmit }: AddBookmarkModalProps) {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    setIsLoading(true);
    setTimeout(() => {
      onSubmit?.(url, title || undefined);
      setUrl('');
      setTitle('');
      setIsLoading(false);
      onClose();
    }, 800);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-100"
            style={{
              backgroundColor: 'rgba(8,9,10,0.6)',
              backdropFilter: 'blur(8px)',
            }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{
              type: 'spring',
              stiffness: spring.card.stiffness,
              damping: spring.card.damping,
              mass: spring.card.mass,
            }}
            className="fixed top-[20%] left-1/2 -translate-x-1/2 z-101 w-full max-w-md"
          >
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl overflow-hidden"
              style={{
                backgroundColor: palette.surfaceFloating,
                border: `0.5px solid ${palette.borderSubtle}`,
                boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
              }}
            >
              {/* Header */}
              <div
                className="flex items-center justify-between px-5 h-12"
                style={{ borderBottom: `1px solid ${palette.borderSubtle}` }}
              >
                <span
                  className="text-sm font-semibold tracking-tight"
                  style={{ fontFamily: typography.ui, color: palette.textPrimary }}
                >
                  Add Bookmark
                </span>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1 rounded-lg transition-all duration-200 hover:bg-white/5 active:scale-90"
                  style={{ color: palette.textMuted }}
                >
                  <X size={16} />
                </button>
              </div>

              <div className="p-5 space-y-4">
                {/* URL Input */}
                <div className="space-y-1.5">
                  <label
                    className="text-[11px] font-medium uppercase tracking-wider"
                    style={{ fontFamily: typography.mono, color: palette.textMuted }}
                  >
                    URL
                  </label>
                  <div
                    className="flex items-center gap-2 rounded-lg px-3 h-10 transition-colors duration-200 focus-within:ring-1 focus-within:ring-[#FF5500]/30"
                    style={{
                      backgroundColor: palette.surfaceBase,
                      border: `0.5px solid ${palette.borderSubtle}`,
                    }}
                  >
                    <Link size={14} style={{ color: palette.textMuted }} />
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://example.com/article"
                      className="flex-1 bg-transparent text-sm outline-none"
                      style={{ fontFamily: typography.ui, color: palette.textPrimary }}
                      autoFocus
                    />
                  </div>
                </div>

                {/* Title Input */}
                <div className="space-y-1.5">
                  <label
                    className="text-[11px] font-medium uppercase tracking-wider"
                    style={{ fontFamily: typography.mono, color: palette.textMuted }}
                  >
                    Title (optional)
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Auto-extracted if left empty"
                    className="w-full rounded-lg px-3 h-10 bg-transparent text-sm outline-none transition-colors duration-200 focus:ring-1 focus:ring-[#FF5500]/30"
                    style={{
                      fontFamily: typography.ui,
                      color: palette.textPrimary,
                      backgroundColor: palette.surfaceBase,
                      border: `0.5px solid ${palette.borderSubtle}`,
                    }}
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={!url || isLoading}
                  className="w-full h-10 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all duration-200 hover:brightness-110 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{
                    fontFamily: typography.ui,
                    backgroundColor: '#FF5500',
                    color: '#fff',
                  }}
                >
                  {isLoading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    'Save to STRATA'
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
