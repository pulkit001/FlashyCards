import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { UI_CONFIG } from '@/lib/ui-constants';

// Base text component
interface TextProps {
  children: ReactNode;
  as?: 'p' | 'span' | 'div' | 'strong' | 'em';
  size?: keyof typeof UI_CONFIG.TEXT;
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  color?: 'primary' | 'secondary' | 'accent' | 'destructive' | 'success' | 'warning';
  className?: string;
}

export function Text({ 
  children, 
  as: Component = 'p',
  size = 'base',
  weight = 'normal',
  color = 'primary',
  className 
}: TextProps) {
  const weightClasses = {
    normal: UI_CONFIG.TEXT.normal,
    medium: UI_CONFIG.TEXT.medium,
    semibold: UI_CONFIG.TEXT.semibold,
    bold: UI_CONFIG.TEXT.bold,
  };
  
  const colorClasses = {
    primary: UI_CONFIG.TEXT.primary,
    secondary: UI_CONFIG.TEXT.secondary,
    accent: UI_CONFIG.TEXT.accent,
    destructive: UI_CONFIG.TEXT.destructive,
    success: UI_CONFIG.TEXT.success,
    warning: UI_CONFIG.TEXT.warning,
  };
  
  return (
    <Component className={cn(
      UI_CONFIG.TEXT[size],
      weightClasses[weight],
      colorClasses[color],
      className
    )}>
      {children}
    </Component>
  );
}

// Heading component
interface HeadingProps {
  children: ReactNode;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  size?: '4xl' | '3xl' | '2xl' | 'xl' | 'lg';
  weight?: 'medium' | 'semibold' | 'bold';
  color?: 'primary' | 'secondary' | 'accent';
  className?: string;
}

export function Heading({ 
  children, 
  as: Component = 'h2',
  size = '2xl',
  weight = 'bold',
  color = 'primary',
  className 
}: HeadingProps) {
  const headingClasses = cn(
    UI_CONFIG.TEXT[size],
    weight === 'medium' ? UI_CONFIG.TEXT.medium : 
    weight === 'semibold' ? UI_CONFIG.TEXT.semibold : UI_CONFIG.TEXT.bold,
    color === 'primary' ? UI_CONFIG.TEXT.primary :
    color === 'secondary' ? UI_CONFIG.TEXT.secondary : UI_CONFIG.TEXT.accent,
    'leading-tight',
    className
  );
  
  return (
    <Component className={headingClasses}>
      {children}
    </Component>
  );
}

// Page title component
interface PageTitleProps {
  children: ReactNode;
  subtitle?: string;
  className?: string;
}

export function PageTitle({ children, subtitle, className }: PageTitleProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <Heading as="h1" size="4xl" className="tracking-tight">
        {children}
      </Heading>
      {subtitle && (
        <Text size="lg" color="secondary" className="max-w-3xl">
          {subtitle}
        </Text>
      )}
    </div>
  );
}

// Section title component
interface SectionTitleProps {
  children: ReactNode;
  description?: string;
  level?: 2 | 3 | 4;
  className?: string;
}

export function SectionTitle({ 
  children, 
  description, 
  level = 2,
  className 
}: SectionTitleProps) {
  const sizes = {
    2: '3xl',
    3: '2xl', 
    4: 'xl',
  } as const;
  
  const headingTag = `h${level}` as 'h2' | 'h3' | 'h4';
  
  return (
    <div className={cn('space-y-2', className)}>
      <Heading as={headingTag} size={sizes[level]}>
        {children}
      </Heading>
      {description && (
        <Text color="secondary" className="max-w-2xl">
          {description}
        </Text>
      )}
    </div>
  );
}

// Code/monospace text
interface CodeProps {
  children: ReactNode;
  inline?: boolean;
  className?: string;
}

export function Code({ children, inline = true, className }: CodeProps) {
  if (inline) {
    return (
      <code className={cn(
        'px-1.5 py-0.5 bg-muted rounded text-sm font-mono',
        className
      )}>
        {children}
      </code>
    );
  }
  
  return (
    <pre className={cn(
      'p-4 bg-muted rounded-lg overflow-x-auto',
      className
    )}>
      <code className="text-sm font-mono">{children}</code>
    </pre>
  );
}

// Link component with consistent styling
interface LinkTextProps {
  children: ReactNode;
  href?: string;
  external?: boolean;
  variant?: 'default' | 'muted' | 'accent';
  className?: string;
  onClick?: () => void;
}

export function LinkText({ 
  children, 
  href, 
  external = false,
  variant = 'default',
  className,
  onClick 
}: LinkTextProps) {
  const variantClasses = {
    default: 'text-primary hover:text-accent underline-offset-4 hover:underline',
    muted: 'text-muted-foreground hover:text-primary underline-offset-4 hover:underline',
    accent: 'text-accent hover:text-accent/80 underline-offset-4 hover:underline',
  };
  
  const Component = href ? 'a' : 'button';
  const props = href 
    ? { 
        href, 
        ...(external && { target: '_blank', rel: 'noopener noreferrer' })
      }
    : { onClick, type: 'button' as const };
  
  return (
    <Component 
      className={cn(
        'transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded',
        variantClasses[variant],
        !href && 'bg-transparent border-none p-0 cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

// Muted text helper
interface MutedProps {
  children: ReactNode;
  size?: keyof typeof UI_CONFIG.TEXT;
  className?: string;
}

export function Muted({ children, size = 'sm', className }: MutedProps) {
  return (
    <Text size={size} color="secondary" className={className}>
      {children}
    </Text>
  );
}

// Large text helper
interface LargeProps {
  children: ReactNode;
  className?: string;
}

export function Large({ children, className }: LargeProps) {
  return (
    <Text size="lg" weight="semibold" className={className}>
      {children}
    </Text>
  );
}

// Small text helper
interface SmallProps {
  children: ReactNode;
  className?: string;
}

export function Small({ children, className }: SmallProps) {
  return (
    <Text size="sm" weight="medium" className={cn('leading-none', className)}>
      {children}
    </Text>
  );
}

// List component with consistent styling
interface ListProps {
  children: ReactNode;
  ordered?: boolean;
  className?: string;
}

export function List({ children, ordered = false, className }: ListProps) {
  const Component = ordered ? 'ol' : 'ul';
  
  return (
    <Component className={cn(
      'space-y-2',
      ordered ? 'list-decimal list-inside' : 'list-disc list-inside',
      'text-muted-foreground',
      className
    )}>
      {children}
    </Component>
  );
}

// List item
interface ListItemProps {
  children: ReactNode;
  className?: string;
}

export function ListItem({ children, className }: ListItemProps) {
  return (
    <li className={cn('leading-relaxed', className)}>
      {children}
    </li>
  );
}
