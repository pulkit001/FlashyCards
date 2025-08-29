// Accessibility utilities and constants
export const A11Y = {
  // ARIA labels and descriptions
  LABELS: {
    // Navigation
    mainNavigation: 'Main navigation',
    breadcrumbs: 'Breadcrumb navigation',
    pagination: 'Pagination navigation',
    
    // Actions
    createDeck: 'Create new flashcard deck',
    editCard: 'Edit flashcard',
    deleteCard: 'Delete flashcard',
    generateAI: 'Generate cards with AI',
    refreshData: 'Refresh data',
    
    // Content
    deckCount: 'Number of flashcard decks',
    cardCount: 'Number of cards in deck',
    usageStats: 'Usage statistics',
    
    // Forms
    required: 'Required field',
    optional: 'Optional field',
    fieldError: 'Field error message',
    formError: 'Form error message',
    
    // Status
    loading: 'Loading content',
    success: 'Success message',
    error: 'Error message',
    warning: 'Warning message',
  },
  
  // Screen reader text
  SR_ONLY: 'sr-only',
  
  // Focus management
  FOCUS: {
    ring: 'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
    visible: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
    within: 'focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2',
  },
  
  // Keyboard navigation
  KEYBOARD: {
    // Skip links
    skipToContent: 'Skip to main content',
    skipToNavigation: 'Skip to navigation',
    
    // Instructions
    escapeToClose: 'Press Escape to close',
    enterToActivate: 'Press Enter to activate',
    spaceToToggle: 'Press Space to toggle',
    arrowsToNavigate: 'Use arrow keys to navigate',
  },
  
  // Color contrast and visibility
  CONTRAST: {
    // High contrast text
    highContrast: 'text-foreground',
    mediumContrast: 'text-muted-foreground',
    lowContrast: 'text-muted-foreground/60',
    
    // Interactive elements
    interactive: 'hover:text-foreground focus:text-foreground',
    destructive: 'text-destructive hover:text-destructive/80',
  },
  
  // Motion preferences
  MOTION: {
    // Respect reduced motion preference
    reduceMotion: 'motion-reduce:animate-none motion-reduce:transition-none',
    safeAnimation: 'motion-safe:animate-in motion-safe:fade-in',
  },
} as const;

// Utility functions for accessibility
export function generateId(prefix: string = 'element'): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

export function createAriaLabel(base: string, context?: string): string {
  return context ? `${base} - ${context}` : base;
}

export function announceToScreenReader(message: string): void {
  if (typeof window === 'undefined') return;
  
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  // Clean up after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

export function trapFocus(element: HTMLElement): () => void {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  ) as NodeListOf<HTMLElement>;
  
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  
  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }
    
    if (e.key === 'Escape') {
      element.querySelector<HTMLElement>('[data-dismiss]')?.click();
    }
  }
  
  element.addEventListener('keydown', handleKeyDown);
  firstElement?.focus();
  
  return () => {
    element.removeEventListener('keydown', handleKeyDown);
  };
}

// High contrast mode detection
export function isHighContrastMode(): boolean {
  if (typeof window === 'undefined') return false;
  
  return window.matchMedia('(prefers-contrast: high)').matches;
}

// Reduced motion detection
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Screen reader detection (approximate)
export function isScreenReaderActive(): boolean {
  if (typeof window === 'undefined') return false;
  
  // This is a heuristic and not 100% accurate
  return window.navigator.userAgent.includes('NVDA') ||
         window.navigator.userAgent.includes('JAWS') ||
         window.speechSynthesis?.getVoices().length > 0;
}

// Keyboard-only navigation detection
export function isKeyboardUser(): boolean {
  if (typeof window === 'undefined') return false;
  
  let isKeyboard = false;
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      isKeyboard = true;
      document.body.classList.add('keyboard-user');
    }
  });
  
  document.addEventListener('mousedown', () => {
    isKeyboard = false;
    document.body.classList.remove('keyboard-user');
  });
  
  return isKeyboard;
}

// Live region manager
class LiveRegionManager {
  private politeRegion: HTMLElement | null = null;
  private assertiveRegion: HTMLElement | null = null;
  
  constructor() {
    if (typeof window !== 'undefined') {
      this.createLiveRegions();
    }
  }
  
  private createLiveRegions() {
    // Polite announcements
    this.politeRegion = document.createElement('div');
    this.politeRegion.setAttribute('aria-live', 'polite');
    this.politeRegion.setAttribute('aria-atomic', 'true');
    this.politeRegion.className = 'sr-only';
    document.body.appendChild(this.politeRegion);
    
    // Assertive announcements  
    this.assertiveRegion = document.createElement('div');
    this.assertiveRegion.setAttribute('aria-live', 'assertive');
    this.assertiveRegion.setAttribute('aria-atomic', 'true');
    this.assertiveRegion.className = 'sr-only';
    document.body.appendChild(this.assertiveRegion);
  }
  
  announce(message: string, priority: 'polite' | 'assertive' = 'polite') {
    const region = priority === 'polite' ? this.politeRegion : this.assertiveRegion;
    
    if (region) {
      region.textContent = message;
      
      // Clear after announcement
      setTimeout(() => {
        region.textContent = '';
      }, 1000);
    }
  }
}

export const liveRegionManager = new LiveRegionManager();
