<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import { usePropertyStore } from '../stores/properties';
import {
  Search,
  Sparkles,
  Shield,
  UserCheck,
  LogOut,
  LogIn,
  Menu,
  Heart,
  Globe,
  SlidersHorizontal,
  UserPlus,
  Home,
  Building,
} from 'lucide-vue-next';

const props = defineProps<{
  currentView: string;
}>();

const emit = defineEmits<{
  (e: 'navigate', view: string): void;
  (e: 'openAuth', tab?: 'login' | 'register-guest' | 'register-host'): void;
  (e: 'openFilter'): void;
}>();

const authStore = useAuthStore();
const propertyStore = usePropertyStore();
const showUserDropdown = ref(false);

const handleRoleSwitch = async () => {
  if (authStore.isHost) {
    await authStore.switchRole('guest');
    emit('navigate', 'guest-dashboard');
  } else {
    await authStore.switchRole('host');
    emit('navigate', 'host-dashboard');
  }
};
</script>

<template>
  <header class="sticky top-0 z-40 w-full bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border-b border-neutral-200/90 dark:border-neutral-800 transition-all">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
      <!-- Brand Logo (Airbnb Luxe Master Key) -->
      <div class="flex items-center gap-6 shrink-0">
        <button
          @click="emit('navigate', 'explore')"
          class="flex items-center gap-2.5 group text-left focus:outline-none cursor-pointer"
        >
          <!-- Stylized Airbnb Luxe Monogram -->
          <div class="w-9 h-9 rounded-xl bg-neutral-900 dark:bg-white flex items-center justify-center text-white dark:text-neutral-900 shadow-md group-hover:scale-105 transition-transform relative overflow-hidden">
            <span class="font-serif italic font-black text-lg tracking-tighter text-[#BA0934]">L</span>
            <div class="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400"></div>
          </div>
          <div class="flex flex-col">
            <div class="flex items-baseline gap-1.5">
              <span class="font-extrabold text-xl tracking-tight text-neutral-900 dark:text-white group-hover:text-[#BA0934] transition-colors">
                LuxeStay
              </span>
              <span class="font-serif italic text-xs tracking-widest uppercase font-extrabold text-[#BA0934]">
                LUXE
              </span>
            </div>
            <span class="text-[9px] uppercase tracking-wider text-neutral-400 font-semibold -mt-1 hidden sm:block">
              Luxury Retreats & 3D Spatial
            </span>
          </div>
        </button>
      </div>

      <!-- Airbnb Luxe Iconic Floating Search Pill (Center) -->
      <div class="hidden lg:flex items-center justify-center flex-1 max-w-md">
        <button
          @click="emit('openFilter')"
          class="w-full flex items-center justify-between px-4 py-2 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-850 hover:shadow-md transition-all text-xs font-semibold text-neutral-800 dark:text-neutral-200 cursor-pointer divide-x divide-neutral-200 dark:divide-neutral-700"
        >
          <span class="px-2 truncate">
            {{ propertyStore.searchQuery || 'Anywhere in luxury' }}
          </span>
          <span class="px-3 text-neutral-500 font-normal">
            Any week
          </span>
          <div class="flex items-center gap-2 pl-3">
            <span class="text-neutral-500 font-normal">
              {{ propertyStore.bedroomsFilter !== 'any' ? `${propertyStore.bedroomsFilter}+ beds` : 'Add guests' }}
            </span>
            <div class="w-7 h-7 rounded-full bg-[#BA0934] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Search class="w-3.5 h-3.5" />
            </div>
          </div>
        </button>
      </div>

      <!-- Right Actions: Trip Designer, Host Portal, User Menu -->
      <div class="flex items-center gap-3 shrink-0">
        <!-- Connect With Dedicated Trip Designer Pill -->
        <button
          @click="propertyStore.openTripDesigner()"
          class="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-bold text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer border border-transparent hover:border-neutral-200 dark:hover:border-neutral-700"
        >
          <Sparkles class="w-3.5 h-3.5 text-[#BA0934]" />
          <span>Trip Designer</span>
        </button>

        <!-- Host Portal (Visible ONLY for authenticated Hosts, NEVER on public UI) -->
        <button
          v-if="authStore.isHost"
          @click="emit('navigate', 'host-dashboard')"
          class="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 shadow"
        >
          <Shield class="w-3.5 h-3.5 text-[#BA0934]" />
          <span>Host Operations</span>
        </button>

        <!-- Unauthenticated Guest Buttons (Replaces previous ambiguous [ ≡ (G) ] pill button) -->
        <template v-if="!authStore.user">
          <button
            @click="emit('openAuth', 'login')"
            class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer border border-neutral-300 dark:border-neutral-700"
          >
            <LogIn class="w-3.5 h-3.5 text-[#BA0934]" />
            <span>Log In</span>
          </button>

          <button
            @click="emit('openAuth', 'register-guest')"
            class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-white bg-[#BA0934] hover:bg-[#960729] shadow-xs transition cursor-pointer"
          >
            <UserPlus class="w-3.5 h-3.5" />
            <span>Sign Up</span>
          </button>
        </template>

        <!-- Authenticated User Menu Dropdown (Active when user is logged in) -->
        <div v-else class="relative">
          <button
            @click="showUserDropdown = !showUserDropdown"
            class="flex items-center gap-2.5 p-1 pl-3 pr-1.5 rounded-full border border-neutral-300 dark:border-neutral-700 hover:shadow-md transition bg-white dark:bg-neutral-850 cursor-pointer"
          >
            <span class="text-xs font-bold text-neutral-800 dark:text-neutral-200 max-w-[100px] truncate hidden sm:inline">
              {{ authStore.user.name.split(' ')[0] }}
            </span>
            <img
              :src="authStore.user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'"
              :alt="authStore.user.name"
              class="w-7 h-7 rounded-full object-cover ring-2 ring-[#BA0934]"
            />
          </button>

          <!-- Dropdown Menu -->
          <div
            v-if="showUserDropdown"
            class="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-neutral-900 shadow-2xl border border-neutral-200 dark:border-neutral-800 py-2 z-50 text-neutral-800 dark:text-neutral-200 animate-in fade-in slide-in-from-top-2"
          >
            <div class="px-4 py-3 border-b border-neutral-100 dark:border-neutral-800">
              <p class="text-xs font-bold text-neutral-900 dark:text-white truncate">{{ authStore.user.name }}</p>
              <p class="text-[11px] text-neutral-500 truncate">{{ authStore.user.email }}</p>
              <div class="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-neutral-100 dark:bg-neutral-800 text-[#BA0934]">
                <span class="w-1.5 h-1.5 rounded-full bg-[#BA0934]"></span>
                <span>Active: {{ authStore.user.role }}</span>
              </div>
            </div>

            <div class="py-1">
              <button
                @click="emit('navigate', 'explore'); showUserDropdown = false"
                class="w-full text-left px-4 py-2.5 text-xs text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition flex items-center justify-between cursor-pointer"
              >
                <span>Explore Luxe Collection</span>
              </button>

              <button
                @click="emit('navigate', 'guest-dashboard'); showUserDropdown = false"
                class="w-full text-left px-4 py-2.5 text-xs text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition flex items-center gap-2 cursor-pointer"
              >
                <UserCheck class="w-3.5 h-3.5 text-neutral-400" />
                <span>My Luxe Reservations</span>
              </button>

              <button
                v-if="authStore.isHost"
                @click="emit('navigate', 'host-dashboard'); showUserDropdown = false"
                class="w-full text-left px-4 py-2.5 text-xs text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition flex items-center gap-2 cursor-pointer"
              >
                <Shield class="w-3.5 h-3.5 text-[#BA0934]" />
                <span>Host Operations & 3D Tours</span>
              </button>

              <button
                @click="propertyStore.openTripDesigner(); showUserDropdown = false"
                class="w-full text-left px-4 py-2.5 text-xs text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition flex items-center gap-2 cursor-pointer"
              >
                <Sparkles class="w-3.5 h-3.5 text-amber-500" />
                <span>Trip Designer Consultation</span>
              </button>

              <button
                @click="handleRoleSwitch(); showUserDropdown = false"
                class="w-full text-left px-4 py-2.5 text-xs font-semibold text-[#BA0934] hover:bg-neutral-50 dark:hover:bg-neutral-800 transition flex items-center gap-2 cursor-pointer"
              >
                <span>{{ authStore.isHost ? 'Switch to Guest Mode (Marcus)' : 'Switch to Host Mode (Alex)' }}</span>
              </button>
            </div>

            <div class="border-t border-neutral-100 dark:border-neutral-800 pt-1">
              <button
                @click="emit('openAuth', 'login'); showUserDropdown = false"
                class="w-full text-left px-4 py-2 text-xs text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition flex items-center gap-2 cursor-pointer"
              >
                <LogIn class="w-3.5 h-3.5 text-neutral-400" />
                <span>Switch Account / Sign In</span>
              </button>
              <button
                @click="emit('openAuth', 'register-guest'); showUserDropdown = false"
                class="w-full text-left px-4 py-2 text-xs text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition flex items-center gap-2 cursor-pointer"
              >
                <UserPlus class="w-3.5 h-3.5 text-emerald-500" />
                <span>Register as Guest Traveler</span>
              </button>
              <button
                @click="emit('openAuth', 'register-host'); showUserDropdown = false"
                class="w-full text-left px-4 py-2 text-xs text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition flex items-center gap-2 cursor-pointer"
              >
                <Building class="w-3.5 h-3.5 text-[#BA0934]" />
                <span>Register as Luxe Host</span>
              </button>
              <div class="border-t border-neutral-100 dark:border-neutral-800 my-1"></div>
              <button
                @click="authStore.logout(); showUserDropdown = false"
                class="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition flex items-center gap-2 cursor-pointer"
              >
                <LogOut class="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>
