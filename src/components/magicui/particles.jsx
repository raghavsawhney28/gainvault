import React, { useEffect, useRef } from 'react';

const Particles = ({ 
  className = '',
  quantity = 80,
  staticity = 60,
  ease = 40,
  size = 2.0,
  refresh = false,
  color = '#00ff00',
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
    
    // Adjust parameters for mobile
    const mobileQuantity = isMobile ? Math.max(20, Math.floor(quantity * 0.5)) : quantity;
    const mobileSize = isMobile ? Math.max(1.0, size * 1.5) : size;
    const mobileStaticity = isMobile ? Math.min(80, staticity + 10) : staticity;

    // Particle class
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * (isMobile ? 0.2 : 0.3) + vx;
        this.vy = (Math.random() - 0.5) * (isMobile ? 0.2 : 0.3) + vy;
        this.size = Math.random() * mobileSize + (isMobile ? 0.1 : 0.05);
        this.opacity = Math.random() * 0.5 + 0.4;
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
        ctx.fillStyle = color;
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

    // Reduce overdraw by drawing on dark bg only

    // Animation loop
    let rafId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      rafId = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (rafId) cancelAnimationFrame(rafId);
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