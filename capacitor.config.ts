import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.ab6a103a2b2c41e886e0e52e98783e98',
  appName: 'SalahSilent',
  webDir: 'dist',
  server: {
    url: 'https://ab6a103a-2b2c-41e8-86e0-e52e98783e98.lovableproject.com?forceHideBadge=true',
    cleartext: true,
  },
  plugins: {
    LocalNotifications: {
      smallIcon: 'ic_stat_icon_config_sample',
      iconColor: '#10B981',
      sound: 'beep.wav',
    },
  },
  android: {
    // Allow mixed content for development
    allowMixedContent: true,
  },
};

export default config;
