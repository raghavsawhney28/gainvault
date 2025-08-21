import { useEffect, useState } from 'react';

export const usePerformance = () => {
  const [performanceMetrics, setPerformanceMetrics] = useState({
    isMobile: false,
    devicePixelRatio: 1,
    connectionType: 'unknown',
    memoryInfo: null,
  });

  useEffect(() => {
    const checkPerformance = () => {
      const isMobile = window.innerWidth <= 768;
      const devicePixelRatio = window.devicePixelRatio || 1;
      
      // Check connection type if available
      let connectionType = 'unknown';
      if ('connection' in navigator) {
        connectionType = navigator.connection.effectiveType || 'unknown';
      }
      
      // Check memory info if available
      let memoryInfo = null;
      if ('memory' in performance) {
        memoryInfo = {
          usedJSHeapSize: performance.memory.usedJSHeapSize,
          totalJSHeapSize: performance.memory.totalJSHeapSize,
          jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
        };
      }

      setPerformanceMetrics({
        isMobile,
        devicePixelRatio,
        connectionType,
        memoryInfo,
      });
    };

    checkPerformance();
    window.addEventListener('resize', checkPerformance);
    
    return () => window.removeEventListener('resize', checkPerformance);
  }, []);

  // Performance optimization recommendations
  const getOptimizationTips = () => {
    const tips = [];
    
    if (performanceMetrics.isMobile) {
      tips.push('Mobile device detected - animations disabled for better performance');
    }
    
    if (performanceMetrics.devicePixelRatio > 2) {
      tips.push('High DPI device - consider optimizing images and graphics');
    }
    
    if (performanceMetrics.connectionType === 'slow-2g' || performanceMetrics.connectionType === '2g') {
      tips.push('Slow connection detected - consider reducing asset sizes');
    }
    
    return tips;
  };

  return {
    ...performanceMetrics,
    getOptimizationTips,
  };
};

export default usePerformance;
