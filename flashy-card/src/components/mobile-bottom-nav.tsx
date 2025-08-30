'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Home, Plus, User, CreditCard } from 'lucide-react';
import { useHaptics } from '@/hooks/use-haptics';
import { useSubscription } from '@/hooks/use-subscription';
import { Button } from '@/components/ui/button';

interface NavItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
  active?: boolean;
}

export function MobileBottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { lightImpact } = useHaptics();
  const { isProUser } = useSubscription();

  const navItems: NavItem[] = [
    {
      icon: Home,
      label: 'Home',
      href: '/dashboard',
      active: pathname === '/dashboard',
    },
    {
      icon: Plus,
      label: 'Create',
      href: '/dashboard?action=create',
      active: false,
    },
    {
      icon: CreditCard,
      label: isProUser ? 'Pro' : 'Upgrade',
      href: '/pricing',
      active: pathname === '/pricing',
    },
    {
      icon: User,
      label: 'Profile',
      href: '/profile',
      active: pathname === '/profile',
    },
  ];

  const handleNavigation = (href: string) => {
    lightImpact();
    
    if (href === '/dashboard?action=create') {
      // Special handling for create action
      router.push('/dashboard');
      // You could trigger a create modal here
      return;
    }
    
    router.push(href);
  };

  // Don't show on certain pages
  if (pathname.includes('/sign-in') || pathname.includes('/sign-up')) {
    return null;
  }

  return (
    <>
      {/* Spacer to prevent content from being hidden behind bottom nav */}
      <div className="h-16 md:hidden" />
      
      {/* Bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t md:hidden">
        <div className="grid grid-cols-4 h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.active;
            
            return (
              <Button
                key={item.href}
                variant="ghost"
                className={`h-full rounded-none flex flex-col items-center justify-center space-y-1 transition-colors ${
                  isActive 
                    ? 'text-primary bg-primary/10' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                }`}
                onClick={() => handleNavigation(item.href)}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'text-primary' : ''}`} />
                <span className={`text-xs ${isActive ? 'font-medium text-primary' : ''}`}>
                  {item.label}
                </span>
                {isActive && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-primary rounded-b-full" />
                )}
              </Button>
            );
          })}
        </div>
        
        {/* Safe area for devices with home indicator */}
        <div className="h-safe-bottom bg-background/95" />
      </nav>
    </>
  );
}

