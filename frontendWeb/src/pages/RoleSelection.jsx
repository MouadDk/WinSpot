import { Link } from 'react-router-dom';

const RoleSelection = () => {
  return (
    <div className="min-h-screen flex">
      {/* --- MERCHANTS SIDE (LEFT - BLUE/CYAN) --- */}
      <div className="w-full md:w-1/2 bg-gradient-to-br from-blue-500 via-cyan-400 to-blue-600 flex flex-col items-center justify-center p-8 text-white relative overflow-hidden group">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-white opacity-5 rounded-full blur-3xl -ml-36 -mb-36"></div>

        {/* Content */}
        <div className="relative z-10 text-center max-w-sm">
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto bg-white/20 rounded-full flex items-center justify-center text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">
              🏢
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
            For Merchants
          </h2>
          <p className="text-lg text-blue-100 mb-8 leading-relaxed">
            Launch campaigns, connect with influencers, and watch your brand reach new heights.
          </p>

          <div className="space-y-3">
            <Link
              to="/merchant/login"
              className="block w-full bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-bold hover:scale-105 hover:shadow-2xl transition-all shadow-xl"
            >
              Login
            </Link>
            <Link
              to="/merchant/register"
              className="block w-full bg-white/20 text-white px-8 py-4 rounded-full text-lg font-bold border-2 border-white hover:bg-white/30 hover:scale-105 transition-all"
            >
              Register
            </Link>
          </div>

          <p className="text-sm text-blue-100 mt-8">
            Already have an account? Use the login button above.
          </p>
        </div>
      </div>

      {/* --- INFLUENCERS SIDE (RIGHT - PURPLE) --- */}
      <div className="w-full md:w-1/2 bg-gradient-to-br from-purple-800 via-purple-600 to-purple-700 flex flex-col items-center justify-center p-8 text-white relative overflow-hidden group">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl -ml-48 -mt-48"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-white opacity-5 rounded-full blur-3xl -mr-36 -mb-36"></div>

        {/* Content */}
        <div className="relative z-10 text-center max-w-sm">
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto bg-white/20 rounded-full flex items-center justify-center text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">
              ⭐
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
            For Influencers
          </h2>
          <p className="text-lg text-purple-100 mb-8 leading-relaxed">
            Promote campaigns, earn virtual coins, and grow your influence. Turn your reach into rewards.
          </p>

          <div className="space-y-3">
            <Link
              to="/influencer/login"
              className="block w-full bg-white text-purple-800 px-8 py-4 rounded-full text-lg font-bold hover:scale-105 hover:shadow-2xl transition-all shadow-xl"
            >
              Login
            </Link>
            <Link
              to="/influencer/register"
              className="block w-full bg-white/20 text-white px-8 py-4 rounded-full text-lg font-bold border-2 border-white hover:bg-white/30 hover:scale-105 transition-all"
            >
              Register
            </Link>
          </div>

          <p className="text-sm text-purple-100 mt-8">
            New here? Use the register button above.
          </p>
        </div>
      </div>

      {/* --- MOBILE FALLBACK (Shows only on small screens) --- */}
      <div className="md:hidden fixed bottom-6 left-6 right-6">
        <Link
          to="/"
          className="block text-center text-sm text-slate-500 hover:text-slate-700 underline"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default RoleSelection;
