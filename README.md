<div align="center">

# STRATA

### Visual Knowledge & Bookmarking Engine

A hyper-premium, local-first, motion-driven visual knowledge and bookmarking platform.
Never lose a link again.

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)
[![Framer Motion](https://img.shields.io/badge/Framer-Motion-13-ff5500?style=flat-square)](https://framer.com/motion)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

<br />

[**Deploy on Vercel**](https://vercel.com/new/clone?repository-url=https://github.com/beingmushfiq/STARTA) · [**Deploy on Netlify**](https://app.netlify.com/start/deploy?repository=https://github.com/beingmushfiq/STARTA) · [**Deploy with Docker**](#docker)

<br />

</div>

---

## Highlights

<table>
<tr>
<td width="50%">

**Dynamic Masonry Canvas**
Responsive card grid with extracted cover art, auto-generated color tags, and spring-physics animations.

**Editorial Reader View**
Adjustable column widths (50ch–75ch), dark/sepia modes, margin notes, and text-to-speech.

**Focus Stream (Triage)**
Full-screen distraction-free triage for high-velocity inbox clearing with swipe and keyboard shortcuts.

</td>
<td width="50%">

**Semantic Search**
Command+K palette with vector embeddings and cosine similarity for natural-language queries.

**Keyboard Navigation**
`J` / `K` navigate, `E` archive, `D` delete, `Space` read, `⌘K` search — pure keyboard workflow.

**Plan Gating**
Free (250 bookmarks) and Pro (unlimited) tiers with Stripe integration.

</td>
</tr>
</table>

---

## Quick Start

### Prerequisites

- **Node.js** 18+ (recommended: 20+)
- **npm**, **yarn**, or **pnpm**

### 1. Clone & Install

```bash
git clone https://github.com/beingmushfiq/STARTA.git
cd STARTA
npm install
```

### 2. Configure

```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials. See [Environment Variables](#environment-variables) below.

### 3. Run

```bash
npm run dev
```

Open **http://localhost:3001** in your browser.

---

## Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/beingmushfiq/STARTA)

```bash
npm i -g vercel
vercel --prod
```

Free tier: serverless functions, edge network, automatic HTTPS, custom domains.

### Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/beingmushfiq/STARTA)

```bash
npm i -g netlify-cli
npm run build
netlify deploy --prod --dir=.next
```

### Docker

```bash
# Build
docker build -t strata .

# Run
docker run -p 3000:3000 --env-file .env.local strata

# Or use Docker Compose
docker-compose up -d
```

### Any Node.js Host

```bash
npm ci --omit=dev
npm run build
npm start
```

Server starts on port **3000**.

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

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `J` / `K` or `↓` / `↑` | Navigate items |
| `Enter` / `Space` | Open in Reader |
| `E` | Archive bookmark |
| `D` / `Delete` | Move to trash |
| `⌘K` / `Ctrl+K` | Command palette / Search |
| `O` | Open original URL |
| `Escape` | Exit triage / reader |

---

## Design System

STRATA follows **Swiss Graphic Design meets Physical Stationery** aesthetic:

| Token | Value | Usage |
|-------|-------|-------|
| Background | `#08090A` | OLED black canvas |
| Surface Base | `#0F1115` | Cards, panels |
| Surface Float | `#16191F` | `blur(24px) saturate(180%)` |
| Accent Primary | `#FF5500` | Signal Amber |
| Accent Secondary | `#635BFF` | Electric Iris |
| Text Primary | `#F2F4F8` | Headings, body |
| Text Secondary | `#8A909E` | Descriptions |
| Text Muted | `#525866` | Meta, hints |

All transitions use hardware-accelerated spring curves via Framer Motion.

---

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes (auth, bookmarks, stripe)
│   ├── login/             # Login page
│   ├── settings/          # Settings page
│   ├── globals.css        # Global design system
│   ├── layout.tsx         # Root layout with SEO/meta
│   └── page.tsx           # Main application
├── components/
│   ├── layout/            # AppShell, Sidebar, MobileNav, CursorHighlight
│   ├── reader/            # Editorial Reader view
│   ├── ui/                # BookmarkCard, MasonryGrid, CommandPalette, etc.
│   └── views/             # BookmarksView, TriageView
├── hooks/                 # useKeyboardNav
└── lib/                   # Design tokens, types, store, mock data
```

---

## Environment Variables

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

## Production Checklist

- [ ] Set all environment variables in your hosting dashboard
- [ ] Configure Google OAuth redirect URLs for your production domain
- [ ] Set up Stripe webhook endpoints pointing to `/api/stripe/webhook`
- [ ] Run database migrations against your production PostgreSQL
- [ ] Verify CSP headers and security settings
- [ ] Generate a secure `SESSION_ENCRYPTION_KEY` (64 random characters)

---

## License

MIT © [STRATA](https://github.com/beingmushfiq/STARTA)
