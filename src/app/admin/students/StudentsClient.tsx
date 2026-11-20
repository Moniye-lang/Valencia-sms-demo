'use client';

import React, { useState, useTransition } from 'react';
import { Student, ClassRoom, Parent } from '@/lib/types';
import { createStudentAction } from '@/lib/actions';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Search, UserPlus, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';

interface StudentsClientProps {
  students: Student[];
  classes: ClassRoom[];
  parents: Parent[];
}

export default function StudentsClient({ students, classes, parents }: StudentsClientProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedSection, setSelectedSection] = useState<string>('ALL');
  const [selectedClassFilter, setSelectedClassFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [pageSize, setPageSize] = useState<number>(20);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [isPending, startTransition] = useTransition();
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Sections
  const sections = [
    { id: 'ALL', label: 'All School', count: students.length },
    {
      id: 'EARLY_YEARS',
      label: 'Early Years (Daycare / Playgroup)',
      count: students.filter((s) => {
        const c = classes.find((cls) => cls.id === s.classId);
        return c?.level === 'EARLY_YEARS';
      }).length,
    },
    {
      id: 'NURSERY',
      label: 'Nursery (NUR 1 & 2)',
      count: students.filter((s) => {
        const c = classes.find((cls) => cls.id === s.classId);
        return c?.level === 'NURSERY';
      }).length,
    },
    {
      id: 'PRIMARY',
      label: 'Primary (PRI 1 - 6)',
      count: students.filter((s) => {
        const c = classes.find((cls) => cls.id === s.classId);
        return c?.level === 'PRIMARY';
      }).length,
    },
    {
      id: 'JSS',
      label: 'Junior Secondary (JSS 1 - 3)',
      count: students.filter((s) => {
        const c = classes.find((cls) => cls.id === s.classId);
        return c?.level === 'JSS';
      }).length,
    },
    {
      id: 'SSS',
      label: 'Senior Secondary (SS 1 - 3)',
      count: students.filter((s) => {
        const c = classes.find((cls) => cls.id === s.classId);
        return c?.level === 'SSS';
      }).length,
    },
  ];

  // Filtered classes based on section
  const visibleClasses = selectedSection === 'ALL'
    ? classes
    : classes.filter((c) => c.level === selectedSection);

  const filteredStudents = students.filter((s) => {
    const studentClass = classes.find((c) => c.id === s.classId);
    const matchesSection = selectedSection === 'ALL' || studentClass?.level === selectedSection;
    const matchesClass = selectedClassFilter === 'ALL' || s.classId === selectedClassFilter;
    const matchesSearch =
      s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.admissionNo.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSection && matchesClass && matchesSearch;
  });

  const totalPages = Math.ceil(filteredStudents.length / pageSize) || 1;
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleAddStudent = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      const res = await createStudentAction(formData);
      if (res.success) {
        setSuccessMsg(`Student enrolled successfully with generated Valencia admission ID!`);
        setShowAddModal(false);
        form.reset();
      }
    });
  };

  return (
    <div className="space-y-6 w-full">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-serif font-bold text-slate-900 dark:text-white">Student Directory</h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40">
              {students.length} Total Enrolled (Daycare to SS 3)
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Comprehensive roster spanning all 16 academic arms &bull; 50 students per class
          </p>
        </div>
        <Button size="sm" onClick={() => setShowAddModal(true)}>
          <UserPlus className="w-4 h-4 mr-1.5" />
          Enroll New Student
        </Button>
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

      {/* Section Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {sections.map((sec) => {
          const isActive = selectedSection === sec.id;
          return (
            <button
              key={sec.id}
              onClick={() => {
                setSelectedSection(sec.id);
                setSelectedClassFilter('ALL');
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${isActive
                  ? 'bg-[#FF1313] text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
            >
              {sec.label} ({sec.count})
            </button>
          );
        })}
      </div>

      {/* Search and Class Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
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

        <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Specific Class:</span>
            <select
              value={selectedClassFilter}
              onChange={(e) => {
                setSelectedClassFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="text-xs border border-slate-300 dark:border-slate-700 rounded-lg p-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
            >
              <option value="ALL">All Classes in Section ({filteredStudents.length})</option>
              {visibleClasses.map((c) => {
                const count = students.filter((s) => s.classId === c.id).length;
                return (
                  <option key={c.id} value={c.id}>
                    {c.name} ({count} students)
                  </option>
                );
              })}
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
            <span>Rows:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-1 text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
            >
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>
      </div>

      {/* Add Student Modal */}
      {showAddModal && (
        <Card className="border-[#FF1313]/30 shadow-lg">
          <CardHeader
            title="Enroll New Student"
            subtitle="Automates admission number, student portal user account, and fee schedule"
            action={
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-semibold cursor-pointer"
              >
                Close &times;
              </button>
            }
          />
          <CardBody>
            <form onSubmit={handleAddStudent} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">First Name *</label>
                  <input
                    name="firstName"
                    required
                    placeholder="e.g. Damilola"
                    className="w-full text-xs border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-[#FF1313]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Last Name *</label>
                  <input
                    name="lastName"
                    required
                    placeholder="e.g. Alabi"
                    className="w-full text-xs border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-[#FF1313]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Assigned Class *</label>
                  <select
                    name="classId"
                    required
                    className="w-full text-xs border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.level})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Gender *</label>
                  <select
                    name="gender"
                    required
                    className="w-full text-xs border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Parent Guardian *</label>
                  <select
                    name="parentEmail"
                    className="w-full text-xs border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    {parents.map((p) => (
                      <option key={p.id} value={p.email}>
                        {p.fullName} ({p.phone})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <Button type="button" variant="ghost" onClick={() => setShowAddModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" isLoading={isPending}>
                  Save & Enroll Student
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      )}

      {/* Student Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800 text-[11px] font-bold uppercase text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800 tracking-wider">
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Admission No</th>
                <th className="py-3 px-4">Student Full Name</th>
                <th className="py-3 px-4">Current Classroom</th>
                <th className="py-3 px-4">Section</th>
                <th className="py-3 px-4">Gender</th>
                <th className="py-3 px-4">State of Origin</th>
                <th className="py-3 px-4">Emergency Contact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {paginatedStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-xs text-slate-400 dark:text-slate-500">
                    No students match the selected filter.
                  </td>
                </tr>
              ) : (
                paginatedStudents.map((std, idx) => {
                  const studentClass = classes.find((c) => c.id === std.classId);
                  const parent = parents.find((p) => p.id === std.parentId);
                  const overallIndex = (currentPage - 1) * pageSize + idx + 1;
                  return (
                    <tr key={std.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="py-3 px-4 text-xs font-semibold text-slate-400 dark:text-slate-500">{overallIndex}</td>
                      <td className="py-3 px-4 font-mono text-xs font-bold text-[#FF1313]">
                        {std.admissionNo}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900 dark:text-white">{std.fullName}</div>
                        <div className="text-[11px] text-slate-400 dark:text-slate-500">DOB: {std.dateOfBirth}</div>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">
                        <span className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-2.5 py-1 rounded text-xs font-bold">
                          {studentClass?.name || 'Class'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-xs font-medium text-slate-600 dark:text-slate-400">
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {studentClass?.level.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-600 dark:text-slate-400">{std.gender}</td>
                      <td className="py-3 px-4 text-xs text-slate-700 dark:text-slate-300">
                        {std.stateOfOrigin || 'Lagos State'}
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-600 dark:text-slate-400 font-mono">
                        {std.emergencyContact || parent?.phone || 'N/A'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination footer */}
        <div className="px-6 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
          <span>
            Showing {(currentPage - 1) * pageSize + 1} to{' '}
            {Math.min(currentPage * pageSize, filteredStudents.length)} of {filteredStudents.length} students
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1 rounded border border-slate-200 dark:border-slate-700 disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-bold px-2 text-slate-900 dark:text-white">Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1 rounded border border-slate-200 dark:border-slate-700 disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
