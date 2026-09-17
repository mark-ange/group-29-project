<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import {
  X,
  Box,
  Video,
  Layers,
  Compass,
  ChevronRight,
  Check,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Sparkles,
  MapPin,
  Star,
  Film,
  RotateCw,
  Sun,
  Sunset,
  ShieldCheck,
  Lock,
} from 'lucide-vue-next';
import ThreeVillaViewer from './ThreeVillaViewer.vue';
import { usePropertyStore, type PropertyItem } from '../stores/properties';
import { useAuthStore } from '../stores/auth';

const props = defineProps<{
  property: PropertyItem | null;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'reserve', property: PropertyItem): void;
}>();

const propertyStore = usePropertyStore();
const authStore = useAuthStore();

// Selected villa in the full tour (defaults to incoming property or first from store)
const currentVilla = ref<PropertyItem | null>(props.property || (propertyStore.properties[0] ?? null));

const handleReserveClick = () => {
  if (!currentVilla.value) return;
  if (!authStore.user) {
    authStore.openAuth('login', `Please sign in or create an account to reserve ${currentVilla.value.title}.`);
    return;
  }
  emit('reserve', currentVilla.value);
};

watch(
  () => props.property,
  (newProp) => {
    if (newProp) currentVilla.value = newProp;
  }
);

// Tour Modes:
// '3d-spatial': Three.js 3D WebGL spatial model
// 'simulation-video': 3rd Architectural Simulation Video Player with HUD telemetry
// 'blueprint': Architectural elevation & cantilever specifications
const activeTourMode = ref<'3d-spatial' | 'simulation-video' | 'blueprint'>('simulation-video');

// 3rd Simulation Video state
const videoRef = ref<HTMLVideoElement | null>(null);
const isPlaying = ref(true);
const isMuted = ref(true);
const videoProgress = ref(0);
const activeChapterId = ref(0);

// Video simulation sources for each villa
const villaSimulationVideos: Record<string, { videoUrl: string; duration: string; chapters: Array<{ title: string; time: number; desc: string }> }> = {
  'carbon-beach-ocean-villa': {
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-modern-luxury-house-and-pool-42861-large.mp4',
    duration: '01:45',
    chapters: [
      { title: 'Pacific Horizon Cantilever', time: 0, desc: 'Ultra-clear structural glass overhang 180ft above surf' },
      { title: 'Infinite Overflow Pool', time: 15, desc: 'Basalt edge reflecting sunset skies into the ocean' },
      { title: 'Open Living Pavilion', time: 30, desc: 'Double-height volume with acoustic teak louvers' },
      { title: 'Master Sanctuary & Spa', time: 50, desc: 'Freestanding limestone bath with panoramic coast view' },
    ],
  },
  'villa-balbianello-private-estate': {
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-luxury-house-with-a-pool-42864-large.mp4',
    duration: '02:10',
    chapters: [
      { title: 'Historic Lake Promenade', time: 0, desc: 'Century-old cypress allee leading to private boat slip' },
      { title: 'Loggia Durini Terraces', time: 20, desc: '18th-century stone arches overlooking Bellagio waters' },
      { title: 'Grand Dining Hall', time: 45, desc: 'Restored fresco ceilings and Murano crystal chandeliers' },
      { title: 'Belvedere Sunset Pergola', time: 70, desc: 'Elevated vantage point with 270-degree lake panorama' },
    ],
  },
  'kyoto-bamboo-pavilion': {
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-traditional-japanese-house-with-garden-42870-large.mp4',
    duration: '01:30',
    chapters: [
      { title: 'Arashiyama Bamboo Approach', time: 0, desc: 'Stone path winding through ancient private bamboo groves' },
      { title: 'Engawa Reflection Veranda', time: 18, desc: 'Seamless transition between tatami interiors and moss gardens' },
      { title: 'Hinoki Cypress Onsen Bath', time: 35, desc: 'Aromatic wood tub fed by mineral geothermal spring' },
      { title: 'Tea Ceremony Pavilion', time: 55, desc: 'Centuries-old joinery craft without a single iron nail' },
    ],
  },
  'chalet-zermatt-peak': {
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-luxury-home-with-swimming-pool-at-sunset-42863-large.mp4',
    duration: '02:00',
    chapters: [
      { title: 'Matterhorn Direct Axis', time: 0, desc: 'Floor-to-ceiling glass aimed precisely at Alpine peaks' },
      { title: 'Sub-Zero Indoor/Outdoor Pool', time: 22, desc: 'Heated swim-out channel into falling mountain snow' },
      { title: 'Central Suspended Fireplace', time: 48, desc: 'Sculptural steel hearth anchoring the great lounge' },
      { title: 'Private Wine Vault & Cellar', time: 72, desc: 'Carved into solid granite bedrock with grand cru vintages' },
    ],
  },
};

