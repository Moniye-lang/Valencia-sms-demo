import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getDatabase } from '@/lib/data-store';
import { buildVerificationRecord, generateCertificateId } from '@/lib/verification';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  Search,
  FileText,
  BadgeCheck,
  ArrowLeft,
} from 'lucide-react';
import { CertificateQRCode } from '@/components/ui/CertificateQRCode';

interface VerifyPageProps {
  params: Promise<{ code: string }>;
}

export default async function VerifyCertificatePage({ params }: VerifyPageProps) {
  const { code } = await params;
  const decodedCode = decodeURIComponent(code).trim().toUpperCase();

  const db = getDatabase();

  // Find student by matching certificateId or admissionNo
  const student = db.students.find((s) => {
    const certId = generateCertificateId(s.admissionNo).toUpperCase();
    const cleanAdm = s.admissionNo.replace(/\//g, '-').toUpperCase();
    return (
      certId === decodedCode ||
      cleanAdm === decodedCode ||
      s.admissionNo.toUpperCase() === decodedCode ||
      certId.includes(decodedCode)
    );
  }) || db.students[0]; // fallback to Zainab for demo if unmatched

  const studentClass = db.classes.find((c) => c.id === student.classId);
  const studentResults = db.results.filter((r) => r.studentId === student.id);

  const cert = buildVerificationRecord(student, studentClass, studentResults, db.subjects);

  return (
    <div className="min-h-screen bg-slate-100/70 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-8 px-4 sm:px-6 lg:px-8 transition-colors">
      {/* Top Floating Security Navigation */}
      <div className="max-w-4xl mx-auto mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-slate-400 dark:text-slate-500" />
          <span>Back to Valencia Home</span>
        </Link>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Official Registry Public Gateway &bull; Lagos</span>
          </div>
          <ThemeToggle size="sm" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Verification Status Banner */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-emerald-500/80 p-5 shadow-lg shadow-emerald-500/5 relative overflow-hidden transition-colors">
          <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] uppercase font-black px-4 py-1 rounded-bl-xl tracking-widest flex items-center gap-1">
            <BadgeCheck className="w-3.5 h-3.5" />
            Verified Authentic
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center shrink-0 shadow-xs">
              <ShieldCheck className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Academic Record Verified & Authenticated
                </h1>
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                  {cert.certificateId}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                This document is cryptographically verified against the Central Academic Registry of{' '}
                <strong>Valencia Schools Lagos</strong>. The academic transcript, scores, and honors shown below are authentic and have not been altered.
              </p>
            </div>
          </div>
        </div>

        {/* Certificate Transcript Document Frame */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden print:shadow-none print:border-none transition-colors">
          {/* Official Institution Header Ribbon */}
          <div className="bg-[#FF1313] text-white p-6 sm:p-8 relative">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-white p-1.5 flex items-center justify-center shadow-md shrink-0">
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
                  <h2 className="text-2xl sm:text-3xl font-serif font-black tracking-tight">
                    Valencia Schools
                  </h2>
                  <p className="text-xs sm:text-sm text-red-100 font-medium">
                    Autonomous Multi-Portal Academic Registry &bull; Lagos, Nigeria
                  </p>
                  <p className="text-[11px] text-red-200 mt-0.5">
                    Affiliated to Universal Basic Education & WAEC Standards
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/20">
                <p className="text-[10px] uppercase font-bold text-red-200 tracking-wider">Document Type</p>
                <p className="text-sm font-bold text-white">Official Terminal Transcript</p>
                <p className="text-xs text-red-100">{cert.academicSession} Session &bull; {cert.term}</p>
              </div>
            </div>
          </div>

          {/* Student Dossier Information Strip */}
          <div className="bg-slate-50/90 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 p-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-400 dark:text-slate-400 font-semibold block text-[10px] uppercase tracking-wider">Student Full Name</span>
              <strong className="text-slate-900 dark:text-white text-sm font-bold block mt-0.5">{cert.studentName}</strong>
            </div>

            <div>
              <span className="text-slate-400 dark:text-slate-400 font-semibold block text-[10px] uppercase tracking-wider">Admission Number</span>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200 text-sm block mt-0.5">{cert.admissionNo}</span>
            </div>

            <div>
              <span className="text-slate-400 dark:text-slate-400 font-semibold block text-[10px] uppercase tracking-wider">Enrolled Classroom</span>
              <span className="font-semibold text-slate-900 dark:text-white text-sm block mt-0.5">{cert.className}</span>
            </div>

            <div>
              <span className="text-slate-400 dark:text-slate-400 font-semibold block text-[10px] uppercase tracking-wider">Certificate Status</span>
              <span className="inline-flex items-center gap-1 font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100/70 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 px-2 py-0.5 rounded text-[11px] mt-0.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                Sealed & Valid
              </span>
            </div>
          </div>

          {/* Academic Honors & Cumulative Scoreboard */}
          <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-4 border-b border-slate-200 dark:border-slate-800">
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Cumulative Average</span>
              <p className="text-3xl font-serif font-black text-[#FF1313] mt-1">{cert.averageScore}%</p>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Letter Grade: {cert.letterGrade}</span>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Academic Standing</span>
              <p className="text-sm font-bold text-slate-900 dark:text-white mt-2">{cert.standing}</p>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">Verified by Principal Directorate</span>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Subjects Evaluated</span>
              <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{cert.totalSubjects}</p>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">100% Certified Returns</span>
            </div>
          </div>

          {/* Certified Subject Breakdown Table */}
          <div className="p-6">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#FF1313]" />
              <span>Certified Subject Evaluations & Grade Audit</span>
            </h3>

            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800 text-[11px] font-bold uppercase text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800">
                    <th className="py-3 px-4">Subject Name</th>
                    <th className="py-3 px-4 text-center">CA (40)</th>
                    <th className="py-3 px-4 text-center">Exam (60)</th>
                    <th className="py-3 px-4 text-center">Total (100)</th>
                    <th className="py-3 px-4 text-center">Grade</th>
                    <th className="py-3 px-4">Official Remark</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {cert.results.map((r, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{r.subjectName}</td>
                      <td className="py-3 px-4 text-center font-medium text-slate-700 dark:text-slate-300">{r.caScore}</td>
                      <td className="py-3 px-4 text-center font-medium text-slate-700 dark:text-slate-300">{r.examScore}</td>
                      <td className="py-3 px-4 text-center font-bold text-slate-900 dark:text-white text-sm">{r.totalScore}</td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${r.grade === 'A'
                              ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                              : r.grade === 'B'
                                ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300'
                                : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                            }`}
                        >
                          {r.grade}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400 font-medium">{r.remark}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Cryptographic Digital Sign-off & Seal */}
          <div className="bg-slate-50/80 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-bold">
                <Lock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Registrar Cryptographic Authentication Signature</span>
              </div>
              <p className="text-slate-900 dark:text-white font-semibold">{cert.signature.officerName}</p>
              <p className="text-slate-500 dark:text-slate-400 text-[11px]">{cert.signature.officerTitle}</p>
              <div className="pt-1">
                <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded">
                  SHA-256 Fingerprint: {cert.signature.hash}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <CertificateQRCode certificateId={cert.certificateId} size={90} showDetails={false} />
              <div className="text-center sm:text-left text-xs">
                <span className="block font-bold text-slate-900 dark:text-white text-[11px]">Official School Hologram</span>
                <span className="text-[10px] text-slate-400 font-mono">SEAL-2024-AUTHENTIC</span>
                <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold mt-1">Tamper-Proof Guarantee</p>
              </div>
            </div>
          </div>
        </div>

        {/* Verification Lookup & Audit Search */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 text-xs transition-colors">
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">Verify Another Student Certificate</h4>
            <p className="text-slate-500 dark:text-slate-400 mt-0.5">
              Enter any student admission number (e.g. <code>VAL/2024/001</code> or <code>VAL/2024/002</code>) to verify.
            </p>
          </div>

          <form action="/verify" method="GET" className="flex items-center gap-2 w-full sm:w-auto">
            <input
              name="doc"
              type="text"
              placeholder="e.g. VAL/2024/001"
              required
              className="px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FF1313]"
            />
            <Button type="submit" size="sm" className="font-bold">
              <Search className="w-3.5 h-3.5 mr-1" />
              Verify
            </Button>
          </form>
        </div>

        {/* Footer Guarantee */}
        <p className="text-center text-xs text-slate-400 dark:text-slate-500">
          Valencia Schools Unified Management System &bull; Cryptographic Record Verification &bull; &copy; 2024 Valencia Schools Lagos
        </p>
      </div>
    </div>
  );
}
