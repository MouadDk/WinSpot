import { motion } from 'framer-motion';

export default function LoadingScreen({ message = "Loading..." }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 overflow-hidden">
      
      {/* Background glowing effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/20 dark:bg-purple-600/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-400/20 dark:bg-cyan-500/20 rounded-full blur-[80px] pointer-events-none mix-blend-screen" />

      {/* Logo Image */}
      <motion.img
        src="/winspot-logo.png"
        alt="WinSpot"
        className="w-56 sm:w-72 relative z-10 object-contain"
        style={{ filter: 'drop-shadow(0 12px 40px rgba(147,51,234,0.4))' }}
        animate={{ y: [0, -10, 0], scale: [1, 1.03, 1] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Loading Text */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="relative z-10 mt-8 flex flex-col items-center"
      >
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-lg font-bold text-slate-800 dark:text-white tracking-wide">
            {message}
          </p>
        </div>
      </motion.div>

    </div>
  );
}
