<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import * as THREE from 'three';
import { Sun, Moon, Sunset, Layers, Maximize2, Compass, RotateCw } from 'lucide-vue-next';

const props = withDefaults(
  defineProps<{
    className?: string;
    showControls?: boolean;
  }>(),
  {
    className: '',
    showControls: true,
  }
);

const emit = defineEmits<{
  (e: 'expand'): void;
}>();

const mountRef = ref<HTMLDivElement | null>(null);
const lightingMode = ref<'dusk' | 'day' | 'night'>('dusk');
const isWireframe = ref(false);
const activeHotspot = ref<string | null>(null);
const autoRotate = ref(true);

const sceneRef = ref<THREE.Scene | null>(null);
const cameraRef = ref<THREE.PerspectiveCamera | null>(null);
const rendererRef = ref<THREE.WebGLRenderer | null>(null);
const waterMeshRef = ref<THREE.Mesh | null>(null);
const materialsRef = ref<THREE.Material[]>([]);
const lightsRef = ref<{
  ambient: THREE.AmbientLight;
  dir: THREE.DirectionalLight;
  poolLight: THREE.PointLight;
  interiorLight: THREE.PointLight;
} | null>(null);

let animationFrameId: number;
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };
let spherical = { radius: 24, theta: 0.7, phi: 1.1 };
let targetCamera = { radius: 24, theta: 0.7, phi: 1.1, lookAtY: 2.5 };
let isTransitioning = false;

const updateCameraPosition = () => {
  if (!cameraRef.value) return;
  spherical.phi = Math.max(0.15, Math.min(Math.PI / 2 - 0.05, spherical.phi));
  cameraRef.value.position.x = spherical.radius * Math.sin(spherical.phi) * Math.sin(spherical.theta);
  cameraRef.value.position.y = spherical.radius * Math.cos(spherical.phi);
  cameraRef.value.position.z = spherical.radius * Math.sin(spherical.phi) * Math.cos(spherical.theta);
  cameraRef.value.lookAt(0, targetCamera.lookAtY, 0);
};

// Preset architectural viewpoints
const jumpToView = (view: 'pool' | 'suite' | 'pavilion' | 'isometric') => {
  autoRotate.value = false;
  if (view === 'pool') {
    // 1. Infinity Pool Deck view: camera dips low over the water
    targetCamera = { radius: 14, theta: 1.25, phi: 1.35, lookAtY: 1.0 };
    activeHotspot.value = 'pool';
  } else if (view === 'suite') {
    // 2. Cantilever Suite 45Â° sweep: elevated corner view
    targetCamera = { radius: 18, theta: 0.45, phi: 0.8, lookAtY: 4.5 };
    activeHotspot.value = 'suite';
  } else if (view === 'pavilion') {
    // 3. Glass Pavilion eye-level view with dusk lighting
    targetCamera = { radius: 16, theta: 2.8, phi: 1.2, lookAtY: 2.0 };
    lightingMode.value = 'dusk';
    activeHotspot.value = 'pavilion';
  } else {
    // Isometric overview
    targetCamera = { radius: 25, theta: 0.7, phi: 1.0, lookAtY: 2.5 };
    activeHotspot.value = null;
  }
  isTransitioning = true;
};

const toggleWireframe = () => {
  isWireframe.value = !isWireframe.value;
  materialsRef.value.forEach((m: any) => {
    if (m && 'wireframe' in m) {
      m.wireframe = isWireframe.value;
    }
  });
};

const toggleAutoRotate = () => {
  autoRotate.value = !autoRotate.value;
};

