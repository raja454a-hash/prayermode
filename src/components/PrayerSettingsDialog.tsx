import { useState } from 'react';
import { Prayer, PrayerName } from '@/types/prayer';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Clock, Timer, Save } from 'lucide-react';

interface PrayerSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prayers: Prayer[];
  onSave: (prayers: Prayer[]) => void;
}

export const PrayerSettingsDialog = ({
  open,
  onOpenChange,
  prayers,
  onSave,
}: PrayerSettingsDialogProps) => {
  const [editedPrayers, setEditedPrayers] = useState<Prayer[]>(prayers);

  const handleTimeChange = (id: PrayerName, time: string) => {
    setEditedPrayers(prev =>
      prev.map(p => (p.id === id ? { ...p, time } : p))
    );
  };

  const handleDurationChange = (id: PrayerName, duration: string) => {
    const numDuration = parseInt(duration) || 0;
    setEditedPrayers(prev =>
      prev.map(p => (p.id === id ? { ...p, silenceDuration: Math.max(1, Math.min(120, numDuration)) } : p))
    );
  };

  const handleSave = () => {
    onSave(editedPrayers);
    onOpenChange(false);
  };

  // Reset to current prayers when dialog opens
  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      setEditedPrayers(prayers);
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="bg-card border-border max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-foreground text-xl">Prayer Settings</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Set the start time and silent duration for each prayer.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {editedPrayers.map((prayer) => (
            <div
              key={prayer.id}
              className="p-4 rounded-xl bg-muted/50 border border-border space-y-3"
            >
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground">{prayer.name}</h3>
                <span className="font-arabic text-muted-foreground text-sm">
                  {prayer.arabicName}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Start Time */}
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-sm flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Start Time
                  </Label>
                  <Input
                    type="time"
                    value={prayer.time}
                    onChange={(e) => handleTimeChange(prayer.id, e.target.value)}
                    className="bg-background border-border text-foreground"
                  />
                </div>

                {/* Duration */}
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-sm flex items-center gap-1">
                    <Timer className="h-3 w-3" />
                    Duration (min)
                  </Label>
                  <Input
                    type="number"
                    min="1"
                    max="120"
                    value={prayer.silenceDuration}
                    onChange={(e) => handleDurationChange(prayer.id, e.target.value)}
                    className="bg-background border-border text-foreground"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1 border-border text-muted-foreground hover:bg-muted"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="flex-1 gradient-primary text-primary-foreground hover:opacity-90"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Settings
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
