<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import {
  X,
  Star,
  Box,
  Bed,
  Bath,
  Users,
  Maximize2,
  CheckCircle2,
  AlertCircle,
  Calendar,
  ShieldCheck,
  Sparkles,
  Heart,
  Share2,
  UserCheck,
  Lock,
  LogIn,
  Compass,
  Award,
  ChevronRight,
  Utensils,
  Car,
  Wine,
} from 'lucide-vue-next';
import type { PropertyItem } from '../stores/properties';
import { usePropertyStore } from '../stores/properties';
import { useBookingStore } from '../stores/bookings';
import { useAuthStore } from '../stores/auth';
import { api } from '../services/api';

const props = defineProps<{
  property: PropertyItem | null;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'open3d', property: PropertyItem): void;
  (e: 'bookingSuccess', booking: any): void;
}>();

const propertyStore = usePropertyStore();
const bookingStore = useBookingStore();
const authStore = useAuthStore();

const activeImageIndex = ref(0);
const guestsCount = ref(2);
const notes = ref('');

// Optional In-Villa Add-ons
const addChef = ref(false);
const addTransfer = ref(false);
const addWine = ref(false);
const instantApproval = ref(true);

// Date defaults: next week for 4 nights
const getDefaultDates = () => {
  const start = new Date();
  start.setDate(start.getDate() + 10);
  const end = new Date(start);
  end.setDate(end.getDate() + 4);
  return {
    checkIn: start.toISOString().split('T')[0],
    checkOut: end.toISOString().split('T')[0],
  };
};

const defaultDates = getDefaultDates();
const checkIn = ref(defaultDates.checkIn);
const checkOut = ref(defaultDates.checkOut);

// Server-side calculation state
const isCalculating = ref(false);
const isAvailabilityChecking = ref(false);
const priceBreakdown = ref<{
  nights: number;
  nightly_rate: number;
  subtotal: number;
  service_fee: number;
  total_price: number;
  formatted_total: string;
} | null>(null);

const isAvailable = ref(true);
const availabilityMessage = ref('');
const submitError = ref<string | null>(null);
const submitSuccess = ref(false);
const createdBooking = ref<any>(null);

const isFavorite = computed(() => {
  return props.property ? propertyStore.isWishlisted(props.property.id) : false;
});

const toggleFavorite = () => {
  if (props.property) {
    propertyStore.toggleWishlist(props.property.id);
  }
};

// Add-ons subtotal
const addOnsTotal = computed(() => {
  let total = 0;
  const nights = priceBreakdown.value ? priceBreakdown.value.nights : 4;
  if (addChef.value) total += 450 * nights;
  if (addTransfer.value) total += 200;
  if (addWine.value) total += 350;
  return total;
});

const finalTotal = computed(() => {
  if (!priceBreakdown.value) return 0;
  return priceBreakdown.value.total_price + addOnsTotal.value;
});

// Recalculate price and check availability via backend API
const updateCalculations = async () => {
  if (!props.property || !checkIn.value || !checkOut.value) return;

  if (new Date(checkOut.value) <= new Date(checkIn.value)) {
    availabilityMessage.value = 'Check-out date must be after check-in date.';
    isAvailable.value = false;
    priceBreakdown.value = null;
    return;
  }

  isCalculating.value = true;
  isAvailabilityChecking.value = true;
  submitError.value = null;

  try {
    const priceRes = await api.calculatePrice(props.property.slug, checkIn.value, checkOut.value);
    if (priceRes.success) {
      priceBreakdown.value = priceRes.data;
    }

    const availRes = await api.checkAvailability(props.property.slug, checkIn.value, checkOut.value);
    if (availRes.success) {
      isAvailable.value = availRes.data.is_available;
      availabilityMessage.value = availRes.data.message;
    }
  } catch (err: any) {
    console.error('Calculation error:', err);
    availabilityMessage.value = err.message || 'Unable to check dates';
    isAvailable.value = false;
  } finally {
    isCalculating.value = false;
    isAvailabilityChecking.value = false;
  }
};

watch(() => [checkIn.value, checkOut.value, props.property], () => {
  updateCalculations();
});

onMounted(() => {
  updateCalculations();
});

