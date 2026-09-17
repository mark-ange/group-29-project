<script setup lang="ts">
import { ShieldCheck, Sparkles, Box, Lock, Globe } from 'lucide-vue-next';
import { usePropertyStore } from '../stores/properties';

const emit = defineEmits<{
  (e: 'navigate', view: string): void;
}>();

const propertyStore = usePropertyStore();
</script>

<template>
  <footer class="border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 text-xs">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- Brand Info -->
        <div class="space-y-3 md:col-span-1">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-xl bg-neutral-900 dark:bg-white flex items-center justify-center text-white dark:text-neutral-900 shadow">
              <span class="font-serif italic font-extrabold text-sm text-[#BA0934]">L</span>
            </div>
            <div class="flex items-baseline gap-1">
              <span class="font-extrabold text-lg text-neutral-900 dark:text-white tracking-tight">LuxeStay</span>
              <span class="font-serif italic text-xs font-bold text-[#BA0934]">LUXE</span>
            </div>
          </div>
          <p class="text-neutral-500 leading-relaxed text-[11px]">
            Master key luxury rental collection modeled after Airbnb Luxe. Curated private architectural estates with tailored services, dedicated trip designers, and real-time 3D spatial tours.
          </p>
        </div>

        <!-- Curated Portfolios -->
        <div class="space-y-2">
          <h4 class="font-extrabold uppercase tracking-wider text-[11px] text-neutral-900 dark:text-white">Luxe Destinations</h4>
          <ul class="space-y-1.5 text-neutral-500">
            <li><button @click="propertyStore.searchQuery = 'Lake Como'; emit('navigate', 'explore')" class="hover:text-neutral-900 dark:hover:text-white cursor-pointer">Lake Como, Italy</button></li>
            <li><button @click="propertyStore.searchQuery = 'Kyoto'; emit('navigate', 'explore')" class="hover:text-neutral-900 dark:hover:text-white cursor-pointer">Kyoto, Japan</button></li>
            <li><button @click="propertyStore.searchQuery = 'Malibu'; emit('navigate', 'explore')" class="hover:text-neutral-900 dark:hover:text-white cursor-pointer">Malibu, California</button></li>
            <li><button @click="propertyStore.searchQuery = 'Zermatt'; emit('navigate', 'explore')" class="hover:text-neutral-900 dark:hover:text-white cursor-pointer">Zermatt, Switzerland</button></li>
            <li><button @click="propertyStore.searchQuery = 'Oia'; emit('navigate', 'explore')" class="hover:text-neutral-900 dark:hover:text-white cursor-pointer">Oia, Santorini</button></li>
          </ul>
        </div>

        <!-- Services & Concierge -->
        <div class="space-y-2">
          <h4 class="font-extrabold uppercase tracking-wider text-[11px] text-neutral-900 dark:text-white">Luxe Services</h4>
          <ul class="space-y-1.5 text-neutral-500">
            <li><button @click="propertyStore.openTripDesigner()" class="hover:text-[#BA0934] font-semibold cursor-pointer">Dedicated Trip Designer</button></li>
            <li><button @click="emit('navigate', 'guest-dashboard')" class="hover:text-neutral-900 dark:hover:text-white cursor-pointer">Guest Itinerary Portal</button></li>
            <li><button @click="emit('navigate', 'host-dashboard')" class="hover:text-neutral-900 dark:hover:text-white cursor-pointer">Luxe Villa Host Operations</button></li>
            <li><button @click="emit('navigate', 'design-system')" class="hover:text-neutral-900 dark:hover:text-white cursor-pointer">Architecture Design Tokens</button></li>
          </ul>
        </div>

        <!-- Airbnb Luxe Standard -->
        <div class="space-y-2">
          <h4 class="font-extrabold uppercase tracking-wider text-[11px] text-neutral-900 dark:text-white">The 300+ Inspection</h4>
          <p class="text-[11px] text-neutral-500 leading-relaxed">
            Every property in the Luxe collection is evaluated in person against a 300+ point checklist covering pristine design, high-end amenities, and culinary-grade equipment.
          </p>
          <div class="flex items-center gap-2 text-neutral-400 text-[10px] pt-1">
            <ShieldCheck class="w-4 h-4 text-emerald-500" />
            <span>100% In-Person Verified Homes</span>
          </div>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="mt-8 pt-8 border-t border-neutral-100 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-neutral-400 gap-3">
        <p>&copy; 2026 LuxeStay by Airbnb Luxe Standard. All rights reserved.</p>
        <div class="flex items-center gap-4">
          <span class="flex items-center gap-1"><Globe class="w-3.5 h-3.5" /> English (US)</span>
          <span>&bull;</span>
          <span>Mex$ (MXN)</span>
          <span>&bull;</span>
          <span>Privacy &amp; Terms</span>
        </div>
      </div>
    </div>
  </footer>
</template>
