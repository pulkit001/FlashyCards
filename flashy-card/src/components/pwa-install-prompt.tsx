'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, X, Smartphone } from 'lucide-react';
import { useHaptics } from '@/hooks/use-haptics';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const { lightImpact, success } = useHaptics();

  useEffect(() => {
    // Check if app is already installed
    const checkInstalled = () => {
      setIsInstalled(
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone === true
      );
    };

    // Check if device is iOS
    const checkIOS = () => {
      setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent));
    };

    checkInstalled();
    checkIOS();

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      if (!isInstalled) {
        setShowPrompt(true);
      }
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
      success(); // Haptic feedback for successful installation
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [isInstalled, success]);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    
    lightImpact();
    
    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        success();
        setDeferredPrompt(null);
        setShowPrompt(false);
      }
    } catch (error) {
      console.error('Error installing PWA:', error);
    }
  };

  const handleDismiss = () => {
    lightImpact();
    setShowPrompt(false);
    // Hide for this session
    setTimeout(() => setShowPrompt(false), 24 * 60 * 60 * 1000); // Hide for 24 hours
  };

  // Don't show if already installed
  if (isInstalled) return null;

  // iOS install instructions
  if (isIOS && !deferredPrompt) {
    return (
      <Card className="fixed bottom-4 left-4 right-4 z-50 border-primary shadow-lg mx-auto max-w-md">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Smartphone className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm">Install Flashy Cards</p>
              <p className="text-xs text-muted-foreground mt-1">
                Tap the share button <span className="inline-block mx-1">↗️</span> below and select &quot;Add to Home Screen&quot;
              </p>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleDismiss}
              className="flex-shrink-0 h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Regular install prompt
  if (!showPrompt || !deferredPrompt) return null;

  return (
    <Card className="fixed bottom-4 left-4 right-4 z-50 border-primary shadow-lg animate-in slide-in-from-bottom duration-300 mx-auto max-w-md">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <Download className="h-4 w-4 text-primary flex-shrink-0" />
              <p className="font-medium text-sm">Install Flashy Cards</p>
            </div>
            <p className="text-xs text-muted-foreground">
              Add to home screen for quick access and offline use
            </p>
          </div>
          <div className="flex items-center space-x-2 ml-4 flex-shrink-0">
            <Button onClick={handleInstall} size="sm" className="text-xs">
              Install
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleDismiss}
              className="h-8 w-8 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

