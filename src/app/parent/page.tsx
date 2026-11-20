import React from 'react';
import Link from 'next/link';
import { requireRole } from '@/lib/auth';
import { getDatabase } from '@/lib/data-store';
import { PortalLayout } from '@/components/layout/PortalLayout';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/Badge';
import { Award, Receipt, ArrowRight } from 'lucide-react';

export default async function ParentDashboardPage() {
  const session = await requireRole(['PARENT']);
  const db = getDatabase();

  const parent = db.parents.find((p) => p.userId === session.userId) || db.parents[0];
  const children = db.students.filter((s) => parent.childrenStudentIds.includes(s.id));

  return (
    <PortalLayout session={session}>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200 dark:border-slate-800">
          <div>
            <h1 className="text-2xl font-serif font-bold text-stone-900 dark:text-white">
              Welcome, {parent.fullName}
            </h1>
            <p className="text-xs text-stone-500 dark:text-slate-400 mt-1">
              Parent & Guardian Portal &bull; {children.length} Enrolled Wards at Valencia Schools
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/parent/results">
              <Button size="sm">
                <Award className="w-4 h-4 mr-1.5" />
                View Report Cards
              </Button>
            </Link>
            <Link href="/parent/fees">
              <Button size="sm" variant="outline">
                <Receipt className="w-4 h-4 mr-1.5" />
                Fee Statements
              </Button>
            </Link>
          </div>
        </div>

        {/* Wards Overview Cards */}
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-stone-500 dark:text-slate-400 mb-3">
            Enrolled Wards & Academic Progress
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {children.map((child) => {
              const studentClass = db.classes.find((c) => c.id === child.classId);
              const publishedResults = db.results.filter(
                (r) => r.studentId === child.id && r.status === 'PUBLISHED'
              );
              const fee = db.fees.find((f) => f.studentId === child.id);
              const attendances = db.attendances.filter((a) => a.studentId === child.id);
              const presentCount = attendances.filter((a) => a.status === 'PRESENT').length;
              const attendanceRate = attendances.length > 0 ? Math.round((presentCount / attendances.length) * 100) : 100;

              return (
                <Card key={child.id} className="border-[#FF1313]/20 hover:border-[#FF1313] transition-all">
                  <CardHeader
                    title={
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#FF1313] text-white flex items-center justify-center font-bold text-sm">
                          {child.firstName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-stone-900 dark:text-white">{child.fullName}</div>
                          <div className="text-[11px] font-mono text-stone-400 dark:text-slate-500">{child.admissionNo}</div>
                        </div>
                      </div>
                    }
                    action={
                      <span className="text-xs font-bold bg-stone-100 dark:bg-slate-800 text-stone-700 dark:text-slate-300 px-2.5 py-1 rounded-full border border-stone-200 dark:border-slate-700">
                        {studentClass?.name}
                      </span>
                    }
                  />
                  <CardBody className="space-y-4">
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-2.5 rounded-lg bg-stone-50 dark:bg-slate-800/60 border border-stone-100 dark:border-slate-700/80">
                        <p className="text-[10px] text-stone-500 dark:text-slate-400 uppercase font-bold">Published Grades</p>
                        <p className="text-lg font-bold text-[#FF1313] mt-0.5">{publishedResults.length} Subjects</p>
                      </div>
                      <div className="p-2.5 rounded-lg bg-stone-50 dark:bg-slate-800/60 border border-stone-100 dark:border-slate-700/80">
                        <p className="text-[10px] text-stone-500 dark:text-slate-400 uppercase font-bold">Attendance</p>
                        <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{attendanceRate}%</p>
                      </div>
                      <div className="p-2.5 rounded-lg bg-stone-50 dark:bg-slate-800/60 border border-stone-100 dark:border-slate-700/80">
                        <p className="text-[10px] text-stone-500 dark:text-slate-400 uppercase font-bold">Fee Status</p>
                        <div className="mt-1">
                          <StatusBadge status={fee?.status || 'PAID'} />
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-stone-100 dark:border-slate-800 flex items-center justify-between text-xs">
                      <Link
                        href={`/parent/results?studentId=${child.id}`}
                        className="font-bold text-[#FF1313] hover:underline flex items-center gap-1"
                      >
                        Inspect Report Card <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                      <Link
                        href={`/parent/fees?studentId=${child.id}`}
                        className="text-stone-500 dark:text-slate-400 hover:text-stone-900 dark:hover:text-white font-semibold"
                      >
                        Fee Invoice &rarr;
                      </Link>
                    </div>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        </div>

        {/* School Notices for Parents */}
        <Card>
          <CardHeader
            title="School Circulars & PTA Notices"
            subtitle="Broadcasts for Valencia parents and guardians"
          />
          <div className="divide-y divide-stone-100 dark:divide-slate-800">
            {db.announcements
              .filter((a) => a.targetAudience === 'ALL' || a.targetAudience === 'PARENTS')
              .map((anc) => (
                <div key={anc.id} className="p-4 hover:bg-stone-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-900 dark:text-white">{anc.title}</span>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-stone-100 dark:bg-slate-800 text-stone-600 dark:text-slate-300">
                      {anc.priority}
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 dark:text-slate-400 mt-1">{anc.content}</p>
                </div>
              ))}
          </div>
        </Card>
      </div>
    </PortalLayout>
  );
}
