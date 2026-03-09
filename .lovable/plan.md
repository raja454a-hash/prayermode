

## Plan: Add Auto Silent Mode Permissions + DND Permission UI

The app already has the DND logic (`ACCESS_NOTIFICATION_POLICY`, `SilentModePlugin`, `PrayerAlarmReceiver`) and auto silent/restore logic in `silentModeService.ts`. Two things are missing:

1. **Location permissions** in AndroidManifest for GPS
2. **A visible DND permission prompt** in Settings so users can easily grant DND access

### Changes

**1. `android/app/src/main/AndroidManifest-additions.xml`**
Add two location permissions:
```xml
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
```

**2. `src/pages/Settings.tsx`**
Add a new "Permissions" card section with:
- **DND Permission row** — shows current status (granted/not granted) with a button to open system DND settings via `requestDndPermission()` from `nativeSilentMode.ts`
- **Location Permission row** — informational, showing if geolocation is available
- On native platform, check DND permission on mount and display status
- On web, show "Auto-managed" since DND doesn't apply

This ensures users on Android can:
- See if DND permission is granted
- Tap to open system settings and grant it
- Once granted, the existing AlarmManager + PrayerAlarmReceiver flow will automatically enable DND at prayer start and restore normal mode when prayer ends

No changes needed to the silent mode service — it already handles enable/disable DND via `ENABLE_SILENT` and `DISABLE_SILENT` alarm actions.

