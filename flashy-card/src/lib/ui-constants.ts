// UI-specific constants for consistent design
export const UI_CONFIG = {
  // Spacing system (based on Tailwind's spacing scale)
  SPACING: {
    xs: 'p-1',
    sm: 'p-2',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8',
    '2xl': 'p-12',
    '3xl': 'p-16',
  },
  
  // Margin system
  MARGIN: {
    xs: 'm-1',
    sm: 'm-2', 
    md: 'm-4',
    lg: 'm-6',
    xl: 'm-8',
    '2xl': 'm-12',
    '3xl': 'm-16',
  },
  
  // Gap system
  GAP: {
    xs: 'gap-1',
    sm: 'gap-2',
    md: 'gap-4', 
    lg: 'gap-6',
    xl: 'gap-8',
    '2xl': 'gap-12',
  },
  
  // Border radius
  ROUNDED: {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    full: 'rounded-full',
  },
  
  // Shadows
  SHADOW: {
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
    '2xl': 'shadow-2xl',
    none: 'shadow-none',
  },
  
  // Container sizes
  CONTAINER: {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl',
    full: 'max-w-full',
  },
  
  // Grid layouts
  GRID: {
    cols1: 'grid-cols-1',
    cols2: 'grid-cols-2',
    cols3: 'grid-cols-3',
    cols4: 'grid-cols-4',
    cols6: 'grid-cols-6',
    cols12: 'grid-cols-12',
    responsive: {
      cards: 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4',
      features: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      stats: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    },
  },
  
  // Flexbox layouts
  FLEX: {
    center: 'flex items-center justify-center',
    between: 'flex items-center justify-between',
    start: 'flex items-center justify-start',
    end: 'flex items-center justify-end',
    col: 'flex flex-col',
    colCenter: 'flex flex-col items-center justify-center',
    wrap: 'flex flex-wrap',
    responsive: 'flex flex-col sm:flex-row',
  },
  
  // Typography
  TEXT: {
    // Sizes
    xs: 'text-xs',
    sm: 'text-sm', 
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
    '4xl': 'text-4xl',
    
    // Weights
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
    
    // Colors
    primary: 'text-foreground',
    secondary: 'text-muted-foreground',
    accent: 'text-primary',
    destructive: 'text-destructive',
    success: 'text-green-600',
    warning: 'text-yellow-600',
  },
  
  // Button variants (extending ShadCN)
  BUTTON: {
    sizes: {
      xs: 'h-6 px-2 text-xs',
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-4',
      lg: 'h-12 px-6 text-lg',
      xl: 'h-14 px-8 text-xl',
    },
    
    // Icon button sizes
    iconSizes: {
      xs: 'h-6 w-6',
      sm: 'h-8 w-8', 
      md: 'h-10 w-10',
      lg: 'h-12 w-12',
      xl: 'h-14 w-14',
    },
  },
  
  // Animation classes
  ANIMATION: {
    fadeIn: 'animate-in fade-in duration-200',
    slideIn: 'animate-in slide-in-from-bottom-4 duration-300',
    scaleIn: 'animate-in zoom-in-95 duration-200',
    spin: 'animate-spin',
    pulse: 'animate-pulse',
    bounce: 'animate-bounce',
    
    // Transitions
    transition: 'transition-all duration-200',
    transitionSlow: 'transition-all duration-300',
    transitionFast: 'transition-all duration-100',
    
    // Hover effects
    hoverScale: 'hover:scale-105 transition-transform duration-200',
    hoverShadow: 'hover:shadow-lg transition-shadow duration-200',
    hoverOpacity: 'hover:opacity-80 transition-opacity duration-200',
  },
  
  // Loading states
  LOADING: {
    skeleton: 'animate-pulse bg-muted rounded',
    spinner: 'animate-spin rounded-full border-2 border-muted border-t-primary',
    dots: 'animate-pulse',
  },
  
  // Focus states for accessibility
  FOCUS: {
    ring: 'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
    visible: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
  },
} as const;

// Color scheme for consistent theming
export const UI_COLORS = {
  // Status colors
  status: {
    success: 'text-green-600 bg-green-50 border-green-200',
    warning: 'text-yellow-600 bg-yellow-50 border-yellow-200', 
    error: 'text-red-600 bg-red-50 border-red-200',
    info: 'text-blue-600 bg-blue-50 border-blue-200',
  },
  
  // Badge colors
  badge: {
    primary: 'bg-primary text-primary-foreground',
    secondary: 'bg-secondary text-secondary-foreground',
    success: 'bg-green-500 text-white',
    warning: 'bg-yellow-500 text-white',
    error: 'bg-red-500 text-white',
    pro: 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black',
  },
  
  // Card variants
  card: {
    default: 'bg-card text-card-foreground border',
    elevated: 'bg-card text-card-foreground border shadow-lg',
    interactive: 'bg-card text-card-foreground border hover:shadow-lg transition-shadow cursor-pointer',
    muted: 'bg-muted/50 text-muted-foreground border-dashed border-muted-foreground/20',
  },
} as const;

// Common layout patterns
export const UI_LAYOUTS = {
  // Page layouts
  page: {
    container: `container mx-auto ${UI_CONFIG.SPACING.xl} ${UI_CONFIG.CONTAINER['7xl']}`,
    section: `${UI_CONFIG.SPACING.lg} ${UI_CONFIG.MARGIN.lg}`,
    hero: `${UI_CONFIG.SPACING['3xl']} text-center`,
  },
  
  // Component layouts
  component: {
    header: `${UI_CONFIG.FLEX.between} ${UI_CONFIG.SPACING.md} border-b`,
    footer: `${UI_CONFIG.FLEX.center} ${UI_CONFIG.SPACING.md} border-t mt-auto`,
    sidebar: `w-64 ${UI_CONFIG.SPACING.md} border-r`,
    main: `flex-1 ${UI_CONFIG.SPACING.md}`,
  },
  
  // Form layouts
  form: {
    container: `space-y-6 ${UI_CONFIG.SPACING.md}`,
    group: `space-y-2`,
    actions: `${UI_CONFIG.FLEX.between} pt-6 border-t`,
    inline: `${UI_CONFIG.FLEX.start} ${UI_CONFIG.GAP.md}`,
  },
  
  // Card layouts
  card: {
    grid: UI_CONFIG.GRID.responsive.cards,
    list: `space-y-4`,
    featured: `${UI_CONFIG.SPACING.lg} ${UI_CONFIG.SHADOW.xl} ${UI_CONFIG.ROUNDED.xl}`,
  },
} as const;
