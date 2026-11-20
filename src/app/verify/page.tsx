import React from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getDatabase } from '@/lib/data-store';
import { generateCertificateId } from '@/lib/verification';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import {
  ShieldCheck,
  Search,
  Lock,
  ArrowRight,
  QrCode,
  Building2,
  BadgeCheck,
} from 'lucide-react';

interface VerifyIndexProps {
  searchParams: Promise<{ doc?: string }>;
}

export default async function VerifyIndexPage({ searchParams }: VerifyIndexProps) {
  const params = await searchParams;
  if (params.doc) {
    const cleanDoc = params.doc.trim().replace(/\//g, '-');
    redirect(`/verify/${encodeURIComponent(cleanDoc)}`);
  }

  const db = getDatabase();

  const sampleStudents = [
    {
      student: db.students[0], // Zainab Musa
      tag: 'Junior Secondary (JSS 2A)',
      honors: 'Distinction (96.0%)',
    },
    {
      student: db.students[1], // Chidi Musa
      tag: 'Primary Section (Primary 4A)',
      honors: 'First Class Academic Merit',
    },
    {
      student: db.students[2], // Chukwudi Okafor
      tag: 'Junior Secondary (JSS 2A)',
      honors: 'Satisfactory Progression',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-12 px-4 sm:px-6 lg:px-8 relative transition-colors">
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
        <ThemeToggle showLabel size="md" />
      </div>

      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header Branding */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center mb-1">
            <Image
              src="/logo-transparent.png"
              alt="Valencia Schools Official Crest"
              width={88}
              height={78}
              priority
              className="w-20 h-auto object-contain drop-shadow-md"
            />
          </div>
          <h1 className="text-3xl font-serif font-black text-slate-900 dark:text-white tracking-tight">
            Valencia Schools Public Verification Gateway
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
            Central Academic Record Authentication Registry &bull; Lagos, Nigeria
          </p>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 text-xs font-bold">
            <BadgeCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Official Anti-Tamper Protocol Active</span>
          </div>
        </div>

        {/* Search Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl dark:shadow-black/40 p-6 sm:p-8 space-y-6 transition-colors">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Verify Official Academic Transcript or Certificate
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Enter the student admission number or document verification code printed on the physical or digital report card.
            </p>
          </div>

          <form action="/verify" method="GET" className="space-y-4">
            <div className="relative">
              <Search className="w-5 h-5 text-slate-400 dark:text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="text"
                name="doc"
                required
                placeholder="e.g. VAL/2024/001 or VAL-2024-001-T1"
                className="w-full pl-11 pr-4 py-3 text-sm border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-[#FF1313] dark:focus:border-[#FF1313] focus:ring-2 focus:ring-[#FF1313]/20 font-mono text-slate-900 dark:text-white bg-white dark:bg-slate-800 placeholder-slate-400 dark:placeholder-slate-500 font-semibold"
              />
            </div>

            <Button type="submit" className="w-full py-3 text-sm font-bold shadow-sm">
              <ShieldCheck className="w-4 h-4 mr-2" />
              Verify Authenticity in Registry
            </Button>
          </form>

          {/* Quick Demo Verification Cards */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
              Instant 1-Click Verification Examples:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {sampleStudents.map((item) => {
                if (!item.student) return null;
                const certId = generateCertificateId(item.student.admissionNo);
                return (
                  <Link
                    key={item.student.id}
                    href={`/verify/${certId}`}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-[#FF1313] dark:hover:border-[#FF1313] hover:bg-slate-50/80 dark:hover:bg-slate-800/80 transition-all text-left block group bg-white dark:bg-slate-850 shadow-2xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white text-xs group-hover:text-[#FF1313] transition-colors">
                        {item.student.fullName}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 group-hover:text-[#FF1313] transition-all" />
                    </div>
                    <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400 mt-0.5">{item.student.admissionNo}</p>
                    <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold mt-1">{item.honors}</p>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Security Matrix Features */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 shadow-2xs">
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold mb-2">
              <QrCode className="w-4 h-4" />
            </div>
            <strong className="text-slate-900 dark:text-white block mb-0.5">Live Scannable QR</strong>
            <p className="text-slate-500 dark:text-slate-400 text-[11px]">
              Every official transcript features a machine-readable cryptographic QR code for instant camera verification.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 shadow-2xs">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold mb-2">
              <Lock className="w-4 h-4" />
            </div>
            <strong className="text-slate-900 dark:text-white block mb-0.5">SHA-256 Anti-Tamper</strong>
            <p className="text-slate-500 dark:text-slate-400 text-[11px]">
              Scores and grade averages are digitally signed by the Registrar, preventing grade tampering or forgery.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 shadow-2xs">
            <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold mb-2">
              <Building2 className="w-4 h-4" />
            </div>
            <strong className="text-slate-900 dark:text-white block mb-0.5">Embassy & Transfer Ready</strong>
            <p className="text-slate-500 dark:text-slate-400 text-[11px]">
              Accepted by embassies, scholarship boards, and international schools worldwide without physical attestation.
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 dark:text-slate-500">
          Valencia Schools Unified Management System &bull; &copy; 2024 Valencia Schools Lagos
        </p>
      </div>
    </div>
  );
}
