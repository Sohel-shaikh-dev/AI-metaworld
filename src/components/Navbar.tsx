import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, Rocket, 
  Home, User, LayoutGrid, Briefcase, Settings, Mail, Zap
} from 'lucide-react';
import { getSocialIcon } from './SocialIcons';
import { cn } from '../utils';
import { useSettings } from '../contexts/SettingsContext';
import { navigateToSection } from '../hooks/useNavigation';

export default function Navbar({ isLoading = false }: { isLoading?: boolean }) {
  const { settings } = useSettings();
  const { brand_settings, contact_settings, social_settings } = settings;

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [activeSection, setActiveSection] = useState('home');

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // Always close mobile menu instantly
    setMobileMenuOpen(false);
    document.body.style.overflow = ''; // Guarantee scroll unlock
    
    // Delegate to central navigation manager
    navigateToSection(e, href);
  };

  useEffect(() => {
    const handleCloseMenu = () => {
      setMobileMenuOpen(false);
      document.body.style.overflow = '';
    };
    window.addEventListener('close-mobile-menu', handleCloseMenu);
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      
      const sections = ['home', 'about', 'services', 'work', 'process', 'contact'];
      let current = 'home';
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const topPosition = el.getBoundingClientRect().top + window.scrollY;
          if (window.scrollY >= topPosition - 300) {
            current = section;
          }
        }
      }
      setActiveSection(current);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('close-mobile-menu', handleCloseMenu);
    };
  }, []);

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { name: 'Home', href: '#home', active: activeSection === 'home', icon: Home },
    { name: 'About Us', href: '#about', active: activeSection === 'about', icon: User },
    { name: 'Services', href: '#services', active: activeSection === 'services', icon: LayoutGrid },
    { name: 'Our Work', href: '#work', active: activeSection === 'work', icon: Briefcase },
    { name: 'Process', href: '#process', active: activeSection === 'process', icon: Settings },
    { name: 'Contact', href: '#contact', active: activeSection === 'contact', icon: Mail },
  ];

  const activeSocials = social_settings.filter(s => s.active).sort((a, b) => a.order - b.order);

  return (
    <>
      <motion.nav
        initial={{ y: -100, x: '-50%', opacity: 0 }}
        animate={{ y: isLoading ? -100 : 0, x: '-50%', opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: isLoading ? 0 : 0.2 }}
        className={cn(
          'fixed left-1/2 w-[96%] sm:w-[95%] max-w-[1200px] z-[100] transition-all duration-500 rounded-full flex items-center justify-between',
          scrolled 
            ? 'top-4 bg-[#050505]/80 backdrop-blur-xl border border-[#ceab7a]/40 shadow-[0_10px_30px_rgba(0,0,0,0.8)] py-2.5 px-4 md:px-6' 
            : 'top-6 bg-[#0a0a0a]/60 backdrop-blur-md border border-[#ceab7a]/20 shadow-[0_10px_40px_rgba(0,0,0,0.5)] py-3 px-4 md:px-6'
        )}
      >
        {/* Logo Section */}
        <motion.a 
          href="#home" 
          onClick={(e) => handleScrollTo(e, '#home')}
          className="flex items-center gap-3 group shrink-0"
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-center justify-center pt-1">
            <span className="text-[#ceab7a] font-bold text-[32px] md:text-[36px] italic font-serif leading-none pr-1 tracking-tight">Ai</span>
          </div>
          <div className="flex flex-col justify-center">
            <motion.span 
              className="font-medium text-[15px] md:text-[16px] tracking-wide text-white uppercase leading-none mb-1.5"
            >
              {brand_settings.brandName}
            </motion.span>
            <span className="text-[#ceab7a] text-[7.5px] md:text-[8px] tracking-[0.18em] uppercase font-bold leading-none opacity-90">
              {brand_settings.tagline}
            </span>
          </div>
        </motion.a>

        {/* Desktop Links (Center) */}
        <motion.div 
          className="hidden xl:flex items-center absolute left-1/2 -translate-x-1/2 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoading ? 0 : 1 }}
          transition={{ duration: 1, delay: isLoading ? 0 : 0.6 }}
        >
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleScrollTo(e, link.href)}
              className={cn(
                "text-[14px] font-medium transition-colors relative py-2 whitespace-nowrap flex items-center gap-1.5 group",
                link.active ? "text-[#ceab7a]" : "text-gray-300 hover:text-white"
              )}
            >
              <span className="group-hover:text-white transition-colors">{link.name}</span>
              
              {/* Active Gold Underline Indicator */}
              {link.active && (
                <motion.span 
                  layoutId="active-nav-glow"
                  className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-[2px] bg-[#ceab7a] rounded-full shadow-[0_0_10px_rgba(206,171,122,1)]"
                />
              )}
            </a>
          ))}
        </motion.div>

        {/* Right Actions Area */}
        <div className="flex items-center gap-4 shrink-0">
          
          {/* Start Project CTA (Tablet & Desktop) */}
          <a
            href="#contact"
            onClick={(e) => handleScrollTo(e, '#contact')}
            className="hidden sm:flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#e8d3b5] via-[#ceab7a] to-[#a8824a] text-black font-bold text-[14px] tracking-wide rounded-lg shadow-[0_0_20px_rgba(206,171,122,0.2)] hover:shadow-[0_0_25px_rgba(206,171,122,0.5)] transition-all hover:-translate-y-0.5 active:scale-95"
          >
            <Rocket size={16} strokeWidth={2.5} className="mr-0.5" /> Start Project
          </a>

          {/* Hamburger Menu Button */}
          <motion.button
            aria-label="Open Mobile Menu"
            className="xl:hidden flex items-center justify-center w-[42px] h-[42px] border border-white/15 rounded-xl text-white hover:bg-white/5 hover:border-white/30 transition-all xl:ml-2"
            onClick={() => setMobileMenuOpen(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Menu size={20} strokeWidth={2} />
          </motion.button>
        </div>
      </motion.nav>

      {/* Full Screen Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 bg-[#030303] z-[200] flex flex-col p-6 sm:p-8 overflow-y-auto"
          >
            {/* Ambient Background Glow */}
            <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#ceab7a] opacity-[0.03] blur-[100px] pointer-events-none rounded-full" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#ceab7a] opacity-[0.03] blur-[100px] pointer-events-none rounded-full" />

            {/* Header */}
            <div className="flex items-center justify-between mb-12 mt-2 relative z-10">
              <div className="flex items-center gap-3 group">
                <div className="flex items-center justify-center pt-1">
                  <span className="text-[#ceab7a] font-bold text-[32px] italic font-serif leading-none pr-1 tracking-tight">Ai</span>
                </div>
                <div className="flex flex-col justify-center">
                  <span className="font-medium text-[16px] tracking-wide text-white uppercase leading-none mb-1.5">
                    {brand_settings.brandName}
                  </span>
                  <span className="text-[#ceab7a] text-[8px] tracking-[0.18em] uppercase font-bold leading-none opacity-90">
                    {brand_settings.tagline}
                  </span>
                </div>
              </div>

              <motion.button
                aria-label="Close Mobile Menu"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center w-11 h-11 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <X size={22} strokeWidth={1.5} />
              </motion.button>
            </div>

            {/* Navigation Links */}
            <div className="flex flex-col gap-2 flex-1 relative z-10 max-w-md mx-auto w-full">
              {navLinks.map((link, i) => {
                const Icon = link.icon;
                return (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + (i * 0.05), duration: 0.4, ease: "easeOut" }}
                    className={cn(
                      "flex items-center justify-between group py-4 px-2 rounded-xl transition-colors",
                      link.active ? "bg-white/[0.03]" : "hover:bg-white/[0.02]"
                    )}
                    onClick={(e) => {
                      handleScrollTo(e, link.href);
                    }}
                  >
                    <div className="flex items-center gap-5">
                      <Icon 
                        size={22} 
                        className={link.active ? "text-[#ceab7a]" : "text-gray-500 group-hover:text-[#ceab7a] transition-colors"} 
                        strokeWidth={1.5} 
                      />
                      <span 
                        className={cn(
                          "text-[18px] tracking-wide transition-colors",
                          link.active ? "text-white font-semibold" : "text-gray-300 font-medium group-hover:text-white"
                        )}
                      >
                        {link.name}
                      </span>
                    </div>
                    
                  </motion.a>
                );
              })}
            </div>

            {/* Footer Area (Socials & CTA) */}
            <motion.div 
              className="mt-10 flex flex-col items-center gap-8 relative z-10 pb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <div className="flex flex-col items-center gap-5 w-full">
                <span className="text-[#ceab7a] text-[13px] font-semibold tracking-widest uppercase">Stay Connected</span>
                
                <div className="flex items-center gap-4">
                  {activeSocials.map((social) => {
                    const SIcon = getSocialIcon(social.iconName);
                    return (
                      <a 
                        key={social.id} 
                        href={social.url} 
                        target="_blank" 
                        rel="noreferrer"
                        aria-label={social.platform}
                        className="flex items-center justify-center w-12 h-12 rounded-xl border border-white/10 text-gray-400 hover:border-[#ceab7a]/50 hover:text-[#ceab7a] hover:bg-[#ceab7a]/5 transition-all hover:-translate-y-1"
                      >
                        <SIcon size={18} strokeWidth={2} />
                      </a>
                    );
                  })}
                </div>
              </div>

              <div className="w-full max-w-md mx-auto flex flex-col items-center gap-4 mt-2">
                <a
                  href="#contact"
                  className="w-full flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-[#e8d3b5] via-[#ceab7a] to-[#a8824a] text-black font-bold text-[16px] tracking-wide rounded-xl shadow-[0_0_30px_rgba(206,171,122,0.25)] active:scale-95 transition-all"
                  onClick={(e) => handleScrollTo(e, '#contact')}
                >
                  <Rocket size={18} strokeWidth={2.5} /> Start Your Project
                </a>

                <div className="flex items-center gap-2">
                  <span className="text-gray-400 text-[13px] font-medium tracking-wide">
                    {contact_settings.responseTime.includes('usually') ? contact_settings.responseTime : `Usually replies ${contact_settings.responseTime}`}
                  </span>
                  <Zap size={14} className="text-[#ceab7a] fill-[#ceab7a]/20" strokeWidth={1.5} />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
