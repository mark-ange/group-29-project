<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Navbar from './components/Navbar.vue';
import HeroSection from './components/HeroSection.vue';
import CategoryBar from './components/CategoryBar.vue';
import PropertyCard from './components/PropertyCard.vue';
import PropertyDetailModal from './components/PropertyDetailModal.vue';
import VirtualTourModal from './components/VirtualTourModal.vue';
import GuestDashboard from './components/GuestDashboard.vue';
import HostDashboard from './components/HostDashboard.vue';
import DesignSystemView from './components/DesignSystemView.vue';
import AuthModal from './components/AuthModal.vue';
import FilterModal from './components/FilterModal.vue';
import LuxeDifferenceSection from './components/LuxeDifferenceSection.vue';
import LuxeMapSplitView from './components/LuxeMapSplitView.vue';
import TripDesignerModal from './components/TripDesignerModal.vue';
import CalloutBanner from './components/CalloutBanner.vue';
import Footer from './components/Footer.vue';

import { usePropertyStore, type PropertyItem } from './stores/properties';
import { useAuthStore } from './stores/auth';
import { useBookingStore } from './stores/bookings';
import { Box, Sparkles, Filter, CheckCircle2, Map, List, Layers } from 'lucide-vue-next';

const currentView = ref<'explore' | 'guest-dashboard' | 'host-dashboard' | 'design-system'>('explore');

const propertyStore = usePropertyStore();
const authStore = useAuthStore();
const bookingStore = useBookingStore();

// Modals
const selectedProperty = ref<PropertyItem | null>(null);
const activeTourProperty = ref<PropertyItem | null>(null);
const isAuthOpen = ref(false);
const authModalTab = ref<'login' | 'register-guest' | 'register-host'>('login');
const isFilterOpen = ref(false);
const toast = ref<string | null>(null);

const handleOpenAuth = (tab: 'login' | 'register-guest' | 'register-host' = 'login') => {
  authModalTab.value = tab;
  isAuthOpen.value = true;
};

const handleAuthSuccess = (user: any) => {
  if (user?.role === 'host') {
    currentView.value = 'host-dashboard';
    showToast(`Welcome, ${user.name}! Host Operations Portal is active.`);
  } else {
    showToast(`Welcome, ${user?.name || 'Valued Guest'}! Sanctuary guest account active.`);
  }
};

const showToast = (msg: string) => {
  toast.value = msg;
  setTimeout(() => {
    toast.value = null;
  }, 4500);
};

onMounted(async () => {
  await Promise.all([
    propertyStore.fetchProperties(),
    authStore.checkAuth(),
    bookingStore.fetchHostDashboard(),
  ]);
});

const handleOpenTour = (slug?: string) => {
  if (slug) {
    const prop = propertyStore.properties.find((p) => p.slug === slug);
    if (prop) {
      activeTourProperty.value = prop;
      return;
    }
  }
  if (propertyStore.properties.length > 0) {
    activeTourProperty.value = propertyStore.properties[0];
  }
};

const handleSelectProperty = (property: PropertyItem) => {
  selectedProperty.value = property;
};

const handleOpen3DFromCard = (property: PropertyItem) => {
  activeTourProperty.value = property;
};

const handleBookingSuccess = (booking: any) => {
  showToast('Luxe Reservation confirmed in PostgreSQL! Check "My Trips" or Host Portal.');
};

const scrollToVillas = () => {
  const el = document.getElementById('villas-grid');
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
};
</script>

