import { UserButton, useUser } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';

export default function MerchantDashboard() {
  const { user, isLoaded } = useUser();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      {/* --- HEADER --- */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center text-white font-bold text-xl">
              P2B
            </div>
            <span className="ml-3 text-lg font-bold text-slate-800">Merchant</span>
          </Link>

          {/* Right Side: Welcome & User Button */}
          <div className="flex items-center space-x-6">
            {isLoaded && user && (
              <div className="text-right">
                <p className="text-sm text-slate-600">Welcome,</p>
                <p className="font-semibold text-slate-800">{user.firstName || 'Merchant'}</p>
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
            Welcome to Your Dashboard
          </h1>
          <p className="text-xl text-slate-600">
            Manage your campaigns, track performance, and connect with influencers.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Create Campaign Button */}
          <button className="group relative bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white px-8 py-6 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-105 flex items-center justify-center space-x-3">
            <span className="text-2xl">🚀</span>
            <span>Create Campaign</span>
          </button>

          {/* View Campaigns Button */}
          <button className="group relative bg-white border-2 border-blue-500 text-blue-600 hover:bg-blue-50 px-8 py-6 rounded-2xl font-bold text-lg shadow-md hover:shadow-lg transition-all hover:scale-105 flex items-center justify-center space-x-3">
            <span className="text-2xl">📊</span>
            <span>View Campaigns</span>
          </button>

          {/* Browse Influencers Button */}
          <button className="group relative bg-white border-2 border-cyan-400 text-cyan-600 hover:bg-cyan-50 px-8 py-6 rounded-2xl font-bold text-lg shadow-md hover:shadow-lg transition-all hover:scale-105 flex items-center justify-center space-x-3">
            <span className="text-2xl">⭐</span>
            <span>Find Influencers</span>
          </button>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {/* Stat Card 1 */}
          <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
                Active Campaigns
              </h3>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-lg">
                📢
              </div>
            </div>
            <p className="text-4xl font-extrabold text-slate-800">0</p>
            <p className="text-sm text-slate-500 mt-2">No campaigns yet</p>
          </div>

          {/* Stat Card 2 */}
          <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
                Total Reach
              </h3>
              <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center text-cyan-600 text-lg">
                👥
              </div>
            </div>
            <p className="text-4xl font-extrabold text-slate-800">0</p>
            <p className="text-sm text-slate-500 mt-2">Estimated reach</p>
          </div>

          {/* Stat Card 3 */}
          <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
                Connected Influencers
              </h3>
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 text-lg">
                🤝
              </div>
            </div>
            <p className="text-4xl font-extrabold text-slate-800">0</p>
            <p className="text-sm text-slate-500 mt-2">Start connecting</p>
          </div>

          {/* Stat Card 4 */}
          <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
                Budget Spent
              </h3>
              <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 text-lg">
                💰
              </div>
            </div>
            <p className="text-4xl font-extrabold text-slate-800">$0</p>
            <p className="text-sm text-slate-500 mt-2">Track your spending</p>
          </div>
        </div>

        {/* Getting Started Section */}
        <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-8">
          <h2 className="text-2xl font-extrabold text-slate-800 mb-6">Getting Started</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="relative">
              <div className="absolute left-0 top-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center text-white font-bold text-lg">
                1
              </div>
              <div className="ml-16">
                <h3 className="text-lg font-bold text-slate-800 mb-2">Launch Your Campaign</h3>
                <p className="text-slate-600">
                  Define your campaign goals, budget, and target audience to get started.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="absolute left-0 top-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center text-white font-bold text-lg">
                2
              </div>
              <div className="ml-16">
                <h3 className="text-lg font-bold text-slate-800 mb-2">Find Influencers</h3>
                <p className="text-slate-600">
                  Browse our network and select influencers aligned with your brand values.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <div className="absolute left-0 top-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center text-white font-bold text-lg">
                3
              </div>
              <div className="ml-16">
                <h3 className="text-lg font-bold text-slate-800 mb-2">Track Results</h3>
                <p className="text-slate-600">
                  Monitor performance metrics, engagement, and ROI in real-time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* --- FOOTER --- */}
      <footer className="bg-slate-800 text-slate-400 py-12 mt-20 border-t border-slate-700">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="mb-4">© 2026 P2B Merchant Dashboard. All rights reserved.</p>
          <div className="flex justify-center space-x-6">
            <a href="#" className="hover:text-cyan-400 transition-colors">
              Help Center
            </a>
            <a href="#" className="hover:text-cyan-400 transition-colors">
              Documentation
            </a>
            <a href="#" className="hover:text-cyan-400 transition-colors">
              Contact Support
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
