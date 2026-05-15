import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [phase, setPhase] = useState<'appear' | 'logo-visible' | 'revealing' | 'finishing'>('appear');

  useEffect(() => {
    // Fast sequence
    const t1 = setTimeout(() => setPhase('logo-visible'), 50);
    const t2 = setTimeout(() => setPhase('revealing'), 150);
    const t3 = setTimeout(() => setPhase('finishing'), 650); // 0.5s duration
    const t4 = setTimeout(() => onComplete(), 800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  const isRevealing = phase === 'revealing' || phase === 'finishing';

  return (
    <motion.div
      className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-[#050505] overflow-hidden"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Cinematic Background Atmosphere */}
      <motion.div 
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/[0.03] via-transparent to-transparent pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.0 }}
      />

      <div className="relative z-10 flex flex-col items-center">
        {/* Brand Logo - Uses nested layoutIds to seamlessly transition to Navbar */}
        <motion.div
          layoutId="brand-container"
          className="flex flex-col items-center gap-5"
          initial={{ scale: 0.95, y: 15 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex flex-col items-center">
            


            <motion.div layoutId="brand-text">
              <div className="relative pb-3 pr-2 flex justify-center items-center">
                
                {/* Embedded CSS for perfectly synced, massively feathered mask animation */}
                <style>{`
                  .reveal-base {
                    /* Wide 33% feather to prevent sharp edges and typewriter illusion */
                    -webkit-mask-image: linear-gradient(to right, black 0%, black 33.3%, transparent 66.6%, transparent 100%);
                    -webkit-mask-size: 300% 100%;
                    -webkit-mask-repeat: no-repeat;
                    -webkit-mask-position: 100% 0%;
                  }
                  .reveal-base.animate {
                    animation: waveReveal 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
                  }
                  
                  .reveal-glow {
                    /* Glowing spotlight centered exactly in the middle of the feather */
                    -webkit-mask-image: linear-gradient(to right, transparent 0%, transparent 33.3%, black 50%, transparent 66.6%, transparent 100%);
                    -webkit-mask-size: 300% 100%;
                    -webkit-mask-repeat: no-repeat;
                    -webkit-mask-position: 100% 0%;
                  }
                  .reveal-glow.animate {
                    animation: waveReveal 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
                  }
                  
                  @keyframes waveReveal {
                    0% { -webkit-mask-position: 100% 0%; }
                    100% { -webkit-mask-position: 0% 0%; }
                  }
                `}</style>

                {/* 1. Base Layer (Sharp Text) - Fully rendered but masked */}
                <span className={`reveal-base font-serif font-medium text-[28px] md:text-[34px] tracking-[0.15em] text-white uppercase text-center block whitespace-nowrap ${isRevealing ? 'animate' : ''}`}>
                  AI METAWORLD
                </span>

                {/* 2. Cinematic Reveal Head Spotlight (Blurred & Glowing) */}
                <motion.span 
                  className={`reveal-glow absolute top-0 left-0 w-full h-full font-serif font-medium text-[28px] md:text-[34px] tracking-[0.15em] text-[#ceab7a] uppercase text-center block whitespace-nowrap pointer-events-none ${isRevealing ? 'animate' : ''}`}
                  initial={{ opacity: 1 }}
                  animate={{ opacity: phase === 'finishing' ? 0 : 1 }}
                  transition={{ duration: 0.6 }}
                  style={{
                    filter: "blur(6px)",
                    textShadow: "0 0 20px rgba(206,171,122,1)"
                  }}
                >
                  AI METAWORLD
                </motion.span>

                {/* 3. Synchronized "Writing" Underline driving the reveal */}
                <motion.div
                  className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-transparent via-[#ceab7a] to-white shadow-[0_0_15px_rgba(206,171,122,0.8)]"
                  initial={{ width: '0%', opacity: 1 }}
                  animate={{ 
                    width: isRevealing ? '100%' : '0%',
                    opacity: phase === 'finishing' ? 0 : 1 
                  }}
                  transition={{ 
                    width: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
                    opacity: { duration: 0.2, ease: "easeInOut" }
                  }}
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
