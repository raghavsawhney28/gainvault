import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSpring, animated, config } from '@react-spring/web';
import { Play } from 'lucide-react';
import styles from './HeroSection.module.css';
import Particles from '../magicui/particles';
import Ripple from '../magicui/ripple';
import TextScramble from '../TextScramble/TextScramble';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Spline from '@splinetool/react-spline';

const HeroSection = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const splineRef = useRef(null);

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

  const heroAnimation = useSpring({
    opacity: 1,
    transform: 'translateY(0px)',
    from: { opacity: 0, transform: 'translateY(50px)' },
    delay: isMobile ? 0 : 200, // No delay on mobile for better performance
    config: isMobile ? { duration: 100 } : config.gentle, // Faster animation on mobile
  });

  const titleReveal = useSpring({
    opacity: 1,
    transform: 'translateX(0px)',
    from: { opacity: 0, transform: 'translateX(-100px)' },
    delay: isMobile ? 100 : 400,
    config: config.gentle,
  });

  const enrollReveal = useSpring({
    opacity: 1,
    transform: 'translateX(0px)',
    from: { opacity: 0, transform: 'translateX(100px)' },
    delay: isMobile ? 200 : 600,
    config: config.gentle,
  });

  const handleStartJourney = () => {
    navigate('/trading-challenge');
  };

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
    });

    // Prevent zoom on Spline component
    const preventZoom = (e) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    // Add zoom prevention to the Spline container
    if (splineRef.current) {
      const splineContainer = splineRef.current;
      
      // Prevent wheel zoom
      splineContainer.addEventListener('wheel', preventZoom, { passive: false, capture: true });
      
      // Prevent touch zoom
      splineContainer.addEventListener('touchstart', preventZoom, { passive: false, capture: true });
      splineContainer.addEventListener('touchmove', preventZoom, { passive: false, capture: true });
      splineContainer.addEventListener('touchend', preventZoom, { passive: false, capture: true });
      
      // Prevent gesture zoom (iOS)
      splineContainer.addEventListener('gesturestart', preventZoom, { passive: false, capture: true });
      splineContainer.addEventListener('gesturechange', preventZoom, { passive: false, capture: true });
      splineContainer.addEventListener('gestureend', preventZoom, { passive: false, capture: true });
    }

    return () => {
      if (splineRef.current) {
        const splineContainer = splineRef.current;
        splineContainer.removeEventListener('wheel', preventZoom, { capture: true });
        splineContainer.removeEventListener('touchstart', preventZoom, { capture: true });
        splineContainer.removeEventListener('touchmove', preventZoom, { passive: false, capture: true });
        splineContainer.removeEventListener('touchend', preventZoom, { capture: true });
        splineContainer.removeEventListener('gesturestart', preventZoom, { capture: true });
        splineContainer.removeEventListener('gesturechange', preventZoom, { capture: true });
        splineContainer.removeEventListener('gestureend', preventZoom, { capture: true });
      }
    };
  }, []);

  return (
    <section className={styles.hero}>
      {/* Particles Background - Full Page */}
      <div className={styles.particlesContainer}>
        <Particles 
          quantity={300}
          staticity={30}
          ease={40}
          size={0.6}
          color="#4A90E2"
        />
      </div>
      
      {/* Background Effects Container - Desktop Only */}
      {!isMobile && (
        <div className={styles.backgroundEffects}>
          {/* Ripple Background - HeroSection Only */}
          <div className={styles.rippleContainer}>
            <Ripple 
              mainCircleSize={150}
              mainCircleOpacity={0.24}
              numCircles={8}
            />
          </div>
        </div>
      )}
      
      <div className={styles.container}>
        <div className={styles.leftContent}>
          <animated.div style={heroAnimation} className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              <animated.span style={titleReveal} data-aos="fade-up" data-aos-duration="1000">UNLOCK YOUR POTENTIAL</animated.span>
              <span className={styles.enrollTitle}>
                <animated.span style={enrollReveal} data-aos="fade-up" data-aos-duration="1000" data-aos-delay="200">ENROLL NOW !</animated.span>
              </span>
            </h1>
            <p className={styles.heroSubtitle} data-aos="fade-up" data-aos-duration="1200" data-aos-delay="300">
              What if your trading potential wasn't limited by your wallet? With GainVault, it's not. 
              We provide the capital so you can execute the trades you've always dreamed of. 
              Risk-free trading. Massive growth. This is your chance to take control. 
              <strong> GainVault. Unlock your true potential.</strong>
            </p>
            <div className={styles.heroActions}>
              <button 
                className={`${styles.btnPrimary} ${styles.btnLarge}`}
                onClick={handleStartJourney}
                data-aos="zoom-in" data-aos-delay="600"
              >
                Get Funded Now →
              </button>
            </div>
          </animated.div>
        </div>
        
        {/* Spline Design - Desktop Only */}
        {!isMobile && (
          <div className={styles.rightContent}>
            <div className={styles.splineWrapper}>
              <Spline
                ref={splineRef}
                scene="https://prod.spline.design/ULvrhxOiNo1pQrjD/scene.splinecode"
                style={{
                  touchAction: 'none',
                  userSelect: 'none',
                  WebkitUserSelect: 'none',
                  MozUserSelect: 'none',
                  msUserSelect: 'none'
                }}
              />
            </div>
          </div>
        )}
      </div>
      
    </section>
  );
};

export default HeroSection;