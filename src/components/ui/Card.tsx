import React from 'react';

export function Card({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-white dark:bg-slate-900 rounded-xl border border-stone-200/90 dark:border-slate-800 shadow-xs overflow-hidden transition-all duration-200 hover:shadow-md ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  subtitle,
  action,
  className = '',
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`px-6 py-4 border-b border-stone-100 dark:border-slate-800 flex items-center justify-between ${className}`}>
      <div>
        <h3 className="text-base font-semibold text-stone-900 dark:text-white tracking-tight">{title}</h3>
        {subtitle && <p className="text-xs text-stone-500 dark:text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
      {action && <div className="flex items-center gap-2">{action}</div>}
    </div>
  );
}

export function CardBody({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`p-6 ${className}`}>{children}</div>;
}

export function CardFooter({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`px-6 py-3 bg-stone-50/70 dark:bg-slate-800/50 border-t border-stone-100 dark:border-slate-800 flex items-center justify-between ${className}`}>
      {children}
    </div>
  );
}
