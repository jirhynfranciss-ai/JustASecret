import React from 'react';
import { cn } from '@/utils/cn';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          'w-full rounded-2xl border-2 border-rose-100 bg-white/50 backdrop-blur-sm px-4 py-3 text-base',
          'placeholder-rose-300 text-slate-900',
          'focus:outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-200/50 focus:bg-white',
          'transition-all duration-200 resize-none',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        rows={4}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';
