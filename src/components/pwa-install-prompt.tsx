'use client';

import { useEffect, useState } from 'react';
import { usePWAInstall } from '@/hooks/usePWAInstall';
import { Button } from '@/components/ui/button';
import { X, Download } from 'lucide-react';
import { motion } from "motion/react"
 
export function PWAInstallPrompt() {
  const { isInstallable, installPWA } = usePWAInstall();
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    if (isInstallable) {
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isInstallable]);

  if (!showPrompt || !isInstallable) return null;

  return (
    <motion.div className="w-full bg-primary/5 border-b border-primary/10"
      initial={{ opacity: 0, filter: "blur(5px)" }}
      whileInView={{ opacity: 1, filter: "blur(0px)" }}
    >
      <div className="max-w-7xl mx-auto p-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Download className="h-4 w-4 text-primary" />
          <p className="text-sm text-foreground">
            Install <strong>CareConnect</strong> app for a better experience.
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
            className="h-8 font-semibold"
          >
            Install Now
          </Button>
          <button
            onClick={() => setShowPrompt(false)}
            className="text-foreground/70 hover:text-foreground p-1"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
} 