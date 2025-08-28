import React from 'react';
import threedImage from '../../assets/threed.png';
import styles from './NewSection.module.css';

export default function NewSection() {
  console.log('NewSection rendering standalone version');
  
  return (
    <section className={styles.newSection}>
      <div className={styles.container}>
        <div className={styles.contentWrapper}>
          {/* Left Column - Image fully left */}
          <div className={styles.leftColumn}>
            <div className={styles.mediaContainer}>
              <img 
                src={threedImage}
                alt="3D trading visualization"
                className={styles.media}
              />
            </div>
          </div>

          {/* Right Column - Text fully right */}
          <div className={styles.rightColumn}>
            <div className={styles.textContent}>
              <h2 className={styles.mainTitle}>
                MONEY TALKS
              </h2>
              <h2 className={styles.subTitle}>
                WE TRANSLATE
              </h2>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
