import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  highlightColor?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  highlightColor = '#FF1313',
}: StatCardProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-stone-200/90 dark:border-slate-800 p-5 shadow-xs transition-all duration-200 hover:shadow-md relative overflow-hidden group">
      <div
        className="absolute top-0 left-0 right-0 h-1 transition-all duration-300 group-hover:h-1.5"
        style={{ backgroundColor: highlightColor }}
      />
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-stone-500 dark:text-slate-400 uppercase tracking-wider">{title}</p>
          <p className="text-2xl font-bold text-stone-900 dark:text-white mt-1 tracking-tight">{value}</p>
          {subtitle && <p className="text-xs text-stone-500 dark:text-slate-400 mt-1">{subtitle}</p>}
          {trend && (
            <p className={`text-xs font-medium mt-2 ${trend.isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
              {trend.value}
            </p>
          )}
        </div>
        {icon && (
          <div className="p-3 rounded-lg bg-stone-50 dark:bg-slate-800 text-[#FF1313] border border-stone-100 dark:border-slate-700/80 group-hover:bg-[#FF1313]/10 transition-colors">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
