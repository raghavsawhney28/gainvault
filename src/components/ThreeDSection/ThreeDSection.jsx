import React from 'react';
import Spline from '@splinetool/react-spline';
import styles from './ThreeDSection.module.css';

export default function ThreeDSection() {
  const [isVisible, setIsVisible] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);
  const sectionRef = React.useRef(null);

  React.useEffect(() => {
    // Check if device is mobile
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
    };

    // Initial check
    checkMobile();

    // Add resize listener
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  React.useEffect(() => {
    // Don't set up observer if mobile
    if (isMobile) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Add a small delay to prevent immediate loading
          setTimeout(() => {
            setIsVisible(true);
          }, 100);
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
  }, [isMobile]);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = (error) => {
    setIsLoading(false);
    setHasError(true);
  };

  // Don't render on mobile
  if (isMobile) {
    return null;
  }
  
  return (
    <section ref={sectionRef} className={styles.threeDSection}>
      
      <div className={styles.container}>
        {/* Left Side - 3D Content */}
        <div className={styles.leftSection}>
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

        {/* Right Side - Text Content */}
        <div className={styles.rightSection}>
          <div className={styles.textContent}>
            <h1 className={styles.mainTitle}>
              MONEY TALKS
            </h1>
            <h2 className={styles.subTitle}>
              WE TRANSLATE
            </h2>
            
          </div>
        </div>
      </div>
      
    </section>
  );
}
