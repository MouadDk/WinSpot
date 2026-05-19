import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Zap, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] },
  }),
};

const accentStyles = {
  purple: {
    gradient: 'from-purple-900 via-purple-700 to-purple-800',
    blob1: 'bg-purple-400',
    blob2: 'bg-fuchsia-400',
    textMuted: 'text-purple-200',
    iconGlow: 'shadow-purple-500/30',
    featureColor: 'text-purple-200',
    featureIconBg: 'bg-white/10',
    features: [
      { icon: Zap, text: 'Instant cashback on every meal' },
      { icon: Shield, text: 'Secure wallet with real withdrawals' },
      { icon: CheckCircle2, text: 'AI-verified transactions' },
    ],
  },
  cyan: {
    gradient: 'from-blue-800 via-cyan-700 to-blue-900',
    blob1: 'bg-cyan-300',
    blob2: 'bg-blue-300',
    textMuted: 'text-cyan-100',
    iconGlow: 'shadow-cyan-500/30',
    featureColor: 'text-cyan-100',
    featureIconBg: 'bg-white/10',
    features: [
      { icon: Zap, text: 'Launch cashback offers in minutes' },
      { icon: Shield, text: 'Real-time analytics & insights' },
      { icon: CheckCircle2, text: 'QR code generation built-in' },
    ],
  },
};

export default function AuthLayout({
  brandTitle,
  brandSubtitle,
  brandIcon: BrandIcon,
  accentColor = 'purple',
  children,
  backLink = '/choose-role',
}) {
  const accent = accentStyles[accentColor];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50 dark:bg-[#0A0A0F] transition-colors duration-500">
      {/* ── Left: Branded Panel ── */}
      <div
        className={`
          hidden lg:flex lg:w-1/2 xl:w-[45%]
          bg-gradient-to-br ${accent.gradient}
          relative overflow-hidden flex-col items-center justify-center p-12
        `}
      >
        {/* Animated decorative orbs */}
        <motion.div
          className={`absolute top-20 -left-20 w-80 h-80 ${accent.blob1} opacity-10 rounded-full blur-3xl`}
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.15, 0.1] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className={`absolute bottom-20 -right-20 w-96 h-96 ${accent.blob2} opacity-10 rounded-full blur-3xl`}
          animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.18, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />

        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />

        <motion.div
          className="relative z-10 text-center max-w-md"
          initial="hidden"
          animate="visible"
        >
          {/* Logo */}
          <motion.div variants={fadeUp} custom={0}>
            <img
              src="/winspot-logo.png"
              alt="WinSpot"
              className="h-16 w-auto object-contain mx-auto mb-8"
              style={{ filter: 'drop-shadow(0 4px 20px rgba(255,255,255,0.2))' }}
            />
          </motion.div>

          {/* Icon */}
          {BrandIcon && (
            <motion.div variants={fadeUp} custom={0.1}>
              <div className={`w-20 h-20 mx-auto mb-8 bg-white/10 backdrop-blur-sm rounded-3xl flex items-center justify-center border border-white/20 shadow-2xl ${accent.iconGlow}`}>
                <BrandIcon className="w-10 h-10 text-white" />
              </div>
            </motion.div>
          )}

          <motion.h1
            variants={fadeUp}
            custom={0.2}
            className="text-4xl xl:text-5xl font-extrabold text-white mb-4 tracking-tight leading-tight"
            style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
          >
            {brandTitle}
          </motion.h1>

          <motion.p
            variants={fadeUp}
            custom={0.3}
            className={`text-lg ${accent.textMuted} leading-relaxed mb-10`}
          >
            {brandSubtitle}
          </motion.p>

          {/* Feature list */}
          <motion.div variants={fadeUp} custom={0.4} className="space-y-4">
            {accent.features.map((feature, i) => (
              <motion.div
                key={feature.text}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.12, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className={`flex items-center gap-3 ${accent.featureColor} text-sm`}
              >
                <div className={`w-8 h-8 rounded-lg ${accent.featureIconBg} backdrop-blur-sm flex items-center justify-center shrink-0`}>
                  <feature.icon className="w-4 h-4 text-white" />
                </div>
                <span className="font-medium">{feature.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/10 to-transparent" />
      </div>

      {/* ── Right: Form Panel ── */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-8 lg:p-12 relative min-h-screen lg:min-h-0">
        {/* Background ambient glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute top-1/3 right-1/4 w-[600px] h-[600px] opacity-30 dark:opacity-50 mix-blend-screen"
            style={{ background: accentColor === 'purple'
              ? 'radial-gradient(circle, rgba(147,51,234,0.08) 0%, transparent 60%)'
              : 'radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 60%)'
            }}
          />
        </div>

        {/* Mobile brand header (visible < lg) */}
        <motion.div
          className="lg:hidden mb-8 text-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <img
            src="/winspot-logo.png"
            alt="WinSpot"
            className="h-12 w-auto object-contain mx-auto mb-4"
            style={{ filter: 'drop-shadow(0 2px 8px rgba(147,51,234,0.3))' }}
          />
          {BrandIcon && (
            <div
              className={`w-14 h-14 mx-auto mb-4 bg-gradient-to-br ${accent.gradient} rounded-2xl flex items-center justify-center shadow-lg`}
            >
              <BrandIcon className="w-7 h-7 text-white" />
            </div>
          )}
          <h1
            className="text-2xl font-extrabold text-slate-800 dark:text-white"
            style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
          >
            {brandTitle}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            {brandSubtitle}
          </p>
        </motion.div>

        <motion.div
          className="w-full max-w-md relative z-10"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          {children}
        </motion.div>

        {/* Back link */}
        <motion.div
          className="mt-8 relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Link
            to={backLink}
            className="group inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Role Selection
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
