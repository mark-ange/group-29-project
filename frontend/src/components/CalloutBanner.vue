<script setup lang="ts">
import { Box, Sparkles, ChevronRight } from 'lucide-vue-next';

const emit = defineEmits<{
  (e: 'open3d'): void;
}>();
</script>

<template>
  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <div class="relative rounded-3xl overflow-hidden bg-gradient-to-r from-neutral-50 via-white to-neutral-50 text-neutral-900 p-8 sm:p-12 shadow-sm border border-neutral-200">
      <!-- Ambient subtle background glow -->
      <div class="absolute -right-20 -top-20 w-96 h-96 rounded-full bg-[#BA0934]/10 blur-3xl pointer-events-none"></div>

      <div class="relative z-10 max-w-2xl space-y-4">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-neutral-200 text-neutral-800 text-xs font-semibold shadow-xs">
          <Sparkles class="w-3.5 h-3.5 text-[#BA0934]" />
          <span>Interactive Architectural Spatial Inspection</span>
        </div>

        <h2 class="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight text-neutral-900">
          Step Inside Before You Arrive. <br />
          <span class="text-[#BA0934]">Hardware-Accelerated WebGL.</span>
        </h2>

        <p class="text-sm sm:text-base text-neutral-600 leading-relaxed">
          Examine structural cantilevers, sun trajectories at dusk, reflection pool weir edges, and interior flow directly in your browser. Engineered with Three.js and PostgreSQL reservation tracking.
        </p>

        <div class="pt-2 flex flex-wrap items-center gap-4">
          <button
            @click="emit('open3d')"
            class="px-6 py-3.5 rounded-2xl bg-[#BA0934] hover:bg-[#960729] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer"
          >
            <Box class="w-4 h-4" />
            <span>Launch Featured 3D Villa</span>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
