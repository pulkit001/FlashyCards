import { ReactNode, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { UI_CONFIG, UI_LAYOUTS } from '@/lib/ui-constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

// Form container with consistent layout
interface FormContainerProps {
  children: ReactNode;
  className?: string;
  onSubmit?: (e: React.FormEvent) => void;
}

export function FormContainer({ 
  children, 
  className, 
  onSubmit 
}: FormContainerProps) {
  return (
    <form 
      className={cn(UI_LAYOUTS.form.container, className)}
      onSubmit={onSubmit}
    >
      {children}
    </form>
  );
}

// Form group for field spacing
interface FormGroupProps {
  children: ReactNode;
  className?: string;
}

export function FormGroup({ children, className }: FormGroupProps) {
  return (
    <div className={cn(UI_LAYOUTS.form.group, className)}>
      {children}
    </div>
  );
}

// Form actions section
interface FormActionsProps {
  children: ReactNode;
  variant?: 'between' | 'end' | 'start';
  className?: string;
}

export function FormActions({ 
  children, 
  variant = 'end',
  className 
}: FormActionsProps) {
  const variantClasses = {
    between: 'justify-between',
    end: 'justify-end',
    start: 'justify-start',
  };
  
  return (
    <div className={cn(
      'flex items-center gap-3 pt-6 border-t',
      variantClasses[variant],
      className
    )}>
      {children}
    </div>
  );
}

// Enhanced form field with error handling
interface FormFieldProps {
  children: ReactNode;
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  className?: string;
  labelProps?: React.LabelHTMLAttributes<HTMLLabelElement>;
}

export function FormField({ 
  children, 
  label, 
  error, 
  hint, 
  required,
  className,
  labelProps 
}: FormFieldProps) {
  const fieldId = labelProps?.htmlFor || 'form-field';
  
  return (
    <FormGroup className={className}>
      {label && (
        <Label 
          {...labelProps}
          htmlFor={fieldId}
          className={cn(
            'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
            labelProps?.className
          )}
        >
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      
      <div className="relative">
        {children}
        
        {error && (
          <div className="flex items-center gap-2 mt-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}
        
        {hint && !error && (
          <p className="mt-2 text-sm text-muted-foreground">
            {hint}
          </p>
        )}
      </div>
    </FormGroup>
  );
}

// Enhanced input with better states
interface EnhancedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  loading?: boolean;
}

export const EnhancedInput = forwardRef<HTMLInputElement, EnhancedInputProps>(
  ({ className, error, leftIcon, rightIcon, loading, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword && showPassword ? 'text' : type;
    
    return (
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
            {leftIcon}
          </div>
        )}
        
        <Input
          type={inputType}
          className={cn(
            leftIcon && 'pl-10',
            (rightIcon || isPassword) && 'pr-10',
            error && 'border-destructive focus:border-destructive focus:ring-destructive',
            className
          )}
          ref={ref}
          {...props}
        />
        
        {(rightIcon || isPassword) && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {isPassword ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            ) : (
              rightIcon
            )}
          </div>
        )}
        
        {loading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-muted border-t-primary" />
          </div>
        )}
      </div>
    );
  }
);

EnhancedInput.displayName = 'EnhancedInput';

// Submit button with loading state
interface SubmitButtonProps {
  children: ReactNode;
  loading?: boolean;
  loadingText?: string;
  disabled?: boolean;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

export function SubmitButton({ 
  children, 
  loading = false, 
  loadingText = 'Loading...',
  disabled,
  variant = 'default',
  size = 'default',
  className 
}: SubmitButtonProps) {
  return (
    <Button
      type="submit"
      variant={variant}
      size={size}
      disabled={disabled || loading}
      className={cn(
        loading && 'cursor-not-allowed',
        className
      )}
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
          {loadingText}
        </div>
      ) : (
        children
      )}
    </Button>
  );
}

// Cancel button for consistency
interface CancelButtonProps {
  children?: ReactNode;
  onClick?: () => void;
  className?: string;
}

export function CancelButton({ 
  children = 'Cancel', 
  onClick, 
  className 
}: CancelButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      onClick={onClick}
      className={className}
    >
      {children}
    </Button>
  );
}

// Inline form for quick actions
interface InlineFormProps {
  children: ReactNode;
  onSubmit?: (e: React.FormEvent) => void;
  className?: string;
}

export function InlineForm({ children, onSubmit, className }: InlineFormProps) {
  return (
    <form 
      className={cn(UI_LAYOUTS.form.inline, className)}
      onSubmit={onSubmit}
    >
      {children}
    </form>
  );
}

// Form section with optional title
interface FormSectionProps {
  children: ReactNode;
  title?: string;
  description?: string;
  className?: string;
}

export function FormSection({ 
  children, 
  title, 
  description, 
  className 
}: FormSectionProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {(title || description) && (
        <div className="space-y-1">
          {title && (
            <h3 className="text-lg font-semibold leading-none tracking-tight">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-sm text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      )}
      {children}
    </div>
  );
}
