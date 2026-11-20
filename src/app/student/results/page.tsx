import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { requireRole } from '@/lib/auth';
import { getDatabase } from '@/lib/data-store';
import { PortalLayout } from '@/components/layout/PortalLayout';
import { Card } from '@/components/ui/Card';
import { CheckCircle2, Clock, ShieldCheck, ExternalLink } from 'lucide-react';
import { CertificateQRCode } from '@/components/ui/CertificateQRCode';
import { generateCertificateId } from '@/lib/verification';

export default async function StudentResultsPage() {
  const session = await requireRole(['STUDENT']);
  const db = getDatabase();

  const student = db.students.find((s) => s.userId === session.userId) || db.students[0];
  const studentClass = db.classes.find((c) => c.id === student.classId);
  const classTeacher = db.teachers.find((t) => t.id === studentClass?.classTeacherId);

  // Student results (published only)
  const publishedResults = db.results.filter(
    (r) => r.studentId === student.id && r.status === 'PUBLISHED'
  );

  const classSubjects = db.subjects.filter((s) => s.classId === student.classId);
  const unpublishedSubjects = classSubjects.filter(
    (sub) => !publishedResults.some((r) => r.subjectId === sub.id)
  );

  const totalPoints = publishedResults.reduce((acc, r) => acc + r.totalScore, 0);
  const averageScore =
    publishedResults.length > 0 ? (totalPoints / publishedResults.length).toFixed(1) : 'N/A';

  return (
    <PortalLayout session={session}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200 dark:border-slate-800">
          <div>
            <h1 className="text-2xl font-serif font-bold text-stone-900 dark:text-white">
              Official Academic Transcript
            </h1>
            <p className="text-xs text-stone-500 dark:text-slate-400 mt-1">
              Termly Continuous Assessment & Examination Performance &bull; Session 2024/2025
            </p>
          </div>
          <div className="text-xs bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40 px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Verified by Academic Directorate</span>
          </div>
        </div>

        {/* Report Card Frame */}
        <Card className="border-[#FF1313]/30 dark:border-slate-800 shadow-md overflow-hidden bg-white dark:bg-slate-900">
          <div className="bg-[#FF1313] text-white p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center p-1 shadow-md shrink-0">
                  <Image
                    src="/logo-transparent.png"
                    alt="Valencia Schools Official Crest"
                    width={48}
                    height={44}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h2 className="font-serif font-bold text-lg">Valencia Schools</h2>
                  <p className="text-xs text-stone-200">Official Student Performance Certificate</p>
                </div>
              </div>
              <span className="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full">
                {studentClass?.name} &bull; 1st Term
              </span>
            </div>
          </div>

          <div className="p-4 bg-stone-50 dark:bg-slate-800/60 border-b border-stone-200 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-stone-400 dark:text-slate-400 font-semibold block text-[10px] uppercase">Student Name</span>
              <strong className="text-stone-900 dark:text-white">{student.fullName}</strong>
            </div>
            <div>
              <span className="text-stone-400 dark:text-slate-400 font-semibold block text-[10px] uppercase">Admission No</span>
              <span className="font-mono font-bold text-stone-800 dark:text-slate-200">{student.admissionNo}</span>
            </div>
            <div>
              <span className="text-stone-400 dark:text-slate-400 font-semibold block text-[10px] uppercase">Term Average</span>
              <strong className="text-[#FF1313]">{averageScore}%</strong>
            </div>
            <div>
              <span className="text-stone-400 dark:text-slate-400 font-semibold block text-[10px] uppercase">Class Educator</span>
              <span className="text-stone-800 dark:text-slate-200">{classTeacher?.fullName}</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-stone-50 dark:bg-slate-800 text-[11px] font-bold uppercase text-stone-500 dark:text-slate-300 border-b border-stone-200 dark:border-slate-800 tracking-wider">
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4">Code</th>
                  <th className="py-3 px-4 text-center">CA Score (40)</th>
                  <th className="py-3 px-4 text-center">Exam Score (60)</th>
                  <th className="py-3 px-4 text-center">Total (100)</th>
                  <th className="py-3 px-4 text-center">Grade</th>
                  <th className="py-3 px-4">Teacher Remark</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-slate-800">
                {publishedResults.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-xs text-stone-400 dark:text-slate-500">
                      No published results available yet.
                    </td>
                  </tr>
                ) : (
                  publishedResults.map((r) => {
                    const sub = classSubjects.find((s) => s.id === r.subjectId);
                    return (
                      <tr key={r.id} className="hover:bg-stone-50/80 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="py-3 px-4 font-bold text-stone-900 dark:text-white">{sub?.name || 'Subject'}</td>
                        <td className="py-3 px-4 font-mono text-xs text-stone-500 dark:text-slate-400">{sub?.code}</td>
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

          {unpublishedSubjects.length > 0 && (
            <div className="p-4 bg-amber-50/60 dark:bg-amber-950/40 border-t border-amber-200/70 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong>Note:</strong> Some enrolled subjects are still undergoing grading moderation by your teachers.
                They will appear here once approved by the Principal.
              </span>
            </div>
          )}

          {/* Official Registry Hologram & QR Verification Strip */}
          <div className="p-6 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 print:border-t-2">
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Central Academic Registry Verification</span>
                <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50 px-2 py-0.5 rounded font-bold uppercase">
                  Digital Seal Active
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed max-w-lg">
                Your transcript is cryptographically registered. Anyone inspecting this document (embassies, scholarship committees, transfer schools) can verify its authenticity by scanning the QR code with any smartphone.
              </p>
              <div className="pt-1 flex items-center gap-3">
                <Link
                  href={`/verify/${generateCertificateId(student.admissionNo)}`}
                  target="_blank"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF1313] hover:underline"
                >
                  <span>Open Public Authenticity Record</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
                <span className="text-slate-300 dark:text-slate-600">|</span>
                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                  Document ID: {generateCertificateId(student.admissionNo)}
                </span>
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-4 bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
              <CertificateQRCode certificateId={generateCertificateId(student.admissionNo)} size={88} showDetails={false} />
              <div className="text-left text-xs">
                <span className="block font-bold text-slate-900 dark:text-white text-xs">Scan to Verify</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Valencia Registry</span>
                <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold block mt-1">Tamper-Proof</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </PortalLayout>
  );
}
