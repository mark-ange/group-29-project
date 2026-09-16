/**
 * LuxeStay API Client connecting Vue 3 to Laravel Backend & PostgreSQL
 */

const API_BASE = '/api';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('luxestay_token');
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...getAuthHeader(),
    ...options.headers,
  };

  const res = await fetch(url, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const errorMsg =
      data.message ||
      (data.errors ? Object.values(data.errors).flat().join(', ') : 'Request failed');
    const error = new Error(errorMsg) as any;
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  // Health & System
  getHealth: () => request<{ status: string; app: string; database: string; backend: string }>('/health'),

  // Auth
  register: (payload: { name: string; email: string; password: string; role?: string }) =>
    request<{ success: boolean; data: { user: any; token: string }; message: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  login: (payload: { email: string; password: string }) =>
    request<{ success: boolean; data: { user: any; token: string }; message: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  logout: () =>
    request<{ success: boolean; message: string }>('/auth/logout', {
      method: 'POST',
    }),

  getMe: () =>
    request<{ success: boolean; data: any }>('/auth/me'),

  // Properties
  getProperties: (params: Record<string, any> = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') {
        query.append(k, String(v));
      }
    });
    const qs = query.toString();
    return request<{ success: boolean; data: any[] }>(`/properties${qs ? `?${qs}` : ''}`);
  },

  getProperty: (slugOrId: string | number) =>
    request<{ success: boolean; data: any }>(`/properties/${slugOrId}`),

  createProperty: (payload: Record<string, unknown>) =>
    request<{ success: boolean; data: any; message: string }>('/properties', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  calculatePrice: (slugOrId: string | number, checkIn: string, checkOut: string) =>
    request<{ success: boolean; data: any }>(`/properties/${slugOrId}/calculate-price`, {
      method: 'POST',
      body: JSON.stringify({ check_in: checkIn, check_out: checkOut }),
    }),

  checkAvailability: (slugOrId: string | number, checkIn: string, checkOut: string) =>
    request<{ success: boolean; data: { property_id: number; is_available: boolean; message: string } }>(
      `/properties/${slugOrId}/check-availability?check_in=${encodeURIComponent(checkIn)}&check_out=${encodeURIComponent(checkOut)}`
    ),

  // Bookings (Guest)
  getBookings: () =>
    request<{ success: boolean; data: any[] }>('/bookings'),

  createBooking: (payload: {
    property_id: number;
    check_in: string;
    check_out: string;
    guests_count?: number;
    notes?: string;
  }) =>
    request<{ success: boolean; message: string; data: any }>('/bookings', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  cancelBooking: (bookingId: number) =>
    request<{ success: boolean; message: string; data: any }>(`/bookings/${bookingId}/cancel`, {
      method: 'POST',
    }),

  // Host Operations
  getHostDashboard: () =>
    request<{
      success: boolean;
      data: {
        metrics: {
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
        };
        bookings: any[];
        properties: any[];
        host: any;
      };
    }>('/host/dashboard'),

  approveBooking: (bookingId: number) =>
    request<{ success: boolean; message: string; data: { booking: any; metrics: any } }>(
      `/host/bookings/${bookingId}/approve`,
      { method: 'POST' }
    ),

  declineBooking: (bookingId: number) =>
    request<{ success: boolean; message: string; data: { booking: any; metrics: any } }>(
      `/host/bookings/${bookingId}/decline`,
      { method: 'POST' }
    ),

  togglePropertyAvailability: (propertyId: number, isAvailable?: boolean) =>
    request<{ success: boolean; message: string; data: any }>(
      `/host/properties/${propertyId}/toggle-availability`,
      {
        method: 'POST',
        body: JSON.stringify(isAvailable !== undefined ? { is_available: isAvailable } : {}),
      }
    ),
};
