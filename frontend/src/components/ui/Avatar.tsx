import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function Avatar({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex items-center justify-center rounded-full bg-gray-300', className)}>
      {children}
    </div>
  );
}

export function AvatarFallback({ children }: { children: ReactNode }) {
  return <span className="text-xs font-semibold">{children}</span>;
}
