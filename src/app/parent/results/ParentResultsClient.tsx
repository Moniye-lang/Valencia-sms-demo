'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Student, ClassRoom, Teacher, Subject, ResultRecord } from '@/lib/types';
import { Card } from '@/components/ui/Card';
import { ShieldAlert, CheckCircle2, Clock, ShieldCheck, ExternalLink } from 'lucide-react';
import { CertificateQRCode } from '@/components/ui/CertificateQRCode';
import { generateCertificateId } from '@/lib/verification';

interface ParentResultsClientProps {
  childrenList: Student[];
  activeStudent: Student;
  studentClass?: ClassRoom;
  classTeacher?: Teacher;
  classSubjects: Subject[];
  studentResults: ResultRecord[];
  wasSecurityDenied?: boolean;
}

export default function ParentResultsClient({
  childrenList,
  activeStudent,
  studentClass,
  classTeacher,
  classSubjects,
  studentResults,
  wasSecurityDenied,
}: ParentResultsClientProps) {
  const router = useRouter();

  // Published results only
  const publishedResults = studentResults.filter((r) => r.status === 'PUBLISHED');
  const unpublishedSubjects = classSubjects.filter(
    (sub) => !publishedResults.some((r) => r.subjectId === sub.id)
  );

  // Compute GPA / Average of published subjects
  const totalScoreSum = publishedResults.reduce((acc, r) => acc + r.totalScore, 0);
  const termAverage =
    publishedResults.length > 0 ? (totalScoreSum / publishedResults.length).toFixed(1) : 'N/A';

  return (
    <div className="space-y-6">
      {/* Security alert if parent tried URL tampering */}
      {wasSecurityDenied && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200 text-xs font-semibold flex items-center gap-3">
          <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
          <span>
            <strong>Security Boundary Enforced:</strong> You requested a student profile outside your authorized family records.
            The server prevented unauthorized viewing and returned you to your enrolled ward.
          </span>
        </div>
      )}

      {/* Child Switcher Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-serif font-bold text-stone-900 dark:text-white">Academic Report Card</h1>
          <p className="text-xs text-stone-500 dark:text-slate-400 mt-1">
            Official termly continuous assessment and examination transcripts
          </p>
        </div>

        {/* Child Switcher */}
        <div className="flex items-center gap-2 bg-stone-100 dark:bg-slate-800 p-1 rounded-xl border border-stone-200 dark:border-slate-700">
          <span className="text-[11px] font-bold uppercase text-stone-500 dark:text-slate-400 px-2">Select Ward:</span>
          {childrenList.map((child) => {
            const isSelected = child.id === activeStudent.id;
            return (
              <button
                key={child.id}
                onClick={() => router.push(`/parent/results?studentId=${child.id}`)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${isSelected
                    ? 'bg-[#FF1313] text-white shadow-xs'
                    : 'text-stone-700 dark:text-slate-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-200 dark:hover:bg-slate-700'
                  }`}
              >
                {child.firstName} ({child.admissionNo.split('/')[2] || 'Ward'})
              </button>
            );
          })}
        </div>
      </div>

      {/* Official School Report Card Header */}
      <Card className="border-[#FF1313]/30 dark:border-slate-800 shadow-md overflow-hidden bg-white dark:bg-slate-900">
        <div className="bg-[#FF1313] text-white p-6 relative">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center p-1 shadow-md shrink-0">
                <Image
                  src="/logo-transparent.png"
                  alt="Valencia Schools Official Crest"
                  width={56}
                  height={50}
                  priority
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h2 className="font-serif font-bold text-xl tracking-tight">Valencia Schools</h2>
                <p className="text-xs text-stone-200">Continuous Assessment & Terminal Evaluation Transcript</p>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <span className="inline-block bg-white/20 backdrop-blur-xs text-white text-xs font-semibold px-3 py-1 rounded-full">
                2024/2025 Academic Session &bull; 1st Term
              </span>
            </div>
          </div>
        </div>

        {/* Student Bio Strip */}
        <div className="p-5 bg-stone-50/80 dark:bg-slate-800/60 border-b border-stone-200 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-stone-400 dark:text-slate-400 font-semibold block text-[10px] uppercase">Student Full Name</span>
            <strong className="text-stone-900 dark:text-white text-sm">{activeStudent.fullName}</strong>
          </div>
          <div>
            <span className="text-stone-400 dark:text-slate-400 font-semibold block text-[10px] uppercase">Admission Number</span>
            <span className="font-mono font-bold text-stone-800 dark:text-slate-200">{activeStudent.admissionNo}</span>
          </div>
          <div>
            <span className="text-stone-400 dark:text-slate-400 font-semibold block text-[10px] uppercase">Current Classroom</span>
            <strong className="text-stone-900 dark:text-white">{studentClass?.name || 'Class'}</strong>
          </div>
          <div>
            <span className="text-stone-400 dark:text-slate-400 font-semibold block text-[10px] uppercase">Class Educator</span>
            <span className="text-stone-800 dark:text-slate-200 font-medium">{classTeacher?.fullName || 'Assigned Educator'}</span>
          </div>
        </div>

        {/* Performance Scoreboard */}
        <div className="p-5 grid grid-cols-1 sm:grid-cols-3 gap-4 border-b border-stone-100 dark:border-slate-800">
          <div className="p-4 rounded-xl bg-[#FAF8F5] dark:bg-slate-800/40 border border-stone-200 dark:border-slate-700 text-center">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-slate-400">
              Published Subjects
            </span>
            <p className="text-2xl font-bold text-stone-900 dark:text-white mt-1">{publishedResults.length}</p>
            <span className="text-[10px] text-stone-400 dark:text-slate-500">of {classSubjects.length} enrolled subjects</span>
          </div>

          <div className="p-4 rounded-xl bg-[#FAF8F5] dark:bg-slate-800/40 border border-stone-200 dark:border-slate-700 text-center">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-slate-400">
              Cumulative Average
            </span>
            <p className="text-2xl font-bold text-[#FF1313] mt-1">{termAverage}%</p>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">Standard: Distinction</span>
          </div>

          <div className="p-4 rounded-xl bg-[#FAF8F5] dark:bg-slate-800/40 border border-stone-200 dark:border-slate-700 text-center">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-slate-400">
              Administrative Status
            </span>
            <div className="mt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                Verified & Published
              </span>
            </div>
          </div>
        </div>

        {/* Published Results Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-stone-50 dark:bg-slate-800 text-[11px] font-bold uppercase text-stone-500 dark:text-slate-300 border-b border-stone-200 dark:border-slate-800 tracking-wider">
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4">Subject Code</th>
                <th className="py-3 px-4 text-center">CA Score (40)</th>
                <th className="py-3 px-4 text-center">Exam Score (60)</th>
                <th className="py-3 px-4 text-center">Total (100)</th>
                <th className="py-3 px-4 text-center">Grade</th>
                <th className="py-3 px-4">Educator Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-slate-800">
              {publishedResults.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-xs text-stone-400 dark:text-slate-500">
                    No results published for this term yet.
                  </td>
                </tr>
              ) : (
                publishedResults.map((r) => {
                  const subject = classSubjects.find((s) => s.id === r.subjectId);
                  return (
                    <tr key={r.id} className="hover:bg-stone-50/80 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="py-3 px-4 font-bold text-stone-900 dark:text-white">{subject?.name || 'Subject'}</td>
                      <td className="py-3 px-4 font-mono text-xs text-stone-500 dark:text-slate-400">{subject?.code}</td>
                      <td className="py-3 px-4 text-center font-medium text-stone-700 dark:text-slate-300">{r.caScore}</td>
                      <td className="py-3 px-4 text-center font-medium text-stone-700 dark:text-slate-300">{r.examScore}</td>
                      <td className="py-3 px-4 text-center font-bold text-stone-900 dark:text-white text-base">
                        {r.totalScore}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded text-xs font-bold ${r.grade === 'A'
                              ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                              : r.grade === 'B'
                                ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300'
                                : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                            }`}
                        >
                          {r.grade}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-xs text-stone-700 dark:text-slate-300 font-medium">{r.remark}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Unpublished Notice */}
        {unpublishedSubjects.length > 0 && (
          <div className="p-4 bg-amber-50/60 dark:bg-amber-950/40 border-t border-amber-200/70 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-3">
            <Clock className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold">Awaiting Administrative Moderation:</strong>
              The following subjects ({unpublishedSubjects.map((s) => s.name).join(', ')}) are currently
              being finalized by the teaching faculty and verified by the School Principal. They will be
              automatically added to this report card once published.
            </div>
          </div>
        )}

        {/* Signatures & Accreditation Footer */}
        <div className="p-6 bg-stone-50/60 dark:bg-slate-800/60 border-t border-stone-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          <div>
            <span className="text-[10px] font-bold uppercase text-stone-400 dark:text-slate-400 block mb-1">
              Class Teacher Comment
            </span>
            <p className="text-stone-700 dark:text-slate-300 italic">
              &ldquo;{activeStudent.firstName} demonstrates exemplary academic diligence and classroom leadership.&rdquo;
            </p>
            <p className="text-[11px] font-semibold text-stone-900 dark:text-white mt-2">
              Signed: {classTeacher?.fullName || 'Educator'}
            </p>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase text-stone-400 dark:text-slate-400 block mb-1">
              Principal&apos;s Endorsement
            </span>
            <p className="text-stone-700 dark:text-slate-300 italic">
              &ldquo;Approved for record & promotion tracking. Outstanding performance.&rdquo;
            </p>
            <p className="text-[11px] font-semibold text-stone-900 dark:text-white mt-2">
              Signed: Dr. (Mrs.) Folashade Valencia (Principal)
            </p>
          </div>
        </div>

        {/* Live Cryptographic QR Verification Stamp */}
        <div className="p-6 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 print:border-t-2">
          <div className="space-y-1.5 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Public Registry Anti-Tamper Verification</span>
              <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50 px-2 py-0.5 rounded font-bold uppercase">
                Active Guarantee
              </span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed max-w-lg">
              This academic transcript is sealed with a digital security fingerprint. Any third party, university, or foreign embassy can verify its authenticity instantly by pointing any smartphone camera at the QR code.
            </p>
            <div className="pt-1 flex items-center gap-3">
              <Link
                href={`/verify/${generateCertificateId(activeStudent.admissionNo)}`}
                target="_blank"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF1313] hover:underline"
              >
                <span>Inspect Live Verification Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
              <span className="text-slate-300 dark:text-slate-600">|</span>
              <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                Code: {generateCertificateId(activeStudent.admissionNo)}
              </span>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-4 bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
            <CertificateQRCode certificateId={generateCertificateId(activeStudent.admissionNo)} size={88} showDetails={false} />
            <div className="text-left text-xs">
              <span className="block font-bold text-slate-900 dark:text-white text-xs">Scan with Camera</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Valencia Central Registry</span>
              <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold block mt-1">Official Digital Seal</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
