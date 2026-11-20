import React from 'react';
import { getCurrentSession } from '@/lib/auth';
import { PortalLayout } from '@/components/layout/PortalLayout';
import ManualClient from './ManualClient';
import Link from 'next/link';
import Image from 'next/image';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { Shield, LogIn } from 'lucide-react';

export const metadata = {
  title: 'Roles & Operations Manual | Valencia Schools',
  description:
    'Comprehensive user manual, workflow specifications, and role-based permissions guide for Admin, Teacher, Parent, and Student portals at Valencia Schools Lagos.',
};

export default async function ManualPage() {
  const session = await getCurrentSession();

  if (session) {
    return (
      <PortalLayout session={session}>
        <ManualClient currentSession={session} />
      </PortalLayout>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* Top Public Header */}
      <header className="bg-white/95 dark:bg-slate-900/95 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 sticky top-0 z-50 shadow-xs backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <Link href="/login" className="flex items-center gap-2 sm:gap-3 group min-w-0">
            <Image
              src="/logo-transparent.png"
              alt="Valencia Schools"
              width={40}
              height={36}
              className="h-8 sm:h-9 w-auto object-contain transition-transform group-hover:scale-105 shrink-0"
            />
            <div className="min-w-0">
              <span className="font-serif font-bold text-base sm:text-lg text-slate-900 dark:text-white group-hover:text-[#FF1313] transition-colors truncate block">
                Valencia Schools
              </span>
              <p className="hidden sm:block text-[10px] text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider truncate">
                Official SMS Roles Manual
              </p>
            </div>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Link
              href="/verify"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 hover:bg-emerald-100 transition-colors"
            >
              <Shield className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Public QR Registry</span>
            </Link>
            <ThemeToggle size="sm" />
            <Link
              href="/login"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#FF1313] hover:bg-[#D60A0A] text-white shadow-xs transition-colors"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In / Demo</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <ManualClient currentSession={null} />
      </main>
    </div>
  );
}

