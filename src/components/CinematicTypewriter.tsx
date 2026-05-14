import { motion } from 'framer-motion';
import { useTypewriter } from '../hooks/useTypewriter';

interface CinematicTypewriterProps {
  words: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  delayPause?: number;
  loop?: boolean;
  className?: string;
  cursorClassName?: string;
}

export default function CinematicTypewriter({
  words,
  typingSpeed = 70,
  deletingSpeed = 40,
  delayPause = 2500,
  loop = true,
  className = "",
  cursorClassName = ""
}: CinematicTypewriterProps) {
  const text = useTypewriter({
    words,
    typingSpeed,
    deletingSpeed,
    delayPause,
    loop
  });

  return (
    <span className={`inline-flex items-center ${className}`}>
      <span>{text}</span>
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ 
          duration: 0.8, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className={`inline-block w-[2px] h-[1em] ml-[2px] bg-[#ceab7a] ${cursorClassName}`}
        style={{ verticalAlign: 'text-bottom' }}
      />
    </span>
  );
}
