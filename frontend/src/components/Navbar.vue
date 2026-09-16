<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import { UserCheck, LogOut, LogIn, SlidersHorizontal } from 'lucide-vue-next';

const props = defineProps<{
  currentView: string;
}>();

const emit = defineEmits<{
  (e: 'navigate', view: string): void;
  (e: 'openAuth'): void;
  (e: 'openFilter'): void;
}>();

const authStore = useAuthStore();
const showUserDropdown = ref(false);

</script>

<template>
  <header class="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-neutral-200/80 transition-all">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
      <!-- Brand Logo -->
      <div class="flex items-center gap-8">
        <button
          @click="emit('navigate', 'explore')"
          class="flex items-center gap-2.5 group text-left focus:outline-none"
        >
          <div class="w-9 h-9 rounded-xl bg-[#1A1A1A] flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
            <span class="font-black text-sm tracking-tighter text-[#BA0934]">L</span>
            <span class="font-extrabold text-xs tracking-tight">S</span>
          </div>
          <div>
            <span class="font-extrabold text-xl tracking-tight text-[#1A1A1A] group-hover:text-[#BA0934] transition-colors">
              LuxeStay
            </span>
            <span class="hidden sm:inline-block text-[10px] uppercase font-bold tracking-widest text-[#BA0934] ml-2 px-1.5 py-0.5 rounded bg-[#BA0934]/10">
              Editorial 3D
            </span>
          </div>
        </button>

        <!-- Primary Navigation Tabs -->
        <nav class="hidden md:flex items-center gap-1 bg-neutral-100/80 p-1 rounded-full border border-neutral-200/60">
          <button
            @click="emit('navigate', 'explore')"
            :class="[
              'px-4 py-1.5 text-xs font-semibold rounded-full transition-all',
              currentView === 'explore'
                ? 'bg-white text-[#1A1A1A] shadow-sm'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-white/50',
            ]"
          >
            Explore Villas
          </button>
          <button
            @click="emit('navigate', 'guest-dashboard')"
            :class="[
              'px-4 py-1.5 text-xs font-semibold rounded-full transition-all flex items-center gap-1.5',
              currentView === 'guest-dashboard'
                ? 'bg-white text-[#1A1A1A] shadow-sm'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-white/50',
            ]"
          >
            <span>My Trips</span>
          </button>
        </nav>
      </div>

      <!-- Right Controls: Auth Profile -->
      <div class="flex items-center gap-3">
        <!-- Filters Trigger (For Explore view) -->
        <button
          v-if="currentView === 'explore'"
          @click="emit('openFilter')"
          class="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-neutral-300 bg-white text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors shadow-sm"
        >
          <SlidersHorizontal class="w-3.5 h-3.5" />
          <span class="hidden sm:inline">Filters</span>
        </button>

        <!-- User Profile / Auth Button -->
        <div v-if="authStore.user" class="relative">
          <button
            @click="showUserDropdown = !showUserDropdown"
            class="flex items-center gap-2 p-1 pl-2.5 rounded-full border border-neutral-300 bg-white hover:shadow-md transition-shadow"
          >
            <span class="text-xs font-semibold text-neutral-800 hidden sm:inline-block max-w-[120px] truncate">
              {{ authStore.user.name }}
            </span>
            <img
              :src="authStore.user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'"
              alt="Avatar"
              class="w-8 h-8 rounded-full object-cover ring-2 ring-[#BA0934]/30"
            />
          </button>

          <!-- Dropdown -->
          <div
            v-if="showUserDropdown"
            class="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-2xl border border-neutral-200 py-2 z-50 text-neutral-800 animate-in fade-in slide-in-from-top-2"
          >
            <div class="px-4 py-2.5 border-b border-neutral-100">
              <p class="text-xs font-bold text-neutral-900">{{ authStore.user.name }}</p>
              <p class="text-[11px] text-neutral-500 truncate">{{ authStore.user.email }}</p>
              <div class="mt-1.5 inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-neutral-100 text-[#BA0934]">
                Role: {{ authStore.user.role }}
              </div>
            </div>

            <div class="py-1">
              <button
                @click="emit('navigate', 'guest-dashboard'); showUserDropdown = false"
                class="w-full text-left px-4 py-2 text-xs text-neutral-700 hover:bg-neutral-50 transition-colors flex items-center gap-2"
              >
                <UserCheck class="w-3.5 h-3.5 text-neutral-400" />
                <span>Guest Trips & Bookings</span>
              </button>
            </div>

            <div class="border-t border-neutral-100 pt-1">
              <button
                @click="authStore.logout(); showUserDropdown = false"
                class="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-2"
              >
                <LogOut class="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>

        <button
          v-else
          @click="emit('openAuth')"
          class="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#1A1A1A] text-white text-xs font-semibold hover:bg-[#BA0934] transition-colors shadow-sm"
        >
          <LogIn class="w-3.5 h-3.5" />
          <span>Sign In</span>
        </button>
      </div>
    </div>
  </header>
</template>
