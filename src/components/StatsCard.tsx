
import { LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StatsCardProps {
  title: string
  value: string
  icon: LucideIcon
  trend?: string
  trendUp?: boolean
  className?: string
}

export function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendUp,
  className 
}: StatsCardProps) {
  return (
    <Card className={cn(
      "relative overflow-hidden transition-all duration-300 hover:shadow-lg text-white border-0 min-h-[100px]",
      className
    )}>
      <CardContent className="p-4 flex flex-col justify-between h-full relative z-10">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-0.5 flex-1 min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wider text-white/70 truncate">
              {title}
            </p>
            <p className="text-2xl font-black tracking-tighter text-white">
              {value}
            </p>
          </div>
          <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md border border-white/10 flex-shrink-0">
            <Icon className="w-5 h-5 text-white" />
          </div>
        </div>
        
        {trend && (
          <div className="mt-2 flex items-center gap-2">
            <div className={cn(
              "flex items-center gap-0.5 text-[10px] font-bold uppercase",
              trendUp ? "text-white" : "text-white/80"
            )}>
              {trend.includes('%') ? (
                <>
                  <span className="opacity-80">{trendUp ? '↑' : '↓'}</span>
                  <span>{trend.split(' ')[0]}</span>
                </>
              ) : (
                <span>{trend}</span>
              )}
            </div>
            {trend.includes('%') && (
              <span className="text-[10px] font-medium text-white/50 truncate">
                {trend.split(' ').slice(1).join(' ')}
              </span>
            )}
          </div>
        )}
      </CardContent>
      
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.03] rounded-full -mr-12 -mt-12 blur-2xl"></div>
      <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/[0.02] rounded-full -ml-8 -mb-8 blur-xl"></div>
    </Card>
  )
}
