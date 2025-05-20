import { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export function Button({
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { className?: string }) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors',
        'bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50',
        className
      )}
      {...props}
    />
  );
}
