import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePrayerTimes } from '@/hooks/usePrayerTimes';
import { useAuth } from '@/hooks/useAuth';
import { Prayer, PrayerName } from '@/types/prayer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, Clock, Timer, Bell, Save, VolumeX } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ScheduleEdit = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, updatePrayerSchedule } = useAuth();
  const { prayers, updatePrayers } = usePrayerTimes();
  
  const [editedPrayers, setEditedPrayers] = useState<Prayer[]>(prayers);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setEditedPrayers(prayers);
  }, [prayers]);

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

  const handleSilenceToggle = (id: PrayerName) => {
    setEditedPrayers(prev =>
      prev.map(p => (p.id === id ? { ...p, silenceEnabled: !p.silenceEnabled } : p))
    );
  };

  const handleReminderToggle = (id: PrayerName) => {
    setEditedPrayers(prev =>
      prev.map(p => (p.id === id ? { ...p, reminderEnabled: !p.reminderEnabled } : p))
    );
  };

  const handleReminderMinutesChange = (id: PrayerName, minutes: string) => {
    const numMinutes = parseInt(minutes) || 0;
    setEditedPrayers(prev =>
      prev.map(p => (p.id === id ? { ...p, reminderMinutes: Math.max(1, Math.min(60, numMinutes)) } : p))
    );
  };

  const handleSave = async () => {
    setSaving(true);
    
    updatePrayers(editedPrayers);
    
    if (user) {
      await updatePrayerSchedule(editedPrayers);
    }

    toast({
      title: 'Settings Saved',
      description: 'Your prayer schedule has been updated.',
    });

    setSaving(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background geometric-pattern">
      <div className="max-w-md mx-auto px-4 py-6">
        {/* Header */}
        <header className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/')}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-foreground">Edit Schedule</h1>
            <p className="text-sm text-muted-foreground">Customize prayer times and settings</p>
          </div>
        </header>

        {/* Prayer Cards */}
        <div className="space-y-4">
          {editedPrayers.map((prayer) => (
            <Card key={prayer.id} className="bg-card border-border">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg text-foreground">{prayer.name}</CardTitle>
                    <span className="font-arabic text-muted-foreground text-sm">
                      {prayer.arabicName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <VolumeX className="h-4 w-4 text-muted-foreground" />
                    <Switch
                      checked={prayer.silenceEnabled}
                      onCheckedChange={() => handleSilenceToggle(prayer.id)}
                    />
                  </div>
                </div>
                <CardDescription className="text-muted-foreground">
                  {prayer.silenceEnabled ? 'Silent mode enabled' : 'Silent mode disabled'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
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
                      disabled={!prayer.silenceEnabled}
                    />
                  </div>
                </div>

                {/* Reminder Settings */}
                <div className="pt-3 border-t border-border/50">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-muted-foreground text-sm flex items-center gap-1">
                      <Bell className="h-3 w-3" />
                      Reminder Before Prayer
                    </Label>
                    <Switch
                      checked={prayer.reminderEnabled}
                      onCheckedChange={() => handleReminderToggle(prayer.id)}
                    />
                  </div>
                  {prayer.reminderEnabled && (
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="1"
                        max="60"
                        value={prayer.reminderMinutes}
                        onChange={(e) => handleReminderMinutesChange(prayer.id, e.target.value)}
                        className="bg-background border-border text-foreground w-20"
                      />
                      <span className="text-muted-foreground text-sm">minutes before</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Save Button */}
        <div className="mt-6 pb-8">
          <Button
            onClick={handleSave}
            className="w-full h-12 gradient-primary text-primary-foreground text-lg"
            disabled={saving}
          >
            {saving ? 'Saving...' : (
              <>
                <Save className="h-5 w-5 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleEdit;
