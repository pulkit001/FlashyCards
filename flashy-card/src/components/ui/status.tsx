import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { UI_COLORS } from '@/lib/ui-constants';
import { 
  CheckCircle, 
  AlertCircle, 
  XCircle, 
  Info, 
  Crown,
  Sparkles,
  AlertTriangle 
} from 'lucide-react';

// Status badge component
interface StatusBadgeProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'pro';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function StatusBadge({ 
  children, 
  variant = 'primary',
  size = 'md',
  className 
}: StatusBadgeProps) {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base',
  };
  
  return (
    <span className={cn(
      'inline-flex items-center rounded-full font-medium',
      sizeClasses[size],
      UI_COLORS.badge[variant],
      className
    )}>
      {children}
    </span>
  );
}

// Pro badge specifically for subscription status
interface ProBadgeProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export function ProBadge({ 
  className, 
  size = 'md',
  showIcon = true 
}: ProBadgeProps) {
  return (
    <StatusBadge variant="pro" size={size} className={className}>
      {showIcon && <Crown className="h-4 w-4 mr-1" />}
      Pro
    </StatusBadge>
  );
}

// Alert component for notifications
interface AlertProps {
  children: ReactNode;
  variant?: 'success' | 'warning' | 'error' | 'info';
  title?: string;
  className?: string;
  onClose?: () => void;
}

export function Alert({ 
  children, 
  variant = 'info',
  title,
  className,
  onClose 
}: AlertProps) {
  const icons = {
    success: CheckCircle,
    warning: AlertTriangle,
    error: XCircle,
    info: Info,
  };
  
  const Icon = icons[variant];
  
  return (
    <div className={cn(
      'rounded-lg border p-4',
      UI_COLORS.status[variant],
      className
    )}>
      <div className="flex items-start gap-3">
        <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          {title && (
            <h4 className="font-semibold mb-1">{title}</h4>
          )}
          <div className="text-sm">{children}</div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="flex-shrink-0 p-1 rounded hover:bg-black/10 transition-colors"
          >
            <XCircle className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}

// Empty state component
interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ 
  icon, 
  title, 
  description, 
  action,
  className 
}: EmptyStateProps) {
  return (
    <div className={cn(
      'text-center py-16',
      className
    )}>
      {icon && (
        <div className="flex justify-center mb-6">
          {icon}
        </div>
      )}
      <h2 className="text-2xl font-semibold text-muted-foreground mb-2">
        {title}
      </h2>
      {description && (
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          {description}
        </p>
      )}
      {action && (
        <div className="flex justify-center">
          {action}
        </div>
      )}
    </div>
  );
}

// Feature highlight component
interface FeatureHighlightProps {
  icon: ReactNode;
  title: string;
  description: string;
  badge?: ReactNode;
  className?: string;
}

export function FeatureHighlight({ 
  icon, 
  title, 
  description, 
  badge,
  className 
}: FeatureHighlightProps) {
  return (
    <div className={cn(
      'relative p-6 rounded-lg border bg-card hover:shadow-lg transition-all duration-200',
      className
    )}>
      {badge && (
        <div className="absolute top-4 right-4">
          {badge}
        </div>
      )}
      <div className="flex items-center gap-4 mb-3">
        <div className="p-2 rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>
        <h3 className="font-semibold text-lg">{title}</h3>
      </div>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}

// Progress indicator
interface ProgressProps {
  value: number;
  max?: number;
  label?: string;
  showPercentage?: boolean;
  className?: string;
}

export function Progress({ 
  value, 
  max = 100, 
  label, 
  showPercentage = false,
  className 
}: ProgressProps) {
  const percentage = Math.min((value / max) * 100, 100);
  
  return (
    <div className={cn('space-y-2', className)}>
      {(label || showPercentage) && (
        <div className="flex justify-between text-sm">
          {label && <span className="font-medium">{label}</span>}
          {showPercentage && (
            <span className="text-muted-foreground">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      <div className="w-full bg-muted rounded-full h-2">
        <div 
          className="bg-primary h-2 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

// Usage stats component
interface UsageStatsProps {
  current: number;
  limit: number;
  label: string;
  plan?: string;
  className?: string;
}

export function UsageStats({ 
  current, 
  limit, 
  label, 
  plan,
  className 
}: UsageStatsProps) {
  const isNearLimit = current >= limit * 0.8;
  const isAtLimit = current >= limit;
  
  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex justify-between items-center text-sm">
        <span className="font-medium">{label}</span>
        <div className="flex items-center gap-2">
          <span className={cn(
            'font-mono',
            isAtLimit && 'text-destructive',
            isNearLimit && !isAtLimit && 'text-warning'
          )}>
            {current}/{limit}
          </span>
          {plan && (
            <StatusBadge variant="secondary" size="sm">
              {plan}
            </StatusBadge>
          )}
        </div>
      </div>
      <Progress 
        value={current} 
        max={limit}
        className="h-1"
      />
      {isAtLimit && (
        <p className="text-xs text-destructive">
          You&apos;ve reached your {label.toLowerCase()} limit
        </p>
      )}
    </div>
  );
}
