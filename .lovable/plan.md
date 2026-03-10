

## Code Audit Plan — Dead Code, Duplicates & Cleanup

میں نے پورے پروجیکٹ کا تفصیلی آڈٹ کیا ہے۔ نیچے تمام مسائل اور ان کے حل ہیں:

---

### 1. Dead Code (غیر استعمال شدہ کوڈ)

| # | مسئلہ | فائل | تفصیل |
|---|-------|------|--------|
| 1 | `previousMode` variable | `silentModeService.ts:20` | Declare ہوا لیکن کہیں استعمال نہیں ہوا |
| 2 | `isBannerAdVisible()` function | `adMobService.ts:106` | Export ہے لیکن کہیں import/call نہیں ہوا |
| 3 | `silentModeEndTime` in return | `usePrayerTimes.ts:207` | Return ہو رہا ہے لیکن کوئی consumer استعمال نہیں کر رہا |
| 4 | `useAdMob` return values | `useAdMob.ts:76-81` | `shouldShowAds`, `showBannerAd`, `hideBannerAd`, `showAppOpenAd` return ہوتے ہیں لیکن `Index.tsx` میں ان کو destructure نہیں کیا گیا |
| 5 | `payment_transactions` table | Database | Table بنائی گئی لیکن کوڈ میں کہیں استعمال نہیں ہو رہی |
| 6 | Dual toast system | `use-toast.ts` + `sonner` | دو toast systems (`Toaster` + `Sonner`) App.tsx میں load ہو رہے ہیں لیکن صرف `useToast` استعمال ہو رہا ہے، Sonner کہیں call نہیں ہوا |

### 2. Branding Inconsistency (نام کی بے ترتیبی)

| # | جگہ | نام استعمال ہوا |
|---|------|----------------|
| 1 | `Index.tsx` header | "PrayerMode" |
| 2 | `Login.tsx` header | "SalahSilent" |
| 3 | `Signup.tsx` header | "Prayer Mode" |
| 4 | Native package name | `app.lovable.salahsilent` |
| 5 | `capacitor.config.ts` | Needs checking |

**Fix**: سب جگہ ایک نام "Prayer Mode" یا "PrayerMode" رکھنا چاہیے۔

### 3. Settings Page Issues (غیر فعال سوئچز)

| # | مسئلہ | تفصیل |
|---|-------|--------|
| 1 | Dark Mode toggle | `useState(true)` ہے لیکن `next-themes` یا کسی اور theme system سے connected نہیں — toggle کا اثر صفر |
| 2 | Notifications toggle | `useState(true)` ہے لیکن کسی logic سے connected نہیں |

### 4. Contact Form — Fake Submit

`ContactSupport.tsx:37` — فارم submit ہونے پر صرف `setTimeout` سے 1.5 سیکنڈ بعد success دکھاتا ہے۔ اصل میں کوئی email نہیں جاتا۔

### 5. Unused UI Components

`src/components/ui/` فولڈر میں ~40 shadcn components ہیں۔ اصل میں صرف ~12 استعمال ہو رہے ہیں:
- **استعمال شدہ**: button, card, switch, input, label, textarea, toast, toaster, dropdown-menu, badge, tooltip, select, sonner, dialog, progress
- **غیر استعمال شدہ**: accordion, alert-dialog, alert, aspect-ratio, avatar, breadcrumb, calendar, carousel, chart, checkbox, collapsible, command, context-menu, drawer, form, hover-card, input-otp, menubar, navigation-menu, pagination, popover, radio-group, resizable, scroll-area, separator, sheet, sidebar, skeleton, slider, table, tabs, toggle, toggle-group

> Note: غیر استعمال shadcn UI components کو رکھنا عام practice ہے کیونکہ مستقبل میں کام آ سکتے ہیں اور tree-shaking انہیں production build سے نکال دیتا ہے۔ لیکن اگر آپ چاہیں تو ہٹا سکتے ہیں۔

---

### Cleanup Plan (صفائی کا منصوبہ)

**Step 1 — Dead code removal:**
- `silentModeService.ts` سے `previousMode` variable ہٹانا
- `adMobService.ts` سے `isBannerAdVisible()` ہٹانا
- `usePrayerTimes.ts` سے `silentModeEndTime` return سے ہٹانا
- `useAdMob.ts` — return object خالی کرنا (صرف side-effects hook ہے)
- `App.tsx` سے `Sonner` component ہٹانا (استعمال نہیں ہو رہا)

**Step 2 — Branding fix:**
- `Login.tsx` میں "SalahSilent" کو "PrayerMode" میں تبدیل کرنا

**Step 3 — Settings toggles:**
- Dark Mode toggle کو `next-themes` سے connect کرنا یا ہٹانا
- Notifications toggle کو actual notification permission سے connect کرنا یا ہٹانا

**Step 4 — Contact form:**
- فارم کو edge function سے connect کرنا تاکہ اصل میں message محفوظ ہو، یا placeholder comment لگانا

---

### خلاصہ

```text
Dead variables/functions:     3
Unused exports:               2  
Branding inconsistency:       3 جگہ
Non-functional UI toggles:    2
Fake form submission:         1
Unused Sonner toast system:   1
Unused DB table:              1 (payment_transactions)
```

کوئی critical bug یا compile error نہیں ہے۔ سب issues cleanup اور consistency سے متعلق ہیں۔ کیا آپ اس plan کے مطابق صفائی شروع کروں؟

