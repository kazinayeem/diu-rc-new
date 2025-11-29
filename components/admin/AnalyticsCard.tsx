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
    <Card variant="elevated" className={cn('', className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-dark-600 mb-1">{title}</p>
            <p className="text-2xl font-bold text-dark-900">{value}</p>
            {trend && (
              <p className={cn('text-xs mt-1', trend.isPositive ? 'text-green-600' : 'text-red-600')}>
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}% from last month
              </p>
            )}
          </div>
          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
            <Icon className="text-primary-600" size={24} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

