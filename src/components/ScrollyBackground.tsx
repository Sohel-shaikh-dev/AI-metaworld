import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

export default function ScrollyBackground() {
  const { scrollY } = useScroll();
  const [windowHeight, setWindowHeight] = useState(1000);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const totalFrames = 240;
  const [images, setImages] = useState<HTMLImageElement[]>([]);

  useEffect(() => {
    setWindowHeight(window.innerHeight);
    const handleResize = () => setWindowHeight(window.innerHeight);
    window.addEventListener('resize', handleResize);
    
    // Preload Images
    const loadedImages: HTMLImageElement[] = [];
    let loadedCount = 0;
    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      const frameNumber = i.toString().padStart(3, '0');
      img.src = `/Assets/about section frame/ezgif-frame-${frameNumber}.jpg`;
      img.onload = () => {
        loadedCount++;
        // Initialize the first frame when completely loaded
        if (loadedCount === totalFrames && canvasRef.current && loadedImages[0]) {
          const ctx = canvasRef.current.getContext('2d');
          if (ctx) {
            canvasRef.current.width = loadedImages[0].width;
            canvasRef.current.height = loadedImages[0].height;
            ctx.drawImage(loadedImages[0], 0, 0);
          }
        }
      };
      loadedImages.push(img);
    }
    setImages(loadedImages);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Video fades out during the first 100px of scroll
  const videoOpacity = useTransform(scrollY, [0, 100], [1, 0]);
  // Canvas fades in during the first 100px of scroll, emerging perfectly from the video
  const canvasOpacity = useTransform(scrollY, [0, 100], [0, 1]);

  // Draw Frames on Canvas from scroll 0 to windowHeight
  useMotionValueEvent(scrollY, "change", (latest) => {
    if (images.length < totalFrames || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    // Calculate progress from 0 to windowHeight. 
    // By the time we scroll 100vh (reaching About), progress is 1, frame is 240.
    const progress = Math.max(0, Math.min(1, latest / windowHeight));
    
    // Map scroll progress (0-1) to frame index (0-239)
    const frameIndex = Math.min(
      totalFrames - 1,
      Math.floor(progress * totalFrames)
    );

    const img = images[frameIndex];
    if (img && img.complete) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      ctx.drawImage(img, 0, 0);
    }
  });

  return (
    <div className="absolute inset-0 z-[-1] pointer-events-none bg-[#050505] overflow-hidden">
      {/* Video Background (Hero) */}
      <motion.video 
        autoPlay 
        loop 
        muted 
        playsInline 
        style={{ opacity: videoOpacity }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 object-contain w-[90vw] h-[85vh] mt-4"
      >
        <source src="/Assets/hero section bg .mp4" type="video/mp4" />
      </motion.video>

      {/* Canvas Background (Transition & About) */}
      <motion.canvas 
        ref={canvasRef} 
        style={{ opacity: canvasOpacity }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 object-contain w-[90vw] h-[85vh] mt-4"
      />
    </div>
  );
}
