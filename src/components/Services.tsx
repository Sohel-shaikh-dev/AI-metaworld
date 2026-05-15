import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { 
  MonitorSmartphone, PenTool, BarChart3, Shirt, ArrowRight, Star, Zap, ShieldCheck, Sparkles,
  X, CheckCircle2, MessageCircle, Cpu, Search, Code, Rocket, Palette, Package, Settings, Lightbulb, Check, Database, Table, PieChart, TrendingUp, Download, Image as ImageIcon, ZapIcon
} from 'lucide-react';
import CinematicTypewriter from './CinematicTypewriter';

const services = [
  {
    icon: MonitorSmartphone,
    id: "01",
    title: "Web Design\n& Development",
    modalTitle: "Web Design &\nDevelopment",
    desc: "We create stunning, high-performance websites that not only look exceptional but also drive results.",
    img: "/Assets/service_modal_web.webp",
    inclusions: [
      "Custom Website Design", "Fast & Optimized Performance",
      "Responsive for All Devices", "CMS / Admin Panel",
      "SEO-Friendly Structure", "Secure & Scalable Code"
    ],
    process: [
      { icon: Search, title: "Discovery", desc: "Understanding your goals" },
      { icon: Palette, title: "Design", desc: "Creating UI/UX & wireframes" },
      { icon: Code, title: "Development", desc: "Building with clean & scalable code" },
      { icon: Rocket, title: "Launch", desc: "Testing, deploying & going live" }
    ],
    highlights: [
      { icon: Zap, title: "Fast Delivery", desc: "5-7 Working Days" },
      { icon: MonitorSmartphone, title: "Fully Responsive", desc: "All Devices Supported" },
      { icon: ZapIcon, title: "High Performance", desc: "Optimized for Speed" }
    ]
  },
  {
    icon: PenTool,
    id: "02",
    title: "Branding &\nGraphic Design",
    modalTitle: "Branding &\nGraphic Design",
    desc: "We create unique visual identities that tell your brand story and leave a lasting impression.",
    img: "/Assets/service_modal_branding.webp",
    inclusions: [
      "Logo Design & Identity", "Social Media Kit Design",
      "Brand Guidelines", "Packaging Design",
      "Business Cards & Stationery", "Print & Digital Assets"
    ],
    process: [
      { icon: Search, title: "Discovery", desc: "Understanding your brand" },
      { icon: Lightbulb, title: "Design", desc: "Creating concepts & moodboards" },
      { icon: Palette, title: "Development", desc: "Refining & finalizing the design" },
      { icon: Package, title: "Launch", desc: "Delivering all brand assets" }
    ],
    highlights: [
      { icon: Star, title: "Creative & Unique", desc: "100% Original Designs" },
      { icon: CheckCircle2, title: "Unlimited Revisions", desc: "Until You Are Happy" },
      { icon: Check, title: "High Quality Files", desc: "Print & Digital Ready" }
    ]
  },
  {
    icon: Shirt,
    id: "03",
    title: "Print On Demand\nStore Setup",
    modalTitle: "Print On Demand\nStore Setup",
    desc: "We set up and optimize Print On Demand stores that are ready to sell and scale.",
    img: "/Assets/service_modal_pod.webp",
    inclusions: [
      "Store Setup (Shopify)", "Printful / Printify Setup",
      "Product Research", "Payment & Shipping Setup",
      "Premium Store Design", "App Integration"
    ],
    process: [
      { icon: Search, title: "Discovery", desc: "Niche & market research" },
      { icon: Settings, title: "Setup", desc: "Store & product configuration" },
      { icon: Palette, title: "Design", desc: "Store customization & branding" },
      { icon: Rocket, title: "Launch", desc: "Go live & start selling" }
    ],
    highlights: [
      { icon: Star, title: "Winning Products", desc: "High-Profit Potential" },
      { icon: Zap, title: "Fast Store Setup", desc: "5-7 Working Days" },
      { icon: ShieldCheck, title: "Full Support", desc: "After Launch Support" }
    ]
  },
  {
    icon: Cpu,
    id: "04",
    title: "AI Content &\nImage Generation",
    modalTitle: "AI Content &\nImage Generation",
    desc: "High-quality AI generated content and images tailored to your brand and business.",
    img: "/Assets/service_modal_aicontent.webp",
    inclusions: [
      "AI Blog Articles", "AI Image Generation",
      "AI Product Descriptions", "AI Ad Copy",
      "AI Social Media Content", "Custom AI Prompts"
    ],
    process: [
      { icon: Search, title: "Discovery", desc: "Understanding your requirements" },
      { icon: Cpu, title: "Generate", desc: "AI content & images creation" },
      { icon: PenTool, title: "Refine", desc: "Editing & optimizing output" },
      { icon: Download, title: "Deliver", desc: "High-quality final delivery" }
    ],
    highlights: [
      { icon: Star, title: "100% Original", desc: "Unique AI Content" },
      { icon: Search, title: "SEO Friendly Content", desc: "Rank Higher" },
      { icon: ImageIcon, title: "High Quality Images", desc: "HD & Commercial Use" }
    ]
  },
  {
    icon: BarChart3,
    id: "05",
    title: "Power BI\nDashboards",
    modalTitle: "Power BI\nDashboards",
    desc: "We create interactive Power BI dashboards that turn data into powerful insights.",
    img: "/Assets/service_modal_powerbi.webp",
    inclusions: [
      "Interactive Dashboards", "Real-time Insights",
      "Data Modeling", "KPI Tracking",
      "Data Visualization", "Custom Reports"
    ],
    process: [
      { icon: Database, title: "Connect", desc: "Connect your data sources" },
      { icon: Table, title: "Model", desc: "Clean & model the data" },
      { icon: PieChart, title: "Visualize", desc: "Create dashboards & reports" },
      { icon: TrendingUp, title: "Deliver", desc: "Insights that drive decisions" }
    ],
    highlights: [
      { icon: Lightbulb, title: "Actionable Insights", desc: "Make Better Decisions" },
      { icon: ZapIcon, title: "Real-time Data", desc: "Always Up-to-Date" },
      { icon: BarChart3, title: "Custom Dashboards", desc: "Tailored to Your KPIs" }
    ]
  }
];

