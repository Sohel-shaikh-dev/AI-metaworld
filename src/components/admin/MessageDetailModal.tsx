import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Mail, Phone, MessageCircle, Star, 
  Archive, Trash2, CheckCircle, Circle, Copy, Check
} from 'lucide-react';
import type { ContactMessage, MessageStatus } from '../../types/messages';
import { useState, useEffect } from 'react';

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

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle Escape key to close modal or delete confirmation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        if (showDeleteConfirm) {
          setShowDeleteConfirm(false);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, showDeleteConfirm, onClose]);

  if (!isOpen || !message) return null;

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
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4 md:p-6">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              if (showDeleteConfirm) {
                setShowDeleteConfirm(false);
              } else {
                onClose();
              }
            }}
            className="absolute inset-0 bg-black/85 backdrop-blur-sm"
            aria-hidden="true"
          />
          
          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[88vh]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="message-detail-title"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/5 bg-[#0d0d0d] shrink-0">
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 pr-2">
                <h3 id="message-detail-title" className="text-base sm:text-lg font-serif text-white truncate">
                  {message.name}
                </h3>
                {message.status === 'unread' && (
                  <span className="bg-[#ceab7a] text-black text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0">
                    New
                  </span>
                )}
                {message.is_starred && (
                  <Star size={16} className="text-[#ceab7a] fill-[#ceab7a] shrink-0" />
                )}
              </div>
              <button 
                onClick={onClose}
                className="text-gray-400 hover:text-white p-2 rounded-xl hover:bg-white/5 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center shrink-0"
                aria-label="Close message details"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-4 sm:p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
              {/* Customer Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 bg-white/[0.015] border border-white/5 p-4 rounded-xl">
                <div>
                  <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-1">Customer Email</p>
                  <div className="flex items-center gap-2">
                    <p className="text-white text-sm font-medium break-all select-all">{message.email}</p>
                    <button
                      onClick={handleCopyEmail}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors shrink-0"
                      title="Copy Email"
                      aria-label="Copy email address"
                    >
                      {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-1">Phone Number</p>
                  <p className="text-white text-sm font-medium select-all">
                    {message.phone || <span className="text-gray-500 font-normal">Not provided</span>}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-1">Service / Project</p>
                  <span className="inline-block px-2.5 py-1 rounded-lg bg-[#ceab7a]/10 border border-[#ceab7a]/20 text-[#ceab7a] text-xs font-semibold uppercase tracking-wider">
                    {message.service}
                  </span>
                </div>

                <div>
                  <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-1">Date Submitted</p>
                  <p className="text-gray-300 text-sm">{formatDate(message.created_at)}</p>
                </div>
              </div>

              {/* Message Body */}
              <div>
                <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-2">Message</p>
                <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 sm:p-5 text-gray-200 text-sm sm:text-[15px] leading-relaxed whitespace-pre-wrap break-words select-text">
                  {message.message}
                </div>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="p-4 sm:p-5 border-t border-white/5 bg-[#0a0a0a] shrink-0 space-y-3.5">
              {/* Row 1: Quick Customer Reach-out Actions */}
              <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
                <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mr-1 hidden sm:inline">
                  Contact:
                </span>
                {message.phone && (
                  <>
                    <a
                      href={`https://wa.me/${cleanPhone(message.phone)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-green-500/10 text-green-400 hover:bg-green-500/20 text-xs font-medium transition-colors min-h-[42px]"
                      title="Open WhatsApp"
                    >
                      <MessageCircle size={15} />
                      <span>WhatsApp</span>
                    </a>
                    <a
                      href={`tel:${cleanPhone(message.phone)}`}
                      className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 text-xs font-medium transition-colors min-h-[42px]"
                      title="Call phone"
                    >
                      <Phone size={15} />
                      <span>Call</span>
                    </a>
                  </>
                )}
                <a
                  href={`mailto:${message.email}`}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 text-white hover:bg-white/10 text-xs font-medium transition-colors min-h-[42px]"
                  title="Open Email Client"
                >
                  <Mail size={15} />
                  <span>Send Email</span>
                </a>
                <button
                  onClick={handleCopyEmail}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 text-white hover:bg-white/10 text-xs font-medium transition-colors min-h-[42px]"
                  title="Copy Email Address"
                >
                  {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* Row 2: Status & Management Actions */}
              <div className="flex items-center justify-between gap-2 flex-wrap pt-2 border-t border-white/5">
                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                  <button
                    onClick={() => onUpdateStatus(message.id, message.status === 'unread' ? 'read' : 'unread')}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-medium transition-colors min-h-[40px]"
                  >
                    {message.status === 'unread' ? <CheckCircle size={14} /> : <Circle size={14} />}
                    <span>{message.status === 'unread' ? 'Mark Read' : 'Mark Unread'}</span>
                  </button>
                  
                  <button
                    onClick={() => onToggleStar(message.id, message.is_starred)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors min-h-[40px] ${
                      message.is_starred 
                        ? 'bg-[#ceab7a]/15 text-[#ceab7a] hover:bg-[#ceab7a]/25 border border-[#ceab7a]/30' 
                        : 'bg-white/5 text-white hover:bg-white/10'
                    }`}
                  >
                    <Star size={14} className={message.is_starred ? 'fill-[#ceab7a]' : ''} />
                    <span>{message.is_starred ? 'Starred' : 'Star'}</span>
                  </button>

                  <button
                    onClick={() => onToggleArchive(message.id, message.is_archived)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors min-h-[40px] ${
                      message.is_archived 
                        ? 'bg-orange-500/15 text-orange-400 hover:bg-orange-500/25 border border-orange-500/30' 
                        : 'bg-white/5 text-white hover:bg-white/10'
                    }`}
                  >
                    <Archive size={14} />
                    <span>{message.is_archived ? 'Archived' : 'Archive'}</span>
                  </button>

                  <button
                    onClick={() => onUpdateStatus(message.id, message.status === 'replied' ? 'read' : 'replied')}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors min-h-[40px] ${
                      message.status === 'replied'
                        ? 'bg-green-500/15 text-green-400 hover:bg-green-500/25 border border-green-500/30' 
                        : 'bg-white/5 text-white hover:bg-white/10'
                    }`}
                  >
                    <CheckCircle size={14} />
                    <span>{message.status === 'replied' ? 'Replied' : 'Mark Replied'}</span>
                  </button>
                </div>

                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-medium transition-colors min-h-[40px]"
                  title="Delete Inquiry"
                >
                  <Trash2 size={14} />
                  <span>Delete</span>
                </button>
              </div>
            </div>

            {/* Nested Delete Confirmation Modal */}
            <AnimatePresence>
              {showDeleteConfirm && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/90 backdrop-blur-sm z-[70] flex items-center justify-center p-4 sm:p-6"
                >
                  <motion.div 
                    initial={{ scale: 0.95, y: 10 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.95, y: 10 }}
                    className="bg-[#111] border border-red-500/20 p-5 sm:p-6 rounded-2xl max-w-sm w-full text-center shadow-2xl"
                  >
                    <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-3.5">
                      <Trash2 size={22} className="text-red-500" />
                    </div>
                    <h4 className="text-white font-serif text-lg mb-1.5">Delete Inquiry?</h4>
                    <p className="text-gray-400 text-xs sm:text-sm mb-6 leading-relaxed">
                      Are you sure you want to permanently delete this inquiry from <span className="text-white font-medium">{message.name}</span>? This action cannot be undone.
                    </p>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
                        className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 text-white text-xs sm:text-sm font-medium hover:bg-white/10 transition-colors min-h-[44px]"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={async () => {
                          await onDelete(message.id);
                          setShowDeleteConfirm(false);
                          onClose();
                        }}
                        className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white text-xs sm:text-sm font-bold hover:bg-red-600 transition-colors min-h-[44px] shadow-[0_0_15px_rgba(239,68,68,0.3)]"
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