onMounted(() => {
  const container = mountRef.current;
  if (!container) return;

  // Scene
  const scene = new THREE.Scene();
  sceneRef.current = scene;
  scene.background = new THREE.Color(0x1a1523); // Default to dusk atmosphere

  // Camera
  const camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.set(16, 12, 20);
  camera.lookAt(0, 2, 0);
  cameraRef.value = camera;

  // Renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  rendererRef.value = renderer;
  container.appendChild(renderer.domElement);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffaa77, 0.8);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xff6b4a, 1.8);
  dirLight.position.set(20, 10, 15);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.width = 1024;
  dirLight.shadow.mapSize.height = 1024;
  scene.add(dirLight);

  const poolLight = new THREE.PointLight(0x00f0ff, 3.5, 15);
  poolLight.position.set(4, 0.5, 5);
  scene.add(poolLight);

  const interiorLight = new THREE.PointLight(0xffaa44, 4.0, 18);
  interiorLight.position.set(-2, 3.5, -1);
  scene.add(interiorLight);

  lightsRef.value = { ambient: ambientLight, dir: dirLight, poolLight, interiorLight };

  // --- PROCEDURAL 3D ARCHITECTURAL VILLA ---
  const villaGroup = new THREE.Group();

  // 1. Cliff / Ground Plinth
  const plinthGeo = new THREE.BoxGeometry(22, 1.5, 18);
  const plinthMat = new THREE.MeshStandardMaterial({
    color: 0xe5e7eb,
    roughness: 0.8,
    metalness: 0.1,
  });
  materialsRef.value.push(plinthMat);
  const plinth = new THREE.Mesh(plinthGeo, plinthMat);
  plinth.position.set(0, -0.75, 0);
  plinth.receiveShadow = true;
  villaGroup.add(plinth);

  // 2. Infinity Pool Deck (Cantilevered over plinth)
  const deckGeo = new THREE.BoxGeometry(10, 0.4, 7);
  const deckMat = new THREE.MeshStandardMaterial({
    color: 0xd6d3d1,
    roughness: 0.6,
  });
  materialsRef.value.push(deckMat);
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
  materialsRef.value.push(waterMat);
  const water = new THREE.Mesh(waterGeo, waterMat);
  water.rotation.x = -Math.PI / 2;
  water.position.set(4, 0.42, 5);
  waterMeshRef.value = water;
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
  materialsRef.value.push(groundFloorMat);
  const groundFloor = new THREE.Mesh(groundFloorGeo, groundFloorMat);
  groundFloor.position.set(-2, 1.8, 0);
  villaGroup.add(groundFloor);

  // 5. Minimalist Concrete Floor Slabs & Columns
  const slabMat = new THREE.MeshStandardMaterial({
    color: 0xf3f4f6,
    roughness: 0.3,
    metalness: 0.05,
  });
  materialsRef.value.push(slabMat);

  // Ground Ceiling Slab
  const groundCeilingGeo = new THREE.BoxGeometry(12, 0.3, 9);
  const groundCeiling = new THREE.Mesh(groundCeilingGeo, slabMat);
  groundCeiling.position.set(-2, 3.5, 0);
  groundCeiling.castShadow = true;
  groundCeiling.receiveShadow = true;
  villaGroup.add(groundCeiling);

  // Upper Cantilevered Master Suite (42ft dramatic cantilever overhang)
  const upperSuiteGeo = new THREE.BoxGeometry(9, 2.8, 7);
  const upperSuiteMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.4,
  });
  materialsRef.value.push(upperSuiteMat);
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
  materialsRef.value.push(upperGlassMat);
  const upperGlass = new THREE.Mesh(upperGlassGeo, upperGlassMat);
  upperGlass.position.set(0.5, 5, 2.5);
  villaGroup.add(upperGlass);

  // 6. Architectural Wooden Slats / Sun Screen Louvers
  const louverMat = new THREE.MeshStandardMaterial({
    color: 0x854d0e,
    roughness: 0.7,
  });
  materialsRef.value.push(louverMat);
  for (let i = 0; i < 7; i++) {
    const louverGeo = new THREE.BoxGeometry(0.12, 2.8, 2.4);
    const louver = new THREE.Mesh(louverGeo, louverMat);
    louver.position.set(-3.8 + i * 0.4, 5, 1.2);
    villaGroup.add(louver);
  }

  // 7. Signature Cherry Red Accent Element
  const cherryAccentMat = new THREE.MeshStandardMaterial({
    color: 0xba0934, // LuxeStay Cherry Red
    roughness: 0.2,
    metalness: 0.2,
  });
  materialsRef.value.push(cherryAccentMat);

  // Sun loungers on the deck
  const lounger1Geo = new THREE.BoxGeometry(1.6, 0.2, 0.8);
  const lounger1 = new THREE.Mesh(lounger1Geo, cherryAccentMat);
  lounger1.position.set(7.5, 0.5, 3.5);
  lounger1.rotation.y = -0.2;
  villaGroup.add(lounger1);

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

  scene.add(villaGroup);
  updateCameraPosition();

  // Mouse & Touch Controls
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
  const clock = new THREE.Clock();
  const animate = () => {
    animationFrameId = requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    // Subtle water ripple animation
    if (waterMeshRef.value) {
      const geo = waterMeshRef.value.geometry as THREE.PlaneGeometry;
      const pos = geo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const u = pos.getX(i);
        const v = pos.getY(i);
        pos.setZ(i, Math.sin(u * 1.5 + elapsedTime * 2) * 0.04 + Math.cos(v * 1.2 + elapsedTime * 1.5) * 0.03);
      }
      pos.needsUpdate = true;
    }

    // Smooth camera transition to target viewpoint
    if (isTransitioning) {
      const step = 0.05;
      spherical.radius += (targetCamera.radius - spherical.radius) * step;
      spherical.theta += (targetCamera.theta - spherical.theta) * step;
      spherical.phi += (targetCamera.phi - spherical.phi) * step;
      updateCameraPosition();

      if (
        Math.abs(spherical.radius - targetCamera.radius) < 0.1 &&
        Math.abs(spherical.theta - targetCamera.theta) < 0.05 &&
        Math.abs(spherical.phi - targetCamera.phi) < 0.05
      ) {
        isTransitioning = false;
      }
    } else if (!isDragging && autoRotate.value) {
      // Gentle auto-rotation
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

  onUnmounted(() => {
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
  });
});

