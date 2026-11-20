import React from 'react';

export type BadgeVariant =
  | 'pending'
  | 'approved'
  | 'published'
  | 'draft'
  | 'rejected'
  | 'paid'
  | 'partial'
  | 'unpaid'
  | 'present'
  | 'absent'
  | 'late'
  | 'admin'
  | 'teacher'
  | 'parent'
  | 'student'
  | 'neutral';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export function Badge({ children, variant = 'neutral', className = '' }: BadgeProps) {
  const styles: Record<BadgeVariant, string> = {
    pending: 'bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/60 ring-amber-600/20',
    approved: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60 ring-emerald-600/20',
    published: 'bg-purple-50 dark:bg-purple-950/50 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800/60 ring-purple-600/20',
    draft: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 ring-slate-500/20',
    rejected: 'bg-rose-50 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800/60 ring-rose-600/20',
    paid: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60 ring-emerald-600/20',
    partial: 'bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/60 ring-amber-600/20',
    unpaid: 'bg-rose-50 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800/60 ring-rose-600/20',
    present: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60 ring-emerald-600/20',
    absent: 'bg-rose-50 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800/60 ring-rose-600/20',
    late: 'bg-orange-50 dark:bg-orange-950/50 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-800/60 ring-orange-600/20',
    admin: 'bg-[#FF1313]/10 dark:bg-[#FF1313]/25 text-[#FF1313] dark:text-red-400 border-[#FF1313]/30 dark:border-[#FF1313]/50 ring-[#FF1313]/20',
    teacher: 'bg-blue-50 dark:bg-blue-950/50 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800/60 ring-blue-600/20',
    parent: 'bg-teal-50 dark:bg-teal-950/50 text-teal-800 dark:text-teal-300 border-teal-200 dark:border-teal-800/60 ring-teal-600/20',
    student: 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-800 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/60 ring-indigo-600/20',
    neutral: 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 border-gray-200 dark:border-slate-700 ring-gray-400/20',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border shadow-xs tracking-wide transition-colors ${styles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; variant: BadgeVariant }> = {
    DRAFT: { label: 'Draft', variant: 'draft' },
    PENDING_APPROVAL: { label: 'Pending Approval', variant: 'pending' },
    APPROVED: { label: 'Approved', variant: 'approved' },
    PUBLISHED: { label: 'Published', variant: 'published' },
    REJECTED: { label: 'Changes Requested', variant: 'rejected' },
    PAID: { label: 'Paid in Full', variant: 'paid' },
    PARTIAL: { label: 'Partial Balance', variant: 'partial' },
    UNPAID: { label: 'Unpaid', variant: 'unpaid' },
    PRESENT: { label: 'Present', variant: 'present' },
    ABSENT: { label: 'Absent', variant: 'absent' },
    LATE: { label: 'Late', variant: 'late' },
    ADMIN: { label: 'Administrator', variant: 'admin' },
    TEACHER: { label: 'Faculty / Teacher', variant: 'teacher' },
    PARENT: { label: 'Parent / Guardian', variant: 'parent' },
    STUDENT: { label: 'Student', variant: 'student' },
  };

  const item = map[status] || { label: status, variant: 'neutral' };
  return <Badge variant={item.variant}>{item.label}</Badge>;
}
