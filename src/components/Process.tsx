import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import CinematicTypewriter from './CinematicTypewriter';
import { 
  Headphones, 
  FileText, 
  Code, 
  Rocket, 
  Calendar, 
  Briefcase, 
  CheckCircle, 
  Users, 
  TrendingUp, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

const stages = [
  {
    num: "01",
    title: "Discovery Call",
    desc: "We understand your brand, goals and audience before building anything.",
    bullet: "Strategy first. Design second.",
    icon: Headphones,
    image: "/Assets/p_discovery_new.png",
  },
  {
    num: "02",
    title: "Strategy & Planning",
    desc: "We create the structure, content direction and AI-powered execution plan.",
    bullet: "Built for clarity and conversion.",
    icon: FileText,
    image: "/Assets/p_strategy_new.png",
  },
  {
    num: "03",
    title: "Design & Development",
    desc: "Premium cinematic UI/UX with high-performance development.",
    bullet: "Luxury visuals meet functionality.",
    icon: Code,
    image: "/Assets/p_design_new.png",
  },
  {
    num: "04",
    title: "Launch & Optimization",
    desc: "Testing, optimization and launch with continuous improvements.",
    bullet: "Focused on real business growth.",
    icon: Rocket,
    image: "/Assets/p_launch_new.png",
  }
];

const timelineSteps = [
  { label: "Discovery", days: "1 Day", icon: Headphones },
  { label: "Strategy", days: "2 Days", icon: FileText },
  { label: "Development", days: "5-7 Days", icon: Code },
  { label: "Launch", days: "1 Day", icon: Rocket }
];

const features = [
  { title: "Transparent", desc: "Clear communication at every step.", icon: Briefcase },
  { title: "On-Time Delivery", desc: "We respect your time and deadlines.", icon: CheckCircle },
  { title: "Client Focused", desc: "Your satisfaction is our top priority.", icon: Users },
  { title: "Results Driven", desc: "We build solutions that generate impact.", icon: TrendingUp },
];

export default function Process() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="process" className="py-24 md:py-32 xl:py-40 relative bg-[#050505] overflow-hidden min-h-screen border-t border-white/5">
      {/* Cinematic Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#030303] via-[#080808] to-[#030303]" />
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-800 via-transparent to-transparent pointer-events-none" />
      
      <div className="max-w-[1200px] mx-auto relative z-10">
        
        {/* Top Header Content */}
        <motion.div 
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true, margin: "-100px" }}
           transition={{ duration: 0.8, ease: "easeOut" }}
           className="max-w-3xl mx-auto text-center mb-24 md:mb-32 px-6"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-8 h-[1px] bg-gray-500"></div>
            <span className="text-[11px] font-medium text-[#ceab7a] tracking-[0.25em] uppercase min-w-[120px] text-center">
              <CinematicTypewriter 
                words={["OUR PROCESS"]}
                typingSpeed={100}
                deletingSpeed={50}
                delayPause={6000}
                cursorClassName="bg-[#ceab7a]"
              />
            </span>
            <div className="w-8 h-[1px] bg-gray-500"></div>
          </div>
          
          <h2 className="font-serif text-[36px] sm:text-[42px] md:text-[50px] leading-[1.15] mb-6 text-white">
            Our Proven Process To <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#e8d3b5] via-[#ceab7a] to-[#a8824a] pb-2">Deliver Exceptional Results.</span>
          </h2>
          
          <p className="text-gray-400 text-[15px] md:text-[16px] leading-[1.7] max-w-2xl mx-auto">
            A simple, strategic and transparent workflow designed to bring your vision to life.
          </p>
        </motion.div>

        {/* Vertical Timeline Workflow System */}
        <div ref={containerRef} className="relative max-w-[1000px] mx-auto">
          
          {/* Glowing Vertical Connection Line */}
          <div className="absolute left-[30px] md:left-[50px] top-0 bottom-0 w-[1px] bg-white/10">
             <motion.div 
               style={{ height: lineHeight }} 
               className="w-full bg-gradient-to-b from-[#ceab7a] to-white shadow-[0_0_15px_rgba(206,171,122,0.8)]"
             />
          </div>

          <div className="space-y-16 md:space-y-24 relative z-10 pt-4 pb-10">
            {stages.map((stage, idx) => {
              const Icon = stage.icon;
              return (
                  <motion.div 
                    key={stage.num}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.7, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className="relative w-full pl-[60px] md:pl-[120px] pr-6 md:pr-0"
                  >
                    
                    {/* Glowing Node on Timeline */}
                    <div className="absolute left-[30px] md:left-[50px] top-[40px] md:top-[60px] -translate-x-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center z-20">
                       <motion.div 
                         initial={{ scale: 0, opacity: 0 }}
                         whileInView={{ scale: 1, opacity: 1 }}
                         viewport={{ once: true, margin: "0px" }}
                         transition={{ delay: 0.3, duration: 0.4, ease: "easeOut" }}
                         className="w-4 h-4 rounded-full bg-[#050505] border-[2px] border-[#ceab7a] shadow-[0_0_15px_#ceab7a]"
                       />
                       {/* Connector line */}
                       <div className="hidden md:block absolute w-[70px] h-[1px] bg-gradient-to-r from-[#ceab7a]/40 to-transparent left-1/2 top-1/2 -translate-y-1/2" />
                    </div>

                    {/* Timeline Card */}
                    <div className="group rounded-[20px] md:rounded-[24px] border border-white/5 hover:border-[#ceab7a]/30 bg-[#0a0a0a] overflow-hidden transition-all duration-500 shadow-2xl relative">
                      
                      <div className="absolute inset-0 bg-gradient-to-br from-[#ceab7a]/0 via-transparent to-[#ceab7a]/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                      <div className="flex flex-col md:flex-row items-stretch p-2">
                        {/* Left Content Area */}
                        <div className="w-full md:w-[50%] p-6 md:p-10 flex flex-col justify-center relative">
                          <span className="absolute top-4 left-6 md:left-8 text-[70px] md:text-[100px] font-serif font-bold text-white/[0.03] leading-none pointer-events-none select-none z-0">
                            {stage.num}
                          </span>
                          
                          <div className="relative z-10 flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-xl border border-[#ceab7a]/20 bg-[#ceab7a]/5 flex items-center justify-center text-[#ceab7a] shadow-[0_0_20px_rgba(206,171,122,0.1)] group-hover:bg-[#ceab7a]/10 transition-colors shrink-0">
                              <Icon size={22} />
                            </div>
                            <h3 className="text-[20px] md:text-[24px] font-serif text-white tracking-wide">
                              {stage.title}
                            </h3>
                          </div>
                          
                          <p className="text-gray-400 text-[14px] md:text-[15px] leading-relaxed relative z-10 mb-8">
                            {stage.desc}
                          </p>

                          <div className="mt-auto relative z-10 flex items-start gap-3">
                            <Sparkles size={16} className="text-[#ceab7a] mt-0.5 shrink-0" />
                            <span className="text-[#ceab7a] text-[13px] md:text-[14px] font-medium tracking-wide leading-tight">{stage.bullet}</span>
                          </div>
                        </div>

                        {/* Right Image Area */}
                        <div className="w-full md:w-[50%] p-2 md:p-3">
                          <div className="w-full h-[220px] md:h-full min-h-[250px] rounded-[16px] md:rounded-[20px] overflow-hidden relative border border-white/5 bg-[#111]">
                            <img 
                              src={stage.image} 
                              alt={stage.title} 
                              className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-[1.05] transition-transform duration-700 ease-out"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                            <div className="absolute inset-0 border border-white/10 rounded-[16px] md:rounded-[20px] pointer-events-none" />
                          </div>
                        </div>
                      </div>
                    </div>

                  </motion.div>
              )
            })}
          </div>
        </div>

        {/* Estimated Timeline Row */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24 md:mt-32 max-w-[1000px] mx-auto px-6 md:px-0"
        >
          <div className="flex items-center gap-3 mb-6 ml-2">
            <Calendar size={18} className="text-[#ceab7a]" />
            <span className="text-white text-[15px] font-medium tracking-wide">Estimated Timeline</span>
          </div>

          <div className="flex flex-col md:flex-row items-stretch gap-3 md:gap-2">
            {timelineSteps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={idx} className="flex flex-col md:flex-row items-center gap-2 w-full flex-1">
                  <div className="flex-1 flex flex-col sm:flex-row items-center justify-between sm:justify-start gap-4 p-4 rounded-[16px] border border-white/10 bg-[#0a0a0a] hover:border-[#ceab7a]/30 hover:bg-[#ceab7a]/5 transition-colors w-full group">
                    <div className="flex items-center justify-center md:justify-start gap-4 w-full">
                      <div className="w-10 h-10 rounded-lg border border-white/10 bg-[#151515] flex items-center justify-center text-[#ceab7a] shrink-0 group-hover:border-[#ceab7a]/40 transition-colors">
                        <Icon size={18} />
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="text-[11px] text-gray-500 uppercase tracking-widest">{step.label}</span>
                        <span className="text-[14px] text-white font-medium">{step.days}</span>
                      </div>
                    </div>
                  </div>
                  {idx < timelineSteps.length - 1 && (
                    <div className="hidden md:flex text-gray-600 shrink-0 mx-1">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                    </div>
                  )}
                  {idx < timelineSteps.length - 1 && (
                    <div className="flex md:hidden text-gray-600 shrink-0 rotate-90 my-1">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* Feature Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 md:mt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-[1000px] mx-auto px-6 md:px-0"
        >
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div key={idx} className="flex flex-col items-center text-center p-6 border-t border-white/5 pt-8 group hover:bg-white/[0.02] rounded-b-[24px] transition-colors duration-300">
                <div className="mb-4 text-[#ceab7a] opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
                  <Icon size={32} strokeWidth={1.5} />
                </div>
                <h4 className="text-white text-[15px] font-medium mb-2 tracking-wide">{feature.title}</h4>
                <p className="text-gray-400 text-[13px] leading-relaxed">{feature.desc}</p>
              </div>
            )
          })}
        </motion.div>

        {/* CTA Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 md:mt-24 max-w-[1000px] mx-auto px-6 md:px-0"
        >
          <div className="rounded-[24px] border border-[#ceab7a]/20 bg-gradient-to-b from-[#0a0a0a] to-[#050505] p-8 md:p-12 text-center relative overflow-hidden group shadow-[0_0_40px_rgba(206,171,122,0.05)]">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[1px] bg-gradient-to-r from-transparent via-[#ceab7a]/50 to-transparent" />
            <div className="absolute inset-0 bg-[#ceab7a]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            
            <h3 className="text-2xl md:text-3xl font-serif text-white mb-8 relative z-10">
              Ready to build something powerful?
            </h3>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 relative z-10">
              <a 
                href="#contact"
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#e8d3b5] to-[#ceab7a] text-black font-bold rounded-full text-[13px] tracking-[0.1em] uppercase hover:shadow-[0_0_30px_rgba(206,171,122,0.4)] transition-all duration-300 flex items-center justify-center gap-3"
              >
                Start Your Project
                <ArrowRight size={16} />
              </a>
              
              <a 
                href="https://wa.me/917718938615"
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-8 py-4 bg-[#0a0a0a] border border-white/20 hover:border-[#ceab7a]/50 text-white font-medium rounded-full text-[13px] tracking-[0.05em] transition-all duration-300 flex items-center justify-center gap-3 group/wa hover:bg-[#ceab7a]/5"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#ceab7a] group-hover/wa:scale-110 transition-transform">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
