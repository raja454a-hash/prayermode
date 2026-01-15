import { VolumeX, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ManualSilentToggleProps {
  isManualSilent: boolean;
  onToggle: () => void;
}

export const ManualSilentToggle = ({ isManualSilent, onToggle }: ManualSilentToggleProps) => {
  return (
    <Button
      onClick={onToggle}
      className={cn(
        "w-full h-16 rounded-2xl text-lg font-semibold transition-all duration-300",
        isManualSilent
          ? "bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-lg"
          : "bg-muted text-muted-foreground hover:bg-muted/80 border border-border"
      )}
    >
      {isManualSilent ? (
        <>
          <VolumeX className="h-6 w-6 mr-3" />
          Silent Mode ON
        </>
      ) : (
        <>
          <Volume2 className="h-6 w-6 mr-3" />
          Tap to Enable Silent
        </>
      )}
    </Button>
  );
};