// Watch lighting mode changes
watch(lightingMode, (newMode) => {
  if (!sceneRef.value || !lightsRef.value) return;
  const { ambient, dir, poolLight, interiorLight } = lightsRef.value;
  const scene = sceneRef.value;

  if (newMode === 'dusk') {
    scene.background = new THREE.Color(0x1a1523);
    ambient.color.setHex(0xffaa77);
    ambient.intensity = 0.8;
    dir.color.setHex(0xff6b4a);
    dir.intensity = 1.8;
    dir.position.set(20, 10, 15);
    poolLight.intensity = 3.5;
    interiorLight.intensity = 4.0;
  } else if (newMode === 'day') {
    scene.background = new THREE.Color(0xf4f6f8);
    ambient.color.setHex(0xffffff);
    ambient.intensity = 1.4;
    dir.color.setHex(0xfff7ed);
    dir.intensity = 2.2;
    dir.position.set(20, 30, 15);
    poolLight.intensity = 1.2;
    interiorLight.intensity = 1.5;
  } else if (newMode === 'night') {
    scene.background = new THREE.Color(0x0a0c10);
    ambient.color.setHex(0x334155);
    ambient.intensity = 0.4;
    dir.color.setHex(0x38bdf8);
    dir.intensity = 0.6;
    dir.position.set(-10, 20, -10);
    poolLight.intensity = 4.5;
    interiorLight.intensity = 5.0;
  }
});
</script>

