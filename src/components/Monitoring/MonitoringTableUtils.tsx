
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
  switch (trend) {
    case 'up':
      return <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />;
    case 'down':
      return <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" />;
    default:
      return <Minus className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />;
  }
};

export const getStatusBadge = (status: string) => {
  const statusConfig = {
    'Aktif': { variant: 'default' as const, className: 'bg-green-100 text-green-800' },
    'Selesai': { variant: 'secondary' as const, className: 'bg-blue-100 text-blue-800' },
    'Cuti': { variant: 'outline' as const, className: 'bg-yellow-100 text-yellow-800' },
    'Dipulangkan': { variant: 'destructive' as const, className: 'bg-red-100 text-red-800' }
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['Aktif'];
  return (
    <Badge variant={config.variant} className={`${config.className} text-xs`}>
      {status}
    </Badge>
  );
};
