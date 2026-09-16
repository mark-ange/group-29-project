<script setup lang="ts">
import { ref } from 'vue';
import { Star, Box, ChevronLeft, ChevronRight, Bed, Bath, Users, Maximize } from 'lucide-vue-next';
import type { PropertyItem } from '../stores/properties';

const props = defineProps<{
  property: PropertyItem;
}>();

const emit = defineEmits<{
  (e: 'select', property: PropertyItem): void;
  (e: 'open3d', property: PropertyItem): void;
}>();

const currentImageIndex = ref(0);

const nextImage = (e: Event) => {
  e.stopPropagation();
  if (props.property.images && props.property.images.length > 0) {
    currentImageIndex.value = (currentImageIndex.value + 1) % props.property.images.length;
  }
};

const prevImage = (e: Event) => {
  e.stopPropagation();
  if (props.property.images && props.property.images.length > 0) {
    currentImageIndex.value =
      (currentImageIndex.value - 1 + props.property.images.length) % props.property.images.length;
  }
};
</script>

<template>
  <div
    @click="emit('select', property)"
    class="group cursor-pointer rounded-3xl bg-white border border-neutral-200/70 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
  >
    <!-- Image Media Container -->
    <div class="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100">
      <img
        :src="property.images[currentImageIndex] || property.images[0]"
        :alt="property.title"
        class="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        referrerpolicy="no-referrer"
      />

      <!-- Gradient overlay on hover for editorial look -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 opacity-60"></div>

      <!-- Top Badges -->
      <div class="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none">
        <span
          v-if="property.has_3d_tour"
          class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-black/70 backdrop-blur-md text-white border border-white/20 shadow"
        >
          <span class="w-2 h-2 rounded-full bg-[#BA0934] animate-ping"></span>
          <span>3D Spatial Tour</span>
        </span>
        <span v-else></span>

        <!-- Architectural style badge -->
        <span class="px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-white/80 backdrop-blur-md text-neutral-800 shadow">
          {{ property.architectural_style }}
        </span>
      </div>

      <!-- Image Prev/Next Navigation Controls -->
      <div
        v-if="property.images.length > 1"
        class="absolute inset-y-0 left-2 right-2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <button
          @click="prevImage"
          class="w-8 h-8 rounded-full bg-white/80 hover:bg-white text-neutral-800 flex items-center justify-center shadow backdrop-blur-md transition-transform hover:scale-110"
        >
          <ChevronLeft class="w-4 h-4" />
        </button>
        <button
          @click="nextImage"
          class="w-8 h-8 rounded-full bg-white/80 hover:bg-white text-neutral-800 flex items-center justify-center shadow backdrop-blur-md transition-transform hover:scale-110"
        >
          <ChevronRight class="w-4 h-4" />
        </button>
      </div>

      <!-- Bottom Indicator Dots -->
      <div
        v-if="property.images.length > 1"
        class="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 pointer-events-none"
      >
        <div
          v-for="(_, idx) in property.images"
          :key="idx"
          :class="[
            'h-1.5 rounded-full transition-all',
            idx === currentImageIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/50',
          ]"
        ></div>
      </div>
    </div>

    <!-- Card Metadata Content -->
    <div class="p-5 flex-1 flex flex-col justify-between space-y-4">
      <div>
        <!-- Location & Rating Row -->
        <div class="flex items-center justify-between text-xs text-neutral-500 font-medium mb-1.5">
          <span>{{ property.location }}, {{ property.country }}</span>
          <div class="flex items-center gap-1 text-neutral-900 font-bold">
            <Star class="w-3.5 h-3.5 fill-[#BA0934] text-[#BA0934]" />
            <span>{{ property.rating.toFixed(2) }}</span>
            <span class="text-neutral-400 font-normal">({{ property.reviews_count }})</span>
          </div>
        </div>

        <!-- Title -->
        <h3 class="font-bold text-base text-[#1A1A1A] group-hover:text-[#BA0934] transition-colors line-clamp-1">
          {{ property.title }}
        </h3>
        <p class="text-xs text-neutral-500 line-clamp-1 mt-0.5">
          {{ property.subtitle }}
        </p>

        <!-- Architectural Metrics -->
        <div class="flex items-center gap-3 mt-3 pt-3 border-t border-neutral-100 text-[11px] text-neutral-500 font-medium">
          <div class="flex items-center gap-1">
            <Bed class="w-3.5 h-3.5 text-neutral-400" />
            <span>{{ property.bedrooms }} Beds</span>
          </div>
          <div class="flex items-center gap-1">
            <Bath class="w-3.5 h-3.5 text-neutral-400" />
            <span>{{ property.bathrooms }} Baths</span>
          </div>
          <div class="flex items-center gap-1">
            <Users class="w-3.5 h-3.5 text-neutral-400" />
            <span>{{ property.max_guests }} Guests</span>
          </div>
        </div>
      </div>

      <!-- Price & Actions Row -->
      <div class="flex items-center justify-between pt-2 border-t border-neutral-100">
        <div>
          <div class="flex items-baseline gap-1">
            <span class="text-base font-extrabold text-[#1A1A1A]">{{ property.formatted_price }}</span>
            <span class="text-xs text-neutral-500 font-medium">/ night</span>
          </div>
          <span class="text-[10px] text-neutral-400">All fees & taxes calculated</span>
        </div>

        <!-- 3D Action Button -->
        <button
          v-if="property.has_3d_tour"
          @click.stop="emit('open3d', property)"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-100 hover:bg-[#BA0934] text-neutral-800 hover:text-white text-xs font-bold transition-colors shadow-sm"
          title="Open interactive 3D tour"
        >
          <Box class="w-3.5 h-3.5" />
          <span>3D Model</span>
        </button>
      </div>
    </div>
  </div>
</template>
