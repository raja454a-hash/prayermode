export type PrayerName = 'fajr' | 'zuhr' | 'asr' | 'maghrib' | 'isha' | 'friday';

export interface Prayer {
  id: PrayerName;
  name: string;
  arabicName: string;
  time: string;
  silenceEnabled: boolean;
  silenceDuration: number; // in minutes
  reminderEnabled: boolean;
  reminderMinutes: number; // minutes before prayer
}

