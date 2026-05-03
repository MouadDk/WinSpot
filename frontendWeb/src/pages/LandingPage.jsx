import { Link } from 'react-router-dom';
import { Rocket, Target, Shield, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useProgress } from '@react-three/drei';
import Logo3D from '../components/ui/Logo3D';

const LandingPage = () => {
  const { progress } = useProgress();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // When progress hits 100%, wait half a second for the scene to settle before fading out
    if (progress === 100) {
      const timer = setTimeout(() => setIsLoading(false), 500);
      return () => clearTimeout(timer);
    }
  }, [progress]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0A0A0F] font-sans text-slate-800 dark:text-slate-200 overflow-hidden relative transition-colors duration-500">
      
      {/* --- Preloader Overlay --- */}
      <AnimatePresence>
        {isLoading && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-50 dark:bg-[#0A0A0F]"
          >
            <div className="w-64 h-2 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden mb-4 relative shadow-inner">
              <motion.div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: "easeOut", duration: 0.2 }}
              />
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-bold tracking-widest uppercase text-xs animate-pulse">
              Initializing Engine • {Math.round(progress)}%
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Background Ambient Glows (Optimized for performance: No CSS Blur) */}
      <div className="absolute top-0 left-1/4 w-[800px] h-[800px] pointer-events-none mix-blend-screen opacity-50 dark:opacity-100 will-change-transform" 
           style={{ background: 'radial-gradient(circle, rgba(147,51,234,0.15) 0%, transparent 60%)' }} />
      <div className="absolute bottom-0 right-1/4 w-[1000px] h-[1000px] pointer-events-none mix-blend-screen opacity-50 dark:opacity-100 will-change-transform" 
           style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 60%)' }} />

      {/* --- Navigation Bar --- */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-50 flex justify-between items-center px-8 py-6 backdrop-blur-md bg-white/80 dark:bg-black/10 border-b border-slate-200 dark:border-white/5 transition-colors duration-500"
      >
        <div className="flex items-center">
          <img
            src="/WhatsApp Image 2026-04-30 at 15.13.45 (1).png"
            alt="P2Win Logo"
            className="h-12 w-auto object-contain dark:brightness-200"
          />
        </div>
        <nav className="hidden md:flex space-x-10 text-sm font-medium text-slate-600 dark:text-slate-300">
          <a href="#features" className="hover:text-purple-600 dark:hover:text-white transition-colors">Platform</a>
          <a href="#how-it-works" className="hover:text-purple-600 dark:hover:text-white transition-colors">How it Works</a>
          <a href="#contact" className="hover:text-purple-600 dark:hover:text-white transition-colors">Enterprise</a>
        </nav>
        <Link 
          to="/choose-role" 
          className="group relative inline-flex items-center justify-center px-6 py-2.5 text-sm font-bold text-purple-700 dark:text-white transition-all duration-200 bg-purple-50 dark:bg-white/5 border border-purple-200 dark:border-white/10 rounded-full hover:bg-purple-100 dark:hover:bg-white/10"
        >
          <span className="mr-2">Get Started</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </motion.header>

      {/* --- Hero Section --- */}
      <section className="relative pt-32 pb-20 px-6 lg:px-8 max-w-7xl mx-auto flex flex-col lg:flex-row items-center">
        
        {/* Left Content */}
        <div className="flex-1 text-center lg:text-left z-10 lg:pr-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-8">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
              The Next Generation Platform
            </div>
            <h1 className="text-5xl lg:text-7xl font-black mb-6 tracking-tight leading-[1.1]">
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
                Skyrocket Your 
              </span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 dark:from-cyan-400 dark:to-purple-600">
                Engagement
              </span>
            </h1>
            <p className="text-lg lg:text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light transition-colors duration-500">
              Connect your brand with top-tier local influencers. Launch targeted campaigns, drive foot traffic, and win the social media algorithm.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link 
                to="/choose-role" 
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-purple-700 text-white dark:bg-white dark:text-black font-bold text-lg hover:scale-105 transition-transform shadow-lg dark:shadow-[0_0_40px_rgba(255,255,255,0.3)] text-center"
              >
                Launch Campaign
              </Link>
              <Link 
                to="/choose-role" 
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white font-bold text-lg hover:bg-slate-50 dark:hover:bg-white/10 transition-colors text-center backdrop-blur-sm"
              >
                Join as Influencer
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Right 3D Logo */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="flex-1 w-full h-[500px] lg:h-[600px] mt-16 lg:mt-0 relative will-change-transform"
        >
          {/* Optimized backdrop glow */}
          <div className="absolute inset-0 opacity-20 dark:opacity-40 pointer-events-none mix-blend-screen" 
               style={{ background: 'radial-gradient(circle, rgba(147,51,234,0.4) 0%, rgba(6,182,212,0.4) 40%, transparent 70%)' }} />
          
          <Canvas camera={{ position: [0, 0, 4.5], fov: 45 }} className="relative z-10 pointer-events-auto" dpr={[1, 1.5]}>
            <ambientLight intensity={1.5} />
            <directionalLight position={[10, 10, 5]} intensity={3} />
            <directionalLight position={[-10, -10, -5]} intensity={1} color="#a855f7" />
            <pointLight position={[0, 0, 5]} intensity={2} />
            {/* Removed expensive HDRI environment to fix scrolling lag */}
            <Suspense fallback={null}>
              <Logo3D scale={1.5} autoRotateSpeed={0.5} />
            </Suspense>
            <OrbitControls 
              enableZoom={false} 
              enablePan={false}
              minPolarAngle={Math.PI / 3}
              maxPolarAngle={Math.PI / 1.5}
            />
          </Canvas>
        </motion.div>
      </section>

      {/* --- Feature Highlights --- */}
      <section id="features" className="relative py-32 px-6 z-10 border-t border-slate-200 dark:border-white/5 bg-white/80 dark:bg-black/40 backdrop-blur-3xl transition-colors duration-500">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-slate-800 dark:text-white transition-colors duration-500">Engineered for Growth</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto transition-colors duration-500">Everything you need to manage your influencer marketing pipeline in one unified platform.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Feature 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="p-8 rounded-3xl bg-white dark:bg-white/[0.02] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/[0.04] transition-colors group relative overflow-hidden will-change-transform"
            >
              {/* Replaced blur with radial gradient */}
              <div className="absolute top-[-50%] right-[-50%] w-[200%] h-[200%] opacity-0 group-hover:opacity-10 dark:group-hover:opacity-20 transition-opacity duration-500 pointer-events-none" 
                   style={{ background: 'radial-gradient(circle at center, rgba(168,85,247,1) 0%, transparent 50%)' }} />
              
              <div className="w-14 h-14 mb-6 bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center border border-purple-200 dark:border-purple-500/20 relative z-10">
                <Rocket className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-3 relative z-10 transition-colors duration-500">Rapid Deployment</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed relative z-10 transition-colors duration-500">
                Get your campaigns off the ground at lightning speed. No complex setups required.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="p-8 rounded-3xl bg-white dark:bg-white/[0.02] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/[0.04] transition-colors group relative overflow-hidden will-change-transform"
            >
              <div className="absolute top-[-50%] right-[-50%] w-[200%] h-[200%] opacity-0 group-hover:opacity-10 dark:group-hover:opacity-20 transition-opacity duration-500 pointer-events-none" 
                   style={{ background: 'radial-gradient(circle at center, rgba(6,182,212,1) 0%, transparent 50%)' }} />
              
              <div className="w-14 h-14 mb-6 bg-cyan-100 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 rounded-2xl flex items-center justify-center border border-cyan-200 dark:border-cyan-500/20 relative z-10">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-3 relative z-10 transition-colors duration-500">Precision Targeting</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed relative z-10 transition-colors duration-500">
                Hit your goals perfectly with advanced analytics and user targeting tools.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="p-8 rounded-3xl bg-white dark:bg-white/[0.02] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/[0.04] transition-colors group relative overflow-hidden will-change-transform"
            >
              <div className="absolute top-[-50%] right-[-50%] w-[200%] h-[200%] opacity-0 group-hover:opacity-10 dark:group-hover:opacity-20 transition-opacity duration-500 pointer-events-none" 
                   style={{ background: 'radial-gradient(circle at center, rgba(59,130,246,1) 0%, transparent 50%)' }} />
              
              <div className="w-14 h-14 mb-6 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center border border-blue-200 dark:border-blue-500/20 relative z-10">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-3 relative z-10 transition-colors duration-500">Enterprise Reliability</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed relative z-10 transition-colors duration-500">
                Built on a robust architecture that scales securely with your growing user base.
              </p>
            </motion.div>

          </div>
        </div>
      </section>
      
      {/* --- Footer --- */}
      <footer className="relative z-10 bg-slate-50 dark:bg-black/60 border-t border-slate-200 dark:border-white/5 py-12 text-center backdrop-blur-xl transition-colors duration-500">
        <p className="text-slate-500 mb-4 text-sm">© 2026 pub2WIN. All rights reserved.</p>
        <div className="flex justify-center space-x-6 text-sm text-slate-500 dark:text-slate-400">
          <a href="#" className="hover:text-purple-600 dark:hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-purple-600 dark:hover:text-white transition-colors">Terms of Service</a>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;