import { Prayer } from '@/types/prayer';
import { Volume2, VolumeX, Timer } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatusHeaderProps {
  currentTime: Date;
  nextPrayer: Prayer | null;
  isSilentMode: boolean;
  timeUntilNext: { hours: number; minutes: number; seconds: number } | null;
  timeUntilSilentEnds: { minutes: number; seconds: number } | null;
  currentPrayerName?: string;
}

export const StatusHeader = ({
  currentTime,
  nextPrayer,
  isSilentMode,
  timeUntilNext,
  timeUntilSilentEnds,
  currentPrayerName,
}: StatusHeaderProps) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="relative overflow-hidden rounded-3xl gradient-primary p-6 mb-6">
      {/* Geometric pattern overlay */}
      <div className="absolute inset-0 geometric-pattern opacity-30" />

      {/* Decorative circles */}
      <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-secondary/20 blur-2xl" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-primary-foreground/10 blur-xl" />

      <div className="relative z-10">
        {/* Date */}
        <p className="text-primary-foreground/80 text-sm font-medium mb-1">
          {formatDate(currentTime)}
        </p>

        {/* Current time */}
        <h1 className="text-5xl font-bold text-primary-foreground tabular-nums mb-4">
          {formatTime(currentTime)}
        </h1>

        {/* Silent mode indicator */}
        <div
          className={cn(
            'inline-flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300',
            isSilentMode
              ? 'bg-secondary text-secondary-foreground glow-gold'
              : 'bg-primary-foreground/20 text-primary-foreground'
          )}
        >
          {isSilentMode ? (
            <>
              <VolumeX className="h-4 w-4 animate-pulse" />
              <span className="text-sm font-semibold">
                Silent Mode Active {currentPrayerName && `(${currentPrayerName})`}
              </span>
            </>
          ) : (
            <>
              <Volume2 className="h-4 w-4" />
              <span className="text-sm font-medium">Sound On</span>
            </>
          )}
        </div>

        {/* Silent mode countdown */}
        {isSilentMode && timeUntilSilentEnds && (
          <div className="mt-3 flex items-center gap-2 text-primary-foreground/80">
            <Timer className="h-4 w-4" />
            <span className="text-sm">
              Sound returns in{' '}
              <span className="font-bold text-primary-foreground tabular-nums">
                {String(timeUntilSilentEnds.minutes).padStart(2, '0')}:
                {String(timeUntilSilentEnds.seconds).padStart(2, '0')}
              </span>
            </span>
          </div>
        )}

        {/* Next prayer countdown */}
        {!isSilentMode && nextPrayer && timeUntilNext && (
          <div className="mt-4 pt-4 border-t border-primary-foreground/20">
            <p className="text-primary-foreground/70 text-sm">
              Next:{' '}
              <span className="font-semibold text-primary-foreground">
                {nextPrayer.name}
              </span>
            </p>
            <p className="text-2xl font-bold text-primary-foreground tabular-nums">
              {String(timeUntilNext.hours).padStart(2, '0')}:
              {String(timeUntilNext.minutes).padStart(2, '0')}:
              {String(timeUntilNext.seconds).padStart(2, '0')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
