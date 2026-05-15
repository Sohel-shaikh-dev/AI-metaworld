import { useState, useEffect, memo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { X, ExternalLink, ArrowRight, Monitor, BarChart2, Rocket, Image as ImageIcon, ShoppingBag, Briefcase, Users, Clock, CheckCircle } from 'lucide-react';
import CinematicTypewriter from './CinematicTypewriter';

type ProjectModalContent = {
  // Common Fields
  clientName?: string;
  liveUrl?: string;
  deliverables?: string[];
  
  // Website Design
  heroLaptop?: string;
  desktopScreens?: string[];
  mobileScreens?: string[];
  
  // Branding & Identity
  logos?: string[];
  mockups?: string[];
  
  // AI Fashion Try-On
  transformations?: { before: string; after: string }[];
  
  // Google Business Growth
  metrics?: { label: string; value: string; trend?: string }[];
  dashboards?: string[];
  
  // Print-On-Demand
  products?: string[];
};

type Project = {
  id: number;
  type: 'website' | 'branding' | 'fashion' | 'growth' | 'pod';
  category: string;
  title: string;
  desc: string;
  image: string;
  className: string;
  modalContent: ProjectModalContent;
  tags: string[];
  icon: any;
  numberId: string;
};

import { supabase } from '../lib/supabase';

const defaultProjects: Project[] = [
  {
    id: 1,
    type: 'website',
    category: "Websites",
    title: "AI Metaworld Website",
    desc: "Luxury AI agency website with cinematic UI/UX and high-conversion experience.",
    image: "/Assets/service_web.webp",
    className: "",
    tags: ["UI/UX", "Web Design", "Development"],
    icon: Monitor,
    numberId: "01",
    modalContent: {
      clientName: "AI Metaworld",
      liveUrl: "https://example.com",
      deliverables: ["Custom UI/UX Design", "Responsive React Architecture", "CMS Integration", "Performance Optimization"],
      heroLaptop: "/Assets/service_web.webp",
      desktopScreens: ["/Assets/service_web.webp", "/Assets/service_web.webp"],
      mobileScreens: ["/Assets/service_web.webp", "/Assets/service_web.webp"]
    }
  },
  {
    id: 2,
    type: 'growth',
    category: "Power BI",
    title: "Power BI Dashboard",
    desc: "Interactive dashboards that turn complex data into clear insights and smart decisions.",
    image: "/Assets/service_powerbi_v2.webp",
    className: "",
    tags: ["Power BI", "Data Analysis", "Dashboard"],
    icon: BarChart2,
    numberId: "02",
    modalContent: {
      clientName: "Global Logistics Inc.",
      deliverables: ["Custom Power BI Dashboards", "Data Modeling", "Automated Reporting Systems"],
      metrics: [
        { label: "Data Accuracy", value: "99.9%", trend: "up" },
        { label: "Reporting Time", value: "-85%", trend: "down" },
        { label: "Business Insights", value: "15+", trend: "up" },
        { label: "ROI", value: "+210%", trend: "up" }
      ],
      dashboards: ["/Assets/service_powerbi_v2.webp", "/Assets/service_powerbi_v2.webp"]
    }
  },
  {
    id: 3,
    type: 'branding',
    category: "Branding",
    title: "Luxora Brand Identity",
    desc: "Complete brand identity design that builds trust, recognition and leaves a lasting impact.",
    image: "/Assets/service_branding.webp",
    className: "",
    tags: ["Branding", "Logo Design", "Identity"],
    icon: Rocket,
    numberId: "03",
    modalContent: {
      clientName: "Luxora Edge",
      deliverables: ["Brand Identity Strategy", "Logo Suite", "Typography System", "Merchandise Mockups"],
      logos: ["/Assets/service_branding.webp", "/Assets/service_branding.webp"],
      mockups: ["/Assets/service_branding.webp", "/Assets/service_branding.webp", "/Assets/service_branding.webp"]
    }
  },
  {
    id: 4,
    type: 'fashion',
    category: "AI Content",
    title: "AI Fashion Campaign",
    desc: "AI-powered fashion visuals that bring creativity, style and imagination to life.",
    image: "/Assets/service_aifashion_v2.webp",
    className: "",
    tags: ["AI Images", "Fashion", "Content"],
    icon: ImageIcon,
    numberId: "04",
    modalContent: {
      clientName: "ThreadFlow AI",
      deliverables: ["AI Model Generation", "Photorealistic Rendering", "Dynamic Lighting Match"],
      transformations: [
        { before: "/Assets/service_aifashion_v2.webp", after: "/Assets/service_aifashion_v2.webp" },
        { before: "/Assets/service_aifashion_v2.webp", after: "/Assets/service_aifashion_v2.webp" }
      ]
    }
  },
  {
    id: 5,
    type: 'pod',
    category: "Print-on-Demand",
    title: "Print-on-Demand Store",
    desc: "Custom POD solutions with unique designs that sell and scale effortlessly.",
    image: "/Assets/service_pod_v3.webp",
    className: "",
    tags: ["POD", "E-commerce", "Design"],
    icon: ShoppingBag,
    numberId: "05",
    modalContent: {
      clientName: "Street Culture Co.",
      deliverables: ["Custom Apparel Design", "Packaging Systems", "Print File Optimization"],
      products: ["/Assets/service_pod_v3.webp", "/Assets/service_pod_v3.webp", "/Assets/service_pod_v3.webp", "/Assets/service_pod_v3.webp"]
    }
  }
];

const Portfolio = memo(function Portfolio() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [normalizedProjects, setNormalizedProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedInnerProject, setSelectedInnerProject] = useState<any | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (!error && data) {
        setNormalizedProjects(data as Project[]);
        console.log("normalizedProjects", data); // Added console log for verification
      }
    };
    
    fetchProjects();

    const channel = supabase
      .channel('projects_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, () => {
        fetchProjects(); // Auto refresh on change
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Using only defaultProjects for the grid to preserve cinematic UI
  // The dynamic data will be injected directly into the modals of these default projects.

  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [selectedProject]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const renderModalContent = (project: Project) => {
    const relatedDynamicProjects = normalizedProjects.filter(p => p.type === project.type);
    
    // Unify all content into a single sections array
    const sections: any[] = [];
    
    // 1. Add the Default Demo Project as the first section
    sections.push({
      id: 'demo',
      title: project.type === 'website' ? "Project Overview" : 
             project.type === 'branding' ? "Brand System" : 
             project.type === 'fashion' ? "AI Transformation" : 
             project.type === 'growth' ? "Growth & Optimization" : "Merchandise Collection",
      desc: project.type === 'website' ? "A comprehensive digital experience designed to maximize conversion rates and establish premium brand authority. We architected a scalable, high-performance platform using modern web technologies." :
            project.type === 'branding' ? "A cohesive and memorable visual identity designed to stand out in a competitive market. From custom typography to packaging, every touchpoint reflects the brand's core values." :
            project.type === 'fashion' ? "Using cutting-edge AI visualization, we transformed flat apparel photos into stunning, photorealistic model shots without the need for an expensive photoshoot." :
            project.type === 'growth' ? "Through strategic Google Business optimization, localized SEO, and review management, we drastically increased visibility, customer trust, and organic lead generation." :
            "Premium quality custom apparel and merchandise systems designed for modern brands. We manage design, printing specs, and packaging aesthetics.",
      content: project.modalContent
    });

    // 2. Add all Dynamic Projects
    relatedDynamicProjects.forEach(dp => {
      const dyn = (dp as any).content || {};
      const mergedContent: any = { ...dyn, mainImage: dp.image };
      
      if (project.type === 'website') {
        mergedContent.desktopScreens = dyn.desktopScreens || [];
      } else if (project.type === 'branding') {
        mergedContent.logos = dyn.logos || [];
      } else if (project.type === 'fashion') {
        mergedContent.transformations = dyn.transformations || [];
      } else if (project.type === 'growth') {
        mergedContent.dashboards = dyn.dashboards || [];
      } else if (project.type === 'pod') {
        mergedContent.products = dyn.products || [];
      }

      sections.push({
        id: dp.id,
        title: dp.title,
        desc: dp.desc,
        content: mergedContent
      });
    });

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

    const getCoverImage = (section: any) => {
      const mc = section.content;
      if (mc.mainImage) return mc.mainImage;
      if (project.type === 'website') return mc.heroLaptop || mc.desktopScreens?.[0] || mc.mobileScreens?.[0];
      if (project.type === 'branding') return mc.mockups?.[0] || mc.logos?.[0];
      if (project.type === 'fashion') return mc.transformations?.[0]?.after || mc.transformations?.[0]?.before;
      if (project.type === 'growth') return mc.dashboards?.[0];
      if (project.type === 'pod') return mc.products?.[0];
      return '';
    };

    if (!selectedInnerProject) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
          {sections.map((section, idx) => {
            const coverImg = getCoverImage(section);
            return (
              <motion.div 
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => setSelectedInnerProject(section)}
                className="group cursor-pointer flex flex-col gap-4"
              >
                <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-white/5 bg-[#101010] relative">
                  <img src={coverImg || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"} alt={section.title} className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-300" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                    <span className="text-[#ceab7a] text-[11px] font-bold tracking-widest uppercase bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">View Project</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-serif text-white group-hover:text-[#ceab7a] transition-colors">{section.title}</h3>
                  {section.desc && <p className="text-gray-400 text-sm mt-1 line-clamp-2">{section.desc}</p>}
                </div>
              </motion.div>
            )
          })}
        </div>
      );
    }

    const section = selectedInnerProject;
    const mc = section.content;

    return (
      <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <button 
          onClick={() => setSelectedInnerProject(null)}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors w-fit group mb-4"
        >
          <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-[#ceab7a] group-hover:text-black transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
          </div>
          <span className="text-sm font-medium tracking-wide">Back to Projects</span>
        </button>

        {mc.videoUrl && (
          <div className="w-full aspect-video rounded-2xl overflow-hidden border border-white/10 bg-[#151515] relative">
            <video src={mc.videoUrl} controls autoPlay muted loop className="w-full h-full object-cover" />
          </div>
        )}

        {project.type === 'website' && (
          <div className="flex flex-col gap-12">
            {mc.heroLaptop && (
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="w-full aspect-[4/3] md:aspect-[21/9] rounded-2xl overflow-hidden border border-white/10 bg-[#151515] relative group">
                <img src={mc.heroLaptop} alt="Website Showcase" className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-1000" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
              </motion.div>
            )}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              <div className="lg:col-span-4 flex flex-col gap-6">
                <h3 className="text-2xl font-serif text-[#ceab7a]">{section.title}</h3>
                <p className="text-gray-400 text-[15px] leading-relaxed">{section.desc}</p>
                {renderDeliverables(mc.deliverables, mc.liveUrl)}
              </div>
              <div className="lg:col-span-8 flex flex-col gap-8">
                {mc.desktopScreens && mc.desktopScreens.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {mc.desktopScreens.map((img: string, i: number) => (
                      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} key={i} className="aspect-[4/3] rounded-xl overflow-hidden border border-white/5 bg-[#151515] group">
                        <img src={img} className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700" loading="lazy" />
                      </motion.div>
                    ))}
                  </div>
                )}
                {mc.mobileScreens && mc.mobileScreens.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {mc.mobileScreens.map((img: string, i: number) => (
                      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 + i * 0.1 }} key={i} className="aspect-[9/16] rounded-xl overflow-hidden border border-white/5 bg-[#151515] group">
                        <img src={img} className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700" loading="lazy" />
                      </motion.div>
                    ))}
                  </div>
                )}
                {(!mc.desktopScreens?.length && !mc.mobileScreens?.length && !mc.heroLaptop && mc.mainImage && !mc.videoUrl) && (
                  <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-3xl overflow-hidden bg-[#050505] flex justify-center items-center p-4">
                    <img src={mc.mainImage} className="w-full max-w-sm md:max-w-md h-auto rounded-2xl object-contain drop-shadow-2xl border border-white/5" />
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        )}

        {project.type === 'branding' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-4 flex flex-col gap-6">
              <h3 className="text-2xl font-serif text-[#ceab7a]">{section.title}</h3>
              <p className="text-gray-400 text-[15px] leading-relaxed">{section.desc}</p>
              {renderDeliverables(mc.deliverables, mc.liveUrl)}
            </div>
            <div className="lg:col-span-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 auto-rows-[200px] md:auto-rows-[250px]">
                {mc.logos?.map((img: string, i: number) => (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} key={`logo-${i}`} className={`rounded-2xl overflow-hidden border border-white/5 bg-[#050505] p-3 flex items-center justify-center`}>
                    <img src={img} className="max-w-full max-h-full object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500" loading="lazy" />
                  </motion.div>
                ))}
                {mc.mockups?.map((img: string, i: number) => (
                  <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 + i * 0.1 }} key={`mockup-${i}`} className={`rounded-2xl overflow-hidden border border-white/5 bg-[#151515] group ${i % 3 === 0 ? 'sm:row-span-2' : ''}`}>
                    <img src={img} className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700" loading="lazy" />
                  </motion.div>
                ))}
                {(!mc.logos?.length && !mc.mockups?.length && mc.mainImage && !mc.videoUrl) && (
                  <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="col-span-full rounded-3xl overflow-hidden bg-[#050505] flex justify-center items-center p-4">
                    <img src={mc.mainImage} className="w-full max-w-sm md:max-w-md h-auto rounded-2xl object-contain drop-shadow-2xl border border-white/5" />
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        )}

        {project.type === 'fashion' && (
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            <div className="w-full lg:w-[35%] flex flex-col gap-6">
              <h3 className="text-2xl font-serif text-[#ceab7a]">{section.title}</h3>
              <p className="text-gray-400 text-[15px] leading-relaxed">{section.desc}</p>
              {renderDeliverables(mc.deliverables, mc.liveUrl)}
            </div>
            <div className="w-full lg:w-[65%] flex flex-col gap-8 md:gap-12">
              {mc.transformations?.map((pair: any, i: number) => (
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.2 }} key={i} className="flex flex-col sm:flex-row gap-4 sm:gap-6 bg-white/[0.02] p-4 rounded-3xl border border-white/5">
                  <div className="flex-1 rounded-2xl overflow-hidden relative aspect-[3/4] bg-[#101010]">
                    <img src={pair.before} className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-700" loading="lazy" />
                    <div className="absolute top-4 left-4 px-3 py-1 bg-black/80 backdrop-blur-md rounded-full text-[10px] text-gray-300 uppercase tracking-widest border border-white/10">Before</div>
                  </div>
                  <div className="flex-none flex items-center justify-center sm:rotate-0 rotate-90">
                    <div className="w-8 h-8 rounded-full bg-[#ceab7a]/20 border border-[#ceab7a]/40 flex items-center justify-center text-[#ceab7a]">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </div>
                  </div>
                  <div className="flex-1 rounded-2xl overflow-hidden relative aspect-[3/4] border border-[#ceab7a]/30 shadow-[0_0_30px_rgba(206,171,122,0.15)] bg-[#101010]">
                    <img src={pair.after} className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-700" loading="lazy" />
                    <div className="absolute top-4 left-4 px-3 py-1 bg-[#ceab7a] rounded-full text-[10px] text-black font-bold uppercase tracking-widest shadow-lg">After</div>
                  </div>
                </motion.div>
              ))}

              {(!mc.transformations || mc.transformations.length === 0) && mc.mainImage && !mc.videoUrl && (
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-3xl overflow-hidden bg-[#050505] flex justify-center items-center p-4">
                  <img src={mc.mainImage} className="w-full max-w-sm md:max-w-md h-auto rounded-2xl object-contain drop-shadow-2xl border border-white/5" />
                </motion.div>
              )}
            </div>
          </div>
        )}

        {project.type === 'growth' && (
          <div className="flex flex-col gap-12">
            {mc.metrics && mc.metrics.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {mc.metrics.map((metric: any, i: number) => (
                  <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} key={i} className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col items-center justify-center text-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-b from-[#ceab7a]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <span className="text-[32px] md:text-[40px] font-serif text-white mb-2 tracking-tight drop-shadow-[0_0_15px_rgba(206,171,122,0.3)]">{metric.value}</span>
                    <span className="text-[11px] text-[#ceab7a] uppercase tracking-widest font-medium">{metric.label}</span>
                  </motion.div>
                ))}
              </div>
            )}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              <div className="lg:col-span-4 flex flex-col gap-6">
                <h3 className="text-2xl font-serif text-[#ceab7a]">{section.title}</h3>
                <p className="text-gray-400 text-[15px] leading-relaxed">{section.desc}</p>
                {renderDeliverables(mc.deliverables, mc.liveUrl)}
              </div>
              <div className="lg:col-span-8 grid grid-cols-1 gap-6">
                {mc.dashboards?.map((img: string, i: number) => (
                  <motion.div initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 + i * 0.1 }} key={i} className="aspect-video rounded-2xl overflow-hidden border border-white/5 bg-[#151515] relative group shadow-2xl">
                    <img src={img} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700 opacity-90 group-hover:opacity-100" loading="lazy" />
                    <div className="absolute inset-0 border border-white/10 rounded-2xl pointer-events-none mix-blend-overlay" />
                  </motion.div>
                ))}
                {(!mc.dashboards?.length && mc.mainImage && !mc.videoUrl) && (
                  <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-3xl overflow-hidden bg-[#050505] flex justify-center items-center p-4">
                    <img src={mc.mainImage} className="w-full max-w-sm md:max-w-md h-auto rounded-2xl object-contain drop-shadow-2xl border border-white/5" />
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        )}

        {project.type === 'pod' && (
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            <div className="w-full lg:w-[35%] flex flex-col gap-6">
              <h3 className="text-2xl font-serif text-[#ceab7a]">{section.title}</h3>
              <p className="text-gray-400 text-[15px] leading-relaxed">{section.desc}</p>
              {renderDeliverables(mc.deliverables, mc.liveUrl)}
            </div>
            <div className="w-full lg:w-[65%] grid grid-cols-1 sm:grid-cols-2 gap-6">
              {mc.products?.map((img: string, i: number) => (
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} key={i} className={`rounded-2xl overflow-hidden border border-white/5 bg-[#101010] group ${i === 0 ? 'sm:col-span-2 aspect-video' : 'aspect-square'}`}>
                  <img src={img} className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-700" loading="lazy" />
                </motion.div>
              ))}
              {(!mc.products?.length && mc.mainImage && !mc.videoUrl) && (
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="col-span-full rounded-3xl overflow-hidden bg-[#050505] flex justify-center items-center p-4">
                  <img src={mc.mainImage} className="w-full max-w-sm md:max-w-md h-auto rounded-2xl object-contain drop-shadow-2xl border border-white/5" />
                </motion.div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  const filters = ["All", "Websites", "Branding", "Power BI", "AI Content", "Print-on-Demand"];
  const filteredProjects = activeFilter === "All" 
    ? defaultProjects 
    : defaultProjects.filter(p => p.category === activeFilter);

  return (
    <>
      <section id="work" className="py-24 md:py-32 relative bg-[#050505] overflow-hidden min-h-screen flex items-center border-y border-white/5">
        <div className="max-w-[1200px] mx-auto px-6 relative w-full flex flex-col items-center">
          
          {/* Header */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="flex flex-col items-center text-center w-full mb-12"
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

          {/* Filter Tabs */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-wrap items-center justify-center gap-3 mb-16"
          >
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-6 py-2.5 rounded-full text-[13px] font-medium tracking-wide transition-all duration-300 ${
                  activeFilter === filter 
                    ? 'bg-gradient-to-r from-[#e8d3b5] to-[#ceab7a] text-black shadow-[0_0_20px_rgba(206,171,122,0.4)]' 
                    : 'bg-[#0a0a0a] text-gray-400 border border-white/10 hover:border-[#ceab7a]/50 hover:text-white'
                }`}
              >
                {filter}
              </button>
            ))}
          </motion.div>

          {/* Grid Cards (Flex wrapped for centered orphans) */}
          <motion.div 
            key={activeFilter}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="flex flex-wrap justify-center gap-6 xl:gap-8 w-full"
          >
            {filteredProjects.map((project) => (
              <motion.div 
                key={project.id}
                onClick={() => setSelectedProject(project)}
                variants={itemVariants}
                className="w-full lg:w-[calc(33.333%-1rem)] xl:w-[calc(33.333%-1.34rem)] group cursor-pointer rounded-[24px] overflow-hidden border border-[#ceab7a]/10 bg-[#0a0a0a] shadow-[0_0_40px_rgba(0,0,0,0.5)] flex flex-col h-full hover:border-[#ceab7a]/30 transition-all duration-500"
              >
                {/* Image & Top Info Area */}
                <div className="relative w-full aspect-[4/3] sm:aspect-[21/9] lg:aspect-[4/3] bg-[#050505] overflow-hidden p-6 sm:p-10 lg:p-6 pb-0 flex flex-col justify-end">
                  {/* Top Left Number */}
                  <div className="absolute top-6 left-6 sm:top-8 sm:left-8 w-12 h-12 rounded-xl bg-black/60 backdrop-blur-md border border-[#ceab7a]/30 flex items-center justify-center z-20">
                    <span className="text-[#ceab7a] font-serif text-[18px] font-bold">{project.numberId}</span>
                  </div>

                  {/* Top Right Icon */}
                  <div className="absolute top-6 right-6 sm:top-8 sm:right-8 w-12 h-12 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 group-hover:border-[#ceab7a]/50 flex items-center justify-center z-20 transition-colors duration-300">
                    <project.icon size={20} className="text-[#ceab7a] drop-shadow-[0_0_8px_rgba(206,171,122,0.5)]" />
                  </div>
                  
                  {/* Image */}
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    loading="lazy"
                    className="w-[95%] sm:w-[85%] lg:w-[95%] mx-auto object-contain object-bottom group-hover:scale-[1.03] transition-transform duration-700 ease-out z-10 drop-shadow-2xl translate-y-4 group-hover:translate-y-2"
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent z-10" />
                </div>
                
                {/* Bottom Content Area */}
                <div className="p-6 sm:p-10 lg:p-6 pt-4 bg-[#0a0a0a] border-t border-white/5 relative z-20 flex flex-col flex-1">
                  <h3 className="text-[24px] sm:text-[32px] lg:text-[22px] xl:text-[24px] font-serif text-white mb-3 group-hover:text-[#ceab7a] transition-colors duration-300">
                    {project.title}
                  </h3>
                  <p className="text-gray-400 text-[14px] sm:text-[15px] lg:text-[14px] leading-[1.6] mb-8 flex-1">
                    {project.desc}
                  </p>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap items-center gap-2 lg:gap-3 mb-8">
                    {project.tags.map(tag => (
                      <span key={tag} className="px-3 lg:px-4 py-1 lg:py-1.5 rounded-full border border-[#ceab7a]/20 bg-[#ceab7a]/[0.02] text-[#ceab7a] text-[11px] lg:text-[12px] font-medium tracking-wide">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* View Case Study */}
                  <div className="flex items-center justify-between border-t border-white/5 pt-6 mt-2">
                    <span className="text-[#ceab7a] text-[15px] font-medium tracking-wide group-hover:tracking-widest transition-all duration-300">
                      View Case Study
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
            className="w-full mt-20 mb-10 grid grid-cols-2 md:grid-cols-4 gap-4"
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

          {/* Final CTA */}
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

      {/* Interactive Project Modal Overlay */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {selectedProject && (
            <motion.div 
              key="project-modal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => {
                setSelectedProject(null);
                setSelectedInnerProject(null);
              }}
              className="fixed inset-0 z-[9999] bg-[#050505]/95 backdrop-blur-2xl overflow-y-auto"
            >
              <div className="min-h-screen px-4 py-12 sm:p-6 md:p-12 flex items-start justify-center">
                <motion.div 
                  initial={{ y: 50, opacity: 0, scale: 0.95 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ y: 20, opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} // smooth cinematic spring
                  onClick={(e) => e.stopPropagation()}
                  className="relative w-full max-w-[1200px] bg-[#0a0a0a] border border-white/10 rounded-[24px] shadow-[0_0_80px_rgba(0,0,0,0.6)] overflow-hidden mt-0 sm:mt-8 mb-12"
                >
                  {/* Modal Sticky Header */}
                  <div className="sticky top-0 z-30 flex items-start justify-between p-6 md:p-10 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-xl">
                    <div className="pr-12">
                      <span className="inline-block px-3 py-1 bg-[#ceab7a]/10 border border-[#ceab7a]/20 rounded-full text-[10px] font-medium tracking-[0.15em] text-[#ceab7a] uppercase mb-4 shadow-[0_0_15px_rgba(206,171,122,0.1)]">
                        {selectedProject.category}
                      </span>
                      <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-white mb-4 leading-[1.1]">
                        {selectedProject.title}
                      </h2>
                      <p className="text-gray-400 text-sm md:text-[15px] leading-relaxed max-w-2xl">
                        {selectedProject.desc}
                      </p>
                    </div>
                    
                    {/* Premium Close Button */}
                    <button 
                      aria-label="Close Project Details"
                      onClick={() => {
                        setSelectedProject(null);
                        setSelectedInnerProject(null);
                      }}
                      className="absolute top-6 right-6 md:top-10 md:right-10 w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-all duration-300 hover:scale-110 text-white hover:text-[#ceab7a]"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  {/* Dynamic Service-Specific Gallery Area */}
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
