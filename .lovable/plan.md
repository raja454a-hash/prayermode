

## Subscription Cancel کرنا

### کیا کریں گے
Premium users کو "Cancel Subscription" کا آپشن دیں گے۔ Google Play subscriptions RevenueCat/Play Store سے manage ہوتی ہیں، اس لیے cancellation کا عمل Play Store کی subscription management page پر redirect کرے گا (یہ standard practice ہے — Google policy کے مطابق cancellation Play Store سے ہوتی ہے)۔ ساتھ ہی backend status بھی `free` پر update ہوگا۔

### Implementation

**1. `Subscription.tsx` — Premium section میں Cancel button شامل کریں**
- "You're Premium!" card میں ایک "Cancel Subscription" button شامل کریں
- Cancel پر:
  - Confirmation dialog دکھائیں (AlertDialog)
  - User confirm کرے تو Google Play subscription management URL کھولیں (`https://play.google.com/store/account/subscriptions`)
  - Backend status `free` پر update کریں via `verify-subscription` edge function

**2. `useSubscription.ts` — cancel function شامل کریں**
- نیا `cancelSubscription()` function جو Play Store subscriptions page open کرے
- Status refresh کرے cancel کے بعد

### فائلیں
| فائل | تبدیلی |
|------|--------|
| `src/pages/Subscription.tsx` | Cancel button + confirmation dialog شامل کریں |
| `src/hooks/useSubscription.ts` | `cancel` function expose کریں |

### Flow
```text
Premium User → Cancel Button → Confirmation Dialog → Yes
  ↓
Open Play Store Subscriptions Page (user cancels there)
  ↓
Backend status → 'free' via edge function
  ↓
Profile refresh → UI updates to show free plan
```

### Note
Google Play policy کے مطابق actual cancellation صرف Play Store سے ہو سکتی ہے۔ App صرف redirect کر سکتی ہے اور backend status update کر سکتی ہے۔

