import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { 
  Mail, MessageSquare, MapPin, Clock, Zap, ChevronRight, 
  Rocket, ShieldCheck, Users, Headphones, Star, ArrowRight,
  Link as LinkIcon, BriefcaseBusiness, Smartphone, Calendar
} from 'lucide-react';
import { getSocialIcon } from './SocialIcons';
import { Link } from 'react-router-dom';

import { useSettings } from '../contexts/SettingsContext';
import { navigateToSection } from '../hooks/useNavigation';

const StatIconMap: Record<string, any> = {
  Link: LinkIcon, Rocket, Star, Calendar, Zap, BriefcaseBusiness, Users, Clock, Smartphone
};

export default function Footer() {
  const { settings } = useSettings();
  const { brand_settings, contact_settings, footer_settings, social_settings, stats_settings } = settings;
  const activeSocials = social_settings.filter(s => s.active).sort((a, b) => a.order - b.order);
  const activeStats = stats_settings.filter(s => s.active).sort((a, b) => a.order - b.order);
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
          viewport={{ once: true }}
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
               <h2 className="text-[32px] md:text-[44px] lg:text-[48px] font-sans font-bold text-white mb-4 leading-[1.1] whitespace-pre-line">
                 {footer_settings.ctaHeading.replace(/\\n/g, '\n')} <br/>
                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e8d3b5] to-[#a8824a] whitespace-pre-line">{footer_settings.ctaHighlight.replace(/\\n/g, '\n')}</span>
               </h2>
               <p className="text-gray-400 text-[15px] leading-relaxed mb-8 max-w-[400px]">
                 {footer_settings.ctaDescription}
               </p>
               <div className="flex flex-col sm:flex-row gap-4 mb-6">
                 <a href="#contact" className="px-6 py-3.5 bg-gradient-to-r from-[#e8d3b5] to-[#ceab7a] hover:from-[#f0dfc8] hover:to-[#e8d3b5] text-black rounded-xl font-medium text-[15px] transition-all flex items-center justify-center gap-3 group">
                   <Rocket size={18} />
                   Start Your Project
                   <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                 </a>
                 <a href={`https://wa.me/${contact_settings.whatsapp}`} target="_blank" rel="noreferrer" className="px-6 py-3.5 border border-white/10 hover:border-[#ceab7a]/50 text-white rounded-xl font-medium text-[15px] transition-all flex items-center justify-center gap-3 hover:bg-white/5 group">
                   <MessageSquare size={18} className="text-[#ceab7a] group-hover:scale-110 transition-transform" />
                   Chat on WhatsApp
                 </a>
               </div>
               <p className="text-gray-500 text-[13px] flex items-center gap-2 justify-center sm:justify-start w-full sm:w-auto">
                 {contact_settings.responseTime.includes('usually') ? contact_settings.responseTime : `Usually replies ${contact_settings.responseTime}`} <Zap size={12} className="text-[#ceab7a] fill-[#ceab7a]" />
               </p>
            </div>
            
            <div className="w-full lg:w-[45%] relative mt-12 lg:mt-0 flex justify-center lg:justify-end">
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#ceab7a] rounded-full blur-[100px] opacity-10 pointer-events-none" />
               <img src={footer_settings.ctaImageUrl || "/Assets/cta_agency_composition.jpg"} alt="Ready to start CTA" className="w-full max-w-[320px] lg:max-w-[400px] object-cover rounded-2xl drop-shadow-[0_0_30px_rgba(206,171,122,0.3)] relative z-10" />
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
                <img src={brand_settings.logoUrl || "/Assets/logo.webp"} alt={brand_settings.brandName || "Logo"} className="w-12 h-12 object-contain" />
                <div className="flex flex-col">
                  <span className="font-serif font-medium text-[20px] tracking-wide text-white uppercase">{brand_settings.brandName}</span>
                  <span className="text-[9px] text-[#ceab7a] tracking-[0.15em] font-medium uppercase">{brand_settings.tagline}</span>
                </div>
              </div>
              
              <p className="text-gray-400 text-[14px] leading-[1.8] mb-8">
                {footer_settings.description}
              </p>

              {/* Social Icons */}
              <div className="flex items-center gap-3">
                {activeSocials.map((social) => {
                  const SIcon = getSocialIcon(social.iconName);
                  return (
                    <a key={social.id} href={social.url} target="_blank" rel="noreferrer" aria-label={social.platform} className="w-11 h-11 rounded-xl border border-white/10 bg-[#0a0a0a] flex items-center justify-center text-gray-400 hover:border-[#ceab7a]/50 hover:text-[#ceab7a] hover:shadow-[0_0_15px_rgba(206,171,122,0.15)] transition-all group">
                     <div className="group-hover:scale-110 transition-transform">
                       <SIcon size={16} strokeWidth={2} />
                     </div>
                  </a>
                )})}
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
                      <a href={`#${id}`} onClick={(e) => navigateToSection(e, `#${id}`)} className="text-gray-400 text-[14px] hover:text-[#ceab7a] transition-colors flex items-center justify-between group py-1">
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
                  <a href={`mailto:${contact_settings.email}`} className="text-gray-400 text-[13px] hover:text-[#ceab7a] transition-colors">{contact_settings.email}</a>
                </li>
                <li className="flex items-center gap-3">
                  <MessageSquare size={16} className="text-[#ceab7a]" />
                  <a href={`https://wa.me/${contact_settings.whatsapp}`} className="text-gray-400 text-[13px] hover:text-[#ceab7a] transition-colors">+{contact_settings.whatsapp}</a>
                </li>
                  <li>
                    <a 
                      href={contact_settings.mapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact_settings.address)}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center gap-3 group/location cursor-pointer hover:bg-white/[0.02] p-1.5 -ml-1.5 rounded-lg transition-colors focus:outline-none focus:ring-1 focus:ring-[#ceab7a]/30"
                      aria-label={`View ${contact_settings.address} on Google Maps`}
                    >
                      <MapPin size={16} className="text-[#ceab7a] shrink-0" />
                      <span className="text-gray-400 text-[13px] group-hover/location:text-[#ceab7a]/80 transition-colors">{contact_settings.address}</span>
                    </a>
                  </li>
                <li className="flex items-center gap-3">
                  <Clock size={16} className="text-[#ceab7a]" />
                  <span className="text-gray-400 text-[13px]">{contact_settings.workingHours}</span>
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

              {activeStats.map((stat) => {
                const SIcon = StatIconMap[stat.iconName] || Star;
                return (
                  <div key={stat.id} className="relative group flex flex-col sm:flex-row items-center sm:items-start justify-center md:justify-start gap-4 px-2 lg:px-6">
                  <div className="w-12 h-12 rounded-full border border-[#ceab7a]/20 bg-[#ceab7a]/5 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(206,171,122,0.1)]">
                    <SIcon size={24} className="text-[#ceab7a]" />
                  </div>
                  <div className="flex flex-col text-center sm:text-left">
                    <span className="text-[26px] font-sans font-bold text-white leading-tight">{stat.value}</span>
                    <span className="text-[12px] text-gray-500 font-medium tracking-wide uppercase mt-1 whitespace-pre-line">{stat.label}</span>
                  </div>
                </div>
              )})}
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
              &copy; {new Date().getFullYear()} {brand_settings.brandName}. All rights reserved.
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
