import { useState, useEffect, useCallback } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useSettings } from '../../contexts/SettingsContext';
import { supabase } from '../../lib/supabase';
import { 
  LayoutDashboard, FolderKanban, LogOut, ExternalLink, Palette, Sparkles, 
  User, BarChart, Phone, Share, PanelBottom, Settings, Inbox, Menu, X 
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function DashboardLayout() {
  const { signOut, user } = useAuth();
  const location = useLocation();
  const { requestNavigation } = useSettings();
  const [unreadCount, setUnreadCount] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      const { count, error } = await supabase
        .from('contact_messages')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'unread')
        .eq('is_archived', false);
      
      if (!error && count !== null) {
        setUnreadCount(count);
      }
    };
    
    fetchUnreadCount();

    const channel = supabase
      .channel('public:contact_messages')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'contact_messages' },
        () => { fetchUnreadCount(); }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Close sidebar on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && sidebarOpen) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sidebarOpen]);

  // Close sidebar automatically on screen resize to desktop (>= 1024px)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && sidebarOpen) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [sidebarOpen]);

  // Lock body scroll when mobile sidebar is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [sidebarOpen]);

  // Navigation handler that closes mobile sidebar
  const handleNavClick = useCallback((path: string) => {
    setSidebarOpen(false);
    requestNavigation(path);
  }, [requestNavigation]);

  const managementNavItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
    { name: 'Projects', path: '/admin/projects', icon: FolderKanban, exact: false },
    { name: 'Messages', path: '/admin/messages', icon: Inbox, exact: false },
  ];

  const settingsNavItems = [
    { name: 'Brand', path: '/admin/brand', icon: Palette },
    { name: 'Hero', path: '/admin/hero', icon: Sparkles },
    { name: 'About', path: '/admin/about', icon: User },
    { name: 'Stats', path: '/admin/stats', icon: BarChart },
    { name: 'Contact', path: '/admin/contact', icon: Phone },
    { name: 'Social', path: '/admin/social', icon: Share },
    { name: 'Footer', path: '/admin/footer', icon: PanelBottom },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  // Reusable navigation body for both desktop and mobile drawer
  const renderNavContent = (isMobile: boolean = false) => (
    <div className="flex flex-col h-full justify-between">
      <div className="flex flex-col flex-1 min-h-0">
        {/* Brand header */}
        <div className="p-5 sm:p-6 border-b border-white/5 flex items-center justify-between shrink-0">
          <a 
            href="/admin" 
            onClick={(e) => { e.preventDefault(); handleNavClick('/admin'); }} 
            className="flex items-center gap-3 group"
          >
            <img src="/Assets/logo.webp" alt="AI Metaworld Logo" className="w-8 h-8 object-contain" />
            <div className="flex flex-col">
              <span className="font-serif text-lg tracking-tight text-white group-hover:text-[#ceab7a] transition-colors">
                AI Metaworld
              </span>
              <span className="text-[9px] uppercase tracking-widest text-gray-500 font-semibold">Admin Panel</span>
            </div>
          </a>
          {isMobile && (
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 -mr-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center"
              aria-label="Close sidebar menu"
            >
              <X size={20} />
            </button>
          )}
        </div>
        
        {/* Scrollable Navigation Items */}
        <div className="p-4 space-y-1 mt-2 flex-1 overflow-y-auto custom-scrollbar">
          <p className="px-4 text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Management</p>
          {managementNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact ? location.pathname === item.path : location.pathname.startsWith(item.path);
            return (
              <a
                key={item.name}
                href={item.path}
                onClick={(e) => { e.preventDefault(); handleNavClick(item.path); }}
                className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 text-sm min-h-[44px] ${
                  isActive 
                    ? 'bg-[#ceab7a]/10 text-[#ceab7a] font-medium border border-[#ceab7a]/20' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} className={isActive ? 'text-[#ceab7a]' : 'text-gray-400'} />
                  <span>{item.name}</span>
                </div>
                {item.name === 'Messages' && unreadCount > 0 && (
                  <span className="bg-[#ceab7a] text-black text-[10px] font-bold px-2 py-0.5 rounded-full shadow-[0_0_10px_rgba(206,171,122,0.4)]">
                    {unreadCount}
                  </span>
                )}
              </a>
            );
          })}

          <p className="px-4 text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 mt-6">Settings</p>
          {settingsNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
            return (
              <a
                key={item.name}
                href={item.path}
                onClick={(e) => { e.preventDefault(); handleNavClick(item.path); }}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 text-sm min-h-[42px] ${
                  isActive 
                    ? 'bg-[#ceab7a]/10 text-[#ceab7a] font-medium border border-[#ceab7a]/20' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-[#ceab7a]' : 'text-gray-400'} />
                <span>{item.name}</span>
              </a>
            );
          })}
        </div>
      </div>

      {/* Footer / Account section */}
      <div className="p-4 border-t border-white/5 shrink-0 bg-[#080808]">
        <div className="px-3 py-2.5 mb-2 flex items-center gap-3 bg-white/[0.02] rounded-xl border border-white/5">
          <div className="w-8 h-8 rounded-full bg-[#151515] border border-white/10 flex items-center justify-center text-xs font-bold text-[#ceab7a] shrink-0">
            {user?.email?.charAt(0).toUpperCase() || 'A'}
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-xs font-medium truncate text-gray-200" title={user?.email || ''}>
              {user?.email || 'admin@aimetaworld.com'}
            </span>
            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">Administrator</span>
          </div>
        </div>
        <Link 
          to="/" 
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors min-h-[40px]"
        >
          <ExternalLink size={16} /> View Live Site
        </Link>
        <button 
          onClick={() => {
            setSidebarOpen(false);
            requestNavigation(signOut);
          }}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-xl transition-colors mt-1 min-h-[44px]"
        >
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#050505] text-white font-sans overflow-hidden">
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:flex w-64 bg-[#0a0a0a] border-r border-white/5 flex-col justify-between shrink-0 h-screen select-none">
        {renderNavContent(false)}
      </aside>

      {/* Mobile / Tablet Drawer Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
              aria-hidden="true"
            />

            {/* Slide-out Drawer */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-[#0a0a0a] border-r border-white/10 flex flex-col justify-between shadow-2xl h-full lg:hidden overflow-hidden select-none"
              role="dialog"
              aria-modal="true"
              aria-label="Admin Navigation Menu"
            >
              {renderNavContent(true)}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Mobile / Tablet Top Header Bar */}
        <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 h-16 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/5 shrink-0 select-none">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 -ml-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition-colors flex items-center justify-center min-w-[44px] min-h-[44px]"
              aria-label="Open navigation menu"
              aria-expanded={sidebarOpen}
            >
              <Menu size={22} />
            </button>
            <a 
              href="/admin" 
              onClick={(e) => { e.preventDefault(); handleNavClick('/admin'); }}
              className="flex items-center gap-2.5"
            >
              <img src="/Assets/logo.webp" alt="AI Metaworld" className="w-7 h-7 object-contain" />
              <span className="font-serif text-base tracking-tight text-white">AI Metaworld</span>
            </a>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <a
                href="/admin/messages"
                onClick={(e) => { e.preventDefault(); handleNavClick('/admin/messages'); }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#ceab7a]/10 border border-[#ceab7a]/20 text-[#ceab7a] text-xs font-medium"
                title={`${unreadCount} unread message${unreadCount > 1 ? 's' : ''}`}
              >
                <Inbox size={14} />
                <span>{unreadCount}</span>
              </a>
            )}
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center"
              title="View Live Site"
            >
              <ExternalLink size={18} />
            </Link>
          </div>
        </header>

        {/* Scrollable Page Outlet */}
        <main className="flex-1 overflow-y-auto bg-[#050505] relative custom-scrollbar">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#ceab7a]/5 via-transparent to-transparent pointer-events-none" />
          <div className="p-4 sm:p-6 lg:p-8 xl:p-10 relative z-10 max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
