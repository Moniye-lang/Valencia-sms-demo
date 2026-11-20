import React from 'react';
import { requireRole } from '@/lib/auth';
import { getDatabase } from '@/lib/data-store';
import { PortalLayout } from '@/components/layout/PortalLayout';
import AnnouncementsClient from './AnnouncementsClient';

export default async function AdminAnnouncementsPage() {
  const session = await requireRole(['ADMIN']);
  const db = getDatabase();

  return (
    <PortalLayout session={session}>
      <AnnouncementsClient announcements={db.announcements} />
    </PortalLayout>
  );
}
