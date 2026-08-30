import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Mail, Phone, MessageCircle, Star, 
  Archive, Trash2, CheckCircle, Circle, Copy
} from 'lucide-react';
import type { ContactMessage, MessageStatus } from '../../types/messages';
import { useState } from 'react';

interface Props {
  message: ContactMessage;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (id: string, status: MessageStatus) => Promise<void>;
  onToggleStar: (id: string, current: boolean) => Promise<void>;
  onToggleArchive: (id: string, current: boolean) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export default function MessageDetailModal({
  message,
  isOpen,
  onClose,
  onUpdateStatus,
  onToggleStar,
  onToggleArchive,
  onDelete
}: Props) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const cleanPhone = (phone: string | null) => {
    if (!phone) return null;
    return phone.replace(/\D/g, '');
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(message.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-medium text-white">{message.name}</h3>
                {message.status === 'unread' && (
                  <span className="bg-[#ceab7a] text-black text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    New
                  </span>
                )}
                {message.is_starred && (
                  <Star size={16} className="text-[#ceab7a] fill-[#ceab7a]" />
                )}
              </div>
              <button 
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-1">Email</p>
                  <p className="text-white text-sm break-all">{message.email}</p>
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-1">Phone</p>
                  <p className="text-white text-sm">{message.phone || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-1">Service / Project</p>
                  <p className="text-white text-sm">{message.service}</p>
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-1">Date Submitted</p>
                  <p className="text-gray-400 text-sm">{formatDate(message.created_at)}</p>
                </div>
              </div>

              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-3">Message</p>
                <div className="bg-white/[0.02] border border-white/5 rounded-xl p-5 text-gray-300 text-[15px] leading-relaxed whitespace-pre-wrap">
                  {message.message}
                </div>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="p-6 border-t border-white/5 bg-[#0d0d0d] flex flex-wrap items-center justify-between gap-4">
              
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => onUpdateStatus(message.id, message.status === 'unread' ? 'read' : 'unread')}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white text-xs font-medium transition-colors"
                >
                  {message.status === 'unread' ? <CheckCircle size={14} /> : <Circle size={14} />}
                  {message.status === 'unread' ? 'Mark Read' : 'Mark Unread'}
                </button>
                
                <button
                  onClick={() => onToggleStar(message.id, message.is_starred)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    message.is_starred 
                      ? 'bg-[#ceab7a]/10 text-[#ceab7a] hover:bg-[#ceab7a]/20' 
                      : 'bg-white/5 text-white hover:bg-white/10'
                  }`}
                >
                  <Star size={14} className={message.is_starred ? 'fill-[#ceab7a]' : ''} />
                  {message.is_starred ? 'Starred' : 'Star'}
                </button>

                <button
                  onClick={() => onToggleArchive(message.id, message.is_archived)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    message.is_archived 
                      ? 'bg-orange-500/10 text-orange-400 hover:bg-orange-500/20' 
                      : 'bg-white/5 text-white hover:bg-white/10'
                  }`}
                >
                  <Archive size={14} />
                  {message.is_archived ? 'Unarchive' : 'Archive'}
                </button>

                <button
                  onClick={() => onUpdateStatus(message.id, message.status === 'replied' ? 'read' : 'replied')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    message.status === 'replied'
                      ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20' 
                      : 'bg-white/5 text-white hover:bg-white/10'
                  }`}
                >
                  <CheckCircle size={14} />
                  {message.status === 'replied' ? 'Replied' : 'Mark Replied'}
                </button>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {message.phone && (
                  <>
                    <a
                      href={`https://wa.me/${cleanPhone(message.phone)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-9 h-9 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors"
                      title="WhatsApp"
                    >
                      <MessageCircle size={16} />
                    </a>
                    <a
                      href={`tel:${cleanPhone(message.phone)}`}
                      className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
                      title="Call"
                    >
                      <Phone size={16} />
                    </a>
                  </>
                )}
                <a
                  href={`mailto:${message.email}`}
                  className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/5 text-white hover:bg-white/10 transition-colors"
                  title="Open Email Client"
                >
                  <Mail size={16} />
                </a>
                <button
                  onClick={handleCopyEmail}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 text-white hover:bg-white/10 text-xs font-medium transition-colors"
                  title="Copy Email"
                >
                  <Copy size={14} />
                  {copied ? 'Copied!' : 'Copy'}
                </button>
                <div className="w-px h-6 bg-white/10 mx-1"></div>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center justify-center w-9 h-9 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {/* Custom Delete Confirmation Modal */}
            <AnimatePresence>
              {showDeleteConfirm && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-6"
                >
                  <motion.div 
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.95 }}
                    className="bg-[#111] border border-red-500/20 p-6 rounded-2xl max-w-sm w-full text-center"
                  >
                    <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                      <Trash2 size={24} className="text-red-500" />
                    </div>
                    <h4 className="text-white font-medium text-lg mb-2">Delete Inquiry?</h4>
                    <p className="text-gray-400 text-sm mb-6">
                      Are you sure you want to permanently delete this inquiry from {message.name}? This cannot be undone.
                    </p>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
                        className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 text-white text-sm font-medium hover:bg-white/10 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={async () => {
                          await onDelete(message.id);
                          setShowDeleteConfirm(false);
                          onClose();
                        }}
                        className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
