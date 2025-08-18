import React, { useEffect, useRef, useCallback } from 'react';
import styles from './ThreeDBackground.module.css';

const ThreeDBackground = ({ children, sectionId }) => {
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const animationRef = useRef(null);
  const globeRef = useRef(null);
  const starsRef = useRef(null);
  const contentRef = useRef(null);
  const cameraRef = useRef(null);

  // Initialize Three.js scene
  const initThreeJS = useCallback(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.position.setZ(40);
    cameraRef.current = camera;

    // Store references
    sceneRef.current = scene;
    rendererRef.current = renderer;

    // Create globe
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);
    globeRef.current = globeGroup;
    const GLOBE_RADIUS = 15;

    // Core of the globe
    const coreGeometry = new THREE.SphereGeometry(GLOBE_RADIUS, 64, 64);
    const coreMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x22C55E, // GainVault green
      roughness: 0.7, 
      metalness: 0.1,
      transparent: true,
      opacity: 0.8
    });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    globeGroup.add(core);

    // Create Bitcoin icon texture
    const createBitcoinTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');
      
      // Clear canvas
      ctx.clearRect(0, 0, 64, 64);
      
      // Bitcoin symbol (₿)
      ctx.fillStyle = '#F7931A'; // Bitcoin orange
      ctx.font = 'bold 48px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('₿', 32, 32);
      
      return canvas;
    };

    // Bitcoin icons on globe (reduced from 45x45 to 32x32)
    const bitcoinGeometry = new THREE.SphereGeometry(GLOBE_RADIUS + 0.1, 32, 32);
    const bitcoinMaterial = new THREE.MeshBasicMaterial({
      color: 0xF7931A, // Bitcoin orange
      transparent: true,
      opacity: 0.8,
      side: THREE.DoubleSide
    });
    
    // Create individual Bitcoin icons
    const bitcoinGroup = new THREE.Group();
    const bitcoinPositions = [];
    
    // Generate positions for Bitcoin icons
    for (let i = 0; i < 32; i++) {
      for (let j = 0; j < 32; j++) {
        const phi = (i / 31) * Math.PI;
        const theta = (j / 31) * Math.PI * 2;
        
        const x = (GLOBE_RADIUS + 0.1) * Math.sin(phi) * Math.cos(theta);
        const y = (GLOBE_RADIUS + 0.1) * Math.cos(phi);
        const z = (GLOBE_RADIUS + 0.1) * Math.sin(phi) * Math.sin(theta);
        
        bitcoinPositions.push({ x, y, z, phi, theta });
      }
    }
    
    // Create Bitcoin icon sprites
    bitcoinPositions.forEach((pos, index) => {
      if (index % 6 === 0) { // Reduce density by only placing every 6th icon
        const bitcoinIcon = new THREE.Sprite(
          new THREE.SpriteMaterial({
            map: new THREE.CanvasTexture(createBitcoinTexture()),
            transparent: true,
            opacity: 0.7
          })
        );
        bitcoinIcon.position.set(pos.x, pos.y, pos.z);
        bitcoinIcon.scale.set(1.5, 1.5, 1.5);
        
        // Make icon face camera
        bitcoinIcon.material.rotation = Math.atan2(pos.x, pos.z);
        
        bitcoinGroup.add(bitcoinIcon);
      }
    });
    
    globeGroup.add(bitcoinGroup);

    // Concentric rings around the globe
    for (let i = 1; i <= 3; i++) {
      const ringGeometry = new THREE.RingGeometry(
        GLOBE_RADIUS + i * 2, 
        GLOBE_RADIUS + i * 2 + 0.1, 
        128
      );
      const ringMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x22C55E, 
        side: THREE.DoubleSide, 
        transparent: true, 
        opacity: 0.3 
      });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.rotation.x = Math.PI / 2;
      globeGroup.add(ring);
    }

    // Add floating particles around the globe (reduced from 200 to 80)
    const particleGeometry = new THREE.BufferGeometry();
    const particleVertices = [];
    for (let i = 0; i < 80; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = GLOBE_RADIUS + 5 + Math.random() * 10;
      const height = (Math.random() - 0.5) * 20;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = height;
      particleVertices.push(x, y, z);
    }
    particleGeometry.setAttribute('position', new THREE.Float32BufferAttribute(particleVertices, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: 0x22C55E,
      size: 0.3,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    globeGroup.add(particles);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0x22C55E, 0.8);
    directionalLight.position.set(50, 20, 30);
    scene.add(directionalLight);

    // Add point light that follows the globe
    const pointLight = new THREE.PointLight(0x22C55E, 1, 100);
    pointLight.position.set(0, 0, 0);
    globeGroup.add(pointLight);

    // Dynamic starfield background (reduced from 8000 to 3000)
    const starGeometry = new THREE.BufferGeometry();
    const starVertices = [];
    for (let i = 0; i < 3000; i++) {
      const x = (Math.random() - 0.5) * 2000;
      const y = (Math.random() - 0.5) * 2000;
      const z = (Math.random() - 0.5) * 2000;
      starVertices.push(x, y, z);
    }
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    const starMaterial = new THREE.PointsMaterial({
      color: 0x22C55E,
      size: 0.7,
      transparent: true,
      opacity: 0.6
    });
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);
    starsRef.current = stars;

    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (event) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    document.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);

      // Animate stars forward
      const positions = starGeometry.attributes.position.array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 2] += 0.2;
        if (positions[i + 2] > 1000) {
          positions[i + 2] = -1000;
        }
      }
      starGeometry.attributes.position.needsUpdate = true;

      // Starfield interaction with cursor
      const fastFactor = 0.08;
      stars.rotation.y += (mouseX * 0.1 - stars.rotation.y) * fastFactor;
      stars.rotation.x += (mouseY * 0.1 - stars.rotation.x) * fastFactor;

      // Globe rotation
      globeGroup.rotation.y += 0.002;
      globeGroup.rotation.x += 0.001;

      // Animate floating particles
      const particlePositions = particleGeometry.attributes.position.array;
      for (let i = 0; i < particlePositions.length; i += 3) {
        particlePositions[i + 1] += Math.sin(Date.now() * 0.001 + i) * 0.01;
      }
      particleGeometry.attributes.position.needsUpdate = true;

      // Camera parallax
      camera.position.x += (mouseX * 1.5 - camera.position.x) * fastFactor;
      camera.position.y += (mouseY * 1.5 - camera.position.y) * fastFactor;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup function
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Enhanced scroll-triggered animations
  useEffect(() => {
    const handleScroll = () => {
      if (!globeRef.current || !contentRef.current) return;

      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const sectionTop = contentRef.current.offsetTop;
      const sectionHeight = contentRef.current.offsetHeight;
      
      // Calculate scroll progress for this section
      const scrollProgress = Math.max(0, Math.min(1, 
        (scrollY - sectionTop + windowHeight) / (sectionHeight + windowHeight)
      ));

      // Enhanced globe transformations based on scroll
      const scale = 1 + scrollProgress * 2;
      const rotationY = scrollProgress * Math.PI * 3;
      const rotationX = scrollProgress * Math.PI * 1.5;
      
      if (globeRef.current) {
        globeRef.current.scale.setScalar(scale);
        globeRef.current.rotation.y = rotationY;
        globeRef.current.rotation.x = rotationX;
        
        // Add some wobble effect
        globeRef.current.rotation.z = Math.sin(scrollProgress * Math.PI * 4) * 0.1;
      }

      // Camera zoom and movement based on scroll
      if (cameraRef.current) {
        const cameraZ = 40 - scrollProgress * 20;
        const cameraX = scrollProgress * 10;
        const cameraY = scrollProgress * 5;
        
        cameraRef.current.position.z = cameraZ;
        cameraRef.current.position.x = cameraX;
        cameraRef.current.position.y = cameraY;
      }

      // Enhanced content emergence effect
      const content = contentRef.current;
      if (content) {
        const opacity = Math.min(1, scrollProgress * 4);
        const translateY = (1 - scrollProgress) * 150;
        const scale = 0.3 + scrollProgress * 0.7;
        const rotateY = (1 - scrollProgress) * 20;
        
        content.style.opacity = opacity;
        content.style.transform = `translateY(${translateY}px) scale(${scale}) rotateY(${rotateY}deg)`;
        
        // Add blur effect that clears as content emerges
        const blur = (1 - scrollProgress) * 10;
        content.style.filter = `blur(${blur}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Initialize Three.js
  useEffect(() => {
    const loadThreeJS = async () => {
      try {
        if (typeof THREE === 'undefined') {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
          script.onload = initThreeJS;
          document.head.appendChild(script);
        } else {
          initThreeJS();
        }
      } catch (error) {
        console.error('Error loading Three.js:', error);
      }
    };

    loadThreeJS();

    // Handle resize
    const handleResize = () => {
      if (rendererRef.current && sceneRef.current) {
        const camera = sceneRef.current.children.find(child => child.type === 'PerspectiveCamera');
        if (camera) {
          camera.aspect = window.innerWidth / window.innerHeight;
          camera.updateProjectionMatrix();
        }
        rendererRef.current.setSize(window.innerWidth, window.innerHeight);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [initThreeJS]);

  return (
    <div className={styles.threeDBackground} ref={contentRef}>
      {/* 3D Globe Canvas */}
      <canvas 
        ref={canvasRef} 
        className={styles.globeCanvas}
      />
      
      {/* Noise overlay for grainy effect */}
      <div className={styles.noiseOverlay} />
      
      {/* Content */}
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
};

export default ThreeDBackground;
