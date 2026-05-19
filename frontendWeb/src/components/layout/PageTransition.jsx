import { motion } from 'framer-motion';

/**
 * PageTransition — wraps any page/sub-route with a smooth fade+slide animation.
 * Used inside DashboardLayout's <Outlet> so every sub-page transition is animated.
 *
 * Respects prefers-reduced-motion via Framer Motion's built-in support.
 *
 * Usage:
 *   <PageTransition>
 *     <YourPageContent />
 *   </PageTransition>
 */
const variants = {
  hidden:  { opacity: 0, y: 16, filter: 'blur(4px)' },
  visible: { opacity: 1, y: 0,  filter: 'blur(0px)' },
  exit:    { opacity: 0, y: -8, filter: 'blur(2px)' },
};

export default function PageTransition({ children }) {
  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
