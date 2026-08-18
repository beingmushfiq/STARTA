'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Bookmark, Collection, Tag } from '@/lib/types';

export type AppTheme = 'dark' | 'sepia' | 'light';
export type FontSize = 'small' | 'medium' | 'large';
export type Density = 'compact' | 'comfortable' | 'spacious';

interface AppState {
  // Navigation
  activeView: 'inbox' | 'pinned' | 'reader' | 'archive' | 'trash' | 'collection' | 'search';
  activeCollectionId: string | null;
  sidebarOpen: boolean;

  // Auth
  isAuthenticated: boolean;
  user: {
    name: string;
    email: string;
    avatarUrl: string | null;
    planTier: 'free' | 'pro';
  } | null;

  // View
  viewMode: 'grid' | 'list';

  // Customization
  appTheme: AppTheme;
  fontSize: FontSize;
  density: Density;

  // Data
  bookmarks: Bookmark[];
  collections: Collection[];
  tags: Tag[];

  // Selection
  selectedBookmarkId: string | null;
  focusedIndex: number;

  // Triage
  triageMode: boolean;

  // Command palette
  commandPaletteOpen: boolean;

  // Search
  searchQuery: string;
  searchMode: 'fulltext' | 'semantic';

  // Reader
  readerColumnWidth: number;
  readerDarkMode: boolean;
}

interface AppContextType extends AppState {
  setActiveView: (view: AppState['activeView']) => void;
  setActiveCollectionId: (id: string | null) => void;
  toggleSidebar: () => void;

  // Auth
  login: (user: NonNullable<AppState['user']>) => void;
  logout: () => void;

  // View
  setViewMode: (mode: 'grid' | 'list') => void;

  // Customization
  setAppTheme: (theme: AppTheme) => void;
  setFontSize: (size: FontSize) => void;
  setDensity: (d: Density) => void;

  // Data
  setBookmarks: (bookmarks: Bookmark[]) => void;
  addBookmark: (bookmark: Bookmark) => void;
  updateBookmark: (id: string, updates: Partial<Bookmark>) => void;
  removeBookmark: (id: string) => void;
  setCollections: (collections: Collection[]) => void;
  addCollection: (collection: Collection) => void;
  setTags: (tags: Tag[]) => void;

  // Selection
  selectBookmark: (id: string | null) => void;
  setFocusedIndex: (index: number) => void;
  setTriageMode: (v: boolean) => void;
  toggleCommandPalette: () => void;

  // Search
  setSearchQuery: (q: string) => void;
  setSearchMode: (m: AppState['searchMode']) => void;

  // Reader
  setReaderColumnWidth: (w: number) => void;
  toggleReaderDarkMode: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>({
    activeView: 'inbox',
    activeCollectionId: null,
    sidebarOpen: true,

    // Default: logged in as demo user
    isAuthenticated: true,
    user: {
      name: 'Aayan',
      email: 'aayan@example.com',
      avatarUrl: null,
      planTier: 'pro',
    },

    viewMode: 'grid',
    appTheme: 'dark',
    fontSize: 'medium',
    density: 'comfortable',

    bookmarks: [],
    collections: [],
    tags: [],
    selectedBookmarkId: null,
    focusedIndex: 0,
    triageMode: false,
    commandPaletteOpen: false,
    searchQuery: '',
    searchMode: 'fulltext',
    readerColumnWidth: 65,
    readerDarkMode: true,
  });

  const setActiveView = useCallback((view: AppState['activeView']) => {
    setState(s => ({ ...s, activeView: view }));
  }, []);

  const setActiveCollectionId = useCallback((id: string | null) => {
    setState(s => ({ ...s, activeCollectionId: id, activeView: id ? 'collection' : 'inbox' }));
  }, []);

  const toggleSidebar = useCallback(() => {
    setState(s => ({ ...s, sidebarOpen: !s.sidebarOpen }));
  }, []);

