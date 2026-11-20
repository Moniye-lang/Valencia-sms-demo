import React from 'react';
import { UserSession } from '@/lib/types';
import { getDatabase } from '@/lib/data-store';
import { PortalLayoutClient } from './PortalLayoutClient';

interface PortalLayoutProps {
  session: UserSession;
  children: React.ReactNode;
}

export function PortalLayout({ session, children }: PortalLayoutProps) {
  const db = getDatabase();
  const pendingApprovalsCount = db.results.filter((r) => r.status === 'PENDING_APPROVAL').length;

  return (
    <PortalLayoutClient session={session} pendingApprovalsCount={pendingApprovalsCount}>
      {children}
    </PortalLayoutClient>
  );
}
