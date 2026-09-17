<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useBookingStore } from '../stores/bookings';
import { usePropertyStore, type PropertyItem } from '../stores/properties';
import { useAuthStore } from '../stores/auth';
import {
  Shield,
  DollarSign,
  TrendingUp,
  Clock,
  Home,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Eye,
  Calendar,
  ToggleLeft,
  ToggleRight,
  Sparkles,
  Box,
} from 'lucide-vue-next';

const bookingStore = useBookingStore();
const propertyStore = usePropertyStore();
const authStore = useAuthStore();

const activeTab = ref<'approvals' | 'listings' | 'all-bookings'>('approvals');
const notification = ref<{ message: string; type: 'success' | 'error' } | null>(null);

const setNotification = (message: string, type: 'success' | 'error' = 'success') => {
  notification.value = { message, type };
  setTimeout(() => {
    notification.value = null;
  }, 4000);
};

onMounted(async () => {
  await Promise.all([
    bookingStore.fetchHostDashboard(),
    propertyStore.fetchProperties(),
  ]);
});

const handleApprove = async (bookingId: number) => {
  try {
    const res = await bookingStore.approveBooking(bookingId);
    setNotification(res.message || 'Booking approved! Revenue updated.');
  } catch (err: any) {
    setNotification(err.message || 'Failed to approve booking', 'error');
  }
};

const handleDecline = async (bookingId: number) => {
  try {
    const res = await bookingStore.declineBooking(bookingId);
    setNotification(res.message || 'Booking declined.');
  } catch (err: any) {
    setNotification(err.message || 'Failed to decline booking', 'error');
  }
};

