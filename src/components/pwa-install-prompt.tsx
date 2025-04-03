'use client';

import { useEffect, useState } from 'react';
import { usePWAInstall } from '@/hooks/usePWAInstall';
import { Button } from '@/components/ui/button';
import { X, Download } from 'lucide-react';

export function PWAInstallPrompt() {
  const { isInstallable, installPWA } = usePWAInstall();
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Show prompt after 5 seconds if the app is installable
    if (isInstallable) {
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isInstallable]);

  if (!showPrompt || !isInstallable) return null;

  return (
    <div className="w-full bg-primary/5 border-b border-primary/10">
      <div className="max-w-7xl mx-auto p-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Download className="h-4 w-4 text-primary" />
          <p className="text-sm text-muted-foreground">
            Install RogiSetu for a better experience
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="link"
            size="sm"
            onClick={() => {
              installPWA();
              setShowPrompt(false);
            }}
            className="h-8"
          >
            Install Now
          </Button>
          <button
            onClick={() => setShowPrompt(false)}
            className="text-muted-foreground hover:text-foreground p-1"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
} 