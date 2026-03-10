

## Interstitial Ad — Settings/Schedule Edit سے واپسی پر

### کیا کریں گے
Settings (`/settings`) یا Schedule Edit (`/schedule`) سے واپس Home (`/`) پر آنے پر free users کو ایک full-screen interstitial ad دکھائیں گے۔

### Implementation

**1. `adMobService.ts` — نیا interstitial ad function**
- نیا Ad Unit ID شامل کریں (interstitial کے لیے — ابھی App Open والا ID استعمال ہوگا، یا نیا بنائیں)
- `showInterstitialAd()` function بنائیں جو `prepareInterstitial` + `showInterstitial` call کرے

**2. `Index.tsx` — navigation state detect کریں**
- `useLocation()` سے `location.state` چیک کریں
- اگر `state.from === 'settings'` یا `state.from === 'schedule'` ہو تو interstitial trigger کریں
- صرف free users کے لیے (premium نہیں) اور silent mode نہ ہو

**3. `Settings.tsx` اور `ScheduleEdit.tsx` — back navigation میں state pass کریں**
- `navigate('/')` کو `navigate('/', { state: { from: 'settings' } })` میں بدلیں
- `ScheduleEdit` میں `navigate('/', { state: { from: 'schedule' } })` کریں

### فائلیں
| فائل | تبدیلی |
|------|--------|
| `src/services/adMobService.ts` | `showInterstitialAd()` function شامل کریں |
| `src/pages/Index.tsx` | `useLocation` سے واپسی detect کر کے interstitial trigger |
| `src/pages/Settings.tsx` | Back button میں `state: { from: 'settings' }` |
| `src/pages/ScheduleEdit.tsx` | Back button اور Save میں `state: { from: 'schedule' }` |

### Flow
```text
Settings/Schedule → navigate('/', {state: {from: 'settings'}}) → Index
  ↓
Index useEffect detects state.from
  ↓
if (!isPremium && !isSilentMode) → showInterstitialAd()
  ↓
Clear state to prevent re-trigger
```

