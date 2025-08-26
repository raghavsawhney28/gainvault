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
        <button className={styles.getStartedButton}>
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

  const handleScroll = () => {
    if (!isScrolling) {
      setIsScrolling(true);
      requestAnimationFrame(() => {
        updateCard();
        setIsScrolling(false);
      });
    }
  };

  const updateCard = () => {
    if (!cardRef.current) return;
    
    const card = cardRef.current;
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    
    const cardRect = card.getBoundingClientRect();
    const cardTop = cardRect.top + scrollY;
    const cardHeight = cardRect.height;
    
    // Cards start at 0 degrees (original state) when fully visible
    // Only start flipping when cards are above 80% of their height from viewport top
    let rotationY = 0;
    
    // Calculate when card is above 80% of its height from viewport top
    // This means cards will flip much later, when they're higher up
    const flipStartPoint = scrollY + (windowHeight * 0.8); // Start flipping when card is above 80% of viewport height
    
    if (cardTop < flipStartPoint) {
      // Calculate how much the card has moved past the flip start point
      const scrollProgress = Math.max(0, (flipStartPoint - cardTop) / (windowHeight + cardHeight));
      
      // Map scroll progress to rotation: 0 to 360 degrees with ultra-smooth easing
      // Use multiple easing functions for buttery smooth animation
      const easedProgress = scrollProgress < 0.5 
        ? 2 * scrollProgress * scrollProgress * scrollProgress * scrollProgress
        : 1 - Math.pow(-2 * scrollProgress + 2, 4) / 2; // Smooth quartic easing
      rotationY = Math.min(360, easedProgress * 360); // Full 360 degree rotation
      
      // Add flipping class to prevent flickering
      card.classList.add('flipping');
    } else {
      // Remove flipping class when not flipping
      card.classList.remove('flipping');
    }
    
    // Apply transform with smooth easing
    card.style.transform = `rotateY(${rotationY}deg)`;
    
    // Add flipped class for fallback browsers
    if (rotationY > 180) {
      card.classList.add('flipped');
    } else {
      card.classList.remove('flipped');
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

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    updateCard(); // Initial check
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className={styles.animatedCard}>
      <div 
        ref={cardRef}
        className={styles.cardContent}
        data-card={index + 1}
        onClick={handleCardClick}
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