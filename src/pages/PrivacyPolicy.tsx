import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Shield } from 'lucide-react';

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background geometric-pattern">
      <div className="max-w-md mx-auto px-4 py-6">
        <header className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/settings')}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-foreground">Privacy Policy</h1>
            <p className="text-sm text-muted-foreground">Last updated: February 2026</p>
          </div>
        </header>

        <div className="space-y-4">
          <Card className="bg-card border-border overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-foreground flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                Introduction
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Welcome to <span className="text-foreground font-medium">Prayer Mode</span>. We respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information when you use our app.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-foreground">Information We Collect</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground leading-relaxed">We may collect the following information:</p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>Email address (for account creation)</li>
                <li>Prayer schedule preferences</li>
                <li>Device information for silent mode functionality</li>
                <li>Subscription and payment information</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-card border-border overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-foreground">How We Use Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground leading-relaxed">Your information is used to:</p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>Provide and maintain the app's functionality</li>
                <li>Manage your prayer schedules and silent mode</li>
                <li>Process subscriptions and payments</li>
                <li>Send important notifications about prayer times</li>
                <li>Improve our services and user experience</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-card border-border overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-foreground">Data Storage & Security</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Your data is stored securely using industry-standard encryption. We implement appropriate security measures to protect against unauthorized access, alteration, or destruction of your personal information.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-foreground">Third-Party Services</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground leading-relaxed">We use the following third-party services:</p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li><span className="text-foreground">Google AdMob</span> — to display ads for free users</li>
                <li><span className="text-foreground">RevenueCat</span> — to manage subscriptions</li>
              </ul>
              <p className="text-sm text-muted-foreground leading-relaxed mt-2">
                These services may collect data as described in their own privacy policies.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-foreground">Children's Privacy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Prayer Mode does not knowingly collect personal information from children under 13. If you believe we have collected such information, please contact us immediately.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-foreground">Changes to This Policy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We may update this privacy policy from time to time. Any changes will be reflected on this page with an updated date. We encourage you to review this policy periodically.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-foreground">Contact Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                If you have any questions about this privacy policy, please contact us at{' '}
                <a href="mailto:support@prayermode.app" className="text-primary hover:underline">
                  support@prayermode.app
                </a>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
