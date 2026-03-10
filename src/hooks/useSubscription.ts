import { useState, useEffect, useCallback } from 'react';
import { PurchasesPackage } from '@revenuecat/purchases-capacitor';
import {
  initializePurchases,
  getOfferings,
  purchasePackage,
  restorePurchases,
  checkSubscriptionStatus,
  setUserId,
  logOutUser,
} from '@/services/purchaseService';

// RevenueCat API Key - loaded from environment variable
const REVENUECAT_API_KEY = import.meta.env.VITE_REVENUECAT_API_KEY || '';

interface UseSubscriptionReturn {
  isLoading: boolean;
  isPremium: boolean;
  expirationDate?: string;
  monthlyPackage: PurchasesPackage | null;
  yearlyPackage: PurchasesPackage | null;
  purchaseMonthly: () => Promise<boolean>;
  purchaseYearly: () => Promise<boolean>;
  restore: () => Promise<boolean>;
  refresh: () => Promise<void>;
  cancel: () => void;
}

export const useSubscription = (userId?: string): UseSubscriptionReturn => {
  const [isLoading, setIsLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);
  const [expirationDate, setExpirationDate] = useState<string | undefined>();
  const [monthlyPackage, setMonthlyPackage] = useState<PurchasesPackage | null>(null);
  const [yearlyPackage, setYearlyPackage] = useState<PurchasesPackage | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize and load offerings
  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      
      // Initialize RevenueCat
      const initialized = await initializePurchases(REVENUECAT_API_KEY, userId);
      setIsInitialized(initialized);

      if (initialized) {
        // Check current subscription status
        const status = await checkSubscriptionStatus();
        setIsPremium(status.isPremium);
        setExpirationDate(status.expirationDate);

        // Load available packages
        const offerings = await getOfferings();
        if (offerings) {
          setMonthlyPackage(offerings.monthly);
          setYearlyPackage(offerings.yearly);
        }
      }

      setIsLoading(false);
    };

    init();
  }, [userId]);

  // Sync user ID when it changes
  useEffect(() => {
    if (isInitialized && userId) {
      setUserId(userId);
    } else if (isInitialized && !userId) {
      logOutUser();
    }
  }, [userId, isInitialized]);

  // Purchase monthly subscription
  const purchaseMonthly = useCallback(async (): Promise<boolean> => {
    if (!monthlyPackage) {
      console.log('💳 Monthly package not available');
      return false;
    }

    setIsLoading(true);
    const result = await purchasePackage(monthlyPackage);
    
    if (result.success) {
      setIsPremium(true);
      const status = await checkSubscriptionStatus();
      setExpirationDate(status.expirationDate);
    }

    setIsLoading(false);
    return result.success;
  }, [monthlyPackage]);

  // Purchase yearly subscription
  const purchaseYearly = useCallback(async (): Promise<boolean> => {
    if (!yearlyPackage) {
      console.log('💳 Yearly package not available');
      return false;
    }

    setIsLoading(true);
    const result = await purchasePackage(yearlyPackage);
    
    if (result.success) {
      setIsPremium(true);
      const status = await checkSubscriptionStatus();
      setExpirationDate(status.expirationDate);
    }

    setIsLoading(false);
    return result.success;
  }, [yearlyPackage]);

  // Restore purchases
  const restore = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    const result = await restorePurchases();
    
    if (result.success) {
      setIsPremium(result.isPremium);
      const status = await checkSubscriptionStatus();
      setExpirationDate(status.expirationDate);
    }

    setIsLoading(false);
    return result.isPremium;
  }, []);

  // Refresh subscription status
  const refresh = useCallback(async () => {
    setIsLoading(true);
    const status = await checkSubscriptionStatus();
    setIsPremium(status.isPremium);
    setExpirationDate(status.expirationDate);
    setIsLoading(false);
  }, []);

  // Cancel — redirect to Play Store subscription management
  const cancel = useCallback(() => {
    window.open('https://play.google.com/store/account/subscriptions', '_blank');
  }, []);

  return {
    isLoading,
    isPremium,
    expirationDate,
    monthlyPackage,
    yearlyPackage,
    purchaseMonthly,
    purchaseYearly,
    restore,
    refresh,
    cancel,
  };
};
