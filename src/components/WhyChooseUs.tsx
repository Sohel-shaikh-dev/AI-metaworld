import { motion } from 'framer-motion';
import { CheckCircle2, Cpu, BarChart3, Clock } from 'lucide-react';

const features = [
  {
    id: 1,
    title: "Premium Design",
    desc: "Elegant, modern, conversion-focused visuals crafted with attention to detail and luxury presentation.",
    image: "/Assets/why_design.png",
    icon: <CheckCircle2 className="text-[#ceab7a]" size={20} />,
    className: "md:col-span-1 md:row-span-1",
  },
  {
    id: 2,
    title: "AI-Powered Workflow",
    desc: "Intelligent production systems that accelerate creative output and help brands move from concept to execution faster.",
    image: "/Assets/why_workflow.png",
    icon: <Cpu className="text-[#ceab7a]" size={20} />,
    className: "md:col-span-1 md:row-span-1",
  },
  {
    id: 3,
    title: "Business-Focused Growth",
    desc: "Every website, brand, and visual system is designed to support visibility, engagement, and measurable business impact.",
    image: "/Assets/why_growth.png",
    icon: <BarChart3 className="text-[#ceab7a]" size={20} />,
    className: "md:col-span-1 md:row-span-1",
  },
  {
    id: 4,
    title: "Fast & Reliable Execution",
    desc: "Clear communication, organized delivery, and premium support so clients feel confident at every step.",
    image: "/Assets/why_execution.png",
    icon: <Clock className="text-[#ceab7a]" size={20} />,
    className: "md:col-span-1 md:row-span-1",
  }
];

export default function WhyChooseUs() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <section id="whyus" className="py-24 md:py-32 xl:py-40 relative bg-[#050505] overflow-hidden min-h-screen flex items-center border-y border-white/5">
      {/* Cinematic Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#030303] via-[#0a0a0a] to-[#030303]" />
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-800 via-transparent to-transparent pointer-events-none" />
      
      <div className="max-w-[1500px] mx-auto px-6 md:px-12 relative z-10 w-full">
        <div className="flex flex-col lg:flex-row gap-12 xl:gap-20 items-start justify-between">
          
          {/* Left Side: Premium Content Area */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="w-full lg:w-[40%] xl:w-[35%] flex flex-col relative z-20 lg:sticky lg:top-32"
          >
            <motion.div variants={itemVariants} className="mb-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-8 h-[1px] bg-gray-500"></div>
                <span className="text-[11px] font-medium text-gray-400 tracking-[0.25em] uppercase">
                  WHY CHOOSE US
                </span>
              </div>
              
              <h2 className="font-serif text-[38px] sm:text-[46px] md:text-[54px] leading-[1.1] mb-6 text-white">
                Built For Modern Brands That Want <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#e8d3b5] via-[#ceab7a] to-[#a8824a] pb-2">More Than Design</span>
              </h2>
              
              <p className="text-gray-400 text-[15px] md:text-[16px] leading-[1.7] max-w-md mb-12">
                We combine premium design, AI-powered workflows, and business-focused strategy to create digital experiences that look exceptional and drive real growth.
              </p>

              {/* Elegant Micro Stat Strip */}
              <div className="flex flex-col gap-5 border-l border-[#ceab7a]/30 pl-6 py-2">
                <div className="flex items-center gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#ceab7a] shadow-[0_0_10px_#ceab7a]" />
                  <span className="text-gray-300 text-sm tracking-wide">Creative Precision</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#ceab7a] shadow-[0_0_10px_#ceab7a]" />
                  <span className="text-gray-300 text-sm tracking-wide">Fast Execution</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#ceab7a] shadow-[0_0_10px_#ceab7a]" />
                  <span className="text-gray-300 text-sm tracking-wide">Growth-Driven Results</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
          
          {/* Right Side: Staggered Bento Grid */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="w-full lg:w-[55%] xl:w-[60%] grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 auto-rows-[300px] md:auto-rows-[260px] lg:auto-rows-[280px] xl:auto-rows-[320px]"
          >
            {features.map((feature) => (
              <motion.div 
                key={feature.id}
                variants={itemVariants}
                className={`group relative rounded-[24px] overflow-hidden border border-white/5 bg-[#050505] shadow-[0_0_40px_rgba(0,0,0,0.5)] flex flex-col hover:border-[#ceab7a]/30 transition-all duration-500 cursor-default ${feature.className}`}
              >
                {/* Visual Background Area */}
                <div className="absolute inset-0 z-0 bg-[#0a0a0a]">
                  <img 
                    src={feature.image} 
                    alt={feature.title} 
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out opacity-70 group-hover:opacity-100"
                  />
                  {/* Clean bottom gradient only where the text sits */}
                  <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent pointer-events-none" />
                </div>
                
                {/* Content Area (Docked at bottom) */}
                <div className="relative z-20 mt-auto p-6 lg:p-8">
                  <div className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-xl border border-white/10 flex items-center justify-center mb-4 group-hover:border-[#ceab7a]/50 transition-colors duration-300 shadow-lg">
                    {feature.icon}
                  </div>
                  <h3 className="text-[20px] lg:text-[22px] font-serif text-white mb-2 group-hover:text-[#ceab7a] transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 text-[14px] leading-[1.6]">
                    {feature.desc}
                  </p>
                </div>

                {/* Elegant Hover Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#ceab7a]/0 via-transparent to-[#ceab7a]/[0.08] opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none" />
              </motion.div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
