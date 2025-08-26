import React from 'react';
import Spline from '@splinetool/react-spline';
import styles from './ThreeDSection.module.css';

export default function ThreeDSection() {
  const [isVisible, setIsVisible] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);
  const sectionRef = React.useRef(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Add a small delay to prevent immediate loading
          setTimeout(() => setIsVisible(true), 100);
        } else {
          setIsVisible(false);
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setIsLoading(false);
    console.log('Spline loaded successfully');
  };

  const handleError = (error) => {
    setIsLoading(false);
    setHasError(true);
    console.error('Spline error:', error);
  };

  return (
    <section ref={sectionRef} className={styles.threeDSection}>
      <div className={styles.container}>
        <div className={styles.splineContainer}>
          {isVisible && !hasError && (
            <Spline 
              scene="https://prod.spline.design/wzqlWtA3QBzpvd4B/scene.splinecode"
              onLoad={handleLoad}
              onError={handleError}
            />
          )}
          {isLoading && (
            <div className={styles.loadingIndicator}>
              <div className={styles.spinner}></div>
            </div>
          )}
          {hasError && (
            <div className={styles.errorMessage}>
              <p>3D content failed to load</p>
              <button onClick={() => setHasError(false)}>Retry</button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
