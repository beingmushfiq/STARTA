'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { AppProvider, useApp } from '@/lib/store';
import { palette, typography, spring } from '@/lib/tokens';

/* ── Floating ambient orbs ─────────────────────────────────── */
function AmbientOrbs() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden>
      <span
        className="orb"
        style={{
          position: 'absolute',
          width: 320,
          height: 320,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,85,0,0.07) 0%, transparent 70%)',
          top: '-5%',
          left: '-4%',
          animation: 'orb-float-1 18s ease-in-out infinite',
        }}
      />
      <span
        className="orb"
        style={{
          position: 'absolute',
          width: 260,
          height: 260,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,91,255,0.06) 0%, transparent 70%)',
          bottom: '5%',
          right: '-3%',
          animation: 'orb-float-2 22s ease-in-out infinite',
        }}
      />
      <span
        className="orb"
        style={{
          position: 'absolute',
          width: 180,
          height: 180,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,85,0,0.04) 0%, transparent 70%)',
          top: '55%',
          left: '15%',
          animation: 'orb-float-3 15s ease-in-out infinite',
        }}
      />
      <span
        className="orb"
        style={{
          position: 'absolute',
          width: 140,
          height: 140,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,91,255,0.04) 0%, transparent 70%)',
          top: '12%',
          right: '20%',
          animation: 'orb-float-4 20s ease-in-out infinite',
        }}
      />

      <style>{`
        @keyframes orb-float-1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, 20px) scale(1.05); }
          66% { transform: translate(-15px, 35px) scale(0.95); }
        }
        @keyframes orb-float-2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-25px, -30px) scale(1.08); }
          66% { transform: translate(20px, -15px) scale(0.92); }
        }
        @keyframes orb-float-3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(25px, -20px) scale(1.1); }
        }
        @keyframes orb-float-4 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          40% { transform: translate(-20px, 25px) scale(1.06); }
          80% { transform: translate(15px, -10px) scale(0.94); }
        }
      `}</style>
    </div>
  );
}

