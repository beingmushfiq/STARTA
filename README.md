# STRATA — Visual Knowledge & Bookmarking Engine

> A hyper-premium, local-first, motion-driven visual knowledge and bookmarking platform. Never lose a link again.

STRATA eliminates the "bookmark graveyard" through an editorial aesthetic, physics-based kinetic animations, intelligent content extraction, and frictionless Google SSO onboarding.

---

## Features

- **Dynamic Masonry Canvas** — Responsive card grid with extracted cover art, auto-generated color tags, and spring-physics animations
- **Editorial Reader View** — Adjustable column widths (50ch–75ch), dark/sepia modes, margin notes, and text-to-speech
- **Focus Stream (Triage Mode)** — Full-screen distraction-free triage for high-velocity inbox clearing with swipe and keyboard shortcuts
- **Semantic Hybrid Search** — Command+K palette with vector embeddings and cosine similarity for natural-language queries
- **Universal Keyboard Navigation** — J/K, E (archive), D (delete), Space (read), and more
- **Cursor-following Highlight** — Radial specular gradient tracking cursor coordinates
- **Add Bookmark Modal** — Quick URL capture with auto-extraction
- **Plan Gating** — Free (250 bookmarks) and Pro (unlimited) tiers with Stripe integration
- **Responsive Design** — Desktop sidebar, mobile bottom navigation with safe area support
- **PWA Ready** — Installable as a Progressive Web App with offline support
- **Security Hardened** — CSP headers, X-Frame-Options DENY, frame-ancestors none

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| Animation | Framer Motion (spring physics) |
| Icons | Lucide React |
| Fonts | Inter + JetBrains Mono |
| Auth | Google OAuth 2.0 + PKCE (JWE sessions) |
| Database | PostgreSQL (Prisma ORM) + Vector embeddings |
| Payments | Stripe (Checkout + Webhooks) |
| Infra | Cloudflare (Edge, R2, Workers) |
| Workers | BullMQ + Playwright + Mozilla Readability |

---

## Getting Started

### Prerequisites

- Node.js 18+ (recommended: 20+)
- npm, yarn, or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/strata.git
cd strata

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser.

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Production |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | Auth |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | Auth |
| `NEXT_PUBLIC_APP_URL` | Your app's public URL | Yes |
| `SESSION_ENCRYPTION_KEY` | 64-char encryption key for sessions | Yes |
| `OPENAI_API_KEY` | OpenAI API key for embeddings | Semantic search |
| `STRIPE_SECRET_KEY` | Stripe secret key | Payments |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret | Payments |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | Payments |

---

## Project Structure

```
strata/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/               # API routes (auth, bookmarks, stripe)
│   │   ├── login/             # Login page
│   │   ├── settings/          # Settings page
│   │   ├── globals.css        # Global design system
│   │   ├── layout.tsx         # Root layout with SEO/meta
│   │   └── page.tsx           # Main application
│   ├── components/
│   │   ├── layout/            # AppShell, Sidebar, MobileNav, CursorHighlight
│   │   ├── reader/            # Editorial Reader view
│   │   ├── ui/                # BookmarkCard, MasonryGrid, CommandPalette, etc.
│   │   └── views/             # BookmarksView, TriageView
│   ├── hooks/                 # useKeyboardNav
│   └── lib/                   # Design tokens, types, store, mock data
├── public/                    # PWA manifest, icons, static assets
├── vercel.json                # Vercel deployment config
├── Dockerfile                 # Docker build config
├── docker-compose.yml         # Docker Compose config
├── netlify.toml               # Netlify deployment config
├── .env.example               # Environment variable template
└── .env.local                 # Local environment variables
```

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `J` / `K` or `↓` / `↑` | Navigate items |
| `Enter` / `Space` | Open in Reader |
| `E` | Archive bookmark |
| `D` / `Delete` | Move to trash |
| `⌘K` / `Ctrl+K` | Command palette / Search |
| `C` | Collection selector |
| `T` | Focus tag input |
| `O` | Open original URL |

---

## Design System

STRATA follows **Swiss Graphic Design meets Physical Stationery** aesthetic:

- **Background (OLED):** `#08090A`
- **Surface Baseplate:** `#0F1115`
- **Surface Floating:** `#16191F` with `backdrop-filter: blur(24px) saturate(180%)`
- **Accent Primary (Signal Amber):** `#FF5500`
- **Accent Secondary (Electric Iris):** `#635BFF`
- **Text Primary:** `#F2F4F8` | Secondary: `#8A909E` | Muted: `#525866`

All transitions use hardware-accelerated spring curves via Framer Motion.

---

## Deployment

### Option 1: Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

Set environment variables in Vercel dashboard. Free tier includes: serverless functions, edge network, automatic HTTPS, and custom domains.

### Option 2: Docker

```bash
# Build the image
docker build -t strata .

# Run with environment file
docker run -p 3000:3000 --env-file .env.local strata

# Or use Docker Compose
docker-compose up -d
```

### Option 3: Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod --dir=.next
```

### Option 4: Any Node.js Host

```bash
# Install dependencies
npm ci --omit=dev

# Build
npm run build

# Start production server
npm start
```

The server will start on port 3000.

### Production Checklist

1. Set all environment variables in your hosting dashboard
2. Configure Google OAuth redirect URLs for your production domain
3. Set up Stripe webhook endpoints pointing to `/api/stripe/webhook`
4. Run database migrations against your production PostgreSQL
5. Verify CSP headers and security settings
6. Generate a secure `SESSION_ENCRYPTION_KEY` (64 random characters)

---

## License

MIT © STRATA
