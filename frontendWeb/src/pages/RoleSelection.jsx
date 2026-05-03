import { Link } from 'react-router-dom';
import { UtensilsCrossed, Sparkles, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const RoleSelection = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0A0A0F] flex flex-col items-center justify-center p-6 relative overflow-hidden transition-colors duration-500">
      
      {/* Dynamic Background Glows (Optimized) */}
      <div className="absolute top-1/4 left-1/4 w-[800px] h-[800px] pointer-events-none mix-blend-screen opacity-50 dark:opacity-100 will-change-transform" 
           style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.15) 0%, transparent 60%)' }} />
      <div className="absolute bottom-1/4 right-1/4 w-[800px] h-[800px] pointer-events-none mix-blend-screen opacity-50 dark:opacity-100 will-change-transform" 
           style={{ background: 'radial-gradient(circle, rgba(147,51,234,0.15) 0%, transparent 60%)' }} />

      {/* Back Button */}
      <Link 
        to="/" 
        className="absolute top-8 left-8 flex items-center text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors z-20"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        <span className="text-sm font-medium">Back to Home</span>
      </Link>

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center z-10 mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-black text-slate-800 dark:text-white mb-4 tracking-tight transition-colors duration-500">
          Choose Your Path
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-lg max-w-md mx-auto transition-colors duration-500">
          Join the pub2WIN ecosystem as a venue seeking growth, or a creator seeking rewards.
        </p>
      </motion.div>

      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 z-10">
        
        {/* ── RESTAURANTS CARD ── */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ y: -8 }}
          className="group relative will-change-transform"
        >
          {/* Hover Glow Effect (Optimized) */}
          <div className="absolute -inset-0.5 opacity-0 group-hover:opacity-100 dark:group-hover:opacity-30 transition duration-500 pointer-events-none rounded-[2rem]" 
               style={{ background: 'linear-gradient(to right, rgba(34,211,238,0.5), rgba(37,99,235,0.5))', filter: 'blur(10px)' }} />
          
          <div className="relative h-full bg-white dark:bg-black/40 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-[2rem] p-10 flex flex-col items-center text-center overflow-hidden shadow-xl shadow-slate-200/50 dark:shadow-none transition-colors duration-500">
            {/* Corner Decorative Gradient */}
            <div className="absolute top-[-50px] right-[-50px] w-64 h-64 opacity-50 dark:opacity-100 pointer-events-none" 
                 style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.15) 0%, transparent 70%)' }} />
            
            <div className="w-20 h-20 mb-8 rounded-2xl bg-cyan-50 dark:bg-gradient-to-br dark:from-cyan-500/20 dark:to-blue-500/20 border border-cyan-200 dark:border-cyan-500/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 relative z-10">
              <UtensilsCrossed className="w-10 h-10 text-cyan-500 dark:text-cyan-400" />
            </div>
            
            <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-4 relative z-10 transition-colors duration-500">For Restaurants</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-10 leading-relaxed relative z-10 transition-colors duration-500">
              Attract local influencers, generate authentic social media buzz, and boost your foot traffic with targeted WinCoins campaigns.
            </p>

            <div className="mt-auto w-full space-y-3 relative z-10">
              <Link
                to="/restaurant/login"
                className="block w-full py-4 rounded-xl bg-cyan-500 text-white dark:bg-white dark:text-black font-bold text-lg hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] dark:hover:shadow-[0_0_30px_rgba(34,211,238,0.3)] transition-all"
              >
                Log In
              </Link>
              <Link
                to="/restaurant/register"
                className="block w-full py-4 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white font-bold text-lg hover:bg-slate-50 dark:hover:bg-white/10 transition-colors"
              >
                Create Account
              </Link>
            </div>
          </div>
        </motion.div>

        {/* ── INFLUENCERS CARD ── */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ y: -8 }}
          className="group relative will-change-transform"
        >
          {/* Hover Glow Effect */}
          <div className="absolute -inset-0.5 opacity-0 group-hover:opacity-100 dark:group-hover:opacity-30 transition duration-500 pointer-events-none rounded-[2rem]" 
               style={{ background: 'linear-gradient(to right, rgba(168,85,247,0.5), rgba(219,39,119,0.5))', filter: 'blur(10px)' }} />
          
          <div className="relative h-full bg-white dark:bg-black/40 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-[2rem] p-10 flex flex-col items-center text-center overflow-hidden shadow-xl shadow-slate-200/50 dark:shadow-none transition-colors duration-500">
            {/* Corner Decorative Gradient */}
            <div className="absolute top-[-50px] left-[-50px] w-64 h-64 opacity-50 dark:opacity-100 pointer-events-none" 
                 style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 70%)' }} />

            <div className="w-20 h-20 mb-8 rounded-2xl bg-purple-50 dark:bg-gradient-to-br dark:from-purple-500/20 dark:to-pink-500/20 border border-purple-200 dark:border-purple-500/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 relative z-10">
              <Sparkles className="w-10 h-10 text-purple-500 dark:text-purple-400" />
            </div>
            
            <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-4 relative z-10 transition-colors duration-500">For Influencers</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-10 leading-relaxed relative z-10 transition-colors duration-500">
              Visit top-tier venues, share your authentic experiences on social media, and earn premium WinCoins cashback for every publication.
            </p>

            <div className="mt-auto w-full space-y-3 relative z-10">
              <Link
                to="/influencer/login"
                className="block w-full py-4 rounded-xl bg-purple-600 text-white dark:bg-white dark:text-black font-bold text-lg hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] dark:hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] transition-all"
              >
                Log In
              </Link>
              <Link
                to="/influencer/register"
                className="block w-full py-4 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white font-bold text-lg hover:bg-slate-50 dark:hover:bg-white/10 transition-colors"
              >
                Create Account
              </Link>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default RoleSelection;
