<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useBookingStore, type BookingItem } from '../stores/bookings';
import { useAuthStore } from '../stores/auth';
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  MapPin,
  Send,
  Sparkles,
  Shield,
  Box,
  ChevronRight,
} from 'lucide-vue-next';

const emit = defineEmits<{
  (e: 'explore'): void;
  (e: 'open3d', property: any): void;
}>();

const bookingStore = useBookingStore();
const authStore = useAuthStore();

// Concierge chat state
const messages = ref([
  {
    id: 1,
    sender: 'concierge',
    name: 'Laurent &bull; Head Concierge',
    text: 'Good day! Welcome to LuxeStay. I am on standby to arrange helicopter transfers, private yacht charters, or customized in-villa dining during your stay.',
    time: '10:00 AM',
  },
]);
const inputMessage = ref('');

const sendMessage = () => {
  if (!inputMessage.value.trim()) return;
  const userText = inputMessage.value.trim();
  messages.value.push({
    id: Date.now(),
    sender: 'user',
    name: authStore.user?.name || 'You',
    text: userText,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  });
  inputMessage.value = '';

  // Auto concierge response
  setTimeout(() => {
    messages.value.push({
      id: Date.now() + 1,
      sender: 'concierge',
      name: 'Laurent &bull; Head Concierge',
      text: `Certainly! I have noted your request: "${userText}". Our local estate team in Lake Como and Malibu will coordinate with the property host to have everything prepared prior to your arrival.`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });
  }, 1000);
};

