import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import CinematicTypewriter from './CinematicTypewriter';

export default function Hero() {
  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const el = document.getElementById(targetId);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: top - 80, behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative min-h-screen pt-32 pb-32 overflow-hidden flex items-center bg-transparent">
      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full relative z-10 flex flex-col justify-center h-full">
        
        {/* Left Content */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-start max-w-2xl mt-12"
        >
          {/* Subtitle */}
          <div className="flex items-center gap-4 mb-5">
            <div className="w-5 h-[1px] bg-gray-400"></div>
            <span className="text-[11px] font-medium text-gray-400 tracking-[0.25em] uppercase">
              AI-Powered Creative Agency
            </span>
          </div>

          {/* Main Title - with forced line breaks and gradient */}
          <h1 className="text-[2.5rem] leading-[1.1] sm:text-5xl md:text-[5rem] lg:text-[5.5rem] font-medium md:leading-[1.05] tracking-tight mb-6 min-h-[140px] sm:min-h-[160px] md:min-h-[180px]">
            <span className="block text-white whitespace-normal md:whitespace-nowrap pb-2">We Build</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-gray-500 whitespace-normal md:whitespace-nowrap pb-1 lg:pb-3 h-[2.2em]">
              <CinematicTypewriter 
                words={[
                  "Premium Digital Experiences.",
                  "AI-Powered Creative Systems.",
                  "Luxury Website Design.",
                  "Modern Brand Identity."
                ]}
                typingSpeed={85}
                deletingSpeed={45}
                delayPause={3000}
                cursorClassName="bg-white/80"
              />
            </span>
          </h1>

          {/* Description */}
          <p className="text-[17px] text-gray-300 leading-[1.6] mb-12 max-w-[500px]">
            Websites, branding, AI videos, and digital systems <br className="hidden md:block" />
            designed for modern businesses.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-12 md:mb-16 w-full sm:w-auto">
            <a 
              href="#contact" 
              onClick={(e) => handleScrollTo(e, 'contact')}
              className="flex items-center justify-center gap-3 px-6 py-3.5 bg-white text-black text-[14px] font-medium rounded-lg hover:bg-gray-100 transition-colors w-full sm:w-auto"
            >
              Get Started <ArrowRight size={16} />
            </a>
            <a 
              href="#work" 
              onClick={(e) => handleScrollTo(e, 'work')}
              className="flex items-center justify-center gap-3 px-6 py-3.5 bg-transparent text-white text-[14px] font-medium rounded-lg border border-white/20 hover:bg-white/10 transition-colors w-full sm:w-auto"
            >
              View Our Work <ArrowRight size={16} />
            </a>
          </div>

          {/* Tags Footer */}
          <div className="flex flex-wrap items-center gap-5 md:gap-8 text-[11px] font-medium tracking-[0.25em] text-gray-400 uppercase">
            <span>Websites</span>
            <div className="w-1 h-1 rounded-full bg-gray-600"></div>
            <span>Branding</span>
            <div className="w-1 h-1 rounded-full bg-gray-600"></div>
            <span>AI Video</span>
            <div className="w-1 h-1 rounded-full bg-gray-600"></div>
            <span>Data</span>
          </div>
        </motion.div>

      </div>

      {/* Scroll Indicator - positioned to avoid overlapping */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="absolute bottom-6 md:bottom-12 left-6 md:left-12 flex items-center gap-5"
      >
        <div className="flex flex-col items-center gap-1.5">
          <div className="w-[1px] h-3 bg-gray-600"></div>
          <div className="w-[22px] h-[36px] border border-gray-500 rounded-full flex justify-center pt-2 relative">
            <div className="w-[3px] h-[6px] bg-gray-400 rounded-full animate-bounce"></div>
          </div>
          <div className="w-[1px] h-3 bg-gray-600"></div>
        </div>
        <span className="text-[11px] font-medium tracking-[0.25em] text-gray-400 uppercase hidden sm:block">
          Scroll to explore
        </span>
      </motion.div>
    </section>
  );
}
