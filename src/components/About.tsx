import { memo } from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Zap, Target, Diamond, BriefcaseBusiness, Users, Clock, Smartphone, Quote, Sparkles } from 'lucide-react';
import CinematicTypewriter from './CinematicTypewriter';

const About = memo(function About() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <section id="about" className="relative py-24 md:py-32 flex flex-col justify-center bg-[#050505] overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 md:px-12 w-full relative z-10 flex flex-col items-center">
        
        {/* Header - ABOUT AI METAWORLD */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-4 mb-16 md:mb-24 w-full justify-center"
        >
          <div className="h-[1px] flex-1 max-w-[100px] bg-gradient-to-l from-[#ceab7a] to-transparent opacity-50"></div>
          <div className="relative">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-[#ceab7a] rounded-full blur-[20px] opacity-20"></div>
             <span className="text-[12px] md:text-[14px] font-medium text-[#ceab7a] tracking-[0.3em] uppercase relative z-10 min-w-[200px] text-center">
               <CinematicTypewriter words={["ABOUT AI METAWORLD"]} typingSpeed={100} deletingSpeed={50} delayPause={6000} cursorClassName="bg-[#ceab7a]" />
             </span>
          </div>
          <div className="h-[1px] flex-1 max-w-[100px] bg-gradient-to-r from-[#ceab7a] to-transparent opacity-50"></div>
        </motion.div>

        {/* Top Split Section */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 w-full mb-8">
          
          {/* Left Column: Text */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-col w-full lg:w-[55%] justify-center"
          >
            {/* Main Title */}
            <motion.h2 variants={itemVariants} className="font-sans text-[38px] sm:text-[46px] md:text-[52px] leading-[1.1] md:leading-[1.05] mb-8 font-bold tracking-tight">
              <span className="block text-white mb-1">We Don't Just</span>
              <span className="block text-white mb-2">Build Websites.</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#e8d3b5] via-[#ceab7a] to-[#a8824a] pb-1">
                We Build Digital
              </span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#e8d3b5] via-[#ceab7a] to-[#a8824a]">
                Presence.
              </span>
            </motion.h2>

            {/* Description Paragraphs */}
            <motion.p variants={itemVariants} className="text-gray-300 text-[15px] md:text-[16px] leading-[1.7] mb-6 max-w-[480px]">
              AI Metaworld is a modern creative studio helping businesses grow through premium websites, AI-powered content, branding, and smart digital experiences.
            </motion.p>
            <motion.p variants={itemVariants} className="text-gray-300 text-[15px] md:text-[16px] leading-[1.7] mb-8 max-w-[480px]">
              We combine creativity, technology, and strategy to build solutions that not only look premium but also deliver real results.
            </motion.p>
            
            <motion.div variants={itemVariants} className="w-16 h-[2px] bg-[#ceab7a] opacity-80 mt-2"></motion.div>
          </motion.div>

          {/* Right Column: Logo Box */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-[45%] flex flex-col justify-center items-center py-16 px-8 rounded-[20px] border border-[#ceab7a]/30 bg-[#0a0a0a] shadow-[0_0_40px_rgba(206,171,122,0.05)] relative overflow-hidden"
          >
            {/* Subtle inner glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[#ceab7a] blur-[100px] opacity-[0.03] rounded-full pointer-events-none"></div>
            
            {/* Logo Image */}
            <div className="w-[220px] sm:w-[260px] md:w-[300px] aspect-square relative z-10 flex justify-center items-center">
              <img 
                src="/Assets/logo.webp" 
                alt="AI Metaworld Logo" 
                className="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(206,171,122,0.2)]" 
                loading="lazy"
                width={300}
                height={300}
              />
            </div>
          </motion.div>
        </div>

        {/* 3 Features Row (Single Box) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="w-full flex flex-row items-stretch rounded-[12px] md:rounded-[16px] border border-[#ceab7a]/30 bg-[#0a0a0a] mb-6 shadow-[0_0_30px_rgba(0,0,0,0.8)] overflow-hidden"
        >
          {[
            { icon: Zap, title: "Fast Delivery", text: "We value your time and\ndeliver high-quality work\non schedule." },
            { icon: Target, title: "Client Focused", text: "Your goals are our priority.\nWe listen, understand and\nbuild the right solution." },
            { icon: Diamond, title: "Premium Quality", text: "Top-notch designs,\nclean code and smooth\nuser experiences." }
          ].map((item, idx) => (
            <div key={idx} className="flex flex-1 flex-col items-center text-center p-3 sm:p-6 md:p-8 border-r border-[#ceab7a]/20 last:border-r-0 hover:bg-white/[0.02] transition-colors duration-300">
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full border border-[#ceab7a] flex items-center justify-center mb-3 md:mb-6 shadow-[0_0_15px_rgba(206,171,122,0.4)] bg-[#050505]">
                <item.icon className="w-5 h-5 md:w-7 md:h-7 text-[#ceab7a] drop-shadow-[0_0_8px_rgba(206,171,122,0.8)]" strokeWidth={1.2} />
              </div>
              <h3 className="text-white text-[10px] sm:text-[13px] md:text-[18px] font-semibold mb-1 md:mb-3 tracking-wide leading-tight">{item.title}</h3>
              {/* Mobile Text (Hidden on MD+) */}
              <p className="text-gray-400 text-[8px] sm:text-[10px] leading-[1.3] md:hidden px-1">
                {item.text.replace(/\n/g, ' ')}
              </p>
              {/* Desktop Text (Hidden on Mobile) */}
              <p className="text-gray-400 text-[14px] lg:text-[15px] leading-[1.6] whitespace-pre-line hidden md:block">
                {item.text}
              </p>
            </div>
          ))}
        </motion.div>

        {/* 4 Stats Row */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full flex items-center p-6 md:p-8 rounded-[16px] border border-[#ceab7a]/20 bg-[#0a0a0a] mb-6"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 w-full gap-y-8 md:gap-y-0">
            {[
              { icon: BriefcaseBusiness, num: "15+", text: "Projects\nCompleted" },
              { icon: Users, num: "8+", text: "Brands\nEmpowered" },
              { icon: Clock, num: "2+", text: "Years of\nExperience" },
              { icon: Smartphone, num: "24h", text: "Avg. Response\nTime" }
            ].map((stat, idx) => (
              <div key={idx} className="flex items-center gap-4 md:gap-5 justify-start md:justify-center px-4 md:border-r md:border-[#ceab7a]/20 md:last:border-0 border-r border-[#ceab7a]/20 [&:nth-child(2n)]:border-r-0 md:[&:nth-child(2n)]:border-r">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-[#ceab7a]/40 flex items-center justify-center shrink-0">
                  <stat.icon size={20} className="text-[#ceab7a]" strokeWidth={1.5} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[24px] sm:text-[28px] font-medium text-[#e8d3b5] leading-none mb-1">{stat.num}</span>
                  <span className="text-[12px] sm:text-[13px] text-gray-400 leading-[1.2] whitespace-pre-line">{stat.text}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Mission / Quote Row */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="w-full flex flex-col md:flex-row items-center p-8 md:p-10 rounded-[16px] border border-[#ceab7a]/20 bg-[#0a0a0a] gap-8 md:gap-0"
        >
          {/* Left Quote */}
          <div className="w-full md:w-[55%] flex gap-4 md:gap-6 items-start md:border-r md:border-[#ceab7a]/20 md:pr-10">
            <Quote size={40} className="text-[#ceab7a] fill-[#ceab7a] shrink-0 opacity-80" />
            <p className="text-gray-300 text-[15px] sm:text-[16px] leading-[1.7] pt-1">
              Our mission is simple – help businesses build a strong digital identity and achieve long-term growth with smart, scalable and creative solutions.
            </p>
          </div>
          
          {/* Right Star Text */}
          <div className="w-full md:w-[45%] flex gap-4 md:gap-5 items-center md:pl-10">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-[#ceab7a]/40 bg-[#ceab7a]/5 flex items-center justify-center shrink-0">
              <Sparkles size={24} className="text-[#ceab7a]" strokeWidth={1.5} />
            </div>
            <p className="text-gray-300 text-[15px] sm:text-[16px] leading-[1.6]">
              We don't follow trends,<br className="hidden md:block"/>we create impact.<br/>
              <span className="text-[#ceab7a] font-medium">That's AI Metaworld.</span>
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  );
});

export default About;
