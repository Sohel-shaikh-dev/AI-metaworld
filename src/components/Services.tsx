import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { MonitorSmartphone, PenTool, Video, Rocket, Sparkle, ArrowUpRight } from 'lucide-react';

const services = [
  {
    icon: MonitorSmartphone,
    title: "Website Development",
    desc: "High-performance, responsive architectures engineered for scale.",
  },
  {
    icon: PenTool,
    title: "Branding & Design",
    desc: "Premium brand identities, posters, and digital assets.",
  },
  {
    icon: Rocket,
    title: "Digital Growth",
    desc: "End-to-end systems for lead generation and management.",
  },
  {
    icon: Video,
    title: "AI Video Production",
    desc: "Cinematic promotional campaigns and model-based ads.",
  }
];

export default function Services() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <section id="services" className="py-24 md:py-32 relative bg-[#050505] overflow-hidden border-y border-white/5 min-h-[100vh] flex items-center">
      


      {/* Subtle dark gradient on the left side to ensure HTML text is readable over the bright rotating Earth - only needed on desktop since video stacks on mobile */}
      <div className="hidden lg:block absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/70 to-transparent w-full lg:w-[50vw] z-10 pointer-events-none" />

      <div className="max-w-[1600px] mx-auto px-6 md:px-12 relative w-full lg:static">
        <div className="flex flex-col lg:flex-row items-center relative h-full w-full">
          
          {/* Content & Small Cards on the left (Overlaps the Earth naturally on desktop) */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="w-full lg:w-[42%] flex flex-col relative z-20 pt-12 lg:pt-0"
          >
            {/* Premium Heading */}
            <motion.div variants={itemVariants} className="mb-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-6 h-[1px] bg-gray-500"></div>
                <span className="text-[11px] font-medium text-gray-400 tracking-[0.25em] uppercase">
                  Our Capabilities
                </span>
              </div>
              <h2 className="font-serif text-[36px] sm:text-[42px] md:text-[50px] leading-[1.15] md:leading-[1.1] mb-6">
                <span className="block text-white">Elevating Brands</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#e8d3b5] via-[#ceab7a] to-[#a8824a] pb-2">
                  Beyond Limits.
                </span>
              </h2>
              <p className="text-gray-400 text-[14px] md:text-[15px] leading-[1.7] max-w-[420px]">
                We combine cinematic aesthetics with cutting-edge AI to deliver unparalleled digital experiences. No clutter, just performance.
              </p>
            </motion.div>

            {/* Vertical Stack of Small Minimal Cards */}
            <div className="space-y-4 relative z-20">
              {services.map((service, idx) => {
                const Icon = service.icon;
                return (
                  <motion.a 
                    href="#contact"
                    variants={itemVariants}
                    key={idx}
                    className="group flex flex-row items-start gap-5 p-5 rounded-[14px] border border-white/[0.03] bg-[#050505]/60 hover:bg-[#050505]/80 hover:border-white/10 transition-all duration-500 backdrop-blur-md cursor-pointer self-start w-auto max-w-[500px]"
                  >
                    <div className="w-[46px] h-[46px] rounded-full border border-gray-700/50 bg-black/50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500">
                      <Icon size={18} className="text-[#ceab7a] opacity-80 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="pt-1 flex-1">
                      <h4 className="text-white font-medium text-[15px] mb-1 group-hover:text-[#e8d3b5] transition-colors">{service.title}</h4>
                      <p className="text-gray-400 text-[13px] leading-[1.6]">
                        {service.desc}
                      </p>
                    </div>
                    <div className="mt-1 flex items-center justify-center text-gray-500 group-hover:text-[#ceab7a] group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300 shrink-0 ml-2">
                      <ArrowUpRight size={20} />
                    </div>
                  </motion.a>
                );
              })}
            </div>

            {/* AI METAWORLD Badge at the bottom */}
            <motion.div variants={itemVariants} className="mt-12 pt-8 border-t border-white/5 flex items-center gap-4 relative z-20">
              <div className="relative flex items-center justify-center w-[46px] h-[46px] rounded-full border border-[#ceab7a]/40 shrink-0 shadow-[0_0_15px_rgba(206,171,122,0.1)]">
                <Sparkle className="text-[#ceab7a] w-[22px] h-[22px]" strokeWidth={1.5} />
              </div>
              <div className="flex flex-col">
                <span className="text-[#ceab7a] font-semibold tracking-[0.15em] text-[12px] uppercase mb-0.5">
                  AI METAWORLD
                </span>
                <span className="text-gray-400 font-medium tracking-[0.12em] text-[10px] uppercase leading-[1.6]">
                  BUILDING INTELLIGENT<br />
                  DIGITAL ECOSYSTEMS
                </span>
              </div>
            </motion.div>
          </motion.div>
          
          {/* Background Video (Stacks below on mobile as a premium card, pinned to right on desktop) */}
          <div className="w-full lg:absolute lg:top-1/2 lg:right-0 lg:-translate-y-1/2 lg:w-[85vw] lg:h-[95vh] z-0 mt-12 lg:mt-0 relative h-[40vh] sm:h-[50vh] rounded-3xl lg:rounded-none overflow-hidden lg:overflow-visible shadow-2xl lg:shadow-none border border-white/5 lg:border-none">
            <video 
              autoPlay 
              loop 
              muted 
              playsInline 
              className="w-full h-full object-cover lg:object-contain scale-[1.02] lg:scale-100"
            >
              <source src="/Assets/Service bg.mp4" type="video/mp4" />
            </video>
          </div>

        </div>
      </div>
    </section>
  );
}
