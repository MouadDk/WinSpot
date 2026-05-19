import { Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import LandingPage from './pages/LandingPage';
import RoleSelection from './pages/RoleSelection';
import RestaurantAuth from './pages/RestaurantAuth';
import CustomerAuth from './pages/CustomerAuth';
import RestaurantDashboard from './pages/RestaurantDashboard';
import CustomerDashboard from './pages/CustomerDashboard';
import ThemeToggle from './components/ui/ThemeToggle';
import RoleGuard from './components/auth/RoleGuard';

// Dashboard sub-pages
import MerchantOffersPage  from './pages/dashboard/MerchantOffersPage';
import MerchantWalletPage  from './pages/dashboard/MerchantWalletPage';
import CustomerOffersPage  from './pages/dashboard/CustomerOffersPage';
import CustomerWalletPage  from './pages/dashboard/CustomerWalletPage';
import SettingsPage        from './pages/dashboard/SettingsPage';

function App() {
  return (
    <>
      <ThemeToggle />
      <Routes>
        {/* ── Public Routes ── */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/choose-role" element={<RoleSelection />} />

        {/* ── Restaurant Auth ── */}
        <Route path="/restaurant/login/*"    element={<RestaurantAuth isSignUp={false} />} />
        <Route path="/restaurant/register/*" element={<RestaurantAuth isSignUp={true}  />} />

        {/* ── Customer Auth ── */}
        <Route path="/customer/login/*"    element={<CustomerAuth isSignUp={false} />} />
        <Route path="/customer/register/*" element={<CustomerAuth isSignUp={true}  />} />

        {/* ── Restaurant Dashboard (nested) ── */}
        <Route
          path="/restaurant-dashboard"
          element={
            <RoleGuard allowedRole="merchant">
              <RestaurantDashboard />
            </RoleGuard>
          }
        >
          {/* Overview is the index (default) child */}
          <Route index element={null} />
          <Route path="offers"   element={<MerchantOffersPage />} />
          <Route path="wallet"   element={<MerchantWalletPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* ── Customer Dashboard (nested) ── */}
        <Route
          path="/customer-dashboard"
          element={
            <RoleGuard allowedRole="customer">
              <CustomerDashboard />
            </RoleGuard>
          }
        >
          <Route index element={null} />
          <Route path="offers"   element={<CustomerOffersPage />} />
          <Route path="wallet"   element={<CustomerWalletPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* ── Legacy redirects ── */}
        <Route path="/influencer/*"         element={<Navigate to="/customer/login"    replace />} />
        <Route path="/influencer-dashboard" element={<Navigate to="/customer-dashboard" replace />} />

        {/* ── Catch-all ── */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;