import { motion } from 'framer-motion';

/**
 * PageTransition — wraps any page/sub-route with a smooth fade+slide animation.
 * Used inside DashboardLayout's <Outlet> so every sub-page transition is animated.
 *
 * Usage:
 *   <PageTransition>
 *     <YourPageContent />
 *   </PageTransition>
 */
const variants = {
  hidden:  { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -8 },
};

export default function PageTransition({ children }) {
  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ duration: 0.22, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}
