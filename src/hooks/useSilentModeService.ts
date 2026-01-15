import { useEffect, useRef } from 'react';
import { Prayer } from '@/types/prayer';
import {
  initializeSilentModeService,
  schedulePrayerNotifications,
} from '@/services/silentModeService';

/**
 * Hook to manage the silent mode service lifecycle
 * Initializes the service on mount and reschedules notifications when prayers change
 */
export const useSilentModeService = (prayers: Prayer[]) => {
  const isInitialized = useRef(false);
  const previousPrayers = useRef<string>('');

  // Initialize service on mount
  useEffect(() => {
    if (!isInitialized.current) {
      initializeSilentModeService(prayers);
      isInitialized.current = true;
      previousPrayers.current = JSON.stringify(prayers);
    }
  }, []);

  // Reschedule notifications when prayers change
  useEffect(() => {
    const currentPrayersJson = JSON.stringify(prayers);
    
    if (isInitialized.current && previousPrayers.current !== currentPrayersJson) {
      console.log('🔄 Prayer settings changed, rescheduling notifications...');
      schedulePrayerNotifications(prayers);
      previousPrayers.current = currentPrayersJson;
    }
  }, [prayers]);
};
