// STRATA Design Tokens & Palette
// Liquid Glass × Editorial Dark × Physical Stationery

export const palette = {
  // Background Ground (OLED)
  bgGround: '#060709',
  // Surface Baseplate
  surfaceBase: '#0C0E12',
  // Surface Elevated
  surfaceElevated: '#11141A',
  // Surface Floating / Modals
  surfaceFloating: '#181C24',
  // Surface Glass
  surfaceGlass: 'rgba(14, 17, 23, 0.72)',
  // Borders
  borderSubtle: 'rgba(255, 255, 255, 0.06)',
  borderMedium: 'rgba(255, 255, 255, 0.10)',
  borderBright: 'rgba(255, 255, 255, 0.16)',
  // Accent Primary — Signal Amber
  accentPrimary: '#FF5500',
  accentPrimaryDim: 'rgba(255, 85, 0, 0.12)',
  accentPrimaryGlow: 'rgba(255, 85, 0, 0.25)',
  // Accent Secondary — Electric Iris
  accentSecondary: '#635BFF',
  accentSecondaryDim: 'rgba(99, 91, 255, 0.12)',
  // Text
  textPrimary: '#F2F4F8',
  textSecondary: '#8A909E',
  textMuted: '#4A5060',
  textGhost: '#2E3340',
  // Status
  success: '#34D399',
  warning: '#FBBF24',
  danger: '#EF4444',
} as const;

export const spring = {
  // Card Elevation & Recoil
  card: { stiffness: 350, damping: 26, mass: 0.8 },
  // Reader Sheet Morph
  reader: { stiffness: 420, damping: 38, mass: 1.0 },
  // Triage Drag-and-Fling
  triage: { stiffness: 260, damping: 20, mass: 0.5 },
  // Sidebar transitions
  sidebar: { stiffness: 300, damping: 30, mass: 0.8 },
} as const;

export const typography = {
  display: 'var(--font-display), "Instrument Serif", Georgia, serif',
  ui: 'var(--font-ui), "Geist Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  mono: 'var(--font-mono), "JetBrains Mono", "SF Mono", monospace',
} as const;

export const planLimits = {
  free: {
    maxBookmarks: 250,
    allowSemanticSearch: false,
    allowFullTextArchive: false,
    allowAudioTTS: false,
    maxUploadSizeBytes: 10 * 1024 * 1024,
  },
  pro: {
    maxBookmarks: Infinity,
    allowSemanticSearch: true,
    allowFullTextArchive: true,
    allowAudioTTS: true,
    maxUploadSizeBytes: 500 * 1024 * 1024,
  },
} as const;

export type PlanTier = keyof typeof planLimits;
