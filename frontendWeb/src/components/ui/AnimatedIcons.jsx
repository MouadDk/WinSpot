/**
 * AnimatedIcons.jsx
 * ─────────────────
 * Custom animated SVG hero icons for WinSpot.
 * Each icon uses Framer Motion pathLength draw animations,
 * subtle floating/pulse effects, and gradient fills for a premium feel.
 *
 * Usage:
 *   <StoreIcon className="w-8 h-8" />
 *   <CashbackIcon className="w-8 h-8" />
 */
import { motion } from 'framer-motion';

/* ─── Shared draw animation config ─── */
const draw = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (delay = 0) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { delay, duration: 0.8, ease: [0.22, 1, 0.36, 1] },
      opacity: { delay, duration: 0.2 },
    },
  }),
};

/**
 * StoreIcon — Modern storefront for Restaurant / Merchant
 * Replaces the old UtensilsCrossed icon
 */
export function StoreIcon({ className = 'w-8 h-8', color = 'currentColor' }) {
  return (
    <motion.svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      initial="hidden"
      animate="visible"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Roof / awning */}
      <motion.path
        d="M3 9L5 3H19L21 9"
        variants={draw}
        custom={0}
      />
      {/* Awning scallops */}
      <motion.path
        d="M3 9C3 10.66 4.34 12 6 12C7.66 12 9 10.66 9 9C9 10.66 10.34 12 12 12C13.66 12 15 10.66 15 9C15 10.66 16.34 12 18 12C19.66 12 21 10.66 21 9"
        variants={draw}
        custom={0.15}
      />
      {/* Building body */}
      <motion.path
        d="M4 12V20H20V12"
        variants={draw}
        custom={0.3}
      />
      {/* Door */}
      <motion.path
        d="M10 20V16C10 14.9 10.9 14 12 14C13.1 14 14 14.9 14 16V20"
        variants={draw}
        custom={0.45}
      />
      {/* Floating sparkle accent */}
      <motion.circle
        cx="18"
        cy="5"
        r="0.8"
        fill={color}
        stroke="none"
        initial={{ opacity: 0, scale: 0 }}
        animate={{
          opacity: [0, 1, 0],
          scale: [0, 1.2, 0],
        }}
        transition={{ delay: 1, duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
      />
    </motion.svg>
  );
}

/**
 * CashbackIcon — Wallet + coin for Customer / Cashback
 * Replaces the old Wallet icon
 */
export function CashbackIcon({ className = 'w-8 h-8', color = 'currentColor' }) {
  return (
    <motion.svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      initial="hidden"
      animate="visible"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Wallet body */}
      <motion.rect
        x="2"
        y="6"
        width="20"
        height="14"
        rx="3"
        variants={draw}
        custom={0}
      />
      {/* Wallet flap */}
      <motion.path
        d="M2 10H22"
        variants={draw}
        custom={0.2}
      />
      {/* Card slot */}
      <motion.path
        d="M16 14.5H18"
        variants={draw}
        custom={0.35}
        strokeWidth={2.2}
      />
      {/* Animated coin floating above wallet */}
      <motion.circle
        cx="18"
        cy="4"
        r="3"
        strokeWidth={1.6}
        variants={draw}
        custom={0.4}
      />
      {/* Coin symbol */}
      <motion.path
        d="M17.2 3.2L18.8 4.8M18.8 3.2L17.2 4.8"
        variants={draw}
        custom={0.55}
        strokeWidth={1.4}
      />
      {/* Floating pulse on coin */}
      <motion.circle
        cx="18"
        cy="4"
        r="3"
        stroke={color}
        strokeWidth={0.8}
        fill="none"
        initial={{ opacity: 0, scale: 1 }}
        animate={{
          opacity: [0, 0.5, 0],
          scale: [1, 1.6, 1.8],
        }}
        transition={{ delay: 1.2, duration: 2, repeat: Infinity, repeatDelay: 2.5 }}
      />
    </motion.svg>
  );
}

/**
 * AnalyticsIcon — Chart with upward trend for Live Analytics
 */
export function AnalyticsIcon({ className = 'w-4 h-4', color = 'currentColor' }) {
  return (
    <motion.svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      initial="hidden"
      animate="visible"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <motion.path d="M3 3V21H21" variants={draw} custom={0} />
      <motion.path d="M7 16L12 11L15 14L21 7" variants={draw} custom={0.2} />
      <motion.path d="M17 7H21V11" variants={draw} custom={0.4} />
    </motion.svg>
  );
}

/**
 * ScanIcon — QR scan frame for QR Code
 */
