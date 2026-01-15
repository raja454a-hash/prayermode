import { LocalNotifications } from '@capacitor/local-notifications';
import { Prayer } from '@/types/prayer';

// Notification IDs
const NOTIFICATION_BASE_ID = 1000;
const SILENT_START_OFFSET = 0;
const SILENT_END_OFFSET = 100;
const REMINDER_OFFSET = 200;

/**
 * Request permission for local notifications
 */
export const requestNotificationPermission = async (): Promise<boolean> => {
  try {
    const permission = await LocalNotifications.requestPermissions();
    return permission.display === 'granted';
  } catch (error) {
    console.log('Notification permission request failed (running in web mode):', error);
    return false;
  }
};

/**
 * Schedule silent mode notifications for all prayers
 * This schedules two notifications per prayer:
 * 1. At prayer start time - to trigger silent mode
 * 2. After duration ends - to restore normal mode
 */
export const schedulePrayerNotifications = async (prayers: Prayer[]): Promise<void> => {
  try {
    // First, cancel all existing notifications
    await cancelAllNotifications();

    const now = new Date();
    const notifications = [];

    // Schedule for the next 7 days to handle Friday/weekday logic
    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
      const targetDate = new Date(now);
      targetDate.setDate(targetDate.getDate() + dayOffset);
      const isFriday = targetDate.getDay() === 5;

      // Filter prayers based on day
      const dayPrayers = prayers.filter(p => {
        if (isFriday) {
          return p.id !== 'zuhr'; // On Friday, use Jumu'ah instead of Zuhr
        } else {
          return p.id !== 'friday'; // Other days, skip Jumu'ah
        }
      });

      for (let i = 0; i < dayPrayers.length; i++) {
        const prayer = dayPrayers[i];
        const [hours, minutes] = prayer.time.split(':').map(Number);
        
        // Calculate prayer start time for the target day
        const startTime = new Date(targetDate);
        startTime.setHours(hours, minutes, 0, 0);
        
        // Skip if the time has already passed
        if (startTime <= now) continue;

        // Unique ID based on day offset and prayer index
        const baseId = NOTIFICATION_BASE_ID + (dayOffset * 1000) + (i * 10);

        // Schedule reminder notification if enabled
        if (prayer.reminderEnabled && prayer.reminderMinutes > 0) {
          const reminderTime = new Date(startTime);
          reminderTime.setMinutes(reminderTime.getMinutes() - prayer.reminderMinutes);
          
          if (reminderTime > now) {
            notifications.push({
              id: baseId + REMINDER_OFFSET,
              title: `🕌 ${prayer.name} in ${prayer.reminderMinutes} minutes`,
              body: `Prepare for ${prayer.name} prayer`,
              schedule: { at: reminderTime },
              extra: {
                action: 'REMINDER',
                prayerId: prayer.id,
                prayerName: prayer.name,
              },
            });
          }
        }

        // Schedule silent mode notifications if enabled
        if (prayer.silenceEnabled) {
          // Calculate end time based on duration
          const endTime = new Date(startTime);
          endTime.setMinutes(endTime.getMinutes() + prayer.silenceDuration);

          // Notification to start silent mode
          notifications.push({
            id: baseId + SILENT_START_OFFSET,
            title: `🔇 ${prayer.name} - Silent Mode`,
            body: `Phone entering silent mode for ${prayer.silenceDuration} minutes`,
            schedule: { at: startTime },
            extra: {
              action: 'ENABLE_SILENT',
              prayerId: prayer.id,
              prayerName: prayer.name,
            },
          });

          // Notification to end silent mode
          notifications.push({
            id: baseId + SILENT_END_OFFSET,
            title: `🔊 ${prayer.name} - Prayer Complete`,
            body: 'Phone returning to normal mode',
            schedule: { at: endTime },
            extra: {
              action: 'DISABLE_SILENT',
              prayerId: prayer.id,
              prayerName: prayer.name,
            },
          });
        }
      }
    }

    if (notifications.length > 0) {
      await LocalNotifications.schedule({ notifications });
      console.log(`📅 Scheduled ${notifications.length} notifications for prayer times (next 7 days)`);
    }
  } catch (error) {
    console.log('Failed to schedule notifications (running in web mode):', error);
  }
};

/**
 * Cancel all scheduled notifications
 */
export const cancelAllNotifications = async (): Promise<void> => {
  try {
    const pending = await LocalNotifications.getPending();
    if (pending.notifications.length > 0) {
      await LocalNotifications.cancel({
        notifications: pending.notifications,
      });
      console.log(`🗑️ Cancelled ${pending.notifications.length} pending notifications`);
    }
  } catch (error) {
    console.log('Failed to cancel notifications (running in web mode):', error);
  }
};

/**
 * Listen for notification actions
 * In a native app, this would trigger the Do Not Disturb API
 */
export const setupNotificationListeners = (): void => {
  try {
    LocalNotifications.addListener('localNotificationReceived', (notification) => {
      console.log('📬 Notification received:', notification);
      
      const action = notification.extra?.action;
      if (action === 'ENABLE_SILENT') {
        console.log('🔇 NATIVE: Activating Do Not Disturb mode');
        // In native app: NativeSilentMode.enable()
      } else if (action === 'DISABLE_SILENT') {
        console.log('🔊 NATIVE: Deactivating Do Not Disturb mode');
        // In native app: NativeSilentMode.disable()
      } else if (action === 'REMINDER') {
        console.log(`🕌 REMINDER: ${notification.extra?.prayerName} prayer coming up`);
        // In native app: Show reminder notification / vibrate
      }
    });

    LocalNotifications.addListener('localNotificationActionPerformed', (notification) => {
      console.log('👆 Notification action performed:', notification);
    });

    console.log('🎧 Notification listeners set up');
  } catch (error) {
    console.log('Failed to setup notification listeners (running in web mode):', error);
  }
};

/**
 * Initialize the silent mode service
 */
export const initializeSilentModeService = async (prayers: Prayer[]): Promise<void> => {
  console.log('🚀 Initializing SalahSilent service...');
  
  const hasPermission = await requestNotificationPermission();
  
  if (hasPermission) {
    setupNotificationListeners();
    await schedulePrayerNotifications(prayers);
    console.log('✅ SalahSilent service initialized successfully');
  } else {
    console.log('⚠️ Notification permission not granted - silent mode scheduling disabled');
  }
};
