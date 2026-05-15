import { useState } from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { 
  MessageSquare, 
  Mail, 
  MapPin, 
  Zap, 
  Monitor, 
  Brain, 
  Target, 
  Smartphone, 
  Clock, 
  User, 
  Briefcase, 
  ChevronDown, 
  Send, 
  Lock, 
  ShieldCheck, 
  MessageCircle, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { useTypewriter } from '../hooks/useTypewriter';
import { SparkleInput } from './SparkleInput';
import CinematicTypewriter from './CinematicTypewriter';

export default function Contact() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const [isProjectFocused, setIsProjectFocused] = useState(false);
  const [projectText, setProjectText] = useState("");

  const projectPlaceholder = useTypewriter({
    words: [
      "Tell us about your project, goals and requirements...",
      "What are you planning to build?",
      "Describe the digital experience you need..."
    ],
    typingSpeed: 60,
    deletingSpeed: 30,
    delayPause: 4000,
    loop: true,
    isPaused: isProjectFocused || projectText.length > 0
  });

  const [name, setName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !projectText) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      // NOTE: User must replace this key with their actual Web3Forms access key
      const WEB3FORMS_ACCESS_KEY = "ffa2b02d-88c0-49b3-af30-282cda01cbd6";

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          name: name,
          business_name: businessName,
          phone: `+91 ${phone}`,
          service: service || "Not specified",
          message: projectText,
          subject: `New Lead: ${name} - ${service || "General Inquiry"}`,
          from_name: "AI Metaworld Website",
        }),
      });

      const result = await response.json();
      if (result.success) {
        setIsSuccess(true);
        setName("");
        setBusinessName("");
        setPhone("");
        setService("");
        setProjectText("");
      } else {
        setErrorMsg(result.message || "Something went wrong. Please try again.");
      }
    } catch (error) {
      setErrorMsg("Network error. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- WHATSAPP CONFIGURATION ---
  const waNumber = "917718938615";
  const waMessage = `Hello AI Metaworld,\n\nI visited your website and I'm interested in your services.\nI would like to discuss my project with you.`;
  const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(waMessage)}`;

  return (
    <section id="contact" className="py-24 md:py-32 xl:py-40 relative bg-[#050505] overflow-hidden min-h-screen flex items-center border-t border-white/5">
      {/* Cinematic Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#030303] via-[#080808] to-[#050505]" />
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#ceab7a]/10 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative z-10 w-full">
        
        {/* Top Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center text-center w-full mb-12"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-[1px] bg-gradient-to-r from-transparent to-[#ceab7a]/50"></div>
            <span className="text-[11px] font-medium text-[#ceab7a] tracking-[0.25em] uppercase min-w-[120px] text-center">
              <CinematicTypewriter words={["CONTACT US"]} typingSpeed={100} deletingSpeed={50} delayPause={6000} cursorClassName="bg-[#ceab7a]" />
            </span>
            <div className="w-10 h-[1px] bg-gradient-to-l from-transparent to-[#ceab7a]/50"></div>
          </div>
          
          <h2 className="font-serif text-[42px] sm:text-[50px] md:text-[60px] leading-[1.1] mb-6 text-white max-w-3xl">
            Let's Build Something <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e8d3b5] via-[#ceab7a] to-[#a8824a] pb-2">
              Exceptional.
            </span>
          </h2>
          
          <p className="text-gray-400 text-[16px] leading-[1.7] max-w-lg mx-auto font-light">
            Tell us about your idea and we'll turn it into a premium digital experience.
          </p>
        </motion.div>

        {/* Center glowing star divider */}
        <motion.div 
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3 }}
          className="w-full max-w-[1000px] mx-auto relative h-[1px] bg-gradient-to-r from-transparent via-[#ceab7a]/30 to-transparent mb-16"
        >
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#050505] px-2">
              <Sparkles size={24} className="text-[#ceab7a] drop-shadow-[0_0_15px_rgba(206,171,122,1)]" />
           </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8 items-stretch justify-center max-w-[1100px] mx-auto">

          {/* Left Column */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="w-full lg:w-[45%] flex flex-col gap-6"
          >
            {/* Box 1: Why Work With Us */}
            <motion.div variants={itemVariants} className="rounded-[24px] border border-white/5 bg-[#0a0a0a]/80 backdrop-blur-sm p-8 hover:border-[#ceab7a]/20 transition-colors shadow-2xl relative overflow-hidden group">
              <h4 className="text-[11px] font-medium text-[#ceab7a] tracking-[0.15em] uppercase mb-8">WHY WORK WITH AI METAWORLD?</h4>
              
              <div className="flex flex-col gap-6">
                {[
                  { icon: Zap, title: "Fast Response", desc: "We usually reply within 1 hour during business days." },
                  { icon: Monitor, title: "Cinematic Design", desc: "Luxury UI/UX that helps your brand stand out." },
                  { icon: Brain, title: "AI Powered Workflow", desc: "Smart automations and AI tools for faster & better results." },
                  { icon: Target, title: "Personalized Strategy", desc: "We focus on your goals and deliver custom solutions." },
                  { icon: Smartphone, title: "Mobile First Approach", desc: "Every project is fully responsive and performance optimized." }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-5 group/item">
                      <div className="w-12 h-12 rounded-full border border-white/10 bg-[#111] flex items-center justify-center shrink-0 group-hover/item:border-[#ceab7a]/40 group-hover/item:shadow-[0_0_15px_rgba(206,171,122,0.15)] transition-all duration-300">
                        <item.icon className="text-[#ceab7a] opacity-90 group-hover/item:opacity-100 group-hover/item:scale-110 transition-all duration-300" size={20} />
                      </div>
                      <div className="flex flex-col pt-1">
                        <span className="text-white text-[15px] font-medium mb-1 tracking-wide">{item.title}</span>
                        <span className="text-gray-400 text-[13px] leading-relaxed">{item.desc}</span>
                      </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Box 2: Connect Instantly */}
            <motion.div variants={itemVariants} className="rounded-[24px] border border-[#ceab7a]/20 bg-gradient-to-b from-[#0a0a0a] to-[#050505] p-8 shadow-[0_0_40px_rgba(206,171,122,0.05)] relative overflow-hidden group">
              <div className="absolute inset-0 bg-[#ceab7a]/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              
              <h4 className="text-[11px] font-medium text-[#ceab7a] tracking-[0.15em] uppercase mb-3 relative z-10">LET'S CONNECT INSTANTLY</h4>
              <p className="text-gray-400 text-[13px] leading-relaxed mb-6 relative z-10">Chat with us on WhatsApp for quick support and instant answers.</p>
              
              <a href={waLink} target="_blank" rel="noreferrer" className="w-full py-4 border border-[#ceab7a] rounded-[16px] text-[#ceab7a] font-medium text-[15px] hover:bg-[#ceab7a] hover:text-black transition-all flex items-center justify-center gap-3 mb-4 shadow-[0_0_20px_rgba(206,171,122,0.1)] relative z-10">
                  <MessageSquare size={18} />
                  Chat on WhatsApp
              </a>
              <p className="text-gray-500 text-[12px] text-center mb-8 flex items-center justify-center gap-2 relative z-10">
                Usually replies <span className="text-[#ceab7a]">within 1 hour</span> <Zap size={10} className="text-[#ceab7a] fill-[#ceab7a]"/>
              </p>

              <div className="flex flex-col gap-5 pt-6 border-t border-white/5 relative z-10">
                  <div className="flex items-center gap-4 group/contact">
                    <div className="w-10 h-10 rounded-full border border-white/5 bg-[#111] flex items-center justify-center group-hover/contact:border-[#ceab7a]/30 transition-colors">
                        <Mail size={16} className="text-[#ceab7a]" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[12px] text-gray-500">Email Us</span>
                        <a href="mailto:aimetaworldd@gmail.com" className="text-[14px] text-gray-300 hover:text-[#ceab7a] transition-colors">aimetaworldd@gmail.com</a>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 group/contact">
                    <div className="w-10 h-10 rounded-full border border-white/5 bg-[#111] flex items-center justify-center group-hover/contact:border-[#ceab7a]/30 transition-colors">
                        <Clock size={16} className="text-[#ceab7a]" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[12px] text-gray-500">Working Hours</span>
                        <span className="text-[14px] text-gray-300">Mon - Sat : 10AM - 8PM</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 group/contact">
                    <div className="w-10 h-10 rounded-full border border-white/5 bg-[#111] flex items-center justify-center group-hover/contact:border-[#ceab7a]/30 transition-colors">
                        <MapPin size={16} className="text-[#ceab7a]" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[12px] text-gray-500">Location</span>
                        <span className="text-[14px] text-gray-300">Mumbai, India 🇮🇳</span>
                    </div>
                  </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: Form Panel */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
            className="w-full lg:w-[55%] relative h-full"
          >
            <div className="rounded-[24px] border border-white/5 bg-[#0a0a0a]/80 backdrop-blur-sm p-8 md:p-12 hover:border-white/10 transition-colors shadow-2xl relative overflow-hidden h-full">
              <h4 className="text-[11px] font-medium text-[#ceab7a] tracking-[0.15em] uppercase mb-8">TELL US ABOUT YOUR PROJECT</h4>
              
              {isSuccess ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center text-center py-20 space-y-6 h-full">
                  <div className="w-24 h-24 bg-[#ceab7a]/10 rounded-full flex items-center justify-center mb-4 border border-[#ceab7a]/20 shadow-[0_0_30px_rgba(206,171,122,0.15)]">
                    <CheckCircle2 size={48} className="text-[#ceab7a]" />
                  </div>
                  <h3 className="text-[32px] font-serif text-white">Message Sent!</h3>
                  <p className="text-gray-400 max-w-sm leading-relaxed">Thank you for reaching out. Our team will review your project details and get back to you shortly.</p>
                  <button onClick={() => setIsSuccess(false)} className="mt-8 px-8 py-3 bg-white/5 border border-white/10 hover:border-[#ceab7a]/50 rounded-full text-white text-[13px] tracking-wide transition-all duration-300">
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <form className="space-y-6 md:space-y-8" onSubmit={handleSubmit}>
                  {errorMsg && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm">
                      {errorMsg}
                    </motion.div>
                  )}
                  
                  {/* Full Name */}
                  <div className="space-y-3">
                    <label className="text-[13px] font-medium text-white tracking-wide">Full Name</label>
                    <div className="relative">
                      <SparkleInput
                        as="input"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder="Enter your full name"
                        className="w-full bg-[#050505] border border-white/10 rounded-[16px] px-6 pr-12 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#ceab7a]/50 focus:shadow-[0_0_20px_rgba(206,171,122,0.1)] transition-all duration-300"
                      />
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none">
                        <User size={18} className="text-gray-500" />
                      </div>
                    </div>
                  </div>

                  {/* Business Name */}
                  <div className="space-y-3">
                    <label className="text-[13px] font-medium text-white tracking-wide">Business / Brand Name</label>
                    <div className="relative">
                      <SparkleInput
                        as="input"
                        type="text"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        placeholder="Enter your business or brand name"
                        className="w-full bg-[#050505] border border-white/10 rounded-[16px] px-6 pr-12 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#ceab7a]/50 focus:shadow-[0_0_20px_rgba(206,171,122,0.1)] transition-all duration-300"
                      />
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none">
                        <Briefcase size={18} className="text-gray-500" />
                      </div>
                    </div>
                  </div>

                  {/* WhatsApp Number */}
                  <div className="space-y-3">
                    <label className="text-[13px] font-medium text-white tracking-wide">WhatsApp Number</label>
                    <div className="relative flex">
                      <div className="absolute left-0 top-0 bottom-0 flex items-center gap-2 pl-5 pr-3 border-r border-white/10 bg-[#111] rounded-l-[16px] z-10 pointer-events-none">
                          <span className="text-lg">🇮🇳</span>
                          <span className="text-white text-[14px]">+91</span>
                          <ChevronDown size={14} className="text-gray-500" />
                      </div>
                      <SparkleInput
                        as="input"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                        required
                        placeholder="Enter your WhatsApp number"
                        className="w-full pl-[110px] pr-12 bg-[#050505] border border-white/10 rounded-[16px] px-6 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#ceab7a]/50 focus:shadow-[0_0_20px_rgba(206,171,122,0.1)] transition-all duration-300"
                      />
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none">
                        <MessageSquare size={18} className="text-gray-500" />
                      </div>
                    </div>
                  </div>

                  {/* Service Needed */}
                  <div className="space-y-3">
                    <label className="text-[13px] font-medium text-white tracking-wide">Service Needed</label>
                    <div className="relative">
                      <select
                        value={service}
                        onChange={(e) => setService(e.target.value)}
                        className="w-full bg-[#050505] border border-white/10 rounded-[16px] px-6 pr-12 py-4 text-white focus:outline-none focus:border-[#ceab7a]/50 focus:shadow-[0_0_20px_rgba(206,171,122,0.1)] transition-all duration-300 appearance-none cursor-pointer"
                      >
                        <option value="" className="bg-[#050505] text-gray-400">Select the service you need</option>
                        <option value="website" className="bg-[#0a0a0a]">Website Design & Development</option>
                        <option value="branding" className="bg-[#0a0a0a]">Branding & Logo Design</option>
                        <option value="aifashion" className="bg-[#0a0a0a]">AI Fashion Try-On</option>
                        <option value="powerbi" className="bg-[#0a0a0a]">Power BI Data Analysis</option>
                        <option value="print" className="bg-[#0a0a0a]">Print-On-Demand Solutions</option>
                        <option value="all" className="bg-[#0a0a0a]">Complete Digital Ecosystem</option>
                      </select>
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none">
                        <ChevronDown size={18} className="text-gray-500" />
                      </div>
                    </div>
                  </div>

                  {/* Project Details */}
                  <div className="space-y-3">
                    <label className="text-[13px] font-medium text-white tracking-wide">Project Details</label>
                    <div className="relative">
                      <SparkleInput
                        as="textarea"
                        rows={4}
                        required
                        value={projectText}
                        onChange={(e) => setProjectText(e.target.value)}
                        onFocus={() => setIsProjectFocused(true)}
                        onBlur={() => setIsProjectFocused(false)}
                        placeholder={projectPlaceholder}
                        className="w-full bg-[#050505] border border-white/10 rounded-[16px] px-6 py-5 text-white placeholder-gray-600 focus:outline-none focus:border-[#ceab7a]/50 focus:shadow-[0_0_20px_rgba(206,171,122,0.1)] transition-all duration-300 resize-none"
                      />
                      {!isProjectFocused && projectText.length === 0 && (
                        <motion.span
                          animate={{ opacity: [1, 0] }}
                          transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
                          className="absolute text-[#ceab7a] pointer-events-none"
                          style={{
                            top: '20px',
                            left: `calc(1.5rem + ${projectPlaceholder.length * 7.2}px)`
                          }}
                        >
                          |
                        </motion.span>
                      )}
                      <div className="absolute right-4 bottom-4 pointer-events-none">
                         <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-600">
                           <path d="M9 1L1 9M9 5L5 9M5 1L1 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                         </svg>
                      </div>
                    </div>
                  </div>

                  {/* Submit button */}
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 bg-gradient-to-r from-[#e8d3b5] via-[#ceab7a] to-[#a8824a] text-[#050505] font-medium text-[16px] tracking-wide rounded-[16px] hover:shadow-[0_0_30px_rgba(206,171,122,0.4)] transition-all duration-300 flex items-center justify-center gap-3 group disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 border-2 border-[#050505] border-t-transparent rounded-full animate-spin" />
                        <span>Sending Request...</span>
                      </div>
                    ) : (
                      <>
                        Send Message 
                        <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </>
                    )}
                  </motion.button>
                  
                  <div className="flex items-center justify-center gap-2 text-[12px] text-gray-500 pt-2 font-light">
                    <Lock size={12} className="text-[#ceab7a]" />
                    <span>Your information is safe with us. We never share your data.</span>
                  </div>
                </form>
              )}
            </div>
          </motion.div>

        </div>

        {/* Bottom Row: Ready to Start */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-8 max-w-[1100px] mx-auto rounded-[24px] border border-white/5 bg-gradient-to-r from-[#0a0a0a] to-[#080808] p-8 md:p-10 flex flex-col lg:flex-row items-center justify-between gap-10 shadow-2xl relative overflow-hidden group/ready"
        >
          <div className="absolute inset-0 bg-[#ceab7a]/[0.02] opacity-0 group-hover/ready:opacity-100 transition-opacity duration-700 pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 z-10 w-full lg:w-auto text-center sm:text-left">
            {/* Image */}
            <div className="w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] rounded-full overflow-hidden bg-[#111] border border-white/10 shadow-[0_0_30px_rgba(206,171,122,0.15)] group-hover/ready:shadow-[0_0_40px_rgba(206,171,122,0.3)] transition-all shrink-0 relative">
                <img src="/Assets/contact_rocket.png" alt="Ready to start" className="w-full h-full object-cover group-hover/ready:scale-110 transition-transform duration-700" />
            </div>
            <div className="flex flex-col">
                <span className="text-[11px] font-medium text-[#ceab7a] tracking-[0.15em] uppercase mb-2">READY TO START?</span>
                <h3 className="text-[24px] md:text-[28px] font-serif text-white leading-[1.2]">
                  Let's turn your idea into <br className="hidden md:block"/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e8d3b5] to-[#ceab7a]">something powerful.</span>
                </h3>
            </div>
          </div>
          
          <div className="flex flex-wrap md:flex-nowrap items-center justify-center lg:justify-end gap-8 md:gap-12 z-10 w-full lg:w-auto border-t lg:border-t-0 border-white/5 pt-8 lg:pt-0">
            {[
              { icon: Clock, title: "Fast Delivery", desc: "On Time, Every Time" },
              { icon: ShieldCheck, title: "100% Secure", desc: "Your Data is Safe" },
              { icon: MessageCircle, title: "Clear Communication", desc: "Always in Sync" }
            ].map((feat, i) => (
              <div key={i} className="flex flex-col items-center text-center group/feat">
                  <feat.icon size={28} strokeWidth={1.5} className="text-[#ceab7a] mb-3 opacity-80 group-hover/feat:scale-110 group-hover/feat:opacity-100 transition-all duration-300" />
                  <span className="text-white text-[13px] font-medium tracking-wide mb-1">{feat.title}</span>
                  <span className="text-gray-500 text-[11px]">{feat.desc}</span>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
