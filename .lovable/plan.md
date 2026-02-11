

# Privacy Policy Page

## Overview
Contact Support page jaisa hi ek Privacy Policy page banayenge, same design pattern follow karke.

## Changes

### 1. `src/pages/PrivacyPolicy.tsx` (New File)
- Settings jaisa header with back button (navigate to `/settings`)
- Card-based layout mein Privacy Policy content:
  - Introduction / App ka naam "Prayer Mode"
  - Information Collection (kya data collect hota hai)
  - How We Use Information
  - Data Storage and Security
  - Third-Party Services (AdMob, RevenueCat)
  - Children's Privacy
  - Changes to Policy
  - Contact Us section (support@prayermode.app link)
- Same styling: `bg-background geometric-pattern`, `max-w-md mx-auto`

### 2. `src/App.tsx`
- `/privacy` route add karenge
- `PrivacyPolicy` component import karenge

### 3. `src/pages/Settings.tsx`
- "Privacy Policy" button ko update karenge - "Coming Soon" toast ki jagah `/privacy` pe navigate karega

