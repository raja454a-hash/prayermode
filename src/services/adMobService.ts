import { AdMob, BannerAdOptions, BannerAdSize, BannerAdPosition, BannerAdPluginEvents } from '@capacitor-community/admob';

// Test Ad Unit IDs (replace with real IDs in production)
const AD_UNIT_IDS = {
  banner: {
    android: 'ca-app-pub-6289432096637084/1857073079',
    ios: 'ca-app-pub-6289432096637084/1857073079',
  },
  appOpen: {
    android: 'ca-app-pub-6289432096637084/1585610337',
    ios: 'ca-app-pub-6289432096637084/1585610337',
  },
};

let isInitialized = false;
let isBannerVisible = false;

/**
 * Initialize AdMob
 */
export const initializeAdMob = async (): Promise<boolean> => {
  if (isInitialized) return true;

  try {
    await AdMob.initialize();

    // Set up event listeners
    AdMob.addListener(BannerAdPluginEvents.Loaded, () => {
      console.log('📢 AdMob Banner loaded');
    });

    AdMob.addListener(BannerAdPluginEvents.FailedToLoad, (error) => {
      console.log('📢 AdMob Banner failed to load:', error);
    });

    AdMob.addListener(BannerAdPluginEvents.Opened, () => {
      console.log('📢 AdMob Banner opened');
    });

    AdMob.addListener(BannerAdPluginEvents.Closed, () => {
      console.log('📢 AdMob Banner closed');
    });

    isInitialized = true;
    console.log('📢 AdMob initialized successfully');
    return true;
  } catch (error) {
    console.log('📢 AdMob initialization failed (running in web mode):', error);
    return false;
  }
};

/**
 * Show banner ad at the bottom of the screen
 */
export const showBannerAd = async (): Promise<void> => {
  if (isBannerVisible) return;

  try {
    const options: BannerAdOptions = {
      adId: AD_UNIT_IDS.banner.android,
      adSize: BannerAdSize.ADAPTIVE_BANNER,
      position: BannerAdPosition.BOTTOM_CENTER,
      margin: 0,
    };

    await AdMob.showBanner(options);
    isBannerVisible = true;
    console.log('📢 Banner ad shown');
  } catch (error) {
    console.log('📢 Failed to show banner ad (running in web mode):', error);
  }
};

/**
 * Hide banner ad
 */
export const hideBannerAd = async (): Promise<void> => {
  if (!isBannerVisible) return;

  try {
    await AdMob.hideBanner();
    isBannerVisible = false;
    console.log('📢 Banner ad hidden');
  } catch (error) {
    console.log('📢 Failed to hide banner ad (running in web mode):', error);
  }
};

/**
 * Remove banner ad completely
 */
export const removeBannerAd = async (): Promise<void> => {
  try {
    await AdMob.removeBanner();
    isBannerVisible = false;
    console.log('📢 Banner ad removed');
  } catch (error) {
    console.log('📢 Failed to remove banner ad (running in web mode):', error);
  }
};

/**
 * Check if banner is currently visible
 */
export const isBannerAdVisible = (): boolean => {
  return isBannerVisible;
};

/**
 * Show App Open Ad (full screen ad on app launch/foreground)
 */
export const showAppOpenAd = async (): Promise<void> => {
  try {
    await AdMob.prepareInterstitial({
      adId: AD_UNIT_IDS.appOpen.android,
    });
    console.log('📢 App Open Ad prepared, now showing...');
    await AdMob.showInterstitial();
    console.log('📢 App Open Ad shown');
  } catch (error) {
    console.log('📢 Failed to show App Open Ad (running in web mode):', error);
  }
};
