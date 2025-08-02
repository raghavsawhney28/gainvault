import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSpring, animated, config } from '@react-spring/web';
import { Play } from 'lucide-react';
import styles from './HeroSection.module.css';

const HeroSection = () => {
  const navigate = useNavigate();

  const heroAnimation = useSpring({
    opacity: 1,
    transform: 'translateY(0px)',
    from: { opacity: 0, transform: 'translateY(50px)' },
    delay: 200,
    config: config.gentle,
  });

  const handleStartTrading = () => {
    navigate('/trading-challenge');
  };
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <animated.div style={heroAnimation} className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Trade with<br />
            <span className={styles.gradientText}>Precision & Power</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Access institutional-grade trading tools, real-time market data, and advanced analytics 
            to maximize your trading potential in global markets.
          </p>
          <div className={styles.heroActions}>
            <button 
              className={`${styles.btnPrimary} ${styles.btnLarge}`}
              onClick={handleStartTrading}
            >
              Start Trading Now →
            </button>
            <button className={`${styles.btnSecondary} ${styles.btnLarge}`}>
              <Play size={16} /> Watch Demo
            </button>
          </div>
        </animated.div>
      </div>
    </section>
  );
};

export default HeroSection;