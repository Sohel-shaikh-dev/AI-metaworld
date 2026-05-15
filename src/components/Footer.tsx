import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { 
  Mail, MessageSquare, MapPin, Clock, Zap, ChevronRight, 
  Rocket, ShieldCheck, Users, Headphones, Star, ArrowRight 
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
  };

  return (
    <footer className="relative bg-[#030303] pt-24 pb-28 md:pb-8 overflow-hidden border-t border-white/5">
      {/* Cinematic Fog & Gradients */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top_center,_var(--tw-gradient-stops))] from-gray-800 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#ceab7a]/20 to-transparent" />

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >

          {/* Top Banner (Ready to Start) */}
          <motion.div variants={itemVariants} className="w-full relative rounded-3xl border border-[#ceab7a]/20 bg-[#0a0a0a] overflow-hidden mb-20 shadow-[0_0_50px_rgba(206,171,122,0.05)] flex flex-col lg:flex-row items-center justify-between p-8 md:p-12 lg:p-16">
            <div className="absolute inset-0 bg-gradient-to-br from-[#ceab7a]/10 via-transparent to-transparent pointer-events-none" />
            
            <div className="flex flex-col max-w-xl relative z-10 w-full lg:w-[55%]">
               <div className="flex items-center gap-3 mb-6">
                 <div className="w-8 h-[1px] bg-[#ceab7a]" />
                 <Star size={12} className="text-[#ceab7a] fill-[#ceab7a]" />
                 <span className="text-[11px] font-medium text-[#ceab7a] tracking-[0.2em] uppercase">Ready to Start?</span>
               </div>
               <h2 className="text-[32px] md:text-[44px] lg:text-[48px] font-sans font-bold text-white mb-4 leading-[1.1]">
                 Let's Build Something <br/>
                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e8d3b5] to-[#a8824a]">Exceptional.</span>
               </h2>
               <p className="text-gray-400 text-[15px] leading-relaxed mb-8 max-w-[400px]">
                 We create AI-powered digital experiences that help brands grow faster and stand out.
               </p>
               <div className="flex flex-col sm:flex-row gap-4 mb-6">
                 <a href="#contact" className="px-6 py-3.5 bg-gradient-to-r from-[#e8d3b5] to-[#ceab7a] hover:from-[#f0dfc8] hover:to-[#e8d3b5] text-black rounded-xl font-medium text-[15px] transition-all flex items-center justify-center gap-3 group">
                   <Rocket size={18} />
                   Start Your Project
                   <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                 </a>
                 <a href="https://wa.me/917718938615" target="_blank" rel="noreferrer" className="px-6 py-3.5 border border-white/10 hover:border-[#ceab7a]/50 text-white rounded-xl font-medium text-[15px] transition-all flex items-center justify-center gap-3 hover:bg-white/5 group">
                   <MessageSquare size={18} className="text-[#ceab7a] group-hover:scale-110 transition-transform" />
                   Chat on WhatsApp
                 </a>
               </div>
               <p className="text-gray-500 text-[13px] flex items-center gap-2 justify-center sm:justify-start w-full sm:w-auto">
                 Usually replies <span className="text-[#ceab7a]">within 1 hour</span> <Zap size={12} className="text-[#ceab7a] fill-[#ceab7a]" />
               </p>
            </div>
            
            <div className="w-full lg:w-[45%] relative mt-12 lg:mt-0 flex justify-center lg:justify-end">
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#ceab7a] rounded-full blur-[100px] opacity-10 pointer-events-none" />
               <img src="/Assets/footer_ai_box.webp" alt="AI Metaworld Tech" className="w-full max-w-[320px] lg:max-w-[400px] object-contain drop-shadow-[0_0_30px_rgba(206,171,122,0.3)] relative z-10 mix-blend-screen" />
            </div>
          </motion.div>

          {/* Main Footer Grid (5 Columns) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-20 relative">
            {/* Vertical Separators for Desktop */}
            <div className="hidden lg:block absolute top-0 bottom-0 left-[26%] w-[1px] bg-gradient-to-b from-white/5 via-white/5 to-transparent pointer-events-none" />
            <div className="hidden lg:block absolute top-0 bottom-0 left-[43%] w-[1px] bg-gradient-to-b from-white/5 via-white/5 to-transparent pointer-events-none" />
            <div className="hidden lg:block absolute top-0 bottom-0 left-[60%] w-[1px] bg-gradient-to-b from-white/5 via-white/5 to-transparent pointer-events-none" />
            <div className="hidden lg:block absolute top-0 bottom-0 left-[77%] w-[1px] bg-gradient-to-b from-white/5 via-white/5 to-transparent pointer-events-none" />

            {/* Column 1: Brand Area (Takes up more space) */}
            <motion.div variants={itemVariants} className="lg:col-span-3 lg:pr-6">
              <div className="flex items-center gap-4 mb-6">
                <img src="/Assets/logo.webp" alt="AI Metaworld" className="w-12 h-12 object-contain" />
                <div className="flex flex-col">
                  <span className="font-serif font-medium text-[20px] tracking-wide text-white uppercase">AI METAWORLD</span>
                  <span className="text-[9px] text-[#ceab7a] tracking-[0.15em] font-medium uppercase">AI Powered Creative Agency</span>
                </div>
              </div>
              
              <p className="text-gray-400 text-[14px] leading-[1.8] mb-8">
                We blend strategy, AI and cinematic design to create premium digital experiences that drive real results.
              </p>

              {/* Social Icons */}
              <div className="flex gap-3">
                {[
                  { name: 'Instagram', href: 'https://instagram.com/ai_metaworld', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg> },
                  { name: 'LinkedIn', href: 'https://www.linkedin.com/in/sohel-shaikhh/', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg> },
                  { name: 'GitHub', href: 'https://github.com/Sohel-shaikh-dev', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.1-.34 6.33-1.55 6.33-6.99 0-1.5-.5-2.77-1.33-3.7.13-.31.5-1.75-.13-3.6 0 0-1-.31-3.3 1.2a11.5 11.5 0 0 0-6 0C7.2 1.69 6.2 2 6.2 2c-.63 1.85-.26 3.29-.13 3.6-1.83 2.1-1.33 3.7-1.33 3.7-5.44.44-6.33 1.65-6.33 6.99 0 1.5.5 2.77 1.33 3.7-.63 1.85.1 3.02 1 3.02v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg> },
                  { name: 'Facebook', href: 'https://www.facebook.com/share/1asBpmQEbw/', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg> },
                  { name: 'YouTube', href: 'https://www.youtube.com/@Aimetaworld', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg> }
                ].map((social) => (
                  <a key={social.name} href={social.href} target="_blank" rel="noreferrer" aria-label={`Visit our ${social.name}`} className="w-11 h-11 rounded-xl border border-white/10 bg-[#0a0a0a] flex items-center justify-center text-gray-400 hover:border-[#ceab7a]/50 hover:text-[#ceab7a] hover:shadow-[0_0_15px_rgba(206,171,122,0.15)] transition-all group">
                     <div className="group-hover:scale-110 transition-transform">
                       {social.icon}
                     </div>
                  </a>
                ))}
              </div>
            </motion.div>

            {/* Column 2: Quick Links */}
            <motion.div variants={itemVariants} className="lg:col-span-2 lg:px-4">
              <h4 className="text-[#ceab7a] text-[12px] font-medium tracking-[0.2em] uppercase mb-8">Quick Links</h4>
              <ul className="flex flex-col gap-4">
                {['Home', 'About Us', 'Services', 'Our Work', 'Process', 'Contact'].map(link => {
                  const id = link === 'Home' ? 'hero' : link === 'About Us' ? 'about' : link === 'Our Work' ? 'work' : link.toLowerCase().replace(' ', '-');
                  return (
                    <li key={link}>
                      <a href={`#${id}`} className="text-gray-400 text-[14px] hover:text-[#ceab7a] transition-colors flex items-center justify-between group py-1">
                        <span>{link}</span>
                        <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                      </a>
                    </li>
                  )
                })}
              </ul>
            </motion.div>

            {/* Column 3: Services */}
            <motion.div variants={itemVariants} className="lg:col-span-2 lg:px-4">
              <h4 className="text-[#ceab7a] text-[12px] font-medium tracking-[0.2em] uppercase mb-8">Services</h4>
              <ul className="flex flex-col gap-4">
                {['Web Design', 'Branding', 'AI Content Creation', 'Power BI Dashboard', 'Business Automation'].map(link => (
                  <li key={link}>
                    <a href="#services" className="text-gray-400 text-[14px] hover:text-[#ceab7a] transition-colors flex items-center justify-between group py-1">
                      <span>{link}</span>
                      <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Column 4: Contact Info */}
            <motion.div variants={itemVariants} className="lg:col-span-2 lg:px-4">
              <h4 className="text-[#ceab7a] text-[12px] font-medium tracking-[0.2em] uppercase mb-8">Contact Info</h4>
              <ul className="flex flex-col gap-5">
                <li className="flex items-center gap-3">
                  <Mail size={16} className="text-[#ceab7a]" />
                  <a href="mailto:aimetaworldd@gmail.com" className="text-gray-400 text-[13px] hover:text-[#ceab7a] transition-colors">aimetaworldd@gmail.com</a>
                </li>
                <li className="flex items-center gap-3">
                  <MessageSquare size={16} className="text-[#ceab7a]" />
                  <a href="tel:+917718938615" className="text-gray-400 text-[13px] hover:text-[#ceab7a] transition-colors">+91 7718938615</a>
                </li>
                <li className="flex items-center gap-3">
                  <MapPin size={16} className="text-[#ceab7a]" />
                  <span className="text-gray-400 text-[13px]">Mumbai, India</span>
                </li>
                <li className="flex items-center gap-3">
                  <Clock size={16} className="text-[#ceab7a]" />
                  <span className="text-gray-400 text-[13px]">Mon - Sat: 10AM - 8PM</span>
                </li>
              </ul>
            </motion.div>

            {/* Column 5: Why Choose Us */}
            <motion.div variants={itemVariants} className="lg:col-span-3 lg:pl-6">
              <h4 className="text-[#ceab7a] text-[12px] font-medium tracking-[0.2em] uppercase mb-8">Why Choose Us</h4>
              <div className="flex flex-col gap-3">
                {[
                  { title: 'Fast Delivery', subtitle: 'On Time, Every Time', icon: <Zap size={16} className="text-[#ceab7a] fill-[#ceab7a]" /> },
                  { title: 'Secure & Reliable', subtitle: 'Your Data is Safe', icon: <ShieldCheck size={16} className="text-[#ceab7a]" /> },
                  { title: 'AI Powered Workflow', subtitle: 'Smart. Fast. Effective.', icon: <Star size={16} className="text-[#ceab7a]" /> },
                  { title: 'Dedicated Support', subtitle: 'We\'re Here For You', icon: <Headphones size={16} className="text-[#ceab7a]" /> },
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-4 p-3.5 rounded-xl border border-white/5 bg-[#0a0a0a] hover:border-[#ceab7a]/30 hover:bg-[#ceab7a]/[0.02] transition-colors group">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      {feature.icon}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-white text-[13px] font-medium">{feature.title}</span>
                      <span className="text-gray-500 text-[11px]">{feature.subtitle}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>

          {/* Stats Bar */}
          <motion.div variants={itemVariants} className="w-full relative rounded-[20px] border border-white/5 bg-[#0a0a0a]/50 overflow-hidden mb-8 p-6 lg:p-8">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#ceab7a]/5 to-transparent pointer-events-none" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 relative z-10">
              {/* Vertical dividers for md and up */}
              <div className="hidden md:block absolute top-0 bottom-0 left-[25%] w-[1px] bg-white/5" />
              <div className="hidden md:block absolute top-0 bottom-0 left-[50%] w-[1px] bg-white/5" />
              <div className="hidden md:block absolute top-0 bottom-0 left-[75%] w-[1px] bg-white/5" />

              {[
                { val: '15+', label: 'Projects Completed', icon: <Rocket size={24} className="text-[#ceab7a]" /> },
                { val: '8+', label: 'Brands Empowered', icon: <Users size={24} className="text-[#ceab7a]" /> },
                { val: '2+', label: 'Years of Experience', icon: <Clock size={24} className="text-[#ceab7a]" /> },
                { val: '24h', label: 'Avg. Response Time', icon: <ShieldCheck size={24} className="text-[#ceab7a]" /> }
              ].map((stat, i) => (
                <div key={i} className="flex flex-col sm:flex-row items-center sm:items-start justify-center md:justify-start gap-4 px-2 lg:px-6">
                  <div className="w-12 h-12 rounded-full border border-[#ceab7a]/20 bg-[#ceab7a]/5 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(206,171,122,0.1)]">
                    {stat.icon}
                  </div>
                  <div className="flex flex-col text-center sm:text-left">
                    <span className="text-[26px] font-sans font-bold text-white leading-tight">{stat.val}</span>
                    <span className="text-[12px] text-gray-500 font-medium tracking-wide uppercase mt-1">{stat.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Bottom Copyright Strip */}
          <motion.div 
            variants={itemVariants}
            className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 relative"
          >
            {/* Glowing line above footer bottom */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[600px] h-[1px] bg-gradient-to-r from-transparent via-[#ceab7a]/50 to-transparent" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-[#ceab7a] rounded-full blur-[8px] opacity-30" />

            <p className="text-gray-500 text-[13px] tracking-wide font-light">
              &copy; {new Date().getFullYear()} AI Metaworld. All rights reserved.
            </p>
            
            <div className="flex items-center gap-6">
              <Link to="/privacy-policy" className="text-gray-500 hover:text-white text-[13px] tracking-wide transition-colors">Privacy Policy</Link>
              <span className="text-gray-800">|</span>
              <Link to="/terms-of-service" className="text-gray-500 hover:text-white text-[13px] tracking-wide transition-colors">Terms & Conditions</Link>
            </div>
          </motion.div>

        </motion.div>

      </div>
    </footer>
  );
}
