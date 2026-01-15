import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, Check, Crown, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface PlanProps {
  name: string;
  price: string;
  period: string;
  features: string[];
  popular?: boolean;
  savings?: string;
  onSelect: () => void;
}

const PlanCard = ({ name, price, period, features, popular, savings, onSelect }: PlanProps) => (
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
        className={cn(
          "w-full",
          popular 
            ? "gradient-primary text-primary-foreground" 
            : "bg-muted text-foreground hover:bg-muted/80"
        )}
      >
        Subscribe Now
      </Button>
    </CardContent>
  </Card>
);

const Subscription = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (plan: string) => {
    if (!user) {
      toast({
        title: 'Login Required',
        description: 'Please login to subscribe.',
        variant: 'destructive',
      });
      navigate('/login');
      return;
    }

    setLoading(true);
    
    // TODO: Integrate with Stripe
    toast({
      title: 'Coming Soon',
      description: `${plan} subscription will be available soon.`,
    });
    
    setLoading(false);
  };

  const isPremium = profile?.subscription_status === 'premium';

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

        {isPremium ? (
          <Card className="bg-card border-secondary">
            <CardContent className="pt-6 text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center mb-4">
                <Sparkles className="h-8 w-8 text-secondary" />
              </div>
              <h2 className="text-xl font-bold text-foreground mb-2">You're Premium!</h2>
              <p className="text-muted-foreground">
                Thank you for supporting SalahSilent. Enjoy your ad-free experience.
              </p>
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
                price="$2.99"
                period="month"
                features={[
                  "Remove all ads",
                  "Priority support",
                  "Cloud sync across devices",
                  "Cancel anytime",
                ]}
                onSelect={() => handleSubscribe('Monthly')}
              />

              <PlanCard
                name="Yearly"
                price="$19.99"
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
                onSelect={() => handleSubscribe('Yearly')}
              />
            </div>

            {/* Free tier info */}
            <div className="mt-8 p-4 rounded-xl bg-muted/50 border border-border">
              <h3 className="font-semibold text-foreground mb-2">Free Plan</h3>
              <p className="text-sm text-muted-foreground">
                Continue using SalahSilent with ads. All core features remain available.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Subscription;
