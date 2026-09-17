<script setup lang="ts">
import { ref, computed } from 'vue';
import { Star, Box, ChevronLeft, ChevronRight, Bed, Bath, Users, Heart, Sparkles, ShieldCheck } from 'lucide-vue-next';
import { usePropertyStore, type PropertyItem } from '../stores/properties';

const props = defineProps<{
  property: PropertyItem;
}>();

const emit = defineEmits<{
  (e: 'select', property: PropertyItem): void;
  (e: 'open3d', property: PropertyItem): void;
}>();

const propertyStore = usePropertyStore();
const currentImageIndex = ref(0);

const isFavorite = computed(() => {
  return propertyStore.isWishlisted(props.property.id);
});

const calculatedTotal = computed(() => {
  // Typical 5-night stay total with luxury concierge fee
  const nights = 5;
  const subtotal = props.property.price_per_night * nights;
  const fee = Math.round(subtotal * 0.12);
  return subtotal + fee;
});

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

const toggleFavorite = (e: Event) => {
  e.stopPropagation();
  propertyStore.toggleWishlist(props.property.id);
};
</script>

<template>
  <div
    @click="emit('select', property)"
    class="group cursor-pointer rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col relative"
    :class="propertyStore.hoveredPropertyId === property.id ? 'ring-2 ring-[#BA0934]' : ''"
  >
    <!-- Image Media Container -->
    <div class="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800">
      <img
        :src="property.images[currentImageIndex] || property.images[0]"
        :alt="property.title"
        class="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        referrerpolicy="no-referrer"
      />

      <!-- Subtle gradient overlay -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/20 opacity-60"></div>

      <!-- Top Badges -->
      <div class="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none">
        <!-- Airbnb Luxe Gold Tag -->
        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold tracking-wider uppercase bg-neutral-950/85 backdrop-blur-md text-amber-400 border border-amber-400/30 shadow-md">
          <Sparkles class="w-3 h-3 text-amber-400" />
          <span>LUXE VERIFIED</span>
        </div>

        <!-- Wishlist Button -->
        <button
          @click="toggleFavorite"
          class="pointer-events-auto p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition-transform active:scale-90 cursor-pointer shadow-md"
          :title="isFavorite ? 'Remove from wishlist' : 'Save to wishlist'"
        >
          <Heart
            class="w-4 h-4 transition-colors"
            :class="isFavorite ? 'fill-[#BA0934] text-[#BA0934]' : 'text-white'"
          />
        </button>
      </div>

      <!-- 3D Tour Pulse Pill (Bottom Left of Media) -->
      <div
        v-if="property.has_3d_tour"
        class="absolute bottom-3 left-3 pointer-events-none inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase bg-black/75 backdrop-blur-md text-white border border-white/20 shadow"
      >
        <span class="w-2 h-2 rounded-full bg-[#BA0934] animate-ping"></span>
        <span>3D Tour</span>
      </div>

      <!-- Image Prev/Next Navigation Controls -->
      <div
        v-if="property.images.length > 1"
        class="absolute inset-y-0 left-2 right-2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <button
          @click="prevImage"
          class="w-7 h-7 rounded-full bg-white/90 hover:bg-white text-neutral-800 flex items-center justify-center shadow backdrop-blur-md transition-transform hover:scale-110 cursor-pointer"
        >
          <ChevronLeft class="w-4 h-4" />
        </button>
        <button
          @click="nextImage"
          class="w-7 h-7 rounded-full bg-white/90 hover:bg-white text-neutral-800 flex items-center justify-center shadow backdrop-blur-md transition-transform hover:scale-110 cursor-pointer"
        >
          <ChevronRight class="w-4 h-4" />
        </button>
      </div>

      <!-- Bottom Indicator Dots -->
      <div
        v-if="property.images.length > 1"
        class="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1 pointer-events-none"
      >
        <div
          v-for="(_, idx) in property.images"
          :key="idx"
          :class="[
            'h-1 rounded-full transition-all',
            idx === currentImageIndex ? 'w-3.5 bg-white' : 'w-1 bg-white/60',
          ]"
        ></div>
      </div>
    </div>

    <!-- Card Metadata Content -->
    <div class="p-5 flex-1 flex flex-col justify-between space-y-3 min-w-0">
      <div class="min-w-0">
        <!-- Location & Rating Row -->
        <div class="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 font-medium mb-1 gap-2 min-w-0">
          <span class="font-bold text-neutral-900 dark:text-neutral-200 truncate min-w-0">
            {{ property.location }}, {{ property.country }}
          </span>
          <div class="flex items-center gap-1 text-neutral-900 dark:text-white font-extrabold shrink-0">
            <Star class="w-3.5 h-3.5 fill-[#BA0934] text-[#BA0934]" />
            <span>{{ property.rating.toFixed(2) }}</span>
            <span class="text-neutral-400 font-normal">({{ property.reviews_count }})</span>
          </div>
        </div>

        <!-- Architectural Title & Designer -->
        <h3 class="font-extrabold text-base text-neutral-900 dark:text-white group-hover:text-[#BA0934] transition-colors truncate min-w-0">
          {{ property.title }}
        </h3>
        <p class="text-xs text-neutral-500 dark:text-neutral-400 truncate mt-0.5 min-w-0">
          Designed by <span class="font-semibold text-neutral-700 dark:text-neutral-300">{{ property.designer || property.architectural_style }}</span>
        </p>

        <!-- Capacity Specs -->
        <div class="flex flex-wrap items-center gap-2 sm:gap-3 mt-2.5 pt-2.5 border-t border-neutral-100 dark:border-neutral-800 text-[11px] text-neutral-500 dark:text-neutral-400 min-w-0">
          <div class="flex items-center gap-1 shrink-0">
            <Bed class="w-3.5 h-3.5 text-neutral-400" />
            <span>{{ property.bedrooms }} bd</span>
          </div>
          <span class="text-neutral-300 dark:text-neutral-700">•</span>
          <div class="flex items-center gap-1 shrink-0">
            <Bath class="w-3.5 h-3.5 text-neutral-400" />
            <span>{{ property.bathrooms }} ba</span>
          </div>
          <span class="text-neutral-300 dark:text-neutral-700">•</span>
          <div class="flex items-center gap-1 shrink-0">
            <Users class="w-3.5 h-3.5 text-neutral-400" />
            <span>{{ property.max_guests }} guests</span>
          </div>
        </div>
      </div>

      <!-- Price & Actions Row -->
      <div class="flex flex-wrap items-end justify-between pt-2 border-t border-neutral-100 dark:border-neutral-800 gap-2 min-w-0">
        <div class="min-w-0 flex-1">
          <!-- If "Display total before taxes" is active -->
          <template v-if="propertyStore.displayTotal">
            <div class="flex items-baseline gap-1">
              <span class="text-base font-extrabold text-neutral-900 dark:text-white truncate">
                Mex${{ calculatedTotal.toLocaleString() }}
              </span>
              <span class="text-xs text-neutral-500 dark:text-neutral-400 font-medium shrink-0">total</span>
            </div>
            <span class="text-[10px] text-neutral-400 block truncate">5 nights · Mex${{ property.price_per_night.toLocaleString() }} / night</span>
          </template>
          <!-- Default nightly display -->
          <template v-else>
            <div class="flex items-baseline gap-1">
              <span class="text-base font-extrabold text-neutral-900 dark:text-white truncate">
                Mex${{ property.price_per_night.toLocaleString() }}
              </span>
              <span class="text-xs text-neutral-500 dark:text-neutral-400 font-medium shrink-0">/ night</span>
            </div>
            <span class="text-[10px] text-neutral-400 block truncate">Dedicated trip designer included</span>
          </template>
        </div>

        <!-- 3D Action Pill -->
        <button
          v-if="property.has_3d_tour"
          @click.stop="emit('open3d', property)"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-[#BA0934] text-neutral-800 dark:text-neutral-200 hover:text-white text-xs font-bold transition-all shadow-xs cursor-pointer group-hover:border-[#BA0934] shrink-0"
          title="Open interactive 3D spatial tour"
        >
          <Box class="w-3.5 h-3.5" />
          <span>3D Tour</span>
        </button>
      </div>
    </div>
  </div>
</template>
