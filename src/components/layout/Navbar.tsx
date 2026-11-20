'use client';

import React, { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { UserSession } from '@/lib/types';
import { logoutAction } from '@/lib/actions';
import { StatusBadge } from '../ui/Badge';
import { ThemeToggle } from '../theme/ThemeToggle';
import { LogOut, ShieldAlert, Menu } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

function AccessDeniedBanner() {
  const searchParams = useSearchParams();
  const hasAccessDenied = searchParams?.get('access_denied') === '1';

  if (!hasAccessDenied) return null;

  return (
    <div className="bg-rose-50 dark:bg-rose-950/40 border-b border-rose-200 dark:border-rose-800/60 px-4 sm:px-6 py-2.5 text-rose-800 dark:text-rose-300 text-xs font-medium flex items-center justify-between">
      <div className="flex items-center gap-2">
        <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
        <span>
          <strong>Access Denied:</strong> You attempted to access a record outside your authorized role.
          Server permissions redirected you safely to your authorized portal.
        </span>
      </div>
      <Link href="?" className="text-rose-700 dark:text-rose-400 underline font-semibold hover:text-rose-900 dark:hover:text-rose-200 shrink-0 ml-2">
        Dismiss
      </Link>
    </div>
  );
}

interface NavbarProps {
  session: UserSession;
  onToggleMobileMenu?: () => void;
}

export function Navbar({ session, onToggleMobileMenu }: NavbarProps) {
  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-[41px] z-40 shadow-xs transition-colors">
      <Suspense fallback={null}>
        <AccessDeniedBanner />
      </Suspense>

      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {/* Mobile Hamburger Menu Toggle */}
            <button
              type="button"
              onClick={onToggleMobileMenu}
              className="md:hidden p-2 -ml-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <Link href={`/${session.role.toLowerCase()}`} className="flex items-center gap-2 sm:gap-3 group min-w-0">
              <div className="relative h-9 w-9 sm:h-11 sm:w-11 flex items-center justify-center shrink-0">
                <Image
                  src="/logo-transparent.png"
                  alt="Valencia Schools Official Logo"
                  width={48}
                  height={44}
                  priority
                  className="h-8 sm:h-11 w-auto object-contain transition-transform group-hover:scale-105"
                />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="font-serif font-bold text-base sm:text-lg text-slate-900 dark:text-white tracking-tight group-hover:text-[#FF1313] transition-colors truncate">
                    Valencia Schools
                  </span>
                  <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-widest bg-amber-50 dark:bg-amber-950/50 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 px-1.5 sm:px-2 py-0.5 rounded shrink-0">
                    Lagos
                  </span>
                </div>
                <p className="hidden sm:block text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate">
                  Excellence &bull; Integrity &bull; Leadership
                </p>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <div className="hidden sm:flex items-center gap-2 pr-3 sm:pr-4 border-r border-slate-200 dark:border-slate-800">
              <StatusBadge status={session.role} />
            </div>

            <ThemeToggle size="sm" />

            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#FF1313]/10 dark:bg-[#FF1313]/20 text-[#FF1313] font-bold text-xs sm:text-sm flex items-center justify-center border border-[#FF1313]/20 dark:border-[#FF1313]/40 shadow-xs shrink-0">
                {session.name.charAt(0)}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-semibold text-slate-900 dark:text-white leading-tight">{session.name}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">{session.email}</p>
              </div>

              <form action={logoutAction}>
                <button
                  type="submit"
                  title="Sign out of Valencia SMS"
                  className="p-1.5 sm:p-2 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
