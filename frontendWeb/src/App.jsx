import { Routes, Route, Navigate } from 'react-router-dom';
import { SignedIn } from '@clerk/clerk-react';
import LandingPage from './pages/LandingPage';
import RoleSelection from './pages/RoleSelection';
import MerchantAuth from './pages/MerchantAuth';
import InfluencerAuth from './pages/InfluencerAuth';
import MerchantDashboard from './pages/MerchantDashboard';
import InfluencerDashboard from './pages/InfluencerDashboard';

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/choose-role" element={<RoleSelection />} />

      {/* Merchant Auth Routes — no SignedOut wrapper so Clerk's
          multi-step flow (email verification, etc.) stays mounted */}
      <Route
        path="/merchant/login/*"
        element={<MerchantAuth isSignUp={false} />}
      />
      <Route
        path="/merchant/register/*"
        element={<MerchantAuth isSignUp={true} />}
      />

      {/* Influencer Auth Routes */}
      <Route
        path="/influencer/login/*"
        element={<InfluencerAuth isSignUp={false} />}
      />
      <Route
        path="/influencer/register/*"
        element={<InfluencerAuth isSignUp={true} />}
      />

      {/* Protected Dashboard Routes */}
      <Route
        path="/merchant-dashboard"
        element={
          <SignedIn>
            <MerchantDashboard />
          </SignedIn>
        }
      />
      <Route
        path="/influencer-dashboard"
        element={
          <SignedIn>
            <InfluencerDashboard />
          </SignedIn>
        }
      />

      {/* Catch-all: Redirect unknown routes to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;