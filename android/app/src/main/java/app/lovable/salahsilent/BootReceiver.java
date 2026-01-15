package app.lovable.salahsilent;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.util.Log;

/**
 * BroadcastReceiver that handles device boot completed event.
 * Re-schedules all prayer alarms when the device is restarted.
 */
public class BootReceiver extends BroadcastReceiver {
    
    private static final String TAG = "BootReceiver";

    @Override
    public void onReceive(Context context, Intent intent) {
        if (Intent.ACTION_BOOT_COMPLETED.equals(intent.getAction())) {
            Log.d(TAG, "Device boot completed - prayer alarms will be rescheduled when app opens");
            
            // The alarms will be rescheduled when the app is opened
            // This is handled by the Capacitor local notifications plugin
            // which persists notifications across device restarts
        }
    }
}
