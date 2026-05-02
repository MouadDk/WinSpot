import { UserButton, useUser } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';

export default function InfluencerDashboard() {
  const { user, isLoaded } = useUser();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50">
      {/* --- HEADER --- */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-800 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
              P2B
            </div>
            <span className="ml-3 text-lg font-bold text-slate-800">Influencer</span>
          </Link>

          {/* Right Side: Welcome & User Button */}
          <div className="flex items-center space-x-6">
            {isLoaded && user && (
              <div className="text-right">
                <p className="text-sm text-slate-600">Welcome,</p>
                <p className="font-semibold text-slate-800">{user.firstName || 'Influencer'}</p>
              </div>
            )}
            <UserButton
              appearance={{
                elements: {
                  avatarBox: 'w-10 h-10',
                },
              }}
            />
          </div>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-5xl font-extrabold text-slate-800 mb-2 tracking-tight">
            Welcome to Your Influencer Hub
          </h1>
          <p className="text-xl text-slate-600">
            Discover campaigns, promote brands, and earn virtual coins.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Explore Campaigns Button */}
          <button className="group relative bg-gradient-to-r from-purple-800 to-purple-600 hover:from-purple-900 hover:to-purple-700 text-white px-8 py-6 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-105 flex items-center justify-center space-x-3">
            <span className="text-2xl">🎯</span>
            <span>Explore Campaigns</span>
          </button>

          {/* My Promotions Button */}
          <button className="group relative bg-white border-2 border-purple-800 text-purple-800 hover:bg-purple-50 px-8 py-6 rounded-2xl font-bold text-lg shadow-md hover:shadow-lg transition-all hover:scale-105 flex items-center justify-center space-x-3">
            <span className="text-2xl">📈</span>
            <span>My Promotions</span>
          </button>

          {/* My Earnings Button */}
          <button className="group relative bg-white border-2 border-purple-600 text-purple-600 hover:bg-purple-50 px-8 py-6 rounded-2xl font-bold text-lg shadow-md hover:shadow-lg transition-all hover:scale-105 flex items-center justify-center space-x-3">
            <span className="text-2xl">💎</span>
            <span>Earnings & Coins</span>
          </button>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {/* Stat Card 1 */}
          <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
                Active Promotions
              </h3>
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 text-lg">
                🎬
              </div>
            </div>
            <p className="text-4xl font-extrabold text-slate-800">0</p>
            <p className="text-sm text-slate-500 mt-2">No active promotions</p>
          </div>

          {/* Stat Card 2 */}
          <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
                Virtual Coins
              </h3>
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 text-lg">
                💰
              </div>
            </div>
            <p className="text-4xl font-extrabold text-slate-800">0</p>
            <p className="text-sm text-slate-500 mt-2">Start earning now</p>
          </div>

          {/* Stat Card 3 */}
          <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
                Total Impressions
              </h3>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-lg">
                👁️
              </div>
            </div>
            <p className="text-4xl font-extrabold text-slate-800">0</p>
            <p className="text-sm text-slate-500 mt-2">From your promotions</p>
          </div>

          {/* Stat Card 4 */}
          <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
                Engagement Rate
              </h3>
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-lg">
                ⚡
              </div>
            </div>
            <p className="text-4xl font-extrabold text-slate-800">0%</p>
            <p className="text-sm text-slate-500 mt-2">Track your impact</p>
          </div>
        </div>

        {/* Getting Started Section */}
        <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-8">
          <h2 className="text-2xl font-extrabold text-slate-800 mb-6">How to Get Started</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="relative">
              <div className="absolute left-0 top-0 w-10 h-10 bg-gradient-to-br from-purple-800 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                1
              </div>
              <div className="ml-16">
                <h3 className="text-lg font-bold text-slate-800 mb-2">Complete Your Profile</h3>
                <p className="text-slate-600">
                  Add your bio, links, and audience info to attract more campaign offers.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="absolute left-0 top-0 w-10 h-10 bg-gradient-to-br from-purple-800 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                2
              </div>
              <div className="ml-16">
                <h3 className="text-lg font-bold text-slate-800 mb-2">Browse Campaigns</h3>
                <p className="text-slate-600">
                  Discover campaigns from brands that match your niche and audience.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <div className="absolute left-0 top-0 w-10 h-10 bg-gradient-to-br from-purple-800 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                3
              </div>
              <div className="ml-16">
                <h3 className="text-lg font-bold text-slate-800 mb-2">Promote & Earn</h3>
                <p className="text-slate-600">
                  Promote campaigns to your audience and earn virtual coins for every action.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Features Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Feature Card 1 */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 border border-purple-200">
            <div className="text-4xl mb-4">🏆</div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Leaderboard</h3>
            <p className="text-slate-700">
              Compete with other influencers and reach the top of our leaderboard for exclusive rewards.
            </p>
          </div>

          {/* Feature Card 2 */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 border border-purple-200">
            <div className="text-4xl mb-4">🎁</div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Rewards Shop</h3>
            <p className="text-slate-700">
              Redeem your virtual coins for exclusive perks, merchandise, and cash rewards.
            </p>
          </div>
        </div>
      </main>

      {/* --- FOOTER --- */}
      <footer className="bg-slate-800 text-slate-400 py-12 mt-20 border-t border-slate-700">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="mb-4">© 2026 P2B Influencer Hub. All rights reserved.</p>
          <div className="flex justify-center space-x-6">
            <a href="#" className="hover:text-purple-400 transition-colors">
              Help Center
            </a>
            <a href="#" className="hover:text-purple-400 transition-colors">
              Creator Resources
            </a>
            <a href="#" className="hover:text-purple-400 transition-colors">
              Contact Support
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
