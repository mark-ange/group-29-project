<script setup lang="ts">
import { ref } from 'vue';
import ThreeVillaViewer from './ThreeVillaViewer.vue';
import { Sparkles, Compass, Eye, Calendar, Users, Search, ChevronRight } from 'lucide-vue-next';
import { usePropertyStore } from '../stores/properties';

const emit = defineEmits<{
  (e: 'openTour', propertySlug?: string): void;
  (e: 'scrollToVillas'): void;
}>();

const propertyStore = usePropertyStore();
const searchQuery = ref('');
const checkIn = ref('');
const checkOut = ref('');
const guests = ref('2');

const handleSearch = () => {
  propertyStore.searchQuery = searchQuery.value;
  emit('scrollToVillas');
};
</script>

<template>
  <section class="relative pt-6 pb-12 overflow-hidden">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Main Grid: Editorial Typography Left + 3D Villa Canvas Right -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <!-- Left Editorial Copy -->
        <div class="lg:col-span-6 space-y-6">
          <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-100 border border-neutral-200/80 text-neutral-800 text-xs font-semibold">
            <span class="w-2 h-2 rounded-full bg-[#BA0934]"></span>
            <span>Architectural Sanctuary Collection</span>
          </div>

          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#1A1A1A] leading-[1.08]">
            Inhabiting the <br />
            <span class="text-[#BA0934]">Edge of Horizon</span>.
          </h1>

          <p class="text-base sm:text-lg text-neutral-600 leading-relaxed max-w-xl">
            Curated private residences defined by radical modernist cantilevers, zero-edge reflection pools, and seamless indoor-outdoor living. Explore before you reserve with our real-time interactive 3D spatial models.
          </p>

          <!-- Search Bar Container -->
          <div class="p-2.5 bg-white rounded-3xl shadow-xl border border-neutral-200/80 max-w-xl">
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div class="px-3.5 py-2 hover:bg-neutral-50 rounded-2xl transition-colors">
                <label class="block text-[10px] font-extrabold uppercase tracking-wider text-neutral-400">Where</label>
                <input
                  v-model="searchQuery"
                  @keyup.enter="handleSearch"
                  type="text"
                  placeholder="Lake Como, Malibu, Zermatt..."
                  class="w-full text-xs font-semibold text-neutral-900 bg-transparent border-none p-0 focus:outline-none focus:ring-0 placeholder:text-neutral-400"
                />
              </div>

              <div class="px-3.5 py-2 hover:bg-neutral-50 rounded-2xl transition-colors border-t sm:border-t-0 sm:border-l border-neutral-100">
                <label class="block text-[10px] font-extrabold uppercase tracking-wider text-neutral-400">Experience</label>
                <select
                  v-model="propertyStore.activeCategory"
                  class="w-full text-xs font-semibold text-neutral-900 bg-transparent border-none p-0 focus:outline-none focus:ring-0 cursor-pointer"
                >
                  <option value="all">All Architectural Genres</option>
                  <option value="3d-tours">3D Virtual Tours</option>
                  <option value="beachfront">Cantilever Beachfront</option>
                  <option value="mansions">Historic Waterfront</option>
                  <option value="desert">Desert Modernism</option>
                  <option value="ski">Alpine Monoliths</option>
                </select>
              </div>

              <div class="flex items-center justify-between sm:justify-end gap-2 p-1">
                <button
                  @click="handleSearch"
                  class="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#BA0934] hover:bg-[#960729] text-white text-xs font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <Search class="w-4 h-4" />
                  <span>Discover</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Feature Badges -->
          <div class="flex flex-wrap items-center gap-6 pt-2 text-xs font-medium text-neutral-500">
            <div class="flex items-center gap-2">
              <div class="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
              <span>PostgreSQL Real-Time Availability</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-1.5 h-1.5 rounded-full bg-[#BA0934]"></div>
              <span>Three.js Spatial Models</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
              <span>Instant Host Confirmation</span>
            </div>
          </div>
        </div>

        <!-- Right 3D Villa Canvas Card -->
        <div class="lg:col-span-6">
          <div class="relative rounded-3xl overflow-hidden shadow-2xl border border-neutral-200/80 bg-[#1A1A1A] group">
            <!-- 3D Viewer Instance -->
            <ThreeVillaViewer
              className="w-full h-[460px]"
              @expand="emit('openTour', 'the-monolith-pacific')"
            />

            <!-- Corner Floating Badge -->
            <div class="absolute bottom-4 left-4 glass-panel-dark px-3.5 py-2 rounded-2xl border border-white/10 text-white flex items-center gap-3 shadow-xl">
              <div>
                <p class="text-[10px] uppercase font-bold tracking-wider text-[#BA0934]">Live Architectural Model</p>
                <p class="text-xs font-semibold text-white">The Pacific Monolith &bull; Malibu, CA</p>
              </div>
              <button
                @click="emit('openTour', 'the-monolith-pacific')"
                class="px-3 py-1.5 rounded-xl bg-[#BA0934] hover:bg-[#960729] text-white text-[11px] font-bold transition-colors shadow flex items-center gap-1"
              >
                <span>Full Tour</span>
                <ChevronRight class="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
