

# Phone Silent Mode Fix

## Problem
App phone ko actually silent nahi kar raha kyunki:
1. Manual silent toggle sirf screen pe status change karta hai, phone ki actual setting nahi badalti
2. Prayer time pe background mein silent mode activate nahi hota - sirf notification aata hai lekin phone silent nahi hota
3. Android ka `PrayerAlarmReceiver` code likha hua hai lekin kabhi use nahi ho raha

## Solution

### 1. Manual Toggle Fix (`src/hooks/usePrayerTimes.ts`)
- `toggleManualSilent` function mein `enableNativeSilentMode()` aur `disableNativeSilentMode()` call karenge
- Ab manual button dabane se phone actually silent hoga

### 2. Native Alarm Scheduling (`src/services/nativeSilentMode.ts`)
- Plugin interface mein naye methods add karenge: `scheduleAlarm()` aur `cancelAllAlarms()`
- Ye Android ke AlarmManager ko use karke background mein PrayerAlarmReceiver trigger karega
- App band hone ke baad bhi kaam karega

### 3. Android Plugin Update (`SilentModePlugin.java`)
- `scheduleAlarm()` method add karenge jo Android AlarmManager use karke exact time pe PrayerAlarmReceiver trigger kare
- `cancelAllAlarms()` method add karenge
- Ye ensure karega ke app band hone ke baad bhi phone silent ho

### 4. Silent Mode Service Update (`src/services/silentModeService.ts`)
- Native platform pe LocalNotifications ke saath saath native alarms bhi schedule karenge
- Notifications sirf user ko dikhaane ke liye, actual silent mode AlarmManager se hoga

### 5. Notification Listener Backup (`src/services/silentModeService.ts`)
- Foreground mein notification listener bhi kaam karta rahega as backup

## Technical Details

```text
Current Flow (broken):
  Prayer Time --> LocalNotification fires
                  --> Listener (only works if app is open)
                  --> enableSilentMode() never called when app closed

Fixed Flow:
  Prayer Time --> AlarmManager triggers PrayerAlarmReceiver
                  --> Directly enables DND/Silent (works even app closed)
              --> LocalNotification shows info to user (visual only)
```

### Files to Change:
1. **`src/hooks/usePrayerTimes.ts`** - Manual toggle mein native API call
2. **`src/services/nativeSilentMode.ts`** - `scheduleAlarm` / `cancelAllAlarms` methods
3. **`android/app/src/main/java/app/lovable/salahsilent/SilentModePlugin.java`** - AlarmManager scheduling
4. **`src/services/silentModeService.ts`** - Native alarms schedule karna alongside notifications

### Important Note
Changes ke baad user ko:
- Git pull karke `npx cap sync` run karna hoga
- App rebuild karni hogi (`npx cap run android`)
- DND permission grant karni hogi (app pehli baar open karne pe prompt aayega)

