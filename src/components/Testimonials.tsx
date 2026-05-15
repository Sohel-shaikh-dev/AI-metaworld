import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    quote: "The website completely changed how our brand is perceived online. The entire experience felt premium from start to finish.",
    name: "Sarah Jenkins",
    role: "Marketing Director",
    company: "Elevate Real Estate",
  },
  {
    id: 2,
    quote: "Our AI try-on visuals significantly improved product presentation and customer engagement. Incredibly innovative systems.",
    name: "David Chen",
    role: "Founder",
    company: "Aura Tech",
  },
  {
    id: 3,
    quote: "Professional execution, smooth communication, and a very modern creative process. The branding system they designed set a new standard in our industry.",
    name: "Michael Ross",
    role: "CEO",
    company: "FinStream",
  },
  {
    id: 4,
    quote: "They don't just design interfaces; they build business growth engines. Fast turnaround and extremely high-end results.",
    name: "Elena Rodriguez",
    role: "Operations Head",
    company: "Luxe Dynamics",
  }
];

export default function Testimonials() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <section id="testimonials" className="py-24 md:py-32 xl:py-40 relative bg-[#050505] overflow-hidden min-h-screen flex items-center border-t border-white/5">
      {/* Cinematic Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#030303] via-[#080808] to-[#030303]" />
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-gray-800 via-transparent to-transparent pointer-events-none" />
      
      <div className="max-w-[1500px] mx-auto px-6 md:px-12 relative z-10 w-full">
        <div className="flex flex-col lg:flex-row gap-16 xl:gap-20 items-start justify-between">
          
          {/* Left Side: Premium Trust Content Area */}
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
                  CLIENT TRUST
                </span>
              </div>
              
              <h2 className="font-serif text-[38px] sm:text-[46px] md:text-[54px] leading-[1.1] mb-6 text-white">
                Trusted By Modern Brands & <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#e8d3b5] via-[#ceab7a] to-[#a8824a] pb-2">Growing Businesses</span>
              </h2>
              
              <p className="text-gray-400 text-[15px] md:text-[16px] leading-[1.7] max-w-md mb-12">
                From premium websites and branding systems to AI-powered visual experiences and business growth, we help brands create digital experiences that feel modern, strategic, and unforgettable.
              </p>

              {/* Trust Metrics Strip */}
              <div className="flex flex-col gap-6 border-l border-[#ceab7a]/30 pl-6 py-2">
                <div className="flex items-center gap-4 group">
                  <div className="w-2 h-2 rotate-45 bg-[#ceab7a] opacity-50 group-hover:opacity-100 transition-opacity" />
                  <span className="text-gray-200 font-medium tracking-wide">15+ Projects Completed</span>
                </div>
                <div className="flex items-center gap-4 group">
                  <div className="w-2 h-2 rotate-45 bg-[#ceab7a] opacity-50 group-hover:opacity-100 transition-opacity" />
                  <span className="text-gray-200 font-medium tracking-wide">98% Client Satisfaction</span>
                </div>
                <div className="flex items-center gap-4 group">
                  <div className="w-2 h-2 rotate-45 bg-[#ceab7a] opacity-50 group-hover:opacity-100 transition-opacity" />
                  <span className="text-gray-200 font-medium tracking-wide">Modern Digital Systems</span>
                </div>
                <div className="flex items-center gap-4 group">
                  <div className="w-2 h-2 rotate-45 bg-[#ceab7a] opacity-50 group-hover:opacity-100 transition-opacity" />
                  <span className="text-gray-200 font-medium tracking-wide">Fast Turnaround</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
          
          {/* Right Side: Staggered Masonry Testimonial Layout */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="w-full lg:w-[55%] xl:w-[60%] grid grid-cols-1 md:grid-cols-2 gap-6 items-start"
          >
            {/* Column 1 */}
            <div className="flex flex-col gap-6">
              {[testimonials[0], testimonials[2]].map((testimonial) => (
                <TestimonialCard key={testimonial.id} testimonial={testimonial} itemVariants={itemVariants} />
              ))}
            </div>

            {/* Column 2 (Staggered Down on Desktop) */}
            <div className="flex flex-col gap-6 md:mt-24">
              {[testimonials[1], testimonials[3]].map((testimonial) => (
                <TestimonialCard key={testimonial.id} testimonial={testimonial} itemVariants={itemVariants} />
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ testimonial, itemVariants }: { testimonial: any, itemVariants: any }) {
  return (
    <motion.div 
      variants={itemVariants}
      className="group relative rounded-[24px] p-8 md:p-10 border border-white/5 bg-[#050505]/60 backdrop-blur-xl shadow-[0_0_40px_rgba(0,0,0,0.5)] flex flex-col hover:border-[#ceab7a]/30 transition-all duration-500 hover:-translate-y-2 cursor-default"
    >
      {/* 5 Minimal Stars */}
      <div className="flex gap-1 mb-6">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={14} className="fill-[#ceab7a] text-[#ceab7a] opacity-80" />
        ))}
      </div>

      <p className="text-gray-300 text-[16px] leading-[1.8] mb-10 font-light">
        "{testimonial.quote}"
      </p>

      <div className="flex items-center gap-4 mt-auto border-t border-white/5 pt-6">
        {/* Clean Typography-Based Avatar */}
        <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-[#ceab7a]/40 transition-colors shadow-inner">
          <span className="text-[#ceab7a] font-serif text-[15px] tracking-widest">
            {testimonial.name.split(' ').map((n: string) => n[0]).join('')}
          </span>
        </div>
        
        <div>
          <h4 className="text-white text-[15px] font-medium tracking-wide">
            {testimonial.name}
          </h4>
          <p className="text-gray-500 text-[13px] mt-1">
            {testimonial.role}, <span className="text-gray-400">{testimonial.company}</span>
          </p>
        </div>
      </div>

      {/* Subtle Glow on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#ceab7a]/0 via-transparent to-[#ceab7a]/[0.05] opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[24px] pointer-events-none" />
    </motion.div>
  );
}
