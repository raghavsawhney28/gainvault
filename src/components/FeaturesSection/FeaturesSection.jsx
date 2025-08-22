import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Shield, Zap, Target, Users, Award } from 'lucide-react';
import AnimatedSection from '../AnimatedSection/AnimatedSection';
import styles from './FeaturesSection.module.css';

const FeaturesSection = () => {
  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
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

  const handleStartJourney = () => {
    navigate('/trading-challenge');
  };

  // Auto-scroll functionality - enabled on all devices
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    let animationId;
    let scrollDirection = 1; // 1 for right, -1 for left
    let currentScrollLeft = 0;

    const autoScroll = () => {
      if (!scrollContainer || isPaused) return;

      const maxScrollLeft = scrollContainer.scrollWidth - scrollContainer.clientWidth;
      
      if (currentScrollLeft >= maxScrollLeft) {
        scrollDirection = -1; // Change direction to left
      } else if (currentScrollLeft <= 0) {
        scrollDirection = 1; // Change direction to right
      }

      // Adjust scroll speed based on device type
      const scrollSpeed = isMobile ? 1 : 2;
      currentScrollLeft += scrollDirection * scrollSpeed;
      scrollContainer.scrollLeft = currentScrollLeft;

      animationId = requestAnimationFrame(autoScroll);
    };

    // Start auto-scroll after a delay
    const startDelay = setTimeout(() => {
      animationId = requestAnimationFrame(autoScroll);
    }, 2000);

    return () => {
      clearTimeout(startDelay);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isMobile, isPaused]);

  // Pause auto-scroll on user interaction
  const handleScrollInteraction = useCallback(() => {
    setIsPaused(true);
    setIsAutoScrolling(false);
    
    // Resume auto-scroll after 3 seconds of no interaction
    const resumeTimer = setTimeout(() => {
      setIsPaused(false);
      setIsAutoScrolling(true);
    }, 3000);
    
    return () => clearTimeout(resumeTimer);
  }, []);

  const features = [
    {
      icon: TrendingUp,
      title: 'Prop Trading Excellence',
      description: 'Access to professional trading capital with proven strategies and risk management.'
    },
    {
      icon: Shield,
      title: 'Risk-Free Environment',
      description: 'Trade with confidence knowing your personal capital is never at risk.'
    },
    {
      icon: Zap,
      title: 'Lightning Fast Execution',
      description: 'High-frequency trading capabilities with institutional-grade infrastructure.'
    },
    {
      icon: Target,
      title: 'Performance-Based Funding',
      description: 'Earn more capital as you demonstrate consistent profitable trading.'
    },
    // {
    //   icon: Users,
    //   title: 'Community Support',
    //   description: 'Join a network of successful traders and share strategies.'
    // },
    {
      icon: Award,
      title: 'Recognition & Rewards',
      description: 'Get recognized for your trading skills with bonuses and incentives.'
    }
  ];

  return (
    <section className={styles.featuresSection}>
      <div className={styles.container}>
        <AnimatedSection className={styles.featuresHeader}>
          <h2>Why Choose GainVault?</h2>
          <p>Experience the future of prop trading with our cutting-edge platform</p>
        </AnimatedSection>

        <div 
          className={`${styles.featuresGrid} ${isPaused ? styles.paused : ''}`}
          ref={scrollContainerRef}
          onTouchStart={handleScrollInteraction}
          onMouseDown={handleScrollInteraction}
          onWheel={handleScrollInteraction}
        >
          {features.map((feature, index) => (
            <AnimatedSection key={index} delay={isMobile ? 0 : index * 100}>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>
                  <feature.icon size={32} />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection className={styles.featuresCta}>
          <button className={styles.btnOutline} onClick={handleStartJourney}>
            Start Your Journey
          </button>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default FeaturesSection;