<template>
  <div :class="['relative overflow-hidden bg-[#1A1A1A] select-none', className]">
    <!-- Three.js Canvas Container -->
    <div ref="mountRef" class="w-full h-full cursor-grab active:cursor-grabbing"></div>

    <!-- Architectural Hotspots / Overlay Tags -->
    <div v-if="activeHotspot === 'pool'" class="absolute bottom-16 left-6 max-w-sm glass-panel-dark rounded-xl p-4 text-white shadow-2xl border border-white/10 animate-fade-in pointer-events-auto">
      <div class="flex items-center gap-2 mb-1.5">
        <span class="w-2.5 h-2.5 rounded-full bg-[#BA0934] animate-ping"></span>
        <span class="text-xs font-semibold uppercase tracking-wider text-[#BA0934]">Cantilever Pool Deck</span>
      </div>
      <h4 class="text-base font-bold text-white mb-1">Infinity Reflection Basin</h4>
      <p class="text-xs text-neutral-300 leading-relaxed">
        Engineered with sub-surface fiber optic illuminators and continuous weir edges creating an uninterrupted mirror finish against the horizon.
      </p>
    </div>

    <div v-if="activeHotspot === 'suite'" class="absolute top-20 right-6 max-w-sm glass-panel-dark rounded-xl p-4 text-white shadow-2xl border border-white/10 animate-fade-in pointer-events-auto">
      <div class="flex items-center gap-2 mb-1.5">
        <span class="w-2.5 h-2.5 rounded-full bg-[#BA0934]"></span>
        <span class="text-xs font-semibold uppercase tracking-wider text-[#BA0934]">Cantilever Suite</span>
      </div>
      <h4 class="text-base font-bold text-white mb-1">42-Foot Structural Cantilever</h4>
      <p class="text-xs text-neutral-300 leading-relaxed">
        Post-tensioned concrete slab suspended over the hillside. Acoustic Japanese cedar sun slats attenuate afternoon glare.
      </p>
    </div>

    <div v-if="activeHotspot === 'pavilion'" class="absolute bottom-16 right-6 max-w-sm glass-panel-dark rounded-xl p-4 text-white shadow-2xl border border-white/10 animate-fade-in pointer-events-auto">
      <div class="flex items-center gap-2 mb-1.5">
        <span class="w-2.5 h-2.5 rounded-full bg-[#BA0934]"></span>
        <span class="text-xs font-semibold uppercase tracking-wider text-[#BA0934]">Glass Pavilion</span>
      </div>
      <h4 class="text-base font-bold text-white mb-1">Dusk Light Transition (2700K)</h4>
      <p class="text-xs text-neutral-300 leading-relaxed">
        Frameless low-iron structural glass walls opening seamlessly to natural cross-ventilation breezes.
      </p>
    </div>

    <!-- Floating Top Bar Controls -->
    <div v-if="showControls" class="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
      <!-- Architectural View Preset Buttons -->
      <div class="flex items-center gap-1.5 glass-panel-dark p-1.5 rounded-full border border-white/10 pointer-events-auto shadow-xl">
        <button
          @click="jumpToView('isometric')"
          class="px-3 py-1 text-xs font-medium rounded-full transition-colors text-white hover:bg-white/10"
        >
          Overview
        </button>
        <button
          @click="jumpToView('pool')"
          :class="[
            'px-3 py-1 text-xs font-medium rounded-full transition-colors',
            activeHotspot === 'pool' ? 'bg-[#BA0934] text-white' : 'text-white/80 hover:bg-white/10'
          ]"
        >
          Pool Deck
        </button>
        <button
          @click="jumpToView('suite')"
          :class="[
            'px-3 py-1 text-xs font-medium rounded-full transition-colors',
            activeHotspot === 'suite' ? 'bg-[#BA0934] text-white' : 'text-white/80 hover:bg-white/10'
          ]"
        >
          Cantilever Suite
        </button>
        <button
          @click="jumpToView('pavilion')"
          :class="[
            'px-3 py-1 text-xs font-medium rounded-full transition-colors',
            activeHotspot === 'pavilion' ? 'bg-[#BA0934] text-white' : 'text-white/80 hover:bg-white/10'
          ]"
        >
          Glass Pavilion
        </button>
      </div>

      <!-- Lighting & Tool Controls -->
      <div class="flex items-center gap-1.5 glass-panel-dark p-1.5 rounded-full border border-white/10 pointer-events-auto shadow-xl">
        <button
          @click="lightingMode = 'day'"
          title="Daylight mode"
          :class="['p-1.5 rounded-full transition-colors', lightingMode === 'day' ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white']"
        >
          <Sun class="w-4 h-4" />
        </button>
        <button
          @click="lightingMode = 'dusk'"
          title="Dusk golden hour"
          :class="['p-1.5 rounded-full transition-colors', lightingMode === 'dusk' ? 'bg-[#BA0934] text-white' : 'text-white/60 hover:text-white']"
        >
          <Sunset class="w-4 h-4" />
        </button>
        <button
          @click="lightingMode = 'night'"
          title="Night mode"
          :class="['p-1.5 rounded-full transition-colors', lightingMode === 'night' ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white']"
        >
          <Moon class="w-4 h-4" />
        </button>
        <span class="w-px h-4 bg-white/20 mx-0.5"></span>
        <button
          @click="toggleWireframe"
          title="Toggle architectural wireframe"
          :class="['p-1.5 rounded-full transition-colors', isWireframe ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white']"
        >
          <Layers class="w-4 h-4" />
        </button>
        <button
          @click="toggleAutoRotate"
          title="Toggle orbit rotation"
          :class="['p-1.5 rounded-full transition-colors', autoRotate ? 'text-[#BA0934]' : 'text-white/60 hover:text-white']"
        >
          <RotateCw class="w-4 h-4" />
        </button>
        <button
          v-if="$props.showControls"
          @click="emit('expand')"
          title="Expand full tour"
          class="p-1.5 rounded-full text-white/60 hover:text-white transition-colors"
        >
          <Maximize2 class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Bottom Interaction Indicator -->
    <div class="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none text-center">
      <span class="text-[11px] uppercase tracking-widest text-white/50 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10">
        Drag to orbit &bull; Pinch to zoom &bull; Real-time Three.js Canvas
      </span>
    </div>
  </div>
</template>