const defaultSimulation = {
  videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-luxury-home-with-swimming-pool-at-sunset-42863-large.mp4',
  duration: '01:50',
  chapters: [
    { title: 'Architectural Exterior Court', time: 0, desc: 'Curated entry sequence with geometric reflecting water' },
    { title: 'Great Pavilion & Cantilever', time: 20, desc: 'Pristine indoor-outdoor flow with automated pocket glass' },
    { title: 'Infinity Horizon Pool Deck', time: 40, desc: 'Negative-edge swimming channel aligned with dusk horizon' },
    { title: 'Private Master Wing', time: 65, desc: 'En-suite bath, custom dressing room, and secluded terrace' },
  ],
};

const currentSimulationData = computed(() => {
  if (!currentVilla.value) return defaultSimulation;
  return villaSimulationVideos[currentVilla.value.slug] || defaultSimulation;
});

function togglePlay() {
  if (!videoRef.value) return;
  if (videoRef.value.paused) {
    videoRef.value.play();
    isPlaying.value = true;
  } else {
    videoRef.value.pause();
    isPlaying.value = false;
  }
}

function toggleMute() {
  if (!videoRef.value) return;
  videoRef.value.muted = !videoRef.value.muted;
  isMuted.value = videoRef.value.muted;
}

function handleTimeUpdate() {
  if (!videoRef.value || !videoRef.value.duration) return;
  videoProgress.value = (videoRef.value.currentTime / videoRef.value.duration) * 100;
}

function jumpToChapter(idx: number, timeInSeconds: number) {
  activeChapterId.value = idx;
  if (videoRef.value) {
    videoRef.value.currentTime = timeInSeconds;
    if (videoRef.value.paused) {
      videoRef.value.play();
      isPlaying.value = true;
    }
  }
}

function selectVilla(villa: PropertyItem) {
  currentVilla.value = villa;
  activeChapterId.value = 0;
  videoProgress.value = 0;
  if (videoRef.value) {
    videoRef.value.load();
    videoRef.value.play().catch(() => {});
    isPlaying.value = true;
  }
}

// 3D Room hotspots
const activeRoomId = ref('pool');
const rooms = [
  { id: 'pool', name: 'Infinity Deck & Spa', desc: 'Cantilevered pool deck 180 feet above Pacific surf.' },
  { id: 'suite', name: 'Cantilever Master Suite', desc: '42-foot structural cantilever with floor-to-ceiling glass.' },
  { id: 'pavilion', name: 'Glass Living Pavilion', desc: 'Double-height volume with acoustic Japanese cedar louvers.' },
];
</script>

