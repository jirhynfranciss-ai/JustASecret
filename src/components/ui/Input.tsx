import React from 'react';
import { cn } from '@/utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          'w-full rounded-2xl border-2 border-rose-100 bg-white/50 backdrop-blur-sm px-4 py-3 text-base',
          'placeholder-rose-300 text-slate-900',
          'focus:outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-200/50 focus:bg-white',
          'transition-all duration-200',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
