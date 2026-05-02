import { SignIn, SignUp } from "@clerk/clerk-react";

export default function InfluencerAuth({ isSignUp }) {
  return (
    <div className="flex h-screen items-center justify-center bg-slate-50">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-6 text-purple-800">Influencer Hub</h2>
        {isSignUp ? (
          <SignUp routing="hash" fallbackRedirectUrl="/onboarding?role=influencer" />
        ) : (
          <SignIn routing="hash" fallbackRedirectUrl="/influencer-dashboard" />
        )}
      </div>
    </div>
  );
}