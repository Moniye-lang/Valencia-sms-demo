import React from 'react';
import Link from 'next/link';
import { requireRole } from '@/lib/auth';
import { getDatabase } from '@/lib/data-store';
import { PortalLayout } from '@/components/layout/PortalLayout';
import { Card, CardHeader } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/StatCard';
import { Button } from '@/components/ui/Button';
import { Award, CalendarDays, CheckCircle2, UserCircle } from 'lucide-react';

export default async function StudentDashboardPage() {
  const session = await requireRole(['STUDENT']);
  const db = getDatabase();

  const student = db.students.find((s) => s.userId === session.userId) || db.students[0];
  const studentClass = db.classes.find((c) => c.id === student.classId);
  const classTeacher = db.teachers.find((t) => t.id === studentClass?.classTeacherId);

  // Student results
  const publishedResults = db.results.filter(
    (r) => r.studentId === student.id && r.status === 'PUBLISHED'
  );
  const totalPoints = publishedResults.reduce((acc, r) => acc + r.totalScore, 0);
  const averageScore =
    publishedResults.length > 0 ? (totalPoints / publishedResults.length).toFixed(1) : 'N/A';

  // Student timetable for today / Monday
  const todaySlots = db.timetables.filter((t) => t.classId === student.classId && t.day === 'Monday');

  return (
    <PortalLayout session={session}>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200 dark:border-slate-800">
          <div>
            <h1 className="text-2xl font-serif font-bold text-stone-900 dark:text-white">
              Welcome back, {student.firstName}!
            </h1>
            <p className="text-xs text-stone-500 dark:text-slate-400 mt-1">
              Class: <strong className="text-stone-800 dark:text-slate-200">{studentClass?.name}</strong> &bull; Admission No:{' '}
              <span className="font-mono font-bold text-[#FF1313]">{student.admissionNo}</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/student/results">
              <Button size="sm">
                <Award className="w-4 h-4 mr-1.5" />
                My Published Results
              </Button>
            </Link>
            <Link href="/student/timetable">
              <Button size="sm" variant="outline">
                <CalendarDays className="w-4 h-4 mr-1.5" />
                Class Timetable
              </Button>
            </Link>
          </div>
        </div>

        {/* Student KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            title="Published Subjects"
            value={publishedResults.length}
            subtitle="Verified academic scores"
            icon={<Award className="w-5 h-5" />}
          />
          <StatCard
            title="Term Average"
            value={averageScore !== 'N/A' ? `${averageScore}%` : 'Pending'}
            subtitle="Current academic standing"
            icon={<CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
            highlightColor="#059669"
          />
          <StatCard
            title="Homeroom Educator"
            value={classTeacher?.fullName.split(' ')[1] || 'Educator'}
            subtitle={classTeacher?.fullName}
            icon={<UserCircle className="w-5 h-5" />}
          />
        </div>

        {/* Two-Column: Schedule Preview & Published Results */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Today's Schedule in Tabular Form */}
          <Card>
            <CardHeader
              title="Today's Timetable (Monday)"
              subtitle={`Classroom: ${studentClass?.roomNumber || 'Room 204'}`}
              action={
                <Link href="/student/timetable" className="text-xs text-[#FF1313] hover:underline font-bold">
                  Full Week Table &rarr;
                </Link>
              }
            />
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800 text-[11px] font-bold uppercase text-slate-500 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800">
                    <th className="py-2.5 px-3">Period</th>
                    <th className="py-2.5 px-3">Time</th>
                    <th className="py-2.5 px-3">Subject</th>
                    <th className="py-2.5 px-3">Educator</th>
                    <th className="py-2.5 px-3">Room</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {todaySlots.map((slot) => (
                    <tr key={slot.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">
                        <span className="w-6 h-6 rounded-md bg-[#FF1313]/10 dark:bg-[#FF1313]/25 text-[#FF1313] font-bold text-[11px] inline-flex items-center justify-center">
                          P{slot.period}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-600 dark:text-slate-400 whitespace-nowrap">{slot.time}</td>
                      <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">{slot.subjectName}</td>
                      <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">{slot.teacherName}</td>
                      <td className="py-2.5 px-3 font-mono text-slate-500 dark:text-slate-400">{slot.room}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Academic Results Snapshot */}
          <Card>
            <CardHeader
              title="Published Academic Results"
              subtitle="Verified by Principal & Examination Committee"
              action={
                <Link href="/student/results" className="text-xs text-[#FF1313] hover:underline font-semibold">
                  Full Transcript &rarr;
                </Link>
              }
            />
            <div className="divide-y divide-stone-100 dark:divide-slate-800">
              {publishedResults.length === 0 ? (
                <div className="p-6 text-center text-xs text-stone-400 dark:text-slate-500">
                  Terminal examinations are ongoing. Results will appear once approved by the School Principal.
                </div>
              ) : (
                publishedResults.map((res) => {
                  const subject = db.subjects.find((s) => s.id === res.subjectId);
                  return (
                    <div key={res.id} className="p-4 flex items-center justify-between hover:bg-stone-50 dark:hover:bg-slate-800/50 transition-colors">
                      <div>
                        <div className="font-bold text-sm text-stone-900 dark:text-white">{subject?.name}</div>
                        <p className="text-xs text-stone-500 dark:text-slate-400 mt-0.5">
                          CA: {res.caScore}/40 &bull; Exam: {res.examScore}/60 &bull; {res.remark}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-lg text-stone-900 dark:text-white">{res.totalScore}</span>
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-bold ${res.grade === 'A'
                              ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                              : res.grade === 'B'
                                ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300'
                                : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                            }`}
                        >
                          {res.grade}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </Card>
        </div>
      </div>
    </PortalLayout>
  );
}
