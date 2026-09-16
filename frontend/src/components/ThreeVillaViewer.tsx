import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Sun, Moon, Sunset, Layers, Maximize2, Compass, RotateCw } from 'lucide-react';

interface ThreeVillaViewerProps {
  onExpand?: () => void;
  className?: string;
  showControls?: boolean;
}

export const ThreeVillaViewer: React.FC<ThreeVillaViewerProps> = ({
  onExpand,
  className = '',
  showControls = true,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [lightingMode, setLightingMode] = useState<'dusk' | 'day' | 'night'>('dusk');
  const [isWireframe, setIsWireframe] = useState(false);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [autoRotate, setAutoRotate] = useState(true);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const waterMeshRef = useRef<THREE.Mesh | null>(null);
  const materialsRef = useRef<THREE.Material[]>([]);
  const lightsRef = useRef<{
    ambient: THREE.AmbientLight;
    dir: THREE.DirectionalLight;
    poolLight: THREE.PointLight;
    interiorLight: THREE.PointLight;
  } | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0xf2f4f7);

    // Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(16, 12, 20);
    camera.lookAt(0, 2, 0);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffeedd, 1.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffd2a0, 2.0);
    dirLight.position.set(20, 25, 15);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    scene.add(dirLight);

    const poolLight = new THREE.PointLight(0x00f0ff, 2.5, 15);
    poolLight.position.set(4, 0.5, 5);
    scene.add(poolLight);

    const interiorLight = new THREE.PointLight(0xffaa44, 3.0, 18);
    interiorLight.position.set(-2, 3.5, -1);
    scene.add(interiorLight);

    lightsRef.current = { ambient: ambientLight, dir: dirLight, poolLight, interiorLight };

    // --- PROCEDURAL 3D ARCHITECTURAL VILLA ---
    const villaGroup = new THREE.Group();

    // 1. Cliff / Ground Plinth
    const plinthGeo = new THREE.BoxGeometry(22, 1.5, 18);
    const plinthMat = new THREE.MeshStandardMaterial({
      color: 0xe5e7eb,
      roughness: 0.8,
      metalness: 0.1,
    });
    materialsRef.current.push(plinthMat);
    const plinth = new THREE.Mesh(plinthGeo, plinthMat);
    plinth.position.set(0, -0.75, 0);
    plinth.receiveShadow = true;
    villaGroup.add(plinth);

    // 2. Infinity Pool Deck (Lower cantilever)
    const deckGeo = new THREE.BoxGeometry(10, 0.4, 7);
    const deckMat = new THREE.MeshStandardMaterial({
      color: 0xd6d3d1,
      roughness: 0.6,
    });
    materialsRef.current.push(deckMat);
    const deck = new THREE.Mesh(deckGeo, deckMat);
    deck.position.set(4, 0.2, 5);
    deck.receiveShadow = true;
    villaGroup.add(deck);

    // 3. Infinity Pool Water Body
    const waterGeo = new THREE.PlaneGeometry(8, 5, 24, 24);
    const waterMat = new THREE.MeshPhysicalMaterial({
      color: 0x06b6d4,
      transmission: 0.8,
      opacity: 0.88,
      transparent: true,
      roughness: 0.1,
      ior: 1.333,
    });
    materialsRef.current.push(waterMat);
    const water = new THREE.Mesh(waterGeo, waterMat);
    water.rotation.x = -Math.PI / 2;
    water.position.set(4, 0.42, 5);
    waterMeshRef.current = water;
    villaGroup.add(water);

    // 4. Main Glass Pavilion Ground Level
    const groundFloorGeo = new THREE.BoxGeometry(11, 3.2, 8);
    const groundFloorMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.85,
      opacity: 0.35,
      transparent: true,
      roughness: 0.05,
      metalness: 0.1,
    });
    materialsRef.current.push(groundFloorMat);
    const groundFloor = new THREE.Mesh(groundFloorGeo, groundFloorMat);
    groundFloor.position.set(-2, 1.8, 0);
    villaGroup.add(groundFloor);

    // 5. Minimalist Concrete Floor Slabs & Columns
    const slabMat = new THREE.MeshStandardMaterial({
      color: 0xf3f4f6,
      roughness: 0.3,
      metalness: 0.05,
    });
    materialsRef.current.push(slabMat);

    // Ground Ceiling Slab
    const groundCeilingGeo = new THREE.BoxGeometry(12, 0.3, 9);
    const groundCeiling = new THREE.Mesh(groundCeilingGeo, slabMat);
    groundCeiling.position.set(-2, 3.5, 0);
    groundCeiling.castShadow = true;
    groundCeiling.receiveShadow = true;
    villaGroup.add(groundCeiling);

    // Upper Cantilevered Master Suite (Extends out dramtically)
    const upperSuiteGeo = new THREE.BoxGeometry(9, 2.8, 7);
    const upperSuiteMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.4,
    });
    materialsRef.current.push(upperSuiteMat);
    const upperSuite = new THREE.Mesh(upperSuiteGeo, upperSuiteMat);
    upperSuite.position.set(0.5, 5, -1);
    upperSuite.castShadow = true;
    upperSuite.receiveShadow = true;
    villaGroup.add(upperSuite);

    // Upper Glazing Panorama window
    const upperGlassGeo = new THREE.BoxGeometry(6.5, 2.4, 0.2);
    const upperGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0x93c5fd,
      transmission: 0.9,
      opacity: 0.4,
      transparent: true,
      roughness: 0.05,
    });
    materialsRef.current.push(upperGlassMat);
    const upperGlass = new THREE.Mesh(upperGlassGeo, upperGlassMat);
    upperGlass.position.set(0.5, 5, 2.5);
    villaGroup.add(upperGlass);

    // 6. Architectural Wooden Slats / Sun Screen Louvers
    const louverMat = new THREE.MeshStandardMaterial({
      color: 0x854d0e,
      roughness: 0.7,
    });
    materialsRef.current.push(louverMat);
    for (let i = 0; i < 7; i++) {
      const louverGeo = new THREE.BoxGeometry(0.12, 2.8, 2.4);
      const louver = new THREE.Mesh(louverGeo, louverMat);
      louver.position.set(-3.8 + i * 0.4, 5, 1.2);
      villaGroup.add(louver);
    }

    // 7. Signature Cherry Red Accent Element (Loungers & Minimalist Sculptural Cube)
    const cherryAccentMat = new THREE.MeshStandardMaterial({
      color: 0xba0934, // LuxeStay Cherry Red
      roughness: 0.2,
      metalness: 0.2,
    });
    materialsRef.current.push(cherryAccentMat);

    // Sun lounger 1
    const lounger1Geo = new THREE.BoxGeometry(1.6, 0.2, 0.8);
    const lounger1 = new THREE.Mesh(lounger1Geo, cherryAccentMat);
    lounger1.position.set(7.5, 0.5, 3.5);
    lounger1.rotation.y = -0.2;
    villaGroup.add(lounger1);

    // Sun lounger 2
    const lounger2 = new THREE.Mesh(lounger1Geo, cherryAccentMat);
    lounger2.position.set(7.5, 0.5, 5.5);
    lounger2.rotation.y = -0.2;
    villaGroup.add(lounger2);

    // Minimalist Sculptural Cube on Entry Courtyard
    const sculptureGeo = new THREE.BoxGeometry(0.7, 0.7, 0.7);
    const sculpture = new THREE.Mesh(sculptureGeo, cherryAccentMat);
    sculpture.position.set(-6, 0.5, 4);
    sculpture.rotation.set(0.4, 0.8, 0.2);
    villaGroup.add(sculpture);

    // Interior minimalist furniture preview
    const sofaGeo = new THREE.BoxGeometry(3, 0.4, 1.6);
    const sofaMat = new THREE.MeshStandardMaterial({ color: 0x374151 });
    const sofa = new THREE.Mesh(sofaGeo, sofaMat);
    sofa.position.set(-2, 0.4, -0.5);
    villaGroup.add(sofa);

    scene.add(villaGroup);

    // Orbit Drag Interaction
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let spherical = { radius: 24, theta: 0.7, phi: 1.1 };

    const updateCameraPosition = () => {
      spherical.phi = Math.max(0.15, Math.min(Math.PI / 2 - 0.05, spherical.phi));
      camera.position.x = spherical.radius * Math.sin(spherical.phi) * Math.sin(spherical.theta);
      camera.position.y = spherical.radius * Math.cos(spherical.phi);
      camera.position.z = spherical.radius * Math.sin(spherical.phi) * Math.cos(spherical.theta);
      camera.lookAt(0, 2.5, 0);
    };
    updateCameraPosition();

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      spherical.theta -= deltaX * 0.008;
      spherical.phi -= deltaY * 0.008;

      updateCameraPosition();
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      spherical.radius = Math.max(10, Math.min(38, spherical.radius + e.deltaY * 0.02));
      updateCameraPosition();
    };

    // Touch support for mobile
    let touchStart = { x: 0, y: 0 };
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        const deltaX = e.touches[0].clientX - touchStart.x;
        const deltaY = e.touches[0].clientY - touchStart.y;
        spherical.theta -= deltaX * 0.008;
        spherical.phi -= deltaY * 0.008;
        updateCameraPosition();
        touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    domElement.addEventListener('wheel', onWheel, { passive: false });
    domElement.addEventListener('touchstart', onTouchStart, { passive: true });
    domElement.addEventListener('touchmove', onTouchMove, { passive: true });

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Water subtle shimmer wave
      if (waterMeshRef.current) {
        const geo = waterMeshRef.current.geometry as THREE.PlaneGeometry;
        const pos = geo.attributes.position;
        for (let i = 0; i < pos.count; i++) {
          const u = pos.getX(i);
          const v = pos.getY(i);
          pos.setZ(i, Math.sin(u * 1.5 + elapsedTime * 2) * 0.04 + Math.cos(v * 1.2 + elapsedTime * 1.5) * 0.03);
        }
        pos.needsUpdate = true;
      }

      // Gentle auto-rotation when user is idle
      if (!isDragging && autoRotate) {
        spherical.theta += 0.002;
        updateCameraPosition();
      }

      renderer.render(scene, camera);
    };
    animate();

    // Resize Observer
    const resizeObserver = new ResizeObserver(() => {
      if (!container || !renderer || !camera) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    });
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animationFrameId);
      domElement.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      domElement.removeEventListener('wheel', onWheel);
      domElement.removeEventListener('touchstart', onTouchStart);
      domElement.removeEventListener('touchmove', onTouchMove);
      resizeObserver.disconnect();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Update lighting mode
  useEffect(() => {
    if (!sceneRef.current || !lightsRef.current) return;
    const { ambient, dir, poolLight, interiorLight } = lightsRef.current;
    const scene = sceneRef.current;

    if (lightingMode === 'dusk') {
      scene.background = new THREE.Color(0x1a1523);
      ambient.color.setHex(0xffaa77);
      ambient.intensity = 0.8;
      dir.color.setHex(0xff6b4a);
      dir.intensity = 1.8;
      dir.position.set(20, 10, 15);
      poolLight.intensity = 3.5;
      interiorLight.intensity = 4.0;
    } else if (lightingMode === 'day') {
      scene.background = new THREE.Color(0xf4f6f8);
      ambient.color.setHex(0xffffff);
      ambient.intensity = 1.4;
      dir.color.setHex(0xfff7ed);
      dir.intensity = 2.4;
      dir.position.set(20, 25, 15);
      poolLight.intensity = 1.2;
      interiorLight.intensity = 1.5;
    } else if (lightingMode === 'night') {
      scene.background = new THREE.Color(0x0a0c10);
      ambient.color.setHex(0x1e293b);
      ambient.intensity = 0.4;
      dir.color.setHex(0x38bdf8);
      dir.intensity = 0.5;
      dir.position.set(10, 20, 10);
      poolLight.intensity = 5.0;
      interiorLight.intensity = 4.5;
    }
  }, [lightingMode]);

  // Wireframe toggle
  useEffect(() => {
    materialsRef.current.forEach((mat) => {
      mat.wireframe = isWireframe;
    });
  }, [isWireframe]);

  return (
    <div className={`relative w-full h-full min-h-[360px] rounded-2xl overflow-hidden select-none bg-neutral-100 ${className}`}>
      {/* 3D Canvas Mount */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Floating Glass Badge */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/85 backdrop-blur-md border border-white/60 shadow-sm text-xs font-semibold text-neutral-800">
        <span className="w-2 h-2 rounded-full bg-[#BA0934] animate-pulse" />
        LIVE 3D MODEL • MALIBU VILLA
      </div>

      {/* Floating Control Toolbar */}
      {showControls && (
        <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 p-1 rounded-full bg-white/85 backdrop-blur-md border border-white/60 shadow-sm">
          <button
            onClick={() => setLightingMode('day')}
            className={`p-1.5 rounded-full transition-colors ${
              lightingMode === 'day' ? 'bg-[#BA0934] text-white' : 'text-neutral-600 hover:text-neutral-900'
            }`}
            title="Daylight Architecture"
          >
            <Sun className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setLightingMode('dusk')}
            className={`p-1.5 rounded-full transition-colors ${
              lightingMode === 'dusk' ? 'bg-[#BA0934] text-white' : 'text-neutral-600 hover:text-neutral-900'
            }`}
            title="Golden Hour Dusk"
          >
            <Sunset className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setLightingMode('night')}
            className={`p-1.5 rounded-full transition-colors ${
              lightingMode === 'night' ? 'bg-[#BA0934] text-white' : 'text-neutral-600 hover:text-neutral-900'
            }`}
            title="Night Illumination"
          >
            <Moon className="w-3.5 h-3.5" />
          </button>
          <div className="w-px h-3 bg-neutral-200 mx-0.5" />
          <button
            onClick={() => setIsWireframe(!isWireframe)}
            className={`p-1.5 rounded-full transition-colors ${
              isWireframe ? 'bg-[#BA0934] text-white' : 'text-neutral-600 hover:text-neutral-900'
            }`}
            title="Toggle Structural Blueprint"
          >
            <Layers className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`p-1.5 rounded-full transition-colors ${
              autoRotate ? 'text-[#BA0934]' : 'text-neutral-400'
            }`}
            title="Toggle 360 Auto-Rotation"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
          {onExpand && (
            <button
              onClick={onExpand}
              className="p-1.5 rounded-full text-neutral-600 hover:text-neutral-900 transition-colors"
              title="Launch Fullscreen 3D Tour"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Interactive 3D Hotspot Chips at bottom */}
      <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-1.5 overflow-x-auto py-1">
          <button
            onClick={() => setActiveHotspot(activeHotspot === 'infinity' ? null : 'infinity')}
            className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md border border-white/60 shadow-xs text-[11px] font-medium text-neutral-700 hover:bg-[#BA0934] hover:text-white transition-all flex items-center gap-1"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#BA0934]" />
            Infinity Pool Deck
          </button>
          <button
            onClick={() => setActiveHotspot(activeHotspot === 'cantilever' ? null : 'cantilever')}
            className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md border border-white/60 shadow-xs text-[11px] font-medium text-neutral-700 hover:bg-[#BA0934] hover:text-white transition-all flex items-center gap-1"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
            Cantilever Suite
          </button>
          <button
            onClick={() => setActiveHotspot(activeHotspot === 'glass' ? null : 'glass')}
            className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md border border-white/60 shadow-xs text-[11px] font-medium text-neutral-700 hover:bg-[#BA0934] hover:text-white transition-all flex items-center gap-1"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Glass Pavilion
          </button>
        </div>

        <div className="pointer-events-auto hidden sm:flex items-center gap-1 text-[11px] text-neutral-400 bg-white/80 px-2.5 py-1 rounded-full border border-white/60">
          <Compass className="w-3 h-3" />
          <span>Drag to orbit • Scroll to zoom</span>
        </div>
      </div>

      {/* Active Hotspot Info Card Overlay */}
      {activeHotspot && (
        <div className="absolute top-16 left-4 max-w-xs p-3.5 rounded-xl bg-white/95 backdrop-blur-xl border border-white/80 shadow-lg z-20 transition-all">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] tracking-wider uppercase font-bold text-[#BA0934]">
              {activeHotspot === 'infinity' ? 'Architectural Spec' : activeHotspot === 'cantilever' ? 'Engineering Feat' : 'Material Detail'}
            </span>
            <button
              onClick={() => setActiveHotspot(null)}
              className="text-neutral-400 hover:text-neutral-700 text-xs px-1"
            >
              ✕
            </button>
          </div>
          <h4 className="text-xs font-semibold text-neutral-900">
            {activeHotspot === 'infinity' && 'Zero-Edge Heated Saltwater Pool'}
            {activeHotspot === 'cantilever' && 'Suspended 18ft Steel Truss Overhang'}
            {activeHotspot === 'glass' && 'Acoustic Motorized Glazing System'}
          </h4>
          <p className="text-[11px] text-neutral-600 mt-1 leading-relaxed">
            {activeHotspot === 'infinity' &&
              'Continuous horizon overflow with perimeter fiber-optic submerged illumination, heated to 86°F year-round.'}
            {activeHotspot === 'cantilever' &&
              'Engineered with dual pre-stressed post-tensioned concrete beams floating without ground pillars.'}
            {activeHotspot === 'glass' &&
              'Triple-pane UV-filtered acoustic pocket glass panels slide silently into hidden wall cavities.'}
          </p>
        </div>
      )}
    </div>
  );
};
