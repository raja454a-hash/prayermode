import { useState, useEffect, useCallback } from 'react';
import { Prayer, PrayerName } from '@/types/prayer';

// Sample prayer times - in production, these would come from an API based on location
const getDefaultPrayerTimes = (): Prayer[] => {
  const today = new Date();
  const isFriday = today.getDay() === 5;
  
  return [
    { id: 'fajr', name: 'Fajr', arabicName: 'الفجر', time: '05:30', silenceEnabled: true, silenceDuration: 20 },
    { id: 'zuhr', name: isFriday ? 'Jumu\'ah' : 'Zuhr', arabicName: isFriday ? 'الجمعة' : 'الظهر', time: '12:30', silenceEnabled: true, silenceDuration: isFriday ? 60 : 20 },
    { id: 'asr', name: 'Asr', arabicName: 'العصر', time: '15:45', silenceEnabled: true, silenceDuration: 15 },
    { id: 'maghrib', name: 'Maghrib', arabicName: 'المغرب', time: '18:20', silenceEnabled: true, silenceDuration: 15 },
    { id: 'isha', name: 'Isha', arabicName: 'العشاء', time: '19:45', silenceEnabled: true, silenceDuration: 20 },
  ];
};

export const usePrayerTimes = () => {
  const [prayers, setPrayers] = useState<Prayer[]>(getDefaultPrayerTimes);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentPrayer, setCurrentPrayer] = useState<PrayerName | null>(null);
  const [nextPrayer, setNextPrayer] = useState<Prayer | null>(null);
  const [isSilentMode, setIsSilentMode] = useState(false);

  // Update current time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Calculate current and next prayer
  useEffect(() => {
    const now = currentTime;
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();
    const currentTimeInMinutes = currentHours * 60 + currentMinutes;

    let foundCurrent: PrayerName | null = null;
    let foundNext: Prayer | null = null;

    for (let i = 0; i < prayers.length; i++) {
      const prayer = prayers[i];
      const [hours, minutes] = prayer.time.split(':').map(Number);
      const prayerTimeInMinutes = hours * 60 + minutes;
      const prayerEndTimeInMinutes = prayerTimeInMinutes + prayer.silenceDuration;

      // Check if we're currently in this prayer time
      if (currentTimeInMinutes >= prayerTimeInMinutes && currentTimeInMinutes < prayerEndTimeInMinutes) {
        foundCurrent = prayer.id;
        if (prayer.silenceEnabled) {
          setIsSilentMode(true);
        }
      }

      // Find next prayer
      if (currentTimeInMinutes < prayerTimeInMinutes && !foundNext) {
        foundNext = prayer;
      }
    }

    // If no current prayer and we were in silent mode, turn it off
    if (!foundCurrent && isSilentMode) {
      setIsSilentMode(false);
    }

    // If no next prayer found, the next is Fajr (tomorrow)
    if (!foundNext && prayers.length > 0) {
      foundNext = prayers[0];
    }

    setCurrentPrayer(foundCurrent);
    setNextPrayer(foundNext);
  }, [currentTime, prayers, isSilentMode]);

  const toggleSilenceForPrayer = useCallback((prayerId: PrayerName) => {
    setPrayers(prev => prev.map(p => 
      p.id === prayerId ? { ...p, silenceEnabled: !p.silenceEnabled } : p
    ));
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

  return {
    prayers,
    currentTime,
    currentPrayer,
    nextPrayer,
    isSilentMode,
    toggleSilenceForPrayer,
    getTimeUntilNextPrayer,
  };
};
