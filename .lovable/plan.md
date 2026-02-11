

# App Open Ad Integration

## Overview
App Open Ad add karenge jo app launch ya foreground mein aane pe dikhega. Ye ad sirf free users ko dikhega, premium users aur prayer time mein nahi.

## Ad Unit ID
- **App Open Ad**: `ca-app-pub-6289432096637084/1585610337`

## Changes

### 1. `src/services/adMobService.ts`
- AD_UNIT_IDS mein `appOpen` key add karenge with ID `ca-app-pub-6289432096637084/1585610337`
- Naya function `showAppOpenAd()` banayenge jo `AdMob.showAppOpenAd()` call karega
- App Open Ad events ke listeners add karenge (Loaded, Failed, Showed, Closed)

### 2. `src/hooks/useAdMob.ts`
- `showAppOpenAd` import karenge adMobService se
- App launch pe (component mount hone pe) ek baar App Open Ad show karenge - sirf free users ke liye
- `showAppOpenAd` function return karenge hook se taake manually bhi trigger kar sakein

### 3. `src/pages/Index.tsx`
- Koi change nahi - useAdMob hook automatically handle karega

## Technical Details
- `@capacitor-community/admob` plugin mein `showAppOpenAd()` method built-in hai
- App Open Ad sirf ek baar dikhega jab app open hoga (mount pe)
- Premium users aur prayer time mein ad skip ho jayegi
- Web mode mein gracefully fail hoga (console log)

