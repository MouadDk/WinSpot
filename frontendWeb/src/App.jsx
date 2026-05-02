import { Routes, Route, Link } from 'react-router-dom';
import MerchantAuth from './pages/MerchantAuth';
import InfluencerAuth from './pages/InfluencerAuth';
import LandingPage from './pages/LandingPage'; // Your landing page from earlier

function App() {
  return (
    <Routes>
      {/* The Main Landing Page */}
      <Route path="/" element={<LandingPage />} />

      {/* Merchant Routes */}
      <Route path="/merchant/login" element={<MerchantAuth isSignUp={false} />} />
      <Route path="/merchant/register" element={<MerchantAuth isSignUp={true} />} />

      {/* Influencer Routes */}
      <Route path="/influencer/login" element={<InfluencerAuth isSignUp={false} />} />
      <Route path="/influencer/register" element={<InfluencerAuth isSignUp={true} />} />

      {/* Placeholder Dashboards */}
      <Route path="/merchant-dashboard" element={<div>Welcome Merchant</div>} />
      <Route path="/influencer-dashboard" element={<div>Welcome Influencer</div>} />
    </Routes>
  );
}

export default App;