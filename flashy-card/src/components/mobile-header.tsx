'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, MoreHorizontal } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useHaptics } from '@/hooks/use-haptics';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface MobileHeaderProps {
  title: string;
  showBack?: boolean;
  backUrl?: string;
  actions?: React.ReactNode;
}

export function MobileHeader({ 
  title, 
  showBack = false, 
  backUrl,
  actions 
}: MobileHeaderProps) {
  const router = useRouter();
  const { lightImpact } = useHaptics();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleBack = () => {
    lightImpact();
    if (backUrl) {
      router.push(backUrl);
    } else {
      router.back();
    }
  };

  const handleShare = async () => {
    lightImpact();
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${title} - Flashy Cards`,
          text: 'Check out this flashcard deck!',
          url: window.location.href,
        });
      } catch (error) {
        console.debug('Share cancelled or failed:', error);
      }
    } else {
      // Fallback: Copy to clipboard
      await navigator.clipboard.writeText(window.location.href);
      // You could show a toast here
    }
  };

  const handleRefresh = () => {
    lightImpact();
    window.location.reload();
  };

  return (
    <header 
      className={`sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-200 ${
        isScrolled ? 'shadow-sm' : ''
      }`}
    >
      <div className="flex h-14 items-center justify-between px-4">
        {/* Left side */}
        <div className="flex items-center space-x-2 min-w-0 flex-1">
          {showBack && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="h-8 w-8 p-0 flex-shrink-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
          
          <h1 className="text-lg font-semibold truncate">
            {title}
          </h1>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-2 flex-shrink-0">
          {actions}
          
          {/* Mobile menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={handleShare}>
                Share
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleRefresh}>
                Refresh
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/dashboard')}>
                Dashboard
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/pricing')}>
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

