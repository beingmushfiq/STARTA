'use client';

// Mobile bottom navigation for STRATA
import { useApp } from '@/lib/store';
import { palette, typography } from '@/lib/tokens';
import { cn } from '@/lib/cn';
import { Inbox, Pin, BookOpen, Archive, Plus } from 'lucide-react';

interface MobileNavProps {
  onAdd: () => void;
}

const navItems = [
  { id: 'inbox' as const, label: 'Inbox', icon: Inbox },
  { id: 'pinned' as const, label: 'Pinned', icon: Pin },
  { id: 'add' as const, label: 'Add', icon: Plus },
  { id: 'reader' as const, label: 'Reader', icon: BookOpen },
  { id: 'archive' as const, label: 'Archive', icon: Archive },
];

export function MobileNav({ onAdd }: MobileNavProps) {
  const { activeView, setActiveView } = useApp();

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 h-16 flex items-center justify-around z-40"
      style={{
        backgroundColor: `${palette.surfaceBase}F0`,
        borderTop: `1px solid ${palette.borderSubtle}`,
        backdropFilter: 'blur(16px) saturate(180%)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeView === item.id;
        const isAdd = item.id === 'add';

        return (
          <button
            key={item.id}
            onClick={() => (isAdd ? onAdd() : setActiveView(item.id))}
            className={cn(
              'flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200',
              isAdd && 'relative -mt-4',
              !isAdd && !isActive && 'active:scale-90',
            )}
          >
            {isAdd ? (
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:brightness-110 active:scale-95"
                style={{ backgroundColor: '#FF5500' }}
              >
                <Plus size={22} color="#fff" />
              </div>
            ) : (
              <>
                <Icon
                  size={20}
                  style={{
                    color: isActive ? '#FF5500' : palette.textMuted,
                    transition: 'color 0.2s',
                  }}
                />
                <span
                  className="text-[10px]"
                  style={{
                    fontFamily: typography.mono,
                    color: isActive ? '#FF5500' : palette.textMuted,
                    transition: 'color 0.2s',
                  }}
                >
                  {item.label}
                </span>
              </>
            )}
          </button>
        );
      })}
    </nav>
  );
}
