<script setup lang="ts">
import { ref, computed } from 'vue';
import { MapPin, Star, Sparkles, Box, ArrowRight, X, ZoomIn, ZoomOut, RotateCcw, ShieldCheck, Layers } from 'lucide-vue-next';
import { usePropertyStore, PropertyItem } from '../stores/properties';

const emit = defineEmits<{
  (e: 'select-property', property: PropertyItem): void;
  (e: 'launch-3d', property: PropertyItem): void;
}>();

const propertyStore = usePropertyStore();

const activePinProperty = ref<PropertyItem | null>(null);
const zoomLevel = ref(1);

// Map Styles options with real world map photography
const mapStyles = [
  {
    id: 'physical',
    name: 'Topographic World',
    url: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=2600&q=85',
  },
  {
    id: 'satellite',
    name: 'Satellite Blue Marble',
    url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=2600&q=85',
  },
  {
    id: 'vintage',
    name: 'Physical Cartography',
    url: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=2600&q=85',
  },
];
const currentStyleId = ref('physical');

const currentMapImage = computed(() => {
  return mapStyles.find((s) => s.id === currentStyleId.value)?.url || mapStyles[0].url;
});

// Equirectangular projection for real world map coordinates to percentages
function projectToPercent(lat: number = 0, lng: number = 0) {
  // Longitude: -180 to 180 mapped to 0% to 100%
  const x = ((lng + 180) / 360) * 100;
  // Latitude: 85 to -85 mapped with Mercator correction for standard world maps
  const latClamped = Math.max(-75, Math.min(75, lat));
  const latRad = (latClamped * Math.PI) / 180;
  const mercN = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
  // Y percentage from top
  const y = 50 - (mercN / (2 * Math.PI)) * 100;
  return {
    x: Math.max(8, Math.min(92, x)),
    y: Math.max(12, Math.min(85, y)),
  };
}

const pins = computed(() => {
  return propertyStore.filteredProperties.map((p) => {
    const coords = projectToPercent(p.lat || 30, p.lng || 0);
    return {
      property: p,
      x: coords.x,
      y: coords.y,
    };
  });
});

function handlePinClick(p: PropertyItem) {
  activePinProperty.value = p;
  propertyStore.hoveredPropertyId = p.id;
}

function closePinCard() {
  activePinProperty.value = null;
  propertyStore.hoveredPropertyId = null;
}

