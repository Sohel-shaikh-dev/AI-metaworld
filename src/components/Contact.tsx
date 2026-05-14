import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, ArrowRight, CheckCircle2, Mail, MapPin } from 'lucide-react';
import { useTypewriter } from '../hooks/useTypewriter';
import { SparkleInput } from './SparkleInput';

export default function Contact() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const [isProjectFocused, setIsProjectFocused] = useState(false);
  const [projectText, setProjectText] = useState("");

  const projectPlaceholder = useTypewriter({
    words: [
      "Tell us about your brand, goals, and digital vision...",
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
  const [email, setEmail] = useState("");
  const [service, setService] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !projectText) {
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
          email: email,
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
        setEmail("");
        setService("");
        setProjectText("");
      } else {
        if (WEB3FORMS_ACCESS_KEY === "YOUR_ACCESS_KEY_HERE") {
          setErrorMsg("Setup required: Please enter your Web3Forms Access Key in the code.");
        } else {
          setErrorMsg(result.message || "Something went wrong. Please try again.");
        }
      }
    } catch (error) {
      setErrorMsg("Network error. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- WHATSAPP CONFIGURATION ---
  // Change the text below to update the default pre-filled message that users send to you.
  const waNumber = "917718938615";
  const waMessage = `Hello AI Metaworld,

I visited your website and I’m interested in your services.
I would like to discuss my project with you.`;
  const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(waMessage)}`;

  return (
    <section id="contact" className="py-24 md:py-32 xl:py-40 relative bg-[#050505] overflow-hidden min-h-screen flex items-center border-t border-white/5">
      {/* Cinematic Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#030303] via-[#080808] to-[#050505]" />
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-800 via-transparent to-transparent pointer-events-none" />
      
      <div className="max-w-[1500px] mx-auto px-6 md:px-12 relative z-10 w-full">
        <div className="flex flex-col lg:flex-row gap-16 xl:gap-24 items-center justify-between">
          
          {/* Left Side: Premium Content Area */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="w-full lg:w-[45%] xl:w-[40%] flex flex-col relative z-20"
          >
            <motion.div variants={itemVariants} className="mb-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-8 h-[1px] bg-[#ceab7a]/50"></div>
                <span className="text-[11px] font-medium text-[#ceab7a] tracking-[0.25em] uppercase">
                  START A PROJECT
                </span>
              </div>
              
              <h2 className="font-serif text-[42px] sm:text-[50px] md:text-[60px] leading-[1.1] mb-6 text-white">
                Ready To Launch Something <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#e8d3b5] via-[#ceab7a] to-[#a8824a] pb-2">Exceptional?</span>
              </h2>
              
              <p className="text-gray-400 text-[16px] leading-[1.7] max-w-md mb-12">
                From premium websites and branding systems to AI-powered digital experiences, we help modern brands launch, grow, and stand out.
              </p>

              {/* Luxury Trust Strip */}
              <div className="flex flex-col gap-5 border-l border-[#ceab7a]/30 pl-6 py-2 mb-12">
                <div className="flex items-center gap-4 group">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#ceab7a] shadow-[0_0_10px_#ceab7a]" />
                  <span className="text-gray-300 text-sm tracking-wide">250+ Projects Delivered</span>
                </div>
                <div className="flex items-center gap-4 group">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#ceab7a] shadow-[0_0_10px_#ceab7a]" />
                  <span className="text-gray-300 text-sm tracking-wide">98% Client Satisfaction</span>
                </div>
                <div className="flex items-center gap-4 group">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#ceab7a] shadow-[0_0_10px_#ceab7a]" />
                  <span className="text-gray-300 text-sm tracking-wide">Fast Turnaround</span>
                </div>
                <div className="flex items-center gap-4 group">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#ceab7a] shadow-[0_0_10px_#ceab7a]" />
                  <span className="text-gray-300 text-sm tracking-wide">AI-Powered Workflow</span>
                </div>
              </div>

              {/* Contact Actions */}
              <div className="flex flex-col gap-6">
                <motion.a 
                  whileHover={{ y: -3 }}
                  href={waLink} 
                  target="_blank" 
                  rel="noreferrer"
                  className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#0a0a0a]/80 backdrop-blur-xl text-white font-medium rounded-2xl border border-white/10 hover:border-[#25D366]/40 transition-all duration-300 overflow-hidden shadow-2xl self-start"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#25D366]/0 via-[#25D366]/10 to-[#25D366]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  <MessageSquare size={20} className="text-[#25D366] group-hover:scale-110 transition-transform duration-300" />
                  <span className="tracking-wide">WhatsApp Quick Chat</span>
                </motion.a>

                <div className="flex flex-col gap-3 pl-2 text-[15px] text-gray-400 font-light">
                  <a href="mailto:aimetaworldd@gmail.com" className="flex items-center gap-4 hover:text-[#ceab7a] transition-colors w-fit group">
                    <Mail size={16} className="text-gray-500 group-hover:text-[#ceab7a] transition-colors" />
                    <span>aimetaworldd@gmail.com</span>
                  </a>
                  <div className="flex items-center gap-4">
                    <MapPin size={16} className="text-gray-500" />
                    <span>Mumbai, India</span>
                  </div>
                </div>
              </div>
              
            </motion.div>
          </motion.div>
          
          {/* Right Side: Floating Luxury Form Panel */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
            className="w-full lg:w-[55%] xl:w-[50%] relative"
          >
            {/* Cinematic Radial Glow Behind Form */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[#ceab7a]/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative bg-[#050505]/70 backdrop-blur-2xl border border-white/5 hover:border-white/10 transition-colors duration-500 rounded-[32px] p-8 md:p-12 shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col">
              
              {isSuccess ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center text-center py-12 space-y-6">
                  <div className="w-20 h-20 bg-[#ceab7a]/10 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 size={40} className="text-[#ceab7a]" />
                  </div>
                  <h3 className="text-3xl font-serif text-white">Message Sent!</h3>
                  <p className="text-gray-400 max-w-sm">Thank you for reaching out. Our team will review your project details and get back to you within 24 hours.</p>
                  <button onClick={() => setIsSuccess(false)} className="mt-8 px-8 py-3 bg-white/5 border border-white/10 hover:border-[#ceab7a]/50 rounded-full text-white text-sm transition-all duration-300">
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    <div className="space-y-3">
                      <label className="text-[13px] font-medium text-gray-400 tracking-wide uppercase ml-1">Name</label>
                      <SparkleInput 
                        as="input"
                        type="text" 
                        value={name}
                        onChange={(e: any) => setName(e.target.value)}
                        required
                        placeholder="John Doe"
                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#ceab7a]/50 focus:bg-white/[0.05] focus:shadow-[0_0_20px_rgba(206,171,122,0.1)] transition-all duration-300"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[13px] font-medium text-gray-400 tracking-wide uppercase ml-1">Email</label>
                      <SparkleInput 
                        as="input"
                        type="email" 
                        value={email}
                        onChange={(e: any) => setEmail(e.target.value)}
                        required
                        placeholder="john@company.com"
                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#ceab7a]/50 focus:bg-white/[0.05] focus:shadow-[0_0_20px_rgba(206,171,122,0.1)] transition-all duration-300"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[13px] font-medium text-gray-400 tracking-wide uppercase ml-1">Service Needed</label>
                    <div className="relative">
                      <select 
                        value={service}
                        onChange={(e) => setService(e.target.value)}
                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-[#ceab7a]/50 focus:bg-white/[0.05] focus:shadow-[0_0_20px_rgba(206,171,122,0.1)] transition-all duration-300 appearance-none cursor-pointer"
                      >
                        <option value="" className="bg-[#0a0a0a] text-gray-400">Select a premium service...</option>
                        <option value="website" className="bg-[#0a0a0a]">Website Design & Development</option>
                        <option value="branding" className="bg-[#0a0a0a]">Branding & Logo Design</option>
                        <option value="aifashion" className="bg-[#0a0a0a]">AI Fashion Try-On</option>
                        <option value="google" className="bg-[#0a0a0a]">Google Business & Growth</option>
                        <option value="print" className="bg-[#0a0a0a]">Print-On-Demand Solutions</option>
                        <option value="all" className="bg-[#0a0a0a]">Complete Digital Ecosystem</option>
                      </select>
                      {/* Custom Dropdown Arrow */}
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 1.5L6 6.5L11 1.5" stroke="#ceab7a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[13px] font-medium text-gray-400 tracking-wide uppercase ml-1">Project Details</label>
                    <div className="relative">
                      <SparkleInput 
                        as="textarea"
                        rows={4}
                        required
                        value={projectText}
                        onChange={(e: any) => setProjectText(e.target.value)}
                        onFocus={() => setIsProjectFocused(true)}
                        onBlur={() => setIsProjectFocused(false)}
                        placeholder={projectPlaceholder}
                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-5 text-white placeholder-gray-600 focus:outline-none focus:border-[#ceab7a]/50 focus:bg-white/[0.05] focus:shadow-[0_0_20px_rgba(206,171,122,0.1)] transition-all duration-300 resize-none"
                      />
                      {/* Fake blinking cursor when placeholder is typing and no focus */}
                      {!isProjectFocused && projectText.length === 0 && (
                        <motion.span
                          animate={{ opacity: [1, 0] }}
                          transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
                          className="absolute text-[#ceab7a] pointer-events-none"
                          style={{ 
                            top: '20px', 
                            left: `calc(1.5rem + ${projectPlaceholder.length * 7.5}px)` // approximate width per char
                          }}
                        >
                          |
                        </motion.span>
                      )}
                    </div>
                  </div>

                  <motion.button 
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-5 bg-gradient-to-r from-[#e8d3b5] via-[#ceab7a] to-[#a8824a] text-[#050505] font-serif font-bold text-[18px] tracking-wide rounded-2xl hover:shadow-[0_0_30px_rgba(206,171,122,0.4)] transition-all duration-300 flex items-center justify-center gap-3 group mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 border-2 border-[#050505] border-t-transparent rounded-full animate-spin" />
                        <span>Sending Request...</span>
                      </div>
                    ) : (
                      <>
                        Start Your Project
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </motion.button>

                  <div className="flex items-center justify-center gap-2 text-[12px] text-gray-500 mt-6 font-light">
                    <CheckCircle2 size={12} className="text-[#ceab7a]" />
                    <span>Premium confidentiality. Your information is secure.</span>
                  </div>
                </form>
              )}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
