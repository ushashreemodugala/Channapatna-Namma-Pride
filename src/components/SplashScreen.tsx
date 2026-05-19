import { motion } from 'motion/react';
import { Package, Star } from 'lucide-react';

interface SplashScreenProps {
  t: any;
}

export default function SplashScreen({ t }: SplashScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-[100] bg-toy-wood-bg flex flex-col items-center justify-center p-8 text-center overflow-hidden touch-none"
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          duration: 1.2, 
          ease: [0.23, 1, 0.32, 1],
          delay: 0.2
        }}
        className="relative mb-12 flex flex-col items-center"
      >
        <div className="relative w-64 h-64 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="w-full h-full rounded-[4rem] overflow-hidden border-8 border-toy-black shadow-[12px_12px_0px_0px_rgba(26,26,26,1)] bg-white flex items-center justify-center relative shadow-inner"
          >
            <img 
              src="https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=800" 
              alt="Traditional Channapatna Toys"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {/* Glossy overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/40 pointer-events-none" />
          </motion.div>
        
          {/* Decorative Ring */}
          <div className="absolute -inset-10 border-4 border-dashed border-toy-red rounded-full animate-spin-slow opacity-20" />
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
      >
        <h1 className="text-3xl font-black text-toy-black mb-2 uppercase tracking-tighter leading-none">
          {t.appTitle.split(' – ')[0]}
          <span className="block text-toy-red text-xl">{t.appTitle.split(' – ')[1]}</span>
        </h1>
        <div className="h-1 w-12 bg-toy-black mx-auto my-4 rounded-full" />
        <p className="text-sm font-black text-toy-brown italic uppercase tracking-wider max-w-xs mx-auto">
          {t.tagline}
        </p>
      </motion.div>

      {/* Loading indicator */}
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: "100px" }}
        transition={{ delay: 0.5, duration: 2.5 }}
        className="absolute bottom-16 left-1/2 -translate-x-1/2 h-1 bg-toy-black/10 rounded-full overflow-hidden w-24"
      >
        <div className="h-full bg-toy-orange w-full animate-progress" />
      </motion.div>
    </motion.div>
  );
}
