'use client';

import React, { useState, useTransition } from 'react';
import { ClassRoom, Subject, Teacher, Student, ResultRecord } from '@/lib/types';
import { approveResultsAction, publishResultsAction, rejectResultsAction } from '@/lib/actions';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/Badge';
import { CheckCircle2, Globe, Search, ShieldCheck, ChevronLeft, ChevronRight } from 'lucide-react';

interface ResultApprovalClientProps {
  classes: ClassRoom[];
  subjects: Subject[];
  teachers: Teacher[];
  students: Student[];
  results: ResultRecord[];
}

export default function ResultApprovalClient({
  classes,
  subjects,
  teachers,
  students,
  results,
}: ResultApprovalClientProps) {
  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || '');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(subjects[0]?.id || '');
  const [isPending, startTransition] = useTransition();
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectBox, setShowRejectBox] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [pageSize, setPageSize] = useState<number>(15);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const classSubjects = subjects.filter((s) => s.classId === selectedClassId);
  const currentSubject = subjects.find((s) => s.id === selectedSubjectId);
  const currentClass = classes.find((c) => c.id === selectedClassId);
  const currentTeacher = teachers.find((t) => t.id === currentSubject?.teacherId);

  const activeResults = results.filter(
    (r) => r.classId === selectedClassId && r.subjectId === selectedSubjectId
  );

  const hasPending = activeResults.some((r) => r.status === 'PENDING_APPROVAL');
  const hasApproved = activeResults.some((r) => r.status === 'APPROVED');
  const isPublished = activeResults.length > 0 && activeResults.every((r) => r.status === 'PUBLISHED');

  let batchStatus = 'DRAFT';
  if (isPublished) batchStatus = 'PUBLISHED';
  else if (hasApproved) batchStatus = 'APPROVED';
  else if (hasPending) batchStatus = 'PENDING_APPROVAL';

  // Filter & pagination
  const filteredResults = activeResults.filter((r) => {
    const student = students.find((s) => s.id === r.studentId);
    if (!student) return true;
    return (
      student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.admissionNo.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const totalPages = Math.ceil(filteredResults.length / pageSize) || 1;
  const paginatedResults = filteredResults.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleApprove = () => {
    setSuccessMsg(null);
    startTransition(async () => {
      await approveResultsAction(selectedClassId, selectedSubjectId);
      setSuccessMsg(`Approved ${activeResults.length} student scores for ${currentSubject?.name}. Ready to publish.`);
    });
  };

  const handlePublish = () => {
    setSuccessMsg(null);
    startTransition(async () => {
      await publishResultsAction(selectedClassId, selectedSubjectId);
      setSuccessMsg(`Published! ${activeResults.length} student report cards for ${currentSubject?.name} are now live for Parents and Students.`);
    });
  };

  const handleReject = () => {
    if (!rejectReason) {
      alert('Please specify reason for requesting changes.');
      return;
    }
    setSuccessMsg(null);
    startTransition(async () => {
      await rejectResultsAction(selectedClassId, selectedSubjectId, rejectReason);
      setShowRejectBox(false);
      setRejectReason('');
      setSuccessMsg(`Returned ${currentSubject?.name} scores back to teacher for revisions.`);
    });
  };

  return (
    <div className="space-y-6 w-full">
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

      {/* Class & Subject Selector */}
      <Card>
        <CardBody className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Select Classroom
              </label>
              <select
                value={selectedClassId}
                onChange={(e) => {
                  const newClassId = e.target.value;
                  setSelectedClassId(newClassId);
                  setCurrentPage(1);
                  const firstSub = subjects.find((s) => s.classId === newClassId);
                  if (firstSub) setSelectedSubjectId(firstSub.id);
                }}
                className="w-full text-sm font-semibold border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#FF1313]"
              >
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({students.filter((s) => s.classId === c.id).length} Students)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Select Subject
              </label>
              <select
                value={selectedSubjectId}
                onChange={(e) => {
                  setSelectedSubjectId(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full text-sm font-semibold border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#FF1313]"
              >
                {classSubjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.code})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Workflow Banner & Action Controls */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors">
        <div>
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {currentSubject?.name} &bull; {currentClass?.name}
            </h3>
            <StatusBadge status={batchStatus} />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Subject Educator: <strong className="text-slate-800 dark:text-slate-200">{currentTeacher?.fullName}</strong> &bull;{' '}
            <strong className="text-emerald-700 dark:text-emerald-400">{activeResults.length} Enrolled Student Scores</strong> &bull; Session: 2024/2025 (1st Term)
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {batchStatus === 'PENDING_APPROVAL' && (
            <>
              <Button
                variant="primary"
                size="sm"
                isLoading={isPending}
                onClick={handleApprove}
                className="font-bold shadow-sm"
              >
                <CheckCircle2 className="w-4 h-4 mr-1.5" />
                Approve Scores
              </Button>
              <Button
                variant="success"
                size="sm"
                isLoading={isPending}
                onClick={handlePublish}
                className="font-bold shadow-sm"
              >
                <Globe className="w-4 h-4 mr-1.5" />
                Approve & Publish All {activeResults.length} Now
              </Button>
              <Button
                variant="danger"
                size="sm"
                isLoading={isPending}
                onClick={() => setShowRejectBox(!showRejectBox)}
                className="text-xs"
              >
                Request Revisions
              </Button>
            </>
          )}

          {batchStatus === 'APPROVED' && (
            <Button
              variant="success"
              size="sm"
              isLoading={isPending}
              onClick={handlePublish}
              className="font-bold shadow-sm"
            >
              <Globe className="w-4 h-4 mr-1.5" />
              Publish All {activeResults.length} to Parents & Students
            </Button>
          )}

          {batchStatus === 'PUBLISHED' && (
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 px-3.5 py-2 rounded-lg border border-emerald-200 dark:border-emerald-800 shadow-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>All {activeResults.length} Scores Verified & Live on Family Portals</span>
            </div>
          )}

          {batchStatus === 'DRAFT' && (
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-lg">
              Teacher is currently entering draft scores. Not yet submitted for approval.
            </div>
          )}
        </div>
      </div>

      {/* Revision note box */}
      {showRejectBox && (
        <Card className="border-rose-300 dark:border-rose-800 bg-rose-50/50 dark:bg-rose-950/30">
          <CardBody className="space-y-3">
            <h4 className="text-xs font-bold text-rose-900 dark:text-rose-200 uppercase tracking-wider">
              Return to Educator with Revision Note
            </h4>
            <textarea
              rows={2}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Please verify CA scores for students who wrote the makeup quiz..."
              className="w-full text-xs border border-rose-300 dark:border-rose-700 rounded-lg p-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
            <div className="flex justify-end gap-2">
              <Button size="sm" variant="ghost" onClick={() => setShowRejectBox(false)}>
                Cancel
              </Button>
              <Button size="sm" variant="danger" isLoading={isPending} onClick={handleReject}>
                Send Note & Return
              </Button>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Search and Table Pagination Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search student name or admission no..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#FF1313]"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-400 w-full sm:w-auto">
          <span>Rows per page:</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-1 text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
          >
            <option value={15}>15 rows</option>
            <option value={25}>25 rows</option>
            <option value={50}>50 rows (All)</option>
          </select>
          <span className="text-slate-400 dark:text-slate-600">|</span>
          <span>
            Showing {(currentPage - 1) * pageSize + 1} -{' '}
            {Math.min(currentPage * pageSize, filteredResults.length)} of {filteredResults.length}
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

      {/* Scores Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800 text-[11px] font-bold uppercase text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800 tracking-wider">
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Admission No</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4 text-center">CA Score (40)</th>
                <th className="py-3 px-4 text-center">Exam Score (60)</th>
                <th className="py-3 px-4 text-center">Total (100)</th>
                <th className="py-3 px-4 text-center">Grade</th>
                <th className="py-3 px-4">Educator Remark</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {paginatedResults.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-xs text-slate-400 dark:text-slate-500">
                    No scores recorded for this subject yet.
                  </td>
                </tr>
              ) : (
                paginatedResults.map((r, idx) => {
                  const student = students.find((s) => s.id === r.studentId);
                  const overallIndex = (currentPage - 1) * pageSize + idx + 1;
                  return (
                    <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="py-3 px-4 text-xs font-semibold text-slate-400 dark:text-slate-500">{overallIndex}</td>
                      <td className="py-3 px-4 font-mono text-xs text-slate-700 dark:text-slate-300">
                        {student?.admissionNo || 'VAL/--'}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                        {student?.fullName || 'Student'}
                        {student?.firstName === 'Zainab' && (
                          <span className="ml-2 text-[10px] font-bold bg-[#FF1313]/10 dark:bg-[#FF1313]/25 text-[#FF1313] px-2 py-0.5 rounded">
                            Demo Ward
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center font-medium text-slate-800 dark:text-slate-200">{r.caScore}</td>
                      <td className="py-3 px-4 text-center font-medium text-slate-800 dark:text-slate-200">{r.examScore}</td>
                      <td className="py-3 px-4 text-center font-bold text-slate-900 dark:text-white text-base">
                        {r.totalScore}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${r.grade === 'A'
                              ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                              : r.grade === 'B'
                                ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300'
                                : r.grade === 'C'
                                  ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                                  : 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300'
                            }`}
                        >
                          {r.grade}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-600 dark:text-slate-400">{r.remark}</td>
                      <td className="py-3 px-4 text-center">
                        <StatusBadge status={r.status} />
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
