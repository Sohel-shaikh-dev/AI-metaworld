import React from 'react';
import { Upload, X } from 'lucide-react';

interface MediaUploadCardProps {
  label: string;
  description?: string;
  image: string | null | undefined;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
  aspectClass?: string;
  objectFit?: 'object-cover' | 'object-contain';
  isLoading?: boolean;
}

export default function MediaUploadCard({
  label,
  description,
  image,
  onFileSelect,
  onRemove,
  aspectClass = 'aspect-video',
  objectFit = 'object-contain',
  isLoading = false
}: MediaUploadCardProps) {
  return (
    <div className="space-y-2">
      <label className="block text-xs uppercase tracking-widest text-gray-400 font-medium">
        {label}
      </label>
      {description && (
        <p className="text-gray-500 text-[11px] mb-2">{description}</p>
      )}
      
      <div className={`relative ${aspectClass} rounded-xl overflow-hidden group bg-[#151515] border border-white/10 transition-colors hover:border-white/20`}>
        {isLoading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#101010] z-10">
            <div className="w-6 h-6 border-2 border-[#ceab7a] border-t-transparent rounded-full animate-spin mb-2" />
            <span className="text-[10px] text-[#ceab7a] uppercase tracking-widest">Processing...</span>
          </div>
        ) : image ? (
          <>
            <img src={image} className={`w-full h-full ${objectFit}`} alt={label} />
            <div className="absolute top-2 right-2 flex items-center gap-1.5 sm:inset-0 sm:top-0 sm:right-0 sm:bg-black/50 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity sm:justify-center sm:gap-3 sm:backdrop-blur-[2px]">
              <label className="p-2 bg-black/80 backdrop-blur-md border border-white/15 sm:border-transparent sm:bg-white/20 sm:hover:bg-white/30 rounded-lg cursor-pointer text-white transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center shadow-lg" title="Replace Image" aria-label="Replace Image">
                <Upload size={15} />
                <input type="file" accept="image/*" className="hidden" onChange={onFileSelect} />
              </label>
              <button 
                type="button" 
                onClick={onRemove} 
                className="p-2 bg-red-500/90 hover:bg-red-600 sm:bg-red-500/80 sm:hover:bg-red-500 rounded-lg text-white transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center shadow-lg"
                title="Remove Image"
                aria-label="Remove Image"
              >
                <X size={15}/>
              </button>
            </div>
          </>
        ) : (
          <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-colors">
            <Upload size={24} className="text-gray-400 mb-2 group-hover:text-white transition-colors" />
            <span className="text-xs text-gray-500 uppercase tracking-widest group-hover:text-gray-400">Upload Image</span>
            <input type="file" accept="image/*" className="hidden" onChange={onFileSelect} />
          </label>
        )}
      </div>
    </div>
  );
}
