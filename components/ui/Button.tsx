import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'teal';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  ...props
}) => {
  const base = [
    'inline-flex items-center justify-center font-semibold rounded-xl',
    'transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2',
    'focus:ring-offset-[#0B1F3A] disabled:opacity-50 disabled:cursor-not-allowed',
    'relative overflow-hidden',
  ].join(' ');

  const variants = {
    // Blue → Indigo gradient (primary CTA)
    primary: [
      'bg-gradient-to-r from-[#2F6BFF] to-[#5B4BFF] text-white',
      'shadow-[0_4px_20px_rgba(67,97,238,0.4)]',
      'hover:shadow-[0_4px_28px_rgba(0,229,255,0.45)]',
      'hover:bg-gradient-to-r hover:from-[#3DB5D8] hover:to-[#2F6BFF]',
      'hover:-translate-y-0.5 focus:ring-[#2F6BFF]/50',
    ].join(' '),
    // Teal → Cyan (secondary CTA)
    teal: [
      'bg-gradient-to-r from-[#3DB5D8] to-[#3DB5D8] text-[#0B1F3A]',
      'shadow-[0_4px_20px_rgba(61,181,216,0.35)]',
      'hover:shadow-[0_4px_28px_rgba(0,229,255,0.55)]',
      'hover:-translate-y-0.5 focus:ring-[#3DB5D8]/50',
    ].join(' '),
    // Glass secondary
    secondary: [
      'bg-white/5 border border-white/10 text-[#8ED6E6]',
      'backdrop-blur-sm hover:bg-white/10 hover:border-[#3DB5D8]/40',
      'hover:text-white hover:-translate-y-0.5 focus:ring-[#3DB5D8]/40',
    ].join(' '),
    // Outlined ghost
    outline: [
      'border border-[#3DB5D8]/50 text-[#3DB5D8]',
      'hover:bg-[#3DB5D8]/10 hover:border-[#3DB5D8] hover:shadow-[0_0_16px_rgba(61,181,216,0.25)]',
      'hover:-translate-y-0.5 focus:ring-[#3DB5D8]/40',
    ].join(' '),
    ghost: [
      'text-[#8ED6E6] hover:bg-white/5 hover:text-white focus:ring-white/20',
    ].join(' '),
  };

  const sizes = {
    sm: 'px-4 py-1.5 text-sm gap-1.5',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-7 py-3.5 text-base gap-2',
  };

  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
};

