import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Loader2, ArrowRight, ArrowLeft,
  Mail, Lock, User, Eye, EyeOff, AlertCircle,
  ChevronDown,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { apiUrl } from '../lib/api';
import {
  StoreIcon, ScanIcon, AnalyticsIcon, PeopleIcon, VerifiedIcon,
} from '../components/ui/AnimatedIcons';

/* ─── Animation Presets (matching RoleSelection) ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] },
  }),
};

const CATEGORIES = [
  { value: 'Restaurant', label: 'Restaurant' },
  { value: 'Café', label: 'Café' },
  { value: 'Bar', label: 'Bar' },
  { value: 'Autre', label: 'Other' },
];

const PERKS = [
  { Icon: ScanIcon, text: 'Generate QR codes for every offer' },
  { Icon: AnalyticsIcon, text: 'Real-time analytics dashboard' },
  { Icon: PeopleIcon, text: 'Customer insights & engagement' },
  { Icon: VerifiedIcon, text: 'AI-verified visit tracking' },
];

/* ─── Reusable Input Field ─── */
function FormInput({ icon: Icon, label, type = 'text', ...rest }) {
  const [show, setShow] = useState(false);
  const isPassword = type === 'password';

  return (
    <div>
      <label className="block text-[13px] font-semibold text-slate-600 dark:text-slate-300 mb-1.5 ml-0.5">
        {label}
      </label>
      <div className="relative group">
        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-slate-400 dark:text-slate-500 group-focus-within:text-cyan-500 transition-colors duration-200" />
        <input
          type={isPassword ? (show ? 'text' : 'password') : type}
          className="w-full pl-11 pr-11 py-3 bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 rounded-xl text-sm text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/50 transition-all duration-200"
          {...rest}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer p-0.5"
            tabIndex={-1}
            aria-label={show ? 'Hide password' : 'Show password'}
          >
            {show ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
          </button>
        )}
      </div>
    </div>
  );
}

