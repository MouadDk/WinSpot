import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
  StoreIcon, CashbackIcon,
  ScanIcon, AnalyticsIcon, PeopleIcon,
  RewardIcon, CoinStackIcon, ShieldLockIcon,
} from '../components/ui/AnimatedIcons';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] },
  }),
};

const ROLES = [
  {
    id: 'restaurant',
    HeroIcon: StoreIcon,
    title: 'Restaurant',
    subtitle: 'For Business Owners',
    description: 'Create cashback offers, generate QR codes, and attract new customers with rewards they love.',
    loginPath: '/restaurant/login',
    registerPath: '/restaurant/register',
    perks: [
      { Icon: ScanIcon, label: 'QR Code Generator' },
      { Icon: AnalyticsIcon, label: 'Live Analytics' },
      { Icon: PeopleIcon, label: 'Customer Insights' },
    ],
    accent: {
      iconBg: 'bg-gradient-to-br from-cyan-500 to-blue-600',
      cardBorder: 'border-cyan-200/60 dark:border-cyan-500/20',
      cardHoverBorder: 'hover:border-cyan-400/80 dark:hover:border-cyan-500/40',
      glowColor: 'rgba(6,182,212,0.5)',
      loginBtn: 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-lg shadow-cyan-500/25',
      loginBtnDark: 'dark:from-white dark:to-slate-100 dark:text-slate-900 dark:hover:from-slate-100 dark:hover:to-white dark:shadow-white/10',
      perkBg: 'bg-cyan-50 dark:bg-cyan-500/10',
      perkText: 'text-cyan-700 dark:text-cyan-300',
      perkIcon: 'text-cyan-500 dark:text-cyan-400',
      badge: 'bg-cyan-100 dark:bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-500/30',
      dotColor: 'bg-cyan-500',
    },
    bgGlow: 'radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 60%)',
  },
  {
    id: 'customer',
    HeroIcon: CashbackIcon,
    title: 'Customer',
    subtitle: 'For Foodies & Diners',
    description: 'Discover restaurant offers, scan QR codes, and earn cashback in WinCoins you can withdraw as real money.',
    loginPath: '/customer/login',
    registerPath: '/customer/register',
    perks: [
      { Icon: RewardIcon, label: 'Instant Cashback' },
      { Icon: CoinStackIcon, label: 'WinCoin Wallet' },
      { Icon: ShieldLockIcon, label: 'Secure Withdrawals' },
    ],
    accent: {
      iconBg: 'bg-gradient-to-br from-purple-500 to-fuchsia-600',
      cardBorder: 'border-purple-200/60 dark:border-purple-500/20',
      cardHoverBorder: 'hover:border-purple-400/80 dark:hover:border-purple-500/40',
      glowColor: 'rgba(168,85,247,0.5)',
      loginBtn: 'bg-gradient-to-r from-purple-600 to-fuchsia-500 hover:from-purple-700 hover:to-fuchsia-600 text-white shadow-lg shadow-purple-500/25',
      loginBtnDark: 'dark:from-white dark:to-slate-100 dark:text-slate-900 dark:hover:from-slate-100 dark:hover:to-white dark:shadow-white/10',
      perkBg: 'bg-purple-50 dark:bg-purple-500/10',
      perkText: 'text-purple-700 dark:text-purple-300',
      perkIcon: 'text-purple-500 dark:text-purple-400',
      badge: 'bg-purple-100 dark:bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-500/30',
      dotColor: 'bg-purple-500',
    },
    bgGlow: 'radial-gradient(circle, rgba(147,51,234,0.12) 0%, transparent 60%)',
  },
];

