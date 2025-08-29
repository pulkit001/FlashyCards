import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { UI_CONFIG, UI_COLORS } from '@/lib/ui-constants';
import { Loader2 } from 'lucide-react';

// Loading spinner component
interface LoadingSpinnerProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'primary' | 'muted';
}

export function LoadingSpinner({ 
  className, 
  size = 'md',
  variant = 'default'
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6', 
    lg: 'h-8 w-8',
  };
  
  const variantClasses = {
    default: 'text-foreground',
    primary: 'text-primary',
    muted: 'text-muted-foreground',
  };
  
  return (
    <Loader2 className={cn(
      'animate-spin',
      sizeClasses[size],
      variantClasses[variant],
      className
    )} />
  );
}

// Loading overlay component
interface LoadingOverlayProps {
  isLoading: boolean;
  children: ReactNode;
  text?: string;
  className?: string;
}

export function LoadingOverlay({ 
  isLoading, 
  children, 
  text = 'Loading...',
  className 
}: LoadingOverlayProps) {
  return (
    <div className={cn('relative', className)}>
      {children}
      {isLoading && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="flex flex-col items-center gap-3">
            <LoadingSpinner size="lg" />
            <p className="text-sm text-muted-foreground font-medium">{text}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Skeleton loader component
interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rectangular' | 'circular';
  lines?: number;
}

export function Skeleton({ 
  className, 
  variant = 'rectangular',
  lines = 1
}: SkeletonProps) {
  const variantClasses = {
    text: 'h-4 rounded',
    rectangular: 'h-20 rounded-md',
    circular: 'h-12 w-12 rounded-full',
  };
  
  if (variant === 'text' && lines > 1) {
    return (
      <div className={cn('space-y-2', className)}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(
              UI_CONFIG.LOADING.skeleton,
              'h-4 rounded',
              i === lines - 1 && lines > 1 && 'w-3/4' // Last line shorter
            )}
          />
        ))}
      </div>
    );
  }
  
  return (
    <div className={cn(
      UI_CONFIG.LOADING.skeleton,
      variantClasses[variant],
      className
    )} />
  );
}

// Card skeleton for consistent loading states
interface CardSkeletonProps {
  className?: string;
  showImage?: boolean;
  lines?: number;
}

export function CardSkeleton({ 
  className, 
  showImage = false,
  lines = 3
}: CardSkeletonProps) {
  return (
    <div className={cn(
      'p-6 rounded-lg border bg-card',
      className
    )}>
      {showImage && (
        <Skeleton variant="rectangular" className="w-full h-48 mb-4" />
      )}
      <Skeleton variant="text" className="w-3/4 mb-3" />
      <Skeleton variant="text" lines={lines} />
      <div className="flex gap-2 mt-4">
        <Skeleton className="h-8 w-20 rounded" />
        <Skeleton className="h-8 w-16 rounded" />
      </div>
    </div>
  );
}

// Loading state for lists
interface ListLoadingProps {
  count?: number;
  itemComponent?: ReactNode;
  className?: string;
}

export function ListLoading({ 
  count = 3, 
  itemComponent,
  className 
}: ListLoadingProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>
          {itemComponent || <CardSkeleton />}
        </div>
      ))}
    </div>
  );
}

// Inline loading component for buttons
interface InlineLoadingProps {
  isLoading: boolean;
  children: ReactNode;
  loadingText?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function InlineLoading({ 
  isLoading, 
  children, 
  loadingText,
  size = 'sm'
}: InlineLoadingProps) {
  if (!isLoading) return <>{children}</>;
  
  return (
    <div className="flex items-center gap-2">
      <LoadingSpinner size={size} />
      {loadingText && (
        <span className="text-sm">{loadingText}</span>
      )}
    </div>
  );
}
