import React from 'react';
import { requireRole } from '@/lib/auth';
import { getDatabase } from '@/lib/data-store';
import { PortalLayout } from '@/components/layout/PortalLayout';
import ResultApprovalClient from './ResultApprovalClient';

export default async function AdminResultsPage() {
  const session = await requireRole(['ADMIN']);
  const db = getDatabase();

  return (
    <PortalLayout session={session}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-serif font-bold text-stone-900">
            Result Verification & Publishing Queue
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Review teacher submissions, approve academic scores, and publish final report cards for parents and students.
          </p>
        </div>

        <ResultApprovalClient
          classes={db.classes}
          subjects={db.subjects}
          teachers={db.teachers}
          students={db.students}
          results={db.results}
        />
      </div>
    </PortalLayout>
  );
}
