import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LayoutDashboard, FolderKanban, Settings, LogOut, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DashboardLayout() {
  const { signOut, user } = useAuth();
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Projects', path: '/admin/projects', icon: FolderKanban },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-[#050505] text-white font-sans overflow-hidden">
      {/* Sidebar */}
      <motion.aside 
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        className="w-64 bg-[#0a0a0a] border-r border-white/5 flex flex-col justify-between"
      >
        <div>
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <Link to="/admin" className="flex items-center gap-3">
              <img src="/Assets/logo.png" alt="Logo" className="w-8 h-8 object-contain" />
              <span className="font-serif text-lg tracking-tight">AI Metaworld</span>
            </Link>
          </div>
          
          <div className="p-4 space-y-1 mt-4">
            <p className="px-4 text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Management</p>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-sm ${
                    isActive 
                      ? 'bg-[#ceab7a]/10 text-[#ceab7a] font-medium border border-[#ceab7a]/20' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon size={18} className={isActive ? 'text-[#ceab7a]' : 'text-gray-400'} />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="p-4 border-t border-white/5">
          <div className="px-4 py-3 mb-2 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#151515] flex items-center justify-center text-xs font-bold text-[#ceab7a]">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium truncate w-32">{user?.email}</span>
              <span className="text-[10px] text-gray-500 uppercase tracking-widest">Admin</span>
            </div>
          </div>
          <Link 
            to="/" 
            target="_blank"
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <ExternalLink size={16} /> View Live Site
          </Link>
          <button 
            onClick={signOut}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-xl transition-colors mt-1"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-[#050505] relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#ceab7a]/5 via-transparent to-transparent pointer-events-none" />
        <div className="p-8 lg:p-12 relative z-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
