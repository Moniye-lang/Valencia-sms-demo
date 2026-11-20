import React from 'react';
import { requireRole, assertStudentAccess } from '@/lib/auth';
import { getDatabase } from '@/lib/data-store';
import { PortalLayout } from '@/components/layout/PortalLayout';
import ParentAttendanceClient from './ParentAttendanceClient';

interface PageProps {
  searchParams: Promise<{ studentId?: string }>;
}

export default async function ParentAttendancePage({ searchParams }: PageProps) {
  const session = await requireRole(['PARENT']);
  const db = getDatabase();
  const params = await searchParams;

  const parent = db.parents.find((p) => p.userId === session.userId) || db.parents[0];
  const children = db.students.filter((s) => parent.childrenStudentIds.includes(s.id));

  let activeStudentId = params.studentId || children[0]?.id;
  const hasAccess = await assertStudentAccess(session, activeStudentId);
  if (!hasAccess) activeStudentId = children[0]?.id;

  const activeStudent = db.students.find((s) => s.id === activeStudentId) || children[0];
  const studentAttendances = db.attendances.filter((a) => a.studentId === activeStudent?.id);

  return (
    <PortalLayout session={session}>
      <ParentAttendanceClient
        childrenList={children}
        activeStudent={activeStudent}
        attendances={studentAttendances}
      />
    </PortalLayout>
  );
}
