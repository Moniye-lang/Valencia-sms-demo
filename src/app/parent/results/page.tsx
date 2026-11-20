import React from 'react';
import { requireRole, assertStudentAccess } from '@/lib/auth';
import { getDatabase } from '@/lib/data-store';
import { PortalLayout } from '@/components/layout/PortalLayout';
import ParentResultsClient from './ParentResultsClient';

interface PageProps {
  searchParams: Promise<{ studentId?: string }>;
}

export default async function ParentResultsPage({ searchParams }: PageProps) {
  const session = await requireRole(['PARENT']);
  const db = getDatabase();
  const params = await searchParams;

  const parent = db.parents.find((p) => p.userId === session.userId) || db.parents[0];
  const children = db.students.filter((s) => parent.childrenStudentIds.includes(s.id));

  // Determine active student
  let activeStudentId = params.studentId || children[0]?.id;

  // Enforce server-side security rule: Parent can ONLY access their own linked wards
  const hasAccess = await assertStudentAccess(session, activeStudentId);
  const isUnauthorized = !hasAccess;

  if (isUnauthorized) {
    activeStudentId = children[0]?.id;
  }

  const activeStudent = db.students.find((s) => s.id === activeStudentId) || children[0];
  const studentClass = db.classes.find((c) => c.id === activeStudent?.classId);
  const classTeacher = db.teachers.find((t) => t.id === studentClass?.classTeacherId);

  // Get subjects and results for this student
  const classSubjects = db.subjects.filter((s) => s.classId === activeStudent?.classId);
  const studentResults = db.results.filter((r) => r.studentId === activeStudent?.id);

  return (
    <PortalLayout session={session}>
      <ParentResultsClient
        childrenList={children}
        activeStudent={activeStudent}
        studentClass={studentClass}
        classTeacher={classTeacher}
        classSubjects={classSubjects}
        studentResults={studentResults}
        wasSecurityDenied={isUnauthorized}
      />
    </PortalLayout>
  );
}
