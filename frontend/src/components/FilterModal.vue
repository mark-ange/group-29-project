<script setup lang="ts">
import { ref } from 'vue';
import { X, Box, Check } from 'lucide-vue-next';
import { usePropertyStore } from '../stores/properties';

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const propertyStore = usePropertyStore();

const tempMinPrice = ref(propertyStore.minPrice);
const tempMaxPrice = ref(propertyStore.maxPrice);
const tempBedrooms = ref(propertyStore.bedroomsFilter);
const tempOnly3D = ref(propertyStore.only3D);

const applyFilters = () => {
  propertyStore.minPrice = tempMinPrice.value;
  propertyStore.maxPrice = tempMaxPrice.value;
  propertyStore.bedroomsFilter = tempBedrooms.value;
  propertyStore.only3D = tempOnly3D.value;
  emit('close');
};

const resetFilters = () => {
  tempMinPrice.value = null;
  tempMaxPrice.value = null;
  tempBedrooms.value = 'any';
  tempOnly3D.value = false;
  propertyStore.minPrice = null;
  propertyStore.maxPrice = null;
  propertyStore.bedroomsFilter = 'any';
  propertyStore.only3D = false;
  emit('close');
};
</script>

<template>
  <div class="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
    <div class="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl border border-neutral-200/80 p-8 space-y-6 animate-in fade-in zoom-in-95">
      <!-- Header -->
      <div class="flex items-center justify-between border-b border-neutral-200 pb-4">
        <h3 class="text-xl font-bold text-[#1A1A1A]">Curate Sanctuary Search</h3>
        <button
          @click="emit('close')"
          class="p-2 rounded-full text-neutral-400 hover:text-neutral-900 transition-colors"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Filters Form -->
      <div class="space-y-5">
        <!-- 3D Tours Toggle -->
        <div class="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-[#BA0934] text-white flex items-center justify-center">
              <Box class="w-5 h-5" />
            </div>
            <div>
              <p class="text-xs font-bold text-neutral-900">3D Spatial Models Only</p>
              <p class="text-[11px] text-neutral-500">Only show villas with interactive Three.js tours</p>
            </div>
          </div>
          <div
            @click="tempOnly3D = !tempOnly3D"
            :class="[
              'w-10 h-6 rounded-full p-0.5 transition-colors cursor-pointer flex items-center',
              tempOnly3D ? 'bg-[#BA0934]' : 'bg-neutral-300',
            ]"
          >
            <div
              :class="[
                'w-5 h-5 rounded-full bg-white shadow transform transition-transform',
                tempOnly3D ? 'translate-x-4' : 'translate-x-0',
              ]"
            ></div>
          </div>
        </div>

        <!-- Bedrooms Filter -->
        <div class="space-y-2">
          <label class="block text-xs font-bold uppercase tracking-wider text-neutral-500">Bedrooms</label>
          <div class="flex items-center gap-2">
            <button
              v-for="b in ['any', 3, 4, 5, 6]"
              :key="b"
              type="button"
              @click="tempBedrooms = b"
              :class="[
                'flex-1 py-2 rounded-xl text-xs font-bold border transition-colors',
                tempBedrooms === b ? 'bg-[#1A1A1A] text-white border-transparent' : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50',
              ]"
            >
              {{ b === 'any' ? 'Any' : `${b}+` }}
            </button>
          </div>
        </div>

        <!-- Price Range -->
        <div class="space-y-2">
          <label class="block text-xs font-bold uppercase tracking-wider text-neutral-500">Nightly Rate (Mex$)</label>
          <div class="grid grid-cols-2 gap-3">
            <div class="p-3 bg-neutral-50 rounded-2xl border border-neutral-200">
              <span class="block text-[10px] uppercase font-bold text-neutral-400">Minimum</span>
              <input
                v-model.number="tempMinPrice"
                type="number"
                placeholder="1000"
                class="w-full text-xs font-bold text-neutral-900 bg-transparent border-none p-0 focus:outline-none"
              />
            </div>
            <div class="p-3 bg-neutral-50 rounded-2xl border border-neutral-200">
              <span class="block text-[10px] uppercase font-bold text-neutral-400">Maximum</span>
              <input
                v-model.number="tempMaxPrice"
                type="number"
                placeholder="5000"
                class="w-full text-xs font-bold text-neutral-900 bg-transparent border-none p-0 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center justify-between pt-4 border-t border-neutral-200">
        <button
          @click="resetFilters"
          class="text-xs font-semibold text-neutral-600 hover:text-neutral-900 transition-colors"
        >
          Reset All
        </button>
        <button
          @click="applyFilters"
          class="px-6 py-3 rounded-2xl bg-[#BA0934] hover:bg-[#960729] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-md"
        >
          Apply Filters
        </button>
      </div>
    </div>
  </div>
</template>