const handleReserve = async () => {
  if (!props.property) return;
  submitError.value = null;

  // Strict Auth Guard: Logged-out users can only view images, never book
  if (!authStore.user) {
    submitError.value = 'Sign in required: Guests must be logged in to reserve a villa. Logged-out visitors can only view villa imagery.';
    authStore.openAuth('login', 'Please sign in or create an account to book this luxury villa.');
    return;
  }

  let requestNotes = notes.value;
  const addOnsList: string[] = [];
  if (addChef.value) addOnsList.push('Private In-Villa Chef');
  if (addTransfer.value) addOnsList.push('Airport Luxury Chauffeur');
  if (addWine.value) addOnsList.push('Pre-stocked Sommelier Cellar');
  if (addOnsList.length > 0) {
    requestNotes += ` [Add-ons requested: ${addOnsList.join(', ')}]`;
  }

  try {
    const booking = await bookingStore.createReservation({
      property_id: props.property.id,
      check_in: checkIn.value,
      check_out: checkOut.value,
      guests_count: guestsCount.value,
      notes: requestNotes,
      instant_approval: instantApproval.value,
    });
    createdBooking.value = booking;
    submitSuccess.value = true;
    emit('bookingSuccess', booking);
  } catch (err: any) {
    submitError.value = err.message || 'Failed to submit reservation';
  }
};
</script>

