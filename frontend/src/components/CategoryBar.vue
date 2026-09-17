<script setup lang="ts">
import { usePropertyStore } from '../stores/properties';
import {
  Sparkles,
  Waves,
  Castle,
  Sun,
  Mountain,
  Box,
  Flame,
  SlidersHorizontal,
  Map as MapIcon,
  List,
} from 'lucide-vue-next';

defineProps<{
  filterCount?: number;
}>();

const emit = defineEmits<{
  (e: 'open-filters'): void;
}>();

const propertyStore = usePropertyStore();

const categories = [
  { id: 'all', label: 'All Luxe Stays', icon: Flame },
  { id: '3d-tours', label: '3D Spatial Walkthroughs', icon: Box, highlight: true },
  { id: 'beachfront', label: 'Beachfront Cantilevers', icon: Waves },
  { id: 'mansions', label: 'Lakeside Palazzos', icon: Castle },
  { id: 'desert', label: 'Desert Modernism', icon: Sun },
  { id: 'ski', label: 'Alpine Chalets', icon: Mountain },
];
</script>

<template>
  <div class="border-b border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md sticky top-20 z-30 transition-all">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 py-3 overflow-x-auto no-scrollbar">
      <!-- Category Tabs (Airbnb Luxe Style) -->
      <div class="flex items-center gap-2 sm:gap-4 shrink-0">
        <button
          v-for="cat in categories"
          :key="cat.id"
          @click="propertyStore.setCategory(cat.id)"
          :class="[
            'group flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all cursor-pointer relative',
            propertyStore.activeCategory === cat.id
              ? 'text-neutral-900 dark:text-white font-bold'
              : 'text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200',
          ]"
        >
          <div class="flex items-center gap-1.5">
            <component
              :is="cat.icon"
              class="w-4 h-4 transition-transform group-hover:scale-110"
              :class="cat.highlight ? 'text-[#BA0934]' : ''"
            />
            <span class="text-xs whitespace-nowrap">{{ cat.label }}</span>
            <span
              v-if="cat.highlight && propertyStore.activeCategory !== cat.id"
              class="w-1.5 h-1.5 rounded-full bg-[#BA0934] animate-pulse"
            ></span>
          </div>

          <!-- Active bottom highlight bar -->
          <div
            class="h-0.5 w-full rounded-full transition-all mt-1"
            :class="propertyStore.activeCategory === cat.id ? 'bg-[#BA0934]' : 'bg-transparent group-hover:bg-neutral-200 dark:group-hover:bg-neutral-700'"
          ></div>
        </button>
      </div>

      <!-- Right Utility Controls -->
      <div class="flex items-center gap-3 shrink-0">
        <!-- Airbnb signature "Display total before taxes" switch -->
        <div
          @click="propertyStore.toggleDisplayTotal"
          class="hidden md:flex items-center gap-3 px-3.5 py-2 rounded-2xl border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 bg-neutral-50/70 dark:bg-neutral-850/70 cursor-pointer select-none transition"
        >
          <span class="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
            Display total before taxes
          </span>
          <div
            :class="[
              'w-8 h-4.5 rounded-full p-0.5 transition-colors flex items-center',
              propertyStore.displayTotal ? 'bg-[#BA0934]' : 'bg-neutral-300 dark:bg-neutral-600',
            ]"
          >
            <div
              :class="[
                'w-3.5 h-3.5 rounded-full bg-white shadow transform transition-transform',
                propertyStore.displayTotal ? 'translate-x-3.5' : 'translate-x-0',
              ]"
            ></div>
          </div>
        </div>

        <!-- Filters button with active counter -->
        <button
          @click="emit('open-filters')"
          class="flex items-center gap-2 px-3.5 py-2 rounded-2xl border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 text-xs font-bold text-neutral-800 dark:text-neutral-200 bg-white dark:bg-neutral-850 transition cursor-pointer shadow-xs"
        >
          <SlidersHorizontal class="w-3.5 h-3.5 text-neutral-600 dark:text-neutral-400" />
          <span>Filters</span>
          <span
            v-if="filterCount && filterCount > 0"
            class="px-1.5 py-0.5 rounded-full bg-[#BA0934] text-white text-[10px] font-bold"
          >
            {{ filterCount }}
          </span>
        </button>

        <!-- Toggle Map / List Floating Pill -->
        <button
          @click="propertyStore.toggleMap"
          class="flex items-center gap-2 px-4 py-2 rounded-2xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-bold transition shadow hover:shadow-md cursor-pointer"
        >
          <component :is="propertyStore.showMap ? List : MapIcon" class="w-3.5 h-3.5" />
          <span>{{ propertyStore.showMap ? 'Show list' : 'Show map' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
