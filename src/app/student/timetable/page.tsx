import React from 'react';
import { requireRole } from '@/lib/auth';
import { getDatabase } from '@/lib/data-store';
import { PortalLayout } from '@/components/layout/PortalLayout';
import TimetableTableClient from './TimetableTableClient';

export default async function StudentTimetablePage() {
  const session = await requireRole(['STUDENT']);
  const db = getDatabase();

  const student = db.students.find((s) => s.userId === session.userId) || db.students[0];
  const studentClass = db.classes.find((c) => c.id === student.classId);
  const timetableSlots = db.timetables.filter((t) => t.classId === student.classId);

  return (
    <PortalLayout session={session}>
      <TimetableTableClient
        slots={timetableSlots}
        studentClass={studentClass}
        studentName={student.fullName}
        admissionNo={student.admissionNo}
      />
    </PortalLayout>
  );
}

