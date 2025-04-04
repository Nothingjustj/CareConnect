'use client';

import { useState } from 'react';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { Button } from '@/components/ui/button';
import { Bell, BellOff } from 'lucide-react';
import { toast } from 'sonner';

export function NotificationPermission() {
  const { isSupported, permission, requestPermission, subscription, unsubscribeFromPushNotifications } = usePushNotifications();
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleNotifications = async () => {
    if (!isSupported) {
      toast.error('Push notifications are not supported in your browser');
      return;
    }

    setIsLoading(true);
    
    try {
      if (permission === 'granted' && subscription) {
        await unsubscribeFromPushNotifications();
        toast.success('Notifications disabled');
      } else {
        const granted = await requestPermission();
        if (granted) {
          toast.success('Notifications enabled');
        } else {
          toast.error('Permission denied');
        }
      }
    } catch (error) {
      console.error('Error toggling notifications:', error);
      toast.error('Failed to update notification settings');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isSupported) return null;

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleToggleNotifications}
      disabled={isLoading}
      className="flex items-center gap-2"
    >
      {permission === 'granted' && subscription ? (
        <>
          <Bell className="h-4 w-4" />
          <span className="hidden sm:inline">Disable Notifications</span>
        </>
      ) : (
        <>
          <BellOff className="h-4 w-4" />
          <span className="hidden sm:inline">Enable Notifications</span>
        </>
      )}
    </Button>
  );
} 