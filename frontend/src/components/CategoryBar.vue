<script setup lang="ts">
import { usePropertyStore } from '../stores/properties';
import {
  Sparkles,
  Compass,
  Waves,
  Castle,
  Sun,
  Mountain,
  Box,
  Flame,
} from 'lucide-vue-next';

const propertyStore = usePropertyStore();

const categories = [
  { id: 'all', label: 'All Villas', icon: Flame },
  { id: '3d-tours', label: '3D Spatial Tours', icon: Box, highlight: true },
  { id: 'beachfront', label: 'Cantilever Beach', icon: Waves },
  { id: 'mansions', label: 'Waterfront Estates', icon: Castle },
  { id: 'desert', label: 'Desert Modernism', icon: Sun },
  { id: 'ski', label: 'Alpine Sanctuaries', icon: Mountain },
];
</script>

<template>
  <div class="border-b border-neutral-200/80 bg-white sticky top-20 z-30 transition-all">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 py-3 overflow-x-auto no-scrollbar">
      <!-- Category Tabs -->
      <div class="flex items-center gap-2">
        <button
          v-for="cat in categories"
          :key="cat.id"
          @click="propertyStore.setCategory(cat.id)"
          :class="[
            'flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all',
            propertyStore.activeCategory === cat.id
              ? 'bg-[#1A1A1A] text-white shadow-sm'
              : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100',
            cat.highlight && propertyStore.activeCategory !== cat.id ? 'border border-[#BA0934]/30 text-[#BA0934]' : '',
          ]"
        >
          <component :is="cat.icon" class="w-3.5 h-3.5" :class="cat.highlight ? 'text-[#BA0934]' : ''" />
          <span>{{ cat.label }}</span>
          <span
            v-if="cat.highlight && propertyStore.activeCategory !== cat.id"
            class="w-1.5 h-1.5 rounded-full bg-[#BA0934] animate-pulse"
          ></span>
        </button>
      </div>

      <!-- Right: Quick 3D Toggle Switch -->
      <div class="flex items-center gap-3 pl-4 border-l border-neutral-200">
        <label class="flex items-center gap-2 text-xs font-semibold text-neutral-700 cursor-pointer select-none">
          <span>3D Only</span>
          <div
            @click="propertyStore.toggle3DFilter"
            :class="[
              'w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer flex items-center',
              propertyStore.only3D ? 'bg-[#BA0934]' : 'bg-neutral-300',
            ]"
          >
            <div
              :class="[
                'w-4 h-4 rounded-full bg-white shadow transform transition-transform',
                propertyStore.only3D ? 'translate-x-4' : 'translate-x-0',
              ]"
            ></div>
          </div>
        </label>
      </div>
    </div>
  </div>
</template>
