import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-ui",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "STRATA — Visual Knowledge & Bookmarking Engine",
    template: "%s — STRATA",
  },
  description:
    "STRATA is a hyper-premium, local-first, motion-driven visual knowledge and bookmarking platform. Never lose a link again.",
  keywords: [
    "bookmarks",
    "knowledge management",
    "read later",
    "bookmark organizer",
    "visual bookmarks",
    "content curation",
    "local-first",
    "privacy-first",
  ],
  authors: [{ name: "STRATA" }],
  creator: "STRATA",
  publisher: "STRATA",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "STRATA",
    title: "STRATA — Visual Knowledge & Bookmarking Engine",
    description:
      "A hyper-premium, local-first, motion-driven visual knowledge and bookmarking platform.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "STRATA — Visual Knowledge Engine",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "STRATA — Visual Knowledge & Bookmarking Engine",
    description:
      "A hyper-premium, local-first, motion-driven visual knowledge and bookmarking platform.",
    images: ["/og-image.png"],
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#060709",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://coresg-normal.trae.ai" />
      </head>
      <body className="h-full overflow-hidden">{children}</body>
    </html>
  );
}
