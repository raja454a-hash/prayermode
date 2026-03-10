import { useEffect, useRef } from 'react';
import {
  initializeAdMob,
  showBannerAd,
  hideBannerAd,
  removeBannerAd,
  showAppOpenAd,
} from '@/services/adMobService';

interface UseAdMobOptions {
  isSilentMode: boolean;
}

/**
 * Hook to manage AdMob ads with automatic show/hide based on conditions
 * - Hides ads during prayer (silent mode)
 * - Shows ads for all users outside prayer time
 */
export const useAdMob = ({ isSilentMode }: UseAdMobOptions) => {
  const isInitializedRef = useRef(false);
  const shouldShowAdsRef = useRef(false);

  // Ads show when not in silent mode
  const shouldShowAds = !isSilentMode;

  useEffect(() => {
    const initAds = async () => {
      if (!isInitializedRef.current) {
        await initializeAdMob();
        isInitializedRef.current = true;

        if (shouldShowAds) {
          await showAppOpenAd();
          console.log('📢 App Open Ad triggered on launch');
        }
      }
    };

    initAds();

    return () => {
      removeBannerAd();
    };
  }, []);

  useEffect(() => {
    const manageAds = async () => {
      if (shouldShowAds && !shouldShowAdsRef.current) {
        await showBannerAd();
        shouldShowAdsRef.current = true;
        console.log('📢 Showing ads');
      } else if (!shouldShowAds && shouldShowAdsRef.current) {
        await hideBannerAd();
        shouldShowAdsRef.current = false;
        console.log('📢 Hiding ads (prayer time)');
      }
    };

    if (isInitializedRef.current) {
      manageAds();
    }
  }, [shouldShowAds]);

  return { shouldShowAds };
};
