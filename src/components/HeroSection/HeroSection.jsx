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

  const taglines = [
    "GainVault: Altcoins. It's Our Money Now.",
    "We Provide The Funds. You Provide The Vibes.",
    "Zero Risk. Just Gains. Mostly."
  ];

  return (
    <section className={styles.hero}>
      {/* Noise Background Canvas */}
      <canvas 
        id="noise" 
        className={styles.noiseCanvas}
        width="1920" 
        height="917"
      />
      
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
              <div key={index} className={styles.tagline} style={{ animationDelay: `${index * 0.5}s` }}>
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
              onClick={handleStartTrading}
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