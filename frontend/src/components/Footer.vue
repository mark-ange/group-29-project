<script setup lang="ts">
import { Database, Lock } from 'lucide-vue-next';

const emit = defineEmits<{
  (e: 'navigate', view: string): void;
}>();
</script>

<template>
  <footer class="border-t border-neutral-200 bg-white text-neutral-600 text-xs">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- Brand Info -->
        <div class="space-y-3 md:col-span-1">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-xl bg-[#1A1A1A] flex items-center justify-center text-white shadow">
              <span class="font-extrabold text-sm text-[#BA0934]">L</span>
              <span class="font-bold text-xs">S</span>
            </div>
            <span class="font-extrabold text-lg text-[#1A1A1A] tracking-tight">LuxeStay</span>
          </div>
          <p class="text-neutral-500 leading-relaxed text-[11px]">
            Editorial luxury vacation rental platform integrating real-time 3D spatial tours, Laravel API services, and PostgreSQL ACID transactional reservations.
          </p>
          <div class="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full">
            <Database class="w-3 h-3" />
            <span>PostgreSQL 15 Connected</span>
          </div>
        </div>

        <!-- Architectural Collections -->
        <div class="space-y-2">
          <h4 class="font-extrabold uppercase tracking-wider text-[11px] text-neutral-900">Curated Portfolios</h4>
          <ul class="space-y-1.5 text-neutral-500">
            <li><button @click="emit('navigate', 'explore')" class="hover:text-neutral-900">Cantilever Beachfronts</button></li>
            <li><button @click="emit('navigate', 'explore')" class="hover:text-neutral-900">Lake Como Historic Berth</button></li>
            <li><button @click="emit('navigate', 'explore')" class="hover:text-neutral-900">Zermatt Granite Chalets</button></li>
            <li><button @click="emit('navigate', 'explore')" class="hover:text-neutral-900">Palm Springs Terrazzo</button></li>
          </ul>
        </div>

        <!-- Platform Links -->
        <div class="space-y-2">
          <h4 class="font-extrabold uppercase tracking-wider text-[11px] text-neutral-900">Operations</h4>
          <ul class="space-y-1.5 text-neutral-500">
            <li><button @click="emit('navigate', 'guest-dashboard')" class="hover:text-neutral-900">Guest Trips &amp; Itineraries</button></li>
          </ul>
        </div>

        <!-- Security & Architecture -->
        <div class="space-y-2">
          <h4 class="font-extrabold uppercase tracking-wider text-[11px] text-neutral-900">Integrity &amp; Security</h4>
          <p class="text-[11px] text-neutral-500 leading-relaxed">
            All prices and date overlaps are validated server-side by Laravel BookingService with pessimistic database row locks (<code class="text-neutral-700 bg-neutral-100 px-1 py-0.5 rounded">lockForUpdate</code>).
          </p>
          <div class="flex items-center gap-2 text-neutral-400 text-[10px]">
            <Lock class="w-3.5 h-3.5 text-[#BA0934]" />
            <span>Zero client trust policy enforced</span>
          </div>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="mt-8 pt-8 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-neutral-400 gap-3">
        <p>&copy; 2026 LuxeStay Architectural Technologies. All rights reserved.</p>
        <div class="flex items-center gap-4">
          <span>Vue 3 + Three.js</span>
          <span>&bull;</span>
          <span>Laravel 10 API</span>
          <span>&bull;</span>
          <span>PostgreSQL 15</span>
        </div>
      </div>
    </div>
  </footer>
</template>
