// AdMob service - dynamically imports @capacitor-community/admob only on native platforms
// This prevents the web preview from crashing when the native plugin isn't available.

let AdMobModule: any = null;
let isInitialized = false;
let isBannerVisible = false;

const AD_UNIT_IDS = {
  banner: {
    android: 'ca-app-pub-6289432096637084/1857073079',
    ios: 'ca-app-pub-6289432096637084/1857073079',
  },
  interstitial: {
    android: 'ca-app-pub-6289432096637084/4350406874',
    ios: 'ca-app-pub-6289432096637084/4350406874',
  },
  appOpen: {
    android: 'ca-app-pub-6289432096637084/1585610337',
    ios: 'ca-app-pub-6289432096637084/1585610337',
  },
};

const getAdMob = async () => {
  if (AdMobModule) return AdMobModule;
  try {
    AdMobModule = await import('@capacitor-community/admob');
    return AdMobModule;
  } catch (error) {
    console.log('📢 AdMob not available (web mode):', error);
    return null;
  }
};

export const initializeAdMob = async (): Promise<boolean> => {
  if (isInitialized) return true;

  const mod = await getAdMob();
  if (!mod) return false;

  try {
    await mod.AdMob.initialize();

    mod.AdMob.addListener(mod.BannerAdPluginEvents.Loaded, () => {
      console.log('📢 AdMob Banner loaded');
    });
    mod.AdMob.addListener(mod.BannerAdPluginEvents.FailedToLoad, (error: any) => {
      console.log('📢 AdMob Banner failed to load:', error);
    });
    mod.AdMob.addListener(mod.BannerAdPluginEvents.Opened, () => {
      console.log('📢 AdMob Banner opened');
    });
    mod.AdMob.addListener(mod.BannerAdPluginEvents.Closed, () => {
      console.log('📢 AdMob Banner closed');
    });

    isInitialized = true;
    console.log('📢 AdMob initialized successfully');
    return true;
  } catch (error) {
    console.log('📢 AdMob initialization failed:', error);
    return false;
  }
};

export const showBannerAd = async (): Promise<void> => {
  if (isBannerVisible) return;
  const mod = await getAdMob();
  if (!mod) return;

  try {
    await mod.AdMob.showBanner({
      adId: AD_UNIT_IDS.banner.android,
      adSize: mod.BannerAdSize.ADAPTIVE_BANNER,
      position: mod.BannerAdPosition.BOTTOM_CENTER,
      margin: 0,
    });
    isBannerVisible = true;
    console.log('📢 Banner ad shown');
  } catch (error) {
    console.log('📢 Failed to show banner ad:', error);
  }
};

export const hideBannerAd = async (): Promise<void> => {
  if (!isBannerVisible) return;
  const mod = await getAdMob();
  if (!mod) return;

  try {
    await mod.AdMob.hideBanner();
    isBannerVisible = false;
    console.log('📢 Banner ad hidden');
  } catch (error) {
    console.log('📢 Failed to hide banner ad:', error);
  }
};

export const removeBannerAd = async (): Promise<void> => {
  const mod = await getAdMob();
  if (!mod) return;

  try {
    await mod.AdMob.removeBanner();
    isBannerVisible = false;
    console.log('📢 Banner ad removed');
  } catch (error) {
    console.log('📢 Failed to remove banner ad:', error);
  }
};

export const showInterstitialAd = async (): Promise<void> => {
  const mod = await getAdMob();
  if (!mod) return;

  try {
    await mod.AdMob.prepareInterstitial({
      adId: AD_UNIT_IDS.interstitial.android,
    });
    await mod.AdMob.showInterstitial();
    console.log('📢 Interstitial Ad shown');
  } catch (error) {
    console.log('📢 Failed to show Interstitial Ad:', error);
  }
};

export const showAppOpenAd = async (): Promise<void> => {
  const mod = await getAdMob();
  if (!mod) return;

  try {
    await mod.AdMob.prepareInterstitial({
      adId: AD_UNIT_IDS.appOpen.android,
    });
    await mod.AdMob.showInterstitial();
    console.log('📢 App Open Ad shown');
  } catch (error) {
    console.log('📢 Failed to show App Open Ad:', error);
  }
};
