import React, { useState, useRef } from 'react';
import type { ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Particle {
  id: string;
  x: number;
  y: number;
  size: number;
  color: string;
  angle: number;
  speed: number;
}

const colors = ['#ceab7a', '#e8d3b5', '#a8824a', '#ffffff', '#ffd700'];

interface SparkleInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  as?: 'input' | 'textarea';
  rows?: number;
  // Make sure we allow specific props if it's a textarea
  value?: string;
  onChange?: (e: any) => void;
  onKeyDown?: (e: any) => void;
  onFocus?: (e: any) => void;
  onBlur?: (e: any) => void;
}

export function SparkleInput({ as: Component = 'input', onChange, onKeyDown, ...props }: SparkleInputProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  const createParticles = (x: number, y: number) => {
    const newParticles: Particle[] = Array.from({ length: Math.floor(Math.random() * 3) + 2 }).map(() => ({
      id: Math.random().toString(36).substring(2, 9),
      x,
      y,
      size: Math.random() * 4 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      angle: Math.random() * Math.PI * 2,
      speed: Math.random() * 20 + 10,
    }));

    setParticles((prev) => [...prev, ...newParticles]);

    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => !newParticles.find((np) => np.id === p.id)));
    }, 800);
  };

  const handleInput = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (onChange) {
      onChange(e);
    }

    if (inputRef.current) {
      // Very basic approximation of the cursor position to spawn particles.
      // We spawn particles randomly inside the input to simulate the sparkle.
      // Since calculating exact caret position in React without a heavy library is tricky,
      // creating particles around the random right-ish side or completely random is an elegant compromise.
      
      const rect = inputRef.current.getBoundingClientRect();
      // approximate the typing area. We will spawn particles randomly within the input's bounds, 
      // but biased towards the right if it's a single line input.
      const valLength = e.target.value.length;
      const isTextarea = Component === 'textarea';
      
      let spawnX = Math.random() * rect.width * 0.8 + 20; // fallback random
      let spawnY = Math.random() * rect.height * 0.6 + 10;
      
      // Attempt a pseudo-caret position for inputs (not perfect, but gives a dynamic feel)
      if (!isTextarea) {
        // Assume roughly 8-10px per character width for default fonts
        const approxTextWidth = valLength * 9;
        spawnX = Math.min(approxTextWidth + 30, rect.width - 20) + (Math.random() * 10 - 5);
        spawnY = rect.height / 2 + (Math.random() * 10 - 5);
      } else {
        // For textarea, just randomize more heavily to simulate magic filling the box
        spawnX = Math.random() * rect.width;
        spawnY = Math.random() * rect.height;
      }

      createParticles(spawnX, spawnY);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (onKeyDown) {
      onKeyDown(e);
    }
    
    // Also trigger particles on key down for better responsiveness
    // Don't trigger for backspace, enter, tab, shift, etc. (optional, but let's just trigger for all visible keys)
    if (e.key.length === 1 && inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      const isTextarea = Component === 'textarea';
      
      let spawnX = Math.random() * rect.width * 0.8 + 20;
      let spawnY = Math.random() * rect.height * 0.6 + 10;
      
      if (!isTextarea) {
        // Approximate position
        const valLength = (inputRef.current.value || '').length;
        const approxTextWidth = valLength * 9;
        spawnX = Math.min(approxTextWidth + 30, rect.width - 20) + (Math.random() * 10 - 5);
        spawnY = rect.height / 2 + (Math.random() * 10 - 5);
      } else {
        spawnX = Math.random() * rect.width;
        spawnY = Math.random() * rect.height;
      }
      
      createParticles(spawnX, spawnY);
    }
  }

  return (
    <div className="relative w-full">
      {/* @ts-ignore */}
      <Component
        ref={inputRef as any}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        {...props}
      />
      <div className="absolute inset-0 pointer-events-none rounded-2xl z-50">
        <AnimatePresence>
          {particles.map((p) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 1, scale: 0, x: p.x, y: p.y }}
              animate={{
                opacity: [1, 1, 0],
                scale: [0, 1.5, 0],
                x: p.x + Math.cos(p.angle) * p.speed,
                y: p.y + Math.sin(p.angle) * p.speed - 20,
              }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: p.size,
                height: p.size,
                backgroundColor: p.color,
                borderRadius: '50%',
                boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
              }}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
