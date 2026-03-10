

## Remove Subscription/Premium System — Keep Ads for All Users

### Overview
Remove all subscription, premium, and RevenueCat-related code. The app becomes 100% free with ads always active (except during prayer silent mode).

### Files to Delete
| File | Reason |
|------|--------|
| `src/pages/Subscription.tsx` | Subscription page |
| `src/hooks/useSubscription.ts` | Subscription hook |
| `src/services/purchaseService.ts` | RevenueCat purchase service |
| `supabase/functions/verify-subscription/index.ts` | Edge function for subscription verification |

### Files to Modify

**1. `src/App.tsx`**
- Remove `Subscription` lazy import and `/subscription` route

**2. `src/pages/Index.tsx`**
- Remove `isPremium` variable and Crown button/import
- Remove `!isPremium` check from interstitial ad logic (always show for non-silent)
- Simplify `useAdMob` call — no `isPremium` param needed
- Remove `Crown` from imports
- Remove `subscription_status` reference from `UserMenu`

**3. `src/hooks/useAdMob.ts`**
- Remove `isPremium` from options — ads always show when not in silent mode
- Simplify `shouldShowAds` to just `!isSilentMode`

**4. `src/pages/Settings.tsx`**
- Remove Subscription row (Crown icon, navigate to `/subscription`)
- Remove `Crown` from imports

**5. `src/hooks/useAuth.ts`**
- Remove `subscription_status` from Profile interface
- Remove `parseSubscriptionStatus` function
- Remove `subscription_status` from profile mapping

**6. `src/components/auth/UserMenu.tsx`**
- Remove `subscriptionStatus` prop and status badge logic
- Remove `Crown` import and premium badge

**7. `package.json`**
- Remove `@revenuecat/purchases-capacitor` dependency

### Database Migration
- Drop the `subscription_status` column from `profiles` table
- Drop the RLS policy "Users can update their own profile except subscription" and replace with a simpler update policy
- Drop `payment_transactions` table (no longer needed)

### Edge Function Cleanup
- Delete the `verify-subscription` edge function

