import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { motion } from 'framer-motion';
import { FolderKanban, Monitor, Palette, Shirt, LineChart, Printer, Edit2, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

interface RecentProject {
  id: string | number;
  title: string;
  category: string;
  type: string;
  image?: string;
  created_at?: string;
}

export default function Overview() {
  const [stats, setStats] = useState({
    total: 0,
    website: 0,
    branding: 0,
    fashion: 0,
    growth: 0,
    pod: 0
  });
  const [recentProjects, setRecentProjects] = useState<RecentProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast.error('Failed to load dashboard data');
      } else if (data) {
        const counts = {
          total: data.length,
          website: data.filter(p => p.type === 'website').length,
          branding: data.filter(p => p.type === 'branding').length,
          fashion: data.filter(p => p.type === 'fashion').length,
          growth: data.filter(p => p.type === 'growth').length,
          pod: data.filter(p => p.type === 'pod').length
        };
        setStats(counts);
        setRecentProjects(data.slice(0, 4)); // Top 4 recent
      }
      setLoading(false);
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    { label: 'Total Projects', value: stats.total, icon: FolderKanban, color: 'text-white' },
    { label: 'Website Design', value: stats.website, icon: Monitor, color: 'text-blue-400' },
    { label: 'Branding', value: stats.branding, icon: Palette, color: 'text-pink-400' },
    { label: 'AI Fashion', value: stats.fashion, icon: Shirt, color: 'text-purple-400' },
    { label: 'Data Analysis', value: stats.growth, icon: LineChart, color: 'text-green-400' },
    { label: 'Print-On-Demand', value: stats.pod, icon: Printer, color: 'text-orange-400' },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24 min-h-[50vh]">
        <div className="w-8 h-8 border-2 border-[#ceab7a] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 sm:space-y-10 relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif text-white tracking-tight mb-1.5">Dashboard Overview</h1>
          <p className="text-gray-400 text-xs sm:text-sm">Welcome back. Here's a summary of your portfolio.</p>
        </div>
        <Link 
          to="/admin/projects/new" 
          className="bg-[#ceab7a] text-black font-bold text-xs sm:text-sm px-5 sm:px-6 py-3 rounded-xl uppercase tracking-widest hover:bg-white transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(206,171,122,0.2)] shrink-0 min-h-[44px]"
        >
          <Plus size={16} /> Add New Project
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-[#101010] border border-white/5 rounded-2xl p-4 sm:p-5 flex flex-col justify-between min-h-[110px] sm:min-h-[120px] hover:border-white/10 transition-colors"
            >
              <div className="flex items-center justify-between text-gray-500 mb-2 gap-1">
                <span className="text-[9px] sm:text-[10px] uppercase tracking-wider font-bold truncate" title={stat.label}>
                  {stat.label}
                </span>
                <Icon size={14} className={`${stat.color} shrink-0`} />
              </div>
              <div className="text-2xl sm:text-3xl font-serif text-white">{stat.value}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Projects */}
      <div className="space-y-4">
        <h2 className="text-base sm:text-lg font-serif text-white border-b border-white/5 pb-3">Recent Projects</h2>
        
        {recentProjects.length === 0 ? (
          <div className="text-center py-12 sm:py-16 border border-white/5 bg-[#101010] rounded-2xl px-4">
            <p className="text-gray-400 mb-4 text-sm">No projects yet. Let's create something beautiful.</p>
            <Link 
              to="/admin/projects/new"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#ceab7a] hover:text-white transition-colors"
            >
              <Plus size={14} /> Create your first project
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
            {recentProjects.map((project, idx) => (
              <motion.div 
                key={project.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-[#101010] border border-white/5 rounded-2xl overflow-hidden group hover:border-white/10 transition-colors flex flex-col"
              >
                <div className="aspect-video relative bg-[#151515] overflow-hidden shrink-0">
                  {project.image ? (
                    <img 
                      src={project.image} 
                      alt={project.title} 
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs uppercase tracking-widest">
                      No Image
                    </div>
                  )}
                  <div className="absolute top-2.5 left-2.5">
                    <span className="px-2 py-0.5 bg-black/80 backdrop-blur-md rounded-md text-[9px] text-gray-300 uppercase tracking-widest border border-white/10 font-medium">
                      {project.type}
                    </span>
                  </div>
                </div>
                <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between">
                  <div>
                    <h3 className="text-sm font-serif text-white mb-1 line-clamp-1" title={project.title}>
                      {project.title}
                    </h3>
                    <p className="text-[10px] text-[#ceab7a] uppercase tracking-widest font-medium mb-4 line-clamp-1">
                      {project.category}
                    </p>
                  </div>
                  
                  <Link 
                    to={`/admin/projects/edit/${project.id}`}
                    className="w-full text-center py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-medium text-white transition-colors flex items-center justify-center gap-2 min-h-[40px]"
                  >
                    <Edit2 size={13} /> Edit Project
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
