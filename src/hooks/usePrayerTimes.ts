import { useState, useEffect, useCallback, useRef } from 'react';
import { enableNativeSilentMode, disableNativeSilentMode, isNativePlatform } from '@/services/nativeSilentMode';
import { Prayer, PrayerName } from '@/types/prayer';

const STORAGE_KEY = 'prayermode_prayers';

const getDefaultPrayerTimes = (): Prayer[] => {
  return [
    { id: 'fajr', name: 'Fajr', arabicName: 'الفجر', time: '05:30', silenceEnabled: true, silenceDuration: 20, reminderEnabled: true, reminderMinutes: 10 },
    { id: 'zuhr', name: 'Zuhr', arabicName: 'الظهر', time: '12:30', silenceEnabled: true, silenceDuration: 20, reminderEnabled: true, reminderMinutes: 10 },
    { id: 'asr', name: 'Asr', arabicName: 'العصر', time: '15:45', silenceEnabled: true, silenceDuration: 15, reminderEnabled: true, reminderMinutes: 10 },
    { id: 'maghrib', name: 'Maghrib', arabicName: 'المغرب', time: '18:20', silenceEnabled: true, silenceDuration: 15, reminderEnabled: true, reminderMinutes: 10 },
    { id: 'isha', name: 'Isha', arabicName: 'العشاء', time: '19:45', silenceEnabled: true, silenceDuration: 20, reminderEnabled: true, reminderMinutes: 10 },
    { id: 'friday', name: "Jumu'ah", arabicName: 'الجمعة', time: '13:00', silenceEnabled: true, silenceDuration: 45, reminderEnabled: true, reminderMinutes: 15 },
  ];
};

const loadPrayersFromStorage = (): Prayer[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to load prayers from storage:', e);
  }
  return getDefaultPrayerTimes();
};

const savePrayersToStorage = (prayers: Prayer[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prayers));
  } catch (e) {
    console.error('Failed to save prayers to storage:', e);
  }
};

