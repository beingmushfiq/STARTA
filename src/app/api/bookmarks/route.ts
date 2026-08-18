// STRATA Bookmarks API — CRUD operations
// In production, connects to PostgreSQL with RLS

import { NextRequest, NextResponse } from 'next/server';

// POST /api/bookmarks — Create a new bookmark
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url, title, description, collectionId, tags } = body;

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Extract domain from URL
    let domain: string;
    try {
      domain = new URL(url).hostname.replace('www.', '');
    } catch {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
    }

    // In production:
    // 1. Check quota against plan tier
    // 2. Insert bookmark into database
    // 3. Queue ingest job (DOM fetch, Readability, embed)
    // 4. Return bookmark immediately (optimistic)

    const bookmark = {
      id: `b_${Date.now()}`,
      url,
      domain,
      title: title || url,
      description: description || null,
      collectionId: collectionId || null,
      status: 'inbox',
      mediaType: detectMediaType(url),
      readingTimeMinutes: 0,
      tags: tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json(bookmark, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: 'Failed to create bookmark' },
      { status: 500 }
    );
  }
}

// GET /api/bookmarks — List bookmarks with filtering
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');
  const collectionId = searchParams.get('collectionId');
  const limit = parseInt(searchParams.get('limit') || '50');
  const offset = parseInt(searchParams.get('offset') || '0');

  // In production: query PostgreSQL with RLS
  // For now, the mock data is loaded client-side

  return NextResponse.json({
    bookmarks: [],
    total: 0,
    limit,
    offset,
  });
}

function detectMediaType(url: string): string {
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'video';
  if (url.includes('twitter.com') || url.includes('x.com')) return 'tweet';
  if (url.endsWith('.pdf')) return 'pdf';
  if (url.includes('github.com') || url.includes('gitlab.com')) return 'source_code';
  return 'article';
}
