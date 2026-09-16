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
  Shield,
  Clock,
  Sparkles,
  ChevronRight,
  Lock,
} from 'lucide-vue-next';
import type { PropertyItem } from '../stores/properties';
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

const bookingStore = useBookingStore();
const authStore = useAuthStore();

const activeImageIndex = ref(0);
const guestsCount = ref(2);
const notes = ref('');

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

// Recalculate price and check availability via Laravel backend
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
    // 1. Calculate price on Laravel backend
    const priceRes = await api.calculatePrice(props.property.slug, checkIn.value, checkOut.value);
    if (priceRes.success) {
      priceBreakdown.value = priceRes.data;
    }

    // 2. Check availability on PostgreSQL backend
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

  try {
    const booking = await bookingStore.createReservation({
      property_id: props.property.id,
      check_in: checkIn.value,
      check_out: checkOut.value,
      guests_count: guestsCount.value,
      notes: notes.value,
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
  <div v-if="property" class="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
    <div
      class="relative w-full max-w-5xl rounded-3xl bg-white shadow-2xl border border-neutral-200/80 overflow-hidden my-auto max-h-[92vh] flex flex-col"
    >
      <!-- Modal Top Bar -->
      <div class="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/50">
        <div class="flex items-center gap-2">
          <span class="text-xs font-bold uppercase tracking-wider text-[#BA0934]">Architectural Monograph</span>
          <span class="text-neutral-300">&bull;</span>
          <span class="text-xs text-neutral-500">{{ property.location }}, {{ property.country }}</span>
        </div>
        <button
          @click="emit('close')"
          class="p-2 rounded-full text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200/60 transition-colors"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Modal Body (Scrollable) -->
      <div class="overflow-y-auto p-6 sm:p-8 space-y-8">
        <!-- Title & Badges Row -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-neutral-100 text-neutral-800">
                {{ property.architectural_style }}
              </span>
              <div class="flex items-center gap-1 text-xs font-bold text-neutral-900">
                <Star class="w-3.5 h-3.5 fill-[#BA0934] text-[#BA0934]" />
                <span>{{ property.rating.toFixed(2) }}</span>
                <span class="text-neutral-400 font-normal">({{ property.reviews_count }} verified reviews)</span>
              </div>
            </div>
            <h2 class="text-2xl sm:text-3xl font-extrabold text-[#1A1A1A] tracking-tight">
              {{ property.title }}
            </h2>
            <p class="text-sm text-neutral-500 mt-1">
              {{ property.subtitle }}
            </p>
          </div>

          <!-- 3D Action Button in Modal Header -->
          <button
            v-if="property.has_3d_tour"
            @click="emit('open3d', property)"
            class="px-4 py-2.5 rounded-2xl bg-[#1A1A1A] hover:bg-[#BA0934] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 whitespace-nowrap self-start"
          >
            <Box class="w-4 h-4 text-[#BA0934] group-hover:text-white" />
            <span>Launch Interactive 3D Model</span>
          </button>
        </div>

        <!-- High-Res Gallery Preview Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-3">
          <div class="lg:col-span-8 rounded-2xl overflow-hidden aspect-[16/10] bg-neutral-100 relative group">
            <img
              :src="property.images[activeImageIndex] || property.images[0]"
              :alt="property.title"
              class="w-full h-full object-cover"
              referrerpolicy="no-referrer"
            />
            <button
              v-if="property.has_3d_tour"
              @click="emit('open3d', property)"
              class="absolute bottom-4 right-4 glass-panel-dark px-3.5 py-2 rounded-xl text-white text-xs font-bold shadow-xl border border-white/10 flex items-center gap-2 hover:bg-[#BA0934] transition-colors"
            >
              <Box class="w-4 h-4" />
              <span>Explore 3D Virtual Tour</span>
            </button>
          </div>

          <div class="lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 gap-2.5">
            <div
              v-for="(img, idx) in property.images.slice(0, 3)"
              :key="idx"
              @click="activeImageIndex = idx"
              :class="[
                'rounded-xl overflow-hidden aspect-[16/10] cursor-pointer relative border-2 transition-all',
                activeImageIndex === idx ? 'border-[#BA0934]' : 'border-transparent opacity-80 hover:opacity-100',
              ]"
            >
              <img :src="img" :alt="property.title" class="w-full h-full object-cover" referrerpolicy="no-referrer" />
            </div>
          </div>
        </div>

        <!-- Two Column Layout: Specs & Story Left vs Reservation Form Right -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <!-- Left Column: Specs, Description, Amenities, Host -->
          <div class="lg:col-span-7 space-y-6">
            <!-- Architectural Dimension Chips -->
            <div class="grid grid-cols-4 gap-3 py-4 border-y border-neutral-200/80 text-center">
              <div class="p-2 bg-neutral-50 rounded-xl">
                <Bed class="w-4 h-4 mx-auto text-[#BA0934] mb-1" />
                <span class="block text-xs font-bold text-neutral-800">{{ property.bedrooms }} Beds</span>
                <span class="text-[10px] text-neutral-400">En-suite</span>
              </div>
              <div class="p-2 bg-neutral-50 rounded-xl">
                <Bath class="w-4 h-4 mx-auto text-[#BA0934] mb-1" />
                <span class="block text-xs font-bold text-neutral-800">{{ property.bathrooms }} Baths</span>
                <span class="text-[10px] text-neutral-400">Travertine</span>
              </div>
              <div class="p-2 bg-neutral-50 rounded-xl">
                <Users class="w-4 h-4 mx-auto text-[#BA0934] mb-1" />
                <span class="block text-xs font-bold text-neutral-800">{{ property.max_guests }} Guests</span>
                <span class="text-[10px] text-neutral-400">Capacity</span>
              </div>
              <div class="p-2 bg-neutral-50 rounded-xl">
                <Maximize2 class="w-4 h-4 mx-auto text-[#BA0934] mb-1" />
                <span class="block text-xs font-bold text-neutral-800">{{ property.sqft }} sq ft</span>
                <span class="text-[10px] text-neutral-400">Indoor/Out</span>
              </div>
            </div>

            <!-- Architectural Narrative -->
            <div>
              <h4 class="text-sm font-bold uppercase tracking-wider text-neutral-900 mb-2">Architectural Concept</h4>
              <p class="text-sm text-neutral-600 leading-relaxed">
                {{ property.description }}
              </p>
            </div>

            <!-- Amenities -->
            <div>
              <h4 class="text-sm font-bold uppercase tracking-wider text-neutral-900 mb-3">Curated Amenities</h4>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div
                  v-for="amenity in property.amenities"
                  :key="amenity"
                  class="flex items-center gap-2 text-xs font-medium text-neutral-700 bg-neutral-50 px-3 py-2 rounded-xl"
                >
                  <CheckCircle2 class="w-3.5 h-3.5 text-[#BA0934] flex-shrink-0" />
                  <span>{{ amenity }}</span>
                </div>
              </div>
            </div>

            <!-- Host Card -->
            <div class="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/60 flex items-center justify-between">
              <div class="flex items-center gap-3">
                <img
                  :src="property.host.avatar"
                  alt="Host"
                  class="w-12 h-12 rounded-full object-cover ring-2 ring-[#BA0934]/30"
                />
                <div>
                  <div class="flex items-center gap-2">
                    <h5 class="text-sm font-bold text-neutral-900">{{ property.host.name }}</h5>
                    <span class="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                      Superhost
                    </span>
                  </div>
                  <p class="text-xs text-neutral-500">Response rate: {{ property.host.response_rate }}</p>
                </div>
              </div>
              <div class="flex items-center gap-1 text-xs text-neutral-500">
                <Shield class="w-4 h-4 text-emerald-600" />
                <span>Identity Verified</span>
              </div>
            </div>
          </div>

          <!-- Right Column: Authoritative Reservation Card -->
          <div class="lg:col-span-5">
            <div class="p-6 rounded-3xl bg-neutral-50 border border-neutral-200/80 shadow-lg space-y-5">
              <div class="flex items-baseline justify-between border-b border-neutral-200 pb-4">
                <div>
                  <span class="text-2xl font-extrabold text-[#1A1A1A]">{{ property.formatted_price }}</span>
                  <span class="text-xs text-neutral-500"> / night</span>
                </div>
                <span class="text-xs font-bold text-[#BA0934] uppercase tracking-wider">PostgreSQL Secured</span>
              </div>

              <!-- Reservation Dates & Guests Form -->
              <div class="space-y-3">
                <div class="grid grid-cols-2 gap-2">
                  <div class="p-3 bg-white rounded-2xl border border-neutral-200">
                    <label class="block text-[10px] font-extrabold uppercase tracking-wider text-neutral-400">Check-In</label>
                    <input
                      v-model="checkIn"
                      type="date"
                      class="w-full text-xs font-semibold text-neutral-900 bg-transparent border-none p-0 focus:outline-none focus:ring-0"
                    />
                  </div>
                  <div class="p-3 bg-white rounded-2xl border border-neutral-200">
                    <label class="block text-[10px] font-extrabold uppercase tracking-wider text-neutral-400">Check-Out</label>
                    <input
                      v-model="checkOut"
                      type="date"
                      class="w-full text-xs font-semibold text-neutral-900 bg-transparent border-none p-0 focus:outline-none focus:ring-0"
                    />
                  </div>
                </div>

                <div class="p-3 bg-white rounded-2xl border border-neutral-200">
                  <label class="block text-[10px] font-extrabold uppercase tracking-wider text-neutral-400">Guests</label>
                  <select
                    v-model="guestsCount"
                    class="w-full text-xs font-semibold text-neutral-900 bg-transparent border-none p-0 focus:outline-none focus:ring-0 cursor-pointer"
                  >
                    <option v-for="n in property.max_guests" :key="n" :value="n">
                      {{ n }} {{ n === 1 ? 'Guest' : 'Guests' }}
                    </option>
                  </select>
                </div>

                <div class="p-3 bg-white rounded-2xl border border-neutral-200">
                  <label class="block text-[10px] font-extrabold uppercase tracking-wider text-neutral-400">Special Concierge Requests</label>
                  <textarea
                    v-model="notes"
                    rows="2"
                    placeholder="Private chauffeur transfer, dietary preferences..."
                    class="w-full text-xs font-medium text-neutral-900 bg-transparent border-none p-0 focus:outline-none focus:ring-0 resize-none placeholder:text-neutral-400"
                  ></textarea>
                </div>
              </div>

              <!-- Live PostgreSQL Availability Status -->
              <div
                v-if="availabilityMessage"
                :class="[
                  'p-3 rounded-2xl text-xs flex items-center gap-2',
                  isAvailable ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200',
                ]"
              >
                <component :is="isAvailable ? CheckCircle2 : AlertCircle" class="w-4 h-4 flex-shrink-0" />
                <span>{{ availabilityMessage }}</span>
              </div>

              <!-- Authoritative Price Breakdown from Laravel -->
              <div v-if="priceBreakdown" class="space-y-2 pt-2 border-t border-neutral-200 text-xs">
                <div class="flex justify-between text-neutral-600">
                  <span>{{ property.formatted_price }} &times; {{ priceBreakdown.nights }} nights</span>
                  <span class="font-medium text-neutral-900">Mex${{ priceBreakdown.subtotal.toLocaleString() }}</span>
                </div>
                <div class="flex justify-between text-neutral-600">
                  <span>Luxe Concierge &amp; Service Fee</span>
                  <span class="font-medium text-neutral-900">Mex${{ priceBreakdown.service_fee.toLocaleString() }}</span>
                </div>
                <div class="flex justify-between pt-2 border-t border-neutral-200 text-sm font-extrabold text-[#1A1A1A]">
                  <span>Total (inc. taxes)</span>
                  <span class="text-[#BA0934]">{{ priceBreakdown.formatted_total }}</span>
                </div>
              </div>

              <!-- Reservation Error Alert -->
              <div v-if="submitError" class="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
                <AlertCircle class="w-4 h-4 flex-shrink-0 mt-0.5" />
                <div>
                  <p class="font-bold">Reservation Conflict</p>
                  <p>{{ submitError }}</p>
                </div>
              </div>

              <!-- Success State -->
              <div v-if="submitSuccess" class="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs space-y-2">
                <div class="flex items-center gap-2 font-bold text-sm">
                  <CheckCircle2 class="w-4 h-4 text-emerald-600" />
                  <span>Reservation Submitted to Host!</span>
                </div>
                <p>
                  Your booking request has been stored in PostgreSQL. Status is currently
                  <span class="font-bold text-amber-700">Pending Confirmation</span>. You can view it in your "My Trips" dashboard or switch to Host mode to approve it!
                </p>
              </div>

              <!-- Submit Reservation Button -->
              <button
                v-if="!submitSuccess"
                @click="handleReserve"
                :disabled="!isAvailable || isCalculating || bookingStore.isLoading"
                :class="[
                  'w-full py-3.5 px-4 rounded-2xl font-bold text-xs uppercase tracking-wider text-white transition-all shadow-md flex items-center justify-center gap-2',
                  isAvailable && !isCalculating
                    ? 'bg-[#BA0934] hover:bg-[#960729] cursor-pointer'
                    : 'bg-neutral-300 cursor-not-allowed',
                ]"
              >
                <Lock class="w-4 h-4" />
                <span>{{ isCalculating ? 'Calculating Rates...' : isAvailable ? 'Reserve Sanctuary' : 'Dates Unavailable' }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
