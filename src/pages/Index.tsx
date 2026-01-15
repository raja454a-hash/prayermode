import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePrayerTimes } from '@/hooks/usePrayerTimes';
import { useSilentModeService } from '@/hooks/useSilentModeService';
import { useAuth } from '@/hooks/useAuth';
import { PrayerCard } from '@/components/PrayerCard';
import { StatusHeader } from '@/components/StatusHeader';
import { MosqueDecoration } from '@/components/MosqueDecoration';
import { PrayerSettingsDialog } from '@/components/PrayerSettingsDialog';
import { UserMenu } from '@/components/auth/UserMenu';
import { MapPin, Settings, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Prayer } from '@/types/prayer';

const Index = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const navigate = useNavigate();
  
  const { user, profile, loading: authLoading, signOut, updatePrayerSchedule } = useAuth();
  
  const {
    prayers,
    currentTime,
    currentPrayer,
    nextPrayer,
    isSilentMode,
    toggleSilenceForPrayer,
    updatePrayers,
    getTimeUntilNextPrayer,
    getTimeUntilSilentModeEnds,
  } = usePrayerTimes();

  // Sync prayers from cloud profile when user logs in
  useEffect(() => {
    if (profile && profile.prayer_schedule && profile.prayer_schedule.length > 0) {
      updatePrayers(profile.prayer_schedule);
    }
  }, [profile]);

  // Initialize silent mode service for native notifications
  useSilentModeService(prayers);

  const timeUntilNext = getTimeUntilNextPrayer();
  const timeUntilSilentEnds = getTimeUntilSilentModeEnds();
  
  // Get current prayer name for display
  const currentPrayerData = prayers.find(p => p.id === currentPrayer);

  // Handle saving prayers - save to cloud if logged in
  const handleSavePrayers = async (newPrayers: Prayer[]) => {
    updatePrayers(newPrayers);
    
    if (user) {
      await updatePrayerSchedule(newPrayers);
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  // Filter prayers for today (show Jumu'ah only on Friday, skip Zuhr on Friday)
  const today = new Date();
  const isFriday = today.getDay() === 5;
  const todaysPrayers = prayers.filter(p => {
    if (isFriday) {
      return p.id !== 'zuhr';
    } else {
      return p.id !== 'friday';
    }
  });

  return (
    <div className="min-h-screen bg-background geometric-pattern">
      <div className="max-w-md mx-auto px-4 py-6 pb-32">
        {/* App header */}
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Salah<span className="text-gradient-gold">Silent</span>
            </h1>
            <div className="flex items-center gap-1 text-muted-foreground text-sm">
              <MapPin className="h-3 w-3" />
              <span>Your Location</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSettingsOpen(true)}
              className="text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              <Settings className="h-5 w-5" />
            </Button>
            
            {authLoading ? (
              <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
            ) : user ? (
              <UserMenu
                email={user.email || ''}
                subscriptionStatus={profile?.subscription_status || 'free'}
                onSignOut={handleSignOut}
              />
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/auth')}
                className="text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                <LogIn className="h-5 w-5" />
              </Button>
            )}
          </div>
        </header>

        {/* Status header with time and silent mode */}
        <StatusHeader
          currentTime={currentTime}
          nextPrayer={nextPrayer}
          isSilentMode={isSilentMode}
          timeUntilNext={timeUntilNext}
          timeUntilSilentEnds={timeUntilSilentEnds}
          currentPrayerName={currentPrayerData?.name}
        />

        {/* Prayer times section */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-secondary" />
            {isFriday ? "Friday Prayers" : "Today's Prayers"}
          </h2>

          <div className="space-y-3">
            {todaysPrayers.map((prayer) => (
              <PrayerCard
                key={prayer.id}
                prayer={prayer}
                isActive={currentPrayer === prayer.id}
                onToggleSilence={toggleSilenceForPrayer}
              />
            ))}
          </div>
        </section>

        {/* Info text */}
        <p className="text-center text-muted-foreground text-sm mt-6 px-4">
          {user 
            ? "Your settings are synced to the cloud."
            : "Sign in to sync your prayer settings across devices."}
        </p>
      </div>

      {/* Bottom mosque decoration */}
      <div className="fixed bottom-0 left-0 right-0 pointer-events-none">
        <MosqueDecoration />
      </div>

      {/* Settings Dialog */}
      <PrayerSettingsDialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        prayers={prayers}
        onSave={handleSavePrayers}
      />
    </div>
  );
};

export default Index;
