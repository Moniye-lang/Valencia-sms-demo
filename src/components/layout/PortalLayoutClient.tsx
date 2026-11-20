'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { UserSession } from '@/lib/types';
import { DemoSwitcher } from './DemoSwitcher';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

interface PortalLayoutClientProps {
  session: UserSession;
  pendingApprovalsCount: number;
  children: React.ReactNode;
}

export function PortalLayoutClient({
  session,
  pendingApprovalsCount,
  children,
}: PortalLayoutClientProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Adjust state during render when pathname changes (React recommended pattern)
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setIsMobileMenuOpen(false);
  }

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      <DemoSwitcher currentSession={session} />
      <Navbar session={session} onToggleMobileMenu={() => setIsMobileMenuOpen((prev) => !prev)} />
      <div className="flex-1 flex w-full relative">
        <Sidebar
          session={session}
          pendingApprovalsCount={pendingApprovalsCount}
          isMobileOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 xl:p-10 overflow-x-hidden w-full min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
