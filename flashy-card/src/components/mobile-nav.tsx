'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Crown } from 'lucide-react';
import Link from 'next/link';
import { ThemeToggle } from './theme-toggle';
import { useSubscription } from '@/hooks/use-subscription';
import { useHaptics } from '@/hooks/use-haptics';

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const { isProUser } = useSubscription();
  const { lightImpact } = useHaptics();

  const navigationItems = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/about', label: 'About' },
    { href: '/help', label: 'Help' },
  ];

  const handleMenuToggle = () => {
    lightImpact();
    setIsOpen(!isOpen);
  };

  const handleNavClick = () => {
    lightImpact();
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="lg:hidden p-1.5 sm:p-2 hover:bg-accent h-8 w-8 sm:h-9 sm:w-9"
          onClick={handleMenuToggle}
        >
          <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[280px] sm:w-[350px]">
        <div className="flex flex-col space-y-6 mt-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black dark:bg-white text-white dark:text-black font-bold text-lg">
                F
              </div>
              <span className="text-xl font-bold text-foreground">
                Flashy Cards
              </span>
            </div>
            {isProUser && (
              <div className="flex items-center bg-gradient-to-r from-amber-400 to-yellow-500 text-black px-2 py-1 rounded-full text-xs font-medium shadow-lg sm:hidden">
                <Crown className="h-3 w-3 mr-1" />
                Pro
              </div>
            )}
          </div>
          
          <nav className="flex flex-col space-y-4">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 py-2 px-4 rounded-lg hover:bg-accent"
                onClick={handleNavClick}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          
          <div className="pt-4 border-t border-border">
            <div className="flex items-center justify-between px-4 py-2">
              <span className="text-sm font-medium text-muted-foreground">Theme</span>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
