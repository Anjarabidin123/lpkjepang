
import React from 'react';
import { Building2, GraduationCap } from 'lucide-react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export function BrandLogo({ size = 'md', showText = true, className = '' }: BrandLogoProps) {
  const sizeClasses = {
    sm: 'p-1.5',
    md: 'p-2', 
    lg: 'p-3'
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-xl'
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`flex items-center gap-2 bg-gradient-primary rounded-xl ${sizeClasses[size]}`}>
        <Building2 className={`${iconSizes[size]} text-white`} />
        <GraduationCap className={`${iconSizes[size]} text-white`} />
      </div>
      {showText && (
        <div>
          <h1 className={`${textSizes[size]} font-bold text-gray-900`}>LPK UJC</h1>
          <p className="text-xs text-gray-500 -mt-1">Management System</p>
        </div>
      )}
    </div>
  );
}
