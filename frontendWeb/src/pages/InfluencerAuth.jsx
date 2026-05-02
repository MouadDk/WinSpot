import { SignIn, SignUp, useAuth, useClerk } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function InfluencerAuth({ isSignUp }) {
  const { isSignedIn, isLoaded } = useAuth();
  const { signOut } = useClerk();
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    // If the user is already signed in, sign them out first
    // so the Clerk auth form renders properly for a fresh login/register
    if (isLoaded && isSignedIn && !signingOut) {
      setSigningOut(true);
      signOut().then(() => {
        setSigningOut(false);
      });
    }
  }, [isLoaded, isSignedIn, signOut, signingOut]);

  // Show loading while Clerk initializes or while signing out
  if (!isLoaded || signingOut || isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-purple-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Preparing your session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-purple-50 p-4">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-72 h-72 bg-purple-200 opacity-20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-300 opacity-15 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <Link to="/" className="inline-block mb-6">
            <div className="flex items-center justify-center">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-800 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                P2B
              </div>
            </div>
          </Link>
          <h1 className="text-4xl font-extrabold text-slate-800 mb-2">
            Influencer Hub
          </h1>
          <p className="text-slate-600">
            {isSignUp
              ? 'Join our community and start earning virtual coins'
              : 'Welcome back! Sign in to your influencer dashboard'}
          </p>
        </div>

        {/* Clerk Auth Components */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-slate-100">
          {isSignUp ? (
            <SignUp
              routing="path"
              path="/influencer/register"
              signInUrl="/influencer/login"
              fallbackRedirectUrl="/influencer-dashboard"
              unsafeMetadata={{ role: 'influencer' }}
              appearance={{
                elements: {
                  formButtonPrimary:
                    'bg-gradient-to-r from-purple-800 to-purple-600 hover:from-purple-900 hover:to-purple-700 text-white font-bold py-3 rounded-lg',
                  card: 'bg-transparent shadow-none',
                  headerTitle: 'text-slate-800 font-extrabold',
                  headerSubtitle: 'text-slate-600',
                  socialButtonsBlockButton:
                    'border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold',
                  dividerLine: 'bg-slate-200',
                  dividerText: 'text-slate-600',
                  formFieldLabel: 'text-slate-700 font-semibold',
                  formFieldInput:
                    'border-slate-300 rounded-lg focus:border-purple-600 focus:ring-purple-600',
                  footerActionLink: 'text-purple-800 hover:text-purple-900 font-semibold',
                },
              }}
            />
          ) : (
            <SignIn
              routing="path"
              path="/influencer/login"
              signUpUrl="/influencer/register"
              fallbackRedirectUrl="/influencer-dashboard"
              appearance={{
                elements: {
                  formButtonPrimary:
                    'bg-gradient-to-r from-purple-800 to-purple-600 hover:from-purple-900 hover:to-purple-700 text-white font-bold py-3 rounded-lg',
                  card: 'bg-transparent shadow-none',
                  headerTitle: 'text-slate-800 font-extrabold',
                  headerSubtitle: 'text-slate-600',
                  socialButtonsBlockButton:
                    'border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold',
                  dividerLine: 'bg-slate-200',
                  dividerText: 'text-slate-600',
                  formFieldLabel: 'text-slate-700 font-semibold',
                  formFieldInput:
                    'border-slate-300 rounded-lg focus:border-purple-600 focus:ring-purple-600',
                  footerActionLink: 'text-purple-800 hover:text-purple-900 font-semibold',
                },
              }}
            />
          )}
        </div>

        {/* Back Link */}
        <div className="text-center mt-6">
          <Link
            to="/choose-role"
            className="text-slate-600 hover:text-slate-800 text-sm font-semibold underline transition-colors"
          >
            Back to Role Selection
          </Link>
        </div>
      </div>
    </div>
  );
}
