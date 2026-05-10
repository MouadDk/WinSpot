import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import RoleSelection from './pages/RoleSelection';
import RestaurantAuth from './pages/RestaurantAuth';
import InfluencerAuth from './pages/InfluencerAuth';
import RestaurantDashboard from './pages/RestaurantDashboard';
import InfluencerDashboard from './pages/InfluencerDashboard';
import PremiumSubscriptions from './pages/restaurant/PremiumSubscriptions';
import InfluencersList from './pages/restaurant/InfluencersList';
import CampaignCreator from './pages/restaurant/CampaignCreator';
import VenueCatalog from './pages/influencer/VenueCatalog';
import Wallet from './pages/influencer/Wallet';
import RoleGuard from './components/auth/RoleGuard';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/choose-role" element={<RoleSelection />} />
        <Route path="/restaurant/login" element={<RestaurantAuth />} />
        <Route path="/restaurant/register" element={<RestaurantAuth isSignUp />} />
        <Route path="/influencer/login" element={<InfluencerAuth />} />
        <Route path="/influencer/register" element={<InfluencerAuth isSignUp />} />
        <Route
          path="/restaurant-dashboard"
          element={
            <RoleGuard allowedRole="restaurant">
              <RestaurantDashboard />
            </RoleGuard>
          }
        />
        <Route
          path="/restaurant-dashboard/subscriptions"
          element={
            <RoleGuard allowedRole="restaurant">
              <PremiumSubscriptions />
            </RoleGuard>
          }
        />
        <Route
          path="/restaurant-dashboard/influencers"
          element={
            <RoleGuard allowedRole="restaurant">
              <InfluencersList />
            </RoleGuard>
          }
        />
        <Route
          path="/restaurant-dashboard/campaigns"
          element={
            <RoleGuard allowedRole="restaurant">
              <CampaignCreator />
            </RoleGuard>
          }
        />
        <Route
          path="/influencer-dashboard"
          element={
            <RoleGuard allowedRole="influencer">
              <InfluencerDashboard />
            </RoleGuard>
          }
        />
        <Route
          path="/influencer-dashboard/venues"
          element={
            <RoleGuard allowedRole="influencer">
              <VenueCatalog />
            </RoleGuard>
          }
        />
        <Route
          path="/influencer-dashboard/wallet"
          element={
            <RoleGuard allowedRole="influencer">
              <Wallet />
            </RoleGuard>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;