package app.lovable.salahsilent;

import android.app.NotificationManager;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.media.AudioManager;
import android.os.Build;
import android.util.Log;

/**
 * BroadcastReceiver that handles prayer time alarms for enabling/disabling silent mode.
 * This runs in the background even when the app is closed.
 */
public class PrayerAlarmReceiver extends BroadcastReceiver {
    
    private static final String TAG = "PrayerAlarmReceiver";
    public static final String ACTION_ENABLE_SILENT = "app.lovable.salahsilent.ENABLE_SILENT";
    public static final String ACTION_DISABLE_SILENT = "app.lovable.salahsilent.DISABLE_SILENT";
    public static final String EXTRA_PRAYER_NAME = "prayer_name";

    @Override
    public void onReceive(Context context, Intent intent) {
        String action = intent.getAction();
        String prayerName = intent.getStringExtra(EXTRA_PRAYER_NAME);
        
        Log.d(TAG, "Received alarm: " + action + " for prayer: " + prayerName);

        if (ACTION_ENABLE_SILENT.equals(action)) {
            enableSilentMode(context, prayerName);
        } else if (ACTION_DISABLE_SILENT.equals(action)) {
            disableSilentMode(context, prayerName);
        }
    }

    private void enableSilentMode(Context context, String prayerName) {
        Log.d(TAG, "Enabling silent mode for: " + prayerName);
        
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            NotificationManager notificationManager = 
                (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
            
            if (notificationManager != null && notificationManager.isNotificationPolicyAccessGranted()) {
                // Enable Do Not Disturb mode - only allow alarms
                notificationManager.setInterruptionFilter(NotificationManager.INTERRUPTION_FILTER_ALARMS);
                Log.d(TAG, "DND mode enabled successfully");
                return;
            }
        }
        
        // Fallback to ringer mode silent
        AudioManager audioManager = (AudioManager) context.getSystemService(Context.AUDIO_SERVICE);
        if (audioManager != null) {
            audioManager.setRingerMode(AudioManager.RINGER_MODE_SILENT);
            Log.d(TAG, "Silent ringer mode enabled");
        }
    }

    private void disableSilentMode(Context context, String prayerName) {
        Log.d(TAG, "Disabling silent mode after: " + prayerName);
        
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            NotificationManager notificationManager = 
                (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
            
            if (notificationManager != null && notificationManager.isNotificationPolicyAccessGranted()) {
                // Disable Do Not Disturb mode
                notificationManager.setInterruptionFilter(NotificationManager.INTERRUPTION_FILTER_ALL);
            }
        }
        
        // Restore ringer mode to normal
        AudioManager audioManager = (AudioManager) context.getSystemService(Context.AUDIO_SERVICE);
        if (audioManager != null) {
            audioManager.setRingerMode(AudioManager.RINGER_MODE_NORMAL);
            Log.d(TAG, "Normal ringer mode restored");
        }
    }
}
