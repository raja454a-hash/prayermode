import { useState } from 'react';
import { usePrayerTimes } from '@/hooks/usePrayerTimes';
import { PrayerCard } from '@/components/PrayerCard';
import { StatusHeader } from '@/components/StatusHeader';
import { MosqueDecoration } from '@/components/MosqueDecoration';
import { PrayerSettingsDialog } from '@/components/PrayerSettingsDialog';
import { MapPin, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  
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

  const timeUntilNext = getTimeUntilNextPrayer();
  const timeUntilSilentEnds = getTimeUntilSilentModeEnds();
  
  // Get current prayer name for display
  const currentPrayerData = prayers.find(p => p.id === currentPrayer);

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
              <span>New York, USA</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSettingsOpen(true)}
            className="text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            <Settings className="h-5 w-5" />
          </Button>
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
            Today's Prayers
          </h2>

          <div className="space-y-3">
            {prayers.map((prayer) => (
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
          Tap the <Settings className="h-3 w-3 inline mx-1" /> button to set custom prayer times and silence durations.
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
        onSave={updatePrayers}
      />
    </div>
  );
};

export default Index;
