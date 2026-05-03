import { SignIn, SignUp, useAuth, useClerk } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import AuthLayout from '../components/layout/AuthLayout';
import LoadingScreen from '../components/ui/LoadingScreen';

export default function InfluencerAuth({ isSignUp }) {
  const { isSignedIn, isLoaded } = useAuth();
  const { signOut } = useClerk();
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    if (isLoaded && isSignedIn && !signingOut) {
      setSigningOut(true);
      signOut().then(() => setSigningOut(false));
    }
  }, [isLoaded, isSignedIn, signOut, signingOut]);

  // Loading state
  if (!isLoaded || signingOut || isSignedIn) {
    return <LoadingScreen message="Preparing your session..." />;
  }

  const clerkAppearance = {
    elements: {
      formButtonPrimary:
        'bg-gradient-to-r from-purple-700 to-purple-500 hover:from-purple-800 hover:to-purple-600 text-white font-bold py-3 rounded-lg',
      card: 'bg-transparent shadow-none',
      headerTitle: 'text-slate-800 dark:text-white font-extrabold',
      headerSubtitle: 'text-slate-600 dark:text-slate-400',
      socialButtonsBlockButton:
        'border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold',
      dividerLine: 'bg-slate-200 dark:bg-slate-700',
      dividerText: 'text-slate-600 dark:text-slate-400',
      formFieldLabel: 'text-slate-700 dark:text-slate-300 font-semibold',
      formFieldInput:
        'border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white rounded-lg focus:border-purple-500 focus:ring-purple-500',
      footerActionLink:
        'text-purple-700 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 font-semibold',
    },
  };

  return (
    <AuthLayout
      brandTitle="Earn Cashback"
      brandSubtitle="Visit top restaurants and bars, share your experience on social media, and earn premium WinCoins cashback for every publication."
      brandIcon={Sparkles}
      accentColor="purple"
      backLink="/choose-role"
    >
      <div className="bg-white dark:bg-slate-800/50 rounded-2xl shadow-xl dark:shadow-slate-900/50 p-8 border border-slate-100 dark:border-slate-700/50">
        {isSignUp ? (
          <SignUp
            routing="path"
            path="/influencer/register"
            signInUrl="/influencer/login"
            fallbackRedirectUrl="/influencer-dashboard"
            unsafeMetadata={{ role: 'influencer' }}
            appearance={clerkAppearance}
          />
        ) : (
          <SignIn
            routing="path"
            path="/influencer/login"
            signUpUrl="/influencer/register"
            fallbackRedirectUrl="/influencer-dashboard"
            appearance={clerkAppearance}
          />
        )}
      </div>
    </AuthLayout>
  );
}
