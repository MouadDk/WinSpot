import { Routes, Route, Navigate } from 'react-router-dom';
import { SignedIn } from '@clerk/clerk-react';
import LandingPage from './pages/LandingPage';
import RoleSelection from './pages/RoleSelection';
import RestaurantAuth from './pages/RestaurantAuth';
import InfluencerAuth from './pages/InfluencerAuth';
import RestaurantDashboard from './pages/RestaurantDashboard';
import InfluencerDashboard from './pages/InfluencerDashboard';
import ThemeToggle from './components/ui/ThemeToggle';
import RoleGuard from './components/auth/RoleGuard';

function App() {
  return (
    <>
    <ThemeToggle />
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/choose-role" element={<RoleSelection />} />

      {/* Restaurant Auth Routes */}
      <Route
        path="/restaurant/login/*"
        element={<RestaurantAuth isSignUp={false} />}
      />
      <Route
        path="/restaurant/register/*"
        element={<RestaurantAuth isSignUp={true} />}
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
        path="/restaurant-dashboard"
        element={
          <SignedIn>
            <RoleGuard allowedRole="restaurant">
              <RestaurantDashboard />
            </RoleGuard>
          </SignedIn>
        }
      />
      <Route
        path="/influencer-dashboard"
        element={
          <SignedIn>
            <RoleGuard allowedRole="influencer">
              <InfluencerDashboard />
            </RoleGuard>
          </SignedIn>
        }
      />

      {/* Catch-all: Redirect unknown routes to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </>
  );
}

export default App;