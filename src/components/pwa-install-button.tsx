'use client';

import { usePWAInstall } from '@/hooks/usePWAInstall';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

export function PWAInstallButton() {
  const { isInstallable, installPWA } = usePWAInstall();

  if (!isInstallable) return null;

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={installPWA}
      className="flex items-center gap-2"
    >
      <Download className="h-4 w-4" />
      Install App
    </Button>
  );
} 