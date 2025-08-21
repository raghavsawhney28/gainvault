import React, { useEffect, useState, useMemo } from 'react';
import { useSpring, animated, config } from '@react-spring/web';

// Intersection Observer Hook for animations
const useInView = (threshold = 0.1) => {
  const [ref, setRef] = useState(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold }
    );

    observer.observe(ref);
    return () => observer.disconnect();
  }, [ref, threshold]);

  return [setRef, inView];
};

// Animated Section Component
const AnimatedSection = ({ children, className = "", delay = 0 }) => {
  const [ref, inView] = useInView();
  const [isMobile, setIsMobile] = useState(false);
  
  // Detect mobile device - more robust approach
  useEffect(() => {
    const checkMobile = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 768);
    };
    
    // Initial check
    checkMobile();
    
    // Debounced resize handler
    let timeoutId;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkMobile, 100);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);
  
  // Always create the animation, even if we don't use it
  const animation = useSpring({
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateY(0px)' : 'translateY(30px)',
    delay: delay,
    config: config.gentle,
  });
  
  // Memoize the mobile check to prevent unnecessary re-renders
  const shouldDisableAnimation = useMemo(() => isMobile, [isMobile]);
  
  // Always render the same structure, but conditionally apply styles
  return (
    <div ref={ref} className={className}>
      {shouldDisableAnimation ? (
        // Mobile version - no animation
        <div style={{ opacity: 1, transform: 'none' }}>
          {children}
        </div>
      ) : (
        // Desktop version - with animation
        <animated.div style={animation}>
          {children}
        </animated.div>
      )}
    </div>
  );
};

export default AnimatedSection;