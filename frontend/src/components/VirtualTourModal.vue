<script setup lang="ts">
import { ref } from 'vue';
import { X, Box, Info, Layers, Compass, ChevronRight, Check } from 'lucide-vue-next';
import ThreeVillaViewer from './ThreeVillaViewer.vue';
import type { PropertyItem } from '../stores/properties';

const props = defineProps<{
  property: PropertyItem | null;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'reserve', property: PropertyItem): void;
}>();

const activeRoomId = ref('pool');

const rooms = [
  { id: 'pool', name: 'Infinity Deck & Spa', desc: 'Cantilevered pool deck 180 feet above Pacific surf.' },
  { id: 'suite', name: 'Cantilever Master Suite', desc: '42-foot structural cantilever with floor-to-ceiling glass.' },
  { id: 'pavilion', name: 'Glass Living Pavilion', desc: 'Double-height volume with acoustic Japanese cedar louvers.' },
];
</script>

<template>
  <div v-if="property" class="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col text-white">
    <!-- Header Controls -->
    <div class="h-16 px-6 border-b border-white/10 flex items-center justify-between bg-black/40">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-xl bg-[#BA0934] flex items-center justify-center text-white shadow">
          <Box class="w-4 h-4" />
        </div>
        <div>
          <h3 class="text-sm font-bold text-white tracking-tight">{{ property.title }}</h3>
          <p class="text-[11px] text-neutral-400">Interactive 3D Architectural Spatial Walkthrough</p>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-3">
        <button
          @click="emit('reserve', property)"
          class="hidden sm:flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#BA0934] hover:bg-[#960729] text-white text-xs font-bold transition-colors shadow"
        >
          <span>Reserve Now</span>
          <ChevronRight class="w-3.5 h-3.5" />
        </button>
        <button
          @click="emit('close')"
          class="p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X class="w-5 h-5" />
        </button>
      </div>
    </div>

    <!-- 3D Canvas Area -->
    <div class="relative flex-1 w-full h-full bg-[#1A1A1A]">
      <ThreeVillaViewer
        className="w-full h-full"
        :showControls="true"
      />

      <!-- Room Navigation Pills at Bottom Center -->
      <div class="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 glass-panel-dark p-1.5 rounded-full border border-white/15 shadow-2xl z-20">
        <button
          v-for="room in rooms"
          :key="room.id"
          @click="activeRoomId = room.id"
          :class="[
            'px-4 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-2',
            activeRoomId === room.id ? 'bg-[#BA0934] text-white shadow' : 'text-neutral-300 hover:text-white hover:bg-white/10',
          ]"
        >
          <span>{{ room.name }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
