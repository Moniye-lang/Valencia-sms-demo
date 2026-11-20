'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserSession, Role } from '@/lib/types';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  FileCheck2,
  Bell,
  BookOpen,
  ClipboardList,
  CalendarCheck2,
  CalendarDays,
  Receipt,
  UserCircle,
  Award,
  HelpCircle,
} from 'lucide-react';

interface SidebarProps {
  session: UserSession;
  pendingApprovalsCount?: number;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number | string;
}

export function Sidebar({ session, pendingApprovalsCount = 0 }: SidebarProps) {
  const pathname = usePathname();

  const getNavLinks = (role: Role): NavItem[] => {
    switch (role) {
      case 'ADMIN':
        return [
          { label: 'Executive Dashboard', href: '/admin', icon: <LayoutDashboard className="w-4 h-4" /> },
          {
            label: 'Result Approvals',
            href: '/admin/results',
            icon: <FileCheck2 className="w-4 h-4" />,
            badge: pendingApprovalsCount > 0 ? pendingApprovalsCount : undefined,
          },
          { label: 'Student Directory', href: '/admin/students', icon: <GraduationCap className="w-4 h-4" /> },
          { label: 'Staff & Roles', href: '/admin/staff', icon: <Users className="w-4 h-4" /> },
          { label: 'Announcements', href: '/admin/announcements', icon: <Bell className="w-4 h-4" /> },
        ];
      case 'TEACHER':
        return [
          { label: 'Teacher Dashboard', href: '/teacher', icon: <LayoutDashboard className="w-4 h-4" /> },
          { label: 'My Classes & Subjects', href: '/teacher/classes', icon: <BookOpen className="w-4 h-4" /> },
          { label: 'Score Entry & Submit', href: '/teacher/scores', icon: <ClipboardList className="w-4 h-4" /> },
          { label: 'Daily Attendance', href: '/teacher/attendance', icon: <CalendarCheck2 className="w-4 h-4" /> },
        ];
      case 'PARENT':
        return [
          { label: 'Parent Portal Home', href: '/parent', icon: <LayoutDashboard className="w-4 h-4" /> },
          { label: 'Report Cards & Results', href: '/parent/results', icon: <Award className="w-4 h-4" /> },
          { label: 'Attendance Records', href: '/parent/attendance', icon: <CalendarCheck2 className="w-4 h-4" /> },
          { label: 'Term Fee Statements', href: '/parent/fees', icon: <Receipt className="w-4 h-4" /> },
        ];
      case 'STUDENT':
        return [
          { label: 'Student Profile', href: '/student', icon: <UserCircle className="w-4 h-4" /> },
          { label: 'Academic Results', href: '/student/results', icon: <Award className="w-4 h-4" /> },
          { label: 'Weekly Timetable', href: '/student/timetable', icon: <CalendarDays className="w-4 h-4" /> },
          { label: 'School Notices', href: '/student/announcements', icon: <Bell className="w-4 h-4" /> },
        ];
    }
  };

  const links = getNavLinks(session.role);

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-stone-200 dark:border-slate-800 sticky top-[105px] h-[calc(100vh-105px)] self-start overflow-y-auto p-4 flex flex-col justify-between shrink-0 transition-colors z-30">
      <div className="space-y-1">
        <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-stone-400 dark:text-slate-500">
          {session.role} Menu
        </div>
        <nav className="space-y-1">
          {links.map((link) => {
            const isActive = pathname === link.href || (link.href !== `/${session.role.toLowerCase()}` && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive
                    ? 'bg-[#FF1313] text-white shadow-xs font-semibold'
                    : 'text-stone-700 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-slate-800 hover:text-stone-900 dark:hover:text-white'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? 'text-white' : 'text-[#FF1313]'}>{link.icon}</span>
                  <span>{link.label}</span>
                </div>
                {link.badge !== undefined && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-bold ${isActive ? 'bg-amber-400 text-stone-950' : 'bg-[#FF1313] text-white'
                      }`}
                  >
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="pt-3 mt-3 border-t border-stone-100 dark:border-slate-800">
          <Link
            href="/manual"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              pathname === '/manual'
                ? 'bg-[#FF1313] text-white shadow-xs font-semibold'
                : 'text-stone-700 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-slate-800 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <span className={pathname === '/manual' ? 'text-white' : 'text-amber-500'}>
              <HelpCircle className="w-4 h-4" />
            </span>
            <span>Role & System Manual</span>
          </Link>
        </div>
      </div>

      <div className="pt-4 border-t border-stone-100 dark:border-slate-800 mt-6 shrink-0">
        <div className="p-3 bg-stone-50 dark:bg-slate-800/60 rounded-xl border border-stone-200/70 dark:border-slate-700/60 text-xs">
          <p className="font-semibold text-stone-900 dark:text-white">Academic Session</p>
          <p className="text-stone-500 dark:text-slate-400 mt-0.5">2024/2025 &bull; 1st Term</p>
          <div className="mt-2 text-[10px] text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/40 px-2 py-1 rounded inline-block font-semibold">
            Status: Mid-Term Examination
          </div>
        </div>
      </div>
    </aside>
  );
}
