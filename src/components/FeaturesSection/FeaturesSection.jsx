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
    
    // Only calculate if card is in viewport or near it
    if (cardTop > scrollY + windowHeight + 200 || cardTop < scrollY - 200) {
      return; // Skip if card is far from viewport
    }
    
    const isMobile = window.innerWidth <= 768;
    
    // Simple and effective flip timing for both desktop and mobile
    // Start flipping when card is 30% into the viewport
    const flipStartPoint = scrollY + (windowHeight * 0.3);
    const flipEndPoint = scrollY + (windowHeight * 0.7);
    
    let rotationY = 0;
    
    if (cardTop < flipStartPoint) {
      // Card is above flip start - no rotation
      rotationY = 0;
      card.classList.remove('flipping');
    } else if (cardTop > flipEndPoint) {
      // Card is past flip end - full rotation
      rotationY = 360;
      card.classList.remove('flipping');
    } else {
      // Card is in flip zone - calculate rotation
      const flipProgress = (cardTop - flipStartPoint) / (flipEndPoint - flipStartPoint);
      rotationY = flipProgress * 360;
      card.classList.add('flipping');
    }
    
    // Use transform3d for hardware acceleration with better precision
    // Add subtle scale effect during flipping for more dynamic feel
    const scale = 1 + (Math.sin(rotationY * Math.PI / 180) * 0.05);
    card.style.transform = `rotate3d(0, 1, 0, ${rotationY.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
    
    // Perfect flip threshold: exactly at 180 degrees
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
    window.addEventListener('scroll', handleScrollOptimized, { passive: true });
    updateCard(); // Initial check
    
    return () => {
      window.removeEventListener('scroll', handleScrollOptimized);
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