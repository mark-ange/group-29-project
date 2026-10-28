import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { api } from '../services/api';

export interface BookingItem {
  id: number;
  user_id: number;
  property_id: number;
  check_in: string;
  check_out: string;
  nights: number;
  nightly_rate: number;
  service_fee: number;
  total_price: number;
  formatted_total: string;
  guests_count: number;
  status: 'pending' | 'approved' | 'declined' | 'cancelled';
  notes?: string;
  created_at: string;
  guest?: {
    id: number;
    name: string;
    email: string;
    avatar?: string;
  };
  property?: {
    id: number;
    slug: string;
    title: string;
    location: string;
    architectural_style: string;
    image?: string;
    has_3d_tour: boolean;
    is_available: boolean;
  };
}

export interface HostMetrics {
  total_revenue: number;
  formatted_revenue: string;
  active_listings: number;
  total_listings: number;
  pending_bookings: number;
  approved_bookings: number;
  declined_bookings: number;
  total_bookings: number;
  occupancy_rate: number;
  tour_views: number;
}

export const useBookingStore = defineStore('bookings', () => {
  const bookings = ref<BookingItem[]>([]);
  const hostBookings = ref<BookingItem[]>([]);
  const hostMetrics = ref<HostMetrics>({
    total_revenue: 0,
    formatted_revenue: 'Mex$0.00',
    active_listings: 6,
    total_listings: 6,
    pending_bookings: 0,
    approved_bookings: 0,
    declined_bookings: 0,
    total_bookings: 0,
    occupancy_rate: 88.4,
    tour_views: 8402,
  });

  const isLoading = ref<boolean>(false);
  const actionLoading = ref<number | null>(null);
  const error = ref<string | null>(null);
  const lastSuccessMessage = ref<string | null>(null);

  const pendingHostBookings = computed(() => {
    return hostBookings.value.filter((b) => b.status === 'pending');
  });

  const approvedHostBookings = computed(() => {
    return hostBookings.value.filter((b) => b.status === 'approved');
  });

  async function fetchGuestBookings() {
    isLoading.value = true;
    error.value = null;
    try {
      const res = await api.getBookings();
      if (res.success && res.data) {
        bookings.value = res.data;
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch bookings';
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchHostDashboard() {
    isLoading.value = true;
    error.value = null;
    try {
      const res = await api.getHostDashboard();
      if (res.success && res.data) {
        hostMetrics.value = res.data.metrics;
        hostBookings.value = res.data.bookings;
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch host dashboard';
    } finally {
      isLoading.value = false;
    }
  }

  async function createReservation(payload: {
    property_id: number;
    check_in: string;
    check_out: string;
    guests_count?: number;
    notes?: string;
    instant_approval?: boolean;
  }) {
    isLoading.value = true;
    error.value = null;
    try {
      const res = await api.createBooking(payload);
      if (res.success) {
        lastSuccessMessage.value = res.message || 'Reservation submitted!';
        // Refresh bookings and host dashboard
        await fetchGuestBookings();
        return res.data;
      }
    } catch (err: any) {
      error.value = err.message || 'Unable to complete reservation request';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function selfApproveBooking(bookingId: number) {
    actionLoading.value = bookingId;
    error.value = null;
    try {
      const res = await api.selfApproveBooking(bookingId);
      if (res.success) {
        lastSuccessMessage.value = res.message;
        const gIdx = bookings.value.findIndex((b) => b.id === bookingId);
        if (gIdx !== -1) {
          bookings.value[gIdx].status = 'approved';
        }
        const hIdx = hostBookings.value.findIndex((b) => b.id === bookingId);
        if (hIdx !== -1) {
          hostBookings.value[hIdx].status = 'approved';
        }
        return res.data;
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to self-approve reservation';
      throw err;
    } finally {
      actionLoading.value = null;
    }
  }

  async function cancelReservation(bookingId: number) {
    actionLoading.value = bookingId;
    error.value = null;
    try {
      const res = await api.cancelBooking(bookingId);
      if (res.success) {
        lastSuccessMessage.value = res.message;
        const gIdx = bookings.value.findIndex((b) => b.id === bookingId);
        if (gIdx !== -1) {
          bookings.value[gIdx].status = 'cancelled';
        }
        const hIdx = hostBookings.value.findIndex((b) => b.id === bookingId);
        if (hIdx !== -1) {
          hostBookings.value[hIdx].status = 'cancelled';
        }
        return res.data;
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to cancel reservation';
      throw err;
    } finally {
      actionLoading.value = null;
    }
  }

  async function approveBooking(bookingId: number) {
    actionLoading.value = bookingId;
    error.value = null;
    try {
      const res = await api.approveBooking(bookingId);
      if (res.success) {
        lastSuccessMessage.value = res.message;
        // Update booking in local list
        const idx = hostBookings.value.findIndex((b) => b.id === bookingId);
        if (idx !== -1) {
          hostBookings.value[idx].status = 'approved';
        }
        if (res.data?.metrics) {
          hostMetrics.value = res.data.metrics;
        }
        return res.data;
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to approve booking';
      throw err;
    } finally {
      actionLoading.value = null;
    }
  }

  async function declineBooking(bookingId: number) {
    actionLoading.value = bookingId;
    error.value = null;
    try {
      const res = await api.declineBooking(bookingId);
      if (res.success) {
        lastSuccessMessage.value = res.message;
        const idx = hostBookings.value.findIndex((b) => b.id === bookingId);
        if (idx !== -1) {
          hostBookings.value[idx].status = 'declined';
        }
        if (res.data?.metrics) {
          hostMetrics.value = res.data.metrics;
        }
        return res.data;
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to decline booking';
      throw err;
    } finally {
      actionLoading.value = null;
    }
  }

  async function toggleAvailability(propertyId: number, isAvailable?: boolean) {
    try {
      const res = await api.togglePropertyAvailability(propertyId, isAvailable);
      return res.data;
    } catch (err: any) {
      error.value = err.message || 'Failed to update property status';
      throw err;
    }
  }

  return {
    bookings,
    hostBookings,
    hostMetrics,
    isLoading,
    actionLoading,
    error,
    lastSuccessMessage,
    pendingHostBookings,
    approvedHostBookings,
    fetchGuestBookings,
    fetchHostDashboard,
    createReservation,
    selfApproveBooking,
    cancelReservation,
    approveBooking,
    declineBooking,
    toggleAvailability,
  };
});
