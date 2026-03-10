import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, Check, Crown, Sparkles, Loader2, RefreshCw, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface PlanProps {
  name: string;
  price: string;
  period: string;
  features: string[];
  popular?: boolean;
  savings?: string;
  onSelect: () => void;
  loading?: boolean;
  disabled?: boolean;
}

const PlanCard = ({ name, price, period, features, popular, savings, onSelect, loading, disabled }: PlanProps) => (
  <Card className={cn(
    "bg-card border-border relative overflow-hidden transition-all duration-300",
    popular && "border-secondary shadow-lg shadow-secondary/20 scale-105"
  )}>
    {popular && (
      <div className="absolute top-0 right-0 bg-secondary text-secondary-foreground px-3 py-1 text-xs font-semibold rounded-bl-lg">
        Most Popular
      </div>
    )}
    {savings && (
      <div className="absolute top-0 left-0 bg-green-500 text-white px-3 py-1 text-xs font-semibold rounded-br-lg">
        Save {savings}
      </div>
    )}
    <CardHeader className="text-center pt-8">
      <div className="mx-auto w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center mb-4">
        <Crown className="h-6 w-6 text-secondary" />
      </div>
      <CardTitle className="text-xl text-foreground">{name}</CardTitle>
      <CardDescription className="text-muted-foreground">
        <span className="text-3xl font-bold text-foreground">{price}</span>
        <span className="text-muted-foreground">/{period}</span>
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <ul className="space-y-3">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2 text-foreground">
            <Check className="h-4 w-4 text-secondary flex-shrink-0" />
            <span className="text-sm">{feature}</span>
          </li>
        ))}
      </ul>
      <Button
        onClick={onSelect}
        disabled={loading || disabled}
        className={cn(
          "w-full",
          popular 
            ? "gradient-primary text-primary-foreground" 
            : "bg-muted text-foreground hover:bg-muted/80"
        )}
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          'Subscribe Now'
        )}
      </Button>
    </CardContent>
  </Card>
);

const Subscription = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, profile, fetchProfile } = useAuth();
  const [processingPlan, setProcessingPlan] = useState<'monthly' | 'yearly' | null>(null);

  const {
    isLoading,
    isPremium: isPremiumFromStore,
    monthlyPackage,
    yearlyPackage,
    purchaseMonthly,
    purchaseYearly,
    restore,
    refresh,
    cancel,
  } = useSubscription(user?.id);

  // Update backend subscription via secure edge function
  const updateBackendSubscription = async (status: 'premium' | 'free') => {
    if (!user) return;

    try {
      const { data, error } = await supabase.functions.invoke('verify-subscription', {
        body: { action: status === 'premium' ? 'activate' : 'deactivate' },
      });

      if (error) throw error;

      // Refresh profile to get updated status
      await fetchProfile(user.id);
      
      console.log('💳 Backend subscription status updated:', status);
    } catch (error) {
      console.error('Failed to update backend subscription:', error);
    }
  };

  // Sync store premium status with backend
  useEffect(() => {
    if (isPremiumFromStore && profile?.subscription_status !== 'premium') {
      updateBackendSubscription('premium');
    }
  }, [isPremiumFromStore, profile?.subscription_status]);

  const handleSubscribe = async (plan: 'monthly' | 'yearly') => {
    if (!user) {
      toast({
        title: 'Login Required',
        description: 'Please login to subscribe.',
        variant: 'destructive',
      });
      navigate('/login');
      return;
    }

    setProcessingPlan(plan);

    const success = plan === 'monthly' ? await purchaseMonthly() : await purchaseYearly();

    if (success) {
      // Update backend
      await updateBackendSubscription('premium');

      toast({
        title: 'Welcome to Premium! 🎉',
        description: 'Your subscription is now active. Enjoy ad-free prayers!',
      });
    } else {
      toast({
        title: 'Purchase Cancelled',
        description: 'Your subscription was not completed.',
        variant: 'destructive',
      });
    }

    setProcessingPlan(null);
  };

  const handleRestore = async () => {
    setProcessingPlan('monthly'); // Show loading state
    
    const restored = await restore();

    if (restored) {
      await updateBackendSubscription('premium');
      toast({
        title: 'Purchases Restored',
        description: 'Your premium subscription has been restored!',
      });
    } else {
      toast({
        title: 'No Purchases Found',
        description: 'No previous purchases were found to restore.',
        variant: 'destructive',
      });
    }

    setProcessingPlan(null);
  };

  const isPremium = profile?.subscription_status === 'premium' || isPremiumFromStore;

  // Get prices from packages or use defaults
  const monthlyPrice = monthlyPackage?.product?.priceString || '$2.99';
  const yearlyPrice = yearlyPackage?.product?.priceString || '$19.99';

  return (
    <div className="min-h-screen bg-background geometric-pattern">
      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Header */}
        <header className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/')}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-foreground">Go Premium</h1>
            <p className="text-sm text-muted-foreground">Remove ads & unlock features</p>
          </div>
        </header>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-secondary" />
          </div>
        ) : isPremium ? (
          <Card className="bg-card border-secondary">
            <CardContent className="pt-6 text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center mb-4">
                <Sparkles className="h-8 w-8 text-secondary" />
              </div>
              <h2 className="text-xl font-bold text-foreground mb-2">You're Premium!</h2>
              <p className="text-muted-foreground mb-4">
                Thank you for supporting Prayer Mode. Enjoy your ad-free experience.
              </p>
              <Button
                variant="outline"
                onClick={refresh}
                className="text-muted-foreground"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Status
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Benefits */}
            <div className="mb-8 text-center">
              <h2 className="text-lg font-semibold text-foreground mb-2">
                Why Go Premium?
              </h2>
              <p className="text-muted-foreground text-sm">
                Enjoy an uninterrupted prayer experience
              </p>
            </div>

            {/* Plans */}
            <div className="space-y-4">
              <PlanCard
                name="Monthly"
                price={monthlyPrice}
                period="month"
                features={[
                  "Remove all ads",
                  "Priority support",
                  "Cloud sync across devices",
                  "Cancel anytime",
                ]}
                onSelect={() => handleSubscribe('monthly')}
                loading={processingPlan === 'monthly'}
                disabled={processingPlan !== null || !monthlyPackage}
              />

              <PlanCard
                name="Yearly"
                price={yearlyPrice}
                period="year"
                popular
                savings="44%"
                features={[
                  "Remove all ads",
                  "Priority support",
                  "Cloud sync across devices",
                  "2 months free",
                  "Best value",
                ]}
                onSelect={() => handleSubscribe('yearly')}
                loading={processingPlan === 'yearly'}
                disabled={processingPlan !== null || !yearlyPackage}
              />
            </div>

            {/* Restore Purchases */}
            <div className="mt-6 text-center">
              <Button
                variant="link"
                onClick={handleRestore}
                disabled={processingPlan !== null}
                className="text-muted-foreground"
              >
                Restore Previous Purchase
              </Button>
            </div>

            {/* Free tier info */}
            <div className="mt-6 p-4 rounded-xl bg-muted/50 border border-border">
              <h3 className="font-semibold text-foreground mb-2">Free Plan</h3>
              <p className="text-sm text-muted-foreground">
                Continue using Prayer Mode with ads. All core features remain available.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Subscription;
