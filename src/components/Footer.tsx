import { motion } from 'framer-motion';
import { Mail, Globe, MessageSquare } from 'lucide-react';

export default function Footer() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <footer className="relative bg-[#030303] pt-24 pb-8 overflow-hidden border-t border-white/5">
      {/* Cinematic Fog & Gradients */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top_center,_var(--tw-gradient-stops))] from-gray-800 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#ceab7a]/20 to-transparent" />

      <div className="max-w-[1500px] mx-auto px-6 md:px-12 relative z-10">
        
        {/* Main Footer Layout */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-24"
        >
          
          {/* Left Side: Brand Area (Takes up more space) */}
          <motion.div variants={itemVariants} className="lg:col-span-5 pr-0 lg:pr-12">
            <div className="flex items-center gap-4 mb-6">
              {/* Official Logo */}
              <img 
                src="/Assets/logo.png" 
                alt="AI Metaworld" 
                className="w-12 h-12 object-contain"
              />
              <span className="font-serif font-medium text-[22px] tracking-wide text-white">AI Metaworld</span>
            </div>
            
            <h3 className="text-white text-[18px] md:text-[20px] font-serif leading-[1.4] mb-6">
              Building intelligent digital experiences for modern brands.
            </h3>
            
            <p className="text-gray-400 text-[14px] leading-[1.8] max-w-sm">
              Premium websites, branding systems, AI-powered experiences, and digital growth solutions engineered for success.
            </p>
          </motion.div>

          {/* Center-Left: Navigation */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <h4 className="text-white text-[12px] font-medium tracking-[0.2em] uppercase mb-6 opacity-80">Navigation</h4>
            <ul className="flex flex-col gap-4">
              {['Home', 'About', 'Services', 'Our Work', 'Process', 'Testimonials', 'Contact'].map((item) => (
                <li key={item}>
                  <a href={`#${item.toLowerCase().replace(' ', '-')}`} className="text-gray-400 text-[14px] hover:text-[#ceab7a] transition-colors duration-300 relative group inline-block">
                    {item}
                    <span className="absolute left-0 bottom-[-2px] w-0 h-[1px] bg-[#ceab7a] transition-all duration-300 group-hover:w-full opacity-50" />
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Center-Right: Services */}
          <motion.div variants={itemVariants} className="lg:col-span-3">
            <h4 className="text-white text-[12px] font-medium tracking-[0.2em] uppercase mb-6 opacity-80">Services</h4>
            <ul className="flex flex-col gap-4">
              {['Website Design', 'Branding & Identity', 'AI Fashion Try-On', 'Google Growth', 'Print-On-Demand'].map((item) => (
                <li key={item}>
                  <a href="#services" className="text-gray-400 text-[14px] hover:text-[#ceab7a] transition-colors duration-300 relative group inline-block">
                    {item}
                    <span className="absolute left-0 bottom-[-2px] w-0 h-[1px] bg-[#ceab7a] transition-all duration-300 group-hover:w-full opacity-50" />
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Right Side: Social & Contact */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <h4 className="text-white text-[12px] font-medium tracking-[0.2em] uppercase mb-6 opacity-80">Connect</h4>
            <div className="flex flex-col gap-4">
              {[
                { name: 'WhatsApp', href: 'https://wa.me/917718938615', icon: <MessageSquare size={14} /> },
                { name: 'Email Us', href: 'mailto:aimetaworldd@gmail.com', icon: <Mail size={14} /> },
                { name: 'Instagram', href: 'https://instagram.com/ai_metaworld', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg> },
                { name: 'LinkedIn', href: 'https://www.linkedin.com/in/sohel-shaikhh/', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg> },
                { name: 'GitHub', href: 'https://github.com/Sohel-shaikh-dev', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.1-.34 6.33-1.55 6.33-6.99 0-1.5-.5-2.77-1.33-3.7.13-.31.5-1.75-.13-3.6 0 0-1-.31-3.3 1.2a11.5 11.5 0 0 0-6 0C7.2 1.69 6.2 2 6.2 2c-.63 1.85-.26 3.29-.13 3.6-1.83 2.1-1.33 3.7-1.33 3.7-5.44.44-6.33 1.65-6.33 6.99 0 1.5.5 2.77 1.33 3.7-.63 1.85.1 3.02 1 3.02v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg> },
                { name: 'Facebook', href: 'https://www.facebook.com/share/1asBpmQEbw/', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg> },
                { name: 'YouTube', href: 'https://www.youtube.com/@Aimetaworld', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 7.1A2.5 2.5 0 0 1 5 4.6h14a2.5 2.5 0 0 1 2.5 2.5v9.8a2.5 2.5 0 0 1-2.5 2.5H5a2.5 2.5 0 0 1-2.5-2.5V7.1z"/><path d="m10 15 5-3-5-3v6z"/></svg> },
              ].map((social) => (
                <a key={social.name} href={social.href} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-gray-400 hover:text-[#ceab7a] transition-all duration-300 group">
                  <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-[#ceab7a]/30 group-hover:bg-[#ceab7a]/5 group-hover:shadow-[0_0_15px_rgba(206,171,122,0.15)] transition-all duration-300">
                    <div className="group-hover:scale-110 transition-transform duration-300">
                      {social.icon}
                    </div>
                  </div>
                  <span className="text-[13px] tracking-wide">{social.name}</span>
                </a>
              ))}
            </div>
          </motion.div>

        </motion.div>

        {/* Bottom Copyright Strip */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
          className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <p className="text-gray-500 text-[12px] tracking-wide font-light">
            &copy; {new Date().getFullYear()} AI Metaworld. Crafted With Intelligence.
          </p>
          
          <div className="flex items-center gap-6">
            <a href="#" className="text-gray-500 hover:text-gray-300 text-[12px] tracking-wide transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-500 hover:text-gray-300 text-[12px] tracking-wide transition-colors">Terms of Service</a>
          </div>
        </motion.div>

      </div>
    </footer>
  );
}
