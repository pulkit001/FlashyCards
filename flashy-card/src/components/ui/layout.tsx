import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { UI_CONFIG, UI_LAYOUTS } from '@/lib/ui-constants';

// Page container component
interface PageContainerProps {
  children: ReactNode;
  className?: string;
  maxWidth?: keyof typeof UI_CONFIG.CONTAINER;
}

export function PageContainer({ 
  children, 
  className, 
  maxWidth = '7xl' 
}: PageContainerProps) {
  return (
    <div className={cn(
      'container mx-auto',
      UI_CONFIG.SPACING.xl,
      UI_CONFIG.CONTAINER[maxWidth],
      className
    )}>
      {children}
    </div>
  );
}

// Section wrapper component
interface SectionProps {
  children: ReactNode;
  className?: string;
  spacing?: keyof typeof UI_CONFIG.SPACING;
}

export function Section({ 
  children, 
  className, 
  spacing = 'lg' 
}: SectionProps) {
  return (
    <section className={cn(
      UI_CONFIG.SPACING[spacing],
      className
    )}>
      {children}
    </section>
  );
}

// Flex layouts
interface FlexProps {
  children: ReactNode;
  className?: string;
  variant?: keyof typeof UI_CONFIG.FLEX;
  gap?: keyof typeof UI_CONFIG.GAP;
}

export function Flex({ 
  children, 
  className, 
  variant = 'start',
  gap = 'md'
}: FlexProps) {
  return (
    <div className={cn(
      UI_CONFIG.FLEX[variant],
      UI_CONFIG.GAP[gap],
      className
    )}>
      {children}
    </div>
  );
}

// Grid layouts
interface GridProps {
  children: ReactNode;
  className?: string;
  cols?: keyof typeof UI_CONFIG.GRID | string;
  gap?: keyof typeof UI_CONFIG.GAP;
}

export function Grid({ 
  children, 
  className, 
  cols = 'cols1',
  gap = 'md'
}: GridProps) {
  const gridCols = typeof cols === 'string' && cols.startsWith('grid-cols') 
    ? cols 
    : UI_CONFIG.GRID[cols as keyof typeof UI_CONFIG.GRID] || UI_CONFIG.GRID.cols1;
    
  return (
    <div className={cn(
      'grid',
      gridCols,
      UI_CONFIG.GAP[gap],
      className
    )}>
      {children}
    </div>
  );
}

// Responsive card grid
interface CardGridProps {
  children: ReactNode;
  className?: string;
  variant?: 'cards' | 'features' | 'stats';
}

export function CardGrid({ 
  children, 
  className, 
  variant = 'cards' 
}: CardGridProps) {
  return (
    <div className={cn(
      'grid',
      UI_CONFIG.GRID.responsive[variant],
      UI_CONFIG.GAP.lg,
      className
    )}>
      {children}
    </div>
  );
}

// Stack layout (vertical spacing)
interface StackProps {
  children: ReactNode;
  className?: string;
  spacing?: keyof typeof UI_CONFIG.GAP;
}

export function Stack({ 
  children, 
  className, 
  spacing = 'md' 
}: StackProps) {
  return (
    <div className={cn(
      'space-y-' + UI_CONFIG.GAP[spacing].split('-')[1],
      className
    )}>
      {children}
    </div>
  );
}

// Center layout
interface CenterProps {
  children: ReactNode;
  className?: string;
  minHeight?: boolean;
}

export function Center({ 
  children, 
  className, 
  minHeight = false 
}: CenterProps) {
  return (
    <div className={cn(
      UI_CONFIG.FLEX.colCenter,
      minHeight && 'min-h-screen',
      className
    )}>
      {children}
    </div>
  );
}
