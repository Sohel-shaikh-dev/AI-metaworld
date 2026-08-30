import { useState } from 'react';
import { useTypewriter } from './useTypewriter';

export function useAnimatedPlaceholder(text: string | string[], value: string) {
  const [isFocused, setIsFocused] = useState(false);
  
  const placeholder = useTypewriter({
    words: Array.isArray(text) ? text : [text],
    typingSpeed: 45,
    deletingSpeed: 25,
    delayPause: 1200,
    loop: true,
    isPaused: isFocused || value.length > 0
  });

  return {
    placeholder,
    onFocus: () => setIsFocused(true),
    onBlur: () => setIsFocused(false),
    isFocused
  };
}