export function ScanIcon({ className = 'w-4 h-4', color = 'currentColor' }) {
  return (
    <motion.svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      initial="hidden"
      animate="visible"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
    >
      {/* Corners */}
      <motion.path d="M3 8V5C3 3.9 3.9 3 5 3H8" variants={draw} custom={0} />
      <motion.path d="M16 3H19C20.1 3 21 3.9 21 5V8" variants={draw} custom={0.1} />
      <motion.path d="M21 16V19C21 20.1 20.1 21 19 21H16" variants={draw} custom={0.2} />
      <motion.path d="M8 21H5C3.9 21 3 20.1 3 19V16" variants={draw} custom={0.3} />
      {/* Scan line */}
      <motion.line
        x1="5" y1="12" x2="19" y2="12"
        strokeWidth={1.5}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: [0, 1, 1, 0] }}
        transition={{ delay: 0.5, duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
      />
    </motion.svg>
  );
}

/**
 * PeopleIcon — Group / audience for Customer Insights
 */
export function PeopleIcon({ className = 'w-4 h-4', color = 'currentColor' }) {
  return (
    <motion.svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      initial="hidden"
      animate="visible"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <motion.circle cx="9" cy="7" r="3" variants={draw} custom={0} />
      <motion.path d="M3 21V18C3 16.34 6.58 15 9 15" variants={draw} custom={0.15} />
      <motion.circle cx="17" cy="8" r="2.5" variants={draw} custom={0.2} />
      <motion.path d="M15 15C16.4 15 21 15.9 21 18V21" variants={draw} custom={0.35} />
    </motion.svg>
  );
}

/**
 * RewardIcon — Gift / star badge for Instant Cashback
 */
export function RewardIcon({ className = 'w-4 h-4', color = 'currentColor' }) {
  return (
    <motion.svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      initial="hidden"
      animate="visible"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Star */}
      <motion.path
        d="M12 2L14.9 8.6L22 9.3L17 14L18.2 21L12 17.5L5.8 21L7 14L2 9.3L9.1 8.6L12 2Z"
        variants={draw}
        custom={0}
      />
      {/* Sparkle */}
      <motion.circle
        cx="19"
        cy="4"
        r="0.7"
        fill={color}
        stroke="none"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
        transition={{ delay: 1, duration: 1.2, repeat: Infinity, repeatDelay: 3 }}
      />
    </motion.svg>
  );
}

/**
 * CoinStackIcon — Stacked coins for WinCoin Wallet
 */
export function CoinStackIcon({ className = 'w-4 h-4', color = 'currentColor' }) {
  return (
    <motion.svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      initial="hidden"
      animate="visible"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
    >
      {/* Bottom coin */}
      <motion.ellipse cx="12" cy="18" rx="8" ry="3" variants={draw} custom={0} />
      {/* Middle coin */}
      <motion.path d="M4 14V18" variants={draw} custom={0.1} />
      <motion.path d="M20 14V18" variants={draw} custom={0.1} />
      <motion.ellipse cx="12" cy="14" rx="8" ry="3" variants={draw} custom={0.15} />
      {/* Top coin */}
      <motion.path d="M4 10V14" variants={draw} custom={0.25} />
      <motion.path d="M20 10V14" variants={draw} custom={0.25} />
      <motion.ellipse cx="12" cy="10" rx="8" ry="3" variants={draw} custom={0.3} />
    </motion.svg>
  );
}

/**
 * ShieldLockIcon — Shield with lock for Secure Withdrawals
 */
export function ShieldLockIcon({ className = 'w-4 h-4', color = 'currentColor' }) {
  return (
    <motion.svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      initial="hidden"
      animate="visible"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Shield */}
      <motion.path
        d="M12 2L4 6V12C4 16.42 7.42 20.74 12 22C16.58 20.74 20 16.42 20 12V6L12 2Z"
        variants={draw}
        custom={0}
      />
      {/* Checkmark inside shield */}
      <motion.path
        d="M9 12L11 14L15 10"
        variants={draw}
        custom={0.3}
        strokeWidth={2}
      />
    </motion.svg>
  );
}

/**
 * VerifiedIcon — Checkmark badge for AI-verified
 */
export function VerifiedIcon({ className = 'w-4 h-4', color = 'currentColor' }) {
  return (
    <motion.svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      initial="hidden"
      animate="visible"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <motion.circle cx="12" cy="12" r="9" variants={draw} custom={0} />
      <motion.path d="M8 12L11 15L16 9" variants={draw} custom={0.25} strokeWidth={2.2} />
      {/* Pulse ring */}
      <motion.circle
        cx="12" cy="12" r="9"
        stroke={color}
        strokeWidth={0.5}
        fill="none"
        initial={{ opacity: 0, scale: 1 }}
        animate={{ opacity: [0, 0.4, 0], scale: [1, 1.3, 1.5] }}
        transition={{ delay: 1, duration: 2, repeat: Infinity, repeatDelay: 3 }}
      />
    </motion.svg>
  );
}

/**
 * BoltIcon — Lightning bolt for Instant / Zap
 */
export function BoltIcon({ className = 'w-4 h-4', color = 'currentColor' }) {
  return (
    <motion.svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      initial="hidden"
      animate="visible"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <motion.path
        d="M13 2L4 14H12L11 22L20 10H12L13 2Z"
        variants={draw}
        custom={0}
      />
    </motion.svg>
  );
}
