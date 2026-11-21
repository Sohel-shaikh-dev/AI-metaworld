import { useState, useEffect, type ChangeEvent, type SyntheticEvent } from 'react';
import { Upload, X, ArrowLeft, ArrowRight } from 'lucide-react';

interface MediaUploadCardProps {
  label: string;
  description?: string;
  image: string | null | undefined;
  onFileSelect: (e: ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
  onMoveLeft?: () => void;
  onMoveRight?: () => void;
  canMoveLeft?: boolean;
  canMoveRight?: boolean;
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
  onMoveLeft,
  onMoveRight,
  canMoveLeft = false,
  canMoveRight = false,
  aspectClass = 'auto',
  objectFit = 'object-contain',
  isLoading = false
}: MediaUploadCardProps) {
  const [dimensions, setDimensions] = useState<{ width: number; height: number; ratio: number } | null>(null);

  // Reset dimensions when image prop changes
  useEffect(() => {
    setDimensions(null);
  }, [image]);

  const handleImageLoad = (e: SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    if (naturalWidth && naturalHeight) {
      setDimensions({
        width: naturalWidth,
        height: naturalHeight,
        ratio: naturalWidth / naturalHeight
      });
    }
  };

  // Determine orientation
  const isPortrait = dimensions ? dimensions.ratio < 0.85 : false;
  const isSquare = dimensions ? dimensions.ratio >= 0.85 && dimensions.ratio <= 1.18 : false;
  const isLandscape = dimensions ? dimensions.ratio > 1.18 : false;

  // Adaptive container sizing:
  // If explicitly requested fixed aspect ratio with object-cover (e.g., Main Thumbnail), honor it.
  // Otherwise, adapt dynamically to the image's natural orientation so it is never cropped or distorted.
  const isFixedThumbnail = Boolean(aspectClass && aspectClass !== 'auto' && objectFit === 'object-cover');

  let containerClass = 'aspect-video min-h-[160px]';
  if (image) {
    if (isFixedThumbnail) {
      containerClass = aspectClass;
    } else if (dimensions) {
      if (isPortrait) {
        containerClass = 'aspect-[9/16] min-h-[300px] max-h-[460px] max-w-[260px] mx-auto';
      } else if (isSquare) {
        containerClass = 'aspect-square min-h-[220px] max-h-[360px] max-w-[360px] mx-auto';
      } else {
        containerClass = 'aspect-video min-h-[180px] max-h-[360px] w-full';
      }
    } else {
      // Prior to image load or fallback
      containerClass = aspectClass && aspectClass !== 'auto' ? aspectClass : 'aspect-video min-h-[180px]';
    }
  } else if (aspectClass && aspectClass !== 'auto') {
    containerClass = aspectClass;
  }

  // Force object-contain for gallery images to ensure zero cropping
  const effectiveObjectFit = isFixedThumbnail ? 'object-cover' : 'object-contain';

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <label className="block text-xs uppercase tracking-widest text-gray-400 font-medium truncate">
          {label}
        </label>
        {image && dimensions && (
          <span className="text-[10px] text-[#ceab7a] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 uppercase tracking-wider shrink-0">
            {isPortrait ? 'Portrait' : isLandscape ? 'Landscape' : 'Square'} • {dimensions.width}×{dimensions.height}
          </span>
        )}
      </div>

      {description && (
        <p className="text-gray-500 text-[11px] mb-2">{description}</p>
      )}

      <div className={`relative ${containerClass} rounded-xl overflow-hidden group bg-[#121212] border border-white/10 transition-colors hover:border-white/20 flex items-center justify-center p-1.5`}>
        {isLoading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#101010] z-10">
            <div className="w-6 h-6 border-2 border-[#ceab7a] border-t-transparent rounded-full animate-spin mb-2" />
            <span className="text-[10px] text-[#ceab7a] uppercase tracking-widest">Processing...</span>
          </div>
        ) : image ? (
          <>
            <img
              ref={(imgEl) => {
                if (imgEl && imgEl.complete && imgEl.naturalWidth && !dimensions) {
                  setDimensions({
                    width: imgEl.naturalWidth,
                    height: imgEl.naturalHeight,
                    ratio: imgEl.naturalWidth / imgEl.naturalHeight
                  });
                }
              }}
              src={image}
              onLoad={handleImageLoad}
              className={`w-full h-full ${effectiveObjectFit}`}
              alt={label}
            />
            <div className="absolute top-2 right-2 flex items-center gap-1.5 sm:inset-0 sm:top-0 sm:right-0 sm:bg-black/50 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity sm:justify-center sm:gap-2 sm:backdrop-blur-[2px]">
              {onMoveLeft && canMoveLeft && (
                <button
                  type="button"
                  onClick={onMoveLeft}
                  className="p-2 bg-black/80 backdrop-blur-md border border-white/15 sm:border-transparent sm:bg-white/20 sm:hover:bg-white/30 rounded-lg text-white transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center shadow-lg cursor-pointer"
                  title="Move Earlier"
                  aria-label="Move Earlier"
                >
                  <ArrowLeft size={15} />
                </button>
              )}
              <label className="p-2 bg-black/80 backdrop-blur-md border border-white/15 sm:border-transparent sm:bg-white/20 sm:hover:bg-white/30 rounded-lg cursor-pointer text-white transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center shadow-lg" title="Replace Image" aria-label="Replace Image">
                <Upload size={15} />
                <input type="file" accept="image/*" className="hidden" onChange={onFileSelect} />
              </label>
              {onMoveRight && canMoveRight && (
                <button
                  type="button"
                  onClick={onMoveRight}
                  className="p-2 bg-black/80 backdrop-blur-md border border-white/15 sm:border-transparent sm:bg-white/20 sm:hover:bg-white/30 rounded-lg text-white transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center shadow-lg cursor-pointer"
                  title="Move Later"
                  aria-label="Move Later"
                >
                  <ArrowRight size={15} />
                </button>
              )}
              <button
                type="button"
                onClick={onRemove}
                className="p-2 bg-red-500/90 hover:bg-red-600 sm:bg-red-500/80 sm:hover:bg-red-500 rounded-lg text-white transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center shadow-lg cursor-pointer"
                title="Remove Image"
                aria-label="Remove Image"
              >
                <X size={15} />
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
