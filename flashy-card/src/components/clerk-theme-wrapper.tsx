'use client';

import { ClerkProvider } from "@clerk/nextjs";
import { dark } from '@clerk/themes';
import { useTheme } from 'next-themes';
import { ReactNode, useEffect, useState } from 'react';

interface ClerkThemeWrapperProps {
  children: ReactNode;
}

export function ClerkThemeWrapper({ children }: ClerkThemeWrapperProps) {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Avoid hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <ClerkProvider appearance={{ baseTheme: dark }}>
        {children}
      </ClerkProvider>
    );
  }

  // Determine the actual theme to use (resolvedTheme handles 'system' preference)
  const currentTheme = resolvedTheme || theme;
  const isDark = currentTheme === 'dark';

  // Following Clerk's official documentation approach
  const clerkAppearance = {
    baseTheme: isDark ? dark : undefined, // Use dark theme for dark mode, undefined for light mode
    variables: {
      colorPrimary: 'hsl(var(--primary))',
      colorBackground: 'hsl(var(--background))',
      colorInputBackground: 'hsl(var(--background))',
      colorInputText: 'hsl(var(--foreground))',
      colorText: 'hsl(var(--foreground))',
      colorTextSecondary: 'hsl(var(--muted-foreground))',
      colorDanger: 'hsl(var(--destructive))',
      colorSuccess: '#22c55e',
      colorWarning: '#f59e0b',
      borderRadius: '0.5rem',
    },
    elements: {
      formButtonPrimary: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-none text-sm normal-case',
      card: 'bg-card border border-border shadow-md',
      headerTitle: 'text-foreground',
      headerSubtitle: 'text-muted-foreground',
      socialButtonsBlockButton: 'bg-background border border-border text-foreground hover:bg-accent hover:text-accent-foreground',
      socialButtonsBlockButtonText: 'font-medium',
      formFieldLabel: 'text-foreground font-medium',
      formFieldInput: 'bg-background border border-border text-foreground focus:border-ring focus:ring-1 focus:ring-ring',
      footerActionLink: 'text-primary hover:text-primary/80',
      dividerLine: 'bg-border',
      dividerText: 'text-muted-foreground',
      formFieldErrorText: 'text-destructive',
      identityPreviewText: 'text-foreground',
      identityPreviewEditButtonIcon: 'text-muted-foreground',
      modalContent: 'bg-background',
      modalCloseButton: 'text-muted-foreground hover:text-foreground',
      userButtonAvatarBox: 'border-2 border-border',
      userButtonPopoverCard: 'bg-card border border-border shadow-lg',
      userButtonPopoverActionButton: 'text-foreground hover:bg-accent',
      userButtonPopoverActionButtonText: 'text-foreground',
      userButtonPopoverFooter: 'bg-muted/30',
    },
  };

  return (
    <ClerkProvider appearance={clerkAppearance}>
      {children}
    </ClerkProvider>
  );
}
