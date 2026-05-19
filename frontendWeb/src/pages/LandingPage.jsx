import { Link } from 'react-router-dom';
import {
  Rocket, Target, Shield, ArrowRight, QrCode, Wallet,
  Sparkles, Users, TrendingUp, ChevronRight, Star,
} from 'lucide-react';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

const STEPS = [
  {
    step: '01',
    icon: QrCode,
    title: 'Scan QR Code',
    description: 'After your meal, scan the restaurant QR code with your phone camera.',
    gradient: 'from-cyan-500 to-blue-500',
  },
  {
    step: '02',
    icon: Sparkles,
    title: 'AI Verifies',
    description: 'Our AI instantly verifies your visit and calculates your cashback reward.',
    gradient: 'from-purple-500 to-fuchsia-500',
  },
  {
    step: '03',
    icon: Wallet,
    title: 'Earn WinCoins',
    description: 'Cashback lands in your wallet as WinCoins you can withdraw as real money.',
    gradient: 'from-amber-500 to-orange-500',
  },
];

const FEATURES = [
  {
    icon: Rocket,
    title: 'Rapid Deployment',
    description: 'Get your campaigns off the ground at lightning speed. No complex setups required.',
    accentBg: 'bg-purple-100 dark:bg-purple-500/20',
    accentText: 'text-purple-600 dark:text-purple-400',
    accentBorder: 'border-purple-200 dark:border-purple-500/20',
    glowColor: 'rgba(168,85,247,1)',
  },
  {
    icon: Target,
    title: 'Precision Targeting',
    description: 'Hit your goals perfectly with advanced analytics and user targeting tools.',
    accentBg: 'bg-cyan-100 dark:bg-cyan-500/20',
    accentText: 'text-cyan-600 dark:text-cyan-400',
    accentBorder: 'border-cyan-200 dark:border-cyan-500/20',
    glowColor: 'rgba(6,182,212,1)',
  },
  {
    icon: Shield,
    title: 'Enterprise Reliability',
    description: 'Built on a robust architecture that scales securely with your growing user base.',
    accentBg: 'bg-blue-100 dark:bg-blue-500/20',
    accentText: 'text-blue-600 dark:text-blue-400',
    accentBorder: 'border-blue-200 dark:border-blue-500/20',
    glowColor: 'rgba(59,130,246,1)',
  },
];

