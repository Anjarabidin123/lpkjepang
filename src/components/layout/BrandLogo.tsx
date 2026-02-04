
import React from 'react';
import { Building2, Sparkles } from 'lucide-react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export function BrandLogo({ size = 'md', showText = true, className = '' }: BrandLogoProps) {
  const containerClasses = {
    sm: 'p-1.5 rounded-lg',
    md: 'p-2 rounded-xl',
    lg: 'p-3 rounded-2xl'
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`flex items-center justify-center bg-primary shadow-lg shadow-primary/20 ${containerClasses[size]} rotate-3 hover:rotate-0 transition-transform duration-300`}>
        <Building2 className={`${iconSizes[size]} text-white`} />
      </div>
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <h1 className={`${textSizes[size]} font-black text-slate-900 tracking-tighter font-sans uppercase`}>
              LPK <span className="text-primary">UJC</span>
            </h1>
            <Sparkles className="w-3 h-3 text-orange-400 animate-pulse" />
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] -mt-1">Operational Portal</p>
        </div>
      )}
    </div>
  );
}
