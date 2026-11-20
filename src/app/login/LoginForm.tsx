'use client';

import React, { useState, useTransition } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { loginAction, switchDemoRoleAction } from '@/lib/actions';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { Shield, GraduationCap, Users, UserCheck, Lock, Mail, ArrowRight, Sparkles, HelpCircle } from 'lucide-react';
import { Role } from '@/lib/types';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);

    startTransition(async () => {
      const res = await loginAction(null, formData);
      if (res?.error) {
        setError(res.error);
      }
    });
  };

  const handleQuickLogin = (role: Role, prefillEmail: string, prefillPass: string) => {
    setEmail(prefillEmail);
    setPassword(prefillPass);
    startTransition(async () => {
      await switchDemoRoleAction(role);
    });
  };

  const demoAccounts = [
    {
      role: 'ADMIN' as Role,
      title: 'Administrator',
      name: 'Dr. (Mrs.) Folashade Valencia',
      email: 'admin@valencia.edu.ng',
      pass: 'admin123',
      icon: <Shield className="w-5 h-5 text-[#FF1313]" />,
      desc: 'Full school oversight, 50-student approvals & publishing',
    },
    {
      role: 'TEACHER' as Role,
      title: 'Teacher',
      name: 'Mr. Babatunde Adeleke',
      email: 'teacher@valencia.edu.ng',
      pass: 'teacher123',
      icon: <GraduationCap className="w-5 h-5 text-blue-500" />,
      desc: 'JSS 2A Mathematics (50 students) & score submission',
    },
    {
      role: 'PARENT' as Role,
      title: 'Parent / Guardian',
      name: 'Alhaji Ibrahim Musa',
      email: 'parent@valencia.edu.ng',
      pass: 'parent123',
      icon: <Users className="w-5 h-5 text-teal-500" />,
      desc: 'Wards: Zainab Musa (JSS 2A) & Chidi Musa (Primary 4A)',
    },
    {
      role: 'STUDENT' as Role,
      title: 'Student',
      name: 'Zainab Musa',
      email: 'student@valencia.edu.ng',
      pass: 'student123',
      icon: <UserCheck className="w-5 h-5 text-purple-500" />,
      desc: 'JSS 2A Transcript, Weekly Timetable & Notice Board',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative transition-colors">
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
        <ThemeToggle showLabel size="md" />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center mb-3">
          <Image
            src="/logo-transparent.png"
            alt="Valencia Schools Official Crest"
            width={96}
            height={85}
            priority
            className="w-24 h-auto object-contain drop-shadow-md"
          />
        </div>
        <h2 className="text-3xl font-serif font-bold text-slate-900 dark:text-white tracking-tight">
          Valencia Schools
        </h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 font-medium">
          Unified Multi-Portal School Management System &bull; Lagos
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-white dark:bg-slate-900 py-8 px-6 shadow-xl shadow-slate-200/60 dark:shadow-black/40 sm:rounded-2xl border border-slate-200 dark:border-slate-800 sm:px-10 transition-colors">
          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3.5 rounded-lg bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800/60 text-rose-800 dark:text-rose-300 text-xs font-semibold">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <div className="relative rounded-lg shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. admin@valencia.edu.ng"
                  className="block w-full pl-10 pr-3 py-2.5 text-sm border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF1313] focus:border-transparent text-slate-900 dark:text-white bg-white dark:bg-slate-800 placeholder-slate-400 dark:placeholder-slate-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative rounded-lg shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                  className="block w-full pl-10 pr-3 py-2.5 text-sm border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF1313] focus:border-transparent text-slate-900 dark:text-white bg-white dark:bg-slate-800 placeholder-slate-400 dark:placeholder-slate-500"
                />
              </div>
            </div>

            <Button type="submit" isLoading={isPending} className="w-full py-2.5 text-sm font-bold shadow-sm">
              Sign In to Portal
            </Button>
          </form>

          {/* Quick 1-Click Demo Buttons */}
          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Instant 1-Click Demo Portals
              </span>
              <span className="text-[10px] text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/60 px-2 py-0.5 rounded font-bold">
                Zero Typing Needed
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {demoAccounts.map((account) => (
                <button
                  key={account.role}
                  type="button"
                  onClick={() => handleQuickLogin(account.role, account.email, account.pass)}
                  disabled={isPending}
                  className="w-full text-left p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-[#FF1313] dark:hover:border-[#FF1313] hover:bg-[#FF1313]/5 dark:hover:bg-[#FF1313]/10 transition-all flex items-center justify-between group cursor-pointer bg-slate-50/50 dark:bg-slate-800/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white dark:bg-slate-700/80 border border-slate-200 dark:border-slate-700 shadow-xs group-hover:border-[#FF1313]/40 transition-colors">
                      {account.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-bold text-slate-900 dark:text-white">{account.title}</p>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">&bull; {account.email}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">{account.desc}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#FF1313] group-hover:translate-x-0.5 transition-all" />
                </button>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs text-center sm:text-left">
              <Link
                href="/manual"
                className="inline-flex items-center gap-1.5 font-bold text-amber-700 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-300 transition-colors"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Role & Operations Manual &rarr;</span>
              </Link>
              <Link
                href="/verify"
                className="inline-flex items-center gap-1.5 font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300 transition-colors"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Public QR Registry &rarr;</span>
              </Link>
            </div>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-slate-500 dark:text-slate-500">
          Valencia SMS Demo &bull; 50 Students Per Class &bull; &copy; 2024 Valencia Schools Lagos
        </p>
      </div>
    </div>
  );
}