<template>
  <div class="min-h-screen bg-[#FBFBFB] dark:bg-[#0F0F10] text-[#1A1A1A] dark:text-neutral-100 flex flex-col font-sans selection:bg-[#BA0934] selection:text-white transition-colors">
    <!-- Navbar -->
    <Navbar
      :currentView="currentView"
      @navigate="currentView = $event as any"
      @openAuth="handleOpenAuth($event)"
      @openFilter="isFilterOpen = true"
    />

    <!-- Global Floating Toast Notification -->
    <div
      v-if="toast"
      class="fixed bottom-20 sm:bottom-8 right-6 z-50 p-4 rounded-2xl bg-neutral-900 text-white shadow-2xl border border-white/15 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3"
    >
      <CheckCircle2 class="w-5 h-5 text-emerald-400 shrink-0" />
      <span class="text-xs font-bold">{{ toast }}</span>
    </div>

    <!-- MAIN VIEW CONTAINER -->
    <main class="flex-1">
      <!-- VIEW 1: EXPLORE / CATALOG (AIRBNB LUXE MASTER) -->
      <div v-if="currentView === 'explore'">
        <!-- Hero Section with Three.js Spatial Canvas -->
        <HeroSection
          @openTour="handleOpenTour"
          @scrollToVillas="scrollToVillas"
        />

        <!-- Category & Utility Bar with Total Toggle and Map Toggle -->
        <CategoryBar @openFilter="isFilterOpen = true" />

        <!-- Split Map View OR Standard Grid -->
        <div v-if="propertyStore.showMap" class="py-4">
          <LuxeMapSplitView
            @select="handleSelectProperty"
            @open3d="handleOpen3DFromCard"
          />
        </div>

        <!-- Default Grid View -->
        <section v-else id="villas-grid" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div class="flex items-center gap-2 mb-1">
                <span class="font-serif italic text-xs font-black uppercase text-[#BA0934] tracking-widest">
                  LUXE COLLECTION
                </span>
                <span class="text-neutral-300 dark:text-neutral-700">&bull;</span>
                <span class="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                  {{ propertyStore.filteredProperties.length }} Verified Sanctuaries
                </span>
              </div>
              <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
                Remarkable Private Villas
              </h2>
            </div>

            <!-- Action buttons -->
            <div class="flex items-center gap-3">
              <button
                @click="propertyStore.toggleMap()"
                class="px-4 py-2 rounded-full border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-850 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-xs font-bold text-neutral-800 dark:text-neutral-200 transition shadow-xs flex items-center gap-2 cursor-pointer"
              >
                <Map class="w-3.5 h-3.5 text-[#BA0934]" />
                <span>Switch to Map View</span>
              </button>

              <button
                @click="isFilterOpen = true"
                class="px-4 py-2 rounded-full border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-850 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-xs font-bold text-neutral-800 dark:text-neutral-200 transition shadow-xs flex items-center gap-2 cursor-pointer"
              >
                <Filter class="w-3.5 h-3.5" />
                <span>Filters</span>
              </button>
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="propertyStore.isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="i in 6" :key="i" class="h-96 rounded-3xl bg-neutral-200/70 dark:bg-neutral-800 animate-pulse"></div>
          </div>

          <!-- Empty State -->
          <div
            v-else-if="propertyStore.filteredProperties.length === 0"
            class="py-16 text-center rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-8 space-y-4 shadow-sm"
          >
            <Box class="w-12 h-12 text-neutral-400 mx-auto" />
            <h3 class="text-lg font-bold text-neutral-900 dark:text-white">No matching Luxe sanctuaries found</h3>
            <p class="text-xs text-neutral-500 max-w-sm mx-auto">
              Try adjusting your search criteria or resetting filters to browse the entire architectural collection.
            </p>
            <button
              @click="propertyStore.activeCategory = 'all'; propertyStore.only3D = false; propertyStore.searchQuery = ''"
              class="px-5 py-2.5 rounded-full bg-[#BA0934] text-white text-xs font-bold shadow hover:bg-[#960729] cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>

          <!-- Property Cards Grid -->
          <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            <PropertyCard
              v-for="property in propertyStore.filteredProperties"
              :key="property.id"
              :property="property"
              @select="handleSelectProperty"
              @open3d="handleOpen3DFromCard"
            />
          </div>
        </section>

        <!-- Airbnb Luxe Difference Pillars Section (The 300+ Inspection, Trip Designer, Bespoke Amenities) -->
        <LuxeDifferenceSection />

        <!-- 3D Spatial Walkthrough Callout Banner -->
        <CalloutBanner @open3d="handleOpenTour()" />

        <!-- Floating Airbnb Luxe "Show Map" / "Show List" Bottom Pill -->
        <div class="fixed bottom-6 left-1/2 -translate-x-1/2 z-30">
          <button
            @click="propertyStore.toggleMap()"
            class="px-5 py-3 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-2xl hover:scale-105 transition-all text-xs font-bold flex items-center gap-2 border border-white/20 dark:border-neutral-800 cursor-pointer"
          >
            <component :is="propertyStore.showMap ? List : Map" class="w-4 h-4 text-[#BA0934]" />
            <span>{{ propertyStore.showMap ? 'Show list' : 'Show map' }}</span>
          </button>
        </div>
      </div>

      <!-- VIEW 2: GUEST TRIPS & ITINERARIES -->
      <div v-else-if="currentView === 'guest-dashboard'">
        <GuestDashboard
          @explore="currentView = 'explore'"
          @open3d="handleOpenTour($event?.slug)"
        />
      </div>

      <!-- VIEW 3: HOST PORTAL & 3D ASSET MANAGEMENT -->
      <div v-else-if="currentView === 'host-dashboard'">
        <HostDashboard />
      </div>

      <!-- VIEW 4: DESIGN SYSTEM & ARCHITECTURE TOKENS -->
      <div v-else-if="currentView === 'design-system'">
        <DesignSystemView />
      </div>
    </main>

    <!-- Footer -->
    <Footer @navigate="currentView = $event as any" />

    <!-- MODALS -->
    <!-- 1. Property Detail & Reservation Modal -->
    <PropertyDetailModal
      :property="selectedProperty"
      @close="selectedProperty = null"
      @open3d="activeTourProperty = $event; selectedProperty = null"
      @bookingSuccess="handleBookingSuccess"
    />

    <!-- 2. Fullscreen 3D Virtual Tour Modal -->
    <VirtualTourModal
      :property="activeTourProperty"
      @close="activeTourProperty = null"
      @reserve="selectedProperty = $event; activeTourProperty = null"
    />

    <!-- 3. Trip Designer Modal -->
    <TripDesignerModal
      v-if="propertyStore.isTripDesignerOpen"
      @close="propertyStore.closeTripDesigner"
      @requestSubmitted="showToast('Your Trip Designer request has been sent! A concierge will connect with you.')"
    />

    <!-- 4. Authentication Modal (Log In, Guest Registration, Host Registration) -->
    <AuthModal
      v-if="isAuthOpen"
      :initialTab="authModalTab"
      @close="isAuthOpen = false"
      @authSuccess="handleAuthSuccess"
    />

    <!-- 5. Filter Modal -->
    <FilterModal
      v-if="isFilterOpen"
      @close="isFilterOpen = false"
    />
  </div>
</template>
