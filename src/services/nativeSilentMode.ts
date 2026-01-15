import { registerPlugin } from '@capacitor/core';

/**
 * Native Silent Mode Plugin Interface
 * Provides access to Android Do Not Disturb and audio controls
 */
interface SilentModePlugin {
  enableSilentMode(): Promise<{ success: boolean; mode: string }>;
  disableSilentMode(): Promise<{ success: boolean }>;
  checkDndPermission(): Promise<{ granted: boolean }>;
  requestDndPermission(): Promise<{ opened: boolean }>;
  getSilentModeStatus(): Promise<{ isSilent: boolean; mode: string }>;
}

// Register the native plugin
const SilentMode = registerPlugin<SilentModePlugin>('SilentMode');

/**
 * Enable silent/DND mode on the device
 */
export const enableNativeSilentMode = async (): Promise<boolean> => {
  try {
    const result = await SilentMode.enableSilentMode();
    console.log('🔇 Native silent mode enabled:', result);
    return result.success;
  } catch (error) {
    console.log('Failed to enable native silent mode (web fallback):', error);
    return false;
  }
};

/**
 * Disable silent/DND mode on the device
 */
export const disableNativeSilentMode = async (): Promise<boolean> => {
  try {
    const result = await SilentMode.disableSilentMode();
    console.log('🔊 Native silent mode disabled:', result);
    return result.success;
  } catch (error) {
    console.log('Failed to disable native silent mode (web fallback):', error);
    return false;
  }
};

/**
 * Check if DND permission is granted
 */
export const checkDndPermission = async (): Promise<boolean> => {
  try {
    const result = await SilentMode.checkDndPermission();
    console.log('🔐 DND permission status:', result.granted);
    return result.granted;
  } catch (error) {
    console.log('Failed to check DND permission (web fallback):', error);
    return false;
  }
};

/**
 * Request DND permission - opens system settings
 */
export const requestDndPermission = async (): Promise<void> => {
  try {
    await SilentMode.requestDndPermission();
    console.log('🔐 DND permission settings opened');
  } catch (error) {
    console.log('Failed to request DND permission (web fallback):', error);
  }
};

/**
 * Get current silent mode status
 */
export const getSilentModeStatus = async (): Promise<{ isSilent: boolean; mode: string }> => {
  try {
    const result = await SilentMode.getSilentModeStatus();
    return result;
  } catch (error) {
    console.log('Failed to get silent mode status (web fallback):', error);
    return { isSilent: false, mode: 'unknown' };
  }
};

/**
 * Check if running on native platform
 */
export const isNativePlatform = (): boolean => {
  return typeof (window as any).Capacitor !== 'undefined' && 
         (window as any).Capacitor.isNativePlatform();
};