<template>
  <div v-if="currentVilla" class="fixed inset-0 z-50 bg-neutral-950/95 backdrop-blur-xl flex flex-col text-white select-none overflow-hidden">
    <!-- TOP MASTER NAVIGATION BAR -->
    <header class="h-16 px-4 sm:px-6 border-b border-white/10 flex items-center justify-between bg-black/60 shrink-0 gap-3 min-w-0">
      <!-- Left: Active Villa Title & Badge -->
      <div class="flex items-center gap-3 min-w-0">
        <div class="w-9 h-9 rounded-xl bg-[#BA0934] flex items-center justify-center text-white shadow-md shrink-0">
          <Box class="w-5 h-5" />
        </div>
        <div class="min-w-0">
          <div class="flex items-center gap-2 min-w-0">
            <h3 class="text-sm font-extrabold text-white tracking-tight truncate">
              {{ currentVilla.title }}
            </h3>
            <span class="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[10px] font-bold shrink-0">
              <ShieldCheck class="w-3 h-3" />
              <span>LUXE 300+ Verified</span>
            </span>
          </div>
          <p class="text-[11px] text-neutral-400 truncate">
            {{ currentVilla.location }}, {{ currentVilla.country }} &bull; Architect: {{ currentVilla.designer || currentVilla.architectural_style }}
          </p>
        </div>
      </div>

      <!-- Center: Tour Mode Switcher Tabs -->
      <div class="hidden lg:flex items-center gap-1 p-1 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-md">
        <button
          @click="activeTourMode = 'simulation-video'"
          :class="[
            'px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer',
            activeTourMode === 'simulation-video'
              ? 'bg-[#BA0934] text-white shadow'
              : 'text-neutral-300 hover:text-white hover:bg-white/5',
          ]"
        >
          <Film class="w-3.5 h-3.5" />
          <span>3rd Simulation Video Tour</span>
        </button>

        <button
          @click="activeTourMode = '3d-spatial'"
          :class="[
            'px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer',
            activeTourMode === '3d-spatial'
              ? 'bg-[#BA0934] text-white shadow'
              : 'text-neutral-300 hover:text-white hover:bg-white/5',
          ]"
        >
          <Box class="w-3.5 h-3.5" />
          <span>3D Spatial WebGL Model</span>
        </button>

        <button
          @click="activeTourMode = 'blueprint'"
          :class="[
            'px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer',
            activeTourMode === 'blueprint'
              ? 'bg-[#BA0934] text-white shadow'
              : 'text-neutral-300 hover:text-white hover:bg-white/5',
          ]"
        >
          <Layers class="w-3.5 h-3.5" />
          <span>Architectural Blueprints</span>
        </button>
      </div>

      <!-- Right: Reserve CTA & Close -->
      <div class="flex items-center gap-3 shrink-0">
        <button
          @click="handleReserveClick"
          class="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-[#BA0934] hover:bg-[#960729] text-white text-xs font-bold transition shadow-md cursor-pointer"
        >
          <Lock v-if="!authStore.user" class="w-3.5 h-3.5" />
          <span>{{ authStore.user ? `Reserve Mex$${currentVilla.price_per_night.toLocaleString()}` : 'Sign In to Reserve' }}</span>
          <ChevronRight class="w-3.5 h-3.5" />
        </button>

        <button
          @click="emit('close')"
          class="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
          title="Exit Virtual Tour"
        >
          <X class="w-5 h-5" />
        </button>
      </div>
    </header>

    <!-- MOBILE MODE SWITCHER BAR (Visible on small screens) -->
    <div class="lg:hidden flex items-center justify-around bg-neutral-900 border-b border-white/10 px-2 py-2 text-xs font-bold shrink-0">
      <button
        @click="activeTourMode = 'simulation-video'"
        :class="[
          'px-3 py-1.5 rounded-xl transition flex items-center gap-1.5',
          activeTourMode === 'simulation-video' ? 'bg-[#BA0934] text-white' : 'text-neutral-400',
        ]"
      >
        <Film class="w-3.5 h-3.5" />
        <span>Simulation Video</span>
      </button>

      <button
        @click="activeTourMode = '3d-spatial'"
        :class="[
          'px-3 py-1.5 rounded-xl transition flex items-center gap-1.5',
          activeTourMode === '3d-spatial' ? 'bg-[#BA0934] text-white' : 'text-neutral-400',
        ]"
      >
        <Box class="w-3.5 h-3.5" />
        <span>3D Walkthrough</span>
      </button>

      <button
        @click="activeTourMode = 'blueprint'"
        :class="[
          'px-3 py-1.5 rounded-xl transition flex items-center gap-1.5',
          activeTourMode === 'blueprint' ? 'bg-[#BA0934] text-white' : 'text-neutral-400',
        ]"
      >
        <Layers class="w-3.5 h-3.5" />
        <span>Specs</span>
      </button>
    </div>

    <!-- MAIN STAGE AREA -->
    <div class="relative flex-1 w-full h-full bg-[#0D0D11] overflow-hidden flex flex-col md:flex-row">
      <!-- CENTER TOUR CONTENT CANVAS -->
      <div class="relative flex-1 w-full h-full overflow-hidden flex items-center justify-center">
        <!-- 1. MODE: 3rd SIMULATION VIDEO TOUR -->
        <div v-if="activeTourMode === 'simulation-video'" class="relative w-full h-full flex flex-col items-center justify-center bg-black">
          <video
            ref="videoRef"
            :src="currentSimulationData.videoUrl"
            class="w-full h-full object-cover"
            autoplay
            loop
            :muted="isMuted"
            playsinline
            @timeupdate="handleTimeUpdate"
            @click="togglePlay"
          ></video>

          <!-- Top Left Telemetry HUD Overlay (Simulation Data) -->
          <div class="absolute top-6 left-6 z-20 flex flex-col gap-2 pointer-events-none">
            <div class="px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[11px] font-bold text-white flex items-center gap-2 shadow-lg">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>4K CINEMATIC SIMULATION FLIGHT</span>
              <span class="text-neutral-400">&bull;</span>
              <span class="text-amber-400">{{ currentVilla.architectural_style }}</span>
            </div>

            <div class="hidden sm:flex flex-col gap-1 p-3 rounded-2xl bg-black/50 backdrop-blur-md border border-white/10 text-[10px] text-neutral-300 w-64 shadow-lg font-mono">
              <div class="flex justify-between">
                <span>ORBIT SPEED:</span>
                <span class="text-emerald-400 font-bold">0.85 m/s GLIDE</span>
              </div>
              <div class="flex justify-between">
                <span>ELEVATION:</span>
                <span class="text-white font-bold">+18.4m ABOVE GRADE</span>
              </div>
              <div class="flex justify-between">
                <span>SUNLIGHT ENGINE:</span>
                <span class="text-amber-400 font-bold">GOLDEN HOUR 3200K</span>
              </div>
              <div class="flex justify-between">
                <span>ACOUSTIC SHIELD:</span>
                <span class="text-sky-300 font-bold">STC-54 RATED</span>
              </div>
            </div>
          </div>

          <!-- Bottom Video Controls & Chapter Navigation -->
          <div class="absolute bottom-6 left-4 right-4 sm:left-6 sm:right-6 z-20 flex flex-col gap-3 max-w-4xl mx-auto">
            <!-- Chapter Selector Pills -->
            <div class="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <button
                v-for="(chapter, idx) in currentSimulationData.chapters"
                :key="idx"
                @click="jumpToChapter(idx, chapter.time)"
                :class="[
                  'px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border cursor-pointer flex items-center gap-1.5 shrink-0',
                  activeChapterId === idx
                    ? 'bg-[#BA0934] border-[#BA0934] text-white shadow-lg scale-105'
                    : 'bg-black/70 border-white/15 text-neutral-300 hover:text-white hover:bg-black/90 backdrop-blur-md',
                ]"
              >
                <span>{{ chapter.title }}</span>
              </button>
            </div>

            <!-- Scrub Bar & Controls Strip -->
            <div class="p-3 sm:p-4 rounded-2xl bg-black/80 backdrop-blur-lg border border-white/15 flex items-center justify-between gap-4 shadow-2xl">
              <!-- Play/Pause & Mute Buttons -->
              <div class="flex items-center gap-2">
                <button
                  @click="togglePlay"
                  class="w-9 h-9 rounded-xl bg-white text-neutral-900 hover:bg-[#BA0934] hover:text-white flex items-center justify-center transition cursor-pointer shadow"
                  :title="isPlaying ? 'Pause' : 'Play'"
                >
                  <Pause v-if="isPlaying" class="w-4 h-4" />
                  <Play v-else class="w-4 h-4 ml-0.5" />
                </button>

                <button
                  @click="toggleMute"
                  class="p-2 rounded-xl text-neutral-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
                  :title="isMuted ? 'Unmute Audio' : 'Mute Audio'"
                >
                  <VolumeX v-if="isMuted" class="w-4 h-4 text-neutral-400" />
                  <Volume2 v-else class="w-4 h-4 text-emerald-400" />
                </button>
              </div>

              <!-- Video Progress Bar -->
              <div class="flex-1 min-w-0">
                <div class="flex justify-between text-[10px] text-neutral-400 font-mono mb-1">
                  <span>{{ currentSimulationData.chapters[activeChapterId]?.title || 'Architectural Exploration' }}</span>
                  <span>{{ currentSimulationData.duration }}</span>
                </div>
                <div class="w-full h-1.5 rounded-full bg-white/20 overflow-hidden cursor-pointer">
                  <div
                    class="h-full bg-[#BA0934] transition-all duration-150"
                    :style="{ width: `${videoProgress}%` }"
                  ></div>
                </div>
              </div>

              <!-- Active Chapter Description -->
              <div class="hidden md:block max-w-xs text-right text-[11px] text-neutral-300 truncate">
                {{ currentSimulationData.chapters[activeChapterId]?.desc }}
              </div>
            </div>
          </div>
        </div>

        <!-- 2. MODE: 3D SPATIAL WEBGL MODEL -->
        <div v-else-if="activeTourMode === '3d-spatial'" class="relative w-full h-full bg-[#15151B]">
          <ThreeVillaViewer
            className="w-full h-full"
            :showControls="true"
          />

          <!-- 3D Hotspot Room Navigation at Bottom -->
          <div class="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 p-1.5 rounded-full bg-black/80 backdrop-blur-md border border-white/20 shadow-2xl z-20">
            <button
              v-for="room in rooms"
              :key="room.id"
              @click="activeRoomId = room.id"
              :class="[
                'px-4 py-2 rounded-full text-xs font-bold transition flex items-center gap-1.5 cursor-pointer',
                activeRoomId === room.id ? 'bg-[#BA0934] text-white shadow' : 'text-neutral-300 hover:text-white hover:bg-white/10',
              ]"
            >
              <span>{{ room.name }}</span>
            </button>
          </div>
        </div>

        <!-- 3. MODE: ARCHITECTURAL BLUEPRINTS & SPECS -->
        <div v-else-if="activeTourMode === 'blueprint'" class="w-full h-full overflow-y-auto p-6 sm:p-12 max-w-4xl mx-auto space-y-8">
          <div class="space-y-2">
            <span class="text-xs font-bold text-[#BA0934] uppercase tracking-widest">Blueprint Certification</span>
            <h3 class="text-2xl sm:text-3xl font-extrabold text-white">{{ currentVilla.title }} Architectural Dossier</h3>
            <p class="text-xs sm:text-sm text-neutral-400 leading-relaxed">
              Designed by {{ currentVilla.designer || currentVilla.architectural_style }}. Verified for seismic integrity, acoustic attenuation, and certified Sub-Zero and Dornbracht fittings.
            </p>
          </div>

          <!-- Specs Table -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div class="p-4 rounded-2xl bg-white/5 border border-white/10">
              <span class="block text-xs text-neutral-400">Total Living Area</span>
              <span class="text-lg font-bold text-white">{{ currentVilla.sqft.toLocaleString() }} sq ft</span>
            </div>
            <div class="p-4 rounded-2xl bg-white/5 border border-white/10">
              <span class="block text-xs text-neutral-400">Bedrooms / Baths</span>
              <span class="text-lg font-bold text-white">{{ currentVilla.bedrooms }} Suites / {{ currentVilla.bathrooms }} Ba</span>
            </div>
            <div class="p-4 rounded-2xl bg-white/5 border border-white/10">
              <span class="block text-xs text-neutral-400">Max Guest Capacity</span>
              <span class="text-lg font-bold text-white">{{ currentVilla.max_guests }} Guests</span>
            </div>
            <div class="p-4 rounded-2xl bg-white/5 border border-white/10">
              <span class="block text-xs text-neutral-400">Structural Style</span>
              <span class="text-lg font-bold text-[#BA0934] truncate">{{ currentVilla.architectural_style }}</span>
            </div>
          </div>

          <!-- Amenities List -->
          <div class="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3">
            <h4 class="text-sm font-bold uppercase tracking-wider text-neutral-300">Verified Luxe Amenities</h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs text-neutral-300">
              <div v-for="amenity in currentVilla.amenities" :key="amenity" class="flex items-center gap-2">
                <Check class="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{{ amenity }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- RIGHT SIDEBAR: "OUR VILLAS" SELECTOR (Switch between all villas in tour) -->
      <aside class="w-full md:w-80 lg:w-96 border-t md:border-t-0 md:border-l border-white/10 bg-neutral-900/90 backdrop-blur-md flex flex-col shrink-0 h-auto md:h-full overflow-hidden">
        <!-- Sidebar Header -->
        <div class="p-4 border-b border-white/10 flex items-center justify-between">
          <div>
            <h4 class="text-xs font-extrabold uppercase tracking-wider text-white">Our Villas</h4>
            <p class="text-[10px] text-neutral-400">Select any villa to launch its virtual simulation tour</p>
          </div>
          <span class="px-2 py-0.5 rounded-full bg-[#BA0934] text-white text-[10px] font-bold">
            {{ propertyStore.properties.length }} Stays
          </span>
        </div>

        <!-- Villas List Scroll Area -->
        <div class="flex-1 overflow-y-auto p-3 space-y-2.5 max-h-48 md:max-h-full">
          <div
            v-for="villa in propertyStore.properties"
            :key="villa.id"
            @click="selectVilla(villa)"
            :class="[
              'p-2.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3',
              currentVilla?.id === villa.id
                ? 'bg-[#BA0934]/20 border-[#BA0934] ring-1 ring-[#BA0934]'
                : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20',
            ]"
          >
            <div class="w-16 h-16 rounded-xl overflow-hidden relative shrink-0 bg-neutral-800">
              <img
                :src="villa.images[0]"
                :alt="villa.title"
                class="w-full h-full object-cover"
              />
              <div
                v-if="currentVilla?.id === villa.id"
                class="absolute inset-0 bg-[#BA0934]/40 flex items-center justify-center"
              >
                <Box class="w-4 h-4 text-white" />
              </div>
            </div>

            <div class="min-w-0 flex-1">
              <div class="flex items-center justify-between text-[11px] mb-0.5">
                <span class="text-neutral-400 truncate">{{ villa.location }}</span>
                <span class="flex items-center gap-1 font-bold text-amber-400 shrink-0">
                  <Star class="w-3 h-3 fill-amber-400" />
                  {{ villa.rating.toFixed(2) }}
                </span>
              </div>

              <h5 class="text-xs font-bold text-white truncate">
                {{ villa.title }}
              </h5>

              <div class="flex items-center justify-between pt-1">
                <span class="text-xs font-extrabold text-[#BA0934]">
                  Mex${{ villa.price_per_night.toLocaleString() }}
                  <span class="text-[10px] text-neutral-400 font-normal">/nt</span>
                </span>
                <span
                  :class="[
                    'text-[10px] font-bold px-2 py-0.5 rounded-md',
                    currentVilla?.id === villa.id ? 'bg-[#BA0934] text-white' : 'bg-white/10 text-neutral-300',
                  ]"
                >
                  {{ currentVilla?.id === villa.id ? 'Active Tour' : 'Explore' }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar Footer Action -->
        <div class="p-4 border-t border-white/10 bg-black/40">
          <button
            @click="handleReserveClick"
            class="w-full py-3 rounded-xl bg-[#BA0934] hover:bg-[#960729] text-white text-xs font-bold transition shadow-lg flex items-center justify-center gap-2 cursor-pointer"
          >
            <Lock v-if="!authStore.user" class="w-4 h-4" />
            <span>{{ authStore.user ? `Book ${currentVilla.title}` : 'Sign In to Book Villa' }}</span>
            <ChevronRight class="w-4 h-4" />
          </button>
        </div>
      </aside>
    </div>
  </div>
</template>
