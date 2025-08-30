import React, { useRef, useEffect, useState } from 'react';
import styles from './FeaturesSection.module.css';

const FeaturesSection = () => {
  const features = [
    {
      icon: '⚡',
      title: 'Advanced Trading Technology',
      description: 'Cutting-edge algorithms and real-time market data for optimal trading decisions.',
      backContent: 'Our platform leverages the latest in AI and machine learning to provide you with real-time market insights, advanced charting tools, and lightning-fast execution speeds that give you the competitive edge.'
    },
    {
      icon: '🛡️',
      title: 'Risk Management',
      description: 'Sophisticated risk controls and portfolio protection strategies.',
      backContent: 'Built-in risk management tools automatically monitor your positions, set stop-losses, and protect your capital with advanced portfolio analytics and real-time risk assessment.'
    },
    {
      icon: '📊',
      title: 'Performance Analytics',
      description: 'Comprehensive reporting and performance tracking tools.',
      backContent: 'Track your trading performance with detailed analytics, performance metrics, and comprehensive reporting tools that help you identify strengths and areas for improvement.'
    }
  ];

  return (
    <section className={styles.featuresSection}>
      {/* Header Section */}
      <div className={styles.headerSection}>
        <h1 className={styles.mainTitle}>
          Unleash the power of <br />
          <span className={styles.highlightText}>Advanced Trading</span>
        </h1>
        <p className={styles.subtitle}>
          Experience the future of prop trading with our cutting-edge platform
        </p>
      </div>

      {/* Horizontal Cards Container */}
      <div className={styles.cardsContainer}>
      {features.map((feature, index) => (
          <FlipCard key={index} feature={feature} index={index} />
      ))}
      </div>
      
      {/* Get Started Button Section */}
      <div className={styles.buttonSection}>
        <button 
          className={styles.getStartedButton}
          onClick={() => window.location.href = '/trading-challenge'}
        >
          Get Started
        </button>
      </div>
    </section>
  );
};

// 3D Flip Card Component
const FlipCard = ({ feature, index }) => {
  const cardRef = useRef(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const handleScroll = () => {
    if (!isScrolling) {
      setIsScrolling(true);
      requestAnimationFrame(() => {
        updateCard();
        setIsScrolling(false);
      });
    }
  };

  // Debounced scroll handler for better performance
  const debouncedScroll = useRef(null);
  const handleScrollOptimized = () => {
    if (debouncedScroll.current) {
      clearTimeout(debouncedScroll.current);
    }
    debouncedScroll.current = setTimeout(() => {
      handleScroll();
    }, 16); // ~60fps
  };

  const updateCard = () => {
    if (!cardRef.current) return;
    
    const card = cardRef.current;
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    
    // Cache DOM queries and calculations
    const cardRect = card.getBoundingClientRect();
    const cardTop = cardRect.top + scrollY;
    const cardHeight = cardRect.height;
    
    // Only calculate if card is in viewport or near it
    if (cardTop > scrollY + windowHeight + 200 || cardTop < scrollY - 200) {
      return; // Skip if card is far from viewport
    }
    
    if (isMobile) {
      // Mobile: Simple slide-up reveal on scroll
      const cardBottom = cardTop + cardHeight;
      const viewportTop = scrollY;
      const viewportBottom = scrollY + windowHeight;
      
      // Calculate how much of the card is visible
      const visibleTop = Math.max(cardTop, viewportTop);
      const visibleBottom = Math.min(cardBottom, viewportBottom);
      const visibleHeight = Math.max(0, visibleBottom - visibleTop);
      const visibilityRatio = visibleHeight / cardHeight;
      
      let translateY = 0;
      let scale = 1;
      let opacity = 0.3;
      
      if (visibilityRatio <= 0) {
        // Card is completely outside viewport
        translateY = 60;
        scale = 0.7;
        opacity = 0.2;
        card.classList.remove('revealing');
      } else if (visibilityRatio >= 1) {
        // Card is completely visible
        translateY = 0;
        scale = 1;
        opacity = 1;
        card.classList.remove('revealing');
      } else {
        // Card is partially visible - animate based on visibility
        const progress = visibilityRatio;
        translateY = 60 * (1 - progress);
        scale = 0.7 + (0.3 * progress);
        opacity = 0.2 + (0.8 * progress);
        card.classList.add('revealing');
      }
      
      // Apply mobile-specific transform
      card.style.transform = `translateY(${translateY.toFixed(2)}px) scale(${scale.toFixed(3)})`;
      card.style.opacity = opacity.toFixed(3);
      
      // Add/remove mobile reveal classes
      if (visibilityRatio > 0.5) {
        card.classList.add('revealed');
      } else {
        card.classList.remove('revealed');
      }
      
    } else {
      // Desktop: No scroll effects, just reset to default state
      card.style.transform = 'rotate3d(0, 1, 0, 0deg) scale(1) translateX(0px)';
      card.style.opacity = '1';
      card.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.4)';
      card.classList.remove('flipping', 'glowing', 'flipped');
    }
  };

  const handleCardClick = () => {
    setIsClicked(true);
    // Add a temporary click effect
    if (cardRef.current) {
      cardRef.current.style.transform += ' scale(0.95)';
      setTimeout(() => {
        if (cardRef.current) {
          cardRef.current.style.transform = cardRef.current.style.transform.replace(' scale(0.95)', '');
        }
        setIsClicked(false);
      }, 150);
    }
  };

  const handleCardHover = () => {
    if (!isMobile && cardRef.current) {
      // Desktop: Flip card on hover
      cardRef.current.style.transform = 'rotate3d(0, 1, 0, 180deg) scale(1)';
      cardRef.current.classList.add('flipped', 'hovering');
    }
  };

  const handleCardLeave = () => {
    if (!isMobile && cardRef.current) {
      // Desktop: Return card to normal state on hover leave
      cardRef.current.style.transform = 'rotate3d(0, 1, 0, 0deg) scale(1)';
      cardRef.current.classList.remove('flipped', 'hovering');
    }
  };

  useEffect(() => {
    // Check initial mobile state
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    
    // Add event listeners
    window.addEventListener('scroll', handleScrollOptimized, { passive: true });
    window.addEventListener('resize', checkMobile);
    
    updateCard(); // Initial check
    
    return () => {
      window.removeEventListener('scroll', handleScrollOptimized);
      window.removeEventListener('resize', checkMobile);
      if (debouncedScroll.current) {
        clearTimeout(debouncedScroll.current);
      }
    };
  }, []);

  return (
    <div className={styles.animatedCard}>
            <div 
        ref={cardRef}
        className={styles.cardContent}
        data-card={index + 1}
        onClick={handleCardClick}
        onMouseEnter={handleCardHover}
        onMouseLeave={handleCardLeave}
        style={{ cursor: 'pointer' }}
      >
                 {/* Front Face */}
         <div className={styles.cardFace}>
        <div className={styles.cardOverlay}>
             <div className={styles.cardIcon}>
               {feature.icon}
             </div>
          <h2 className={styles.cardTitle}>
            {feature.title}
          </h2>
          <p className={styles.cardDescription}>
            {feature.description}
          </p>
        </div>
      </div>
         
         {/* Back Face */}
         <div className={styles.cardFaceBack}>
           <div className={styles.cardOverlay}>
             <div className={styles.cardIcon}>
               {feature.icon}
             </div>
             <h2 className={styles.cardTitle}>
               {feature.title}
             </h2>
             <p className={styles.cardDescription}>
               {feature.backContent}
             </p>
           </div>
         </div>
      </div>
    </div>
  );
};

export default FeaturesSection;