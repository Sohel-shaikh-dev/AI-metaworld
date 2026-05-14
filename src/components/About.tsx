import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Monitor, PenTool, Shirt, ShoppingBag, Target, Cpu, ShieldCheck, Headphones } from 'lucide-react';

export default function About() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <section id="about" className="relative min-h-screen py-24 flex flex-col justify-center bg-transparent overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full relative z-10 flex flex-col justify-between h-full">
        
        {/* Main Content Area */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-xl"
        >
            {/* Subtitle */}
            <motion.div variants={itemVariants} className="flex items-center gap-4 mb-8">
              <div className="w-6 h-[1px] bg-gray-500"></div>
              <span className="text-[11px] font-medium text-gray-400 tracking-[0.25em] uppercase">
                ABOUT AI METAWORLD
              </span>
              <div className="w-16 h-[1px] bg-gray-500"></div>
            </motion.div>

            {/* Main Title - Serif font with bronze/gold gradient */}
            <motion.h2 variants={itemVariants} className="font-serif text-[36px] sm:text-[42px] md:text-[46px] leading-[1.15] md:leading-[1.1] mb-6">
              <span className="block text-white">We Build Intelligent</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#e8d3b5] via-[#ceab7a] to-[#a8824a]">
                Digital Experiences
              </span>
              <span className="block text-white">That Drive Real Growth.</span>
            </motion.h2>

            {/* Description */}
            <motion.p variants={itemVariants} className="text-gray-400 text-[15px] leading-[1.7] mb-12 max-w-[460px]">
              We combine AI, creative design and modern technology <br className="hidden sm:block" />
              to build powerful digital solutions. From stunning websites <br className="hidden sm:block" />
              and logos to smart marketing and print-on-demand — <br className="hidden sm:block" />
              we help brands grow, engage and stand out.
            </motion.p>

            {/* Services List */}
            <motion.div variants={itemVariants} className="space-y-6">
              {[
                { 
                  icon: Monitor, 
                  title: "Website Design & Development", 
                  text: "High-performance, responsive websites\ndesigned to convert and scale your business." 
                },
                { 
                  icon: PenTool, 
                  title: "Branding & Logo Design", 
                  text: "Unique logos, brand identity, brochures, posters\nand complete branding that leaves a lasting impact." 
                },
                { 
                  icon: Shirt, 
                  title: "AI Fashion Try-On", 
                  text: "Realistic virtual try-on experiences that enhance\ncustomer trust and boost engagement." 
                },
                { 
                  // Custom G icon using an SVG for Google Business
                  customIcon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#ceab7a]">
                      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12s4.477 10 10 10c2.553 0 4.88-1.026 6.58-2.73" />
                      <path d="M12 22v-9h10" />
                    </svg>
                  ),
                  title: "Google Business & Growth", 
                  text: "Google Business setup, listing. SEO and optimization\nto get you found, trusted and chosen." 
                },
                { 
                  icon: ShoppingBag, 
                  title: "Print-on-Demand Solutions", 
                  text: "Custom prints on t-shirts, hoodies, mugs, phone cases\nand more. You design, we print and deliver." 
                }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-5 items-start">
                  <div className="w-[46px] h-[46px] rounded-full border border-gray-700/80 bg-black/40 flex items-center justify-center shrink-0">
                    {item.customIcon ? item.customIcon : (item.icon && <item.icon size={20} className="text-[#ceab7a] opacity-90" />)}
                  </div>
                  <div className="pt-0.5">
                    <h4 className="text-white font-medium text-[15px] mb-1">{item.title}</h4>
                    <p className="text-gray-400 text-[13px] leading-[1.5] whitespace-pre-line">
                      {item.text}
                    </p>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

        {/* Bottom Stats & Features Boxes */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-20 flex flex-col xl:flex-row gap-4 lg:gap-6 w-full"
        >
          {/* Left Stats Box */}
          <div className="w-full xl:w-[40%] flex items-center px-4 py-6 rounded-[14px] border border-gray-800/80 bg-[#0a0a0a]/60 backdrop-blur-md">
            <div className="grid grid-cols-2 md:flex md:w-full gap-y-6 md:gap-y-0 w-full">
              {[
                { num: "250+", text: "Projects\nCompleted" },
                { num: "98%", text: "Client\nSatisfaction" },
                { num: "30+", text: "Industries\nServed" },
                { num: "5+", text: "Years of\nExperience" }
              ].map((stat, idx) => (
                <div key={idx} className="flex flex-1 items-center justify-center md:border-r md:border-gray-800/80 md:last:border-0 px-2 sm:px-4 border-r border-gray-800/80 [&:nth-child(2n)]:border-r-0 md:[&:nth-child(2n)]:border-r">
                  <div className="flex flex-col w-full text-center sm:text-left">
                    <span className="text-[20px] lg:text-[22px] font-normal text-[#d6c2a8] mb-1">{stat.num}</span>
                    <span className="text-[9px] lg:text-[10px] text-gray-500 tracking-wide leading-[1.2] whitespace-pre-line">{stat.text}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Features Box */}
          <div className="w-full xl:w-[60%] flex items-center px-4 py-6 rounded-[14px] border border-gray-800/80 bg-[#0a0a0a]/60 backdrop-blur-md">
            <div className="grid grid-cols-2 md:flex md:w-full gap-y-6 md:gap-y-0 w-full">
              {[
                { icon: Target, title: "Creative Strategy", text: "Smart &\nResult-Driven" },
                { icon: Cpu, title: "Modern Technology", text: "AI-Powered\nSolutions" },
                { icon: ShieldCheck, title: "Quality & Reliability", text: "On-Time,\nEvery Time" },
                { icon: Headphones, title: "Support & Growth", text: "We Grow\nWith You" }
              ].map((feat, idx) => (
                <div key={idx} className="flex flex-1 items-center justify-center md:border-r md:border-gray-800/80 md:last:border-0 px-2 sm:px-4 border-r border-gray-800/80 [&:nth-child(2n)]:border-r-0 md:[&:nth-child(2n)]:border-r">
                  <div className="flex flex-col xl:flex-row items-center xl:items-start gap-2 lg:gap-3 w-full text-center xl:text-left">
                    <feat.icon size={20} className="text-[#ceab7a] opacity-80 shrink-0 mt-0.5 hidden sm:block mx-auto xl:mx-0" strokeWidth={1.5} />
                    <div className="flex flex-col w-full">
                      <span className="text-[10px] lg:text-[11px] font-medium text-white mb-0.5 leading-tight">{feat.title}</span>
                      <span className="text-[9px] text-gray-500 leading-tight whitespace-pre-line">{feat.text}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
