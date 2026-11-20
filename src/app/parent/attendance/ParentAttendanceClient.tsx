'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Student, AttendanceRecord } from '@/lib/types';
import { Card, CardHeader } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/StatCard';
import { StatusBadge } from '@/components/ui/Badge';
import { CalendarCheck2, CheckCircle2, UserCheck, AlertTriangle } from 'lucide-react';

interface ParentAttendanceClientProps {
  childrenList: Student[];
  activeStudent: Student;
  attendances: AttendanceRecord[];
}

export default function ParentAttendanceClient({
  childrenList,
  activeStudent,
  attendances,
}: ParentAttendanceClientProps) {
  const router = useRouter();

  const totalSessions = attendances.length;
  const presentCount = attendances.filter((a) => a.status === 'PRESENT').length;
  const lateCount = attendances.filter((a) => a.status === 'LATE').length;
  const absentCount = attendances.filter((a) => a.status === 'ABSENT').length;

  const attendanceRate = totalSessions > 0 ? Math.round((presentCount / totalSessions) * 100) : 100;

  return (
    <div className="space-y-6">
      {/* Title & Child Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-serif font-bold text-stone-900 dark:text-white">Attendance Register</h1>
          <p className="text-xs text-stone-500 dark:text-slate-400 mt-1">
            Real-time morning homeroom attendance tracking
          </p>
        </div>

        <div className="flex items-center gap-2 bg-stone-100 dark:bg-slate-800 p-1 rounded-xl border border-stone-200 dark:border-slate-700">
          <span className="text-[11px] font-bold uppercase text-stone-500 dark:text-slate-400 px-2">Ward:</span>
          {childrenList.map((child) => {
            const isSelected = child.id === activeStudent.id;
            return (
              <button
                key={child.id}
                onClick={() => router.push(`/parent/attendance?studentId=${child.id}`)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${isSelected
                    ? 'bg-[#FF1313] text-white shadow-xs'
                    : 'text-stone-700 dark:text-slate-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-200 dark:hover:bg-slate-700'
                  }`}
              >
                {child.firstName}
              </button>
            );
          })}
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatCard
          title="Attendance Rate"
          value={`${attendanceRate}%`}
          subtitle="Overall term performance"
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
          highlightColor="#059669"
        />
        <StatCard
          title="Present Days"
          value={presentCount}
          subtitle="Days on campus"
          icon={<UserCheck className="w-5 h-5" />}
        />
        <StatCard
          title="Tardiness / Late"
          value={lateCount}
          subtitle="Morning gate checkins"
          icon={<CalendarCheck2 className="w-5 h-5 text-orange-500 dark:text-orange-400" />}
          highlightColor="#F97316"
        />
        <StatCard
          title="Unexcused Absences"
          value={absentCount}
          subtitle="Missed roll calls"
          icon={<AlertTriangle className="w-5 h-5 text-rose-500 dark:text-rose-400" />}
          highlightColor="#E11D48"
        />
      </div>

      {/* Daily Records Table */}
      <Card>
        <CardHeader
          title={`Attendance Log: ${activeStudent.fullName}`}
          subtitle="Chronological roll call recorded by homeroom educator"
        />
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-stone-50 dark:bg-slate-800 text-[11px] font-bold uppercase text-stone-500 dark:text-slate-300 border-b border-stone-200 dark:border-slate-800 tracking-wider">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Day</th>
                <th className="py-3 px-4">Recorded Status</th>
                <th className="py-3 px-4">Educator Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-slate-800">
              {attendances.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-xs text-stone-400 dark:text-slate-500">
                    No attendance records for this period yet.
                  </td>
                </tr>
              ) : (
                attendances.map((rec) => {
                  const dayName = new Date(rec.date).toLocaleDateString('en-US', { weekday: 'long' });
                  return (
                    <tr key={rec.id} className="hover:bg-stone-50/80 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="py-3 px-4 font-mono text-xs font-bold text-stone-800 dark:text-slate-200">
                        {rec.date}
                      </td>
                      <td className="py-3 px-4 font-medium text-stone-700 dark:text-slate-300">{dayName}</td>
                      <td className="py-3 px-4">
                        <StatusBadge status={rec.status} />
                      </td>
                      <td className="py-3 px-4 text-xs text-stone-600 dark:text-slate-400">
                        {rec.remarks || 'Standard registration'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
