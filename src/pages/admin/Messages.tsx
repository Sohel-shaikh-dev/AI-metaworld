import { useState, useEffect, useMemo } from 'react';
import { 
  Inbox, Search, Star, RefreshCw
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { ContactMessage, MessageStatus } from '../../types/messages';
import MessageDetailModal from '../../components/admin/MessageDetailModal';

export default function Messages() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread' | 'starred' | 'replied' | 'archived'>('all');
  
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  const fetchMessages = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setMessages(data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    let isMounted = true;
    const loadInitialMessages = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (isMounted && !error && data) {
        setMessages(data);
      }
      if (isMounted) {
        setIsLoading(false);
      }
    };

    loadInitialMessages();

    const channel = supabase
      .channel('public:contact_messages_list')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'contact_messages' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setMessages(prev => [payload.new as ContactMessage, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setMessages(prev => prev.map(m => m.id === payload.new.id ? payload.new as ContactMessage : m));
            setSelectedMessage(prev => (prev?.id === payload.new.id ? (payload.new as ContactMessage) : prev));
          } else if (payload.eventType === 'DELETE') {
            setMessages(prev => prev.filter(m => m.id !== payload.old.id));
            setSelectedMessage(prev => (prev?.id === payload.old.id ? null : prev));
          }
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  const handleUpdateStatus = async (id: string, status: MessageStatus) => {
    // Optimistic update
    setMessages(prev => prev.map(m => m.id === id ? { ...m, status } : m));
    if (selectedMessage?.id === id) {
      setSelectedMessage(prev => prev ? { ...prev, status } : null);
    }
    await supabase.from('contact_messages').update({ status }).eq('id', id);
  };

  const handleToggleStar = async (id: string, current: boolean) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, is_starred: !current } : m));
    if (selectedMessage?.id === id) {
      setSelectedMessage(prev => prev ? { ...prev, is_starred: !current } : null);
    }
    await supabase.from('contact_messages').update({ is_starred: !current }).eq('id', id);
  };

  const handleToggleArchive = async (id: string, current: boolean) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, is_archived: !current } : m));
    if (selectedMessage?.id === id) {
      setSelectedMessage(prev => prev ? { ...prev, is_archived: !current } : null);
    }
    await supabase.from('contact_messages').update({ is_archived: !current }).eq('id', id);
  };

  const handleDelete = async (id: string) => {
    setMessages(prev => prev.filter(m => m.id !== id));
    await supabase.from('contact_messages').delete().eq('id', id);
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    const today = new Date();
    const isToday = date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
    
    if (isToday) {
      return `Today, ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Derived state
  const activeMessages = messages.filter(m => !m.is_archived);
  const totalCount = activeMessages.length;
  const unreadCount = activeMessages.filter(m => m.status === 'unread').length;
  const starredCount = activeMessages.filter(m => m.is_starred).length;
  const repliedCount = activeMessages.filter(m => m.status === 'replied').length;

  const filteredMessages = useMemo(() => {
    let result = messages;

    // Filter by type
    if (filter === 'all') result = result.filter(m => !m.is_archived);
    else if (filter === 'unread') result = result.filter(m => !m.is_archived && m.status === 'unread');
    else if (filter === 'starred') result = result.filter(m => !m.is_archived && m.is_starred);
    else if (filter === 'replied') result = result.filter(m => !m.is_archived && m.status === 'replied');
    else if (filter === 'archived') result = result.filter(m => m.is_archived);

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(m => 
        m.name.toLowerCase().includes(q) || 
        m.email.toLowerCase().includes(q) || 
        (m.phone && m.phone.toLowerCase().includes(q)) || 
        m.service.toLowerCase().includes(q) || 
        m.message.toLowerCase().includes(q)
      );
    }

    return result;
  }, [messages, filter, searchQuery]);

  return (
    <div className="flex-1 flex flex-col space-y-6 sm:space-y-8 relative pb-10">
      <div className="w-full flex flex-col space-y-6 sm:space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif text-white tracking-tight mb-1.5">Messages & Inquiries</h1>
            <p className="text-gray-400 text-xs sm:text-sm">Manage customer inquiries and conversations.</p>
          </div>
          <button 
            onClick={fetchMessages}
            className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors shrink-0"
            title="Refresh messages"
            aria-label="Refresh messages"
          >
            <RefreshCw size={18} className={isLoading ? "animate-spin text-[#ceab7a]" : ""} />
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-4 sm:p-5 flex flex-col justify-between min-h-[90px] sm:min-h-[100px]">
            <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-1">Total</p>
            <p className="text-2xl sm:text-3xl font-serif text-white">{totalCount}</p>
          </div>
          <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-4 sm:p-5 relative overflow-hidden flex flex-col justify-between min-h-[90px] sm:min-h-[100px]">
            <div className="relative z-10">
              <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-[#ceab7a] mb-1">Unread</p>
              <p className="text-2xl sm:text-3xl font-serif text-white">{unreadCount}</p>
            </div>
            {unreadCount > 0 && (
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#ceab7a]/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
            )}
          </div>
          <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-4 sm:p-5 flex flex-col justify-between min-h-[90px] sm:min-h-[100px]">
            <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-1">Starred</p>
            <p className="text-2xl sm:text-3xl font-serif text-white">{starredCount}</p>
          </div>
          <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-4 sm:p-5 flex flex-col justify-between min-h-[90px] sm:min-h-[100px]">
            <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-1">Replied</p>
            <p className="text-2xl sm:text-3xl font-serif text-white">{repliedCount}</p>
          </div>
        </div>

        {/* Controls: Filter Tabs & Search */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
          <div className="flex bg-[#0a0a0a] p-1 rounded-xl border border-white/5 overflow-x-auto custom-scrollbar">
            {(['all', 'unread', 'starred', 'replied', 'archived'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3.5 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap min-h-[38px] ${
                  filter === f
                    ? 'bg-white/10 text-white font-semibold'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
                {f === 'unread' && unreadCount > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.2 bg-[#ceab7a] text-black text-[10px] font-bold rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64 md:w-72">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#ceab7a]/50 min-h-[42px] transition-colors"
            />
          </div>
        </div>

        {/* Inbox Messages List Container */}
        <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden flex flex-col relative min-h-[350px]">
          
          {isLoading && messages.length === 0 && (
            <div className="p-16 flex flex-col items-center justify-center bg-[#0a0a0a]">
              <RefreshCw size={24} className="text-[#ceab7a] animate-spin mb-3" />
              <p className="text-gray-400 text-sm">Loading inquiries...</p>
            </div>
          )}

          {!isLoading && filteredMessages.length === 0 && (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 sm:p-12">
              <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mb-3 text-gray-500">
                <Inbox size={24} />
              </div>
              <p className="text-white font-medium mb-1 text-base">
                {searchQuery ? 'No search results' : filter !== 'all' ? `No ${filter} inquiries` : 'No customer inquiries yet'}
              </p>
              <p className="text-gray-500 text-xs sm:text-sm max-w-sm leading-relaxed">
                {searchQuery 
                  ? 'Try adjusting your search terms to find what you are looking for.' 
                  : 'Messages submitted through your website contact form will automatically appear here.'}
              </p>
            </div>
          )}

          <div className="divide-y divide-white/5">
            {filteredMessages.map((msg) => (
              <div 
                key={msg.id}
                onClick={() => {
                  setSelectedMessage(msg);
                  if (msg.status === 'unread') {
                    handleUpdateStatus(msg.id, 'read');
                  }
                }}
                className={`group flex items-start gap-3 sm:gap-4 p-4 sm:p-5 cursor-pointer transition-colors ${
                  msg.status === 'unread' ? 'bg-white/[0.025] hover:bg-white/[0.05]' : 'hover:bg-white/[0.02]'
                }`}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedMessage(msg);
                    if (msg.status === 'unread') {
                      handleUpdateStatus(msg.id, 'read');
                    }
                  }
                }}
              >
                {/* Status Indicator Dot */}
                <div className="pt-1.5 shrink-0">
                  <div className={`w-2.5 h-2.5 rounded-full ${msg.status === 'unread' ? 'bg-[#ceab7a] shadow-[0_0_8px_rgba(206,171,122,0.6)]' : 'bg-transparent border border-gray-700'}`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <h4 className={`text-sm sm:text-base truncate ${msg.status === 'unread' ? 'text-white font-semibold' : 'text-gray-300 font-medium'}`}>
                        {msg.name}
                      </h4>
                      {msg.is_starred && <Star size={14} className="text-[#ceab7a] fill-[#ceab7a] shrink-0" />}
                    </div>
                    <span className="text-[11px] sm:text-xs text-gray-500 whitespace-nowrap shrink-0">
                      {formatDate(msg.created_at)}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-3 mb-1.5">
                    <span className={`text-[10px] sm:text-[11px] px-2 py-0.5 rounded uppercase tracking-wider font-bold shrink-0 ${
                      msg.status === 'unread' ? 'bg-[#ceab7a]/10 text-[#ceab7a] border border-[#ceab7a]/20' : 'bg-white/5 text-gray-400'
                    }`}>
                      {msg.service}
                    </span>
                    <span className="text-xs text-gray-400 truncate max-w-[200px] sm:max-w-none">
                      {msg.email}
                    </span>
                    {msg.phone && (
                      <span className="text-xs text-gray-500 hidden sm:inline">
                        • {msg.phone}
                      </span>
                    )}
                  </div>

                  <p className={`text-xs sm:text-sm line-clamp-2 mt-1 leading-relaxed ${msg.status === 'unread' ? 'text-gray-300' : 'text-gray-500'}`}>
                    {msg.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {selectedMessage && (
        <MessageDetailModal
          message={selectedMessage}
          isOpen={!!selectedMessage}
          onClose={() => setSelectedMessage(null)}
          onUpdateStatus={handleUpdateStatus}
          onToggleStar={handleToggleStar}
          onToggleArchive={handleToggleArchive}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
