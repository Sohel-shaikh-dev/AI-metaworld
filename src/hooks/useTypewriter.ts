import { useState, useEffect } from 'react';

interface UseTypewriterOptions {
  words: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  delayPause?: number;
  delayRestart?: number;
  loop?: boolean;
  isPaused?: boolean;
}

export function useTypewriter({
  words,
  typingSpeed = 70,
  deletingSpeed = 40,
  delayPause = 2500,
  delayRestart = 500,
  loop = true,
  isPaused = false,
}: UseTypewriterOptions) {
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  
  useEffect(() => {
    if (isPaused) return;

    let timeout: ReturnType<typeof setTimeout>;
    
    const i = loopNum % words.length;
    const fullText = words[i];

    if (isDeleting) {
      timeout = setTimeout(() => {
        setText(fullText.substring(0, text.length - 1));
        
        if (text.length === 1) { // 1 because this state update hasn't rendered yet
          setTimeout(() => {
            setIsDeleting(false);
            setLoopNum(loopNum + 1);
          }, delayRestart);
        }
      }, deletingSpeed);
      
    } else {
      timeout = setTimeout(() => {
        setText(fullText.substring(0, text.length + 1));
        
        if (text.length + 1 === fullText.length) {
          if (!loop && loopNum === words.length - 1) {
            return;
          }
          // Schedule deletion after delayPause
          setTimeout(() => setIsDeleting(true), delayPause);
        }
      }, typingSpeed);
    }

    return () => clearTimeout(timeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, isDeleting, loopNum, words, loop, isPaused, delayPause, delayRestart, typingSpeed, deletingSpeed]);

  return text;
}
