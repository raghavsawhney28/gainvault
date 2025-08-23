"use client";
import { useEffect, useRef } from "react";

export function SmoothCursor() {
  const containerRef = useRef(null);
  const cursorsRef = useRef([]);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Configuration
    const RING_COUNT = 4;
    const EASING = 0.2; // Reduced for much smoother movement
    
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

    // Event listener for mouse movement
    const handleMouseMove = (e) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    // Animation loop
    let animationId;
    const animate = () => {
      const cursors = cursorsRef.current;
      if (!cursors.length) return;

      // The first element (the dot) follows the mouse with slight smoothing
      cursors[0].x += (mouseRef.current.x - cursors[0].x) * 0.3;
      cursors[0].y += (mouseRef.current.y - cursors[0].y) * 0.3;

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
    document.body.style.cursor = 'none';

    // Cleanup
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.body.style.cursor = 'auto';
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
        
        
        .floating-ring {
          position: absolute;
          background-color: transparent;
          border-radius: 50%;
          transform: translate(-50%, -50%);
        }

        .ring-1 {
          border: 2px solid #c6c6c6;
          /* box-shadow: 0 0 5px 2px #ff0088, inset 0 0 5px 2px #ff0088; */
          z-index: 9997;
        }

        .ring-2 {
          border: 2px solid #ff0088;
          /* box-shadow: 0 0 5px 2px #dd00ee, inset 0 0 5px 2px #dd00ee; */
          z-index: 9996;
        }

        .ring-3 {
          border: 2px solid #dd00ee;
          /* box-shadow: 0 0 5px 2px #9911ff, inset 0 0 5px 2px #9911ff; */
          z-index: 9995;
        }

        .ring-4 {
          border: 2px solid #9911ff;
          
          z-index: 9994;
        }
      `}</style>
    </div>
  );
}
