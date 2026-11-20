import React from 'react';
import { requireRole } from '@/lib/auth';
import { getDatabase } from '@/lib/data-store';
import { PortalLayout } from '@/components/layout/PortalLayout';
import AttendanceClient from './AttendanceClient';

export default async function TeacherAttendancePage() {
  const session = await requireRole(['TEACHER']);
  const db = getDatabase();

  const teacher = db.teachers.find((t) => t.userId === session.userId) || db.teachers[0];
  const assignedClasses = db.classes.filter((c) => teacher.assignedClassIds.includes(c.id));

  return (
    <PortalLayout session={session}>
      <AttendanceClient
        classes={assignedClasses}
        students={db.students}
        attendances={db.attendances}
      />
    </PortalLayout>
  );
}
