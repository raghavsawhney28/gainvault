import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import styles from './TextScramble.module.css';

const TextScramble = ({ text, className = '', ...props }) => {
  const textRef = useRef(null);
  const charsRef = useRef([]);

  // Custom text scramble function
  const scrambleText = (element, originalText, duration = 1) => {
    const scrambleChars = ".:";
    const scrambleSpeed = 50; // milliseconds between each scramble
    const iterations = Math.floor(duration * 1000 / scrambleSpeed);
    let currentIteration = 0;

    const scramble = () => {
      if (currentIteration >= iterations) {
        element.textContent = originalText;
        return;
      }

      const scrambled = originalText.split('').map(() => 
        scrambleChars[Math.floor(Math.random() * scrambleChars.length)]
      ).join('');
      
      element.textContent = scrambled;
      currentIteration++;
      
      setTimeout(scramble, scrambleSpeed);
    };

    scramble();
  };

  useEffect(() => {
    if (!textRef.current) return;

    // Split text into characters
    const chars = text.split('').map((char, index) => {
      const span = document.createElement('span');
      span.textContent = char;
      span.className = styles.char;
      span.setAttribute('data-content', char);
      span.setAttribute('data-index', index);
      return span;
    });

    // Clear existing content and add new chars
    textRef.current.innerHTML = '';
    chars.forEach(char => textRef.current.appendChild(char));
    charsRef.current = chars;

    // Set up pointer move event
    const handlePointerMove = (e) => {
      chars.forEach((char) => {
        const rect = char.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 100) {
          const duration = 1.2 - dist / 100;
          const originalText = char.getAttribute('data-content');
          
          // Use custom scramble function
          scrambleText(char, originalText, duration);
        }
      });
    };

    textRef.current.addEventListener('pointermove', handlePointerMove);

    return () => {
      if (textRef.current) {
        textRef.current.removeEventListener('pointermove', handlePointerMove);
      }
    };
  }, [text]);

  return (
    <div 
      ref={textRef} 
      className={`${styles.textBlock} ${className}`}
      {...props}
    />
  );
};

export default TextScramble;
