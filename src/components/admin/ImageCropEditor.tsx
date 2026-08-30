import { useState, useRef, useEffect } from 'react';
import ReactCrop, { type Crop, type PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, ZoomOut, Save, Image as ImageIcon } from 'lucide-react';
import { getCroppedImg } from '../../utils/cropImage';

export type CropSession = {
  file: File;
  previewUrl: string;
  onComplete: (croppedFile: File) => Promise<void>;
  onCancel: () => void;
};

interface ImageCropEditorProps {
  session: CropSession | null;
}

function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

export default function ImageCropEditor({ session }: ImageCropEditorProps) {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const [zoom, setZoom] = useState(1);
  const [aspect, setAspect] = useState<number | undefined>(undefined);
  const [isProcessing, setIsProcessing] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // When aspect ratio changes, recalculate crop box
  useEffect(() => {
    if (imgRef.current) {
      const { width, height } = imgRef.current;
      if (aspect) {
        setCrop(centerAspectCrop(width, height, aspect));
      } else {
        // Free mode - reset to 100% so it doesn't crop unless user manually shrinks it
        setCrop({
          unit: '%',
          width: 100,
          height: 100,
          x: 0,
          y: 0
        });
      }
    }
  }, [aspect]);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    if (aspect) {
      setCrop(centerAspectCrop(width, height, aspect));
    } else {
      setCrop({
        unit: '%',
        width: 100,
        height: 100,
        x: 0,
        y: 0
      });
    }
  };

  const handleCropAndUpload = async () => {
    if (!session || !crop || !imgRef.current) return;
    try {
      setIsProcessing(true);
      
      // If the user selected 100% width and 100% height, and aspect is Free, bypass canvas entirely!
      // This preserves 100% original image quality and dimensions perfectly.
      if (!aspect && crop.width === 100 && crop.height === 100) {
        await session.onComplete(session.file);
        return;
      }

      // Calculate actual pixel crop based on natural image size using PERCENTAGES
      // This completely avoids bugs with DOM scaling, letterboxing, zooming, or max-h CSS!
      const pixelCrop = {
        x: (crop.x / 100) * imgRef.current.naturalWidth,
        y: (crop.y / 100) * imgRef.current.naturalHeight,
        width: (crop.width / 100) * imgRef.current.naturalWidth,
        height: (crop.height / 100) * imgRef.current.naturalHeight,
      };

      const croppedFile = await getCroppedImg(
        session.previewUrl,
        pixelCrop,
        session.file.type
      );
      
      if (croppedFile) {
        await session.onComplete(croppedFile);
      }
    } catch (e) {
      console.error('Failed to crop image', e);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleOriginalUpload = async () => {
    if (!session) return;
    try {
      setIsProcessing(true);
      await session.onComplete(session.file);
    } catch (e) {
      console.error('Failed to upload original image', e);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!session) return null;

  const aspectRatios = [
    { label: 'Free', value: undefined },
    { label: '1:1', value: 1 },
    { label: '4:5', value: 4 / 5 },
    { label: '9:16', value: 9 / 16 },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/95 backdrop-blur-sm"
          onClick={() => !isProcessing && session.onCancel()}
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-5xl bg-[#111] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[90vh] max-h-[900px]"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10 bg-[#151515] z-10">
            <h3 className="text-white font-bold tracking-widest text-sm flex items-center gap-2">
              <ImageIcon size={16} className="text-[#ceab7a]" />
              ADJUST CROP
            </h3>
            <button
              onClick={() => !isProcessing && session.onCancel()}
              disabled={isProcessing}
              className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition-colors disabled:opacity-50"
            >
              <X size={20} />
            </button>
          </div>

          {/* Cropper Area */}
          <div 
            className="relative flex-1 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2NkYNgfQEhgZmBg+M+IRB5VMFQNA2kG4PIHUQwDjQYGA2kG0IwjzQAEGACr5hT5/eG9VAAAAABJRU5ErkJggg==')] overflow-auto flex items-center justify-center"
            ref={containerRef}
          >
            <div 
              style={{ transform: `scale(${zoom})`, transformOrigin: 'center center', transition: 'transform 0.1s' }}
              className="p-8 min-h-full min-w-full flex items-center justify-center"
            >
              <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={aspect}
                className="max-w-full max-h-[70vh]"
              >
                <img
                  ref={imgRef}
                  alt="Crop preview"
                  src={session.previewUrl}
                  className="max-w-full max-h-[70vh] block"
                  style={{ width: 'auto', height: 'auto' }}
                  onLoad={handleImageLoad}
                />
              </ReactCrop>
            </div>
          </div>

          {/* Controls Area */}
          <div className="p-4 sm:p-6 bg-[#151515] border-t border-white/10 space-y-6 z-10">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              
              {/* Zoom Control */}
              <div className="flex items-center gap-3 w-full sm:w-1/3">
                <ZoomOut size={16} className="text-gray-400" />
                <input
                  type="range"
                  value={zoom}
                  min={0.5}
                  max={3}
                  step={0.1}
                  aria-labelledby="Zoom"
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#ceab7a] [&::-webkit-slider-thumb]:rounded-full"
                />
                <ZoomIn size={16} className="text-gray-400" />
              </div>

              {/* Aspect Ratio Presets */}
              <div className="flex flex-wrap items-center gap-2 justify-center">
                {aspectRatios.map((ratio) => (
                  <button
                    key={ratio.label}
                    onClick={() => setAspect(ratio.value)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold tracking-widest transition-colors ${
                      aspect === ratio.value
                        ? 'bg-[#ceab7a] text-black shadow-[0_0_15px_rgba(206,171,122,0.3)]'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/5'
                    }`}
                  >
                    {ratio.label}
                  </button>
                ))}
              </div>

            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/5">
              <button
                onClick={handleOriginalUpload}
                disabled={isProcessing}
                className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold tracking-widest text-xs text-gray-400 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-50"
              >
                ORIGINAL / NO CROP
              </button>
              
              <div className="flex w-full sm:w-auto items-center gap-3">
                <button
                  onClick={() => !isProcessing && session.onCancel()}
                  disabled={isProcessing}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold tracking-widest text-xs bg-white/5 text-gray-300 hover:bg-white/10 transition-colors disabled:opacity-50"
                >
                  CANCEL
                </button>
                <button
                  onClick={handleCropAndUpload}
                  disabled={isProcessing || !completedCrop?.width || !completedCrop?.height}
                  className="w-full sm:w-auto px-8 py-3 rounded-xl font-bold tracking-widest text-xs bg-[#ceab7a] text-black hover:bg-white transition-all shadow-[0_0_20px_rgba(206,171,122,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <><Save size={14} /> CROP & UPLOAD</>
                  )}
                </button>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
