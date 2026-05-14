import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight } from 'lucide-react';
import { cn } from '../utils';

export default function Navbar({ isLoading = false }: { isLoading?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [activeSection, setActiveSection] = useState('home');

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace('#', '');
    const el = document.getElementById(targetId);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: top - 80, behavior: 'smooth' }); // -80px to account for fixed navbar
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      
      const sections = ['home', 'about', 'services', 'work', 'process', 'whyus', 'testimonials', 'contact'];
      let current = 'home';
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          // Use getBoundingClientRect to get absolute position in document regardless of parent relative positioning
          const topPosition = el.getBoundingClientRect().top + window.scrollY;
          if (window.scrollY >= topPosition - 300) {
            current = section;
          }
        }
      }
      setActiveSection(current);
    };
    window.addEventListener('scroll', handleScroll);
    // Call once to set initial state
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home', active: activeSection === 'home' },
    { name: 'About', href: '#about', active: activeSection === 'about' },
    { name: 'Services', href: '#services', active: activeSection === 'services' },
    { name: 'Work', href: '#work', active: activeSection === 'work' },
    { name: 'Process', href: '#process', active: activeSection === 'process' },
    { name: 'Why Us', href: '#whyus', active: activeSection === 'whyus' },
    { name: 'Reviews', href: '#testimonials', active: activeSection === 'testimonials' },
    { name: 'Contact', href: '#contact', active: activeSection === 'contact' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'fixed top-0 left-0 w-full z-50 transition-all duration-300',
        scrolled ? 'bg-[#050505]/90 backdrop-blur-md py-4 shadow-premium' : 'bg-transparent py-8'
      )}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        
        {/* Logo */}
        <motion.a 
          layoutId="brand-container" 
          href="#home" 
          onClick={(e) => handleScrollTo(e, '#home')}
          className="flex items-center gap-3 group"
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-center justify-center">
            <motion.img 
              layoutId="brand-icon"
              src="/Assets/logo.png" 
              alt="AI Metaworld" 
              className="w-10 h-10 md:w-11 md:h-11 object-contain"
            />
          </div>
          <motion.span 
            layoutId="brand-text"
            className="font-medium text-[17px] tracking-tight text-white"
          >
            AI Metaworld
          </motion.span>
        </motion.a>

        {/* Desktop Nav */}
        <motion.div 
          className="hidden lg:flex items-center gap-6 xl:gap-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoading ? 0 : 1 }}
          transition={{ duration: 1, delay: isLoading ? 0 : 0.6 }}
        >
          <div className="flex items-center gap-4 xl:gap-6">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleScrollTo(e, link.href)}
                className={cn(
                  "text-[13px] font-normal transition-colors relative pb-1.5 whitespace-nowrap",
                  link.active ? "text-white" : "text-gray-300 hover:text-white"
                )}
              >
                {link.name}
                {link.active && (
                  <span className="absolute bottom-0 left-0 w-full h-[1px] bg-white"></span>
                )}
              </a>
            ))}
          </div>
          <a
            href="#contact"
            onClick={(e) => handleScrollTo(e, '#contact')}
            className="flex items-center gap-2 px-6 py-2.5 border border-white/20 bg-transparent text-white font-normal text-[14px] rounded-full hover:bg-white/10 transition-colors"
          >
            Let's Talk <ArrowRight size={14} className="ml-1" />
          </a>
        </motion.div>

        {/* Mobile Menu Button */}
        <motion.button
          className="md:hidden text-white p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoading ? 0 : 1 }}
          transition={{ duration: 1, delay: isLoading ? 0 : 0.6 }}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </motion.button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#050505] border-b border-gray-800 overflow-hidden"
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "text-lg font-medium transition-colors",
                    link.active ? "text-white" : "text-gray-400 hover:text-white"
                  )}
                  onClick={(e) => {
                    handleScrollTo(e, link.href);
                    setMobileMenuOpen(false);
                  }}
                >
                  {link.name}
                </a>
              ))}
              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2 mt-2 px-6 py-3 border border-white/20 bg-transparent text-white font-medium rounded-full"
                onClick={(e) => {
                  handleScrollTo(e, '#contact');
                  setMobileMenuOpen(false);
                }}
              >
                Let's Talk <ArrowRight size={16} />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