  const login = useCallback((user: NonNullable<AppState['user']>) => {
    setState(s => ({ ...s, isAuthenticated: true, user }));
  }, []);

  const logout = useCallback(() => {
    setState(s => ({
      ...s,
      isAuthenticated: false,
      user: null,
      activeView: 'inbox',
      activeCollectionId: null,
      bookmarks: [],
      collections: [],
      tags: [],
    }));
  }, []);

  const setViewMode = useCallback((viewMode: 'grid' | 'list') => {
    setState(s => ({ ...s, viewMode }));
  }, []);

  const setAppTheme = useCallback((appTheme: AppTheme) => {
    setState(s => ({ ...s, appTheme }));
  }, []);

  const setFontSize = useCallback((fontSize: FontSize) => {
    setState(s => ({ ...s, fontSize }));
  }, []);

  const setDensity = useCallback((density: Density) => {
    setState(s => ({ ...s, density }));
  }, []);

  const setBookmarks = useCallback((bookmarks: Bookmark[]) => {
    setState(s => ({ ...s, bookmarks }));
  }, []);

  const addBookmark = useCallback((bookmark: Bookmark) => {
    setState(s => ({ ...s, bookmarks: [bookmark, ...s.bookmarks] }));
  }, []);

  const updateBookmark = useCallback((id: string, updates: Partial<Bookmark>) => {
    setState(s => ({
      ...s,
      bookmarks: s.bookmarks.map(b => (b.id === id ? { ...b, ...updates } : b)),
    }));
  }, []);

  const removeBookmark = useCallback((id: string) => {
    setState(s => ({
      ...s,
      bookmarks: s.bookmarks.filter(b => b.id !== id),
      selectedBookmarkId: s.selectedBookmarkId === id ? null : s.selectedBookmarkId,
    }));
  }, []);

  const setCollections = useCallback((collections: Collection[]) => {
    setState(s => ({ ...s, collections }));
  }, []);

  const addCollection = useCallback((collection: Collection) => {
    setState(s => ({ ...s, collections: [...s.collections, collection] }));
  }, []);

  const setTags = useCallback((tags: Tag[]) => {
    setState(s => ({ ...s, tags }));
  }, []);

  const selectBookmark = useCallback((id: string | null) => {
    setState(s => ({ ...s, selectedBookmarkId: id }));
  }, []);

  const setFocusedIndex = useCallback((index: number) => {
    setState(s => ({ ...s, focusedIndex: index }));
  }, []);

  const setTriageMode = useCallback((triageMode: boolean) => {
    setState(s => ({ ...s, triageMode }));
  }, []);

  const toggleCommandPalette = useCallback(() => {
    setState(s => ({ ...s, commandPaletteOpen: !s.commandPaletteOpen }));
  }, []);

  const setSearchQuery = useCallback((q: string) => {
    setState(s => ({ ...s, searchQuery: q }));
  }, []);

  const setSearchMode = useCallback((m: AppState['searchMode']) => {
    setState(s => ({ ...s, searchMode: m }));
  }, []);

  const setReaderColumnWidth = useCallback((w: number) => {
    setState(s => ({ ...s, readerColumnWidth: w }));
  }, []);

  const toggleReaderDarkMode = useCallback(() => {
    setState(s => ({ ...s, readerDarkMode: !s.readerDarkMode }));
  }, []);

  return (
    <AppContext.Provider
      value={{
        ...state,
        setActiveView,
        setActiveCollectionId,
        toggleSidebar,
        login,
        logout,
        setViewMode,
        setAppTheme,
        setFontSize,
        setDensity,
        setBookmarks,
        addBookmark,
        updateBookmark,
        removeBookmark,
        setCollections,
        addCollection,
        setTags,
        selectBookmark,
        setFocusedIndex,
        setTriageMode,
        toggleCommandPalette,
        setSearchQuery,
        setSearchMode,
        setReaderColumnWidth,
        toggleReaderDarkMode,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
