import React, { useEffect, useRef } from 'react';

const Particles = ({ 
  className = '',
  quantity = 15000, // Increased to 15000 for extremely dense particles
  staticity = 50,
  ease = 50,
  size = 0.0, // Decreased from 2.0 to 0.0 for smaller particles
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

    // Particle class
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.3 + vx; // Reduced base velocity for more static feel
        this.vy = (Math.random() - 0.5) * 0.3 + vy;
        this.size = Math.random() * size + 0.05; // Decreased base size to 0.05 for even smaller particles
        this.opacity = Math.random() * 0.6 + 0.3; // Increased opacity for better visibility
        this.baseColor = color;
        this.color = color; // Always use the specified color (green)
        this.staticity = staticity / 100; // Convert to 0-1 range
        this.ease = ease / 100; // Convert to 0-1 range
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
    
    for (let i = 0; i < quantity; i++) {
      particles.push(new Particle());
    }

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
