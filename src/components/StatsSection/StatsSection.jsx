import React from 'react';
import { BarChart3, Users, Zap } from 'lucide-react';
import AnimatedSection from '../AnimatedSection/AnimatedSection';
import styles from './StatsSection.module.css';

const StatsSection = () => {
  const stats = [
    { icon: BarChart3, value: '$2.4B+', label: 'Daily Volume' },
    { icon: Users, value: '500K+', label: 'Active Traders' },
    { icon: Zap, value: '0.1ms', label: 'Execution Speed' }
  ];

  return (
    <AnimatedSection className={styles.statsSection}>
      <div className={styles.container}>
        <div className={styles.statsGrid}>
          {stats.map((stat, index) => (
            <div key={index} className={styles.statItem}>
              <stat.icon className={styles.statIcon} size={32} />
              <div className={styles.statValue}>{stat.value}</div>
              <div className={styles.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
};

export default StatsSection;