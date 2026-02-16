import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnalyticsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export default function AnalyticsCard({
  title,
  value,
  icon: Icon,
  trend,
  className,
}: AnalyticsCardProps) {
  return (
    <Card
      variant="elevated"
      className={cn(
        "bg-white/5 border border-white/10 shadow-[0_12px_30px_rgba(2,6,23,0.35)]",
        className
      )}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-300 mb-1">{title}</p>
            <p className="text-2xl font-semibold text-slate-100">{value}</p>
            {trend && (
              <p
                className={cn(
                  "text-xs mt-1",
                  trend.isPositive ? "text-emerald-300" : "text-rose-300"
                )}
              >
                {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}% from last month
              </p>
            )}
          </div>
          <div className="w-12 h-12 bg-emerald-400/15 rounded-xl flex items-center justify-center">
            <Icon className="text-emerald-200" size={24} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

