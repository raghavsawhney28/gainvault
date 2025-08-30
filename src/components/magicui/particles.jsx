import React, { useEffect, useRef } from 'react';

const Particles = ({ 
  className = '',
  quantity = 10, // Increased to 15000 for extremely dense particles
  staticity = 50,
  ease = 50,
  size = 2.0, // Decreased from 2.0 to 0.0 for smaller particles
  refresh = false,
  color = '#00ff00', // Changed to green
  vx = 0,
  vy = 0
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Mobile detection and optimization
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
    
    // Debug logging
    console.log('🎯 Particles Debug:', {
      isMobile,
      screenWidth: window.innerWidth,
      userAgent: navigator.userAgent
    });
    
    // Adjust parameters for mobile
    const mobileQuantity = isMobile ? Math.max(8, Math.floor(quantity * 0.7)) : quantity;
    const mobileSize = isMobile ? Math.max(1.0, size * 1.8) : size;
    const mobileStaticity = isMobile ? Math.min(70, staticity + 10) : staticity;

    // Particle class
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * (isMobile ? 0.2 : 0.3) + vx;
        this.vy = (Math.random() - 0.5) * (isMobile ? 0.2 : 0.3) + vy;
        this.size = Math.random() * mobileSize + (isMobile ? 0.1 : 0.05);
        this.opacity = Math.random() * 0.8 + 0.6;
        this.baseColor = color;
        this.color = color;
        this.staticity = mobileStaticity / 100;
        this.ease = ease / 100;
      }

      update() {
        // Apply staticity - particles move less when staticity is high
        if (Math.random() > this.staticity) {
          this.x += this.vx * this.ease;
          this.y += this.vy * this.ease;
        }

        // Bounce off edges with reduced velocity
        if (this.x <= 0 || this.x >= canvas.width) this.vx *= -0.8;
        if (this.y <= 0 || this.y >= canvas.height) this.vy *= -0.8;

        // Wrap around edges
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = '#00ff00'; // Force green color
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    // Create particles
    const particles = [];
    
    for (let i = 0; i < mobileQuantity; i++) {
      particles.push(new Particle());
    }

    console.log('🚀 Created particles:', particles.length, 'Mobile:', isMobile, 'Size:', mobileSize);

    // Test canvas rendering
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(10, 10, 20, 20);
    console.log('🎨 Canvas test - red square should be visible');

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      // Connection lines removed - only particles are shown

      requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [quantity, staticity, ease, size, refresh, color, vx, vy]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1
      }}
    />
  );
};

export default Particles;