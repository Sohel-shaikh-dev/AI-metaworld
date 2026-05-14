import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Portfolio from './components/Portfolio';
import WhyChooseUs from './components/WhyChooseUs';
import Process from './components/Process';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ScrollyBackground from './components/ScrollyBackground';
import Preloader from './components/Preloader';
import FloatingWhatsApp from './components/FloatingWhatsApp';

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
      <AnimatePresence mode="wait">
        {loading && <Preloader onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      <Navbar isLoading={loading} />
      
      <motion.main 
        className="relative z-10"
        initial={{ opacity: 0, filter: 'blur(10px)', y: 20 }}
        animate={{ 
          opacity: loading ? 0 : 1, 
          filter: loading ? 'blur(10px)' : 'blur(0px)',
          y: loading ? 20 : 0
        }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: loading ? 0 : 0.2 }}
      >
        {/* Scrollytelling Section Wrapper */}
        <div className="relative w-full">
          {/* Sticky Background limited to Hero and About */}
          <div className="sticky top-0 h-screen w-full z-0 overflow-hidden">
            <ScrollyBackground />
          </div>
          
          {/* Content that scrolls OVER the sticky background */}
          <div className="relative z-10 -mt-[100vh]">
            <Hero />
            <About />
          </div>
        </div>

        {/* Normal Scrolling Sections */}
        <div className="relative z-20 bg-[#050505]">
          <Services />
          <Portfolio />
          <Process />
          <WhyChooseUs />
          <Testimonials />
          <Contact />
        </div>
      </motion.main>

      <motion.div 
        className="relative z-20 bg-[#050505]"
        initial={{ opacity: 0 }}
        animate={{ opacity: loading ? 0 : 1 }}
        transition={{ duration: 1, delay: loading ? 0 : 0.4 }}
      >
        <Footer />
      </motion.div>

      {!loading && <FloatingWhatsApp />}
    </div>
  );
}

export default App;
