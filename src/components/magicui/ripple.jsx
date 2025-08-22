import React, { useEffect, useRef } from 'react';

const Ripple = ({ 
  mainCircleSize = 210, 
  mainCircleOpacity = 0.24, 
  numCircles = 8 
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    const resizeCanvas = () => {
      const container = canvas.parentElement;
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Ripple class
    class RippleCircle {
      constructor(x, y, size, opacity, speed) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.opacity = opacity;
        this.speed = speed;
        this.currentSize = 0;
        this.maxSize = size;
        this.fadeOut = false;
      }

      update() {
        if (!this.fadeOut) {
          this.currentSize += this.speed * 0.3; // Reduced speed by multiplying by 0.3
          if (this.currentSize >= this.maxSize) {
            this.fadeOut = true;
          }
        } else {
          this.opacity -= 0.01; // Reduced fade out speed from 0.02 to 0.01
        }
      }

      draw() {
        if (this.opacity <= 0) return;
        
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.strokeStyle = '#4A90E2';
        ctx.lineWidth = 3; // Increased from 2 to 3 for better visibility
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.currentSize, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      isDead() {
        return this.opacity <= 0;
      }
    }

    // Create ripple circles
    const ripples = [];
    let time = 0;

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      time += 0.01; // Reduced from 0.02 to 0.01 for slower ripple creation

      // Create new ripples periodically
      if (ripples.length < numCircles) {
        const x = canvas.width / 2; // Center horizontally
        const y = canvas.height * 0.25; // Start from 35% down (moved higher up)
        const size = mainCircleSize + Math.random() * 100;
        const opacity = mainCircleOpacity + Math.random() * 0.3 + 0.2; // Increased base opacity further
        const speed = 1 + Math.random() * 1; // Reduced speed range from 2-4 to 1-2
        
        ripples.push(new RippleCircle(x, y, size, opacity, speed));
      }

      // Update and draw ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        ripples[i].update();
        ripples[i].draw();
        
        // Remove dead ripples
        if (ripples[i].isDead()) {
          ripples.splice(i, 1);
        }
      }

      requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [mainCircleSize, mainCircleOpacity, numCircles]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 10
      }}
    />
  );
};

export default Ripple;
