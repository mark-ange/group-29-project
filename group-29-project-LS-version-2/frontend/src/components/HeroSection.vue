<script setup lang="ts">
import { ref } from 'vue';
import ThreeVillaViewer from './ThreeVillaViewer.vue';
import { Sparkles, ShieldCheck, UserCheck, Box, Search, ArrowRight, CheckCircle2 } from 'lucide-vue-next';
import { usePropertyStore } from '../stores/properties';

const emit = defineEmits<{
  (e: 'openTour', propertySlug?: string): void;
  (e: 'scrollToVillas'): void;
}>();

const propertyStore = usePropertyStore();
const searchQuery = ref('');
const selectedDestination = ref('all');

const popularDestinations = [
  'Lake Como, Italy',
  'Kyoto, Japan',
  'Malibu, California',
  'Zermatt, Switzerland',
  'Oia, Santorini',
  'Palm Springs, California',
];

const handleSearch = () => {
  if (selectedDestination.value !== 'all') {
    propertyStore.searchQuery = selectedDestination.value;
  } else {
    propertyStore.searchQuery = searchQuery.value;
  }
  emit('scrollToVillas');
};
</script>

<template>
  <section class="relative pt-6 pb-12 overflow-hidden bg-gradient-to-b from-neutral-50/60 to-transparent dark:from-neutral-900/40">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Main Grid: Editorial Typography Left + 3D Villa Canvas Right -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        <!-- Left Editorial Copy -->
        <div class="lg:col-span-6 space-y-6">
          <!-- Luxe Subtitle Badge -->
          <div class="inline-flex flex-wrap sm:flex-nowrap items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 text-xs font-bold tracking-wide shadow-xs max-w-full">
            <span class="w-2 h-2 rounded-full bg-[#BA0934] shrink-0"></span>
            <span class="font-serif italic font-extrabold tracking-wider text-[#BA0934] shrink-0">LUXE</span>
            <span class="truncate">&bull; Airbnb Luxury Stays Master Standard</span>
          </div>

          <!-- Editorial Hero Headline -->
          <h1 class="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-neutral-900 dark:text-white leading-[1.08] break-words">
            Extraordinary homes <br />
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-neutral-900 via-neutral-700 to-[#BA0934] dark:from-white dark:via-neutral-200 dark:to-rose-400">
              with five-star everything.
            </span>
          </h1>

          <p class="text-base sm:text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed max-w-xl font-normal break-words">
            A pristine collection of expertly designed homes with luxury amenities, tailored services, and dedicated trip designers. Experience every spatial detail in real-time 3D before you reserve.
          </p>

          <!-- Airbnb Luxe Search Bar Container -->
          <div class="p-2.5 bg-white dark:bg-neutral-850 rounded-3xl shadow-xl border border-neutral-200/90 dark:border-neutral-700 max-w-xl w-full min-w-0">
            <div class="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
              <!-- Where -->
              <div class="sm:col-span-5 px-3.5 py-2 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-2xl transition-colors min-w-0">
                <label class="block text-[10px] font-extrabold uppercase tracking-wider text-neutral-400">Destination</label>
                <input
                  v-model="searchQuery"
                  @keyup.enter="handleSearch"
                  type="text"
                  placeholder="Where in the world?"
                  class="w-full text-xs font-semibold text-neutral-900 dark:text-white bg-transparent border-none p-0 focus:outline-none focus:ring-0 placeholder:text-neutral-400 truncate"
                />
              </div>

              <!-- Collection Filter -->
              <div class="sm:col-span-4 px-3.5 py-2 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-2xl transition-colors border-t sm:border-t-0 sm:border-l border-neutral-200 dark:border-neutral-700 min-w-0">
                <label class="block text-[10px] font-extrabold uppercase tracking-wider text-neutral-400">Collection</label>
                <select
                  v-model="propertyStore.activeCategory"
                  class="w-full text-xs font-semibold text-neutral-900 dark:text-white bg-transparent border-none p-0 focus:outline-none focus:ring-0 cursor-pointer truncate"
                >
                  <option value="all">All Luxe Sanctuaries</option>
                  <option value="3d-tours">3D Spatial Walkthroughs</option>
                  <option value="beachfront">Beachfront Cantilevers</option>
                  <option value="mansions">Lakeside Palazzos</option>
                  <option value="desert">Desert Modernism</option>
                  <option value="ski">Alpine Chalets</option>
                </select>
              </div>

              <!-- Action Button -->
              <div class="sm:col-span-3 flex items-center justify-end p-1">
                <button
                  @click="handleSearch"
                  class="w-full px-5 py-3 rounded-2xl bg-[#BA0934] hover:bg-[#960729] text-white text-xs font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Search class="w-3.5 h-3.5 shrink-0" />
                  <span>Explore</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Hallmark Luxe Badges -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs min-w-0">
            <div class="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 min-w-0">
              <ShieldCheck class="w-4 h-4 text-emerald-500 shrink-0" />
              <span class="truncate">300+ Point Inspection</span>
            </div>
            <div class="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 min-w-0">
              <UserCheck class="w-4 h-4 text-[#BA0934] shrink-0" />
              <span class="truncate">Trip Designer Included</span>
            </div>
            <div class="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 min-w-0">
              <Box class="w-4 h-4 text-amber-500 shrink-0" />
              <span class="truncate">Three.js Spatial Models</span>
            </div>
          </div>
        </div>

        <!-- Right 3D Villa Canvas Card -->
        <div class="lg:col-span-6">
          <div class="relative rounded-3xl overflow-hidden shadow-2xl border border-neutral-200/90 dark:border-neutral-800 bg-neutral-900 group">
            <!-- 3D Viewer Instance -->
            <ThreeVillaViewer
              className="w-full h-[470px]"
              @expand="emit('openTour', 'villa-kinkaku')"
            />

            <!-- Corner Floating Badge -->
            <div class="absolute bottom-4 left-4 right-4 sm:right-auto glass-panel-dark px-4 py-2.5 rounded-2xl border border-white/10 text-white flex items-center justify-between sm:justify-start gap-4 shadow-xl">
              <div>
                <div class="flex items-center gap-1.5">
                  <span class="w-1.5 h-1.5 rounded-full bg-[#BA0934] animate-pulse"></span>
                  <p class="text-[10px] uppercase font-bold tracking-wider text-amber-400">Interactive 3D Walkthrough</p>
                </div>
                <p class="text-xs font-semibold text-white">Villa Kinkaku &bull; Kyoto, Japan</p>
              </div>
              <button
                @click="emit('openTour', 'villa-kinkaku')"
                class="px-3 py-1.5 rounded-xl bg-[#BA0934] hover:bg-[#960729] text-white text-[11px] font-bold transition-all shadow flex items-center gap-1 cursor-pointer shrink-0"
              >
                <span>Full Tour</span>
                <ArrowRight class="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
