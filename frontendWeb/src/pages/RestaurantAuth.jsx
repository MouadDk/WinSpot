import { SignIn, SignUp, useAuth, useClerk } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';
import { UtensilsCrossed } from 'lucide-react';
import AuthLayout from '../components/layout/AuthLayout';
import LoadingScreen from '../components/ui/LoadingScreen';

export default function RestaurantAuth({ isSignUp }) {
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
        'bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white font-bold py-3 rounded-lg',
      card: 'bg-transparent shadow-none',
      headerTitle: 'text-slate-800 dark:text-white font-extrabold',
      headerSubtitle: 'text-slate-600 dark:text-slate-400',
      socialButtonsBlockButton:
        'border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold',
      dividerLine: 'bg-slate-200 dark:bg-slate-700',
      dividerText: 'text-slate-600 dark:text-slate-400',
      formFieldLabel: 'text-slate-700 dark:text-slate-300 font-semibold',
      formFieldInput:
        'border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white rounded-lg focus:border-blue-500 focus:ring-blue-500',
      footerActionLink:
        'text-blue-600 dark:text-cyan-400 hover:text-blue-700 dark:hover:text-cyan-300 font-semibold',
    },
  };

  return (
    <AuthLayout
      brandTitle="Boost Your Restaurant"
      brandSubtitle="Attract local influencers, generate authentic social media buzz, and turn posts into foot traffic with WinCoins."
      brandIcon={UtensilsCrossed}
      accentColor="cyan"
      backLink="/choose-role"
    >
      <div className="bg-white dark:bg-slate-800/50 rounded-2xl shadow-xl dark:shadow-slate-900/50 p-8 border border-slate-100 dark:border-slate-700/50">
        {isSignUp ? (
          <SignUp
            routing="path"
            path="/restaurant/register"
            signInUrl="/restaurant/login"
            fallbackRedirectUrl="/restaurant-dashboard"
            unsafeMetadata={{ role: 'restaurant' }}
            appearance={clerkAppearance}
          />
        ) : (
          <SignIn
            routing="path"
            path="/restaurant/login"
            signUpUrl="/restaurant/register"
            fallbackRedirectUrl="/restaurant-dashboard"
            appearance={clerkAppearance}
          />
        )}
      </div>
    </AuthLayout>
  );
}