/* ── Main page ─────────────────────────────────────────────── */
function LoginPageInner() {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useApp();

  const handleLogin = useCallback(() => {
    if (isLoading) return;
    setIsLoading(true);
    // Simulate Google OAuth — create demo user session
    login({
      name: 'Aayan',
      email: 'aayan@example.com',
      avatarUrl: null,
      planTier: 'pro',
    });
    setTimeout(() => {
      window.location.href = '/';
    }, 800);
  }, [isLoading, login]);

  /* Press Enter to sign in */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter') handleLogin();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleLogin]);

  return (
    <div
      className="relative min-h-screen flex items-center justify-center px-5 overflow-hidden"
      style={{ backgroundColor: '#060709' }}
    >
      {/* ── Background ambient gradients ── */}
      <div
        className="fixed inset-0 pointer-events-none"
        aria-hidden
        style={{
          background: `
            radial-gradient(ellipse 70% 55% at 15% 10%, rgba(255,85,0,0.08), transparent),
            radial-gradient(ellipse 55% 45% at 85% 85%, rgba(99,91,255,0.06), transparent)
          `,
        }}
      />

      {/* ── Floating orbs ── */}
      <AmbientOrbs />

      {/* ── Noise texture ── */}
      <div className="noise-overlay fixed inset-0 pointer-events-none" aria-hidden />

      {/* ── Login card ── */}
      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          type: 'spring',
          stiffness: spring.card.stiffness,
          damping: spring.card.damping,
          mass: spring.card.mass,
        }}
        className="relative z-10 w-full max-w-sm"
      >
        <div
          className="border-gradient rounded-2xl p-8 sm:p-10 text-center"
          style={{
            backgroundColor: 'rgba(22, 25, 31, 0.65)',
            backdropFilter: 'blur(40px) saturate(180%)',
            WebkitBackdropFilter: 'blur(40px) saturate(180%)',
            boxShadow: '0 24px 80px rgba(0,0,0,0.55), 0 0 0 0.5px rgba(255,255,255,0.05)',
          }}
        >
          {/* ── Logo ── */}
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.08, type: 'spring', stiffness: 320, damping: 22 }}
            className="relative mx-auto mb-7 w-18 h-18 rounded-[22px] flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, rgba(255,85,0,0.10), rgba(99,91,255,0.08))',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: `
                0 0 0 1px rgba(255,85,0,0.15),
                0 0 32px rgba(255,85,0,0.10),
                0 8px 32px rgba(0,0,0,0.35),
                inset 0 1px 0 rgba(255,255,255,0.06)
              `,
            }}
          >
            {/* Amber glow ring */}
            <span
              className="absolute -inset-0.75 rounded-[25px]"
              style={{
                background: 'conic-gradient(from 180deg, rgba(255,85,0,0.25), transparent 40%, rgba(255,85,0,0.08) 60%, transparent)',
                filter: 'blur(4px)',
                opacity: 0.7,
              }}
            />
            <span
              className="relative text-[32px] font-bold"
              style={{
                fontFamily: typography.display,
                color: palette.accentPrimary,
                textShadow: '0 0 20px rgba(255,85,0,0.3)',
              }}
            >
              S
            </span>
          </motion.div>

          {/* ── Title ── */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="text-[34px] leading-none tracking-tight mb-2"
            style={{
              fontFamily: typography.display,
              fontWeight: 400,
              color: palette.textPrimary,
              letterSpacing: '-0.02em',
            }}
          >
            STRATA
          </motion.h1>

          {/* ── Subtitle ── */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="text-[13px] mb-8"
            style={{
              fontFamily: typography.ui,
              color: palette.textSecondary,
              letterSpacing: '0.01em',
            }}
          >
            Your visual knowledge engine
          </motion.p>

          {/* ── Google sign-in button ── */}
          <motion.button
            onClick={handleLogin}
            disabled={isLoading}
            whileHover={!isLoading ? { scale: 1.02 } : undefined}
            whileTap={!isLoading ? { scale: 0.98 } : undefined}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="relative w-full flex items-center justify-center gap-3 h-12 rounded-xl text-[14px] font-medium transition-colors duration-200 cursor-pointer disabled:cursor-wait"
            style={{
              fontFamily: typography.ui,
              backgroundColor: '#ffffff',
              color: '#1f2937',
              border: 'none',
              boxShadow: '0 2px 12px rgba(0,0,0,0.25)',
            }}
          >
            {isLoading ? (
              /* Spinning ring loader */
              <span className="relative flex items-center justify-center">
                <span
                  className="block w-5 h-5 rounded-full"
                  style={{
                    border: '2px solid #e5e7eb',
                    borderTopColor: '#1f2937',
                    animation: 'login-spin 0.8s linear infinite',
                  }}
                />
                <style>{`
                  @keyframes login-spin {
                    to { transform: rotate(360deg); }
                  }
                `}</style>
              </span>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Continue with Google
              </>
            )}
          </motion.button>

          {/* ── Footer note ── */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-6 text-[11px] tracking-wide"
            style={{
              fontFamily: typography.mono,
              color: palette.textMuted,
            }}
          >
            Free forever &middot; 250 bookmarks
          </motion.p>
        </div>

        {/* ── Keyboard hint ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55, duration: 0.5 }}
          className="mt-5 text-center"
        >
          <p
            className="text-[10px]"
            style={{
              fontFamily: typography.mono,
              color: palette.textMuted,
              letterSpacing: '0.03em',
            }}
          >
            Press{' '}
            <kbd
              className="inline-block px-1.5 py-0.5 rounded-sm mx-0.5"
              style={{
                border: '1px solid rgba(255,255,255,0.08)',
                backgroundColor: 'rgba(255,255,255,0.04)',
                color: palette.textSecondary,
                fontSize: '9px',
                fontFamily: typography.mono,
              }}
            >
              Enter
            </kbd>{' '}
            to sign in
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <AppProvider>
      <LoginPageInner />
    </AppProvider>
  );
}
