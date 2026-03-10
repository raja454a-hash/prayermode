import { Purchases, LOG_LEVEL, PurchasesPackage, CustomerInfo, PACKAGE_TYPE } from '@revenuecat/purchases-capacitor';

// Product IDs - configure these in Google Play Console and RevenueCat
export const PRODUCT_IDS = {
  MONTHLY: 'prayermode_premium_monthly',
  YEARLY: 'prayermode_premium_yearly',
};

// Entitlement ID from RevenueCat
const PREMIUM_ENTITLEMENT_ID = 'premium';

let isInitialized = false;

/**
 * Initialize RevenueCat Purchases SDK
 * @param revenueCatApiKey - Your RevenueCat public API key
 * @param appUserId - Optional user ID to sync across devices
 */
export const initializePurchases = async (
  revenueCatApiKey: string,
  appUserId?: string
): Promise<boolean> => {
  if (isInitialized) return true;

  try {
    await Purchases.setLogLevel({ level: import.meta.env.DEV ? LOG_LEVEL.DEBUG : LOG_LEVEL.WARN });
    
    await Purchases.configure({
      apiKey: revenueCatApiKey,
      appUserID: appUserId,
    });

    isInitialized = true;
    console.log('💳 RevenueCat initialized successfully');
    return true;
  } catch (error) {
    console.log('💳 RevenueCat initialization failed (running in web mode):', error);
    return false;
  }
};

/**
 * Get available subscription packages
 */
export const getOfferings = async (): Promise<{
  monthly: PurchasesPackage | null;
  yearly: PurchasesPackage | null;
} | null> => {
  try {
    const offerings = await Purchases.getOfferings();
    
    if (!offerings.current) {
      console.log('💳 No offerings available');
      return null;
    }

    const monthly = offerings.current.availablePackages.find(
      pkg => pkg.packageType === PACKAGE_TYPE.MONTHLY
    ) || null;

    const yearly = offerings.current.availablePackages.find(
      pkg => pkg.packageType === PACKAGE_TYPE.ANNUAL
    ) || null;

    console.log('💳 Offerings loaded:', { monthly, yearly });
    return { monthly, yearly };
  } catch (error) {
    console.log('💳 Failed to get offerings (running in web mode):', error);
    return null;
  }
};

/**
 * Purchase a subscription package
 */
export const purchasePackage = async (
  pkg: PurchasesPackage
): Promise<{ success: boolean; customerInfo?: CustomerInfo; error?: string }> => {
  try {
    const { customerInfo } = await Purchases.purchasePackage({ aPackage: pkg });
    
    const isPremium = customerInfo.entitlements.active[PREMIUM_ENTITLEMENT_ID] !== undefined;
    
    console.log('💳 Purchase successful, isPremium:', isPremium);
    return { success: true, customerInfo };
  } catch (error: any) {
    // User cancelled
    if (error.userCancelled) {
      console.log('💳 Purchase cancelled by user');
      return { success: false, error: 'Purchase cancelled' };
    }
    
    console.log('💳 Purchase failed:', error);
    return { success: false, error: error.message || 'Purchase failed' };
  }
};

/**
 * Restore previous purchases
 */
export const restorePurchases = async (): Promise<{
  success: boolean;
  isPremium: boolean;
  customerInfo?: CustomerInfo;
  error?: string;
}> => {
  try {
    const { customerInfo } = await Purchases.restorePurchases();
    const isPremium = customerInfo.entitlements.active[PREMIUM_ENTITLEMENT_ID] !== undefined;
    
    console.log('💳 Restore successful, isPremium:', isPremium);
    return { success: true, isPremium, customerInfo };
  } catch (error: any) {
    console.log('💳 Restore failed:', error);
    return { success: false, isPremium: false, error: error.message || 'Restore failed' };
  }
};

/**
 * Check current subscription status
 */
export const checkSubscriptionStatus = async (): Promise<{
  isPremium: boolean;
  expirationDate?: string;
  customerInfo?: CustomerInfo;
}> => {
  try {
    const { customerInfo } = await Purchases.getCustomerInfo();
    const premiumEntitlement = customerInfo.entitlements.active[PREMIUM_ENTITLEMENT_ID];
    
    const isPremium = premiumEntitlement !== undefined;
    const expirationDate = premiumEntitlement?.expirationDate || undefined;
    
    console.log('💳 Subscription status:', { isPremium, expirationDate });
    return { isPremium, expirationDate, customerInfo };
  } catch (error) {
    console.log('💳 Failed to check subscription (running in web mode):', error);
    return { isPremium: false };
  }
};

/**
 * Set the app user ID for cross-device sync
 */
export const setUserId = async (userId: string): Promise<void> => {
  try {
    await Purchases.logIn({ appUserID: userId });
    console.log('💳 User ID set:', userId);
  } catch (error) {
    console.log('💳 Failed to set user ID:', error);
  }
};

/**
 * Log out current user (anonymous mode)
 */
export const logOutUser = async (): Promise<void> => {
  try {
    await Purchases.logOut();
    console.log('💳 User logged out from RevenueCat');
  } catch (error) {
    console.log('💳 Failed to log out:', error);
  }
};
