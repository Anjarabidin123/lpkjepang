
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MonitoringKPICardProps {
  title: string;
  target: number;
  pencapaian: number;
  pertumbuhan: number;
  trend: 'up' | 'down' | 'stable';
  icon: LucideIcon;
  formatValue?: (value: number) => string;
  className?: string;
}

export function MonitoringKPICard({
  title,
  target,
  pencapaian,
  pertumbuhan,
  trend,
  icon: Icon,
  formatValue = (value) => {
    // Safe number formatting with null checks
    if (value === null || value === undefined || isNaN(value)) {
      return '0';
    }
    return value.toLocaleString('id-ID');
  },
  className
}: MonitoringKPICardProps) {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  // Safe calculation with null checks
  const safeTarget = target || 0;
  const safePencapaian = pencapaian || 0;
  const safePertumbuhan = pertumbuhan || 0;
  
  const pencapaianPercentage = safeTarget > 0 ? Math.round((safePencapaian / safeTarget) * 100) : 0;

  return (
    <Card className={cn("transition-all duration-300 hover:shadow-lg", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Target vs Pencapaian */}
          <div className="flex justify-between items-center">
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {formatValue(safePencapaian)}
              </div>
              <p className="text-xs text-gray-500">dari target {formatValue(safeTarget)}</p>
            </div>
            <div className="text-right">
              <div className={cn("text-sm font-medium", getTrendColor())}>
                {pencapaianPercentage}%
              </div>
              <p className="text-xs text-gray-500">pencapaian</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                trend === 'up' ? 'bg-green-500' : trend === 'down' ? 'bg-red-500' : 'bg-gray-500'
              )}
              style={{ width: `${Math.min(pencapaianPercentage, 100)}%` }}
            />
          </div>

          {/* Pertumbuhan */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              {getTrendIcon()}
              <span className={cn("text-sm font-medium", getTrendColor())}>
                {safePertumbuhan}%
              </span>
            </div>
            <span className="text-xs text-gray-500">pertumbuhan</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