onMounted(async () => {
  await bookingStore.fetchGuestBookings();
});
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
    <!-- Header Row -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200/80 pb-6">
      <div>
        <div class="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-700 text-xs font-semibold mb-2">
          <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>PostgreSQL Live Reservation Registry</span>
        </div>
        <h1 class="text-3xl font-extrabold tracking-tight text-[#1A1A1A]">My Luxury Itineraries</h1>
        <p class="text-sm text-neutral-500 mt-1">
          Review your upcoming sanctuary stays, verify dates, or converse directly with the estate concierge.
        </p>
      </div>

      <button
        @click="emit('explore')"
        class="px-5 py-2.5 rounded-2xl bg-[#1A1A1A] hover:bg-[#BA0934] text-white text-xs font-bold transition-colors shadow-sm self-start sm:self-auto flex items-center gap-2"
      >
        <span>Discover More Villas</span>
        <ChevronRight class="w-3.5 h-3.5" />
      </button>
    </div>

    <!-- Main Grid: Reservations Left + Concierge Chat Right -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <!-- Reservations List (8 Cols) -->
      <div class="lg:col-span-8 space-y-6">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-bold text-[#1A1A1A]">Active &amp; Pending Reservations</h2>
          <span class="text-xs font-semibold text-neutral-400">
            {{ bookingStore.bookings.length }} Stays on Record
          </span>
        </div>

        <div v-if="bookingStore.isLoading" class="p-12 text-center text-neutral-400">
          <p class="text-xs font-semibold animate-pulse">Loading reservations from PostgreSQL...</p>
        </div>

        <div v-else-if="bookingStore.bookings.length === 0" class="p-12 rounded-3xl bg-white border border-neutral-200/80 text-center space-y-4">
          <Calendar class="w-10 h-10 text-neutral-300 mx-auto" />
          <div>
            <h3 class="text-base font-bold text-neutral-900">No Reservations Yet</h3>
            <p class="text-xs text-neutral-500 max-w-sm mx-auto mt-1">
              Select an architectural villa from the explore gallery, review its 3D spatial tour, and reserve your sanctuary.
            </p>
          </div>
          <button
            @click="emit('explore')"
            class="px-5 py-2.5 rounded-2xl bg-[#BA0934] text-white text-xs font-bold shadow hover:bg-[#960729] transition-colors"
          >
            Explore Villas Now
          </button>
        </div>

        <!-- Bookings Cards -->
        <div v-else class="space-y-4">
          <div
            v-for="booking in bookingStore.bookings"
            :key="booking.id"
            class="rounded-3xl bg-white border border-neutral-200/80 p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between"
          >
            <!-- Property Thumbnail & Info -->
            <div class="flex items-start gap-4">
              <div class="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-neutral-100 overflow-hidden flex-shrink-0 relative">
                <img
                  :src="booking.property?.image || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80'"
                  :alt="booking.property?.title"
                  class="w-full h-full object-cover"
                />
                <span
                  v-if="booking.property?.has_3d_tour"
                  class="absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase bg-black/70 text-white"
                >
                  3D
                </span>
              </div>

              <div class="space-y-1">
                <!-- Status Badge -->
                <div class="flex items-center gap-2">
                  <span
                    :class="[
                      'px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1',
                      booking.status === 'approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : booking.status === 'pending'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800',
                    ]"
                  >
                    <component
                      :is="booking.status === 'approved' ? CheckCircle2 : booking.status === 'pending' ? Clock : XCircle"
                      class="w-3 h-3"
                    />
                    <span>{{ booking.status === 'approved' ? 'Host Confirmed' : booking.status === 'pending' ? 'Pending Host Review' : booking.status }}</span>
                  </span>

                  <span class="text-xs text-neutral-400">#RES-{{ booking.id }}</span>
                </div>

                <h3 class="text-base font-bold text-[#1A1A1A]">{{ booking.property?.title }}</h3>
                <div class="flex items-center gap-1.5 text-xs text-neutral-500">
                  <MapPin class="w-3.5 h-3.5 text-[#BA0934]" />
                  <span>{{ booking.property?.location }}</span>
                </div>

                <div class="flex items-center gap-3 text-xs text-neutral-600 pt-1 font-medium">
                  <span>{{ booking.check_in }} &rarr; {{ booking.check_out }}</span>
                  <span>&bull;</span>
                  <span>{{ booking.nights }} Nights</span>
                  <span>&bull;</span>
                  <span>{{ booking.guests_count }} Guests</span>
                </div>
              </div>
            </div>

            <!-- Price & Actions Right -->
            <div class="sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0 w-full sm:w-auto flex sm:flex-col items-center sm:items-end justify-between gap-2">
              <div>
                <span class="text-lg font-extrabold text-[#1A1A1A]">{{ booking.formatted_total }}</span>
                <p class="text-[10px] text-neutral-400">Total Charged</p>
              </div>

              <div class="flex items-center gap-2">
                <button
                  v-if="booking.property?.has_3d_tour"
                  @click="emit('open3d', booking.property)"
                  class="px-3 py-1.5 rounded-xl border border-neutral-200 hover:border-neutral-400 text-xs font-semibold text-neutral-700 hover:text-neutral-900 transition-colors flex items-center gap-1"
                >
                  <Box class="w-3.5 h-3.5 text-[#BA0934]" />
                  <span>3D Model</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Luxury Concierge Panel (4 Cols) -->
      <div class="lg:col-span-4 rounded-3xl bg-white border border-neutral-200/80 p-5 shadow-sm space-y-4">
        <div class="flex items-center gap-3 border-b border-neutral-100 pb-3">
          <div class="w-10 h-10 rounded-2xl bg-neutral-900 text-white flex items-center justify-center">
            <Sparkles class="w-5 h-5 text-[#BA0934]" />
          </div>
          <div>
            <h3 class="text-sm font-bold text-[#1A1A1A]">Private Estate Concierge</h3>
            <p class="text-[11px] text-emerald-600 font-semibold">Active &bull; Dedicated 24/7 Desk</p>
          </div>
        </div>

        <!-- Chat History -->
        <div class="space-y-3 h-72 overflow-y-auto pr-1 text-xs">
          <div
            v-for="msg in messages"
            :key="msg.id"
            :class="[
              'p-3 rounded-2xl space-y-1',
              msg.sender === 'concierge'
                ? 'bg-neutral-50 border border-neutral-100 text-neutral-800'
                : 'bg-[#1A1A1A] text-white ml-6',
            ]"
          >
            <div class="flex items-center justify-between text-[10px]" :class="msg.sender === 'concierge' ? 'text-neutral-400' : 'text-neutral-300'">
              <span class="font-bold">{{ msg.name }}</span>
              <span>{{ msg.time }}</span>
            </div>
            <p class="leading-relaxed">{{ msg.text }}</p>
          </div>
        </div>

        <!-- Message Input -->
        <div class="pt-2 border-t border-neutral-100 flex items-center gap-2">
          <input
            v-model="inputMessage"
            @keyup.enter="sendMessage"
            type="text"
            placeholder="Request villa provisioning, chef, car..."
            class="flex-1 text-xs bg-neutral-50 rounded-xl px-3.5 py-2.5 border border-neutral-200 focus:outline-none focus:border-[#BA0934]"
          />
          <button
            @click="sendMessage"
            class="p-2.5 rounded-xl bg-[#BA0934] hover:bg-[#960729] text-white transition-colors"
          >
            <Send class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
