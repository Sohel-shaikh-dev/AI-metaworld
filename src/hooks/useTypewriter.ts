import { useState, useEffect, useRef } from 'react';

interface UseTypewriterOptions {
  words: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  delayPause?: number;
  loop?: boolean;
  isPaused?: boolean;
}

export function useTypewriter({
  words,
  typingSpeed = 70,
  deletingSpeed = 40,
  delayPause = 2500,
  loop = true,
  isPaused = false,
}: UseTypewriterOptions) {
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  
  const typingSpeedRef = useRef(typingSpeed);
  const deletingSpeedRef = useRef(deletingSpeed);
  
  useEffect(() => {
    if (isPaused) return;

    let timeout: ReturnType<typeof setTimeout>;
    
    const i = loopNum % words.length;
    const fullText = words[i];

    if (isDeleting) {
      // Slight randomness to deletion for human feel
      const randomSpeed = deletingSpeedRef.current + Math.random() * 20;
      
      timeout = setTimeout(() => {
        setText(fullText.substring(0, text.length - 1));
        
        if (text.length === 1) { // 1 because this state update hasn't rendered yet
          setIsDeleting(false);
          setLoopNum(loopNum + 1);
        }
      }, randomSpeed);
      
    } else {
      // Add some natural human variance to typing speed
      const randomSpeed = typingSpeedRef.current + (Math.random() * 40 - 20);
      
      timeout = setTimeout(() => {
        setText(fullText.substring(0, text.length + 1));
        
        if (text.length + 1 === fullText.length) {
          if (!loop && loopNum === words.length - 1) {
            return;
          }
          // Schedule deletion after delayPause
          setTimeout(() => setIsDeleting(true), delayPause);
        }
      }, randomSpeed);
    }

    return () => clearTimeout(timeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, isDeleting, loopNum, words, loop, isPaused, delayPause]);

  return text;
}
