import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Trash2, Info, X } from 'lucide-react';

interface AdminConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'primary';
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function AdminConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'warning',
  onConfirm,
  onCancel,
  isLoading = false,
}: AdminConfirmModalProps) {
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

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isLoading) {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isLoading, onCancel]);

  if (!isOpen) return null;

  const getIcon = () => {
    switch (variant) {
      case 'danger':
        return (
          <div className="w-14 h-14 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center mx-auto mb-2 border border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.15)]">
            <Trash2 size={26} strokeWidth={1.75} />
          </div>
        );
      case 'warning':
        return (
          <div className="w-14 h-14 rounded-full bg-yellow-500/10 text-yellow-400 flex items-center justify-center mx-auto mb-2 border border-yellow-500/20 shadow-[0_0_20px_rgba(234,179,8,0.15)]">
            <AlertTriangle size={26} strokeWidth={1.75} />
          </div>
        );
      case 'primary':
      default:
        return (
          <div className="w-14 h-14 rounded-full bg-[#ceab7a]/10 text-[#ceab7a] flex items-center justify-center mx-auto mb-2 border border-[#ceab7a]/20 shadow-[0_0_20px_rgba(206,171,122,0.15)]">
            <Info size={26} strokeWidth={1.75} />
          </div>
        );
    }
  };

  const getConfirmButtonClasses = () => {
    switch (variant) {
      case 'danger':
        return 'bg-red-500 hover:bg-red-600 text-white shadow-[0_0_20px_rgba(239,68,68,0.25)]';
      case 'warning':
        return 'bg-[#ceab7a] hover:bg-white text-black shadow-[0_0_20px_rgba(206,171,122,0.25)]';
      case 'primary':
      default:
        return 'bg-[#ceab7a] hover:bg-white text-black shadow-[0_0_20px_rgba(206,171,122,0.25)]';
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={() => !isLoading && onCancel()}
          aria-hidden="true"
        />

        {/* Dialog Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative w-full max-w-sm bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-modal-title"
        >
          {/* Close X Button */}
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-colors"
            aria-label="Close dialog"
          >
            <X size={16} />
          </button>

          {/* Body */}
          <div className="p-6 text-center space-y-3.5">
            {getIcon()}
            <h3 id="confirm-modal-title" className="text-xl font-serif text-white tracking-tight">
              {title}
            </h3>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed max-w-xs mx-auto">
              {message}
            </p>
          </div>

          {/* Footer Actions */}
          <div className="p-4 sm:p-5 border-t border-white/5 bg-[#050505] flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1 px-4 py-3 rounded-xl text-xs sm:text-sm font-medium text-white hover:bg-white/5 transition-colors border border-white/10 min-h-[44px] flex items-center justify-center disabled:opacity-50"
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className={`flex-1 px-4 py-3 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all min-h-[44px] flex items-center justify-center gap-2 disabled:opacity-50 ${getConfirmButtonClasses()}`}
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                confirmLabel
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
