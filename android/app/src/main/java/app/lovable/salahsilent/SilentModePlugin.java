package app.lovable.salahsilent;

import android.app.NotificationManager;
import android.content.Context;
import android.content.Intent;
import android.media.AudioManager;
import android.os.Build;
import android.provider.Settings;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "SilentMode")
public class SilentModePlugin extends Plugin {

    @PluginMethod
    public void enableSilentMode(PluginCall call) {
        Context context = getContext();
        
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            NotificationManager notificationManager = 
                (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
            
            if (notificationManager != null && notificationManager.isNotificationPolicyAccessGranted()) {
                // Enable Do Not Disturb mode
                notificationManager.setInterruptionFilter(NotificationManager.INTERRUPTION_FILTER_ALARMS);
                
                JSObject result = new JSObject();
                result.put("success", true);
                result.put("mode", "dnd");
                call.resolve(result);
            } else {
                // Fallback to ringer mode silent
                AudioManager audioManager = (AudioManager) context.getSystemService(Context.AUDIO_SERVICE);
                if (audioManager != null) {
                    audioManager.setRingerMode(AudioManager.RINGER_MODE_SILENT);
                    
                    JSObject result = new JSObject();
                    result.put("success", true);
                    result.put("mode", "silent");
                    call.resolve(result);
                } else {
                    call.reject("Unable to access audio manager");
                }
            }
        } else {
            // For older Android versions
            AudioManager audioManager = (AudioManager) context.getSystemService(Context.AUDIO_SERVICE);
            if (audioManager != null) {
                audioManager.setRingerMode(AudioManager.RINGER_MODE_SILENT);
                
                JSObject result = new JSObject();
                result.put("success", true);
                result.put("mode", "silent");
                call.resolve(result);
            } else {
                call.reject("Unable to access audio manager");
            }
        }
    }

    @PluginMethod
    public void disableSilentMode(PluginCall call) {
        Context context = getContext();
        
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
            
            JSObject result = new JSObject();
            result.put("success", true);
            call.resolve(result);
        } else {
            call.reject("Unable to access audio manager");
        }
    }

    @PluginMethod
    public void checkDndPermission(PluginCall call) {
        Context context = getContext();
        boolean hasPermission = false;
        
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            NotificationManager notificationManager = 
                (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
            
            if (notificationManager != null) {
                hasPermission = notificationManager.isNotificationPolicyAccessGranted();
            }
        } else {
            // DND permission not required for older versions
            hasPermission = true;
        }
        
        JSObject result = new JSObject();
        result.put("granted", hasPermission);
        call.resolve(result);
    }

    @PluginMethod
    public void requestDndPermission(PluginCall call) {
        Context context = getContext();
        
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            NotificationManager notificationManager = 
                (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
            
            if (notificationManager != null && !notificationManager.isNotificationPolicyAccessGranted()) {
                Intent intent = new Intent(Settings.ACTION_NOTIFICATION_POLICY_ACCESS_SETTINGS);
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                context.startActivity(intent);
            }
        }
        
        JSObject result = new JSObject();
        result.put("opened", true);
        call.resolve(result);
    }

    @PluginMethod
    public void getSilentModeStatus(PluginCall call) {
        Context context = getContext();
        AudioManager audioManager = (AudioManager) context.getSystemService(Context.AUDIO_SERVICE);
        
        if (audioManager != null) {
            int ringerMode = audioManager.getRingerMode();
            boolean isSilent = ringerMode == AudioManager.RINGER_MODE_SILENT || 
                              ringerMode == AudioManager.RINGER_MODE_VIBRATE;
            
            String mode;
            switch (ringerMode) {
                case AudioManager.RINGER_MODE_SILENT:
                    mode = "silent";
                    break;
                case AudioManager.RINGER_MODE_VIBRATE:
                    mode = "vibrate";
                    break;
                default:
                    mode = "normal";
            }
            
            JSObject result = new JSObject();
            result.put("isSilent", isSilent);
            result.put("mode", mode);
            call.resolve(result);
        } else {
            call.reject("Unable to access audio manager");
        }
    }
}
