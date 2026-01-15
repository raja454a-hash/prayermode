import { usePrayerTimes } from '@/hooks/usePrayerTimes';
import { PrayerCard } from '@/components/PrayerCard';
import { StatusHeader } from '@/components/StatusHeader';
import { MosqueDecoration } from '@/components/MosqueDecoration';
import { MapPin, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  const {
    prayers,
    currentTime,
    currentPrayer,
    nextPrayer,
    isSilentMode,
    toggleSilenceForPrayer,
    getTimeUntilNextPrayer,
  } = usePrayerTimes();

  const timeUntilNext = getTimeUntilNextPrayer();

  return (
    <div className="min-h-screen bg-background geometric-pattern">
      <div className="max-w-md mx-auto px-4 py-6 pb-24">
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
          Toggle the switch to enable auto-silence during prayer times. 
          Your phone will automatically go silent when prayer begins.
        </p>
      </div>

      {/* Bottom mosque decoration */}
      <div className="fixed bottom-0 left-0 right-0 pointer-events-none">
        <MosqueDecoration />
      </div>
    </div>
  );
};

export default Index;
