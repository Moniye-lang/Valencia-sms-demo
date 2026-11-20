import React from 'react';
import { requireRole } from '@/lib/auth';
import { getDatabase } from '@/lib/data-store';
import { PortalLayout } from '@/components/layout/PortalLayout';
import ScoreEntryClient from './ScoreEntryClient';

export default async function TeacherScoresPage() {
  const session = await requireRole(['TEACHER']);
  const db = getDatabase();

  const teacher = db.teachers.find((t) => t.userId === session.userId) || db.teachers[0];
  const assignedClasses = db.classes.filter((c) => teacher.assignedClassIds.includes(c.id));
  const assignedSubjects = db.subjects.filter((s) => teacher.assignedSubjectIds.includes(s.id));

  return (
    <PortalLayout session={session}>
      <ScoreEntryClient
        teacher={teacher}
        classes={assignedClasses}
        subjects={assignedSubjects}
        students={db.students}
        results={db.results}
      />
    </PortalLayout>
  );
}
