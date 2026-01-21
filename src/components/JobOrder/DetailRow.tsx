
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface DetailRowProps {
  label: string;
  value: string | number | React.ReactNode;
  icon?: LucideIcon;
}

export function DetailRow({ label, value, icon: Icon }: DetailRowProps) {
  return (
    <div className="flex items-center gap-6 py-5 border-b border-slate-100/80 last:border-0 hover:bg-slate-50/80 rounded-2xl px-4 transition-all duration-300 group">
      <div className="flex items-center gap-4 min-w-[220px]">
        {Icon && (
          <div className="p-2.5 bg-slate-100 text-slate-500 rounded-xl group-hover:bg-primary/10 group-hover:text-primary transition-colors duration-300">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <span className="text-sm font-semibold text-slate-600 group-hover:text-slate-900 transition-colors duration-300">
          {label}
        </span>
      </div>
      <div className="flex-1 text-sm font-medium text-slate-900 bg-white/50 px-4 py-2 rounded-xl border border-slate-100/50 shadow-sm group-hover:shadow-md transition-all duration-300">
        {value}
      </div>
    </div>
  );
}
