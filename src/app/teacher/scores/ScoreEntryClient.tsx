'use client';

import React, { useState, useTransition } from 'react';
import { Teacher, ClassRoom, Subject, Student, ResultRecord } from '@/lib/types';
import { saveScoreAction, saveBatchScoresAction, submitScoresForApprovalAction } from '@/lib/actions';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/Badge';
import { calculateGrade } from '@/lib/grading';
import {
  Send,
  Save,
  CheckCircle2,
  Lock,
  Search,
  Sparkles,
  Info,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface ScoreEntryClientProps {
  teacher: Teacher;
  classes: ClassRoom[];
  subjects: Subject[];
  students: Student[];
  results: ResultRecord[];
}

export default function ScoreEntryClient({
  teacher,
  classes,
  subjects,
  students,
  results,
}: ScoreEntryClientProps) {
  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || '');
  const classSubjects = subjects.filter((s) => s.classId === selectedClassId);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(
    classSubjects[0]?.id || subjects[0]?.id || ''
  );

  const [searchTerm, setSearchTerm] = useState('');
  const [pageSize, setPageSize] = useState<number>(15);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [isPending, startTransition] = useTransition();
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const classStudents = students.filter((s) => s.classId === selectedClassId);
  const currentSubject = subjects.find((s) => s.id === selectedSubjectId);
  const currentClass = classes.find((c) => c.id === selectedClassId);

  const currentResults = results.filter(
    (r) => r.classId === selectedClassId && r.subjectId === selectedSubjectId
  );

  // Score mapping state for all 50 students
  const [scoreMap, setScoreMap] = useState<
    Record<string, { caScore: number; examScore: number }>
  >(() => {
    const map: Record<string, { caScore: number; examScore: number }> = {};
    classStudents.forEach((st, idx) => {
      const existing = results.find(
        (r) =>
          r.studentId === st.id &&
          r.subjectId === (classSubjects[0]?.id || subjects[0]?.id || '') &&
          r.classId === (classes[0]?.id || '')
      );
      if (existing) {
        map[st.id] = { caScore: existing.caScore, examScore: existing.examScore };
      } else {
        // Default realistic scores
        const ca = idx === 0 ? 38 : Math.min(40, 25 + ((idx * 5) % 15));
        const exam = idx === 0 ? 58 : Math.min(60, 38 + ((idx * 7) % 22));
        map[st.id] = { caScore: ca, examScore: exam };
      }
    });
    return map;
  });

  // Calculate current batch status
  const hasPending = currentResults.some((r) => r.status === 'PENDING_APPROVAL');
  const hasApproved = currentResults.some((r) => r.status === 'APPROVED');
  const isPublished =
    currentResults.length > 0 && currentResults.every((r) => r.status === 'PUBLISHED');

  let batchStatus = 'DRAFT';
  if (isPublished) batchStatus = 'PUBLISHED';
  else if (hasApproved) batchStatus = 'APPROVED';
  else if (hasPending) batchStatus = 'PENDING_APPROVAL';

  const isLocked = batchStatus === 'PENDING_APPROVAL' || batchStatus === 'PUBLISHED';

  // Filter students by search term
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

  const handleScoreChange = (studentId: string, field: 'caScore' | 'examScore', val: string) => {
    const num = Math.max(0, parseInt(val) || 0);
    const maxVal = field === 'caScore' ? 40 : 60;
    const clamped = Math.min(num, maxVal);

    setScoreMap((prev) => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || { caScore: 0, examScore: 0 }),
        [field]: clamped,
      },
    }));
  };

  const handleSaveAllScores = () => {
    setSuccessMsg(null);
    startTransition(async () => {
      const recordsToSave = classStudents.map((st) => {
        const item = scoreMap[st.id] || { caScore: 0, examScore: 0 };
        return {
          studentId: st.id,
          caScore: item.caScore,
          examScore: item.examScore,
        };
      });

      await saveBatchScoresAction(selectedClassId, selectedSubjectId, recordsToSave);
      setSuccessMsg(
        `Saved draft scores for all ${recordsToSave.length} students in ${currentSubject?.name}!`
      );
    });
  };

  const handleSubmitForApproval = () => {
    if (
      !confirm(
        `Submit all ${classStudents.length} student scores for ${currentSubject?.name} to the Principal for verification and approval?`
      )
    ) {
      return;
    }

    setSuccessMsg(null);
    startTransition(async () => {
      // 1. Ensure latest scores are saved
      const recordsToSave = classStudents.map((st) => {
        const item = scoreMap[st.id] || { caScore: 0, examScore: 0 };
        return {
          studentId: st.id,
          caScore: item.caScore,
          examScore: item.examScore,
        };
      });
      await saveBatchScoresAction(selectedClassId, selectedSubjectId, recordsToSave);

      // 2. Transition batch to PENDING_APPROVAL
      await submitScoresForApprovalAction(selectedClassId, selectedSubjectId);
      setSuccessMsg(
        `Successfully submitted all ${classStudents.length} scores for Admin verification!`
      );
    });
  };

  const handleAutoFillSampleScores = () => {
    const newMap: Record<string, { caScore: number; examScore: number }> = {};
    classStudents.forEach((st, idx) => {
      const ca = idx === 0 ? 38 : Math.min(40, 24 + ((idx * 7) % 16));
      const exam = idx === 0 ? 58 : Math.min(60, 36 + ((idx * 9) % 24));
      newMap[st.id] = { caScore: ca, examScore: exam };
    });
    setScoreMap(newMap);
    setSuccessMsg(`Auto-filled realistic term scores across all 50 students! Click "Save Draft" or "Submit for Approval".`);
  };

  return (
    <div className="space-y-6 w-full">
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-sm flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="font-semibold">{successMsg}</span>
          </div>
          <button
            onClick={() => setSuccessMsg(null)}
            className="text-xs text-emerald-700 dark:text-emerald-400 underline font-semibold cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Selector Card */}
      <Card>
        <CardBody className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Assigned Class
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
                    {c.name} ({classStudents.length} Students) &bull; {c.level}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Assigned Subject
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

      {/* Action Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors">
        <div>
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {currentSubject?.name} &bull; {currentClass?.name} ({classStudents.length} Students)
            </h3>
            <StatusBadge status={batchStatus} />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Session: 2024/2025 (1st Term) &bull; Grading Standard: Universal Basic Education / WAEC
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {!isLocked ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleAutoFillSampleScores}
                className="text-xs font-semibold"
                title="Fill realistic sample scores for all 50 students in 1 click"
              >
                <Sparkles className="w-3.5 h-3.5 mr-1 text-[#FF1313]" />
                Auto-Fill Sample Scores
              </Button>
              <Button
                variant="secondary"
                size="sm"
                isLoading={isPending}
                onClick={handleSaveAllScores}
                className="font-semibold text-xs"
              >
                <Save className="w-3.5 h-3.5 mr-1" />
                Save Draft
              </Button>
              <Button
                variant="primary"
                size="sm"
                isLoading={isPending}
                onClick={handleSubmitForApproval}
                className="font-bold shadow-sm bg-[#FF1313] hover:bg-[#D60A0A]"
              >
                <Send className="w-4 h-4 mr-1.5" />
                Submit All 50 Scores for Approval
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-2 text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700">
              <Lock className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              <span>
                {batchStatus === 'PENDING_APPROVAL'
                  ? 'All 50 Scores Submitted & Locked Awaiting Admin Approval'
                  : 'Scores Approved & Published to Parents'}
              </span>
            </div>
          )}
        </div>
      </div>

      {batchStatus === 'PENDING_APPROVAL' && (
        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/80 rounded-xl p-4 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-3">
          <Info className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong className="block font-bold">Waiting for Admin Verification:</strong>
            These 50 student scores are now waiting in the Admin Approval Queue. Switch to the <strong>Admin role</strong> in the top bar to approve and publish!
          </div>
        </div>
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

        <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
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

      {/* 50-Student Score Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800 text-[11px] font-bold uppercase text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800 tracking-wider">
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Admission No</th>
                <th className="py-3 px-4">Student Full Name</th>
                <th className="py-3 px-4 text-center w-32">CA Score (40)</th>
                <th className="py-3 px-4 text-center w-32">Exam Score (60)</th>
                <th className="py-3 px-4 text-center">Total (100)</th>
                <th className="py-3 px-4 text-center">Grade</th>
                <th className="py-3 px-4">Educator Remark</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {paginatedStudents.map((st, idx) => {
                const overallIndex = (currentPage - 1) * pageSize + idx + 1;
                const item = scoreMap[st.id] || { caScore: 30, examScore: 45 };
                const total = item.caScore + item.examScore;
                const { grade, remark } = calculateGrade(total);
                const existingResult = currentResults.find((r) => r.studentId === st.id);

                return (
                  <tr key={st.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3 px-4 text-xs font-semibold text-slate-400 dark:text-slate-500">{overallIndex}</td>
                    <td className="py-3 px-4 font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
                      {st.admissionNo}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                      {st.fullName}
                      {st.firstName === 'Zainab' && (
                        <span className="ml-2 text-[10px] font-bold bg-[#FF1313]/10 dark:bg-[#FF1313]/25 text-[#FF1313] px-2 py-0.5 rounded">
                          Demo Ward
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <input
                        type="number"
                        min="0"
                        max="40"
                        disabled={isLocked}
                        value={item.caScore}
                        onChange={(e) => handleScoreChange(st.id, 'caScore', e.target.value)}
                        className="w-20 text-center font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-1.5 focus:ring-2 focus:ring-[#FF1313] disabled:bg-slate-100 dark:disabled:bg-slate-900 disabled:text-slate-500 dark:disabled:text-slate-400"
                      />
                    </td>
                    <td className="py-3 px-4 text-center">
                      <input
                        type="number"
                        min="0"
                        max="60"
                        disabled={isLocked}
                        value={item.examScore}
                        onChange={(e) => handleScoreChange(st.id, 'examScore', e.target.value)}
                        className="w-20 text-center font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-1.5 focus:ring-2 focus:ring-[#FF1313] disabled:bg-slate-100 dark:disabled:bg-slate-900 disabled:text-slate-500 dark:disabled:text-slate-400"
                      />
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-base text-slate-900 dark:text-white">
                      {total}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded text-xs font-bold ${grade === 'A'
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                          : grade === 'B'
                            ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300'
                            : grade === 'C'
                              ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                              : 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300'
                          }`}
                      >
                        {grade}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs font-medium text-slate-700 dark:text-slate-300">{remark}</td>
                    <td className="py-3 px-4 text-center">
                      <StatusBadge status={existingResult?.status || batchStatus} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
