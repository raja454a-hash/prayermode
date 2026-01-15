import { Prayer, PrayerName } from '@/types/prayer';
import { Switch } from '@/components/ui/switch';
import { Bell, BellOff, Moon, Sun, Sunset, Cloud } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PrayerCardProps {
  prayer: Prayer;
  isActive: boolean;
  onToggleSilence: (id: PrayerName) => void;
}

const prayerIcons: Record<PrayerName, React.ReactNode> = {
  fajr: <Moon className="h-5 w-5" />,
  zuhr: <Sun className="h-5 w-5" />,
  asr: <Cloud className="h-5 w-5" />,
  maghrib: <Sunset className="h-5 w-5" />,
  isha: <Moon className="h-5 w-5" />,
  friday: <Sun className="h-5 w-5" />,
};

export const PrayerCard = ({ prayer, isActive, onToggleSilence }: PrayerCardProps) => {
  return (
    <div
      className={cn(
        'prayer-card animate-fade-in',
        isActive && 'prayer-card-active'
      )}
      style={{ animationDelay: `${['fajr', 'zuhr', 'asr', 'maghrib', 'isha'].indexOf(prayer.id) * 100}ms` }}
    >
      {/* Decorative corner */}
      <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 -translate-y-1/2 translate-x-1/2 rounded-full bg-primary/10" />
      </div>

      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-4">
          {/* Icon */}
          <div className={cn(
            'flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300',
            isActive 
              ? 'gradient-primary text-primary-foreground glow-gold' 
              : 'bg-muted text-muted-foreground'
          )}>
            {prayerIcons[prayer.id]}
          </div>

          {/* Prayer info */}
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg text-foreground">{prayer.name}</h3>
              <span className="font-arabic text-muted-foreground text-sm">{prayer.arabicName}</span>
            </div>
            <p className={cn(
              'text-2xl font-bold tabular-nums',
              isActive ? 'text-gradient-gold' : 'text-foreground'
            )}>
              {prayer.time}
            </p>
          </div>
        </div>

        {/* Silence toggle */}
        <div className="flex flex-col items-center gap-1">
          <div className={cn(
            'p-2 rounded-lg transition-colors',
            prayer.silenceEnabled ? 'text-primary' : 'text-muted-foreground'
          )}>
            {prayer.silenceEnabled ? (
              <BellOff className="h-5 w-5" />
            ) : (
              <Bell className="h-5 w-5" />
            )}
          </div>
          <Switch
            checked={prayer.silenceEnabled}
            onCheckedChange={() => onToggleSilence(prayer.id)}
            className="data-[state=checked]:bg-primary"
          />
          <span className="text-xs text-muted-foreground">
            {prayer.silenceDuration}m
          </span>
        </div>
      </div>

      {/* Active indicator */}
      {isActive && (
        <div className="absolute bottom-0 left-0 right-0 h-1 gradient-primary animate-pulse-slow" />
      )}
    </div>
  );
};
