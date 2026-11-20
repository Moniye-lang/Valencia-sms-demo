import React from 'react';
import Link from 'next/link';
import { requireRole } from '@/lib/auth';
import { getDatabase } from '@/lib/data-store';
import { PortalLayout } from '@/components/layout/PortalLayout';
import { StatCard } from '@/components/ui/StatCard';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { GraduationCap, FileCheck2, ArrowRight, ShieldCheck, AlertCircle, School } from 'lucide-react';

export default async function AdminDashboardPage() {
  const session = await requireRole(['ADMIN']);
  const db = getDatabase();

  const totalStudents = db.students.length;
  const totalClasses = db.classes.length;
  const pendingResults = db.results.filter((r) => r.status === 'PENDING_APPROVAL');
  const publishedResults = db.results.filter((r) => r.status === 'PUBLISHED');

  const totalFeesBilled = db.fees.reduce((acc, f) => acc + f.totalAmount, 0);
  const totalFeesPaid = db.fees.reduce((acc, f) => acc + f.amountPaid, 0);

  return (
    <PortalLayout session={session}>
      <div className="space-y-6 w-full">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-serif font-bold text-slate-900 dark:text-white">
                Executive Administration
              </h1>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40">
                Full Academy: Daycare to SS 3
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Valencia Schools Academic Oversight &bull; Term 1, 2024/2025 &bull; {totalStudents} Enrolled Students
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/admin/results">
              <Button size="sm" variant={pendingResults.length > 0 ? 'primary' : 'outline'}>
                <FileCheck2 className="w-4 h-4 mr-1.5" />
                Approval Queue ({pendingResults.length})
              </Button>
            </Link>
            <Link href="/admin/students">
              <Button size="sm" variant="secondary">
                <GraduationCap className="w-4 h-4 mr-1.5" />
                Student Directory ({totalStudents})
              </Button>
            </Link>
          </div>
        </div>

        {/* Workflow Action Banner if pending results exist */}
        {pendingResults.length > 0 ? (
          <div className="bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-300 dark:border-amber-800/80 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs animate-pulse">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-amber-200/80 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-amber-900 dark:text-amber-200">
                  Action Required: {pendingResults.length} Result Submissions Awaiting Approval
                </h4>
                <p className="text-xs text-amber-800 dark:text-amber-300 mt-0.5">
                  Teachers have finalized continuous assessment & exam scores for JSS 2A Mathematics. Review and publish to make them live on Parent & Student portals.
                </p>
              </div>
            </div>
            <Link href="/admin/results">
              <Button size="sm" className="bg-amber-700 hover:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-700 text-white font-bold whitespace-nowrap">
                Review Queue Now <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        ) : (
          <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-xl p-3.5 flex items-center gap-3 text-xs text-emerald-800 dark:text-emerald-300 shadow-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>
              All submitted scores have been reviewed. {publishedResults.length} published records are live across family portals.
            </span>
          </div>
        )}

        {/* Top KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Students"
            value={totalStudents}
            subtitle={`${totalClasses} Classrooms (Daycare to SS 3)`}
            icon={<GraduationCap className="w-5 h-5" />}
          />
          <StatCard
            title="Academic Sections"
            value="16 Arms"
            subtitle="Early Years, Nursery, Primary, JSS, SSS"
            icon={<School className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />}
            highlightColor="#4F46E5"
          />
          <StatCard
            title="Pending Approvals"
            value={pendingResults.length}
            subtitle={pendingResults.length > 0 ? 'Requires administrative sign-off' : 'Queue is clear'}
            icon={<FileCheck2 className="w-5 h-5" />}
            highlightColor={pendingResults.length > 0 ? '#D97706' : '#10B981'}
          />
          <StatCard
            title="Term Fees Billed"
            value={`₦${(totalFeesPaid / 1000000).toFixed(1)}M`}
            subtitle={`of ₦${(totalFeesBilled / 1000000).toFixed(1)}M billed across 800 students`}
            highlightColor="#059669"
          />
        </div>

        {/* Section Quick Summary Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
            <span className="text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400">Early Years & Nursery</span>
            <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">4 Arms &bull; 200 Students</p>
            <span className="text-[10px] text-slate-400 dark:text-slate-500">Daycare, Playgroup, Nur 1 & 2</span>
          </div>
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
            <span className="text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400">Primary Section</span>
            <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">6 Arms &bull; 300 Students</p>
            <span className="text-[10px] text-slate-400 dark:text-slate-500">Primary 1 through Primary 6</span>
          </div>
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
            <span className="text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400">Junior Secondary</span>
            <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">3 Arms &bull; 150 Students</p>
            <span className="text-[10px] text-slate-400 dark:text-slate-500">JSS 1, JSS 2A, JSS 3</span>
          </div>
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
            <span className="text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400">Senior Secondary</span>
            <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">3 Arms &bull; 150 Students</p>
            <span className="text-[10px] text-slate-400 dark:text-slate-500">SS 1 Science, SS 2, SS 3</span>
          </div>
        </div>

        {/* 2-Column Split: Active Classes & Recent School Notices */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Registered Classes & Assigned Teachers */}
          <Card>
            <CardHeader
              title={`All 16 School Arms (${totalClasses} Classrooms &bull; 800 Students)`}
              subtitle="From Daycare to SS 3 &bull; 50 students enrolled per arm"
              action={
                <Link href="/admin/students" className="text-xs text-[#FF1313] hover:underline font-bold">
                  Browse Students &rarr;
                </Link>
              }
            />
            <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-[460px] overflow-y-auto">
              {db.classes.map((cls) => {
                const classTeacher = db.teachers.find((t) => t.id === cls.classTeacherId);
                const studentsCount = db.students.filter((s) => s.classId === cls.id).length;
                return (
                  <div key={cls.id} className="p-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white text-sm">{cls.name}</span>
                        <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded font-bold uppercase">
                          {cls.level.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Educator: <strong className="text-slate-700 dark:text-slate-300">{classTeacher?.fullName || 'Assigned Lead'}</strong> &bull; {cls.roomNumber}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-[#FF1313] bg-[#FF1313]/10 dark:bg-[#FF1313]/20 px-2.5 py-1 rounded-full">
                        {studentsCount} Students
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Published Announcements */}
          <Card>
            <CardHeader
              title="Official Circulars & Broadcasts"
              subtitle="Notices sent to Daycare, Primary, JSS, and SSS parents"
              action={
                <Link href="/admin/announcements" className="text-xs text-[#FF1313] hover:underline font-bold">
                  Post Circular &rarr;
                </Link>
              }
            />
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {db.announcements.slice(0, 4).map((anc) => (
                <div key={anc.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{anc.title}</span>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {anc.targetAudience}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">{anc.content}</p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2">
                    By {anc.authorName} &bull; {new Date(anc.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </PortalLayout>
  );
}
