import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      
      {/* --- Navigation Bar --- */}
      <header className="flex justify-between items-center p-6 bg-white shadow-sm">
        <div className="flex items-center">
          {/* Logo referencing your specific file name */}
          <img
            src="WhatsApp Image 2026-04-30 at 15.13.45 (1).png"
            alt="P2Win Logo"
            className="h-14 w-auto object-contain"
          />
        </div>
        <nav className="hidden md:flex space-x-8 text-slate-600 font-medium">
          <a href="#features" className="hover:text-cyan-500 transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-cyan-500 transition-colors">How it Works</a>
          <a href="#contact" className="hover:text-cyan-500 transition-colors">Contact</a>
        </nav>
        <Link to="/choose-role" className="bg-purple-800 text-white px-6 py-2 rounded-full font-semibold hover:bg-purple-700 shadow-md shadow-purple-900/20 transition-all">
          Login / Register
        </Link>
      </header>

      {/* --- Hero Section --- */}
      <section className="flex flex-col items-center justify-center text-center py-24 px-6 bg-gradient-to-b from-white to-slate-200">
        <div className="max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-800 to-purple-600">
              Skyrocket Your 
            </span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              Engagement
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Take your brand to the next level. Connect, engage, and win with our next-generation platform.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link to="/choose-role" className="w-full sm:w-auto bg-gradient-to-r from-purple-800 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-bold hover:scale-105 shadow-xl shadow-purple-900/30 transition-transform block text-center">
              Launch Campaign
            </Link>
            <Link to="/choose-role" className="w-full sm:w-auto bg-white border-2 border-slate-300 text-purple-900 px-8 py-4 rounded-full text-lg font-bold hover:border-cyan-400 hover:text-cyan-600 transition-colors text-center">
              Explore Features
            </Link>
          </div>
        </div>
      </section>

      {/* --- Feature Highlights --- */}
      <section id="features" className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          
          {/* Feature 1 */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-16 h-16 mx-auto mb-6 bg-purple-100 text-purple-800 rounded-full flex items-center justify-center text-2xl font-bold">
              🚀
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">Rapid Deployment</h3>
            <p className="text-slate-600">
              Get your campaigns off the ground at lightning speed. No complex setups required.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-16 h-16 mx-auto mb-6 bg-cyan-100 text-cyan-600 rounded-full flex items-center justify-center text-2xl font-bold">
              🎯
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">Precision Targeting</h3>
            <p className="text-slate-600">
              Hit your goals perfectly with advanced analytics and user targeting tools.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-16 h-16 mx-auto mb-6 bg-slate-200 text-slate-700 rounded-full flex items-center justify-center text-2xl font-bold">
              ⚙️
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">Silver-Tier Reliability</h3>
            <p className="text-slate-600">
              Built on a robust architecture that scales with your growing user base.
            </p>
          </div>

        </div>
      </section>
      
      {/* --- Footer --- */}
      <footer className="bg-slate-900 text-slate-400 py-12 text-center">
        <p className="mb-4">© 2026 P2Win. All rights reserved.</p>
        <div className="flex justify-center space-x-6">
          <a href="#" className="hover:text-cyan-400 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-cyan-400 transition-colors">Terms of Service</a>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;