export default function RestaurantAuth({ isSignUp }) {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [category, setCategory] = useState('Restaurant');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        const res = await fetch(apiUrl('/api/auth/register'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email, password, firstName, lastName,
            role: 'merchant',
            category,
          }),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.message || 'Registration failed');

        const loginRes = await fetch(apiUrl('/api/auth/login'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        const loginData = await loginRes.json();
        if (!loginData.success) throw new Error(loginData.message || 'Auto-login failed');
        login(loginData.token, loginData.user);
        window.location.href = '/restaurant-dashboard';
      } else {
        const res = await fetch(apiUrl('/api/auth/login'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.message || 'Invalid email or password');
        login(data.token, data.user);
        window.location.href = '/restaurant-dashboard';
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0A0A0F] flex items-center justify-center px-4 sm:px-6 py-10 relative overflow-hidden transition-colors duration-500">

      {/* ── Ambient background glows (same as RoleSelection) ── */}
      <div className="absolute top-1/4 left-1/4 w-[800px] h-[800px] pointer-events-none mix-blend-screen opacity-40 dark:opacity-80 will-change-transform"
           style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.15) 0%, transparent 60%)' }} />
      <div className="absolute bottom-1/4 right-1/4 w-[800px] h-[800px] pointer-events-none mix-blend-screen opacity-40 dark:opacity-80 will-change-transform"
           style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 60%)' }} />

      {/* ── Back button ── */}
      <Link
        to="/choose-role"
        className="absolute top-6 left-6 sm:top-8 sm:left-8 flex items-center text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors z-20 group cursor-pointer"
      >
        <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
        <span className="text-sm font-medium hidden sm:inline">Back</span>
      </Link>

      {/* ── Main Card ── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-0"
      >
        {/* ── Left: Info panel ── */}
        <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-cyan-600 via-blue-600 to-blue-800 rounded-l-[1.75rem] p-10 relative overflow-hidden">
          {/* Decorative orbs */}
          <motion.div
            className="absolute top-[-60px] right-[-60px] w-60 h-60 bg-white/10 rounded-full blur-2xl"
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-[-40px] left-[-40px] w-48 h-48 bg-cyan-300/10 rounded-full blur-2xl"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          />
          <div className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }}
          />

          <div className="relative z-10">
            <motion.img
              src="/winspot-logo.png"
              alt="WinSpot"
              className="h-10 w-auto object-contain mb-10 brightness-0 invert opacity-80"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              transition={{ delay: 0.2 }}
            />

            <motion.div
              className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20 mb-6 shadow-xl"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              <StoreIcon className="w-8 h-8" color="white" />
            </motion.div>

            <motion.h2
              className="text-3xl font-extrabold text-white mb-3 tracking-tight"
              style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              Boost Your Business
            </motion.h2>
            <motion.p
              className="text-cyan-100/80 leading-relaxed text-[15px] mb-10"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Create offers, reward diners, and watch your customer base grow with AI-powered cashback.
            </motion.p>
          </div>

          {/* Feature list */}
          <div className="relative z-10 space-y-3">
            {PERKS.map((perk, i) => (
              <motion.div
                key={perk.text}
                className="flex items-center gap-3 text-white/80"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.1, duration: 0.4 }}
              >
                <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center shrink-0 border border-white/10">
                  <perk.Icon className="w-4 h-4" color="currentColor" />
                </div>
                <span className="text-sm font-medium">{perk.text}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Right: Form panel ── */}
        <div className="bg-white dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/80 dark:border-slate-700/50 rounded-[1.75rem] lg:rounded-l-none lg:rounded-r-[1.75rem] shadow-xl shadow-slate-200/40 dark:shadow-black/20 p-7 sm:p-9 flex flex-col justify-center">

          {/* Mobile logo + icon (visible < lg) */}
          <div className="lg:hidden flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <StoreIcon className="w-5 h-5" color="white" />
            </div>
            <img src="/winspot-logo.png" alt="WinSpot" className="h-8 w-auto object-contain" style={{ filter: 'drop-shadow(0 2px 6px rgba(6,182,212,0.3))' }} />
          </div>

          {/* Heading */}
          <motion.div initial="hidden" animate="visible" className="mb-6">
            <motion.h1
              variants={fadeUp}
              custom={0.05}
              className="text-2xl sm:text-[1.7rem] font-bold text-slate-900 dark:text-white tracking-tight"
              style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
            >
              {isSignUp ? 'Create your account' : 'Welcome back'}
            </motion.h1>
            <motion.p variants={fadeUp} custom={0.1} className="text-slate-500 dark:text-slate-400 text-sm mt-1.5">
              {isSignUp ? 'Set up your merchant profile to start creating offers.' : 'Sign in to manage your restaurant\'s cashback offers.'}
            </motion.p>
          </motion.div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8, scaleY: 0.95 }}
                animate={{ opacity: 1, y: 0, scaleY: 1 }}
                exit={{ opacity: 0, y: -8, scaleY: 0.95 }}
                className="mb-5 origin-top"
              >
                <div className="flex items-start gap-2.5 p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl">
                  <AlertCircle className="w-4.5 h-4.5 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700 dark:text-red-300 font-medium leading-snug">{error}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-4"
            initial="hidden"
            animate="visible"
          >
            {isSignUp && (
              <motion.div variants={fadeUp} custom={0.14} className="grid grid-cols-2 gap-3">
                <FormInput icon={User} label="First name" required value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="John" />
                <FormInput icon={User} label="Last name" required value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Doe" />
              </motion.div>
            )}

            <motion.div variants={fadeUp} custom={isSignUp ? 0.18 : 0.14}>
              <FormInput icon={Mail} label="Business email" type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@restaurant.com" />
            </motion.div>

            <motion.div variants={fadeUp} custom={isSignUp ? 0.22 : 0.18}>
              <FormInput icon={Lock} label="Password" type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
            </motion.div>

            {isSignUp && (
              <motion.div variants={fadeUp} custom={0.26}>
                <label className="block text-[13px] font-semibold text-slate-600 dark:text-slate-300 mb-1.5 ml-0.5">Business type</label>
                <div className="relative group">
                  <StoreIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px]" color="currentColor" />
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full pl-11 pr-10 py-3 bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 rounded-xl text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/50 transition-all duration-200 appearance-none cursor-pointer"
                  >
                    {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </motion.div>
            )}

            {/* Submit */}
            <motion.div variants={fadeUp} custom={isSignUp ? 0.3 : 0.22} className="pt-1">
              <button
                type="submit"
                disabled={loading}
                className="group/btn w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl font-bold text-[15px] cursor-pointer
                  bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600
                  dark:from-white dark:to-slate-100 dark:text-slate-900 dark:hover:from-slate-100 dark:hover:to-white
                  text-white shadow-lg shadow-cyan-500/25 dark:shadow-white/10
                  hover:shadow-xl active:scale-[0.97] transition-all duration-200
                  disabled:opacity-50 disabled:cursor-not-allowed
                  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    {isSignUp ? 'Create Account' : 'Sign In'}
                    <ArrowRight className="w-4.5 h-4.5 group-hover/btn:translate-x-1 transition-transform duration-200" />
                  </>
                )}
              </button>
            </motion.div>
          </motion.form>

          {/* Switch link */}
          <motion.p
            variants={fadeUp}
            custom={isSignUp ? 0.36 : 0.28}
            initial="hidden"
            animate="visible"
            className="text-center text-sm text-slate-500 dark:text-slate-400 mt-7"
          >
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <Link
              to={isSignUp ? '/restaurant/login' : '/restaurant/register'}
              className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 font-semibold transition-colors cursor-pointer"
            >
              {isSignUp ? 'Sign in' : 'Create one'}
            </Link>
          </motion.p>
        </div>
      </motion.div>

      {/* Footer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="absolute bottom-6 text-xs text-slate-400 dark:text-slate-600 z-10"
      >
        By continuing, you agree to WinSpot's Terms of Service and Privacy Policy.
      </motion.p>
    </div>
  );
}
