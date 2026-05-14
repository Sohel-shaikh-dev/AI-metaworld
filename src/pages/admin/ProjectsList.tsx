import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function ProjectsList() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to load projects');
    } else {
      setProjects(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) {
      toast.error('Failed to delete project');
    } else {
      toast.success('Project deleted');
      setProjects(projects.filter(p => p.id !== id));
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif text-white tracking-tight mb-2">Projects</h1>
          <p className="text-gray-400 text-sm">Manage your portfolio case studies and dynamic content.</p>
        </div>
        <Link 
          to="/admin/projects/new" 
          className="bg-[#ceab7a] text-black font-bold text-sm px-6 py-3 rounded-xl uppercase tracking-widest hover:bg-white transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(206,171,122,0.2)]"
        >
          <Plus size={16} /> New Project
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#ceab7a] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-20 border border-white/5 bg-[#101010] rounded-2xl">
          <p className="text-gray-400 mb-4">No projects found. Add your first case study.</p>
          <Link to="/admin/projects/new" className="text-[#ceab7a] hover:text-white transition-colors text-sm font-bold uppercase tracking-widest">
            Create Project &rarr;
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {projects.map((project) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={project.id} 
              className="bg-[#101010] border border-white/5 rounded-2xl overflow-hidden group hover:border-white/10 transition-colors"
            >
              <div className="aspect-video relative overflow-hidden bg-[#151515]">
                {project.image ? (
                  <img src={project.image} alt={project.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-600 font-serif">No Image</div>
                )}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-black/80 backdrop-blur-md rounded-full text-[10px] text-gray-300 uppercase tracking-widest border border-white/10">
                    {project.type}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-lg font-serif text-white mb-1 line-clamp-1">{project.title}</h3>
                <p className="text-xs text-[#ceab7a] uppercase tracking-widest font-medium mb-4">{project.category}</p>
                <p className="text-sm text-gray-500 line-clamp-2 mb-6 h-10">{project.desc}</p>
                
                <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                  <Link 
                    to={`/admin/projects/edit/${project.id}`}
                    className="flex-1 text-center py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-white transition-colors flex items-center justify-center gap-2"
                  >
                    <Edit2 size={14} /> Edit
                  </Link>
                  <button 
                    onClick={() => handleDelete(project.id)}
                    className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                    title="Delete Project"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
