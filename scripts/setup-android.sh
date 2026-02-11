#!/bin/bash
set -e

echo "🔧 Setting up Android native files..."

# Paths
ANDROID_JAVA_DIR="android/app/src/main/java/app/lovable/salahsilent"
MANIFEST="android/app/src/main/AndroidManifest.xml"
MAIN_ACTIVITY="android/app/src/main/java/app/lovable/ab6a103a2b2c41e886e0e52e98783e98/MainActivity.java"
SOURCE_DIR="android/app/src/main/java/app/lovable/salahsilent"

# Step 1: Create package directory and copy Java files
echo "📂 Copying custom Java files..."
mkdir -p "$ANDROID_JAVA_DIR"
cp "$SOURCE_DIR/SilentModePlugin.java" "$ANDROID_JAVA_DIR/" 2>/dev/null || true
cp "$SOURCE_DIR/PrayerAlarmReceiver.java" "$ANDROID_JAVA_DIR/" 2>/dev/null || true
cp "$SOURCE_DIR/BootReceiver.java" "$ANDROID_JAVA_DIR/" 2>/dev/null || true

# Step 2: Patch AndroidManifest.xml - Add permissions before <application>
echo "📝 Patching AndroidManifest.xml with permissions..."
sed -i '/<application/i \
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />\
    <uses-permission android:name="android.permission.ACCESS_NOTIFICATION_POLICY" />\
    <uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />\
    <uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />\
    <uses-permission android:name="android.permission.SCHEDULE_EXACT_ALARM" />\
    <uses-permission android:name="android.permission.USE_EXACT_ALARM" />\
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE" />\
    <uses-permission android:name="android.permission.WAKE_LOCK" />\
    <uses-permission android:name="android.permission.VIBRATE" />' "$MANIFEST"

# Step 3: Add receivers and AdMob meta-data before </application>
echo "📝 Adding receivers and AdMob meta-data..."
sed -i '/<\/application>/i \
        <receiver\
            android:name="app.lovable.salahsilent.PrayerAlarmReceiver"\
            android:enabled="true"\
            android:exported="false">\
            <intent-filter>\
                <action android:name="app.lovable.salahsilent.ENABLE_SILENT" />\
                <action android:name="app.lovable.salahsilent.DISABLE_SILENT" />\
            </intent-filter>\
        </receiver>\
        <receiver\
            android:name="app.lovable.salahsilent.BootReceiver"\
            android:enabled="true"\
            android:exported="false">\
            <intent-filter>\
                <action android:name="android.intent.action.BOOT_COMPLETED" />\
            </intent-filter>\
        </receiver>\
        <meta-data\
            android:name="com.google.android.gms.ads.APPLICATION_ID"\
            android:value="ca-app-pub-6289432096637084~6197238375" />' "$MANIFEST"

# Step 4: Register SilentModePlugin in MainActivity
echo "📝 Registering SilentModePlugin in MainActivity..."

# Find the actual MainActivity path (Capacitor generates it based on appId)
MAIN_ACTIVITY_FILE=$(find android/app/src/main/java -name "MainActivity.java" | head -1)

if [ -n "$MAIN_ACTIVITY_FILE" ]; then
  # Add import for SilentModePlugin
  sed -i '/^import com.getcapacitor.BridgeActivity;/a import app.lovable.salahsilent.SilentModePlugin;' "$MAIN_ACTIVITY_FILE"
  
  # Add onCreate method to register plugin
  sed -i '/public class MainActivity extends BridgeActivity/a \
    @Override\
    public void onCreate(android.os.Bundle savedInstanceState) {\
        registerPlugin(SilentModePlugin.class);\
        super.onCreate(savedInstanceState);\
    }' "$MAIN_ACTIVITY_FILE"
  
  echo "✅ SilentModePlugin registered in: $MAIN_ACTIVITY_FILE"
else
  echo "⚠️ MainActivity.java not found!"
fi

echo "✅ Android setup complete!"
