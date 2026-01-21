
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Search, Filter, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface ModulePageLayoutProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  stats?: React.ReactNode;
  filters?: React.ReactNode;
  children: React.ReactNode;
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
}

export function ModulePageLayout({
  title,
  subtitle,
  actions,
  stats,
  filters,
  children,
  searchTerm,
  onSearchChange,
  searchPlaceholder = "Cari data...",
}: ModulePageLayoutProps) {
  const [showStats, setShowStats] = useState(true);

  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-500">
      {/* Header Area - Compact */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">{title}</h1>
          {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {actions}
          {stats && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowStats(!showStats)}
              className="h-8 px-2 text-slate-500"
            >
              {showStats ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          )}
        </div>
      </div>

      {/* Stats Area - Collapsible & Compact */}
      <AnimatePresence>
        {showStats && stats && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {stats}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls Area - Integrated */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center bg-white dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        {onSearchChange !== undefined && (
          <div className="relative flex-1 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
            <Input
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="pl-9 h-9 bg-slate-50 dark:bg-slate-900 border-transparent focus:border-primary/30 focus:bg-white dark:focus:bg-slate-950 transition-all rounded-lg text-sm"
            />
          </div>
        )}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {filters}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {children}
      </div>
    </div>
  );
}

interface ModuleStatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: string;
  color?: "primary" | "success" | "warning" | "error" | "purple";
}

export function ModuleStatCard({ label, value, icon, trend, color = "primary" }: ModuleStatCardProps) {
  const colorMap = {
    primary: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200/50 dark:border-blue-900/30",
    success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-900/30",
    warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200/50 dark:border-amber-900/30",
    error: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200/50 dark:border-rose-900/30",
    purple: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-200/50 dark:border-violet-900/30",
  };

  return (
    <div className={cn(
      "p-3 rounded-xl border flex flex-col gap-1 transition-all hover:shadow-md",
      colorMap[color]
    )}>
      <div className="flex justify-between items-start">
        <span className="text-[10px] font-semibold uppercase tracking-wider opacity-80">{label}</span>
        {icon && <div className="opacity-60">{icon}</div>}
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-lg font-bold tabular-nums">{value}</span>
        {trend && <span className="text-[10px] font-medium opacity-90">{trend}</span>}
      </div>
    </div>
  );
}
