import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Scale, CreditCard, Headphones, MessageSquare } from 'lucide-react';
import { useEffect } from 'react';

export default function TermsOfService() {
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
      title: "Agency Relationship",
      icon: Scale,
      content: "These terms establish the professional framework between you and AI Metaworld. By partnering with us, you agree to these clear, straightforward guidelines designed to ensure a smooth, transparent, and successful collaboration. Our goal is to protect both your brand and our creative process."
    },
    {
      title: "Payments & Project Delivery",
      icon: CreditCard,
      content: "We believe in clear financial milestones. Projects typically require an initial deposit before work commences, with the remaining balance due upon final approval and delivery. All deliverables, timelines, and payment structures will be clearly outlined in your custom project proposal. Once full payment is received, full ownership of the final assets is transferred to you."
    },
    {
      title: "Revisions & Support",
      icon: Headphones,
      content: "Your satisfaction is paramount. Every project includes a defined number of revision rounds to ensure the final product perfectly aligns with your vision. Following project launch, we provide dedicated support to ensure a seamless transition. Extended maintenance and ongoing AI growth services are available as separate retainer packages."
    },
    {
      title: "Contact Information",
      icon: MessageSquare,
      content: "Open communication is the key to our successful partnerships. If you have any questions regarding these terms, your project scope, or general inquiries, our team is always ready to assist. You can reach us via WhatsApp at +91 7718938615 or email us at aimetaworldd@gmail.com."
    }
  ];

  return (
    <div className="min-h-screen bg-[#030303] text-white pt-32 pb-24 px-6 md:px-12 relative overflow-hidden">
      {/* Cinematic Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#ceab7a] opacity-[0.03] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-white opacity-[0.01] blur-[150px] pointer-events-none" />
      
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
            <span className="text-[11px] font-medium text-[#ceab7a] tracking-[0.2em] uppercase">Professional Guidelines</span>
          </div>
          <h1 className="text-[40px] md:text-[56px] font-sans font-bold text-white mb-6 leading-tight">
            Terms of <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e8d3b5] to-[#a8824a]">Service.</span>
          </h1>
          <p className="text-gray-400 text-[16px] leading-[1.8] max-w-2xl">
            Clear, straightforward, and fair guidelines establishing the foundation for a successful and transparent creative partnership.
          </p>
        </motion.div>

        {/* Content Cards */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
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

      </div>
    </div>
  );
}
