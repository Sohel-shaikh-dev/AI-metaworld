import { useState, useEffect, memo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { X, ExternalLink, ArrowRight, Monitor, BarChart2, Rocket, Image as ImageIcon, ShoppingBag, Briefcase, Users, Clock, CheckCircle, ChevronLeft } from 'lucide-react';
import CinematicTypewriter from './CinematicTypewriter';
import { supabase } from '../lib/supabase';

type ProjectModalContent = {
      projectBrief?: string;
      productInputs?: string[];
      campaignVisuals?: string[];
      clientName?: string;
      liveUrl?: string;
      githubUrl?: string;
      businessProblem?: string;
      solution?: string;
      keyInsights?: string[];
      deliverables?: string[];
    heroLaptop?: string;
    desktopScreens?: string[];
    mobileScreens?: string[];
    logos?: string[];
    mockups?: string[];
    transformations?: { before: string; after: string }[];
      metrics?: { label: string; value: string; trend?: string; description?: string }[];
    dashboards?: string[];
    products?: any[];
    designConcept?: string;
    projectStatus?: string;
    overview?: string;
    goal?: string;
    approach?: string;
    experience?: string;
    mainImage?: string;
    videoUrl?: string;
    supportingImages?: string[];
    technologies?: string[];
    
    // New Branding Fields
    brandOverview?: string;
    brandChallenge?: string;
    brandDirection?: string;
    result?: string;
    colors?: { id: string; name: string; hex: string }[];
    typography?: { primary?: string; secondary?: string; accent?: string };
    brandingAssets?: {
      id: string;
      category: string;
      type: string;
      url: string;
      caption?: string;
      showcase?: boolean;
    }[];
  };

type Project = {
  id: string | number;
  type: 'website' | 'branding' | 'fashion' | 'growth' | 'pod';
  category: string;
  title: string;
  desc: string;
  image: string;
  content: ProjectModalContent;
  tags?: string[];
  created_at?: string;
};

const CATEGORIES = [
  { id: 'website', title: 'WEBSITE', desc: 'Web design, development and digital experiences', icon: Monitor, image: '/Assets/service_web.webp' },
  { id: 'branding', title: 'BRANDING & IDENTITY', desc: 'Brand identities, visual systems and creative design', icon: Rocket, image: '/Assets/service_branding.webp' },
  { id: 'fashion', title: 'AI FASHION TRY-ON', desc: 'Product visualization, model-based fashion content and campaign visuals', icon: ImageIcon, image: '/Assets/service_aifashion_v2.webp' },
  { id: 'growth', title: 'POWER BI DATA ANALYSIS', desc: 'Interactive dashboards and business intelligence solutions', icon: BarChart2, image: '/Assets/service_powerbi_v2.webp' },
  { id: 'pod', title: 'PRINT-ON-DEMAND', desc: 'Custom printed products and personalized merchandise', icon: ShoppingBag, image: '/Assets/service_pod_v3.webp' }
];


const BrandAssetGallery = ({ assets, title, category, compact = false }: { assets: any[], title?: string, category: string, compact?: boolean }) => {
  if (!assets || assets.length === 0) return null;
  
  // Responsive grid logic based on asset count and category
  let gridClass = "grid grid-cols-1 gap-6";
  
  if (category === 'icon') {
    gridClass = assets.length <= 2 ? "flex justify-center gap-6" : "grid grid-cols-2 sm:grid-cols-4 gap-6";
  } else if (assets.length === 1) {
    gridClass = "flex justify-center";
  } else if (assets.length === 2) {
    gridClass = "grid grid-cols-1 sm:grid-cols-2 gap-6";
  } else if (assets.length === 3) {
    gridClass = "grid grid-cols-1 sm:grid-cols-3 gap-6 items-center";
  } else if (assets.length === 4) {
    gridClass = "grid grid-cols-1 sm:grid-cols-2 gap-6";
  } else if (assets.length >= 5) {
    gridClass = "columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6";
  }

  return (
    <div className={`space-y-6 ${compact ? 'pt-4' : 'pt-10'}`}>
      {title && (
        <h4 className="text-[12px] uppercase tracking-[0.2em] text-[#ceab7a] font-semibold flex items-center gap-3">
          <div className="w-8 h-[1px] bg-[#ceab7a]/30" /> {title}
        </h4>
      )}
      <div className={gridClass}>
        {assets.map((asset, i) => {
           // Decide image fit. Photographic mockups can be cover. Logos/Print are contain.
           let objectFit = "object-contain";
           if (category === 'packaging' && asset.type?.toLowerCase().includes('mockup')) {
               objectFit = "object-cover";
           }
           
           const isMasonry = assets.length >= 5 && category !== 'icon';
           
           return (
             <motion.div 
               initial={{ opacity: 0, y: 20 }} 
               whileInView={{ opacity: 1, y: 0 }} 
               viewport={{ once: true }} 
               transition={{ delay: (i % 5) * 0.1 }} 
               key={asset.id || i} 
               className={`rounded-2xl overflow-hidden border border-white/5 bg-[#050505] flex flex-col items-center justify-center relative group
                  ${isMasonry ? 'break-inside-avoid mb-6' : ''} 
                  ${assets.length === 1 && category !== 'icon' ? 'w-full max-w-4xl mx-auto' : 'w-full h-full'}
                  ${category === 'logo' || category === 'icon' ? 'p-6 md:p-12' : 'p-2 md:p-4'}
               `}
             >
               <img onError={(e) => { e.currentTarget.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22400%22%20height%3D%22300%22%20style%3D%22background%3A%230a0a0a%22%3E%3Ctext%20fill%3D%22%23444%22%20x%3D%2250%25%22%20y%3D%2250%25%22%20font-family%3D%22sans-serif%22%20font-size%3D%2214%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3EImage%20Unavailable%3C%2Ftext%3E%3C%2Fsvg%3E'; e.currentTarget.onerror = null; }} 
                 src={asset.url || asset} 
                 alt={asset.caption || asset.type || category} 
                 className={`w-full ${category === 'icon' ? 'max-w-[80px]' : 'max-h-[80vh]'} ${objectFit} group-hover:scale-[1.02] transition-transform duration-700`} 
                 loading="lazy" 
               />
               {(asset.type || asset.caption) && category !== 'icon' && category !== 'logo' && (
                 <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                   {asset.type && <span className="text-[#ceab7a] text-[10px] uppercase tracking-widest block mb-2">{asset.type}</span>}
                   {asset.caption && <span className="text-gray-300 text-[14px] font-medium leading-relaxed">{asset.caption}</span>}
                 </div>
               )}
               {category === 'logo' && asset.type && (
                 <span className="text-[10px] uppercase tracking-widest text-gray-500 mt-6">{asset.type}</span>
               )}
               {category === 'icon' && asset.type && (
                 <span className="text-[10px] uppercase tracking-widest text-gray-500 text-center mt-4">{asset.type}</span>
               )}
             </motion.div>
           );
        })}
      </div>
    </div>
  );
}

const FashionAssetGallery = ({ assets, title }: { assets: string[], title?: string }) => {
  if (!assets || assets.length === 0) return null;
  
  let gridClass = "grid grid-cols-1 gap-6";
  
  if (assets.length === 1) {
    gridClass = "flex justify-center";
  } else if (assets.length === 2) {
    gridClass = "grid grid-cols-1 sm:grid-cols-2 gap-6";
  } else if (assets.length === 3) {
    gridClass = "grid grid-cols-1 sm:grid-cols-3 gap-6 items-center";
  } else if (assets.length === 4) {
    gridClass = "grid grid-cols-1 sm:grid-cols-2 gap-6";
  } else if (assets.length >= 5) {
    gridClass = "columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6";
  }

  return (
    <div className="space-y-6">
      {title && (
        <h4 className="text-[12px] uppercase tracking-[0.2em] text-white font-medium mb-4 flex items-center gap-3">
          <div className="w-8 h-[1px] bg-white/30" /> {title}
        </h4>
      )}
      <div className={gridClass}>
        {assets.map((asset, i) => {
           const isMasonry = assets.length >= 5;
           return (
             <motion.div 
               initial={{ opacity: 0, y: 20 }} 
               whileInView={{ opacity: 1, y: 0 }} 
               viewport={{ once: true }} 
               transition={{ delay: (i % 5) * 0.1 }} 
               key={i} 
               className={`rounded-2xl overflow-hidden border border-white/5 bg-[#050505] flex flex-col items-center justify-center relative group
                  ${isMasonry ? 'break-inside-avoid mb-6' : ''} 
                  ${assets.length === 1 ? 'w-full max-w-4xl mx-auto' : 'w-full h-full'}
               `}
             >
               <img onError={(e) => { e.currentTarget.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22400%22%20height%3D%22300%22%20style%3D%22background%3A%230a0a0a%22%3E%3Ctext%20fill%3D%22%23444%22%20x%3D%2250%25%22%20y%3D%2250%25%22%20font-family%3D%22sans-serif%22%20font-size%3D%2214%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3EImage%20Unavailable%3C%2Ftext%3E%3C%2Fsvg%3E'; e.currentTarget.onerror = null; }} 
                 src={asset} 
                 className={`w-full max-h-[85vh] object-contain group-hover:scale-[1.02] transition-transform duration-700`} 
                 loading="lazy" 
               />
             </motion.div>
           );
        })}
      </div>
    </div>
  );
};

const Portfolio = memo(function Portfolio() {
  const [normalizedProjects, setNormalizedProjects] = useState<Project[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const openProject = useCallback((project: Project) => {
    if (window.location.hash !== '#project-' + project.id) {
      window.history.pushState({ projectModalOpen: true }, '', '#project-' + project.id);
    }
    setSelectedProject(project);
  }, []);

  const closeProject = useCallback(() => {
    if (window.history.state?.projectModalOpen) {
      window.history.back();
    } else {
      window.history.pushState({}, '', window.location.pathname + window.location.search);
      setSelectedProject(null);
    }
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      if (window.location.hash.startsWith('#project-')) {
        const projectId = window.location.hash.replace('#project-', '');
        const project = normalizedProjects.find(p => p.id === projectId);
        if (project) {
          setSelectedProject(project);
        } else {
          setSelectedProject(null);
        }
      } else {
        setSelectedProject(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    if (normalizedProjects.length > 0 && window.location.hash.startsWith('#project-')) {
      handlePopState();
    }
    return () => window.removeEventListener('popstate', handlePopState);
  }, [normalizedProjects]);

  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (!error && data) {
        setNormalizedProjects(data as Project[]);
      }
    };
    
    fetchProjects();

    const channel = supabase
      .channel('projects_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, () => {
        fetchProjects();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    if (selectedProject || selectedCategory) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedProject, selectedCategory]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const renderDeliverables = (deliverables?: string[], liveUrl?: string) => (
    deliverables && deliverables.length > 0 && (
      <div className="mt-4 md:mt-8 p-6 lg:p-8 rounded-[20px] bg-white/[0.02] border border-white/5 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#ceab7a]/10 blur-[50px] rounded-full pointer-events-none" />
        <h3 className="text-[16px] font-serif text-white mb-6 tracking-wide">Key Deliverables</h3>
        <ul className="space-y-4 text-[14px] text-gray-400">
          {deliverables.map((item, idx) => (
            <motion.li 
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + idx * 0.1 }}
              key={idx} 
              className="flex items-start gap-3"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[#ceab7a] mt-1.5 shrink-0 shadow-[0_0_8px_rgba(206,171,122,0.8)]" />
              <span>{item}</span>
            </motion.li>
          ))}
        </ul>
        
        {liveUrl && (
          <motion.a 
            href={liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-8 w-full py-4 bg-[#ceab7a] hover:bg-white text-black font-bold rounded-full flex items-center justify-center gap-3 transition-colors duration-300 uppercase tracking-[0.15em] text-[11px] shadow-[0_0_30px_rgba(206,171,122,0.2)]"
          >
            Visit Live Project <ExternalLink size={16} />
          </motion.a>
        )}
      </div>
    )
  );

  const renderModalContent = (project: Project) => {
    const mc = project.content || (project as any).modalContent || {};

    if (project.type === 'website') {
      return (
        <div className="flex flex-col gap-12 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-[1000px] mx-auto pb-12">
          
          <div className="flex flex-col md:flex-row gap-8 justify-between items-start border-b border-white/5 pb-12">
            <div className="w-full md:w-1/3">
               <h4 className="text-[12px] uppercase tracking-[0.2em] text-[#ceab7a] font-semibold mb-2">mc.projectStatus</h4>
               <p className="text-white text-[15px]">{mc.projectStatus || mc.clientName || 'Client Project'}</p>
            </div>
            <div className="w-full md:w-2/3">
               <h4 className="text-[12px] uppercase tracking-[0.2em] text-[#ceab7a] font-semibold mb-2">Overview</h4>
               <p className="text-gray-300 text-[16px] leading-relaxed">{mc.overview || project.desc}</p>
            </div>
          </div>

          {(project.image || mc.mainImage) && (
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="w-full rounded-[24px] overflow-hidden border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)] group relative">
              <img onError={(e) => { e.currentTarget.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22400%22%20height%3D%22300%22%20style%3D%22background%3A%230a0a0a%22%3E%3Ctext%20fill%3D%22%23444%22%20x%3D%2250%25%22%20y%3D%2250%25%22%20font-family%3D%22sans-serif%22%20font-size%3D%2214%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3EImage%20Unavailable%3C%2Ftext%3E%3C%2Fsvg%3E'; e.currentTarget.onerror = null; }} src={project.image || mc.mainImage} alt={project.title} className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-1000" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
            </motion.div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8">
             <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="p-6 rounded-[20px] bg-[#101010] border border-white/5 hover:border-[#ceab7a]/30 transition-colors">
                <div className="w-10 h-10 rounded-full bg-[#ceab7a]/10 flex items-center justify-center mb-4">
                  <Rocket size={18} className="text-[#ceab7a]" />
                </div>
                <h4 className="text-white font-serif text-[20px] mb-3">The Goal</h4>
                <p className="text-gray-400 text-[14px] leading-relaxed">{mc.goal || 'To create a premium digital presence that drives conversion and establishes industry authority.'}</p>
             </motion.div>

             <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="p-6 rounded-[20px] bg-[#101010] border border-white/5 hover:border-[#ceab7a]/30 transition-colors">
                <div className="w-10 h-10 rounded-full bg-[#ceab7a]/10 flex items-center justify-center mb-4">
                  <Monitor size={18} className="text-[#ceab7a]" />
                </div>
                <h4 className="text-white font-serif text-[20px] mb-3">Our Approach</h4>
                <p className="text-gray-400 text-[14px] leading-relaxed">{mc.approach || 'We utilized a cinematic visual system combined with a responsive, component-driven architecture.'}</p>
             </motion.div>

             <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="p-6 rounded-[20px] bg-[#101010] border border-white/5 hover:border-[#ceab7a]/30 transition-colors">
                <div className="w-10 h-10 rounded-full bg-[#ceab7a]/10 flex items-center justify-center mb-4">
                  <Users size={18} className="text-[#ceab7a]" />
                </div>
                <h4 className="text-white font-serif text-[20px] mb-3">The Experience</h4>
                <p className="text-gray-400 text-[14px] leading-relaxed">{mc.experience || 'A frictionless user journey designed to guide visitors effortlessly towards the primary call to action.'}</p>
             </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-white/5 pt-12">
             {mc.deliverables && mc.deliverables.length > 0 && (
                <div>
                   <h4 className="text-[12px] uppercase tracking-[0.2em] text-[#ceab7a] font-semibold mb-6 flex items-center gap-3">
                     <div className="w-8 h-[1px] bg-[#ceab7a]/30" />
                     What We Built
                   </h4>
                   <ul className="space-y-4">
                     {mc.deliverables.map((item: string, idx: number) => (
                       <li key={idx} className="flex items-start gap-3 text-gray-300 text-[15px]">
                         <div className="w-1.5 h-1.5 rounded-full bg-[#ceab7a] mt-2 shrink-0 shadow-[0_0_8px_rgba(206,171,122,0.8)]" />
                         <span>{item}</span>
                       </li>
                     ))}
                   </ul>
                </div>
             )}
             
             {mc.technologies && mc.technologies.length > 0 && (
                <div>
                   <h4 className="text-[12px] uppercase tracking-[0.2em] text-[#ceab7a] font-semibold mb-6 flex items-center gap-3">
                     <div className="w-8 h-[1px] bg-[#ceab7a]/30" />
                     Built With
                   </h4>
                   <div className="flex flex-wrap gap-2">
                     {mc.technologies.map((tech: string, idx: number) => (
                       <span key={idx} className="px-4 py-2 rounded-full border border-white/10 bg-white/5 text-gray-300 text-[13px] font-medium hover:border-[#ceab7a]/30 hover:text-white transition-colors cursor-default">
                         {tech}
                       </span>
                     ))}
                   </div>
                </div>
             )}
          </div>

          {mc.supportingImages && mc.supportingImages.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-12 border-t border-white/5">
               {mc.supportingImages.map((img: string, idx: number) => (
                 <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.2 }} key={idx} className="aspect-video rounded-[20px] overflow-hidden border border-white/10 bg-[#101010] group shadow-2xl">
                    <img onError={(e) => { e.currentTarget.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22400%22%20height%3D%22300%22%20style%3D%22background%3A%230a0a0a%22%3E%3Ctext%20fill%3D%22%23444%22%20x%3D%2250%25%22%20y%3D%2250%25%22%20font-family%3D%22sans-serif%22%20font-size%3D%2214%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3EImage%20Unavailable%3C%2Ftext%3E%3C%2Fsvg%3E'; e.currentTarget.onerror = null; }} src={img} className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-700" />
                 </motion.div>
               ))}
            </div>
          )}

          <div className="mt-8 pt-12 border-t border-white/5 flex flex-col items-center text-center">
             {mc.liveUrl && (
                <a href={mc.liveUrl} target="_blank" rel="noopener noreferrer" className="mb-12 px-8 py-4 bg-gradient-to-r from-[#e8d3b5] to-[#ceab7a] text-black font-bold rounded-full text-[13px] tracking-[0.1em] shadow-[0_0_40px_rgba(206,171,122,0.3)] hover:scale-105 transition-transform duration-300 flex items-center gap-3 uppercase">
                   Visit Live Website <ExternalLink size={18} />
                </a>
             )}
             
             <h3 className="text-2xl font-serif text-white mb-3">Like what you see?</h3>
             <p className="text-gray-400 mb-8 max-w-md mx-auto">Let's collaborate to build a premium digital experience tailored specifically for your brand.</p>
             <button onClick={() => { closeProject(); setTimeout(() => { window.location.href = "#contact"; }, 50); }} className="px-6 py-3 border border-white/20 hover:border-[#ceab7a] hover:bg-[#ceab7a]/10 rounded-full text-white text-[13px] tracking-wide transition-all duration-300">
               Start a Project
             </button>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-[1200px] mx-auto">

                  {project.type === 'branding' && (
            <div className="flex flex-col gap-16 md:gap-20 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-[1200px] mx-auto pb-12 w-full">
              
              {/* Brand Hero & Snapshot - Compact Editorial */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
                
                {/* Left Metadata Column */}
                <div className="lg:col-span-3 flex flex-col gap-8 pt-2">
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-semibold mb-2">Project</h4>
                      <h3 className="text-2xl font-serif text-[#ceab7a] leading-tight">{project.title}</h3>
                    </div>
                    <div>
                      <h4 className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-semibold mb-2">Client</h4>
                      <p className="text-white text-[14px]">{mc.clientName || 'Confidential'}</p>
                    </div>
                    <div>
                      <h4 className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-semibold mb-2">Status</h4>
                      <p className="text-white text-[14px]">{mc.projectStatus || 'Client Project'}</p>
                    </div>
                    <div>
                      <h4 className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-semibold mb-2">Services</h4>
                      <p className="text-gray-300 text-[13px] leading-relaxed">{mc.deliverables?.join(', ') || project.category || 'Branding & Identity'}</p>
                    </div>
                  </div>
                </div>
                
                {/* Right Hero Visual Column */}
                <div className="lg:col-span-9">
                  {(project.image || mc.mainImage) && (
                    <motion.div initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="w-full rounded-2xl overflow-hidden border border-white/5 bg-[#050505] shadow-[0_0_40px_rgba(0,0,0,0.3)] relative flex items-center justify-center max-h-[70vh]">
                      <img onError={(e) => { e.currentTarget.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22400%22%20height%3D%22300%22%20style%3D%22background%3A%230a0a0a%22%3E%3Ctext%20fill%3D%22%23444%22%20x%3D%2250%25%22%20y%3D%2250%25%22%20font-family%3D%22sans-serif%22%20font-size%3D%2214%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3EImage%20Unavailable%3C%2Ftext%3E%3C%2Fsvg%3E'; e.currentTarget.onerror = null; }} src={project.image || mc.mainImage} alt={project.title} className="w-full h-full max-h-[70vh] object-contain" />
                    </motion.div>
                  )}
                </div>
              </div>

              {mc.brandingAssets && mc.brandingAssets.length > 0 ? (
                <div className="space-y-16 md:space-y-24 mt-8">
                  {/* The Brand Story */}
                  {(mc.brandOverview || mc.brandChallenge || mc.brandDirection) && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 border-t border-white/5 pt-12">
                      <div className="lg:col-span-4">
                        <h3 className="text-2xl font-serif text-[#ceab7a] sticky top-32">The Brand Story</h3>
                      </div>
                      <div className="lg:col-span-8 flex flex-col gap-12">
                        {mc.brandOverview && (
                          <div>
                            <p className="text-gray-300 text-[16px] md:text-[18px] leading-[1.8] font-light">{mc.brandOverview}</p>
                          </div>
                        )}
                        {mc.brandChallenge && (
                          <div>
                            <h4 className="text-[11px] uppercase tracking-[0.2em] text-[#ceab7a] font-semibold mb-4">The Challenge</h4>
                            <p className="text-gray-400 text-[15px] leading-relaxed">{mc.brandChallenge}</p>
                          </div>
                        )}
                        {mc.brandDirection && (
                          <div>
                            <h4 className="text-[11px] uppercase tracking-[0.2em] text-[#ceab7a] font-semibold mb-4">Brand Direction</h4>
                            <p className="text-gray-400 text-[15px] leading-relaxed">{mc.brandDirection}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Dynamic Asset Galleries */}
                  
                  {/* Logo System */}
                  <BrandAssetGallery 
                    assets={(mc.brandingAssets || []).filter((a: any) => a.category === 'logo')} 
                    title="Logo System" 
                    category="logo" 
                  />

                  {/* Icon System */}
                  <BrandAssetGallery 
                    assets={(mc.brandingAssets || []).filter((a: any) => a.category === 'icon')} 
                    title="Icon System" 
                    category="icon" 
                  />

                  {/* Color & Typography - Combined Grid if both exist */}
                  {(mc.colors && mc.colors.length > 0 || mc.typography?.primary) && (
                    <div className={`grid grid-cols-1 ${(mc.colors && mc.colors.length > 0 && mc.typography?.primary) ? 'lg:grid-cols-2' : ''} gap-16 pt-10`}>
                      
                      {/* Color System */}
                      {mc.colors && mc.colors.length > 0 && (
                        <div className="space-y-8">
                          <h4 className="text-[12px] uppercase tracking-[0.2em] text-[#ceab7a] font-semibold flex items-center gap-3">
                            <div className="w-8 h-[1px] bg-[#ceab7a]/30" /> Color Palette
                          </h4>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                            {mc.colors.map((color: any, i: number) => (
                              <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} key={color.id} className="flex flex-col gap-4">
                                <div className="h-24 md:h-32 rounded-2xl shadow-xl border border-white/10 w-full" style={{ backgroundColor: color.hex }} />
                                <div>
                                  <div className="text-white text-[13px] font-medium tracking-wide">{color.name}</div>
                                  <div className="text-gray-500 text-[11px] uppercase tracking-widest mt-1">{color.hex}</div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Typography */}
                      {mc.typography?.primary && (
                        <div className="space-y-8">
                          <h4 className="text-[12px] uppercase tracking-[0.2em] text-[#ceab7a] font-semibold flex items-center gap-3">
                            <div className="w-8 h-[1px] bg-[#ceab7a]/30" /> Typography
                          </h4>
                          <div className="space-y-10">
                            <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                              <div className="text-[#ceab7a] text-[10px] uppercase tracking-[0.2em] mb-3">Primary Typeface</div>
                              <div className="text-white text-3xl md:text-5xl font-serif mb-4">{mc.typography.primary}</div>
                              <div className="text-gray-500 text-[13px] leading-loose break-words max-w-lg">
                                A B C D E F G H I J K L M N O P Q R S T U V W X Y Z<br/>
                                a b c d e f g h i j k l m n o p q r s t u v w x y z<br/>
                                0 1 2 3 4 5 6 7 8 9 ! @ # % & *
                              </div>
                            </motion.div>
                            
                            {mc.typography.secondary && (
                              <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
                                <div className="text-[#ceab7a] text-[10px] uppercase tracking-[0.2em] mb-3">Secondary Typeface</div>
                                <div className="text-white text-2xl md:text-3xl mb-4">{mc.typography.secondary}</div>
                                <div className="text-gray-500 text-[12px] leading-loose break-words max-w-lg">
                                  A B C D E F G H I J K L M N O P Q R S T U V W X Y Z<br/>
                                  a b c d e f g h i j k l m n o p q r s t u v w x y z<br/>
                                  0 1 2 3 4 5 6 7 8 9
                                </div>
                              </motion.div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Responsive Category Galleries */}
                  {['stationery', 'print', 'packaging', 'digital'].map(category => (
                    <BrandAssetGallery 
                      key={category}
                      assets={(mc.brandingAssets || []).filter((a: any) => a.category === category)} 
                      title={`${category.charAt(0).toUpperCase() + category.slice(1)} Collateral`} 
                      category={category} 
                    />
                  ))}

                  {/* Showcase / Brand Applications */}
                  <BrandAssetGallery 
                    assets={(mc.brandingAssets || []).filter((a: any) => a.showcase)} 
                    title="Brand Applications" 
                    category="showcase" 
                  />
                  
                  {/* Tools and Result */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-12 border-t border-white/5 pt-16">
                     {mc.technologies && mc.technologies.length > 0 && (
                        <div className="md:col-span-4">
                           <h4 className="text-[12px] uppercase tracking-[0.2em] text-[#ceab7a] font-semibold mb-6 flex items-center gap-3">
                             <div className="w-8 h-[1px] bg-[#ceab7a]/30" /> Tools Used
                           </h4>
                           <div className="flex flex-wrap gap-2">
                             {mc.technologies.map((tech: string, i: number) => (
                               <span key={i} className="px-4 py-2 bg-[#101010] border border-white/10 rounded-full text-gray-300 text-[12px] tracking-wide">{tech}</span>
                             ))}
                           </div>
                        </div>
                     )}
                     
                     {mc.result && (
                        <div className={!mc.technologies || mc.technologies.length === 0 ? "md:col-span-12" : "md:col-span-8"}>
                           <h4 className="text-[12px] uppercase tracking-[0.2em] text-[#ceab7a] font-semibold mb-6 flex items-center gap-3">
                             <div className="w-8 h-[1px] bg-[#ceab7a]/30" /> The Result
                           </h4>
                           <p className="text-gray-300 text-[15px] md:text-[16px] leading-relaxed font-light">{mc.result}</p>
                        </div>
                     )}
                  </div>
                </div>
              ) : (
                /* Fallback for legacy branding projects */
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mt-12 border-t border-white/5 pt-12">
                  <div className="lg:col-span-4 flex flex-col gap-6">
                    <h3 className="text-2xl font-serif text-[#ceab7a]">Project Identity</h3>
                    <p className="text-gray-400 text-[15px] leading-relaxed">{project.desc}</p>
                    {renderDeliverables(mc.deliverables, mc.liveUrl)}
                  </div>
                  <div className="lg:col-span-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {mc.logos?.map((img: string, i: number) => (
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} key={`logo-${i}`} className="rounded-2xl overflow-hidden border border-white/5 bg-[#050505] p-6 flex items-center justify-center">
                          <img onError={(e) => { e.currentTarget.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22400%22%20height%3D%22300%22%20style%3D%22background%3A%230a0a0a%22%3E%3Ctext%20fill%3D%22%23444%22%20x%3D%2250%25%22%20y%3D%2250%25%22%20font-family%3D%22sans-serif%22%20font-size%3D%2214%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3EImage%20Unavailable%3C%2Ftext%3E%3C%2Fsvg%3E'; e.currentTarget.onerror = null; }} src={img} className="max-w-full max-h-[300px] object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500" loading="lazy" />
                        </motion.div>
                      ))}
                      {mc.mockups?.map((img: string, i: number) => (
                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 + i * 0.1 }} key={`mockup-${i}`} className={`rounded-2xl overflow-hidden border border-white/5 bg-[#101010] group ${i % 3 === 0 ? 'sm:col-span-2' : ''}`}>
                          <img onError={(e) => { e.currentTarget.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22400%22%20height%3D%22300%22%20style%3D%22background%3A%230a0a0a%22%3E%3Ctext%20fill%3D%22%23444%22%20x%3D%2250%25%22%20y%3D%2250%25%22%20font-family%3D%22sans-serif%22%20font-size%3D%2214%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3EImage%20Unavailable%3C%2Ftext%3E%3C%2Fsvg%3E'; e.currentTarget.onerror = null; }} src={img} className="w-full h-auto max-h-[600px] object-contain group-hover:scale-[1.03] transition-transform duration-700" loading="lazy" />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
{project.type === 'fashion' && (
            <div className="flex flex-col gap-16 md:gap-24 w-full max-w-6xl mx-auto">
              {/* 1. Fashion Hero */}
              <div className="flex flex-col gap-8 items-center text-center max-w-3xl mx-auto">
                <span className="text-[#ceab7a] text-xs font-bold tracking-[0.3em] uppercase">AI Fashion Try-On</span>
                <h3 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white leading-tight">{project.title}</h3>
                {project.desc && <p className="text-gray-400 text-lg leading-relaxed max-w-2xl">{project.desc}</p>}
                
                {/* 2. Project Snapshot */}
                <div className="flex flex-wrap justify-center gap-x-12 gap-y-4 mt-4 border-t border-b border-white/10 py-6 w-full">
                   {mc.clientName && (
                     <div className="flex flex-col gap-1 items-center">
                        <span className="text-[9px] uppercase tracking-widest text-gray-500">Client</span>
                        <span className="text-sm text-white font-medium">{mc.clientName}</span>
                     </div>
                   )}
                   {mc.projectStatus && (
                     <div className="flex flex-col gap-1 items-center">
                        <span className="text-[9px] uppercase tracking-widest text-gray-500">Status</span>
                        <span className="text-sm text-white font-medium">{mc.projectStatus}</span>
                     </div>
                   )}
                   <div className="flex flex-col gap-1 items-center">
                      <span className="text-[9px] uppercase tracking-widest text-gray-500">Content Type</span>
                      <span className="text-sm text-white font-medium">Model Visualization</span>
                   </div>
                </div>
              </div>

              {/* Main Image if present (Fallback/Hero) */}
              {(project.image || mc.mainImage) && (
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="w-full rounded-3xl overflow-hidden bg-[#050505] flex justify-center items-center p-4 border border-white/5">
                  <img onError={(e) => { e.currentTarget.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22400%22%20height%3D%22300%22%20style%3D%22background%3A%230a0a0a%22%3E%3Ctext%20fill%3D%22%23444%22%20x%3D%2250%25%22%20y%3D%2250%25%22%20font-family%3D%22sans-serif%22%20font-size%3D%2214%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3EImage%20Unavailable%3C%2Ftext%3E%3C%2Fsvg%3E'; e.currentTarget.onerror = null; }} src={project.image || mc.mainImage} className="w-full h-auto max-h-[80vh] object-contain drop-shadow-2xl rounded-2xl" />
                </motion.div>
              )}

              {/* 3. The Brief */}
              {mc.projectBrief && (
                <div className="max-w-3xl mx-auto text-center space-y-4">
                  <h4 className="text-[12px] uppercase tracking-[0.2em] text-white font-medium flex items-center justify-center gap-3">
                    <div className="w-8 h-[1px] bg-white/30" /> THE BRIEF <div className="w-8 h-[1px] bg-white/30" />
                  </h4>
                  <p className="text-gray-300 text-lg leading-relaxed">{mc.projectBrief}</p>
                </div>
              )}

              {/* 4. Product Input */}
              {mc.productInputs && mc.productInputs.length > 0 && (
                <div className="space-y-8">
                  <FashionAssetGallery assets={mc.productInputs} title="Product Input" />
                </div>
              )}

              {/* 5. Fashion Try-On Transformations */}
              {mc.transformations && mc.transformations.length > 0 && (
                <div className="space-y-8">
                  <h4 className="text-[12px] uppercase tracking-[0.2em] text-white font-medium flex items-center justify-center gap-3">
                    <div className="w-8 h-[1px] bg-white/30" /> FASHION TRY-ON <div className="w-8 h-[1px] bg-white/30" />
                  </h4>
                  <div className={`grid ${mc.transformations.length === 1 ? 'grid-cols-1 max-w-4xl mx-auto' : mc.transformations.length === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'} gap-8`}>
                    {mc.transformations.map((pair: any, i: number) => (
                      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} key={i} className="flex flex-col gap-4 bg-white/[0.02] p-4 rounded-3xl border border-white/5">
                        <div className="flex flex-col sm:flex-row gap-4 h-full">
                          <div className="flex-1 rounded-2xl overflow-hidden relative bg-[#101010] aspect-[3/4]">
                            <img onError={(e) => { e.currentTarget.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22400%22%20height%3D%22300%22%20style%3D%22background%3A%230a0a0a%22%3E%3Ctext%20fill%3D%22%23444%22%20x%3D%2250%25%22%20y%3D%2250%25%22%20font-family%3D%22sans-serif%22%20font-size%3D%2214%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3EImage%20Unavailable%3C%2Ftext%3E%3C%2Fsvg%3E'; e.currentTarget.onerror = null; }} src={pair.before} className="w-full h-full object-contain hover:scale-[1.02] transition-transform duration-700" loading="lazy" />
                            <div className="absolute top-4 left-4 px-3 py-1 bg-black/80 backdrop-blur-md rounded-full text-[9px] text-gray-300 uppercase tracking-widest border border-white/10">Before</div>
                          </div>
                          <div className="flex-1 rounded-2xl overflow-hidden relative bg-[#101010] border border-[#ceab7a]/30 shadow-[0_0_30px_rgba(206,171,122,0.15)] aspect-[3/4]">
                            <img onError={(e) => { e.currentTarget.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22400%22%20height%3D%22300%22%20style%3D%22background%3A%230a0a0a%22%3E%3Ctext%20fill%3D%22%23444%22%20x%3D%2250%25%22%20y%3D%2250%25%22%20font-family%3D%22sans-serif%22%20font-size%3D%2214%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3EImage%20Unavailable%3C%2Ftext%3E%3C%2Fsvg%3E'; e.currentTarget.onerror = null; }} src={pair.after} className="w-full h-full object-contain hover:scale-[1.02] transition-transform duration-700" loading="lazy" />
                            <div className="absolute top-4 left-4 px-3 py-1 bg-[#ceab7a] rounded-full text-[9px] text-black font-bold uppercase tracking-widest shadow-lg">After</div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* 6. Campaign Visuals */}
              {mc.campaignVisuals && mc.campaignVisuals.length > 0 && (
                <div className="space-y-8 border-t border-white/5 pt-16">
                  <FashionAssetGallery assets={mc.campaignVisuals} title="Campaign Visuals" />
                </div>
              )}

              {/* 7. Promotional Video */}
              {mc.videoUrl && (
                <div className="space-y-8 border-t border-white/5 pt-16">
                  <h4 className="text-[12px] uppercase tracking-[0.2em] text-white font-medium flex items-center justify-center gap-3">
                    <div className="w-8 h-[1px] bg-white/30" /> PROMOTIONAL VIDEO <div className="w-8 h-[1px] bg-white/30" />
                  </h4>
                  <div className="max-w-4xl mx-auto rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative bg-black flex justify-center items-center">
                     <video 
                        src={mc.videoUrl} 
                        controls 
                        className="w-full max-h-[80vh] object-contain" 
                     />
                  </div>
                </div>
              )}
              
              {/* 8. Deliverables & Tools */}
              {( (mc.deliverables && mc.deliverables.length > 0) || (mc.technologies && mc.technologies.length > 0) ) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto border-t border-white/5 pt-16 w-full">
                  {mc.deliverables && mc.deliverables.length > 0 && (
                    <div className="space-y-6">
                      <h4 className="text-[11px] uppercase tracking-[0.2em] text-[#ceab7a] font-medium">Deliverables</h4>
                      <div className="flex flex-wrap gap-2">
                        {mc.deliverables.map((item: string, i: number) => (
                          <span key={i} className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-xs text-gray-300">{item}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {mc.technologies && mc.technologies.length > 0 && (
                    <div className="space-y-6">
                      <h4 className="text-[11px] uppercase tracking-[0.2em] text-[#ceab7a] font-medium">Tools Used</h4>
                      <div className="flex flex-wrap gap-2">
                        {mc.technologies.map((item: string, i: number) => (
                          <span key={i} className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-xs text-gray-300">{item}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 9. The Result */}
              {mc.result && (
                <div className="max-w-3xl mx-auto text-center space-y-6 border-t border-white/5 pt-16">
                  <h4 className="text-[12px] uppercase tracking-[0.2em] text-white font-medium flex items-center justify-center gap-3">
                    <div className="w-8 h-[1px] bg-white/30" /> THE RESULT <div className="w-8 h-[1px] bg-white/30" />
                  </h4>
                  <p className="text-[#ceab7a] text-xl md:text-2xl font-serif leading-relaxed italic">"{mc.result}"</p>
                </div>
              )}

            </div>
          )}

        {project.type === 'growth' && (
          <div className="flex flex-col gap-24 max-w-[1200px] mx-auto w-full">
            
            {/* 1. HERO / DASHBOARD PREVIEW */}
            <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
              <div className="w-full lg:w-[35%] flex flex-col gap-6 order-2 lg:order-1">
                <div className="flex flex-col gap-2">
                  <span className="text-[11px] font-medium text-[#ceab7a] tracking-[0.2em] uppercase">POWER BI / DATA ANALYTICS</span>
                  <h3 className="text-3xl md:text-4xl font-serif text-white tracking-tight">{project.title}</h3>
                </div>
                {(project.category || mc.clientName) && (
                  <div className="text-[12px] uppercase tracking-widest text-gray-500 font-medium">
                    {project.category || mc.clientName}
                  </div>
                )}
                <p className="text-gray-400 text-[15px] leading-relaxed">
                  {project.desc}
                </p>
              </div>
              
              {project.image && (
                <div className="w-full lg:w-[65%] order-1 lg:order-2">
                  <motion.div initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="rounded-3xl border border-white/10 bg-[#0a0a0a] shadow-2xl relative p-2">
                    <img onError={(e) => { e.currentTarget.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22400%22%20height%3D%22300%22%20style%3D%22background%3A%230a0a0a%22%3E%3Ctext%20fill%3D%22%23444%22%20x%3D%2250%25%22%20y%3D%2250%25%22%20font-family%3D%22sans-serif%22%20font-size%3D%2214%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3EImage%20Unavailable%3C%2Ftext%3E%3C%2Fsvg%3E'; e.currentTarget.onerror = null; }} src={project.image} className="block w-full h-auto rounded-2xl" style={{ width: "100%", height: "auto", display: "block" }} />
                  </motion.div>
                </div>
              )}
            </div>

            {/* 2 & 3 & 4. PROJECT OVERVIEW, BUSINESS PROBLEM, SOLUTION */}
            {(mc.businessProblem || mc.solution) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-white/5 pt-16">
                {mc.businessProblem && (
                  <div className="space-y-6">
                    <h4 className="text-[11px] font-medium text-[#ceab7a] tracking-[0.2em] uppercase">Business Problem</h4>
                    <p className="text-gray-300 text-[15px] leading-relaxed whitespace-pre-wrap">{mc.businessProblem}</p>
                  </div>
                )}
                {mc.solution && (
                  <div className="space-y-6">
                    <h4 className="text-[11px] font-medium text-[#ceab7a] tracking-[0.2em] uppercase">Approach / Solution</h4>
                    <p className="text-gray-300 text-[15px] leading-relaxed whitespace-pre-wrap">{mc.solution}</p>
                  </div>
                )}
              </div>
            )}

            {/* 5. KEY METRICS */}
            {mc.metrics && mc.metrics.length > 0 && (
              <div className="space-y-8 border-t border-white/5 pt-16">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                  {mc.metrics.map((metric: any, i: number) => (
                    <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} key={i} className="p-8 rounded-2xl bg-[#0a0a0a] border border-white/5 flex flex-col items-center justify-center text-center relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-b from-[#ceab7a]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <span className="text-[11px] text-[#ceab7a] uppercase tracking-widest font-medium mb-3">{metric.label}</span>
                      <span className="text-[32px] md:text-[40px] font-serif text-white mb-2 tracking-tight drop-shadow-[0_0_15px_rgba(206,171,122,0.3)]">{metric.value}</span>
                      {metric.description && (
                        <span className="text-[12px] text-gray-500 mt-2">{metric.description}</span>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. DASHBOARD PAGES */}
            {mc.dashboards && mc.dashboards.length > 0 && (
              <div className="space-y-12 border-t border-white/5 pt-16">
                <h4 className="text-[12px] uppercase tracking-[0.2em] text-white font-medium flex items-center justify-center gap-3">
                  <div className="w-8 h-[1px] bg-white/30" /> DASHBOARD PAGES <div className="w-8 h-[1px] bg-white/30" />
                </h4>
                <div className={`grid gap-6 ${
                  mc.dashboards.length === 1 ? 'grid-cols-1 w-full' : 
                  mc.dashboards.length === 2 ? 'grid-cols-1 md:grid-cols-2' : 
                  mc.dashboards.length === 3 ? 'grid-cols-1 md:grid-cols-3' : 
                  mc.dashboards.length === 4 ? 'grid-cols-1 md:grid-cols-2' : 
                  'grid-cols-1 md:grid-cols-2'
                }`}>
                  {mc.dashboards.map((img: string, i: number) => (
                    <motion.div initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} key={i} className="relative shadow-xl">
                      <img onError={(e) => { e.currentTarget.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22400%22%20height%3D%22300%22%20style%3D%22background%3A%230a0a0a%22%3E%3Ctext%20fill%3D%22%23444%22%20x%3D%2250%25%22%20y%3D%2250%25%22%20font-family%3D%22sans-serif%22%20font-size%3D%2214%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3EImage%20Unavailable%3C%2Ftext%3E%3C%2Fsvg%3E'; e.currentTarget.onerror = null; }} src={img} className="block w-full h-auto" style={{ width: "100%", height: "auto", display: "block" }} loading="lazy" />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* 7 & 8. TECHNOLOGIES & INSIGHTS */}
            {(((mc.technologies && mc.technologies.length > 0) || (mc.deliverables && mc.deliverables.length > 0)) || (mc.keyInsights && mc.keyInsights.length > 0)) && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 border-t border-white/5 pt-16">
                {((mc.technologies && mc.technologies.length > 0) || (mc.deliverables && mc.deliverables.length > 0)) && (
                  <div className="lg:col-span-4 space-y-6">
                    <h4 className="text-[11px] font-medium text-[#ceab7a] tracking-[0.2em] uppercase">Tools & Technologies</h4>
                    <div className="flex flex-wrap gap-2">
                      {(mc.technologies || []).map((tech: string, i: number) => (
                        <span key={i} className="px-4 py-2 rounded-full border border-white/10 bg-[#0a0a0a] text-sm text-gray-300">
                          {tech}
                        </span>
                      ))}
                      {(mc.deliverables || []).map((deliv: string, i: number) => (
                        <span key={`del-${i}`} className="px-4 py-2 rounded-full border border-white/10 bg-[#0a0a0a] text-sm text-gray-300">
                          {deliv}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {mc.keyInsights && mc.keyInsights.length > 0 && (
                  <div className="lg:col-span-8 space-y-6">
                    <h4 className="text-[11px] font-medium text-[#ceab7a] tracking-[0.2em] uppercase">Key Insights</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {mc.keyInsights.map((insight: string, i: number) => (
                        <div key={i} className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 flex gap-4 items-start">
                          <span className="text-[#ceab7a] font-serif text-2xl opacity-50 mt-[-4px]">{(i + 1).toString().padStart(2, '0')}</span>
                          <p className="text-gray-300 text-[14px] leading-relaxed">{insight}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 9. LINKS */}
            {(mc.githubUrl || mc.liveUrl) && (
              <div className="flex flex-wrap items-center justify-center gap-6 border-t border-white/5 pt-16">
                {mc.liveUrl && (
                  <a href={mc.liveUrl} target="_blank" rel="noopener noreferrer" className="px-8 py-4 bg-[#ceab7a] text-black font-bold rounded-full uppercase tracking-widest text-[11px] hover:bg-white transition-colors">
                    View Live Dashboard
                  </a>
                )}
                {mc.githubUrl && (
                  <a href={mc.githubUrl} target="_blank" rel="noopener noreferrer" className="px-8 py-4 bg-transparent border border-[#ceab7a] text-[#ceab7a] font-bold rounded-full uppercase tracking-widest text-[11px] hover:bg-[#ceab7a]/10 transition-colors">
                    View GitHub Project
                  </a>
                )}
              </div>
            )}

          </div>
        )}

        {project.type === 'pod' && (
          <div className="flex flex-col gap-24 max-w-[1200px] mx-auto w-full">
            {/* 1. HERO */}
            <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
              <div className="w-full lg:w-[35%] flex flex-col gap-6 order-2 lg:order-1">
                <div className="flex flex-col gap-2">
                  <span className="text-[11px] font-medium text-[#ceab7a] tracking-[0.2em] uppercase">{project.category || 'PRINT-ON-DEMAND'}</span>
                  <h3 className="text-3xl md:text-4xl font-serif text-white tracking-tight">{project.title}</h3>
                </div>
                <p className="text-gray-400 text-[15px] leading-relaxed">
                  {project.desc}
                </p>
                {mc.designConcept && (
                  <div className="mt-4 p-6 bg-[#0a0a0a] border border-white/5 rounded-2xl">
                    <h4 className="text-[11px] font-medium text-[#ceab7a] tracking-[0.2em] uppercase mb-4">Design Concept</h4>
                    <p className="text-gray-300 text-[14px] leading-relaxed whitespace-pre-wrap">{mc.designConcept}</p>
                  </div>
                )}
              </div>
              
              {project.image && (
                <div className="w-full lg:w-[65%] order-1 lg:order-2">
                  <motion.div initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
                    <img onError={(e) => { e.currentTarget.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22400%22%20height%3D%22300%22%20style%3D%22background%3A%230a0a0a%22%3E%3Ctext%20fill%3D%22%23444%22%20x%3D%2250%25%22%20y%3D%2250%25%22%20font-family%3D%22sans-serif%22%20font-size%3D%2214%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3EImage%20Unavailable%3C%2Ftext%3E%3C%2Fsvg%3E'; e.currentTarget.onerror = null; }} src={project.image} className="block w-full h-auto" />
                  </motion.div>
                </div>
              )}
            </div>

            {/* 2. PRODUCT SHOWCASE */}
            {mc.products && mc.products.length > 0 && (
              <div className="space-y-12 border-t border-white/5 pt-16">
                <h4 className="text-[12px] uppercase tracking-[0.2em] text-white font-medium flex items-center justify-center gap-3">
                  <div className="w-8 h-[1px] bg-white/30" /> PRODUCT SHOWCASE <div className="w-8 h-[1px] bg-white/30" />
                </h4>
                <div className={`grid gap-12 ${
                  mc.products.length === 1 ? 'grid-cols-1 w-full max-w-4xl mx-auto' : 
                  mc.products.length === 2 ? 'grid-cols-1 md:grid-cols-2' : 
                  mc.products.length === 3 ? 'grid-cols-1 md:grid-cols-3' : 
                  mc.products.length === 4 ? 'grid-cols-1 sm:grid-cols-2' : 
                  'grid-cols-1 sm:grid-cols-2 md:grid-cols-3'
                }`}>
                  {mc.products.map((prod: any, i: number) => {
                    const isString = typeof prod === 'string';
                    const img = isString ? prod : prod.image;
                    const prodType = isString ? 'Other' : prod.type;
                    return (
                      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} key={i} className="flex flex-col items-center gap-6 group">
                        <div className="w-full relative shadow-xl">
                          <img onError={(e) => { e.currentTarget.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22400%22%20height%3D%22300%22%20style%3D%22background%3A%230a0a0a%22%3E%3Ctext%20fill%3D%22%23444%22%20x%3D%2250%25%22%20y%3D%2250%25%22%20font-family%3D%22sans-serif%22%20font-size%3D%2214%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3EImage%20Unavailable%3C%2Ftext%3E%3C%2Fsvg%3E'; e.currentTarget.onerror = null; }} src={img} className="block w-full h-auto" loading="lazy" />
                        </div>
                        <div className="px-6 py-2 bg-white/5 border border-white/10 rounded-full">
                          <span className="text-[11px] text-[#ceab7a] uppercase tracking-widest font-medium">{prodType}</span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const filteredProjects = selectedCategory 
    ? normalizedProjects.filter(p => p.type === selectedCategory)
    : [];

  return (
    <>
      <section id="work" className="py-24 md:py-32 relative bg-[#050505] overflow-hidden min-h-screen flex items-start border-y border-white/5">
        <div className="max-w-[1200px] mx-auto px-6 relative w-full flex flex-col items-center pt-8">
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-col items-center text-center w-full mb-16"
          >
            <motion.div variants={itemVariants} className="flex items-center gap-4 mb-6">
              <div className="w-12 h-[1px] bg-[#ceab7a]"></div>
              <span className="text-[12px] font-medium text-[#ceab7a] tracking-[0.25em] uppercase min-w-[120px] text-center">
                <CinematicTypewriter words={["OUR WORK"]} typingSpeed={100} deletingSpeed={50} delayPause={6000} cursorClassName="bg-[#ceab7a]" />
              </span>
              <div className="w-12 h-[1px] bg-[#ceab7a]"></div>
            </motion.div>
            
            <motion.h2 variants={itemVariants} className="font-serif text-[32px] sm:text-[42px] md:text-[48px] leading-[1.2] mb-6 max-w-2xl">
              <span className="block text-white">Projects Built To Make</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#e8d3b5] via-[#ceab7a] to-[#a8824a]">
                Brands Impossible To Ignore.
              </span>
            </motion.h2>
            
            <motion.p variants={itemVariants} className="text-gray-400 text-[14px] md:text-[16px] leading-[1.6] max-w-xl">
              We design cinematic digital experiences that combine strategy, AI and creativity to help brands grow faster.
            </motion.p>
          </motion.div>

          {/* LEVEL 1: CATEGORY LISTING */}
          <motion.div 
            key="categories"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8 w-full"
          >
            {CATEGORIES.map((cat, idx) => (
              <motion.div 
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                variants={itemVariants}
                className={`group cursor-pointer rounded-[24px] overflow-hidden border border-[#ceab7a]/10 bg-[#0a0a0a] shadow-[0_0_40px_rgba(0,0,0,0.5)] flex flex-col h-full hover:border-[#ceab7a]/30 transition-all duration-500 ${idx === 3 ? 'lg:col-start-1 lg:col-span-1 lg:ml-auto' : ''} ${idx === 4 ? 'lg:col-start-2 lg:col-span-1 lg:mr-auto' : ''}`}
              >
                <div className="relative w-full aspect-[4/3] bg-[#050505] overflow-hidden p-6 sm:p-10 lg:p-6 pb-0 flex flex-col justify-end">
                  <div className="absolute top-6 right-6 w-12 h-12 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 group-hover:border-[#ceab7a]/50 flex items-center justify-center z-20 transition-colors duration-300">
                    <cat.icon size={20} className="text-[#ceab7a] drop-shadow-[0_0_8px_rgba(206,171,122,0.5)]" />
                  </div>
                  
                  <img onError={(e) => { e.currentTarget.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22400%22%20height%3D%22300%22%20style%3D%22background%3A%230a0a0a%22%3E%3Ctext%20fill%3D%22%23444%22%20x%3D%2250%25%22%20y%3D%2250%25%22%20font-family%3D%22sans-serif%22%20font-size%3D%2214%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3EImage%20Unavailable%3C%2Ftext%3E%3C%2Fsvg%3E'; e.currentTarget.onerror = null; }} 
                    src={cat.image} 
                    alt={cat.title} 
                    loading="lazy"
                    className="w-[95%] sm:w-[85%] lg:w-[95%] mx-auto object-contain object-bottom group-hover:scale-[1.03] transition-transform duration-700 ease-out z-10 drop-shadow-2xl translate-y-4 group-hover:translate-y-2 opacity-80 group-hover:opacity-100"
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent z-10" />
                </div>
                
                <div className="p-6 sm:p-8 pt-4 bg-[#0a0a0a] border-t border-white/5 relative z-20 flex flex-col flex-1">
                  <h3 className="text-[20px] sm:text-[24px] font-serif text-white mb-3 group-hover:text-[#ceab7a] transition-colors duration-300 uppercase tracking-wide">
                    {cat.title}
                  </h3>
                  <p className="text-gray-400 text-[14px] sm:text-[15px] leading-[1.6] mb-8 flex-1">
                    {cat.desc}
                  </p>
                  
                  <div className="flex items-center justify-between border-t border-white/5 pt-6 mt-2">
                    <span className="text-[#ceab7a] text-[14px] font-medium tracking-wide group-hover:tracking-widest transition-all duration-300 uppercase">
                      View Projects
                    </span>
                    <ArrowRight size={20} className="text-[#ceab7a] group-hover:translate-x-2 transition-transform duration-300" />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Stats Row */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="w-full mt-24 mb-10 grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {[
              { num: "15+", text: "Projects Completed", icon: Briefcase },
              { num: "8+", text: "Brands Empowered", icon: Users },
              { num: "2+", text: "Years of Experience", icon: Clock },
              { num: "24h", text: "Avg. Response Time", icon: CheckCircle }
            ].map((stat, i) => (
              <div key={i} className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-6 rounded-[20px] bg-[#0a0a0a] border border-[#ceab7a]/10 hover:border-[#ceab7a]/30 transition-colors text-center sm:text-left group cursor-pointer">
                <div className="w-12 h-12 rounded-full bg-[#ceab7a]/10 border border-[#ceab7a]/20 flex items-center justify-center shrink-0 group-hover:bg-[#ceab7a]/20 transition-colors">
                  <stat.icon size={20} className="text-[#ceab7a]" />
                </div>
                <div>
                  <h4 className="text-[20px] sm:text-[24px] font-bold text-white mb-1 leading-none">{stat.num}</h4>
                  <p className="text-[12px] text-gray-400 font-medium leading-tight">{stat.text.split(' ').map((t, idx) => <span key={idx} className="block sm:inline">{t} </span>)}</p>
                </div>
              </div>
            ))}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="w-full mt-6 py-12 px-6 rounded-[24px] bg-gradient-to-b from-[#0a0a0a] to-[#050505] border border-white/5 flex flex-col items-center text-center relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-[#ceab7a]/5 mix-blend-overlay pointer-events-none transition-opacity duration-500 opacity-50 group-hover:opacity-100" />
            <h3 className="text-[28px] sm:text-[36px] font-serif text-white mb-2 relative z-10">Have a project in mind?</h3>
            <p className="text-gray-400 text-[15px] mb-8 relative z-10">Let's build something amazing together.</p>
            <a href="#contact" className="px-8 py-4 bg-gradient-to-r from-[#e8d3b5] to-[#ceab7a] text-black font-bold rounded-full text-[14px] tracking-wide shadow-[0_0_30px_rgba(206,171,122,0.3)] hover:scale-105 hover:shadow-[0_0_40px_rgba(206,171,122,0.5)] transition-all duration-300 relative z-10 flex items-center gap-2">
              Start Your Project <ArrowRight size={18} />
            </a>
          </motion.div>

        </div>
      </section>

      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {/* LEVEL 2: CATEGORY PROJECT LIST */}
          {selectedCategory && !selectedProject && (
            <motion.div 
              key="category-modal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[9000] bg-[#050505] overflow-y-auto"
            >
              <div className="min-h-screen px-4 py-12 sm:p-6 md:p-12 flex flex-col items-center">
                <div className="w-full max-w-[1200px]">
                  <button 
                    onClick={() => setSelectedCategory(null)}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors w-fit group mb-10"
                  >
                    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-[#ceab7a] group-hover:text-black transition-colors">
                      <ChevronLeft size={20} />
                    </div>
                    <span className="text-sm font-medium tracking-wide uppercase">Back to Our Work</span>
                  </button>

                  <div className="mb-12 border-l-2 border-[#ceab7a] pl-6">
                    <h3 className="text-3xl font-serif text-white uppercase tracking-wide">
                      {CATEGORIES.find(c => c.id === selectedCategory)?.title} Projects
                    </h3>
                    <p className="text-gray-400 mt-2">
                      {CATEGORIES.find(c => c.id === selectedCategory)?.desc}
                    </p>
                  </div>

                  {filteredProjects.length === 0 ? (
                    <div className="w-full py-24 flex flex-col items-center justify-center text-center bg-white/[0.02] border border-white/5 rounded-3xl">
                      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                        <Monitor size={24} className="text-gray-500" />
                      </div>
                      <h4 className="text-xl font-serif text-white mb-2">No projects available yet.</h4>
                      <p className="text-gray-500">Check back soon for our latest work.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8 w-full pb-12">
                      {filteredProjects.map((project, idx) => (
                        <motion.div 
                          key={project.id}
                          onClick={() => openProject(project)}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="group cursor-pointer rounded-[24px] overflow-hidden border border-[#ceab7a]/10 bg-[#0a0a0a] shadow-[0_0_40px_rgba(0,0,0,0.5)] flex flex-col h-full hover:border-[#ceab7a]/30 transition-all duration-500"
                        >
                          {project.type === 'growth' || project.type === 'pod' ? (
                            <div className="relative w-full bg-[#050505]">
                              <div className="absolute top-8 left-8 w-10 h-10 rounded-xl bg-black/80 backdrop-blur-md border border-[#ceab7a]/30 flex items-center justify-center z-20">
                                <span className="text-[#ceab7a] font-serif text-[15px] font-bold">{`0${idx + 1}`.slice(-2)}</span>
                              </div>
                              <img onError={(e) => { e.currentTarget.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22400%22%20height%3D%22300%22%20style%3D%22background%3A%230a0a0a%22%3E%3Ctext%20fill%3D%22%23444%22%20x%3D%2250%25%22%20y%3D%2250%25%22%20font-family%3D%22sans-serif%22%20font-size%3D%2214%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3EImage%20Unavailable%3C%2Ftext%3E%3C%2Fsvg%3E'; e.currentTarget.onerror = null; }} 
                                src={project.image} 
                                alt={project.title} 
                                loading="lazy"
                                className="block w-full h-auto relative z-10 transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                                style={{ width: "100%", height: "auto", display: "block" }}
                              />
                            </div>
                          ) : (
                            <div className="relative w-full aspect-[4/3] bg-[#050505] overflow-hidden p-6 pb-0 flex flex-col justify-end">
                              <div className="absolute top-6 left-6 w-10 h-10 rounded-xl bg-black/60 backdrop-blur-md border border-[#ceab7a]/30 flex items-center justify-center z-20">
                                <span className="text-[#ceab7a] font-serif text-[15px] font-bold">{`0${idx + 1}`.slice(-2)}</span>
                              </div>
                              
                              <img onError={(e) => { e.currentTarget.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22400%22%20height%3D%22300%22%20style%3D%22background%3A%230a0a0a%22%3E%3Ctext%20fill%3D%22%23444%22%20x%3D%2250%25%22%20y%3D%2250%25%22%20font-family%3D%22sans-serif%22%20font-size%3D%2214%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3EImage%20Unavailable%3C%2Ftext%3E%3C%2Fsvg%3E'; e.currentTarget.onerror = null; }} 
                                src={project.image} 
                                alt={project.title} 
                                loading="lazy"
                                className="w-[95%] mx-auto object-contain object-bottom group-hover:scale-[1.03] transition-transform duration-700 ease-out z-10 drop-shadow-2xl translate-y-4 group-hover:translate-y-2"
                              />
                              
                              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent z-10" />
                            </div>
                          )}
                          
                          <div className="p-6 pt-4 bg-[#0a0a0a] border-t border-white/5 relative z-20 flex flex-col flex-1">
                            <h3 className="text-[20px] sm:text-[24px] font-serif text-white mb-3 group-hover:text-[#ceab7a] transition-colors duration-300">
                              {project.title}
                            </h3>
                            <p className="text-gray-400 text-[14px] leading-[1.6] mb-8 flex-1 line-clamp-3">
                              {project.desc}
                            </p>
                            
                            {project.tags && project.tags.length > 0 && (
                              <div className="flex flex-wrap items-center gap-2 mb-6">
                                {project.tags.slice(0, 3).map(tag => (
                                  <span key={tag} className="px-3 py-1 rounded-full border border-[#ceab7a]/20 bg-[#ceab7a]/[0.02] text-[#ceab7a] text-[11px] font-medium tracking-wide">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}

                            <div className="flex items-center justify-between border-t border-white/5 pt-6 mt-auto">
                              <span className="text-[#ceab7a] text-[13px] font-medium tracking-wide group-hover:tracking-widest transition-all duration-300 uppercase">
                                View Project
                              </span>
                              <ArrowRight size={18} className="text-[#ceab7a] group-hover:translate-x-2 transition-transform duration-300" />
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* LEVEL 3: PROJECT DETAIL PORTAL */}
          {selectedProject && (
            <motion.div 
              key="project-modal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={closeProject}
              className="fixed inset-0 z-[9999] bg-[#050505] overflow-y-auto"
            >
              <div className="min-h-screen px-4 py-12 sm:p-6 md:p-12 flex items-start justify-center">
                <motion.div 
                  initial={{ y: 50, opacity: 0, scale: 0.95 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ y: 20, opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  onClick={(e) => e.stopPropagation()}
                  className="relative w-full max-w-[1200px] bg-[#0a0a0a] border border-white/10 rounded-[24px] shadow-[0_0_80px_rgba(0,0,0,0.6)] overflow-hidden mt-0 sm:mt-8 mb-12"
                >
                  <div className="sticky top-0 z-30 flex items-start justify-between p-6 md:p-10 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-xl">
                    <div className="pr-12">
                      <span className="inline-block px-3 py-1 bg-[#ceab7a]/10 border border-[#ceab7a]/20 rounded-full text-[10px] font-medium tracking-[0.15em] text-[#ceab7a] uppercase mb-4 shadow-[0_0_15px_rgba(206,171,122,0.1)]">
                        {CATEGORIES.find(c => c.id === selectedProject.type)?.title || selectedProject.category}
                      </span>
                      <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-white mb-4 leading-[1.1]">
                        {selectedProject.title}
                      </h2>
                      <p className="text-gray-400 text-sm md:text-[15px] leading-relaxed max-w-2xl">
                        {selectedProject.desc}
                      </p>
                    </div>
                    
                    <button 
                      aria-label="Close Project Details"
                      onClick={closeProject}
                      className="absolute top-6 right-6 md:top-10 md:right-10 w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-all duration-300 hover:scale-110 text-white hover:text-[#ceab7a]"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <div className="p-6 md:p-10 bg-[#050505]">
                    {renderModalContent(selectedProject)}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
});

export default Portfolio;

