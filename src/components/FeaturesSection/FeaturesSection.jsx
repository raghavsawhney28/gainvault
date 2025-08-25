import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import styles from './FeaturesSection.module.css';

const FeaturesSection = () => {
  const features = [
    {
      backgroundImage: '/src/assets/card1.png',
      title: 'Advanced Trading Technology',
      description: 'Cutting-edge algorithms and real-time market data for optimal trading decisions.'
    },
    {
      backgroundImage: '/src/assets/card2.png',
      title: 'Risk Management',
      description: 'Sophisticated risk controls and portfolio protection strategies.'
    },
    {
      backgroundImage: '/src/assets/card3.png',
      title: 'Performance Analytics',
      description: 'Comprehensive reporting and performance tracking tools.'
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

      {/* Individual Animated Cards */}
      {features.map((feature, index) => (
        <AnimatedCard key={index} feature={feature} index={index} />
      ))}
      
      {/* Get Started Button Section */}
      <div className={styles.buttonSection}>
        <button className={styles.getStartedButton}>
          Get Started
        </button>
      </div>
    </section>
  );
};

// Individual Animated Card Component
const AnimatedCard = ({ feature, index }) => {
  const cardRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [45, 0, -45]);

  return (
    <motion.div
      ref={cardRef}
      className={styles.animatedCard}
      style={{
        y,
        opacity,
        scale,
        rotateX,
      }}
    >
      <div 
        className={styles.cardContent}
        style={{
          backgroundImage: `url(${feature.backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className={styles.cardOverlay}>
          <h2 className={styles.cardTitle}>
            {feature.title}
          </h2>
          <p className={styles.cardDescription}>
            {feature.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default FeaturesSection;