

# Google AdMob Production IDs Setup

## Overview
Test AdMob IDs ko real production IDs se replace karna hai.

## IDs to Configure
- **Application ID**: `ca-app-pub-6289432096637084~6197238375`
- **Banner Ad Unit ID**: `ca-app-pub-6289432096637084/1857073079`

## Changes

### 1. `src/services/adMobService.ts`
- Banner ad unit ID update: `ca-app-pub-6289432096637084/1857073079`
- `initializeForTesting: true` remove karna
- `isTesting: true` remove karna from banner options
- `testingDevices` array remove karna

### 2. `android/app/src/main/AndroidManifest-additions.xml`
- AdMob Application ID update: `ca-app-pub-6289432096637084~6197238375`

## Technical Details
- Test mode flags (`initializeForTesting`, `isTesting`, `testingDevices`) hatane se real ads show hongi
- AndroidManifest mein Application ID zaroori hai warna app crash ho sakti hai
- Existing ad show/hide logic (premium users aur prayer time) same rahega