<template>
  <div v-if="property" class="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 transition-opacity">
    <div
      class="relative w-full max-w-6xl rounded-3xl bg-white dark:bg-neutral-900 shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden my-auto max-h-[94vh] flex flex-col text-neutral-900 dark:text-neutral-100"
    >
      <!-- Modal Top Bar -->
      <div class="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-neutral-50/70 dark:bg-neutral-850/70">
        <div class="flex items-center gap-2 text-xs font-semibold">
          <span class="font-serif italic font-extrabold text-[#BA0934] uppercase tracking-wider">Airbnb LUXE</span>
          <span class="text-neutral-300 dark:text-neutral-600">&bull;</span>
          <span class="text-neutral-500 dark:text-neutral-400">{{ property.location }}, {{ property.country }}</span>
        </div>

        <div class="flex items-center gap-3">
          <button
            @click="toggleFavorite"
            class="p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition cursor-pointer"
            :title="isFavorite ? 'Remove from wishlist' : 'Save to wishlist'"
          >
            <Heart class="w-4 h-4" :class="isFavorite ? 'fill-[#BA0934] text-[#BA0934]' : ''" />
          </button>
          <button
            @click="emit('close')"
            class="p-2 rounded-full text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-neutral-800 transition cursor-pointer"
          >
            <X class="w-5 h-5" />
          </button>
        </div>
      </div>

      <!-- Modal Body (Scrollable) -->
      <div class="overflow-y-auto p-6 sm:p-8 space-y-8">
        <!-- Title & Badges Row -->
        <div class="space-y-2">
          <div class="flex flex-wrap items-center gap-3 text-xs font-semibold">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-bold uppercase tracking-wider text-[10px]">
              <Sparkles class="w-3 h-3 text-amber-500" />
              <span>LUXE Certified 300+ Point Inspection</span>
            </span>
            <span class="px-2.5 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-[11px]">
              {{ property.architectural_style }}
            </span>
          </div>

          <h2 class="text-2xl sm:text-4xl font-extrabold tracking-tight break-words">
            {{ property.title }}
          </h2>

          <div class="flex flex-wrap items-center justify-between gap-4 pt-1 min-w-0">
            <div class="flex flex-wrap items-center gap-2 text-xs font-bold min-w-0">
              <Star class="w-4 h-4 fill-[#BA0934] text-[#BA0934] shrink-0" />
              <span class="text-sm font-extrabold shrink-0">{{ property.rating.toFixed(2) }}</span>
              <span class="text-neutral-400 font-normal shrink-0">({{ property.reviews_count }} verified luxury stays)</span>
              <span class="text-neutral-300 dark:text-neutral-700 hidden sm:inline">&bull;</span>
              <span class="text-neutral-600 dark:text-neutral-400 font-medium truncate">{{ property.location }}, {{ property.country }}</span>
            </div>

            <button
              v-if="property.has_3d_tour"
              @click="emit('open3d', property)"
              class="px-4 py-2 rounded-2xl bg-neutral-900 dark:bg-white hover:bg-[#BA0934] dark:hover:bg-[#BA0934] text-white dark:text-neutral-900 dark:hover:text-white text-xs font-bold transition-all shadow flex items-center gap-2 cursor-pointer shrink-0"
            >
              <Box class="w-4 h-4 text-[#BA0934]" />
              <span>Launch 3D Spatial Walkthrough</span>
            </button>
          </div>
        </div>

        <!-- Airbnb Luxe 5-Photo Collage -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-2.5 rounded-3xl overflow-hidden relative">
          <!-- Main Left Hero Photo -->
          <div class="md:col-span-2 aspect-[4/3] bg-neutral-100 dark:bg-neutral-800 relative group overflow-hidden">
            <img
              :src="property.images[0]"
              :alt="property.title"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          </div>

          <!-- Right Grid (4 photos) -->
          <div class="md:col-span-2 grid grid-cols-2 gap-2.5">
            <div
              v-for="(img, idx) in property.images.slice(1, 5)"
              :key="idx"
              class="aspect-[4/3] bg-neutral-100 dark:bg-neutral-800 overflow-hidden relative group"
            >
              <img
                :src="img"
                :alt="property.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>

          <!-- Floating button to launch 3D tour -->
          <button
            v-if="property.has_3d_tour"
            @click="emit('open3d', property)"
            class="absolute bottom-4 right-4 px-4 py-2 rounded-xl bg-black/75 hover:bg-[#BA0934] text-white backdrop-blur-md text-xs font-bold shadow-xl border border-white/20 flex items-center gap-2 transition cursor-pointer"
          >
            <Box class="w-4 h-4" />
            <span>Enter 3D Spatial Model</span>
          </button>
        </div>

        <!-- Master Content Grid: Details Left vs Authoritative Reservation Card Right -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-start">
          <!-- Left Column -->
          <div class="lg:col-span-7 space-y-8 min-w-0">
            <!-- Host & Trip Designer Banner -->
            <div class="flex flex-wrap items-center justify-between p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-800 gap-3 min-w-0">
              <div class="flex items-center gap-3 min-w-0">
                <img
                  :src="property.host.avatar"
                  :alt="property.host.name"
                  class="w-12 h-12 rounded-full object-cover ring-2 ring-[#BA0934] shrink-0"
                />
                <div class="min-w-0">
                  <h4 class="text-sm font-extrabold text-neutral-900 dark:text-white truncate">
                    Entire Villa Hosted by {{ property.host.name }}
                  </h4>
                  <p class="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                    Architect: <strong class="text-neutral-700 dark:text-neutral-300">{{ property.designer || property.architectural_style }}</strong>
                  </p>
                </div>
              </div>

              <!-- Dedicated Trip Designer Pill -->
              <div
                v-if="property.trip_designer"
                @click="propertyStore.openTripDesigner()"
                class="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs font-bold text-neutral-800 dark:text-neutral-200 shadow-xs cursor-pointer hover:border-[#BA0934] transition shrink-0"
              >
                <Sparkles class="w-3.5 h-3.5 text-[#BA0934]" />
                <span>Designer: {{ property.trip_designer.name }}</span>
              </div>
            </div>

            <!-- Architectural Specs Grid -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 border-y border-neutral-200 dark:border-neutral-800 text-center">
              <div class="p-3 bg-neutral-50 dark:bg-neutral-850 rounded-2xl min-w-0">
                <Bed class="w-4 h-4 mx-auto text-[#BA0934] mb-1" />
                <span class="block text-xs font-extrabold truncate">{{ property.bedrooms }} Bedrooms</span>
                <span class="text-[10px] text-neutral-500 truncate block">En-suite Suites</span>
              </div>
              <div class="p-3 bg-neutral-50 dark:bg-neutral-850 rounded-2xl min-w-0">
                <Bath class="w-4 h-4 mx-auto text-[#BA0934] mb-1" />
                <span class="block text-xs font-extrabold truncate">{{ property.bathrooms }} Baths</span>
                <span class="text-[10px] text-neutral-500 truncate block">Spa Finishes</span>
              </div>
              <div class="p-3 bg-neutral-50 dark:bg-neutral-850 rounded-2xl min-w-0">
                <Users class="w-4 h-4 mx-auto text-[#BA0934] mb-1" />
                <span class="block text-xs font-extrabold truncate">{{ property.max_guests }} Guests</span>
                <span class="text-[10px] text-neutral-500 truncate block">Max Capacity</span>
              </div>
              <div class="p-3 bg-neutral-50 dark:bg-neutral-850 rounded-2xl min-w-0">
                <Maximize2 class="w-4 h-4 mx-auto text-[#BA0934] mb-1" />
                <span class="block text-xs font-extrabold truncate">{{ property.sqft.toLocaleString() }} sq ft</span>
                <span class="text-[10px] text-neutral-500 truncate block">Total Living Area</span>
              </div>
            </div>

            <!-- 300+ Point Inspection Assurance Card -->
            <div class="p-5 rounded-2xl bg-neutral-900 text-white space-y-3">
              <div class="flex items-center gap-2">
                <ShieldCheck class="w-5 h-5 text-emerald-400" />
                <h4 class="text-sm font-bold tracking-tight">The Airbnb Luxe 300+ Point Certification</h4>
              </div>
              <p class="text-xs text-neutral-300 leading-relaxed">
                This home was visited in-person and approved by a professional Luxe inspector. Every amenity, mattress firmness, chef’s appliance, water pressure rating, and architectural detail has been verified to meet the highest global standards of luxury.
              </p>
              <div class="flex flex-wrap gap-3 pt-1 text-[11px] text-neutral-400 font-medium">
                <span>&bull; Starlink High-Speed WiFi</span>
                <span>&bull; Bespoke Egyptian Cotton Linens</span>
                <span>&bull; Sub-Zero Refrigeration</span>
                <span>&bull; Sound-Dampened Glazing</span>
              </div>
            </div>

            <!-- Architectural Concept & Narrative -->
            <div class="space-y-2">
              <h4 class="text-sm font-bold uppercase tracking-wider text-neutral-400">Architectural Narrative</h4>
              <p class="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed font-normal">
                {{ property.description }}
              </p>
            </div>

            <!-- Sleeping Arrangements (Airbnb Style) -->
            <div v-if="property.sleeping_arrangements && property.sleeping_arrangements.length > 0" class="space-y-3">
              <h4 class="text-sm font-bold uppercase tracking-wider text-neutral-400">Where you'll sleep</h4>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  v-for="(room, rIdx) in property.sleeping_arrangements"
                  :key="rIdx"
                  class="p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-850 space-y-2"
                >
                  <Bed class="w-5 h-5 text-[#BA0934]" />
                  <div>
                    <h5 class="text-xs font-bold text-neutral-900 dark:text-white">{{ room.room }}</h5>
                    <p class="text-xs text-neutral-500">{{ room.bed_type }}</p>
                    <p class="text-[11px] text-neutral-400 mt-1">{{ room.bath }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Curated Amenities Grid -->
            <div class="space-y-3">
              <h4 class="text-sm font-bold uppercase tracking-wider text-neutral-400">Luxury Amenities</h4>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div
                  v-for="amenity in property.amenities"
                  :key="amenity"
                  class="flex items-center gap-2.5 text-xs font-semibold text-neutral-700 dark:text-neutral-300 bg-neutral-50 dark:bg-neutral-850 px-3.5 py-2.5 rounded-xl border border-neutral-100 dark:border-neutral-800"
                >
                  <CheckCircle2 class="w-4 h-4 text-[#BA0934] shrink-0" />
                  <span>{{ amenity }}</span>
                </div>
              </div>
            </div>

            <!-- Luxe Rating Breakdown -->
            <div v-if="property.review_ratings" class="space-y-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
              <h4 class="text-sm font-bold uppercase tracking-wider text-neutral-400">Review Category Breakdown</h4>
              <div class="grid grid-cols-2 gap-4 text-xs">
                <div class="flex items-center justify-between">
                  <span class="text-neutral-600 dark:text-neutral-400">Cleanliness</span>
                  <div class="flex items-center gap-2">
                    <div class="w-24 h-1.5 rounded-full bg-neutral-200 dark:bg-neutral-700 overflow-hidden">
                      <div class="h-full bg-neutral-900 dark:bg-white" :style="{ width: `${(property.review_ratings.cleanliness / 5) * 100}%` }"></div>
                    </div>
                    <span class="font-bold">{{ property.review_ratings.cleanliness.toFixed(1) }}</span>
                  </div>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-neutral-600 dark:text-neutral-400">Accuracy</span>
                  <div class="flex items-center gap-2">
                    <div class="w-24 h-1.5 rounded-full bg-neutral-200 dark:bg-neutral-700 overflow-hidden">
                      <div class="h-full bg-neutral-900 dark:bg-white" :style="{ width: `${(property.review_ratings.accuracy / 5) * 100}%` }"></div>
                    </div>
                    <span class="font-bold">{{ property.review_ratings.accuracy.toFixed(1) }}</span>
                  </div>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-neutral-600 dark:text-neutral-400">Communication</span>
                  <div class="flex items-center gap-2">
                    <div class="w-24 h-1.5 rounded-full bg-neutral-200 dark:bg-neutral-700 overflow-hidden">
                      <div class="h-full bg-neutral-900 dark:bg-white" :style="{ width: `${(property.review_ratings.communication / 5) * 100}%` }"></div>
                    </div>
                    <span class="font-bold">{{ property.review_ratings.communication.toFixed(1) }}</span>
                  </div>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-neutral-600 dark:text-neutral-400">Location</span>
                  <div class="flex items-center gap-2">
                    <div class="w-24 h-1.5 rounded-full bg-neutral-200 dark:bg-neutral-700 overflow-hidden">
                      <div class="h-full bg-neutral-900 dark:bg-white" :style="{ width: `${(property.review_ratings.location / 5) * 100}%` }"></div>
                    </div>
                    <span class="font-bold">{{ property.review_ratings.location.toFixed(1) }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Featured Guest Reviews -->
            <div v-if="property.featured_reviews && property.featured_reviews.length > 0" class="space-y-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
              <h4 class="text-sm font-bold uppercase tracking-wider text-neutral-400">Guest Experiences</h4>
              <div class="space-y-4">
                <div
                  v-for="(rev, rvIdx) in property.featured_reviews"
                  :key="rvIdx"
                  class="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-800 space-y-2"
                >
                  <div class="flex items-center gap-3">
                    <img :src="rev.avatar" :alt="rev.author" class="w-9 h-9 rounded-full object-cover" />
                    <div>
                      <p class="text-xs font-bold text-neutral-900 dark:text-white">{{ rev.author }}</p>
                      <p class="text-[11px] text-neutral-400">{{ rev.date }}</p>
                    </div>
                  </div>
                  <p class="text-xs text-neutral-600 dark:text-neutral-300 italic">"{{ rev.comment }}"</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column: Sticky Airbnb Luxe Booking Card -->
          <div class="lg:col-span-5 sticky top-6">
            <div class="p-6 rounded-3xl bg-neutral-50 dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-800 shadow-xl space-y-5">
              <!-- Price Header -->
              <div class="flex items-baseline justify-between border-b border-neutral-200 dark:border-neutral-800 pb-4">
                <div>
                  <span class="text-2xl font-extrabold text-neutral-900 dark:text-white">{{ property.formatted_price }}</span>
                  <span class="text-xs text-neutral-500"> / night</span>
                </div>
                <div class="flex items-center gap-1 text-xs font-bold">
                  <Star class="w-3.5 h-3.5 fill-[#BA0934] text-[#BA0934]" />
                  <span>{{ property.rating.toFixed(2) }}</span>
                </div>
              </div>

              <!-- Interactive Date & Guest Picker Form -->
              <div class="rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 overflow-hidden divide-y divide-neutral-200 dark:divide-neutral-700">
                <div class="grid grid-cols-2 divide-x divide-neutral-200 dark:divide-neutral-700">
                  <div class="p-3">
                    <label class="block text-[10px] font-extrabold uppercase tracking-wider text-neutral-400">Check-in</label>
                    <input
                      v-model="checkIn"
                      type="date"
                      class="w-full text-xs font-semibold text-neutral-900 dark:text-white bg-transparent border-none p-0 focus:outline-none focus:ring-0 cursor-pointer"
                    />
                  </div>
                  <div class="p-3">
                    <label class="block text-[10px] font-extrabold uppercase tracking-wider text-neutral-400">Checkout</label>
                    <input
                      v-model="checkOut"
                      type="date"
                      class="w-full text-xs font-semibold text-neutral-900 dark:text-white bg-transparent border-none p-0 focus:outline-none focus:ring-0 cursor-pointer"
                    />
                  </div>
                </div>

                <div class="p-3">
                  <label class="block text-[10px] font-extrabold uppercase tracking-wider text-neutral-400">Guests</label>
                  <select
                    v-model="guestsCount"
                    class="w-full text-xs font-semibold text-neutral-900 dark:text-white bg-transparent border-none p-0 focus:outline-none focus:ring-0 cursor-pointer"
                  >
                    <option v-for="n in property.max_guests" :key="n" :value="n">
                      {{ n }} {{ n === 1 ? 'Guest' : 'Guests' }}
                    </option>
                  </select>
                </div>
              </div>

              <!-- Tailored In-Villa Add-ons Checklist -->
              <div class="space-y-2 pt-2 border-t border-neutral-200 dark:border-neutral-800">
                <label class="block text-[10px] font-extrabold uppercase tracking-wider text-neutral-400">
                  Optional Trip Designer Add-ons
                </label>
                <div class="space-y-1.5 text-xs">
                  <label class="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 cursor-pointer">
                    <div class="flex items-center gap-2">
                      <input type="checkbox" v-model="addChef" class="accent-[#BA0934]" />
                      <span>Private Michelin In-Villa Chef</span>
                    </div>
                    <span class="font-bold text-neutral-500">+$450/day</span>
                  </label>

                  <label class="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 cursor-pointer">
                    <div class="flex items-center gap-2">
                      <input type="checkbox" v-model="addTransfer" class="accent-[#BA0934]" />
                      <span>Airport Luxury Chauffeur</span>
                    </div>
                    <span class="font-bold text-neutral-500">+$200</span>
                  </label>

                  <label class="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 cursor-pointer">
                    <div class="flex items-center gap-2">
                      <input type="checkbox" v-model="addWine" class="accent-[#BA0934]" />
                      <span>Pre-stocked Sommelier Cellar</span>
                    </div>
                    <span class="font-bold text-neutral-500">+$350</span>
                  </label>
                </div>
              </div>

              <!-- Guest Instant Self-Approval Toggle -->
              <div class="pt-2 border-t border-neutral-200 dark:border-neutral-800">
                <label class="flex items-start gap-2.5 p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-850 border border-neutral-200/80 dark:border-neutral-800 cursor-pointer text-xs">
                  <input type="checkbox" v-model="instantApproval" class="mt-0.5 accent-emerald-600 rounded" />
                  <div class="space-y-0.5">
                    <span class="font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                      <CheckCircle2 class="w-3.5 h-3.5 text-emerald-600" />
                      Guest Instant Self-Approval
                    </span>
                    <p class="text-[11px] text-neutral-500">
                      Instantly confirm and lock your stay into confirmed status immediately.
                    </p>
                  </div>
                </label>
              </div>

              <!-- Availability Status -->
              <div
                v-if="availabilityMessage"
                :class="[
                  'p-3 rounded-2xl text-xs flex items-center gap-2',
                  isAvailable ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300' : 'bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300',
                ]"
              >
                <component :is="isAvailable ? CheckCircle2 : AlertCircle" class="w-4 h-4 shrink-0" />
                <span>{{ availabilityMessage }}</span>
              </div>

              <!-- Price Breakdown from Backend API -->
              <div v-if="priceBreakdown" class="space-y-2 pt-2 border-t border-neutral-200 dark:border-neutral-800 text-xs">
                <div class="flex justify-between text-neutral-600 dark:text-neutral-400">
                  <span>{{ property.formatted_price }} &times; {{ priceBreakdown.nights }} nights</span>
                  <span class="font-semibold text-neutral-900 dark:text-white">Mex${{ priceBreakdown.subtotal.toLocaleString() }}</span>
                </div>
                <div class="flex justify-between text-neutral-600 dark:text-neutral-400">
                  <span>Luxe Concierge &amp; Service Fee</span>
                  <span class="font-semibold text-neutral-900 dark:text-white">Mex${{ priceBreakdown.service_fee.toLocaleString() }}</span>
                </div>
                <div v-if="addOnsTotal > 0" class="flex justify-between text-neutral-600 dark:text-neutral-400">
                  <span>Bespoke In-Villa Add-ons</span>
                  <span class="font-semibold text-neutral-900 dark:text-white">+Mex${{ addOnsTotal.toLocaleString() }}</span>
                </div>
                <div class="flex justify-between pt-2 border-t border-neutral-200 dark:border-neutral-800 text-sm font-extrabold text-neutral-900 dark:text-white">
                  <span>Total before taxes</span>
                  <span class="text-[#BA0934]">Mex${{ finalTotal.toLocaleString() }}</span>
                </div>
              </div>

              <!-- Logged-Out Guest Preview Banner -->
              <div v-if="!authStore.user && !submitSuccess" class="p-4 rounded-2xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-xs space-y-2">
                <div class="flex items-center gap-2 font-bold text-neutral-900 dark:text-white">
                  <Lock class="w-4 h-4 text-[#BA0934] shrink-0" />
                  <span>Guest Account Required to Book</span>
                </div>
                <p class="text-[11px] text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  You are browsing in guest preview mode. You have full access to view villa photography and architectural details. To lock in dates and book this sanctuary, please sign in.
                </p>
                <button
                  @click="authStore.openAuth('login', 'Please sign in or create an account to reserve this villa.')"
                  class="w-full py-2.5 px-3 rounded-xl bg-[#BA0934] hover:bg-[#960729] text-white font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow text-xs"
                >
                  <LogIn class="w-3.5 h-3.5" />
                  <span>Sign In / Register to Book</span>
                </button>
              </div>

              <!-- Success State -->
              <div v-if="submitSuccess" class="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs space-y-2">
                <div class="flex items-center gap-2 font-bold text-sm">
                  <CheckCircle2 class="w-4 h-4 text-emerald-600" />
                  <span>{{ instantApproval ? 'Stay Instantly Booked & Self-Approved!' : 'Reservation Submitted to Luxe Host!' }}</span>
                </div>
                <p>
                  {{ instantApproval ? 'Your stay is officially confirmed and locked in PostgreSQL. View and manage your reservation in "My Trips".' : 'Stored in PostgreSQL. You can self-approve at any time from your "My Trips" dashboard.' }}
                </p>
              </div>

              <!-- Reserve Button (Logged In) -->
              <button
                v-if="!submitSuccess && authStore.user"
                @click="handleReserve"
                :disabled="!isAvailable || isCalculating || bookingStore.isLoading"
                :class="[
                  'w-full py-3.5 px-4 rounded-2xl font-bold text-xs uppercase tracking-wider text-white transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer',
                  isAvailable && !isCalculating
                    ? instantApproval ? 'bg-emerald-600 hover:bg-emerald-700 active:scale-98' : 'bg-[#BA0934] hover:bg-[#960729] active:scale-98'
                    : 'bg-neutral-400 cursor-not-allowed',
                ]"
              >
                <Lock class="w-4 h-4" />
                <span>{{ isCalculating ? 'Recalculating Rates...' : isAvailable ? (instantApproval ? 'Book & Instant Self-Approve' : 'Reserve Luxe Sanctuary') : 'Dates Unavailable' }}</span>
              </button>

              <!-- Sign-In To Reserve Button (Logged Out) -->
              <button
                v-else-if="!submitSuccess && !authStore.user"
                @click="authStore.openAuth('login', 'Please sign in or create an account to reserve this villa.')"
                class="w-full py-3.5 px-4 rounded-2xl font-bold text-xs uppercase tracking-wider text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-white transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <Lock class="w-4 h-4 text-[#BA0934]" />
                <span>Sign In to Reserve Villa</span>
              </button>

              <p class="text-center text-[11px] text-neutral-400">
                You won't be charged yet &bull; 300-point inspection guarantee
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
