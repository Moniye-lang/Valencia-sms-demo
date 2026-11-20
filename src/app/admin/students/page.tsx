import React from 'react';
import { requireRole } from '@/lib/auth';
import { getDatabase } from '@/lib/data-store';
import { PortalLayout } from '@/components/layout/PortalLayout';
import StudentsClient from './StudentsClient';

export default async function AdminStudentsPage() {
  const session = await requireRole(['ADMIN']);
  const db = getDatabase();

  return (
    <PortalLayout session={session}>
      <StudentsClient
        students={db.students}
        classes={db.classes}
        parents={db.parents}
      />
    </PortalLayout>
  );
}
