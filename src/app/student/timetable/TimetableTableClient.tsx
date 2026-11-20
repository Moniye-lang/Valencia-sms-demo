'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { TimetableSlot, ClassRoom } from '@/lib/types';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  CalendarDays,
  Clock,
  MapPin,
  Printer,
  Coffee,
  Utensils,
  Filter,
  CheckCircle2,
  Bell,
  GraduationCap
} from 'lucide-react';

interface TimetableTableClientProps {
  slots: TimetableSlot[];
  studentClass?: ClassRoom;
  studentName: string;
  admissionNo: string;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const;

interface PeriodInfo {
  period: number;
  time: string;
  isBreak?: boolean;
  breakLabel?: string;
  breakIcon?: 'snack' | 'lunch';
}

const PERIOD_GRID: PeriodInfo[] = [
  { period: 1, time: '08:00 - 08:45 AM' },
  { period: 2, time: '08:45 - 09:30 AM' },
  { period: 3, time: '09:30 - 10:15 AM' },
  {
    period: 0,
    time: '10:15 - 10:45 AM',
    isBreak: true,
    breakLabel: 'Short Break & Morning Refreshment Interval',
    breakIcon: 'snack',
  },
  { period: 4, time: '10:45 - 11:30 AM' },
  { period: 5, time: '11:30 - 12:15 PM' },
  {
    period: 0,
    time: '12:15 - 01:00 PM',
    isBreak: true,
    breakLabel: 'Lunch Break, Recreation & Midday Fellowship',
    breakIcon: 'lunch',
  },
  { period: 6, time: '01:00 - 01:45 PM' },
  { period: 7, time: '01:45 - 02:30 PM' },
];

export default function TimetableTableClient({
  slots,
  studentClass,
  studentName,
  admissionNo,
}: TimetableTableClientProps) {
  const [selectedDay, setSelectedDay] = useState<string>('ALL');

  // Helper to get color style based on subject
  const getSubjectBadge = (subject: string) => {
    const s = subject.toLowerCase();
    if (s.includes('math') || s.includes('science') || s.includes('ict') || s.includes('computer')) {
      return {
        bg: 'bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800/60',
        dot: 'bg-blue-500',
        tag: 'STEM',
      };
    }
    if (s.includes('english') || s.includes('french') || s.includes('language') || s.includes('literature')) {
      return {
        bg: 'bg-purple-50 dark:bg-purple-950/40 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800/60',
        dot: 'bg-purple-500',
        tag: 'Language',
      };
    }
    if (s.includes('agric')) {
      return {
        bg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60',
        dot: 'bg-emerald-500',
        tag: 'Vocational',
      };
    }
    if (s.includes('civic') || s.includes('social') || s.includes('business') || s.includes('religious')) {
      return {
        bg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 border-amber-200 dark:border-amber-800/60',
        dot: 'bg-amber-500',
        tag: 'Humanities',
      };
    }
    return {
      bg: 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800/60',
      dot: 'bg-[#FF1313]',
      tag: 'Activity',
    };
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800 print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FF1313]/10 dark:bg-[#FF1313]/25 text-[#FF1313] border border-[#FF1313]/20 dark:border-[#FF1313]/40 uppercase tracking-wide">
              Official Class Schedule
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold">&bull; 2024/2025 Session (Term 1)</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-slate-900 dark:text-white mt-1">
            Student Weekly Timetable
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Student: <strong className="text-slate-900 dark:text-white">{studentName}</strong> ({admissionNo}) &bull; Classroom:{' '}
            <strong className="text-slate-900 dark:text-white">{studentClass?.name}</strong> ({studentClass?.roomNumber})
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="text-xs font-semibold shadow-xs"
            title="Print weekly timetable certificate"
          >
            <Printer className="w-3.5 h-3.5 mr-1.5 text-slate-600 dark:text-slate-400" />
            Print Timetable
          </Button>
        </div>
      </div>

      {/* Filter Tabs Bar */}
      <div className="flex items-center justify-between gap-3 bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs print:hidden flex-wrap transition-colors">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 px-2 uppercase tracking-wider flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            View Format:
          </span>

          <button
            onClick={() => setSelectedDay('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${selectedDay === 'ALL'
                ? 'bg-[#FF1313] text-white shadow-xs'
                : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
          >
            Full Week Table (Matrix)
          </button>

          {DAYS.map((day) => {
            const isSelected = selectedDay === day;
            return (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${isSelected
                    ? 'bg-[#FF1313] text-white shadow-xs'
                    : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
              >
                {day}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 hidden lg:flex pr-2">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>School Hours: 08:00 AM - 02:30 PM &bull; 7 Academic Periods</span>
        </div>
      </div>

      {/* Printable Institutional Header (shown only when printing) */}
      <div className="hidden print:block p-6 border-b-2 border-[#FF1313] mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 relative">
              <Image
                src="/logo-transparent.png"
                alt="Valencia Schools Crest"
                width={64}
                height={58}
                priority
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-2xl font-serif font-black text-slate-900">VALENCIA SCHOOLS LAGOS</h1>
              <p className="text-xs text-slate-600 font-semibold">Excellence &bull; Integrity &bull; Leadership</p>
              <p className="text-xs text-slate-500">Official Class Timetable &bull; Academic Session 2024/2025</p>
            </div>
          </div>
          <div className="text-right text-xs">
            <p className="font-bold text-slate-900">Student: {studentName}</p>
            <p className="font-mono text-slate-700">Adm No: {admissionNo}</p>
            <p className="text-slate-600">Class: {studentClass?.name} ({studentClass?.roomNumber})</p>
          </div>
        </div>
      </div>

      {/* 1. FULL WEEKLY TIMETABLE MATRIX (TABULAR FORM) */}
      {selectedDay === 'ALL' && (
        <Card className="shadow-md border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900">
          <CardHeader
            title={
              <div className="flex items-center gap-2.5">
                <CalendarDays className="w-5 h-5 text-[#FF1313]" />
                <span>Weekly Master Timetable Grid</span>
              </div>
            }
            subtitle={`${studentClass?.name || 'JSS 2A'} &bull; Homeroom: ${studentClass?.roomNumber || 'Room 204'} &bull; Term 1 Schedule`}
            action={
              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/40 px-2.5 py-1 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                Active Curriculum
              </span>
            }
          />

          {/* Morning Devotion Header Strip */}
          <div className="bg-slate-100/90 dark:bg-slate-800/80 border-y border-slate-200 dark:border-slate-800 px-4 py-2 flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-600" />
              <span>07:45 - 08:00 AM: Morning Assembly, National Anthem & Homeroom Roll Call</span>
            </div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400 hidden sm:inline">
              Compulsory Daily Attendance
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs min-w-[850px]">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                  <th className="py-3.5 px-4 font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider text-[11px] w-36 border-r border-slate-200 dark:border-slate-700 sticky left-0 bg-slate-50 dark:bg-slate-800 z-10 shadow-xs">
                    Period & Time
                  </th>
                  {DAYS.map((day) => (
                    <th
                      key={day}
                      className="py-3.5 px-4 font-bold text-slate-900 dark:text-white uppercase tracking-wider text-center border-r last:border-r-0 border-slate-200 dark:border-slate-700 text-xs w-[18%]"
                    >
                      <div className="font-bold text-sm text-slate-900 dark:text-white">{day}</div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {PERIOD_GRID.map((pInfo, pIdx) => {
                  // Special Break Rows (Spanning all days)
                  if (pInfo.isBreak) {
                    return (
                      <tr key={`break_${pIdx}`} className="bg-amber-50/70 dark:bg-amber-950/30 border-y-2 border-amber-200 dark:border-amber-800/60 text-amber-950 dark:text-amber-200">
                        <td className="py-2.5 px-4 font-bold font-mono text-[11px] border-r border-amber-200/80 dark:border-amber-800/60 sticky left-0 bg-amber-100/90 dark:bg-amber-950/80 z-10 text-amber-900 dark:text-amber-300">
                          {pInfo.time}
                        </td>
                        <td colSpan={5} className="py-2.5 px-4 text-center font-bold text-xs tracking-wide">
                          <div className="flex items-center justify-center gap-2">
                            {pInfo.breakIcon === 'snack' ? (
                              <Coffee className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                            ) : (
                              <Utensils className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                            )}
                            <span className="uppercase text-[11px] tracking-wider text-amber-900 dark:text-amber-200">
                              {pInfo.breakLabel}
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  }

                  // Normal Academic Period Row
                  return (
                    <tr key={`period_${pInfo.period}`} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                      {/* Period Header Column */}
                      <td className="py-3.5 px-4 border-r border-slate-200 dark:border-slate-700 font-medium sticky left-0 bg-white dark:bg-slate-900 z-10 shadow-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-7 h-7 rounded-lg bg-[#FF1313]/10 dark:bg-[#FF1313]/25 text-[#FF1313] font-bold text-xs flex items-center justify-center shrink-0">
                            P{pInfo.period}
                          </span>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white text-xs">Period {pInfo.period}</p>
                            <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400">{pInfo.time}</p>
                          </div>
                        </div>
                      </td>

                      {/* Day Columns */}
                      {DAYS.map((day) => {
                        const slot = slots.find(
                          (s) => s.day === day && s.period === pInfo.period
                        );

                        if (!slot) {
                          return (
                            <td
                              key={`${day}_${pInfo.period}`}
                              className="py-3 px-3 text-center border-r last:border-r-0 border-slate-200 dark:border-slate-800 text-slate-300 dark:text-slate-600 italic text-[11px]"
                            >
                              Free Period
                            </td>
                          );
                        }

                        const badge = getSubjectBadge(slot.subjectName);

                        return (
                          <td
                            key={`${day}_${pInfo.period}`}
                            className="p-2.5 border-r last:border-r-0 border-slate-200 dark:border-slate-800 align-top hover:bg-slate-100/50 dark:hover:bg-slate-800/60 transition-colors"
                          >
                            <div className={`p-2.5 rounded-xl border ${badge.bg} shadow-2xs h-full flex flex-col justify-between`}>
                              <div>
                                <div className="flex items-center justify-between gap-1 mb-1">
                                  <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded bg-white/70 dark:bg-slate-900/70">
                                    {badge.tag}
                                  </span>
                                  <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                                </div>
                                <h4 className="font-bold text-slate-900 dark:text-white text-xs leading-snug line-clamp-2">
                                  {slot.subjectName}
                                </h4>
                              </div>

                              <div className="mt-2 pt-1.5 border-t border-slate-200/60 dark:border-slate-700/60 space-y-0.5 text-[10px]">
                                <p className="font-medium text-slate-700 dark:text-slate-300 truncate" title={slot.teacherName}>
                                  {slot.teacherName}
                                </p>
                                <p className="font-mono text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                  <MapPin className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                                  <span>{slot.room}</span>
                                </p>
                              </div>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* 2. SINGLE DAY TABULAR VIEW (FOCUSED DETAIL) */}
      {selectedDay !== 'ALL' && (
        <Card className="shadow-md border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900">
          <CardHeader
            title={
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#FF1313]" />
                <span>{selectedDay} Schedule &bull; Tabular Breakdown</span>
              </div>
            }
            subtitle={`${slots.filter((s) => s.day === selectedDay).length} Scheduled Academic Classes for ${studentClass?.name}`}
            action={
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedDay('ALL')}
                className="text-xs text-[#FF1313] hover:bg-[#FF1313]/5 font-bold"
              >
                &larr; Return to Full Week Table
              </Button>
            }
          />

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800 text-[11px] font-bold uppercase text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700 tracking-wider">
                  <th className="py-3 px-4">Period</th>
                  <th className="py-3 px-4">Time Window</th>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Educator / Teacher</th>
                  <th className="py-3 px-4">Classroom / Facility</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                {PERIOD_GRID.map((pInfo, idx) => {
                  if (pInfo.isBreak) {
                    return (
                      <tr key={`break_detail_${idx}`} className="bg-amber-50/80 dark:bg-amber-950/30 font-semibold text-amber-900 dark:text-amber-200 border-y border-amber-200 dark:border-amber-800/60">
                        <td className="py-2.5 px-4 font-mono text-amber-700 dark:text-amber-400">&bull;</td>
                        <td className="py-2.5 px-4 font-mono font-bold">{pInfo.time}</td>
                        <td colSpan={4} className="py-2.5 px-4">
                          <div className="flex items-center gap-2">
                            {pInfo.breakIcon === 'snack' ? <Coffee className="w-4 h-4" /> : <Utensils className="w-4 h-4" />}
                            <span>{pInfo.breakLabel}</span>
                          </div>
                        </td>
                        <td className="py-2.5 px-4 text-center">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                            Break
                          </span>
                        </td>
                      </tr>
                    );
                  }

                  const slot = slots.find((s) => s.day === selectedDay && s.period === pInfo.period);
                  if (!slot) {
                    return (
                      <tr key={`empty_${pInfo.period}`} className="text-slate-400 dark:text-slate-500 italic">
                        <td className="py-3 px-4 font-bold">P{pInfo.period}</td>
                        <td className="py-3 px-4 font-mono">{pInfo.time}</td>
                        <td colSpan={4} className="py-3 px-4">Independent Study / Free Period</td>
                        <td className="py-3 px-4 text-center">&mdash;</td>
                      </tr>
                    );
                  }

                  const badge = getSubjectBadge(slot.subjectName);

                  return (
                    <tr key={slot.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                        <span className="w-7 h-7 rounded-lg bg-[#FF1313]/10 dark:bg-[#FF1313]/25 text-[#FF1313] font-bold text-xs inline-flex items-center justify-center">
                          P{slot.period}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-semibold text-slate-700 dark:text-slate-300">{slot.time}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white text-sm">
                        {slot.subjectName}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${badge.bg}`}>
                          {badge.tag}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200">
                        <div className="flex items-center gap-1.5">
                          <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                          <span>{slot.teacherName}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1 text-slate-700 dark:text-slate-300 font-mono text-xs">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{slot.room}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40">
                          Scheduled
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Subject Categorization Legend */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs print:hidden transition-colors">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
          Curriculum Category Legend
        </h4>
        <div className="flex items-center gap-3 flex-wrap text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-blue-100 dark:bg-blue-900/80 border border-blue-300 dark:border-blue-700" />
            <span className="text-slate-700 dark:text-slate-300 font-medium">STEM (Mathematics, Basic Science, ICT)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-purple-100 dark:bg-purple-900/80 border border-purple-300 dark:border-purple-700" />
            <span className="text-slate-700 dark:text-slate-300 font-medium">Languages (English Studies, French, Nigerian Lang)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-amber-100 dark:bg-amber-900/80 border border-amber-300 dark:border-amber-700" />
            <span className="text-slate-700 dark:text-slate-300 font-medium">Humanities (Civic, Social Studies, Business, CRS/IRS)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-emerald-100 dark:bg-emerald-900/80 border border-emerald-300 dark:border-emerald-700" />
            <span className="text-slate-700 dark:text-slate-300 font-medium">Vocational (Agricultural Science)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-rose-100 dark:bg-rose-900/80 border border-rose-300 dark:border-rose-700" />
            <span className="text-slate-700 dark:text-slate-300 font-medium">Physical & Creative (PHE, Music, Clubs)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
