import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined';
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  variant = 'default',
  ...props
}) => {
  const variants = {
    // Standard glass card
    default: [
      'bg-[rgba(11,31,58,0.45)] backdrop-blur-xl',
      'border border-[rgba(61,181,216,0.18)]',
    ].join(' '),
    // Elevated glass with subtle glow
    elevated: [
      'bg-[rgba(11,31,58,0.5)] backdrop-blur-xl',
      'border border-[rgba(61,181,216,0.18)]',
      'shadow-[0_8px_32px_rgba(2,24,37,0.6)]',
      'hover:shadow-[0_12px_40px_rgba(0,229,255,0.12)]',
      'transition-shadow duration-300',
    ].join(' '),
    // Outlined with gradient border
    outlined: [
      'bg-[rgba(3,29,46,0.6)] backdrop-blur-xl',
      'border border-[rgba(63,182,214,0.3)]',
      'shadow-[0_0_0_1px_rgba(63,182,214,0.08)]',
    ].join(' '),
  };

  return (
    <div
      className={cn('rounded-2xl overflow-hidden', variants[variant], className)}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => (
  <div className={cn('p-6', className)} {...props}>
    {children}
  </div>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => (
  <div className={cn('p-6 pt-0', className)} {...props}>
    {children}
  </div>
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => (
  <div className={cn('p-6 pt-0', className)} {...props}>
    {children}
  </div>
);