const RoleSelection = () => {
  const [hoveredRole, setHoveredRole] = useState(null);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0A0A0F] flex flex-col items-center justify-center px-4 sm:px-6 py-12 relative overflow-hidden transition-colors duration-500">

      {/* Dynamic Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-[800px] h-[800px] pointer-events-none mix-blend-screen opacity-40 dark:opacity-80 will-change-transform"
           style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 60%)' }} />
      <div className="absolute bottom-1/4 right-1/4 w-[800px] h-[800px] pointer-events-none mix-blend-screen opacity-40 dark:opacity-80 will-change-transform"
           style={{ background: 'radial-gradient(circle, rgba(147,51,234,0.12) 0%, transparent 60%)' }} />

      {/* Animated follow-glow based on hovered card */}
      <AnimatePresence>
        {hoveredRole && (
          <motion.div
            key={hoveredRole}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 pointer-events-none z-0"
          >
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px]"
              style={{ background: ROLES.find(r => r.id === hoveredRole)?.bgGlow }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back Button */}
      <Link
        to="/"
        className="absolute top-6 left-6 sm:top-8 sm:left-8 flex items-center text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors z-20 group cursor-pointer"
      >
        <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
        <span className="text-sm font-medium hidden sm:inline">Back to Home</span>
      </Link>

      {/* Header */}
      <motion.div
        initial="hidden"
        animate="visible"
        className="text-center z-10 mb-10 sm:mb-14"
      >
        <motion.img
          variants={fadeUp}
          custom={0}
          src="/winspot-logo.png"
          alt="WinSpot"
          className="h-12 sm:h-14 w-auto object-contain mx-auto mb-6"
          style={{ filter: 'drop-shadow(0 4px 16px rgba(147,51,234,0.35))' }}
        />
        <motion.h1
          variants={fadeUp}
          custom={0.08}
          className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-800 dark:text-white mb-3 tracking-tight transition-colors duration-500"
          style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
        >
          How will you use WinSpot?
        </motion.h1>
        <motion.p
          variants={fadeUp}
          custom={0.16}
          className="text-slate-500 dark:text-slate-400 text-base sm:text-lg max-w-lg mx-auto transition-colors duration-500"
        >
          Pick your role to get started. You can always switch later.
        </motion.p>
      </motion.div>

      {/* Role Cards Grid */}
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6 z-10">
        {ROLES.map((role, i) => (
          <motion.div
            key={role.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.12, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -4, transition: { duration: 0.25, ease: 'easeOut' } }}
            onHoverStart={() => setHoveredRole(role.id)}
            onHoverEnd={() => setHoveredRole(null)}
            className="group relative will-change-transform"
          >
            {/* Outer glow on hover */}
            <div
              className="absolute -inset-px rounded-[1.75rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{ background: `linear-gradient(135deg, ${role.accent.glowColor}, transparent 60%)`, filter: 'blur(8px)' }}
            />

            <div className={`relative h-full bg-white dark:bg-slate-900/60 backdrop-blur-xl border ${role.accent.cardBorder} ${role.accent.cardHoverBorder} rounded-[1.75rem] p-6 sm:p-8 flex flex-col overflow-hidden shadow-sm hover:shadow-xl transition-all duration-400`}>

              {/* Top Row: Animated Icon + Badge */}
              <div className="flex items-start justify-between mb-5">
                <motion.div
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl ${role.accent.iconBg} flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300`}
                >
                  <role.HeroIcon className="w-7 h-7 sm:w-8 sm:h-8" color="white" />
                </motion.div>
                <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${role.accent.badge}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${role.accent.dotColor}`} />
                  {role.subtitle}
                </span>
              </div>

              {/* Title & Description */}
              <h2
                className="text-2xl sm:text-[1.65rem] font-bold text-slate-800 dark:text-white mb-2 transition-colors duration-300"
                style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
              >
                {role.title}
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6 transition-colors duration-300">
                {role.description}
              </p>

              {/* Perk chips with animated icons */}
              <div className="flex flex-wrap gap-2 mb-7">
                {role.perks.map((perk, j) => (
                  <motion.span
                    key={perk.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + i * 0.1 + j * 0.08 }}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl ${role.accent.perkBg} ${role.accent.perkText} text-xs font-semibold`}
                  >
                    <perk.Icon className={`w-3.5 h-3.5 ${role.accent.perkIcon}`} />
                    {perk.label}
                  </motion.span>
                ))}
              </div>

              {/* CTAs */}
              <div className="mt-auto w-full space-y-2.5">
                <Link
                  to={role.loginPath}
                  className={`group/btn flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-bold text-[15px] active:scale-[0.97] transition-all duration-200 cursor-pointer ${role.accent.loginBtn} ${role.accent.loginBtnDark}`}
                >
                  Log In
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-200" />
                </Link>
                <Link
                  to={role.registerPath}
                  className="flex items-center justify-center w-full py-3.5 rounded-xl bg-slate-100/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 font-bold text-[15px] hover:bg-slate-200/60 dark:hover:bg-white/10 active:scale-[0.97] transition-all duration-200 text-center cursor-pointer"
                >
                  Create Account
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer hint */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-10 text-xs text-slate-400 dark:text-slate-600 text-center z-10"
      >
        By continuing, you agree to WinSpot's Terms of Service and Privacy Policy.
      </motion.p>
    </div>
  );
};

export default RoleSelection;
