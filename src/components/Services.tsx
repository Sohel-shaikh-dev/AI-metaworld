import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { MonitorSmartphone, PenTool, Video, BarChart3, Shirt, ArrowRight, Star, Zap, Users, ShieldCheck, Sparkles } from 'lucide-react';
import CinematicTypewriter from './CinematicTypewriter';

const services = [
  {
    icon: MonitorSmartphone,
    id: "01",
    title: "Web Design\n& Development",
    desc: "Modern, responsive and high-performance websites that create a powerful first impression.",
    img: "/Assets/service_web.png"
  },
  {
    icon: PenTool,
    id: "02",
    title: "Branding &\nIdentity Design",
    desc: "Unique brand identities that build trust, create recognition and leave a lasting impact.",
    img: "/Assets/service_branding.png"
  },
  {
    icon: Video,
    id: "03",
    title: "AI Videos &\nContent Creation",
    desc: "AI-powered videos and engaging content that captivate your audience and drive results.",
    img: "/Assets/service_aifashion_v2.png"
  },
  {
    icon: BarChart3,
    id: "04",
    title: "Data Analysis\n& Power BI",
    desc: "Power BI dashboards and data insights that turn complex data into smart business decisions.",
    img: "/Assets/service_powerbi_v2.png"
  },
  {
    icon: Shirt,
    id: "05",
    title: "Print-On-Demand\nSolutions",
    desc: "High-quality branded merchandise and custom print solutions designed for modern businesses and creators.",
    img: "/Assets/service_pod_v3.png"
  }
];

export default function Services() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
  };

  return (
    <section id="services" className="py-24 md:py-32 relative bg-[#050505] min-h-screen">
      <div className="max-w-6xl mx-auto px-6 md:px-12 relative z-10 flex flex-col items-center">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center text-center mb-16 md:mb-20 w-full"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="h-[1px] w-8 sm:w-12 bg-gradient-to-l from-[#ceab7a] to-transparent opacity-60"></div>
            <span className="text-[11px] sm:text-[12px] font-medium text-[#ceab7a] tracking-[0.3em] uppercase min-w-[150px] text-center">
              <CinematicTypewriter words={["OUR SERVICES"]} typingSpeed={100} deletingSpeed={50} delayPause={6000} cursorClassName="bg-[#ceab7a]" />
            </span>
            <div className="h-[1px] w-8 sm:w-12 bg-gradient-to-r from-[#ceab7a] to-transparent opacity-60"></div>
          </div>
          
          <h2 className="font-sans text-[38px] sm:text-[46px] md:text-[54px] leading-[1.15] md:leading-[1.1] mb-6 font-bold tracking-tight">
            <span className="block text-white mb-2">Solutions That Elevate</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#e8d3b5] via-[#ceab7a] to-[#a8824a] pb-1">
              Your Brand Online.
            </span>
          </h2>
          
          <p className="text-gray-400 text-[15px] md:text-[16px] leading-[1.6] max-w-[500px]">
            We offer end-to-end digital services designed to help businesses grow, stand out, and scale with confidence.
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-wrap justify-center gap-6 w-full mb-16"
        >
          {services.map((service, idx) => (
            <motion.div 
              variants={itemVariants}
              key={idx} 
              className="flex flex-col rounded-[20px] border border-[#ceab7a]/30 bg-[#0a0a0a] overflow-hidden hover:border-[#ceab7a]/60 hover:shadow-[0_0_30px_rgba(206,171,122,0.1)] transition-all duration-500 relative group w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
            >
              <div className="p-8 pb-0 flex flex-col flex-1 z-10 relative">
                {/* Top: Icon & Number */}
                <div className="flex justify-between items-start mb-8">
                  <div className="w-12 h-12 rounded-full border border-[#ceab7a] flex items-center justify-center bg-[#050505] shadow-[0_0_15px_rgba(206,171,122,0.2)]">
                    <service.icon size={22} className="text-[#ceab7a] drop-shadow-[0_0_8px_rgba(206,171,122,0.5)]" strokeWidth={1.5} />
                  </div>
                  <span className="text-[44px] font-bold text-white/20 tracking-tighter leading-none -mt-2">
                    {service.id}
                  </span>
                </div>
                
                {/* Middle: Text */}
                <h3 className="text-white text-[22px] sm:text-[24px] font-semibold mb-4 leading-tight whitespace-pre-line tracking-tight">
                  {service.title}
                </h3>
                <p className="text-gray-400 text-[14px] leading-[1.6] mb-8">
                  {service.desc}
                </p>

                {/* Arrow Button */}
                <div className="w-10 h-10 rounded-full border border-[#ceab7a]/40 flex items-center justify-center text-[#ceab7a] group-hover:bg-[#ceab7a] group-hover:text-black transition-colors duration-300 mt-auto mb-8 cursor-pointer">
                  <ArrowRight size={16} strokeWidth={2} />
                </div>
              </div>

              {/* Bottom: Image Background */}
              <div className="relative w-full h-[220px] sm:h-[240px] mt-auto overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent z-10 h-20"></div>
                 <img 
                   src={service.img} 
                   alt={service.title.replace('\n', ' ')} 
                   className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700" 
                 />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Features Box */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full flex flex-col md:flex-row items-stretch rounded-[16px] border border-[#ceab7a]/30 bg-[#0a0a0a] mb-16 overflow-hidden"
        >
          {[
            { icon: Star, title: "Tailored Solutions", text: "Every business is unique.\nWe provide custom solutions\nthat fit your goals." },
            { icon: Zap, title: "Fast Turnaround", text: "We respect your time and\ndeliver high-quality work\nwithin the deadline." },
            { icon: Users, title: "Client Focused", text: "Your satisfaction is our priority.\nWe collaborate, listen and\ndeliver beyond expectations." },
            { icon: ShieldCheck, title: "Reliable Support", text: "We're always here to help\nyou after delivery with quick\nand friendly support." }
          ].map((feat, idx) => (
            <div key={idx} className="flex flex-1 flex-col items-center text-center p-6 sm:p-8 border-b md:border-b-0 md:border-r border-[#ceab7a]/20 last:border-b-0 md:last:border-r-0 hover:bg-white/[0.02] transition-colors duration-300">
              <feat.icon size={28} className="text-[#ceab7a] mb-4 drop-shadow-[0_0_8px_rgba(206,171,122,0.6)]" strokeWidth={1.5} />
              <h4 className="text-white text-[15px] font-semibold mb-2">{feat.title}</h4>
              <p className="text-gray-400 text-[12px] leading-[1.5] whitespace-pre-line hidden md:block">
                {feat.text}
              </p>
              <p className="text-gray-400 text-[12px] leading-[1.4] block md:hidden">
                {feat.text.replace(/\n/g, ' ')}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6"
        >
          <div className="flex items-center gap-3">
            <Sparkles size={18} className="text-[#ceab7a] fill-[#ceab7a]" />
            <span className="text-gray-300 text-[15px] md:text-[18px] font-medium text-center">Ready to take your brand to the next level?</span>
          </div>
          
          <a 
            href="#contact" 
            className="flex items-center gap-3 bg-gradient-to-r from-[#e8d3b5] via-[#ceab7a] to-[#a8824a] text-black px-6 py-3 rounded-full font-semibold text-[14px] md:text-[15px] hover:shadow-[0_0_20px_rgba(206,171,122,0.4)] transition-all duration-300 hover:scale-105"
          >
            Start a Project <ArrowRight size={18} strokeWidth={2.5} />
          </a>
        </motion.div>

      </div>
    </section>
  );
}