const STATS = [
  { value: '10x', label: 'Return on Investment', icon: TrendingUp },
  { value: '5K+', label: 'Happy Customers', icon: Users },
  { value: '4.9', label: 'User Rating', icon: Star },
];

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0A0A0F] font-sans text-slate-800 dark:text-slate-200 overflow-hidden relative transition-colors duration-500">

      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-[800px] h-[800px] pointer-events-none mix-blend-screen opacity-50 dark:opacity-100 will-change-transform"
        style={{ background: 'radial-gradient(circle, rgba(147,51,234,0.15) 0%, transparent 60%)' }} />
      <div className="absolute bottom-0 right-1/4 w-[1000px] h-[1000px] pointer-events-none mix-blend-screen opacity-50 dark:opacity-100 will-change-transform"
        style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 60%)' }} />

      {/* --- Navigation Bar --- */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-50 flex justify-between items-center px-6 sm:px-8 py-4 backdrop-blur-md bg-white/80 dark:bg-black/10 border-b border-slate-200 dark:border-white/5 transition-colors duration-500"
      >
        <div className="flex items-center">
          <img
            src="/winspot-logo.png"
            alt="WinSpot Logo"
            className="h-10 w-auto object-contain"
            style={{ filter: 'drop-shadow(0 2px 8px rgba(147,51,234,0.3))' }}
          />
        </div>
        <nav className="hidden md:flex space-x-10 text-sm font-medium text-slate-600 dark:text-slate-300">
          <a href="#features" className="hover:text-purple-600 dark:hover:text-white transition-colors">Platform</a>
          <a href="#how-it-works" className="hover:text-purple-600 dark:hover:text-white transition-colors">How it Works</a>
          <a href="#social-proof" className="hover:text-purple-600 dark:hover:text-white transition-colors">Results</a>
        </nav>
        <Link
          to="/choose-role"
          className="group relative inline-flex items-center justify-center px-6 py-2.5 text-sm font-bold text-purple-700 dark:text-white transition-all duration-200 bg-purple-50 dark:bg-white/5 border border-purple-200 dark:border-white/10 rounded-full hover:bg-purple-100 dark:hover:bg-white/10 active:scale-95 cursor-pointer"
        >
          <span className="mr-2">Get Started</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </motion.header>

      {/* --- Hero Section --- */}
      <section className="relative pt-24 sm:pt-32 pb-20 px-6 lg:px-8 max-w-7xl mx-auto flex flex-col lg:flex-row items-center">

        {/* Left Content */}
        <div className="flex-1 text-center lg:text-left z-10 lg:pr-12">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            <motion.div variants={fadeUp} custom={0.1}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-300 text-xs font-semibold uppercase tracking-wider mb-8">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                The Next Generation Platform
              </div>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              custom={0.2}
              className="text-5xl lg:text-7xl font-black mb-6 tracking-tight leading-[1.1]"
              style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
                Skyrocket Your
              </span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 dark:from-cyan-400 dark:to-purple-600">
                Engagement
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              custom={0.3}
              className="text-lg lg:text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light transition-colors duration-500"
            >
              Dine at your favorite restaurants, scan a QR code after your meal, and earn cashback in WinCoins you can withdraw as real money.
            </motion.p>

            <motion.div
              variants={fadeUp}
              custom={0.4}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            >
              <Link
                to="/choose-role"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-purple-700 text-white dark:bg-white dark:text-black font-bold text-lg hover:scale-105 active:scale-95 transition-transform shadow-lg dark:shadow-[0_0_40px_rgba(255,255,255,0.3)] text-center cursor-pointer"
              >
                Create Offers
              </Link>
              <Link
                to="/choose-role"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white font-bold text-lg hover:bg-slate-50 dark:hover:bg-white/10 active:scale-95 transition-all text-center backdrop-blur-sm cursor-pointer"
              >
                Earn Cashback
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Right — Logo Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="flex-1 w-full mt-16 lg:mt-0 relative flex items-center justify-center"
        >
          <div className="absolute inset-0 opacity-40 pointer-events-none mix-blend-screen" />
          <motion.img
            src="/winspot-logo.png"
            alt="WinSpot Logo"
            className="relative z-10 w-full max-w-lg lg:max-w-xl object-contain"
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </section>

      {/* --- Social Proof Stats Bar --- */}
      <section id="social-proof" className="relative z-10 border-y border-slate-200 dark:border-white/5 bg-white/60 dark:bg-black/30 backdrop-blur-xl transition-colors duration-500">
        <div className="max-w-7xl mx-auto py-12 px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-3 gap-8"
          >
            {STATS.map((stat) => (
              <motion.div
                key={stat.label}
                variants={fadeUp}
                custom={0.1}
                className="flex flex-col items-center text-center gap-2"
              >
                <stat.icon className="w-6 h-6 text-purple-500 dark:text-purple-400 mb-1" />
                <span
                  className="text-4xl font-black text-slate-800 dark:text-white"
                  style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
                >
                  {stat.value}
                </span>
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* --- Feature Highlights --- */}
      <section id="features" className="relative py-24 sm:py-32 px-6 z-10 bg-white/80 dark:bg-black/40 backdrop-blur-3xl transition-colors duration-500">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-16 sm:mb-20"
          >
            <motion.div variants={fadeUp} custom={0}>
              <span className="inline-block px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-300 text-xs font-semibold uppercase tracking-wider mb-4">
                Platform
              </span>
            </motion.div>
            <motion.h2
              variants={fadeUp}
              custom={0.1}
              className="text-3xl lg:text-5xl font-bold mb-4 text-slate-800 dark:text-white transition-colors duration-500"
              style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
            >
              Engineered for Growth
            </motion.h2>
            <motion.p
              variants={fadeUp}
              custom={0.2}
              className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto transition-colors duration-500"
            >
              Everything you need to manage your cashback rewards platform in one unified experience.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="p-8 rounded-3xl bg-white dark:bg-white/[0.02] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/[0.04] transition-colors group relative overflow-hidden will-change-transform cursor-pointer"
              >
                <div className="absolute top-[-50%] right-[-50%] w-[200%] h-[200%] opacity-0 group-hover:opacity-10 dark:group-hover:opacity-20 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(circle at center, ${feature.glowColor} 0%, transparent 50%)` }} />
                <div className={`w-14 h-14 mb-6 ${feature.accentBg} ${feature.accentText} rounded-2xl flex items-center justify-center border ${feature.accentBorder} relative z-10 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-3 relative z-10 transition-colors duration-500">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed relative z-10 transition-colors duration-500">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- How it Works --- */}
      <section id="how-it-works" className="relative py-24 sm:py-32 px-6 z-10 border-t border-slate-200 dark:border-white/5 transition-colors duration-500">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-16 sm:mb-20"
          >
            <motion.div variants={fadeUp} custom={0}>
              <span className="inline-block px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-4">
                How it works
              </span>
            </motion.div>
            <motion.h2
              variants={fadeUp}
              custom={0.1}
              className="text-3xl lg:text-5xl font-bold mb-4 text-slate-800 dark:text-white"
              style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
            >
              Three Simple Steps
            </motion.h2>
            <motion.p
              variants={fadeUp}
              custom={0.2}
              className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto"
            >
              From dining to earning — it's that easy.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connection line (desktop only) */}
            <div className="hidden md:block absolute top-16 left-[16.67%] right-[16.67%] h-px bg-gradient-to-r from-cyan-500/30 via-purple-500/30 to-amber-500/30" />

            {STEPS.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 + i * 0.15, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="relative flex flex-col items-center text-center"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center mb-6 shadow-lg relative z-10`}>
                  <step.icon className="w-7 h-7 text-white" />
                </div>
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">{step.step}</span>
                <h3
                  className="text-xl font-bold text-slate-800 dark:text-white mb-2"
                  style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
                >
                  {step.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm max-w-xs">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Final CTA --- */}
      <section className="relative z-10 py-24 sm:py-32 px-6 border-t border-slate-200 dark:border-white/5 bg-white/60 dark:bg-black/30 backdrop-blur-xl transition-colors duration-500">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.h2
              variants={fadeUp}
              custom={0.1}
              className="text-3xl lg:text-5xl font-black text-slate-800 dark:text-white mb-6"
              style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
            >
              Ready to Transform Your Business?
            </motion.h2>
            <motion.p
              variants={fadeUp}
              custom={0.2}
              className="text-lg text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              Join hundreds of Moroccan restaurants already using WinSpot to boost foot traffic and reward loyal customers.
            </motion.p>
            <motion.div
              variants={fadeUp}
              custom={0.3}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link
                to="/choose-role"
                className="group w-full sm:w-auto px-10 py-4 rounded-full bg-purple-700 text-white dark:bg-white dark:text-black font-bold text-lg hover:scale-105 active:scale-95 transition-transform shadow-xl dark:shadow-[0_0_40px_rgba(255,255,255,0.3)] text-center cursor-pointer inline-flex items-center justify-center gap-2"
              >
                Get Started Free
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#how-it-works"
                className="w-full sm:w-auto px-10 py-4 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white font-bold text-lg hover:bg-slate-50 dark:hover:bg-white/10 active:scale-95 transition-all text-center backdrop-blur-sm cursor-pointer"
              >
                Learn More
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="relative z-10 bg-slate-50 dark:bg-black/60 border-t border-slate-200 dark:border-white/5 py-12 text-center backdrop-blur-xl transition-colors duration-500">
        <p className="text-slate-500 mb-4 text-sm">&copy; 2026 WinSpot. All rights reserved.</p>
        <div className="flex justify-center space-x-6 text-sm text-slate-500 dark:text-slate-400">
          <a href="#" className="hover:text-purple-600 dark:hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-purple-600 dark:hover:text-white transition-colors">Terms of Service</a>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;