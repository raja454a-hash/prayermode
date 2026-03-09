

## Verification Result

The GPS location code is correctly implemented — no console errors. In the preview iframe, the browser may block geolocation permissions, so it falls back to the cached localStorage value or "Your Location". On a real device or the published URL, it will detect the actual city.

## Plan: Add Refresh Location Button

Add a small refresh icon button next to the location text in the header that re-triggers geolocation.

### Changes

**1. `src/hooks/useGeolocation.ts`** — Extract the location fetch logic into a `refresh` function and expose it. Add a `refreshing` state separate from initial load.

**2. `src/pages/Index.tsx`** — Add a `RefreshCw` icon button next to the location name that calls `refresh()`. Show a spin animation while refreshing.

### UI Detail

```text
PrayerMode
📍 Cairo [↻]     ← small refresh button, spins while loading
```

The button will be a ghost icon button (16x16) using `RefreshCw` from lucide-react, with `animate-spin` class applied during refresh.

