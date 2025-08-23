"use client";
import { useEffect, useRef } from "react";

export function SmoothCursor() {
  const containerRef = useRef(null);
  const cursorsRef = useRef([]);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Platform detection for optimization
    const isMacOS = navigator.platform.toLowerCase().includes('mac') || 
                    navigator.userAgent.toLowerCase().includes('mac');
    
    // Configuration - optimized for macOS
    const RING_COUNT = 4;
    const EASING = isMacOS ? 0.6 : 0.2; // Much faster easing for macOS
    const DOT_EASING = isMacOS ? 0.7 : 0.3; // Much faster dot movement for macOS
    
    // Performance optimization for macOS
    const FRAME_RATE = isMacOS ? 60 : 60; // Maintain 60fps on macOS
    let lastFrameTime = 0;
    const frameInterval = 1000 / FRAME_RATE;
    
    // Define the sizes and colors for each ring
    const ringProperties = [
      { width: 5, colorClass: 'ring-1' }, // Smallest ring
      { width: 16, colorClass: 'ring-2' }, // Medium ring
      { width: 24, colorClass: 'ring-3' }, // Large ring
      { width: 30, colorClass: 'ring-4' }  // Largest ring
    ];

    // Initialize mouse position
    mouseRef.current = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2
    };

    const cursors = [];

    // Create the central dot first
    const dotDiv = document.createElement('div');
    dotDiv.className = 'floating-dot';
    dotDiv.style.left = `${mouseRef.current.x}px`;
    dotDiv.style.top = `${mouseRef.current.y}px`;
    container.appendChild(dotDiv);
    cursors.push({ el: dotDiv, x: mouseRef.current.x, y: mouseRef.current.y });

    // Create the three rings based on our defined properties
    for (let i = 0; i < RING_COUNT; i++) {
      const ringDiv = document.createElement('div');
      ringDiv.className = `floating-ring ${ringProperties[i].colorClass}`;
      ringDiv.style.width = `${ringProperties[i].width}px`;
      ringDiv.style.height = `${ringProperties[i].width}px`;
      ringDiv.style.left = `${mouseRef.current.x}px`;
      ringDiv.style.top = `${mouseRef.current.y}px`;
      container.appendChild(ringDiv);
      
      cursors.push({
        el: ringDiv,
        x: mouseRef.current.x,
        y: mouseRef.current.y
      });
    }

    cursorsRef.current = cursors;

    // Enhanced cursor hiding for macOS compatibility
    const hideCursor = () => {
      // Multiple fallback methods for better cross-platform compatibility
      try {
        // Method 1: Set cursor on body
        document.body.style.cursor = 'none';
        
        // Method 2: Set cursor on html element
        document.documentElement.style.cursor = 'none';
        
        // Method 3: Set cursor on all major containers
        const containers = [document.body, document.documentElement, container];
        containers.forEach(cont => {
          if (cont && cont.style) {
            cont.style.cursor = 'none';
          }
        });
        
        // Method 4: Force cursor hiding with CSS classes
        document.body.classList.add('cursor-hidden');
        document.documentElement.classList.add('cursor-hidden');
        
        // Method 5: macOS-specific aggressive cursor hiding
        if (isMacOS) {
          // Add cursor hiding to all visible elements
          const allElements = document.querySelectorAll('*');
          allElements.forEach(el => {
            if (el.style && el !== document.body && el !== document.documentElement) {
              el.style.cursor = 'none';
            }
          });
          
          // Force cursor hiding with CSS injection
          const style = document.createElement('style');
          style.textContent = `
            * { cursor: none !important; }
            html, body, #root, .App, .main-content, .cursor-none { cursor: none !important; }
          `;
          document.head.appendChild(style);
          
          // Store reference for cleanup
          container._cursorStyle = style;
        }
        
      } catch (error) {
        console.warn('Cursor hiding failed:', error);
      }
    };

    // Event listener for mouse movement
    const handleMouseMove = (e) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    // Animation loop with performance optimization
    let animationId;
    const animate = (currentTime) => {
      const cursors = cursorsRef.current;
      if (!cursors.length) return;

      // Frame rate limiting for consistent performance on macOS
      if (isMacOS && currentTime - lastFrameTime < frameInterval) {
        animationId = requestAnimationFrame(animate);
        return;
      }
      lastFrameTime = currentTime;

      // The first element (the dot) follows the mouse with platform-optimized smoothing
      cursors[0].x += (mouseRef.current.x - cursors[0].x) * DOT_EASING;
      cursors[0].y += (mouseRef.current.y - cursors[0].y) * DOT_EASING;

      // The rings follow the previous element in the array with smooth easing
      for (let i = 1; i < cursors.length; i++) {
        const prevCursor = cursors[i - 1];
        const currentCursor = cursors[i];

        currentCursor.x += (prevCursor.x - currentCursor.x) * EASING;
        currentCursor.y += (prevCursor.y - currentCursor.y) * EASING;

        // Update the position of the element
        currentCursor.el.style.left = `${currentCursor.x}px`;
        currentCursor.el.style.top = `${currentCursor.y}px`;
      }

      animationId = requestAnimationFrame(animate);
    };

    // Start animation and add event listener
    animate();
    document.addEventListener('mousemove', handleMouseMove);
    
    // Hide cursor with enhanced method
    hideCursor();

    // Cleanup
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      
      // Restore cursor
      try {
        document.body.style.cursor = 'auto';
        document.documentElement.style.cursor = 'auto';
        document.body.classList.remove('cursor-hidden');
        document.documentElement.classList.remove('cursor-hidden');
        
        // Clean up macOS-specific cursor hiding
        if (isMacOS && container._cursorStyle) {
          if (container._cursorStyle.parentNode) {
            container._cursorStyle.parentNode.removeChild(container._cursorStyle);
          }
          delete container._cursorStyle;
        }
        
      } catch (error) {
        console.warn('Cursor restoration failed:', error);
      }
      
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      // Remove all cursor elements
      cursors.forEach(cursor => {
        if (cursor.el && cursor.el.parentNode) {
          cursor.el.parentNode.removeChild(cursor.el);
        }
      });
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="effect-container"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 9999
      }}
    >
      <style jsx>{`
        .floating-dot {
          position: absolute;
          width: 4px;
          height: 4px;
          background-color: #ffffff;
          border-radius: 50%;
          transform: translate(-50%, -50%);
          z-index: 9998;
          pointer-events: none;
        }
        
        .floating-ring {
          position: absolute;
          background-color: transparent;
          border-radius: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
        }

        .ring-1 {
          border: 2px solid #c6c6c6;
          z-index: 9997;
        }

        .ring-2 {
          border: 2px solid #ff0088;
          z-index: 9996;
        }

        .ring-3 {
          border: 2px solid #dd00ee;
          z-index: 9995;
        }

        .ring-4 {
          border: 2px solid #9911ff;
          z-index: 9994;
        }
        
        /* Enhanced cursor hiding for macOS */
        :global(.cursor-hidden) {
          cursor: none !important;
        }
        
        :global(.cursor-hidden *) {
          cursor: none !important;
        }
      `}</style>
    </div>
  );
}
