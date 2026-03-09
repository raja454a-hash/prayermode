import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import {
  ArrowLeft,
  User,
  Bell,
  Moon,
  Crown,
  LogOut,
  ChevronRight,
  Mail,
  Shield,
  Info,
  ShieldCheck,
  MapPin,
  VolumeX,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { checkDndPermission, requestDndPermission, isNativePlatform } from '@/services/nativeSilentMode';

interface SettingRowProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  onClick?: () => void;
}

const SettingRow = ({ icon, title, description, action, onClick }: SettingRowProps) => (
  <div
    className={`flex items-center justify-between p-4 ${onClick ? 'cursor-pointer hover:bg-muted/50' : ''}`}
    onClick={onClick}
  >
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
        {icon}
      </div>
      <div>
        <p className="font-medium text-foreground">{title}</p>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
    {action || (onClick && <ChevronRight className="h-5 w-5 text-muted-foreground" />)}
  </div>
);

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, profile, signOut } = useAuth();
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [dndGranted, setDndGranted] = useState<boolean | null>(null);
  const [isNative, setIsNative] = useState(false);

  useEffect(() => {
    const native = isNativePlatform();
    setIsNative(native);
    if (native) {
      checkDndPermission().then(setDndGranted);
    }
  }, []);

  const handleRequestDnd = async () => {
    await requestDndPermission();
    toast({
      title: 'DND Settings Opened',
      description: 'Please grant Do Not Disturb access to enable auto-silent mode.',
    });
    // Re-check after a delay (user returns from settings)
    setTimeout(() => {
      checkDndPermission().then(setDndGranted);
    }, 3000);
  };

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: 'Signed Out',
      description: 'You have been signed out successfully.',
    });
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
            <h1 className="text-xl font-bold text-foreground">Settings</h1>
            <p className="text-sm text-muted-foreground">Manage your preferences</p>
          </div>
        </header>

        <div className="space-y-4">
          {/* Permissions Section */}
          <Card className="bg-card border-border overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-foreground flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" />
                Permissions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <SettingRow
                icon={<VolumeX className="h-5 w-5" />}
                title="Do Not Disturb"
                description={
                  isNative
                    ? dndGranted === null
                      ? 'Checking...'
                      : dndGranted
                        ? '✅ Granted — Auto silent mode active'
                        : '❌ Not granted — Tap to enable'
                    : 'Auto-managed on web'
                }
                action={
                  isNative && !dndGranted ? (
                    <Button size="sm" variant="outline" onClick={handleRequestDnd}>
                      Enable
                    </Button>
                  ) : undefined
                }
                onClick={isNative && !dndGranted ? handleRequestDnd : undefined}
              />
              <div className="border-t border-border" />
              <SettingRow
                icon={<MapPin className="h-5 w-5" />}
                title="Location Access"
                description={
                  isNative
                    ? 'Required for accurate prayer times'
                    : navigator.geolocation
                      ? '✅ Available via browser'
                      : '❌ Not supported'
                }
              />
            </CardContent>
          </Card>

          {/* Account Section */}
          <Card className="bg-card border-border overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-foreground">Account</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {user ? (
                <>
                  <SettingRow
                    icon={<User className="h-5 w-5" />}
                    title="Profile"
                    description={user.email || 'Manage your account'}
                  />
                  <div className="border-t border-border" />
                  <SettingRow
                    icon={<Crown className="h-5 w-5" />}
                    title="Subscription"
                    description={profile?.subscription_status === 'premium' ? 'Premium' : 'Free Plan'}
                    onClick={() => navigate('/subscription')}
                  />
                </>
              ) : (
                <SettingRow
                  icon={<User className="h-5 w-5" />}
                  title="Sign In"
                  description="Login to sync your settings"
                  onClick={() => navigate('/login')}
                />
              )}
            </CardContent>
          </Card>

          {/* Notifications Section */}
          <Card className="bg-card border-border overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-foreground">Notifications</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <SettingRow
                icon={<Bell className="h-5 w-5" />}
                title="Prayer Reminders"
                description="Get notified before prayer times"
                action={
                  <Switch
                    checked={notificationsEnabled}
                    onCheckedChange={setNotificationsEnabled}
                  />
                }
              />
            </CardContent>
          </Card>

          {/* Appearance Section */}
          <Card className="bg-card border-border overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-foreground">Appearance</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <SettingRow
                icon={<Moon className="h-5 w-5" />}
                title="Dark Mode"
                description="Use dark theme"
                action={
                  <Switch
                    checked={darkMode}
                    onCheckedChange={setDarkMode}
                  />
                }
              />
            </CardContent>
          </Card>

          {/* About Section */}
          <Card className="bg-card border-border overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-foreground">About</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <SettingRow
                icon={<Shield className="h-5 w-5" />}
                title="Privacy Policy"
                onClick={() => navigate('/privacy')}
              />
              <div className="border-t border-border" />
              <SettingRow
                icon={<Info className="h-5 w-5" />}
                title="App Version"
                description="1.0.0"
              />
              <div className="border-t border-border" />
              <SettingRow
                icon={<Mail className="h-5 w-5" />}
                title="Contact Support"
                onClick={() => navigate('/contact')}
              />
            </CardContent>
          </Card>

          {/* Sign Out */}
          {user && (
            <Button
              variant="outline"
              onClick={handleSignOut}
              className="w-full border-destructive text-destructive hover:bg-destructive/10"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-muted-foreground text-xs mt-8">
          Made with ❤️ for the Muslim community
        </p>
      </div>
    </div>
  );
};

export default Settings;