export const usePrayerTimes = () => {
  const [prayers, setPrayers] = useState<Prayer[]>(loadPrayersFromStorage);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentPrayer, setCurrentPrayer] = useState<PrayerName | null>(null);
  const [nextPrayer, setNextPrayer] = useState<Prayer | null>(null);
  const [isSilentMode, setIsSilentMode] = useState(false);
  const [silentModeEndTime, setSilentModeEndTime] = useState<Date | null>(null);
  const [isManualSilent, setIsManualSilent] = useState(false);
  
  // Track previous silent mode state to detect transitions
  const prevSilentModeRef = useRef(false);

  // Toggle manual silent mode
  const toggleManualSilent = useCallback(async () => {
    const newState = !isManualSilent;
    setIsManualSilent(newState);
    
    if (isNativePlatform()) {
      if (newState) {
        console.log('🔇 MANUAL SILENT MODE ENABLED');
        await enableNativeSilentMode();
      } else {
        console.log('🔊 MANUAL SILENT MODE DISABLED');
        await disableNativeSilentMode();
      }
    } else {
      console.log(newState ? '🔇 Manual silent (web mode)' : '🔊 Manual normal (web mode)');
    }
  }, [isManualSilent]);

  // Update current time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Calculate current and next prayer, manage silent mode
  useEffect(() => {
    const now = currentTime;
    const isFriday = now.getDay() === 5;
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();
    const currentTimeInMinutes = currentHours * 60 + currentMinutes;

    let foundCurrent: PrayerName | null = null;
    let foundNext: Prayer | null = null;
    let shouldBeSilent = false;
    let silentEndTime: Date | null = null;

    // Filter prayers based on day - on Friday, skip Zuhr and use Jumu'ah; other days skip Jumu'ah
    const todaysPrayers = prayers.filter(p => {
      if (isFriday) {
        return p.id !== 'zuhr'; // On Friday, use Jumu'ah instead of Zuhr
      } else {
        return p.id !== 'friday'; // Other days, skip Jumu'ah
      }
    });

    for (let i = 0; i < todaysPrayers.length; i++) {
      const prayer = todaysPrayers[i];
      const [hours, minutes] = prayer.time.split(':').map(Number);
      const prayerTimeInMinutes = hours * 60 + minutes;
      const prayerEndTimeInMinutes = prayerTimeInMinutes + prayer.silenceDuration;

      // Check if we're currently in this prayer time
      if (currentTimeInMinutes >= prayerTimeInMinutes && currentTimeInMinutes < prayerEndTimeInMinutes) {
        foundCurrent = prayer.id;
        
        if (prayer.silenceEnabled) {
          shouldBeSilent = true;
          
          // Calculate when silent mode should end
          const endTime = new Date(now);
          endTime.setHours(hours, minutes + prayer.silenceDuration, 0, 0);
          silentEndTime = endTime;
        }
      }

      // Find next prayer
      if (currentTimeInMinutes < prayerTimeInMinutes && !foundNext) {
        foundNext = prayer;
      }
    }

    // If no next prayer found, the next is Fajr (tomorrow)
    if (!foundNext && todaysPrayers.length > 0) {
      foundNext = todaysPrayers[0];
    }

    setCurrentPrayer(foundCurrent);
    setNextPrayer(foundNext);
    setIsSilentMode(shouldBeSilent);
    setSilentModeEndTime(silentEndTime);

    // Detect transitions for native notification
    if (shouldBeSilent !== prevSilentModeRef.current) {
      if (shouldBeSilent) {
        // Entering silent mode
        console.log('🔇 SILENT MODE ACTIVATED - Phone should go silent now');
        // In native app, this would call: await SilentMode.enable();
      } else {
        // Exiting silent mode
        console.log('🔊 SILENT MODE DEACTIVATED - Phone should return to normal');
        // In native app, this would call: await SilentMode.disable();
      }
      prevSilentModeRef.current = shouldBeSilent;
    }
  }, [currentTime, prayers]);

  const toggleSilenceForPrayer = useCallback((prayerId: PrayerName) => {
    setPrayers(prev => {
      const updated = prev.map(p =>
        p.id === prayerId ? { ...p, silenceEnabled: !p.silenceEnabled } : p
      );
      savePrayersToStorage(updated);
      return updated;
    });
  }, []);

  const updatePrayers = useCallback((newPrayers: Prayer[]) => {
    setPrayers(newPrayers);
    savePrayersToStorage(newPrayers);
  }, []);

  const getTimeUntilNextPrayer = useCallback(() => {
    if (!nextPrayer) return null;

    const now = currentTime;
    const [hours, minutes] = nextPrayer.time.split(':').map(Number);
    const prayerTime = new Date(now);
    prayerTime.setHours(hours, minutes, 0, 0);

    // If the prayer time has passed, it's tomorrow
    if (prayerTime <= now) {
      prayerTime.setDate(prayerTime.getDate() + 1);
    }

    const diff = prayerTime.getTime() - now.getTime();
    const diffHours = Math.floor(diff / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const diffSeconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { hours: diffHours, minutes: diffMinutes, seconds: diffSeconds };
  }, [currentTime, nextPrayer]);

  const getTimeUntilSilentModeEnds = useCallback(() => {
    if (!silentModeEndTime || !isSilentMode) return null;

    const now = currentTime;
    const diff = silentModeEndTime.getTime() - now.getTime();
    
    if (diff <= 0) return null;

    const diffMinutes = Math.floor(diff / (1000 * 60));
    const diffSeconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { minutes: diffMinutes, seconds: diffSeconds };
  }, [currentTime, silentModeEndTime, isSilentMode]);

  return {
    prayers,
    currentTime,
    currentPrayer,
    nextPrayer,
    isSilentMode: isSilentMode || isManualSilent,
    isManualSilent,
    toggleSilenceForPrayer,
    toggleManualSilent,
    updatePrayers,
    getTimeUntilNextPrayer,
    getTimeUntilSilentModeEnds,
  };
};
