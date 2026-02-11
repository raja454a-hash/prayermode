

# GitHub Actions se Automatic APK Build

## Kya hoga?
Jab bhi aap Lovable mein changes karenge aur wo GitHub pe push hongi, ek automatic process chalegi jo aapke liye APK file bana degi. Aapko bas wo APK download karke phone pe install karna hoga - Android Studio ki zaroorat nahi!

## Kaise kaam karega?

1. **GitHub Actions Workflow File** banayenge (`.github/workflows/build-android.yml`)
   - Jab bhi code GitHub pe push hoga, ye automatically chalega
   - Cloud mein Android SDK use karke APK build karega
   - APK file download ke liye available hogi GitHub pe

2. **Build Script** jo ye steps karega:
   - `npm install` - dependencies install
   - `npm run build` - web app build
   - `npx cap add android` - Android project generate
   - Custom Java files (SilentModePlugin, PrayerAlarmReceiver, BootReceiver) ko sahi jagah copy
   - AndroidManifest mein permissions aur receivers add
   - `npx cap sync` - Capacitor sync
   - Gradle se APK build

3. **AndroidManifest Setup Script** - ek helper script jo automatically:
   - Custom permissions add kare
   - BroadcastReceivers register kare
   - AdMob meta-data add kare
   - SilentModePlugin register kare in MainActivity

## APK Download kaise karenge?
1. GitHub pe apne repository mein jayein
2. "Actions" tab pe click karein
3. Latest build pe click karein
4. "Artifacts" section mein APK file milegi - download karein
5. Phone pe install karein (Settings > "Install from unknown sources" enable karna hoga)

## Technical Details

### Files to Create:

1. **`.github/workflows/build-android.yml`** - GitHub Actions workflow
   - Uses: `actions/setup-java@v4` (Java 17)
   - Uses: `actions/setup-node@v4` (Node 20)
   - Android SDK setup via `android-actions/setup-android@v3`
   - Steps: npm install, build, cap add android, copy native files, cap sync, gradle build
   - Uploads APK as artifact

2. **`scripts/setup-android.sh`** - Shell script to:
   - Copy custom Java files to correct Android paths
   - Patch AndroidManifest.xml with permissions and receivers
   - Register SilentModePlugin in MainActivity.java
   - Make the workflow clean and maintainable

### Important Considerations:
- APK will be debug build (unsigned) - phone pe install karne ke liye "Unknown Sources" enable karna hoga
- Har push pe naya APK automatically banega
- Build mein roughly 5-10 minute lagenge
- GitHub Free account pe monthly 2000 minutes milte hain (kaafi hai)

