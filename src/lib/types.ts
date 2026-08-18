// Core domain types for STRATA

export interface Tenant {
  id: string;
  name: string;
  planTier: 'free' | 'pro' | 'enterprise';
  maxStorageBytes: number;
  createdAt: Date;
}

export interface User {
  id: string;
  tenantId: string;
  googleSub: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
  createdAt: Date;
  lastLoginAt: Date;
}

export type MediaType = 'article' | 'video' | 'image' | 'pdf' | 'audio' | 'tweet' | 'source_code';
export type BookmarkStatus = 'inbox' | 'active' | 'archived' | 'trash';

export interface Bookmark {
  id: string;
  tenantId: string;
  userId: string;
  collectionId: string | null;
  url: string;
  canonicalUrl: string | null;
  domain: string;
  title: string;
  description: string | null;
  author: string | null;
  readingTimeMinutes: number;
  mediaType: MediaType;
  contentRawHtml: string | null;
  contentCleanMarkdown: string | null;
  coverImageUrl: string | null;
  faviconUrl: string | null;
  assetStorageKey: string | null;
  status: BookmarkStatus;
  isPinned: boolean;
  decayScore: number;
  tags: Tag[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Collection {
  id: string;
  tenantId: string;
  name: string;
  slug: string;
  colorHex: string;
  iconIdentifier: string;
  isSmartCollection: boolean;
  filterRules: Record<string, unknown>;
  createdAt: Date;
}

export interface Tag {
  id: string;
  tenantId: string;
  name: string;
}

export interface Annotation {
  id: string;
  tenantId: string;
  bookmarkId: string;
  highlightText: string;
  note: string | null;
  anchorPath: unknown;
  colorHex: string;
  createdAt: Date;
}
