import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import { motion } from 'framer-motion';
import Logo3D from './Logo3D';

export default function LoadingScreen({ message = "Loading..." }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 overflow-hidden">
      
      {/* Background glowing effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/20 dark:bg-purple-600/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-400/20 dark:bg-cyan-500/20 rounded-full blur-[80px] pointer-events-none mix-blend-screen" />

      {/* 3D Canvas */}
      <div className="w-full h-64 sm:h-80 relative z-10">
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <ambientLight intensity={1.5} />
          <directionalLight position={[10, 10, 5]} intensity={3} />
          <pointLight position={[0, 0, 5]} intensity={2} />
          <Suspense fallback={null}>
            <Logo3D scale={1.2} />
          </Suspense>
          <OrbitControls 
            enableZoom={false} 
            enablePan={false}
            autoRotate 
            autoRotateSpeed={2}
          />
        </Canvas>
      </div>

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