export default function Services() {
  const [selectedService, setSelectedService] = useState<typeof services[0] | null>(null);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (selectedService) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [selectedService]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
  };

  const waNumber = "917718938615";
  const waMessage = selectedService 
    ? `Hello AI Metaworld,\n\nI am interested in your ${selectedService.modalTitle.replace('\n', ' ')} service.\nI would like to discuss my project with you.`
    : "";
  const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(waMessage)}`;

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
              onClick={() => setSelectedService(service)}
              className="flex flex-col rounded-[20px] border border-[#ceab7a]/30 bg-[#0a0a0a] overflow-hidden hover:border-[#ceab7a]/60 hover:shadow-[0_0_30px_rgba(206,171,122,0.1)] transition-all duration-500 relative group w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] cursor-pointer"
            >
              <div className="p-8 pb-0 flex flex-col flex-1 z-10 relative pointer-events-none">
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
                <p className="text-gray-400 text-[14px] leading-[1.6] mb-8 line-clamp-2">
                  {service.desc}
                </p>

                {/* Arrow Button */}
                <div className="w-10 h-10 rounded-full border border-[#ceab7a]/40 flex items-center justify-center text-[#ceab7a] group-hover:bg-[#ceab7a] group-hover:text-black transition-colors duration-300 mt-auto mb-8">
                  <ArrowRight size={16} strokeWidth={2} />
                </div>
              </div>

              {/* Bottom: Image Background */}
              <div className="relative w-full h-[220px] sm:h-[240px] mt-auto overflow-hidden pointer-events-none">
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

      {/* SERVICE MODAL POPUP */}
      {createPortal(
        <AnimatePresence>
          {selectedService && (
            <motion.div
              key="modal-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-md overflow-y-auto flex items-start justify-center p-4 md:p-8 pt-[5vh] sm:pt-[10vh]"
              onClick={() => setSelectedService(null)}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="bg-[#0a0a0a] border border-[#ceab7a]/30 rounded-[24px] w-full max-w-[1200px] flex flex-col lg:flex-row shadow-[0_0_50px_rgba(206,171,122,0.15)] relative mb-[10vh] animate-in fade-in zoom-in-95 duration-300"
              >
              {/* Close Button */}
              <button 
                aria-label="Close Service Details"
                onClick={() => setSelectedService(null)}
                className="absolute top-4 right-4 z-50 w-10 h-10 bg-black/50 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:border-[#ceab7a]/50 transition-all duration-300"
              >
                <X size={20} />
              </button>

              {/* Left Column - Image Gallery */}
              <div className="w-full lg:w-1/2 p-6 md:p-8 flex flex-col gap-4 bg-[#050505] rounded-t-[24px] lg:rounded-l-[24px] lg:rounded-tr-none">
                {/* Main Large Image */}
                <div className="w-full aspect-[4/3] rounded-[16px] overflow-hidden border border-white/5 relative group">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                  <img src={selectedService.img} alt={selectedService.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                {/* Thumbnails Row */}
                <div className="grid grid-cols-4 gap-3 md:gap-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="aspect-square rounded-[12px] overflow-hidden border border-white/5 relative cursor-pointer hover:border-[#ceab7a]/50 transition-colors">
                      <img 
                        src={selectedService.img} 
                        alt="thumbnail" 
                        className="w-full h-full object-cover scale-150"
                        style={{ objectPosition: `${(i+1)*20}% ${(i+1)*20}%` }}
                      />
                      <div className="absolute inset-0 bg-black/40 hover:bg-transparent transition-colors duration-300" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column - Content Details */}
              <div className="w-full lg:w-1/2 p-6 md:p-8 lg:p-12 flex flex-col">
                <span className="text-[10px] font-bold tracking-[0.2em] text-[#ceab7a] uppercase mb-4">PREMIUM SERVICE</span>
                <h3 className="text-[32px] md:text-[40px] font-serif text-white leading-tight mb-4 whitespace-pre-line">
                  {selectedService.modalTitle}
                </h3>
                <p className="text-gray-400 text-[15px] leading-relaxed mb-8 border-b border-white/10 pb-8">
                  {selectedService.desc}
                </p>

                {/* What's Included */}
                <div className="mb-8">
                  <h4 className="text-[11px] font-bold tracking-[0.2em] text-[#ceab7a] uppercase mb-6">WHAT'S INCLUDED</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedService.inclusions.map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <CheckCircle2 size={16} className="text-[#ceab7a] shrink-0" />
                        <span className="text-gray-300 text-[13px] font-medium">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Our Process */}
                <div className="mb-10">
                  <h4 className="text-[11px] font-bold tracking-[0.2em] text-[#ceab7a] uppercase mb-6">OUR PROCESS</h4>
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-6 relative">
                    {/* Connecting Dashed Line (Desktop only) */}
                    <div className="hidden sm:block absolute top-6 left-[15%] right-[15%] h-[1px] border-t border-dashed border-[#ceab7a]/30" />
                    
                    {selectedService.process.map((step, i) => (
                      <div key={i} className="flex flex-row sm:flex-col items-center sm:text-center relative z-10 flex-1 w-full sm:w-auto gap-4 sm:gap-0">
                        <div className="w-12 h-12 rounded-full border border-[#ceab7a]/40 bg-[#0a0a0a] flex items-center justify-center sm:mb-4 shrink-0 shadow-[0_0_15px_rgba(206,171,122,0.1)]">
                          <step.icon size={18} className="text-[#ceab7a]" />
                        </div>
                        <div className="flex flex-col sm:items-center">
                          <h5 className="text-white text-[13px] font-medium mb-1">{step.title}</h5>
                          <p className="text-gray-500 text-[11px] leading-relaxed max-w-[120px]">{step.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Highlights Pills */}
                <div className="flex flex-wrap gap-3 mb-10 pb-10 border-b border-white/10">
                  {selectedService.highlights.map((hlt, i) => (
                    <div key={i} className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-3 rounded-xl flex-1 min-w-[140px]">
                      <hlt.icon size={16} className="text-[#ceab7a]" />
                      <div className="flex flex-col">
                        <span className="text-white text-[12px] font-medium leading-none mb-1">{hlt.title}</span>
                        <span className="text-gray-500 text-[10px] leading-none">{hlt.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                  <button 
                    onClick={() => {
                      setSelectedService(null);
                      setTimeout(() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }), 300);
                    }}
                    className="flex-1 py-4 bg-gradient-to-r from-[#e8d3b5] via-[#ceab7a] to-[#a8824a] text-black rounded-xl flex justify-center items-center gap-2 font-bold text-[14px] hover:shadow-[0_0_30px_rgba(206,171,122,0.4)] transition-all hover:scale-[1.02]"
                  >
                    Start Your Project <ArrowRight size={18} />
                  </button>
                  <a 
                    href={waLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-4 bg-transparent border border-white/10 text-white rounded-xl flex justify-center items-center gap-2 font-medium text-[14px] hover:border-[#ceab7a]/50 hover:bg-white/5 transition-all"
                  >
                    <MessageCircle size={18} className="text-gray-400" /> Chat on WhatsApp
                  </a>
                </div>
                <div className="w-full flex justify-center mt-4">
                  <div className="flex items-center gap-2">
                    <Zap size={12} className="text-[#ceab7a] fill-[#ceab7a]" />
                    <span className="text-gray-500 text-[11px] font-medium tracking-wide">Usually replies within 1 hour</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>,
        document.body
      )}
    </section>
  );
}
