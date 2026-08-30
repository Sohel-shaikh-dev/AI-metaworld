import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { motion } from 'framer-motion';
import { FolderKanban, Monitor, Palette, Shirt, LineChart, Printer, Edit2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Overview() {
  const [stats, setStats] = useState({
    total: 0,
    website: 0,
    branding: 0,
    fashion: 0,
    growth: 0,
    pod: 0
  });
  const [recentProjects, setRecentProjects] = useState<any[]>([]);
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
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-2 border-[#ceab7a] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10 relative">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif text-white tracking-tight mb-2">Dashboard Overview</h1>
          <p className="text-gray-400 text-sm">Welcome back. Here's a summary of your portfolio.</p>
        </div>
        <Link 
          to="/admin/projects/new" 
          className="bg-[#ceab7a] text-black font-bold text-sm px-6 py-3 rounded-xl uppercase tracking-widest hover:bg-white transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(206,171,122,0.2)]"
        >
          + Add New Project
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-[#101010] border border-white/5 rounded-2xl p-6 flex flex-col justify-between h-32 hover:border-white/10 transition-colors"
            >
              <div className="flex items-center justify-between text-gray-500 mb-2">
                <span className="text-[10px] uppercase tracking-widest font-bold line-clamp-1">{stat.label}</span>
                <Icon size={14} className={stat.color} />
              </div>
              <div className="text-3xl font-serif text-white">{stat.value}</div>
            </motion.div>
          );
        })}
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-serif text-white border-b border-white/5 pb-4">Recent Projects</h2>
        
        {recentProjects.length === 0 ? (
          <div className="text-center py-12 border border-white/5 bg-[#101010] rounded-2xl">
            <p className="text-gray-400 mb-4 text-sm">No projects yet. Let's create something beautiful.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {recentProjects.map((project, idx) => (
              <motion.div 
                key={project.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-[#101010] border border-white/5 rounded-2xl overflow-hidden group hover:border-white/10 transition-colors"
              >
                <div className="aspect-video relative bg-[#151515] overflow-hidden">
                  {project.image ? (
                    <img src={project.image} alt={project.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs uppercase tracking-widest">No Image</div>
                  )}
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 bg-black/80 backdrop-blur-md rounded-lg text-[9px] text-gray-300 uppercase tracking-widest border border-white/10">
                      {project.type}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-sm font-serif text-white mb-1 line-clamp-1">{project.title}</h3>
                  <p className="text-[10px] text-[#ceab7a] uppercase tracking-widest font-medium mb-4">{project.category}</p>
                  
                  <Link 
                    to={`/admin/projects/edit/${project.id}`}
                    className="w-full text-center py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-medium text-white transition-colors flex items-center justify-center gap-2"
                  >
                    <Edit2 size={12} /> Edit Project
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
