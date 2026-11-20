'use client';

import React, { useTransition } from 'react';
import Link from 'next/link';
import { Role, UserSession } from '@/lib/types';
import { switchDemoRoleAction, resetDemoAction } from '@/lib/actions';
import { ThemeToggle } from '../theme/ThemeToggle';
import { Shield, GraduationCap, Users, UserCheck, RefreshCw, Sparkles, BookOpen } from 'lucide-react';

interface DemoSwitcherProps {
  currentSession: UserSession;
}

export function DemoSwitcher({ currentSession }: DemoSwitcherProps) {
  const [isPending, startTransition] = useTransition();

  const handleRoleSwitch = (role: Role) => {
    startTransition(async () => {
      await switchDemoRoleAction(role);
    });
  };

  const handleResetData = () => {
    if (confirm('Reset demo database to fresh initial seed? All 50-student class scores will reset.')) {
      startTransition(async () => {
        await resetDemoAction();
      });
    }
  };

  const roles: { role: Role; label: string; icon: React.ReactNode; userHint: string }[] = [
    {
      role: 'ADMIN',
      label: 'Admin',
      icon: <Shield className="w-3.5 h-3.5" />,
      userHint: 'Dr. (Mrs) Valencia (Publish)',
    },
    {
      role: 'TEACHER',
      label: 'Teacher',
      icon: <GraduationCap className="w-3.5 h-3.5" />,
      userHint: 'Mr. Adeleke (Enter Scores)',
    },
    {
      role: 'PARENT',
      label: 'Parent',
      icon: <Users className="w-3.5 h-3.5" />,
      userHint: 'Alhaji Musa (Wards: Zainab & Chidi)',
    },
    {
      role: 'STUDENT',
      label: 'Student',
      icon: <UserCheck className="w-3.5 h-3.5" />,
      userHint: 'Zainab Musa (Report Card)',
    },
  ];

  return (
    <aside
      aria-label="Demo Role Switcher"
      className="bg-white/95 dark:bg-slate-900/95 border-b border-slate-200 dark:border-slate-800 px-3 sm:px-6 lg:px-8 py-1.5 sm:py-2 sticky top-0 z-50 shadow-xs backdrop-blur-md transition-colors"
    >
      <div className="w-full flex items-center justify-between gap-2 sm:gap-3 text-xs overflow-x-auto no-scrollbar py-0.5">
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FF1313]/10 dark:bg-[#FF1313]/20 text-[#FF1313] font-bold text-[11px] tracking-wide border border-[#FF1313]/20 dark:border-[#FF1313]/30 whitespace-nowrap">
            <Sparkles className="w-3 h-3 text-[#FF1313]" />
            <span className="hidden sm:inline">PORTAL SWITCHER:</span>
            <span className="sm:hidden">ROLE:</span>
          </div>
          <span className="text-slate-600 dark:text-slate-400 font-medium hidden lg:inline whitespace-nowrap">
            Logged in as <strong className="text-slate-900 dark:text-white font-bold underline decoration-[#FF1313]">{currentSession.name}</strong> ({currentSession.role})
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-slate-400 dark:text-slate-500 mr-1 text-[11px] font-semibold hidden md:inline whitespace-nowrap">1-Click Jump:</span>
          {roles.map((item) => {
            const isActive = currentSession.role === item.role;
            return (
              <button
                key={item.role}
                onClick={() => handleRoleSwitch(item.role)}
                disabled={isPending || isActive}
                title={`Switch instantly to ${item.label} • ${item.userHint}`}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${isActive
                    ? 'bg-[#FF1313] text-white shadow-sm ring-2 ring-[#FF1313]/30 font-bold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white border border-slate-200/80 dark:border-slate-700'
                  } disabled:opacity-90`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}

          <button
            onClick={handleResetData}
            disabled={isPending}
            title="Reset database to fresh 50-student demo seed"
            className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 transition-all ml-1 cursor-pointer whitespace-nowrap shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isPending ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Reset Seed</span>
          </button>

          <a
            href="/verify"
            target="_blank"
            title="Open Public Certificate Anti-Tamper Verification Registry (No Login Required)"
            className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-300 dark:border-emerald-700 transition-all ml-1 cursor-pointer whitespace-nowrap shrink-0"
          >
            <Shield className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden sm:inline">Public QR</span>
          </a>

          <Link
            href="/manual"
            title="Read Complete Operational Manual for all Roles"
            className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg text-xs font-bold bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/60 border border-amber-300 dark:border-amber-700 transition-all ml-1 cursor-pointer whitespace-nowrap shrink-0"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span className="hidden sm:inline">Role Manual</span>
          </Link>

          <ThemeToggle size="sm" className="ml-0.5 sm:ml-1 shrink-0" />
        </div>
      </div>
    </aside>
  );
}
