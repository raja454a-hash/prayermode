

# Fix: Java Source Files Deleted During CI Build

## Problem
CI workflow mein `rm -rf android` command poora `android/` folder delete kar deta hai - jismein hamare custom Java files (SilentModePlugin, PrayerAlarmReceiver, BootReceiver) bhi hain. Phir `setup-android.sh` script inhi files ko usi (ab deleted) directory se copy karne ki koshish karta hai, jo silently fail ho jata hai (`|| true` ki wajah se). Isliye compiler ko `SilentModePlugin` class nahi milti.

## Solution
Java source files ko `android/` se bahar ek naye folder (`native-sources/android/`) mein move karna hai, taaki `rm -rf android` se delete na hon. Script ko update karenge taaki woh naye location se copy kare.

## Changes

### 1. Create `native-sources/android/` directory
Move these 3 files from `android/app/src/main/java/app/lovable/salahsilent/` to `native-sources/android/`:
- `SilentModePlugin.java`
- `PrayerAlarmReceiver.java`
- `BootReceiver.java`

### 2. Update `scripts/setup-android.sh`
Change the `SOURCE_DIR` variable and copy commands to use the new location:

```bash
# Change from:
SOURCE_DIR="android/app/src/main/java/app/lovable/salahsilent"

# Change to:
SOURCE_DIR="native-sources/android"
```

Also remove the `2>/dev/null || true` so copy failures are caught instead of silently ignored.

### 3. No changes needed to:
- `.github/workflows/build-android.yml` (workflow stays the same)
- Java file contents (no code changes needed)
- AndroidManifest patching logic

## Technical Details

**Files to create:**
- `native-sources/android/SilentModePlugin.java` (moved from android/)
- `native-sources/android/PrayerAlarmReceiver.java` (moved from android/)
- `native-sources/android/BootReceiver.java` (moved from android/)

**Files to edit:**
- `scripts/setup-android.sh` - line 10: update `SOURCE_DIR` path

**Files to delete:**
- `android/app/src/main/java/app/lovable/salahsilent/SilentModePlugin.java` (moved)
- `android/app/src/main/java/app/lovable/salahsilent/PrayerAlarmReceiver.java` (moved)  
- `android/app/src/main/java/app/lovable/salahsilent/BootReceiver.java` (moved)

Yeh fix ke baad CI build mein Java files properly copy hongi aur `SilentModePlugin` class mil jayegi.
