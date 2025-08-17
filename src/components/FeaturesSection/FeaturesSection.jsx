import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Shield, Zap, Target, Users, Award } from 'lucide-react';
import AnimatedSection from '../AnimatedSection/AnimatedSection';
import styles from './FeaturesSection.module.css';

const FeaturesSection = () => {
  const navigate = useNavigate();

  const handleStartJourney = () => {
    navigate('/trading-challenge');
  };

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
    {
      icon: Users,
      title: 'Community Support',
      description: 'Join a network of successful traders and share strategies.'
    },
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

        <div className={styles.featuresGrid}>
          {features.map((feature, index) => (
            <AnimatedSection key={index} delay={index * 100}>
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