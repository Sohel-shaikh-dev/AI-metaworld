import React from 'react';
import { motion } from 'framer-motion';
import { SparkleInput } from './SparkleInput';
import { useAnimatedPlaceholder } from '../hooks/useAnimatedPlaceholder';

interface AnimatedSparkleInputProps extends React.ComponentProps<typeof SparkleInput> {
  placeholderWords: string | string[];
}

export function AnimatedSparkleInput({ placeholderWords, value, onFocus, onBlur, ...props }: AnimatedSparkleInputProps) {
  const anim = useAnimatedPlaceholder(placeholderWords, value as string);
  
  return (
    <SparkleInput
      {...props}
      value={value}
      placeholder={anim.placeholder}
      onFocus={(e) => {
        anim.onFocus();
        if (onFocus) onFocus(e);
      }}
      onBlur={(e) => {
        anim.onBlur();
        if (onBlur) onBlur(e);
      }}
    />
  );
}

interface AnimatedSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  placeholderWords: string | string[];
  children: React.ReactNode;
}

export function AnimatedSelect({ placeholderWords, value, onFocus, onBlur, children, ...props }: AnimatedSelectProps) {
  const anim = useAnimatedPlaceholder(placeholderWords, value as string);

  return (
    <select
      {...props}
      value={value}
      onFocus={(e) => {
        anim.onFocus();
        if (onFocus) onFocus(e);
      }}
      onBlur={(e) => {
        anim.onBlur();
        if (onBlur) onBlur(e);
      }}
    >
      <option value="" className="bg-[#050505] text-gray-400">{anim.placeholder}</option>
      {children}
    </select>
  );
}

interface AnimatedTextareaProps extends React.ComponentProps<typeof SparkleInput> {
  placeholderWords: string | string[];
}

export function AnimatedTextarea({ placeholderWords, value, onFocus, onBlur, ...props }: AnimatedTextareaProps) {
  const anim = useAnimatedPlaceholder(placeholderWords, value as string);

  return (
    <div className="relative w-full">
      <SparkleInput
        {...props}
        as="textarea"
        value={value}
        placeholder={anim.placeholder}
        onFocus={(e) => {
          anim.onFocus();
          if (onFocus) onFocus(e);
        }}
        onBlur={(e) => {
          anim.onBlur();
          if (onBlur) onBlur(e);
        }}
      />
      {!anim.isFocused && (value as string).length === 0 && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute text-[#ceab7a] pointer-events-none"
          style={{
            top: '20px',
            left: `calc(1.5rem + ${anim.placeholder.length * 7.2}px)`
          }}
        >
          |
        </motion.span>
      )}
    </div>
  );
}
