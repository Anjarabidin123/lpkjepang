
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';

interface PembayaranStatusBadgeProps {
  status: string;
  kekurangan?: number;
  className?: string;
}

export function PembayaranStatusBadge({ status, kekurangan = 0, className }: PembayaranStatusBadgeProps) {
  const getStatusConfig = () => {
    switch (status?.toLowerCase()) {
      case 'lunas':
        return {
          variant: 'default' as const,
          icon: CheckCircle,
          text: 'Lunas',
          className: 'bg-green-100 text-green-800 border-green-200'
        };
      case 'belum lunas':
        return {
          variant: 'destructive' as const,
          icon: kekurangan > 0 ? AlertTriangle : XCircle,
          text: 'Belum Lunas',
          className: 'bg-red-100 text-red-800 border-red-200'
        };
      case 'pending':
        return {
          variant: 'secondary' as const,
          icon: Clock,
          text: 'Pending',
          className: 'bg-yellow-100 text-yellow-800 border-yellow-200'
        };
      default:
        return {
          variant: 'outline' as const,
          icon: Clock,
          text: status || 'Unknown',
          className: 'bg-gray-100 text-gray-800 border-gray-200'
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <Badge 
      variant={config.variant} 
      className={`flex items-center gap-1 ${config.className} ${className}`}
    >
      <Icon className="h-3 w-3" />
      {config.text}
    </Badge>
  );
}
