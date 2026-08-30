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

    console.log("Messages SELECT response:", data);
    if (error) console.error("Messages SELECT error:", error);

    if (!error && data) {
      setMessages(data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchMessages();

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
            if (selectedMessage?.id === payload.new.id) {
              setSelectedMessage(payload.new as ContactMessage);
            }
          } else if (payload.eventType === 'DELETE') {
            setMessages(prev => prev.filter(m => m.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
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
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#050505] p-6 lg:p-10 relative">
      <div className="max-w-7xl mx-auto w-full h-full flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-shrink-0">
          <div>
            <h1 className="text-3xl font-serif text-white tracking-tight mb-2">Messages</h1>
            <p className="text-gray-400 text-sm">Manage customer inquiries and conversations.</p>
          </div>
          <button 
            onClick={fetchMessages}
            className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Refresh"
          >
            <RefreshCw size={18} className={isLoading ? "animate-spin" : ""} />
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 flex-shrink-0">
          <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-5">
            <p className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-2">Total</p>
            <p className="text-3xl font-serif text-white">{totalCount}</p>
          </div>
          <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-5 relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-[11px] font-bold uppercase tracking-widest text-[#ceab7a] mb-2">Unread</p>
              <p className="text-3xl font-serif text-white">{unreadCount}</p>
            </div>
            {unreadCount > 0 && (
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#ceab7a]/10 rounded-full blur-2xl -mr-10 -mt-10" />
            )}
          </div>
          <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-5">
            <p className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-2">Starred</p>
            <p className="text-3xl font-serif text-white">{starredCount}</p>
          </div>
          <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-5">
            <p className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-2">Replied</p>
            <p className="text-3xl font-serif text-white">{repliedCount}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6 flex-shrink-0">
          <div className="flex bg-[#0a0a0a] p-1 rounded-xl border border-white/5 w-full md:w-auto overflow-x-auto custom-scrollbar">
            {['all', 'unread', 'starred', 'replied', 'archived'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  filter === f
                    ? 'bg-white/10 text-white'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#ceab7a]/50"
            />
          </div>
        </div>

        {/* Inbox List */}
        <div className="flex-1 bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden flex flex-col relative">
          
          {isLoading && messages.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a0a] z-10">
              <RefreshCw size={24} className="text-[#ceab7a] animate-spin" />
            </div>
          )}

          {!isLoading && filteredMessages.length === 0 && (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-10">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                <Inbox size={24} className="text-gray-500" />
              </div>
              <p className="text-white font-medium mb-1">
                {searchQuery ? 'No search results' : filter !== 'all' ? `No ${filter} inquiries` : 'No customer inquiries yet'}
              </p>
              <p className="text-gray-500 text-sm max-w-sm">
                {searchQuery 
                  ? 'Try adjusting your search terms to find what you are looking for.' 
                  : 'Messages submitted through your website contact form will automatically appear here.'}
              </p>
            </div>
          )}

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {filteredMessages.map((msg) => (
              <div 
                key={msg.id}
                onClick={() => {
                  setSelectedMessage(msg);
                  if (msg.status === 'unread') {
                    handleUpdateStatus(msg.id, 'read');
                  }
                }}
                className={`group flex items-start gap-4 p-5 border-b border-white/5 cursor-pointer transition-colors ${
                  msg.status === 'unread' ? 'bg-white/[0.02] hover:bg-white/[0.04]' : 'hover:bg-white/[0.02]'
                }`}
              >
                {/* Status Indicator */}
                <div className="pt-1">
                  <div className={`w-2.5 h-2.5 rounded-full ${msg.status === 'unread' ? 'bg-[#ceab7a] shadow-[0_0_8px_rgba(206,171,122,0.5)]' : 'bg-transparent'}`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-4 mb-1">
                    <div className="flex items-center gap-2">
                      <h4 className={`text-[15px] truncate ${msg.status === 'unread' ? 'text-white font-semibold' : 'text-gray-300 font-medium'}`}>
                        {msg.name}
                      </h4>
                      {msg.is_starred && <Star size={14} className="text-[#ceab7a] fill-[#ceab7a] flex-shrink-0" />}
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {formatDate(msg.created_at)}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-1">
                    <span className={`text-xs px-2 py-0.5 rounded uppercase tracking-wider font-bold ${
                      msg.status === 'unread' ? 'bg-[#ceab7a]/10 text-[#ceab7a]' : 'bg-white/5 text-gray-400'
                    }`}>
                      {msg.service}
                    </span>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="truncate">{msg.email}</span>
                    </div>
                  </div>

                  <p className={`text-sm line-clamp-2 mt-2 ${msg.status === 'unread' ? 'text-gray-300' : 'text-gray-500'}`}>
                    {msg.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      <MessageDetailModal
        message={selectedMessage!}
        isOpen={!!selectedMessage}
        onClose={() => setSelectedMessage(null)}
        onUpdateStatus={handleUpdateStatus}
        onToggleStar={handleToggleStar}
        onToggleArchive={handleToggleArchive}
        onDelete={handleDelete}
      />
    </div>
  );
}
