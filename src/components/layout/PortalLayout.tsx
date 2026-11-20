import React from 'react';
import { UserSession } from '@/lib/types';
import { DemoSwitcher } from './DemoSwitcher';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { getDatabase } from '@/lib/data-store';

interface PortalLayoutProps {
  session: UserSession;
  children: React.ReactNode;
}

export function PortalLayout({ session, children }: PortalLayoutProps) {
  const db = getDatabase();
  const pendingApprovalsCount = db.results.filter((r) => r.status === 'PENDING_APPROVAL').length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      <DemoSwitcher currentSession={session} />
      <Navbar session={session} />
      <div className="flex-1 flex w-full">
        <Sidebar session={session} pendingApprovalsCount={pendingApprovalsCount} />
        <main className="flex-1 p-6 lg:p-8 xl:p-10 overflow-x-hidden w-full">{children}</main>
      </div>
    </div>
  );
}