function zoomIn() {
  if (zoomLevel.value < 2.0) zoomLevel.value = parseFloat((zoomLevel.value + 0.25).toFixed(2));
}
function zoomOut() {
  if (zoomLevel.value > 0.75) zoomLevel.value = parseFloat((zoomLevel.value - 0.25).toFixed(2));
}
function resetZoom() {
  zoomLevel.value = 1;
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
    <div class="relative w-full rounded-3xl overflow-hidden border border-neutral-200 bg-neutral-100 text-neutral-900 shadow-xl h-[560px] sm:h-[640px] select-none">
      <!-- Zoom & Reset Controls -->
      <div class="absolute top-6 left-6 z-20 flex flex-col gap-1.5 bg-white/95 backdrop-blur-md p-1.5 rounded-2xl border border-neutral-200/80 shadow-md">
        <button
          @click="zoomIn"
          title="Zoom In"
          class="p-2 rounded-xl text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 transition cursor-pointer"
        >
          <ZoomIn class="w-4 h-4" />
        </button>
        <button
          @click="zoomOut"
          title="Zoom Out"
          class="p-2 rounded-xl text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 transition cursor-pointer"
        >
          <ZoomOut class="w-4 h-4" />
        </button>
        <button
          @click="resetZoom"
          title="Reset Map Zoom"
          class="p-2 rounded-xl text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 transition cursor-pointer"
        >
          <RotateCcw class="w-4 h-4" />
        </button>
      </div>

      <!-- Map Layer Switcher (Top Left next to controls) -->
      <div class="absolute top-6 left-22 z-20 hidden md:flex items-center gap-1 bg-white/95 backdrop-blur-md p-1 rounded-2xl border border-neutral-200/80 shadow-md">
        <button
          v-for="style in mapStyles"
          :key="style.id"
          @click="currentStyleId = style.id"
          :class="[
            'px-2.5 py-1 text-[11px] font-bold rounded-xl transition cursor-pointer',
            currentStyleId === style.id
              ? 'bg-[#BA0934] text-white shadow-xs'
              : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100',
          ]"
        >
          {{ style.name }}
        </button>
      </div>

      <!-- Header Overlay (Top Right) -->
      <div class="absolute top-6 right-6 z-20 flex items-center gap-3">
        <div class="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/95 backdrop-blur-md border border-neutral-200/90 text-xs font-semibold text-neutral-800 shadow-md">
          <ShieldCheck class="w-4 h-4 text-[#BA0934]" />
          <span>{{ propertyStore.filteredProperties.length }} Verified Luxe Villas</span>
        </div>
        <button
          @click="propertyStore.toggleMap"
          class="px-4 py-2 rounded-full bg-white hover:bg-neutral-50 border border-neutral-200 text-xs font-bold text-neutral-800 shadow-md transition flex items-center gap-2 cursor-pointer"
        >
          <X class="w-4 h-4" />
          <span>Close Map</span>
        </button>
      </div>

      <!-- Real World Map Container with Interactive Pins -->
      <div class="w-full h-full relative overflow-hidden flex items-center justify-center bg-sky-950">
        <div
          class="w-full h-full relative transition-transform duration-300 ease-out origin-center flex items-center justify-center"
          :style="{ transform: `scale(${zoomLevel})` }"
        >
          <!-- Real Image of the World Map -->
          <img
            :src="currentMapImage"
            alt="Real World Map of Airbnb Luxe Destinations"
            class="w-full h-full object-cover select-none pointer-events-none filter brightness-95 contrast-105"
            draggable="false"
          />

          <!-- Translucent luxury navigational grid lines -->
          <div class="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>

          <!-- Interactive Luxury Pins on Real Map -->
          <div
            v-for="pin in pins"
            :key="pin.property.id"
            class="absolute -translate-x-1/2 -translate-y-1/2 z-10 hover:z-30 cursor-pointer transition-transform duration-200 hover:scale-110"
            :style="{ left: pin.x + '%', top: pin.y + '%' }"
            @click="handlePinClick(pin.property)"
          >
            <!-- Pin Container -->
            <div
              :class="[
                'flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold shadow-lg transition-all border whitespace-nowrap',
                activePinProperty?.id === pin.property.id || propertyStore.hoveredPropertyId === pin.property.id
                  ? 'bg-[#BA0934] text-white border-white ring-4 ring-[#BA0934]/30 scale-105'
                  : 'bg-white text-neutral-900 border-neutral-200/90 hover:bg-neutral-50 hover:border-[#BA0934]',
              ]"
            >
              <div
                :class="[
                  'w-2 h-2 rounded-full',
                  activePinProperty?.id === pin.property.id || propertyStore.hoveredPropertyId === pin.property.id
                    ? 'bg-white animate-pulse'
                    : 'bg-[#BA0934]',
                ]"
              ></div>
              <span>${{ pin.property.price_per_night.toLocaleString() }}</span>
            </div>

            <!-- Pin Stem Indicator -->
            <div
              :class="[
                'w-0.5 h-2 mx-auto',
                activePinProperty?.id === pin.property.id || propertyStore.hoveredPropertyId === pin.property.id
                  ? 'bg-[#BA0934]'
                  : 'bg-neutral-400',
              ]"
            ></div>
          </div>
        </div>
      </div>

      <!-- Active Property Mini Preview Card (Floating on bottom right) -->
      <Transition name="fade">
        <div
          v-if="activePinProperty"
          class="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 z-30 max-w-sm w-full bg-white rounded-3xl overflow-hidden shadow-2xl border border-neutral-200 p-4 text-neutral-900 min-w-0"
        >
          <div class="relative rounded-2xl overflow-hidden aspect-[16/10] mb-3">
            <img
              :src="activePinProperty.images[0]"
              :alt="activePinProperty.title"
              class="w-full h-full object-cover"
            />
            <button
              @click="closePinCard"
              class="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white transition cursor-pointer"
            >
              <X class="w-3.5 h-3.5" />
            </button>
            <div class="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-neutral-950/80 backdrop-blur-md text-[10px] font-bold text-amber-400 border border-amber-400/30">
              LUXE VERIFIED
            </div>
          </div>

          <div class="space-y-1.5 min-w-0">
            <div class="flex items-center justify-between text-xs min-w-0">
              <span class="text-neutral-500 font-medium truncate">{{ activePinProperty.location }}, {{ activePinProperty.country }}</span>
              <span class="flex items-center gap-1 font-bold text-neutral-900 shrink-0">
                <Star class="w-3.5 h-3.5 fill-[#BA0934] text-[#BA0934]" />
                {{ activePinProperty.rating.toFixed(2) }}
              </span>
            </div>

            <h4 class="text-sm font-extrabold truncate text-neutral-900">
              {{ activePinProperty.title }}
            </h4>

            <p class="text-[11px] text-neutral-500 truncate">
              Designed by <span class="font-medium text-neutral-700">{{ activePinProperty.designer || activePinProperty.architectural_style }}</span>
            </p>

            <div class="pt-2 flex items-center justify-between border-t border-neutral-100 gap-2 min-w-0">
              <div class="min-w-0">
                <span class="text-sm font-extrabold text-neutral-900">${{ activePinProperty.price_per_night.toLocaleString() }}</span>
                <span class="text-[10px] text-neutral-500 font-normal"> / night</span>
              </div>

              <div class="flex items-center gap-2 shrink-0">
                <button
                  v-if="activePinProperty.has_3d_tour"
                  @click="emit('launch-3d', activePinProperty)"
                  class="px-2.5 py-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer text-neutral-800"
                >
                  <Box class="w-3.5 h-3.5 text-[#BA0934]" />
                  <span>3D</span>
                </button>
                <button
                  @click="emit('select-property', activePinProperty)"
                  class="px-3 py-1.5 rounded-xl bg-[#BA0934] hover:bg-[#960729] text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                >
                  <span>View</span>
                  <ArrowRight class="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
