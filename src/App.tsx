import { useState, useEffect, lazy, Suspense } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Preloader from './components/Preloader';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import SEO from './components/SEO';

// Lazy loaded components for performance
const Services = lazy(() => import('./components/Services'));
const Portfolio = lazy(() => import('./components/Portfolio'));
const WhyChooseUs = lazy(() => import('./components/WhyChooseUs'));
const Process = lazy(() => import('./components/Process'));
const Contact = lazy(() => import('./components/Contact'));
const Footer = lazy(() => import('./components/Footer'));

function App() {
  const [loading, setLoading] = useState(true);

  // Lock scroll during preloader
  useEffect(() => {
    if (loading) {
      document.body.style.overflow = 'hidden';
      window.scrollTo(0, 0);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [loading]);
  return (
    <div className="bg-[#050505] min-h-screen text-white w-full font-sans relative z-0">
      <SEO />
      
      <AnimatePresence mode="wait">
        {loading && <Preloader onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      <Navbar isLoading={loading} />
      
      <motion.main 
        className="relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: loading ? 0 : 1, 
          y: loading ? 20 : 0
        }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: loading ? 0 : 0.2 }}
      >
        {/* Sections */}
        <div className="relative z-10 w-full flex flex-col bg-[#050505]">
          <Hero />
          <About />
        </div>

        {/* Normal Scrolling Sections */}
        <div className="relative z-20 bg-[#050505]">
          <Suspense fallback={<div className="h-screen bg-[#050505]" />}>
            <Services />
            <Portfolio />
            <Process />
            <WhyChooseUs />
            <Contact />
          </Suspense>
        </div>
      </motion.main>

      <motion.div 
        className="relative z-20 bg-[#050505]"
        initial={{ opacity: 0 }}
        animate={{ opacity: loading ? 0 : 1 }}
        transition={{ duration: 1, delay: loading ? 0 : 0.4 }}
      >
        <Suspense fallback={<div className="h-64 bg-[#050505]" />}>
          <Footer />
        </Suspense>
      </motion.div>

      {!loading && <FloatingWhatsApp />}
    </div>
  );
}

export default App;
