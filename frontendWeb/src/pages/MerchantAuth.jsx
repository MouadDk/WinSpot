import { SignIn, SignUp } from "@clerk/clerk-react";

export default function MerchantAuth({ isSignUp }) {
  return (
    <div className="flex h-screen items-center justify-center bg-slate-50">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-6 text-slate-800">Merchant Portal</h2>
        {isSignUp ? (
          <SignUp routing="hash" fallbackRedirectUrl="/onboarding?role=merchant" />
        ) : (
          <SignIn routing="hash" fallbackRedirectUrl="/merchant-dashboard" />
        )}
      </div>
    </div>
  );
}