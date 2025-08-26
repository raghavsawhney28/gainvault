import React from 'react';
import Spline from '@splinetool/react-spline';
import styles from './ThreeDSection.module.css';

export default function ThreeDSection() {
  return (
    <section className={styles.threeDSection}>
      <div className={styles.container}>
        <div className={styles.splineContainer}>
          <Spline scene="https://prod.spline.design/wzqlWtA3QBzpvd4B/scene.splinecode" />
        </div>
      </div>
    </section>
  );
}
