import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, AlertTriangle, X, Search, Filter, FolderKanban } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function ProjectsList() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  // Custom Modal States
  const [projectToDelete, setProjectToDelete] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  // Lock body scroll when delete confirmation modal is open
  useEffect(() => {
    if (projectToDelete) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [projectToDelete]);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && projectToDelete && !isDeleting) {
        setProjectToDelete(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [projectToDelete, isDeleting]);

  const confirmDelete = (project: any) => {
    setProjectToDelete(project);
  };

  const executeDelete = async () => {
    if (!projectToDelete) return;
    
    setIsDeleting(true);
    const { error } = await supabase.from('projects').delete().eq('id', projectToDelete.id);
    
    if (error) {
      toast.error('Failed to delete project');
      setIsDeleting(false);
    } else {
      toast.success('Project deleted');
      setProjects(projects.filter(p => p.id !== projectToDelete.id));
      setProjectToDelete(null);
      setIsDeleting(false);
    }
  };

  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            p.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = typeFilter === 'all' || p.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [projects, searchQuery, typeFilter]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 sm:space-y-8 relative pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif text-white tracking-tight mb-1.5">Projects</h1>
          <p className="text-gray-400 text-xs sm:text-sm">Manage your portfolio case studies and dynamic content.</p>
        </div>
        <Link 
          to="/admin/projects/new" 
          className="bg-[#ceab7a] text-black font-bold text-xs sm:text-sm px-5 sm:px-6 py-3 rounded-xl uppercase tracking-widest hover:bg-white transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(206,171,122,0.2)] shrink-0 min-h-[44px]"
        >
          <Plus size={16} /> New Project
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 bg-[#101010] p-3 sm:p-4 rounded-2xl border border-white/5">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
          <input 
            type="text" 
            placeholder="Search projects..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#151515] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-[#ceab7a]/50 min-h-[44px]"
          />
        </div>
        <div className="relative shrink-0 sm:w-52">
          <Filter size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full bg-[#151515] border border-white/10 rounded-xl pl-11 pr-8 py-3 text-sm text-white focus:outline-none focus:border-[#ceab7a]/50 appearance-none cursor-pointer min-h-[44px]"
            aria-label="Filter projects by category"
          >
            <option value="all">All Types</option>
            <option value="website">Website Design</option>
            <option value="branding">Branding</option>
            <option value="fashion">AI Fashion</option>
            <option value="growth">Data Analysis</option>
            <option value="pod">Print-On-Demand</option>
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-20 min-h-[40vh]">
          <div className="w-8 h-8 border-2 border-[#ceab7a] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center py-16 sm:py-24 border border-white/5 bg-[#101010] rounded-2xl flex flex-col items-center justify-center p-6">
          <FolderKanban size={48} className="text-gray-600 mb-4" />
          <p className="text-gray-300 text-lg mb-2 font-medium">No projects found</p>
          <p className="text-gray-500 text-xs sm:text-sm mb-6 max-w-md leading-relaxed">
            {searchQuery || typeFilter !== 'all' 
              ? 'No projects match your current search or filter criteria.' 
              : 'Create your first portfolio project to get started and showcase your work to the world.'}
          </p>
          {searchQuery || typeFilter !== 'all' ? (
            <button 
              onClick={() => { setSearchQuery(''); setTypeFilter('all'); }} 
              className="px-5 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-[#ceab7a] hover:text-white transition-colors text-xs font-bold uppercase tracking-widest min-h-[40px]"
            >
              Clear Filters
            </button>
          ) : (
            <Link 
              to="/admin/projects/new" 
              className="px-6 py-3 bg-[#ceab7a] text-black font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-white transition-all shadow-[0_0_20px_rgba(206,171,122,0.2)]"
            >
              Create Project &rarr;
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {filteredProjects.map((project) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={project.id} 
              className="bg-[#101010] border border-white/5 rounded-2xl overflow-hidden group hover:border-white/10 transition-colors flex flex-col"
            >
              <div className="aspect-video relative overflow-hidden bg-[#151515] shrink-0">
                {project.image ? (
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs font-medium tracking-widest uppercase">
                    No Image
                  </div>
                )}
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 bg-black/80 backdrop-blur-md rounded-lg text-[9px] text-gray-300 uppercase tracking-widest border border-white/10 font-bold">
                    {project.type}
                  </span>
                </div>
              </div>
              
              <div className="p-4 sm:p-5 flex flex-col flex-1">
                <h3 className="text-base font-serif text-white mb-1 line-clamp-1" title={project.title}>
                  {project.title}
                </h3>
                <p className="text-[10px] text-[#ceab7a] uppercase tracking-widest font-bold mb-2.5">
                  {project.category}
                </p>
                <p className="text-xs text-gray-400 line-clamp-2 flex-1 mb-5 leading-relaxed">
                  {project.desc}
                </p>
                
                <div className="flex items-center gap-2 pt-4 border-t border-white/5 mt-auto">
                  <Link 
                    to={`/admin/projects/edit/${project.id}`}
                    className="flex-1 text-center py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-medium text-white transition-colors flex items-center justify-center gap-2 min-h-[42px]"
                  >
                    <Edit2 size={14} /> Edit
                  </Link>
                  <button 
                    onClick={() => confirmDelete(project)}
                    className="p-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-colors min-h-[42px] min-w-[42px] flex items-center justify-center"
                    title="Delete Project"
                    aria-label={`Delete project ${project.title}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {projectToDelete && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => !isDeleting && setProjectToDelete(null)}
              aria-hidden="true"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.5)] overflow-hidden"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
            >
              <div className="p-6 sm:p-8">
                <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-5">
                  <AlertTriangle className="text-red-500" size={24} />
                </div>
                
                <h2 id="modal-title" className="text-xl sm:text-2xl font-serif text-white mb-2">Delete Project?</h2>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  Are you sure you want to delete <span className="text-white font-medium">"{projectToDelete.title}"</span>?
                  <br className="mb-2" />
                  This project and its media assets will be permanently removed. This action cannot be undone.
                </p>

                <div className="flex items-center gap-3 mt-6">
                  <button
                    onClick={() => setProjectToDelete(null)}
                    disabled={isDeleting}
                    className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={executeDelete}
                    disabled={isDeleting}
                    className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(239,68,68,0.3)] min-h-[44px]"
                  >
                    {isDeleting ? 'Deleting...' : 'Delete Project'}
                  </button>
                </div>
              </div>
              
              <button 
                onClick={() => setProjectToDelete(null)}
                disabled={isDeleting}
                className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors disabled:opacity-50 min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg"
                aria-label="Close dialog"
              >
                <X size={20} />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