const handleToggleAvailability = async (property: PropertyItem) => {
  try {
    const newStatus = !property.is_available;
    await bookingStore.toggleAvailability(property.id, newStatus);
    property.is_available = newStatus;
    setNotification(
      `Property "${property.title}" is now ${newStatus ? 'Available for booking' : 'Blocked / Unavailable'}.`
    );
  } catch (err: any) {
    setNotification(err.message || 'Failed to toggle status', 'error');
  }
};
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200/80 pb-6">
      <div>
        <div class="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-neutral-900 text-white text-xs font-semibold mb-2">
          <Shield class="w-3.5 h-3.5 text-[#BA0934]" />
          <span>Host Operations &amp; Yield Management</span>
        </div>
        <h1 class="text-3xl font-extrabold tracking-tight text-[#1A1A1A]">Host Portfolio Command</h1>
        <p class="text-sm text-neutral-500 mt-1">
          Authoritative PostgreSQL reservations, live revenue accounting, and instantaneous guest approval workflow.
        </p>
      </div>

      <!-- Quick Role Info -->
      <div class="flex items-center gap-3 p-2 bg-white rounded-2xl border border-neutral-200 shadow-sm">
        <img
          :src="authStore.user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'"
          alt="Host avatar"
          class="w-10 h-10 rounded-xl object-cover ring-2 ring-[#BA0934]/40"
        />
        <div class="text-xs">
          <p class="font-bold text-neutral-900">{{ authStore.user?.name || 'Alex Montgomery' }}</p>
          <p class="text-neutral-500">Superhost &bull; 99% Response</p>
        </div>
      </div>
    </div>

    <!-- Live Toast Notification Banner -->
    <div
      v-if="notification"
      :class="[
        'p-4 rounded-2xl text-xs font-bold flex items-center gap-3 shadow-lg border animate-in fade-in slide-in-from-top-3',
        notification.type === 'success'
          ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
          : 'bg-rose-50 text-rose-900 border-rose-200',
      ]"
    >
      <component :is="notification.type === 'success' ? CheckCircle2 : AlertCircle" class="w-5 h-5 flex-shrink-0" />
      <span>{{ notification.message }}</span>
    </div>

    <!-- PostgreSQL Metric Cards Row -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <!-- Total Revenue -->
      <div class="p-6 rounded-3xl bg-white border border-neutral-200/80 shadow-sm space-y-2">
        <div class="flex items-center justify-between text-neutral-400">
          <span class="text-xs font-bold uppercase tracking-wider">Gross Realized Revenue</span>
          <div class="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <DollarSign class="w-4 h-4" />
          </div>
        </div>
        <p class="text-2xl font-extrabold text-[#1A1A1A]">
          {{ bookingStore.hostMetrics.formatted_revenue }}
        </p>
        <p class="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
          <TrendingUp class="w-3.5 h-3.5" />
          <span>Sum of approved reservations</span>
        </p>
      </div>

      <!-- Pending Requests -->
      <div class="p-6 rounded-3xl bg-white border border-neutral-200/80 shadow-sm space-y-2">
        <div class="flex items-center justify-between text-neutral-400">
          <span class="text-xs font-bold uppercase tracking-wider">Pending Approvals</span>
          <div class="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock class="w-4 h-4" />
          </div>
        </div>
        <p class="text-2xl font-extrabold text-[#1A1A1A]">
          {{ bookingStore.pendingHostBookings.length }}
        </p>
        <p class="text-[11px] text-amber-600 font-medium">
          Awaiting host signature &bull; locks dates upon approval
        </p>
      </div>

      <!-- Occupancy Rate -->
      <div class="p-6 rounded-3xl bg-white border border-neutral-200/80 shadow-sm space-y-2">
        <div class="flex items-center justify-between text-neutral-400">
          <span class="text-xs font-bold uppercase tracking-wider">Portfolio Occupancy</span>
          <div class="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <TrendingUp class="w-4 h-4" />
          </div>
        </div>
        <p class="text-2xl font-extrabold text-[#1A1A1A]">
          {{ bookingStore.hostMetrics.occupancy_rate }}%
        </p>
        <p class="text-[11px] text-neutral-500 font-medium">
          Average booked nights ratio
        </p>
      </div>

      <!-- 3D Spatial Impressions -->
      <div class="p-6 rounded-3xl bg-white border border-neutral-200/80 shadow-sm space-y-2">
        <div class="flex items-center justify-between text-neutral-400">
          <span class="text-xs font-bold uppercase tracking-wider">3D Spatial Views</span>
          <div class="w-8 h-8 rounded-xl bg-rose-50 text-[#BA0934] flex items-center justify-center">
            <Box class="w-4 h-4" />
          </div>
        </div>
        <p class="text-2xl font-extrabold text-[#1A1A1A]">
          {{ bookingStore.hostMetrics.tour_views.toLocaleString() }}
        </p>
        <p class="text-[11px] text-[#BA0934] font-medium">
          Interactive Three.js tour sessions
        </p>
      </div>
    </div>

    <!-- Navigation Tabs for Host Management -->
    <div class="flex items-center gap-2 border-b border-neutral-200">
      <button
        @click="activeTab = 'approvals'"
        :class="[
          'pb-3 px-4 text-xs font-bold transition-colors border-b-2 flex items-center gap-2',
          activeTab === 'approvals'
            ? 'border-[#BA0934] text-[#BA0934]'
            : 'border-transparent text-neutral-500 hover:text-neutral-900',
        ]"
      >
        <span>Pending Approvals</span>
        <span
          v-if="bookingStore.pendingHostBookings.length > 0"
          class="w-5 h-5 rounded-full bg-[#BA0934] text-white text-[10px] flex items-center justify-center font-extrabold"
        >
          {{ bookingStore.pendingHostBookings.length }}
        </span>
      </button>

      <button
        @click="activeTab = 'listings'"
        :class="[
          'pb-3 px-4 text-xs font-bold transition-colors border-b-2 flex items-center gap-2',
          activeTab === 'listings'
            ? 'border-[#BA0934] text-[#BA0934]'
            : 'border-transparent text-neutral-500 hover:text-neutral-900',
        ]"
      >
        <span>Sanctuary Listings &amp; Availability</span>
        <span class="text-neutral-400 text-xs">({{ propertyStore.properties.length }})</span>
      </button>

      <button
        @click="activeTab = 'all-bookings'"
        :class="[
          'pb-3 px-4 text-xs font-bold transition-colors border-b-2 flex items-center gap-2',
          activeTab === 'all-bookings'
            ? 'border-[#BA0934] text-[#BA0934]'
            : 'border-transparent text-neutral-500 hover:text-neutral-900',
        ]"
      >
        <span>Historical Ledger</span>
        <span class="text-neutral-400 text-xs">({{ bookingStore.hostBookings.length }})</span>
      </button>
    </div>

    <!-- Tab 1: Pending Approvals Queue -->
    <div v-if="activeTab === 'approvals'" class="space-y-4">
      <div v-if="bookingStore.pendingHostBookings.length === 0" class="p-12 rounded-3xl bg-white border border-neutral-200 text-center space-y-3">
        <CheckCircle2 class="w-10 h-10 text-emerald-500 mx-auto" />
        <h3 class="text-base font-bold text-neutral-900">All Inquiries Reconciled</h3>
        <p class="text-xs text-neutral-500 max-w-sm mx-auto">
          There are no pending reservations waiting for review. You can simulate a guest reservation from the Explore view to test concurrency and approvals.
        </p>
      </div>

      <div
        v-for="booking in bookingStore.pendingHostBookings"
        :key="booking.id"
        class="rounded-3xl bg-white border border-neutral-200/80 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col lg:flex-row lg:items-center justify-between gap-6"
      >
        <div class="flex items-start gap-4">
          <img
            :src="booking.guest?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'"
            alt="Guest"
            class="w-12 h-12 rounded-2xl object-cover ring-2 ring-neutral-200"
          />
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <h4 class="text-sm font-bold text-neutral-900">{{ booking.guest?.name || 'Marcus Vance' }}</h4>
              <span class="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-100 text-amber-800">
                Pending Approval
              </span>
            </div>
            <p class="text-xs text-neutral-500">Requested property: <strong class="text-neutral-800">{{ booking.property?.title }}</strong></p>
            <div class="flex items-center gap-3 text-xs text-neutral-600 font-medium">
              <span>{{ booking.check_in }} &rarr; {{ booking.check_out }}</span>
              <span>&bull;</span>
              <span>{{ booking.nights }} Nights</span>
              <span>&bull;</span>
              <span>{{ booking.guests_count }} Guests</span>
            </div>
            <p v-if="booking.notes" class="text-xs italic text-neutral-500 pt-1">
              "{{ booking.notes }}"
            </p>
          </div>
        </div>

        <!-- Price & Approval Buttons -->
        <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4 lg:self-center">
          <div class="text-left sm:text-right">
            <p class="text-lg font-extrabold text-[#1A1A1A]">{{ booking.formatted_total }}</p>
            <p class="text-[10px] text-neutral-400">Total Yield</p>
          </div>

          <div class="flex items-center gap-2">
            <!-- Decline Button -->
            <button
              @click="handleDecline(booking.id)"
              :disabled="bookingStore.actionLoading === booking.id"
              class="px-4 py-2 rounded-xl border border-neutral-300 hover:bg-neutral-100 text-neutral-700 text-xs font-bold transition-colors cursor-pointer"
            >
              Decline
            </button>

            <!-- Approve Button -->
            <button
              @click="handleApprove(booking.id)"
              :disabled="bookingStore.actionLoading === booking.id"
              class="px-5 py-2 rounded-xl bg-[#BA0934] hover:bg-[#960729] text-white text-xs font-bold transition-colors shadow-sm cursor-pointer flex items-center gap-1.5"
            >
              <CheckCircle2 class="w-3.5 h-3.5" />
              <span>{{ bookingStore.actionLoading === booking.id ? 'Securing...' : 'Approve & Lock' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Tab 2: Sanctuary Listings & Availability Control -->
    <div v-if="activeTab === 'listings'" class="space-y-4">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse bg-white rounded-3xl border border-neutral-200/80 overflow-hidden shadow-sm">
          <thead>
            <tr class="bg-neutral-50 border-b border-neutral-200 text-[11px] font-extrabold uppercase tracking-wider text-neutral-400">
              <th class="py-3.5 px-6">Sanctuary</th>
              <th class="py-3.5 px-6">Style / Location</th>
              <th class="py-3.5 px-6">Base Rate</th>
              <th class="py-3.5 px-6">3D Tour</th>
              <th class="py-3.5 px-6">Status / Availability</th>
              <th class="py-3.5 px-6 text-right">Toggle</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-neutral-100 text-xs">
            <tr
              v-for="prop in propertyStore.properties"
              :key="prop.id"
              class="hover:bg-neutral-50/60 transition-colors"
            >
              <td class="py-4 px-6">
                <div class="flex items-center gap-3">
                  <img
                    :src="prop.images[0]"
                    :alt="prop.title"
                    class="w-12 h-12 rounded-xl object-cover"
                  />
                  <div>
                    <h5 class="font-bold text-neutral-900">{{ prop.title }}</h5>
                    <p class="text-[11px] text-neutral-500">{{ prop.bedrooms }} Beds &bull; {{ prop.bathrooms }} Baths</p>
                  </div>
                </div>
              </td>
              <td class="py-4 px-6">
                <p class="font-semibold text-neutral-800">{{ prop.architectural_style }}</p>
                <p class="text-[11px] text-neutral-500">{{ prop.location }}</p>
              </td>
              <td class="py-4 px-6 font-bold text-neutral-900">
                {{ prop.formatted_price }}
              </td>
              <td class="py-4 px-6">
                <span
                  v-if="prop.has_3d_tour"
                  class="inline-flex items-center gap-1 text-[10px] font-bold text-[#BA0934] uppercase bg-[#BA0934]/10 px-2 py-0.5 rounded-full"
                >
                  <Box class="w-3 h-3" />
                  Active 3D
                </span>
                <span v-else class="text-neutral-400">&mdash;</span>
              </td>
              <td class="py-4 px-6">
                <span
                  :class="[
                    'px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase',
                    prop.is_available
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800',
                  ]"
                >
                  {{ prop.is_available ? 'Available' : 'Blocked' }}
                </span>
              </td>
              <td class="py-4 px-6 text-right">
                <button
                  @click="handleToggleAvailability(prop)"
                  class="px-3.5 py-1.5 rounded-xl border border-neutral-200 hover:border-neutral-400 text-xs font-semibold text-neutral-700 hover:text-neutral-900 transition-colors"
                >
                  {{ prop.is_available ? 'Block Dates' : 'Re-open Villa' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Tab 3: Historical Ledger -->
    <div v-if="activeTab === 'all-bookings'" class="space-y-4">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse bg-white rounded-3xl border border-neutral-200/80 overflow-hidden shadow-sm">
          <thead>
            <tr class="bg-neutral-50 border-b border-neutral-200 text-[11px] font-extrabold uppercase tracking-wider text-neutral-400">
              <th class="py-3.5 px-6">Booking ID</th>
              <th class="py-3.5 px-6">Guest</th>
              <th class="py-3.5 px-6">Property</th>
              <th class="py-3.5 px-6">Dates</th>
              <th class="py-3.5 px-6">Total Yield</th>
              <th class="py-3.5 px-6">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-neutral-100 text-xs">
            <tr
              v-for="b in bookingStore.hostBookings"
              :key="b.id"
              class="hover:bg-neutral-50/60 transition-colors"
            >
              <td class="py-4 px-6 font-mono text-neutral-500">#RES-{{ b.id }}</td>
              <td class="py-4 px-6 font-bold text-neutral-900">{{ b.guest?.name || 'Guest' }}</td>
              <td class="py-4 px-6 text-neutral-800">{{ b.property?.title }}</td>
              <td class="py-4 px-6 text-neutral-600">{{ b.check_in }} &rarr; {{ b.check_out }} ({{ b.nights }}n)</td>
              <td class="py-4 px-6 font-extrabold text-neutral-900">{{ b.formatted_total }}</td>
              <td class="py-4 px-6">
                <span
                  :class="[
                    'px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase',
                    b.status === 'approved'
                      ? 'bg-emerald-100 text-emerald-800'
                      : b.status === 'pending'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800',
                  ]"
                >
                  {{ b.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
