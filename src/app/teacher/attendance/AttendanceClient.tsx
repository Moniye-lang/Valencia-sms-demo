'use client';

import React, { useState, useTransition } from 'react';
import { ClassRoom, Student, AttendanceRecord, AttendanceStatus } from '@/lib/types';
import { saveAttendanceAction } from '@/lib/actions';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CalendarCheck2, CheckCircle2, UserCheck, UserX, Clock, Search, ChevronLeft, ChevronRight } from 'lucide-react';

interface AttendanceClientProps {
  classes: ClassRoom[];
  students: Student[];
  attendances: AttendanceRecord[];
}

export default function AttendanceClient({
  classes,
  students,
  attendances,
}: AttendanceClientProps) {
  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || '');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const pageSize = 20;
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [isPending, startTransition] = useTransition();
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const classStudents = students.filter((s) => s.classId === selectedClassId);

  // Status mapping for today / selected date
  const [statusMap, setStatusMap] = useState<Record<string, AttendanceStatus>>(() => {
    const map: Record<string, AttendanceStatus> = {};
    classStudents.forEach((st) => {
      const existing = attendances.find((a) => a.studentId === st.id && a.date === selectedDate);
      map[st.id] = existing ? existing.status : 'PRESENT';
    });
    return map;
  });

  const filteredStudents = classStudents.filter(
    (s) =>
      s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.admissionNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredStudents.length / pageSize) || 1;
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const presentCount = Object.values(statusMap).filter((s) => s === 'PRESENT').length;
  const lateCount = Object.values(statusMap).filter((s) => s === 'LATE').length;
  const absentCount = Object.values(statusMap).filter((s) => s === 'ABSENT').length;

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setStatusMap((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleMarkAll = (status: AttendanceStatus) => {
    const updated: Record<string, AttendanceStatus> = {};
    classStudents.forEach((st) => {
      updated[st.id] = status;
    });
    setStatusMap(updated);
  };

  const handleSaveAttendance = () => {
    setSuccessMsg(null);
    startTransition(async () => {
      const records = classStudents.map((st) => ({
        studentId: st.id,
        status: statusMap[st.id] || 'PRESENT',
      }));

      await saveAttendanceAction(selectedClassId, selectedDate, records);
      setSuccessMsg(`Class attendance for all ${classStudents.length} students on ${selectedDate} saved successfully!`);
    });
  };

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-serif font-bold text-slate-900 dark:text-white">
              Daily Class Attendance
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40">
              {classStudents.length} Students
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Homeroom roll call &bull; Automatically synchronizes with Parent Portal transcripts in real time
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-sm flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="font-semibold">{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg(null)} className="text-xs text-emerald-700 dark:text-emerald-400 underline font-semibold cursor-pointer">
            Dismiss
          </button>
        </div>
      )}

      {/* Date & Class Filter */}
      <Card>
        <CardBody className="p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Select Class
              </label>
              <select
                value={selectedClassId}
                onChange={(e) => {
                  setSelectedClassId(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full text-sm font-semibold border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#FF1313]"
              >
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({classStudents.length} Students)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Attendance Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full text-sm font-semibold border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#FF1313]"
              />
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Quick Status Bar & Save Button */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs transition-colors">
        <div className="flex items-center gap-2 flex-wrap text-xs font-semibold">
          <span className="text-slate-600 dark:text-slate-400">Quick Set All ({classStudents.length} students):</span>
          <button
            onClick={() => handleMarkAll('PRESENT')}
            className="px-3 py-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800 font-bold cursor-pointer"
          >
            All 50 Present
          </button>
          <button
            onClick={() => handleMarkAll('ABSENT')}
            className="px-3 py-1.5 rounded-lg bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 hover:bg-rose-200 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-800 font-bold cursor-pointer"
          >
            All 50 Absent
          </button>
          <span className="text-slate-300 dark:text-slate-600 mx-1">|</span>
          <span className="text-emerald-700 dark:text-emerald-400">{presentCount} Present</span>
          <span className="text-orange-600 dark:text-orange-400">{lateCount} Late</span>
          <span className="text-rose-600 dark:text-rose-400">{absentCount} Absent</span>
        </div>

        <Button onClick={handleSaveAttendance} isLoading={isPending} size="sm" className="font-bold">
          <CalendarCheck2 className="w-4 h-4 mr-1.5" />
          Save Attendance Sheet
        </Button>
      </div>

      {/* Search and Table Pagination Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search student or admission no..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#FF1313]"
          />
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
          <span>
            Showing {(currentPage - 1) * pageSize + 1} -{' '}
            {Math.min(currentPage * pageSize, filteredStudents.length)} of {filteredStudents.length}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1 rounded border border-slate-200 dark:border-slate-700 disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-bold px-1.5 text-slate-900 dark:text-white">{currentPage}</span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1 rounded border border-slate-200 dark:border-slate-700 disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Student List */}
      <Card>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {paginatedStudents.map((st, idx) => {
            const overallIndex = (currentPage - 1) * pageSize + idx + 1;
            const currentStatus = statusMap[st.id] || 'PRESENT';
            return (
              <div key={st.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 w-6">{overallIndex}</span>
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-white text-sm">{st.fullName}</span>
                    <span className="text-xs font-mono text-slate-400 dark:text-slate-500 ml-2">({st.admissionNo})</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleStatusChange(st.id, 'PRESENT')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${currentStatus === 'PRESENT'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-700 dark:hover:text-emerald-300'
                      }`}
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    Present
                  </button>

                  <button
                    type="button"
                    onClick={() => handleStatusChange(st.id, 'LATE')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${currentStatus === 'LATE'
                      ? 'bg-orange-500 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-orange-50 dark:hover:bg-orange-950/40 hover:text-orange-700 dark:hover:text-orange-300'
                      }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    Late
                  </button>

                  <button
                    type="button"
                    onClick={() => handleStatusChange(st.id, 'ABSENT')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${currentStatus === 'ABSENT'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-700 dark:hover:text-rose-300'
                      }`}
                  >
                    <UserX className="w-3.5 h-3.5" />
                    Absent
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
