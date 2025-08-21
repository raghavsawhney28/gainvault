import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSpring, animated, config } from '@react-spring/web';
import { Play } from 'lucide-react';
import styles from './HeroSection.module.css';

const HeroSection = () => {
  const navigate = useNavigate();
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

  const heroAnimation = useSpring({
    opacity: 1,
    transform: 'translateY(0px)',
    from: { opacity: 0, transform: 'translateY(50px)' },
    delay: isMobile ? 0 : 200, // No delay on mobile for better performance
    config: isMobile ? { duration: 100 } : config.gentle, // Faster animation on mobile
  });

  const handleStartJourney = () => {
    navigate('/trading-challenge');
  };

  const taglines = [
    "GainVault: Altcoins. It's Our Money Now.",
    "We Provide The Funds. You Provide The Vibes.",
    "Zero Risk. Just Gains. Mostly."
  ];

  return (
    <section className={styles.hero}>
      {/* Phoenix Background Image */}
      {/* <div className={styles.phoenixBackground}>
        <img 
          src="/phoenix.png" 
          alt="Phoenix - Symbol of Power and Renewal" 
          className={styles.phoenixImage}
        />
      </div> */}
      
      <div className={styles.container}>
        <animated.div style={heroAnimation} className={styles.heroContent}>
          <div className={styles.taglineContainer}>
            {taglines.map((tagline, index) => (
              <div 
                key={index} 
                className={styles.tagline} 
                style={{ 
                  animationDelay: isMobile ? '0s' : `${index * 0.5}s` // No delay on mobile
                }}
              >
                {tagline}
              </div>
            ))}
          </div>
          <h1 className={styles.heroTitle}>
            Unlock Your<br />
            <span className={styles.gradientText}>True Potential</span>
          </h1>
          <p className={styles.heroSubtitle}>
            What if your trading potential wasn't limited by your wallet? With GainVault, it's not. 
            We provide the capital so you can execute the trades you've always dreamed of. 
            Risk-free trading. Massive growth. This is your chance to take control. 
            <strong> GainVault. Unlock your true potential.</strong>
          </p>
          <div className={styles.heroActions}>
            <button 
              className={`${styles.btnPrimary} ${styles.btnLarge}`}
              onClick={handleStartJourney}
            >
              Get Funded Now →
            </button>
            <button className={`${styles.btnSecondary} ${styles.btnLarge}`}>
              <Play size={16} /> See How It Works
            </button>
          </div>
        </animated.div>
      </div>
      
    </section>
  );
};

export default HeroSection;