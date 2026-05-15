import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { 
  Brain, 
  Monitor, 
  MessageCircle, 
  Rocket, 
  Briefcase, 
  Users, 
  Headphones, 
  ShieldCheck, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import CinematicTypewriter from './CinematicTypewriter';

const cards = [
  {
    num: "01",
    title: "AI-Powered Strategy",
    desc: "We blend creativity with AI-driven workflows to build smarter digital experiences.",
    icon: Brain,
    image: "/Assets/why_ai_strategy.webp"
  },
  {
    num: "02",
    title: "Cinematic UI/UX",
    desc: "Luxury visual experiences designed to feel modern, immersive and premium.",
    icon: Monitor,
    image: "/Assets/why_cinematic_ui.webp"
  },
  {
    num: "03",
    title: "Fast Communication",
    desc: "Quick replies, transparent updates and smooth collaboration at every step.",
    icon: MessageCircle,
    image: "/Assets/why_fast_communication.webp"
  },
  {
    num: "04",
    title: "Results Focused",
    desc: "Every design decision is made to improve engagement, trust and conversions.",
    icon: Rocket,
    image: "/Assets/why_results_focused.webp"
  }
];

const stats = [
  { icon: Briefcase, value: "15+", label: "Projects", sublabel: "Completed" },
  { icon: Users, value: "8+", label: "Brands", sublabel: "Empowered" },
  { icon: Headphones, value: "2+", label: "Years of", sublabel: "Experience" },
  { icon: ShieldCheck, value: "24h", label: "Avg. Response", sublabel: "Time" },
];

export default function WhyChooseUs() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <section id="whyus" className="py-24 md:py-32 xl:py-40 relative bg-[#050505] overflow-hidden min-h-screen border-t border-white/5">
      {/* Cinematic Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#030303] via-[#0a0a0a] to-[#030303]" />
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#ceab7a]/10 via-transparent to-transparent pointer-events-none" />
      
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative z-10 w-full flex flex-col items-center">
        
        {/* Top Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center text-center w-full mb-16 md:mb-20"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-[1px] bg-gradient-to-r from-transparent to-[#ceab7a]"></div>
            <span className="text-[11px] md:text-[12px] font-medium text-[#ceab7a] tracking-[0.25em] uppercase min-w-[160px] text-center">
              <CinematicTypewriter words={["WHY CHOOSE US"]} typingSpeed={100} deletingSpeed={50} delayPause={6000} cursorClassName="bg-[#ceab7a]" />
            </span>
            <div className="w-10 h-[1px] bg-gradient-to-l from-transparent to-[#ceab7a]"></div>
          </div>
          
          <h2 className="font-serif text-[38px] sm:text-[46px] md:text-[54px] leading-[1.1] mb-6 text-white max-w-3xl">
            Why Brands Choose <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e8d3b5] via-[#ceab7a] to-[#a8824a]">
              AI Metaworld.
            </span>
          </h2>
          
          <p className="text-gray-400 text-[15px] md:text-[16px] leading-[1.7] max-w-2xl mx-auto">
            We combine strategy, AI and cinematic design to create experiences that help brands grow faster.
          </p>
        </motion.div>

        {/* Vertical Stacked Cards Container */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="relative rounded-[32px] border border-[#ceab7a]/10 bg-[#080808]/80 backdrop-blur-sm p-4 md:p-6 lg:p-8 flex flex-col gap-6 w-full max-w-[1000px] shadow-[0_0_50px_rgba(0,0,0,0.8)]"
        >
          {/* Top Glowing Star Indicator */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            <Sparkles className="text-[#ceab7a] drop-shadow-[0_0_15px_rgba(206,171,122,1)] z-10 bg-[#050505] rounded-full p-1" size={28} />
            <div className="w-[150px] md:w-[300px] h-[1px] bg-gradient-to-r from-transparent via-[#ceab7a]/50 to-transparent absolute top-1/2 -translate-y-1/2" />
          </div>

          {cards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <motion.div 
                key={idx}
                variants={itemVariants}
                className="rounded-[20px] md:rounded-[24px] border border-white/5 bg-[#0a0a0a] flex flex-col md:flex-row items-center justify-between p-6 md:p-8 hover:border-[#ceab7a]/30 hover:bg-white/[0.02] transition-all duration-500 overflow-hidden group shadow-lg"
              >
                <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-6 md:gap-8 lg:gap-12 w-full md:w-[55%]">
                  
                  {/* Glowing Icon */}
                  <div className="relative shrink-0 mt-2 md:mt-0">
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border border-[#ceab7a]/10 bg-[#111] flex items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.5)] group-hover:border-[#ceab7a]/40 group-hover:shadow-[0_0_40px_rgba(206,171,122,0.15)] transition-all duration-500">
                      <Icon className="text-[#ceab7a] group-hover:scale-110 transition-transform duration-500 opacity-90 group-hover:opacity-100" size={32} strokeWidth={1.5} />
                    </div>
                    <div className="absolute inset-0 rounded-full border-[1px] border-[#ceab7a]/0 group-hover:border-[#ceab7a]/20 scale-[1.2] opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none" />
                  </div>
                  
                  {/* Text Content */}
                  <div className="flex flex-col pt-2">
                    <span className="text-[#ceab7a] text-[18px] md:text-[20px] font-serif font-bold mb-2 md:mb-1 opacity-90">
                      {card.num}
                    </span>
                    <h3 className="text-[20px] md:text-[24px] font-serif text-white tracking-wide mb-3">
                      {card.title}
                    </h3>
                    <p className="text-gray-400 text-[14px] md:text-[15px] leading-relaxed max-w-[320px] md:max-w-none mx-auto md:mx-0">
                      {card.desc}
                    </p>
                    <div className="w-12 h-[2px] bg-[#ceab7a]/30 mt-6 mx-auto md:mx-0 rounded-full" />
                  </div>
                </div>

                {/* Visual Image */}
                <div className="w-full md:w-[40%] mt-8 md:mt-0 shrink-0">
                  <div className="aspect-[4/3] md:aspect-video rounded-[16px] overflow-hidden relative border border-white/5 bg-[#111] shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                    <img src={card.image} alt={card.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-[1.05] transition-transform duration-700 ease-out" />
                    
                    {/* Dark gradient fade from left on desktop to blend with card bg */}
                    <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-[#0a0a0a] hidden md:block opacity-60" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/80 via-transparent to-transparent md:hidden" />
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Statistics Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-[1000px] w-full mt-8 rounded-[24px] border border-[#ceab7a]/10 bg-[#080808] overflow-hidden shadow-xl"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-white/5">
            {stats.map((stat, i) => (
              <div key={i} className="flex flex-col items-center justify-center p-8 md:p-10 hover:bg-[#ceab7a]/[0.02] transition-colors group text-center border-t border-white/5 md:border-t-0">
                <stat.icon className="text-[#ceab7a] mb-4 group-hover:scale-110 transition-transform duration-300 opacity-80 group-hover:opacity-100" size={32} strokeWidth={1.5} />
                <span className="text-[28px] md:text-[32px] font-serif font-bold text-white mb-2 drop-shadow-[0_0_10px_rgba(206,171,122,0.1)]">{stat.value}</span>
                <div className="flex flex-col text-[12px] md:text-[13px] text-gray-400 leading-tight">
                  <span>{stat.label}</span>
                  <span>{stat.sublabel}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA Box */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-[1000px] w-full mt-8 rounded-[24px] border border-[#ceab7a]/20 bg-gradient-to-b from-[#0a0a0a] to-[#050505] p-8 md:p-12 text-center relative overflow-hidden group shadow-[0_0_40px_rgba(206,171,122,0.05)]"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[1px] bg-gradient-to-r from-transparent via-[#ceab7a]/50 to-transparent" />
          <div className="absolute inset-0 bg-[#ceab7a]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          
          <h3 className="text-[22px] md:text-[28px] font-serif text-white mb-3 relative z-10 leading-tight">
            Ready to build something exceptional?
          </h3>
          <p className="text-[#ceab7a] text-[14px] md:text-[15px] mb-8 relative z-10 font-medium">
            Let's create digital experiences that drive real results.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 relative z-10">
            <a 
              href="#contact"
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#e8d3b5] to-[#ceab7a] text-black font-bold rounded-full text-[13px] tracking-[0.05em] hover:shadow-[0_0_30px_rgba(206,171,122,0.4)] transition-all duration-300 flex items-center justify-center gap-3"
            >
              Start Your Project
              <ArrowRight size={16} />
            </a>
            
            <a 
              href="https://wa.me/917718938615"
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-8 py-4 bg-[#0a0a0a] border border-[#ceab7a]/30 hover:border-[#ceab7a]/60 text-white font-medium rounded-full text-[13px] tracking-[0.05em] transition-all duration-300 flex items-center justify-center gap-3 group/wa hover:bg-[#ceab7a]/5"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#ceab7a] group-hover/wa:scale-110 transition-transform">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              Chat on WhatsApp
            </a>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
