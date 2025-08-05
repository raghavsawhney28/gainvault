import React from 'react';
import { Star } from 'lucide-react';
import AnimatedSection from '../AnimatedSection/AnimatedSection';
import styles from './PricingSection.module.css';

const PricingSection = () => {
  const plans = [
    {
      name: 'Explorer',
      price: '$0',
      period: '/Demo Account',
      description: 'Perfect for testing your altcoin strategies',
      features: [
        'Demo trading environment',
        'Real-time altcoin data',
        'Strategy testing tools',
        'Community support',
        'Educational resources'
      ],
      buttonText: 'Start Demo',
      buttonClass: 'btnSecondary'
    },
    {
      name: 'Funded Trader',
      price: '$99',
      period: '/evaluation fee',
      description: 'Get funded and start earning real profits',
      popular: true,
      features: [
        'Up to $100K funding',
        'Keep 80% of profits',
        'Risk-free trading',
        'Advanced altcoin tools',
        'Priority support',
        'Monthly payouts',
        'Scaling opportunities'
      ],
      buttonText: 'Get Funded',
      buttonClass: 'btnPrimary'
    },
    {
      name: 'Pro Trader',
      price: '$299',
      period: '/evaluation fee',
      description: 'Maximum funding for experienced traders',
      features: [
        'Up to $500K funding',
        'Keep 90% of profits',
        'Multiple account scaling',
        'Dedicated account manager',
        'Exclusive altcoin access',
        'Custom risk parameters',
        'Weekly payouts',
        'VIP community access'
      ],
      buttonText: 'Go Pro',
      buttonClass: 'btnOutline'
    }
  ];

  return (
    <section className={styles.pricingSection} id="pricing">
      <div className={styles.container}>
        <AnimatedSection className={styles.pricingHeader}>
          <h2>Choose Your Funding Level</h2>
          <p>Start with our demo account and work your way up to substantial funding. We provide the capital, you provide the skills.</p>
        </AnimatedSection>

        <div className={styles.pricingGrid}>
          {plans.map((plan, index) => (
            <AnimatedSection key={index} delay={index * 100} className={`${styles.pricingCard} ${plan.popular ? styles.popular : ''}`}>
              {plan.popular && (
                <div className={styles.popularBadge}>
                  <Star size={14} /> Most Popular
                </div>
              )}
              <div className={styles.planHeader}>
                <h3>{plan.name}</h3>
                <div className={styles.planPrice}>
                  <span className={styles.price}>{plan.price}</span>
                  <span className={styles.period}>{plan.period}</span>
                </div>
                <p className={styles.planDescription}>{plan.description}</p>
              </div>
              <ul className={styles.featuresList}>
                {plan.features.map((feature, idx) => (
                  <li key={idx}>{feature}</li>
                ))}
              </ul>
              <button className={`${styles.btnFull} ${styles[plan.buttonClass]}`}>
                {plan.buttonText}
              </button>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection className={styles.pricingGuarantee}>
          <p>All funded accounts include risk management, profit sharing, and scaling opportunities.</p>
          <div className={styles.guaranteeBadge}>Risk-free evaluation process</div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default PricingSection;