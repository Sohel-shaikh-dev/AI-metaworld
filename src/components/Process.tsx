import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import CinematicTypewriter from './CinematicTypewriter';

const stages = [
  {
    num: "01",
    title: "DISCOVERY",
    purpose: "Understanding client goals, brand direction, audience, and digital vision.",
    image: "/Assets/p_discovery.png",
  },
  {
    num: "02",
    title: "STRATEGY",
    purpose: "Creating a modern digital growth direction and creative roadmap.",
    image: "/Assets/p_strategy.png",
  },
  {
    num: "03",
    title: "DESIGN",
    purpose: "Crafting premium websites, branding systems, UI/UX, and visual identity.",
    image: "/Assets/p_design.png",
  },
  {
    num: "04",
    title: "AI PRODUCTION",
    purpose: "Generating AI-powered assets, try-ons, automation, and modern creative outputs.",
    image: "/Assets/p_aiproduction.png",
  },
  {
    num: "05",
    title: "LAUNCH & GROWTH",
    purpose: "Deploying websites, optimizing Google visibility, scaling brands, and tracking growth.",
    image: "/Assets/p_launch.png",
  }
];

export default function Process() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  // Grow the glowing line from top to bottom as user scrolls through the container
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="process" className="py-24 md:py-32 xl:py-40 relative bg-[#050505] overflow-hidden min-h-screen border-t border-white/5">
      {/* Cinematic Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#030303] via-[#080808] to-[#030303]" />
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-800 via-transparent to-transparent pointer-events-none" />
      
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
        
        {/* Top Header Content */}
        <motion.div 
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true, margin: "-100px" }}
           transition={{ duration: 0.8, ease: "easeOut" }}
           className="max-w-3xl mx-auto text-center mb-24 md:mb-32"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-8 h-[1px] bg-gray-500"></div>
            <span className="text-[11px] font-medium text-gray-400 tracking-[0.25em] uppercase min-w-[120px] text-center">
              <CinematicTypewriter 
                words={["OUR PROCESS", "THE WORKFLOW"]}
                typingSpeed={100}
                deletingSpeed={50}
                delayPause={6000}
                cursorClassName="bg-gray-400"
              />
            </span>
            <div className="w-8 h-[1px] bg-gray-500"></div>
          </div>
          
          <h2 className="font-serif text-[36px] sm:text-[42px] md:text-[50px] leading-[1.15] mb-6 text-white">
            How We Transform Ideas Into <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#e8d3b5] via-[#ceab7a] to-[#a8824a] pb-2">Premium Digital Experiences</span>
          </h2>
          
          <p className="text-gray-400 text-[15px] md:text-[16px] leading-[1.7] max-w-2xl mx-auto">
            From strategy and design to AI-powered production and digital growth, every project is crafted through a refined modern workflow.
          </p>
        </motion.div>

        {/* Cinematic Staggered Workflow System */}
        <div ref={containerRef} className="relative max-w-5xl mx-auto">
          
          {/* Glowing Vertical Connection Line (Desktop Only) */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[1px] bg-white/5 -translate-x-1/2">
             <motion.div 
               style={{ height: lineHeight }} 
               className="w-full bg-gradient-to-b from-[#ceab7a] to-white shadow-[0_0_15px_rgba(206,171,122,0.8)]"
             />
          </div>

          <div className="space-y-20 md:space-y-40 relative">
            {stages.map((stage, idx) => {
              const isEven = idx % 2 === 0;
              
              return (
                  <motion.div 
                    key={stage.num}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "0px" }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-center justify-between gap-10 md:gap-16 relative w-full`}
                  >
                    
                    {/* Glowing Center Node (Desktop Only) */}
                    <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 items-center justify-center z-20">
                       <motion.div 
                         initial={{ scale: 0, opacity: 0 }}
                         whileInView={{ scale: 1, opacity: 1 }}
                         viewport={{ once: true, margin: "0px" }}
                         transition={{ delay: 0.2, duration: 0.4, ease: "easeOut" }}
                         className="w-3 h-3 rounded-full bg-[#ceab7a] shadow-[0_0_20px_#ceab7a]"
                       />
                     <div className="absolute w-full h-full rounded-full border border-white/20 bg-[#050505]/50 backdrop-blur-sm -z-10" />
                  </div>

                  {/* Text Module */}
                  <div className={`w-full md:w-[45%] flex ${isEven ? 'md:justify-end' : 'md:justify-start'}`}>
                    <div className={`max-w-[380px] flex flex-col items-start ${isEven ? 'md:items-end text-left md:text-right' : 'md:items-start text-left'}`}>
                      <span className="inline-block text-[70px] md:text-[90px] font-serif font-bold text-white/5 leading-none mb-2 pointer-events-none select-none">
                        {stage.num}
                      </span>
                      <h3 className="text-[22px] md:text-[26px] font-serif text-white tracking-widest uppercase mb-4">
                        {stage.title}
                      </h3>
                      <p className={`text-gray-400 text-[14px] md:text-[15px] leading-relaxed border-l-2 md:border-l-0 ${isEven ? 'md:border-r-2 md:pr-6' : 'md:border-l-2 md:pl-6'} border-[#ceab7a]/40 pl-5 py-1`}>
                        {stage.purpose}
                      </p>
                    </div>
                  </div>

                  {/* Visual Module */}
                  <div className={`w-full md:w-[45%] flex ${isEven ? 'md:justify-start' : 'md:justify-end'}`}>
                    <div className="relative group rounded-[24px] overflow-hidden border border-white/10 bg-[#0a0a0a] shadow-[0_0_40px_rgba(0,0,0,0.5)] aspect-[4/3] w-full max-w-[500px] hover:border-[#ceab7a]/30 transition-colors duration-500">
                      <img 
                        src={stage.image} 
                        alt={stage.title} 
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out opacity-90 group-hover:opacity-100"
                      />
                      
                      {/* Premium Glass Overlays */}
                      <div className="absolute inset-0 border border-white/10 rounded-[24px] z-10 pointer-events-none" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-10 pointer-events-none" />
                      <div className="absolute inset-0 bg-[#ceab7a]/0 group-hover:bg-[#ceab7a]/[0.05] transition-colors duration-500 z-10 pointer-events-none" />
                    </div>
                  </div>

                </motion.div>
              )
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
