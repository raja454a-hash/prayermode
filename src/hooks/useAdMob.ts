import { useEffect, useRef } from 'react';
import {
  initializeAdMob,
  showBannerAd,
  hideBannerAd,
  removeBannerAd,
  showAppOpenAd,
} from '@/services/adMobService';

interface UseAdMobOptions {
  isPremium: boolean;
  isSilentMode: boolean;
}

/**
 * Hook to manage AdMob ads with automatic show/hide based on conditions
 * - Hides ads for premium users
 * - Hides ads during prayer (silent mode)
 * - Shows ads only for free users outside prayer time
 */
export const useAdMob = ({ isPremium, isSilentMode }: UseAdMobOptions) => {
  const isInitializedRef = useRef(false);
  const shouldShowAdsRef = useRef(false);

  // Determine if ads should be shown
  const shouldShowAds = !isPremium && !isSilentMode;

  useEffect(() => {
    const initAds = async () => {
      if (!isInitializedRef.current) {
        await initializeAdMob();
        isInitializedRef.current = true;

        // Show App Open Ad on first launch (only for free users, not during prayer)
        if (shouldShowAds) {
          await showAppOpenAd();
          console.log('📢 App Open Ad triggered on launch');
        }
      }
    };

    initAds();

    // Cleanup on unmount
    return () => {
      removeBannerAd();
    };
  }, []);

  // Handle showing/hiding ads based on conditions
  useEffect(() => {
    const manageAds = async () => {
      if (shouldShowAds && !shouldShowAdsRef.current) {
        // Conditions met to show ads
        await showBannerAd();
        shouldShowAdsRef.current = true;
        console.log('📢 Showing ads (free user, not in prayer)');
      } else if (!shouldShowAds && shouldShowAdsRef.current) {
        // Conditions no longer met - hide ads
        await hideBannerAd();
        shouldShowAdsRef.current = false;
        
        if (isPremium) {
          console.log('📢 Hiding ads (premium user)');
        } else if (isSilentMode) {
          console.log('📢 Hiding ads (prayer time)');
        }
      }
    };

    if (isInitializedRef.current) {
      manageAds();
    }
  }, [shouldShowAds, isPremium, isSilentMode]);

  return { shouldShowAds };
};
