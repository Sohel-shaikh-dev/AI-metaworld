import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Lock, Eye, Mail, MessageSquare, Globe, RefreshCw } from 'lucide-react';
import { useEffect } from 'react';

export default function PrivacyPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const sections = [
    {
      title: "Data Collection & Transparency",
      icon: Eye,
      content: "At AI Metaworld, we value your privacy. We only collect the necessary information required to deliver our premium digital services, such as your name, email, and project requirements. We believe in complete transparency—your data is never collected without your explicit consent."
    },
    {
      title: "How We Use Your Information",
      icon: Lock,
      content: "The information we gather is used strictly to enhance your experience. It allows us to tailor our AI-powered solutions to your specific needs, facilitate smooth project communication, and continuously improve our service delivery. Your data is never sold or shared with third-party marketers."
    },
    {
      title: "Enterprise-Grade Security",
      icon: ShieldCheck,
      content: "We employ industry-standard security protocols to protect your sensitive information. From secure data storage to encrypted communications, our digital infrastructure is designed to keep your intellectual property and personal details completely secure at all times."
    },
    {
      title: "Policy Updates",
      icon: RefreshCw,
      content: "As we continuously evolve and integrate new AI technologies, our privacy practices may occasionally update. We encourage you to review this policy periodically. Your continued partnership with AI Metaworld signifies your acceptance of our commitment to data protection."
    }
  ];

  return (
    <div className="min-h-screen bg-[#030303] text-white pt-32 pb-24 px-6 md:px-12 relative overflow-hidden">
      {/* Cinematic Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#ceab7a] opacity-[0.03] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-white opacity-[0.01] blur-[150px] pointer-events-none" />
      
      <div className="max-w-[800px] mx-auto relative z-10">
        
        {/* Back Button */}
        <Link to="/" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/10 bg-white/[0.02] hover:bg-[#ceab7a]/10 hover:border-[#ceab7a]/40 text-gray-400 hover:text-[#ceab7a] transition-all duration-300 mb-12 group backdrop-blur-sm">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="text-[13px] font-medium tracking-wide">Back to Home</span>
        </Link>

        {/* Hero Heading */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-[1px] bg-[#ceab7a]" />
            <span className="text-[11px] font-medium text-[#ceab7a] tracking-[0.2em] uppercase">Trust & Transparency</span>
          </div>
          <h1 className="text-[40px] md:text-[56px] font-sans font-bold text-white mb-6 leading-tight">
            Privacy <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e8d3b5] to-[#a8824a]">Policy.</span>
          </h1>
          <p className="text-gray-400 text-[16px] leading-[1.8] max-w-2xl">
            We are committed to safeguarding your privacy and ensuring your digital assets are handled with the highest level of confidentiality and security.
          </p>
        </motion.div>

        {/* Content Cards */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6 mb-16"
        >
          {sections.map((section, idx) => (
            <motion.div 
              key={idx} 
              variants={itemVariants}
              className="p-8 md:p-10 rounded-[24px] border border-white/5 bg-[#0a0a0a]/50 backdrop-blur-xl hover:border-[#ceab7a]/20 transition-colors duration-500 group"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 rounded-full bg-[#ceab7a]/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500">
                  <section.icon size={18} className="text-[#ceab7a]" />
                </div>
                <h3 className="text-[20px] font-serif text-white tracking-wide">{section.title}</h3>
              </div>
              <p className="text-gray-400 text-[15px] leading-[1.8] pl-0 md:pl-14">
                {section.content}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Custom Contact Section for Privacy Policy */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="p-8 md:p-10 rounded-[24px] border border-[#ceab7a]/20 bg-gradient-to-br from-[#ceab7a]/5 to-transparent backdrop-blur-xl relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#ceab7a]/10 via-transparent to-transparent pointer-events-none" />
          
          <h3 className="text-[24px] font-serif text-white mb-4 relative z-10">Have questions about your data?</h3>
          <p className="text-gray-400 text-[15px] mb-8 max-w-lg relative z-10">
            Our dedicated team is available to address any privacy concerns or data requests. Reach out to us anytime.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 relative z-10">
            <div className="flex items-center gap-3">
              <Mail size={16} className="text-[#ceab7a]" />
              <a href="mailto:aimetaworldd@gmail.com" className="text-white text-[14px] hover:text-[#ceab7a] transition-colors">aimetaworldd@gmail.com</a>
            </div>
            <div className="flex items-center gap-3">
              <MessageSquare size={16} className="text-[#ceab7a]" />
              <a href="https://wa.me/917718938615" target="_blank" rel="noreferrer" className="text-white text-[14px] hover:text-[#ceab7a] transition-colors">+91 7718938615</a>
            </div>
            <div className="flex items-center gap-3">
              <Globe size={16} className="text-[#ceab7a]" />
              <span className="text-gray-400 text-[14px]">Worldwide Availability</span>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
