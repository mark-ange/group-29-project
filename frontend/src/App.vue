<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Navbar from './components/Navbar.vue';
import HeroSection from './components/HeroSection.vue';
import CategoryBar from './components/CategoryBar.vue';
import PropertyCard from './components/PropertyCard.vue';
import PropertyDetailModal from './components/PropertyDetailModal.vue';
import VirtualTourModal from './components/VirtualTourModal.vue';
import GuestDashboard from './components/GuestDashboard.vue';
import AuthModal from './components/AuthModal.vue';
import FilterModal from './components/FilterModal.vue';
import CalloutBanner from './components/CalloutBanner.vue';
import Footer from './components/Footer.vue';

import { usePropertyStore, type PropertyItem } from './stores/properties';
import { useAuthStore } from './stores/auth';
import { Box, Sparkles, Filter, CheckCircle2 } from 'lucide-vue-next';

const currentView = ref<'explore' | 'guest-dashboard'>('explore');

const propertyStore = usePropertyStore();
const authStore = useAuthStore();

// Modals
const selectedProperty = ref<PropertyItem | null>(null);
const activeTourProperty = ref<PropertyItem | null>(null);
const isAuthOpen = ref(false);
const isFilterOpen = ref(false);
const toast = ref<string | null>(null);

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
  showToast('Reservation confirmed and saved. View it in My Trips.');
};

const scrollToVillas = () => {
  const el = document.getElementById('villas-grid');
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
};
</script>

<template>
  <div class="min-h-screen bg-[#FAFAFA] text-[#1A1A1A] flex flex-col font-sans selection:bg-[#BA0934] selection:text-white">
    <!-- Navbar -->
    <Navbar
      :currentView="currentView"
      @navigate="currentView = $event as any"
      @openAuth="isAuthOpen = true"
      @openFilter="isFilterOpen = true"
    />

    <!-- Global Floating Toast Notification -->
    <div
      v-if="toast"
      class="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-[#1A1A1A] text-white shadow-2xl border border-white/10 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3"
    >
      <CheckCircle2 class="w-5 h-5 text-emerald-400 flex-shrink-0" />
      <span class="text-xs font-bold">{{ toast }}</span>
    </div>

    <!-- MAIN VIEW CONTAINER -->
    <main class="flex-1">
      <!-- VIEW 1: EXPLORE / CATALOG -->
      <div v-if="currentView === 'explore'">
        <!-- Hero Section with 3D Canvas -->
        <HeroSection
          @openTour="handleOpenTour"
          @scrollToVillas="scrollToVillas"
        />

        <!-- Category & 3D Toggle Bar -->
        <CategoryBar />

        <!-- Villas Grid Section -->
        <section id="villas-grid" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-2xl font-extrabold tracking-tight text-[#1A1A1A]">
                Available Architectural Works
              </h2>
              <p class="text-xs text-neutral-500 mt-0.5">
                Displaying {{ propertyStore.filteredProperties.length }} private sanctuaries &bull; Live PostgreSQL availability
              </p>
            </div>

            <div class="flex items-center gap-2">
              <button
                @click="isFilterOpen = true"
                class="px-3.5 py-1.5 rounded-full border border-neutral-300 text-xs font-semibold text-neutral-700 hover:bg-neutral-100 transition-colors flex items-center gap-1.5"
              >
                <Filter class="w-3.5 h-3.5" />
                <span>Refine</span>
              </button>
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="propertyStore.isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="i in 6" :key="i" class="h-80 rounded-3xl bg-neutral-200/60 animate-pulse"></div>
          </div>

          <!-- Empty State -->
          <div
            v-else-if="propertyStore.filteredProperties.length === 0"
            class="py-16 text-center rounded-3xl bg-white border border-neutral-200 p-8 space-y-3"
          >
            <Box class="w-10 h-10 text-neutral-300 mx-auto" />
            <h3 class="text-base font-bold text-neutral-800">No matching sanctuaries found</h3>
            <p class="text-xs text-neutral-500 max-w-sm mx-auto">
              Adjust your search keywords or toggle off the 3D-only filter to explore the rest of the collection.
            </p>
            <button
              @click="propertyStore.activeCategory = 'all'; propertyStore.only3D = false; propertyStore.searchQuery = ''"
              class="px-4 py-2 rounded-xl bg-[#BA0934] text-white text-xs font-bold"
            >
              Reset Filters
            </button>
          </div>

          <!-- Property Cards Grid -->
          <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <PropertyCard
              v-for="property in propertyStore.filteredProperties"
              :key="property.id"
              :property="property"
              @select="handleSelectProperty"
              @open3d="handleOpen3DFromCard"
            />
          </div>
        </section>

        <!-- 3D Callout Banner -->
        <CalloutBanner @open3d="handleOpenTour()" />
      </div>

      <!-- VIEW 2: GUEST TRIPS & ITINERARIES -->
      <div v-else-if="currentView === 'guest-dashboard'">
        <GuestDashboard
          @explore="currentView = 'explore'"
          @open3d="handleOpenTour($event?.slug)"
        />
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

    <!-- 3. Authentication Modal -->
    <AuthModal
      v-if="isAuthOpen"
      @close="isAuthOpen = false"
      @authSuccess="showToast('Authenticated successfully on PostgreSQL')"
    />

    <!-- 4. Filter Modal -->
    <FilterModal
      v-if="isFilterOpen"
      @close="isFilterOpen = false"
    />
  </div>
</template>
