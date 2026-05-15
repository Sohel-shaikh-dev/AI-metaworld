import { memo } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Zap, Monitor, PenTool, Video, BarChart3, Shirt, Rocket, Star, Calendar, Sparkles } from 'lucide-react';
import CinematicTypewriter from './CinematicTypewriter';

const Hero = memo(function Hero() {
  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const el = document.getElementById(targetId);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: top - 80, behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative pt-24 pb-16 md:pt-40 md:pb-24 overflow-hidden flex flex-col bg-[#050505] min-h-screen">
      {/* Section-Specific Background Image (hero section part 1.webp) */}
      <div className="absolute top-[5%] md:top-[-2%] lg:top-[-3%] right-0 md:right-[8%] lg:right-[12%] w-full md:w-[65%] lg:w-[60%] h-[50vh] md:h-[110%] z-0 flex justify-end items-start pointer-events-none"
           style={{ maskImage: 'linear-gradient(to right, transparent, black 30%)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 30%)' }}>
        <img 
          src="/Assets/hero section part 1.webp" 
          alt="Hero 3D AI Background" 
          className="w-full h-full object-contain object-right-top"
          style={{ objectPosition: 'right 20%' }}
          fetchPriority="high"
          loading="eager"
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full relative z-10 flex flex-col h-full">
        
        {/* Top Content Area (Left Aligned) */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-start w-full md:w-[50%] lg:w-[45%] max-w-[600px] relative z-20 pt-8 md:pt-12"
        >
          {/* Premium Glass Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/[0.03] border border-[#ceab7a]/30 backdrop-blur-md mb-8 group shadow-[0_0_20px_rgba(206,171,122,0.05)] cursor-default"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
            <span className="text-[10px] sm:text-[11px] font-semibold text-white tracking-[0.15em] uppercase">
              Available for New Projects
            </span>
          </motion.div>

          {/* Main Title */}
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="text-[2.5rem] leading-[1.1] sm:text-[3.5rem] md:text-[3.8rem] lg:text-[4.5rem] font-bold md:leading-[1.05] tracking-tight mb-6 min-h-[140px] sm:min-h-[160px] md:min-h-[180px]"
          >
            <span className="block text-white pb-2">We Build</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#e8d3b5] via-[#ceab7a] to-[#a8824a] pb-2 lg:pb-4 min-h-[2.6em] whitespace-pre-wrap">
              <CinematicTypewriter 
                words={[
                  "AI-Powered\nCreative Systems.",
                  "Premium\nDigital Experiences.",
                  "Luxury\nWebsite Design.",
                  "Modern\nBrand Identity."
                ]}
                typingSpeed={85}
                deletingSpeed={45}
                delayPause={3000}
                cursorClassName="bg-[#ceab7a]/80"
              />
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-[17px] sm:text-[18px] text-gray-400 leading-[1.6] mb-8 max-w-[550px] font-medium"
          >
            Websites, branding, AI videos, and digital systems designed for modern businesses.
          </motion.p>

          {/* Accent Line */}
          <motion.div 
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 64 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="h-[2px] bg-[#ceab7a] mb-10"
          ></motion.div>

          {/* Premium CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="flex flex-wrap items-center gap-4 mb-6 w-full sm:w-auto"
          >
            <motion.a 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              href="#contact" 
              onClick={(e) => handleScrollTo(e, 'contact')}
              className="group flex items-center justify-center gap-3 px-6 py-3.5 sm:px-8 sm:py-4 bg-gradient-to-r from-[#e8d3b5] via-[#ceab7a] to-[#a8824a] text-black text-[14px] sm:text-[15px] font-bold tracking-[0.02em] rounded-xl shadow-[0_0_20px_rgba(206,171,122,0.3)] transition-all flex-1 sm:flex-none whitespace-nowrap min-w-[160px]"
            >
              Start a Project <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </motion.a>

            <motion.a 
              whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.03)' }}
              whileTap={{ scale: 0.98 }}
              href="#process" 
              onClick={(e) => handleScrollTo(e, 'process')}
              className="group flex items-center justify-center gap-3 px-6 py-3.5 sm:px-8 sm:py-4 bg-transparent border border-[#ceab7a]/50 text-white text-[14px] sm:text-[15px] font-medium tracking-[0.02em] rounded-xl transition-all flex-1 sm:flex-none whitespace-nowrap min-w-[160px] hover:border-[#ceab7a]"
            >
              <Play size={18} className="text-[#ceab7a]" fill="currentColor" fillOpacity={0.2} /> Our Process
            </motion.a>
          </motion.div>

          {/* Trust Text */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex items-center gap-2 mb-12 md:mb-24"
          >
            <Zap size={16} className="text-[#ceab7a] fill-[#ceab7a]" />
            <span className="text-[13px] text-gray-400 font-medium">Usually replies within 1 hour</span>
          </motion.div>

        </motion.div>

        {/* Middle Elements: Service Pills Row */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="w-full flex overflow-x-auto no-scrollbar md:flex-wrap md:justify-center gap-3 md:gap-4 mb-12 pb-2 md:pb-0 snap-x"
        >
          {[
            { name: 'WEBSITES', icon: Monitor },
            { name: 'BRANDING', icon: PenTool },
            { name: 'AI VIDEO', icon: Video },
            { name: 'DATA ANALYSIS', icon: BarChart3 },
            { name: 'PRINT-ON-DEMAND', icon: Shirt }
          ].map((service) => (
            <div key={service.name} className="flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-[#ceab7a]/30 bg-white/[0.02] hover:bg-white/[0.05] transition-colors cursor-default snap-center shrink-0">
              <service.icon size={16} className="text-[#ceab7a]" />
              <span className="text-[11px] md:text-[12px] font-semibold text-gray-300 tracking-[0.1em]">{service.name}</span>
            </div>
          ))}
        </motion.div>

        {/* Bottom Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="w-full flex flex-col gap-6"
        >
          {/* Stats Box */}
          <div className="w-full rounded-2xl border border-[#ceab7a]/20 bg-[#0a0a0a]/80 p-6 md:p-8 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 shadow-[0_0_30px_rgba(206,171,122,0.03)]">
            {[
              { icon: Rocket, value: '15+', label: 'Projects\nCompleted' },
              { icon: Star, value: '8+', label: 'Brands\nEmpowered' },
              { icon: Calendar, value: '2+', label: 'Years of\nExperience' },
              { icon: Zap, value: '24h', label: 'Avg. Response\nTime' }
            ].map((stat, idx) => (
              <div key={idx} className="flex flex-col md:flex-row items-center md:items-start gap-4 text-center md:text-left md:border-r border-[#ceab7a]/10 last:border-0 px-2">
                <stat.icon size={32} className="text-[#ceab7a] shrink-0" strokeWidth={1.5} />
                <div>
                  <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-[12px] text-gray-400 font-medium whitespace-pre-line leading-tight">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Banner Box */}
          <div className="w-full rounded-2xl border border-[#ceab7a]/20 bg-[#0a0a0a]/80 p-6 md:p-8 flex flex-col md:flex-row items-center md:items-stretch justify-between gap-6 shadow-[0_0_30px_rgba(206,171,122,0.03)]">
            <div className="flex items-center gap-4 flex-1 justify-center md:justify-start">
              <Sparkles size={28} className="text-[#ceab7a] fill-[#ceab7a]/20 shrink-0" />
              <div className="flex flex-col">
                <span className="text-xl text-white font-medium">We create</span>
                <span className="text-xl text-[#ceab7a] font-bold">AI-Powered Websites.</span>
              </div>
            </div>
            
            <div className="hidden md:block w-px bg-[#ceab7a]/20 self-stretch"></div>
            <div className="md:hidden w-full h-px bg-[#ceab7a]/20"></div>

            <div className="flex-1 flex items-center justify-center md:justify-start">
              <p className="text-[14px] text-gray-400 font-medium text-center md:text-left max-w-sm">
                Smart solutions. Scalable systems. <br/>
                Powered by creativity and AI.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="w-full flex flex-col items-center gap-3 mt-16 mb-8"
        >
          <span className="text-[10px] font-bold tracking-[0.25em] text-gray-500 uppercase">Scroll</span>
          <div className="w-[20px] h-[32px] border-2 border-gray-600 rounded-full flex justify-center pt-1.5 relative">
            <div className="w-[3px] h-[5px] bg-[#ceab7a] rounded-full animate-bounce"></div>
          </div>
          <div className="w-[2px] h-[30px] bg-gradient-to-b from-[#ceab7a]/50 to-transparent mt-1"></div>
        </motion.div>

      </div>
    </section>
  );
});

export default Hero;
