import React from 'react';
import { requireRole } from '@/lib/auth';
import { getDatabase } from '@/lib/data-store';
import { PortalLayout } from '@/components/layout/PortalLayout';
import { Card, CardBody } from '@/components/ui/Card';
import { Megaphone, Calendar } from 'lucide-react';

export default async function StudentAnnouncementsPage() {
  const session = await requireRole(['STUDENT']);
  const db = getDatabase();

  const notices = db.announcements.filter(
    (a) => a.targetAudience === 'ALL' || a.targetAudience === 'STUDENTS'
  );

  return (
    <PortalLayout session={session}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-serif font-bold text-stone-900 dark:text-white">Student Notice Board</h1>
          <p className="text-xs text-stone-500 dark:text-slate-400 mt-1">
            School circulars, examination timetables, and extracurricular events
          </p>
        </div>

        <div className="space-y-4">
          {notices.map((anc) => (
            <Card key={anc.id}>
              <CardBody className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <Megaphone className="w-4 h-4 text-[#FF1313] shrink-0" />
                    <h3 className="text-base font-bold text-stone-900 dark:text-white">{anc.title}</h3>
                  </div>
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${anc.priority === 'URGENT'
                        ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300'
                        : anc.priority === 'HIGH'
                          ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                          : 'bg-stone-100 dark:bg-slate-800 text-stone-700 dark:text-slate-300'
                      }`}
                  >
                    {anc.priority}
                  </span>
                </div>
                <p className="text-xs text-stone-700 dark:text-slate-300 mt-3 leading-relaxed">{anc.content}</p>
                <div className="mt-4 pt-2 border-t border-stone-100 dark:border-slate-800 text-[11px] text-stone-400 dark:text-slate-500 flex items-center justify-between">
                  <span>Author: {anc.authorName}</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(anc.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </PortalLayout>
  );
}
