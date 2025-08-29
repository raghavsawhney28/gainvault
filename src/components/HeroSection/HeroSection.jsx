import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSpring, animated, config } from '@react-spring/web';
import { Play } from 'lucide-react';
import styles from './HeroSection.module.css';
import Particles from '../magicui/particles';
import TextScramble from '../TextScramble/TextScramble';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Spline from '@splinetool/react-spline';

// Custom hook for 3D card flip effect
const useCardFlip = () => {
  const [isScrolling, setIsScrolling] = useState(false);
  
  const handleScroll = () => {
    if (!isScrolling) {
      setIsScrolling(true);
      requestAnimationFrame(() => {
        updateCards();
        setIsScrolling(false);
      });
    }
  };

  const updateCards = () => {
    const cards = document.querySelectorAll('[data-card]');
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;

    cards.forEach((card) => {
      const cardRect = card.getBoundingClientRect();
      const cardTop = cardRect.top + scrollY;
      const cardHeight = cardRect.height;
      
      // Calculate when card enters and exits viewport
      const cardCenter = cardTop + (cardHeight / 2);
      const viewportCenter = scrollY + (windowHeight / 2);
      
      // Calculate flip progress based on card position relative to viewport center
      const distanceFromCenter = cardCenter - viewportCenter;
      const maxDistance = windowHeight / 2 + cardHeight / 2;
      
      // Normalize the distance to a value between -1 and 1
      let progress = Math.max(-1, Math.min(1, distanceFromCenter / maxDistance));
      
      // When card is above viewport center (progress = -1), rotation = 0 degrees
      // When card is at viewport center (progress = 0), rotation = 90 degrees  
      // When card is below viewport center (progress = 1), rotation = 180 degrees
      let rotationY = (progress + 1) * 90; // Maps -1,1 to 0,180
      
      // Clamp rotation between 0 and 180 degrees
      rotationY = Math.max(0, Math.min(180, rotationY));
      
      // Apply transform with smooth easing
      card.style.transform = `rotateY(${rotationY}deg)`;
      
      // Add flipped class for fallback browsers
      if (rotationY > 90) {
        card.classList.add('flipped');
      } else {
        card.classList.remove('flipped');
      }
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    updateCards(); // Initial check
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return { updateCards };
};

const HeroSection = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const splineRef = useRef(null);
  
  // Initialize card flip effect
  useCardFlip();

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
      
      <div className={styles.container}>
        <div className={styles.leftContent}>
          <animated.div style={heroAnimation} className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              <animated.span style={titleReveal} data-aos="fade-up" data-aos-duration="1000">
                <TextScramble text="UNLOCK&nbsp;YOUR&nbsp;POTENTIAL" />
              </animated.span>
              <span className={styles.enrollTitle}>
                <animated.span style={enrollReveal} data-aos="fade-up" data-aos-duration="1000" data-aos-delay="200">
                  <TextScramble text="ENROLL&nbsp;NOW&nbsp;!" />
                </animated.span>
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
                  touchAction: 'auto',
                  userSelect: 'auto',
                  WebkitUserSelect: 'auto',
                  MozUserSelect: 'auto',
                  msUserSelect: 'auto'
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