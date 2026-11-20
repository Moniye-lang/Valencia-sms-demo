import React from 'react';
import Link from 'next/link';
import { requireRole } from '@/lib/auth';
import { getDatabase } from '@/lib/data-store';
import { PortalLayout } from '@/components/layout/PortalLayout';
import { StatCard } from '@/components/ui/StatCard';
import { Card, CardHeader } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { BookOpen, ClipboardList, CalendarCheck2, ArrowRight, CheckCircle2, Clock } from 'lucide-react';

export default async function TeacherDashboardPage() {
  const session = await requireRole(['TEACHER']);
  const db = getDatabase();

  const teacher = db.teachers.find((t) => t.userId === session.userId) || db.teachers[0];
  const assignedClasses = db.classes.filter((c) => teacher.assignedClassIds.includes(c.id));
  const assignedSubjects = db.subjects.filter((s) => teacher.assignedSubjectIds.includes(s.id));

  // Teacher's scores
  const teacherResults = db.results.filter((r) => r.teacherId === teacher.id);
  const pendingCount = teacherResults.filter((r) => r.status === 'PENDING_APPROVAL').length;
  const publishedCount = teacherResults.filter((r) => r.status === 'PUBLISHED').length;

  return (
    <PortalLayout session={session}>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200 dark:border-slate-800">
          <div>
            <h1 className="text-2xl font-serif font-bold text-stone-900 dark:text-white">
              Welcome, {teacher.fullName}
            </h1>
            <p className="text-xs text-stone-500 dark:text-slate-400 mt-1">
              Staff ID: <span className="font-mono font-semibold text-stone-800 dark:text-slate-200">{teacher.staffId}</span> &bull; {teacher.qualification}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/teacher/scores">
              <Button size="sm">
                <ClipboardList className="w-4 h-4 mr-1.5" />
                Enter & Submit Scores
              </Button>
            </Link>
            <Link href="/teacher/attendance">
              <Button size="sm" variant="outline">
                <CalendarCheck2 className="w-4 h-4 mr-1.5" />
                Take Attendance
              </Button>
            </Link>
          </div>
        </div>

        {/* Story Workflow Notification Banner */}
        <div className="bg-gradient-to-r from-[#FF1313]/10 via-amber-50 to-stone-50 dark:from-[#FF1313]/15 dark:via-slate-900 dark:to-slate-900 rounded-xl p-5 border border-[#FF1313]/20 dark:border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF1313]">
                Demo Story: 1st Term Result Workflow
              </span>
              <StatusBadge status={pendingCount > 0 ? 'PENDING_APPROVAL' : publishedCount > 0 ? 'PUBLISHED' : 'DRAFT'} />
            </div>
            <p className="text-sm font-semibold text-stone-900 dark:text-white">
              {pendingCount > 0
                ? 'Your scores have been submitted and are currently in the Admin verification queue.'
                : publishedCount > 0
                  ? 'Congratulations! Your student scores have been approved and published to Parent & Student portals.'
                  : 'You have draft score sheets in JSS 2A Mathematics ready for submission to the School Principal.'}
            </p>
            <p className="text-xs text-stone-600 dark:text-slate-400">
              Step 1: Enter continuous assessment & exam scores &rarr; Step 2: Click Submit for Admin Approval.
            </p>
          </div>
          <Link href="/teacher/scores">
            <Button size="sm" className="whitespace-nowrap font-bold">
              Open Score Entry <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>

        {/* Teacher KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Assigned Classes"
            value={assignedClasses.length}
            subtitle={assignedClasses.map((c) => c.name).join(', ')}
            icon={<BookOpen className="w-5 h-5" />}
          />
          <StatCard
            title="Subjects Taught"
            value={assignedSubjects.length}
            subtitle={assignedSubjects.map((s) => s.name).join(', ')}
            icon={<ClipboardList className="w-5 h-5" />}
          />
          <StatCard
            title="Awaiting Approval"
            value={pendingCount}
            subtitle="Scores submitted to Admin"
            icon={<Clock className="w-5 h-5" />}
            highlightColor="#D97706"
          />
          <StatCard
            title="Published Scores"
            value={publishedCount}
            subtitle="Visible on parent report cards"
            icon={<CheckCircle2 className="w-5 h-5" />}
            highlightColor="#059669"
          />
        </div>

        {/* Assigned Classes Quick Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader
              title="My Assigned Classes & Rooms"
              subtitle="Only permitted to manage students and scores within these classes"
            />
            <div className="divide-y divide-stone-100 dark:divide-slate-800">
              {assignedClasses.map((cls) => {
                const students = db.students.filter((s) => s.classId === cls.id);
                return (
                  <div key={cls.id} className="p-4 flex items-center justify-between hover:bg-stone-50 dark:hover:bg-slate-800/50 transition-colors">
                    <div>
                      <span className="font-bold text-stone-900 dark:text-white text-sm">{cls.name}</span>
                      <p className="text-xs text-stone-500 dark:text-slate-400 mt-0.5">{cls.roomNumber}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-stone-100 dark:bg-slate-800 font-semibold px-2.5 py-1 rounded-full text-stone-700 dark:text-slate-300">
                        {students.length} Students
                      </span>
                      <Link href={`/teacher/scores?classId=${cls.id}`}>
                        <Button size="sm" variant="outline">
                          Grade &rarr;
                        </Button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Teacher Notices */}
          <Card>
            <CardHeader
              title="Staff Circulars & Notices"
              subtitle="Official announcements for teaching faculty"
            />
            <div className="divide-y divide-stone-100 dark:divide-slate-800">
              {db.announcements
                .filter((a) => a.targetAudience === 'ALL' || a.targetAudience === 'TEACHERS')
                .slice(0, 3)
                .map((anc) => (
                  <div key={anc.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-stone-900 dark:text-white">{anc.title}</span>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-stone-100 dark:bg-slate-800 text-stone-600 dark:text-slate-300">
                        {anc.priority}
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 dark:text-slate-400 mt-1 line-clamp-2">{anc.content}</p>
                  </div>
                ))}
            </div>
          </Card>
        </div>
      </div>
    </PortalLayout>
  );
}
