import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { api } from '../services/api';

export interface PropertyItem {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  location: string;
  country: string;
  category: string;
  architectural_style: string;
  designer?: string;
  lat?: number;
  lng?: number;
  price_per_night: number;
  formatted_price: string;
  rating: number;
  reviews_count: number;
  bedrooms: number;
  bathrooms: number;
  max_guests: number;
  sqft: number;
  has_3d_tour: boolean;
  is_available: boolean;
  description: string;
  images: string[];
  amenities: string[];
  virtual_tour_rooms?: any[];
  sleeping_arrangements?: { room: string; bed_type: string; bath: string }[];
  review_ratings?: {
    cleanliness: number;
    accuracy: number;
    communication: number;
    location: number;
    check_in: number;
    value: number;
  };
  featured_reviews?: {
    author: string;
    avatar: string;
    date: string;
    comment: string;
    rating: number;
  }[];
  trip_designer?: {
    name: string;
    avatar: string;
    role: string;
    intro: string;
  };
  host: {
    name: string;
    avatar: string;
    response_rate: string;
    is_superhost: boolean;
  };
}

export const usePropertyStore = defineStore('properties', () => {
  const properties = ref<PropertyItem[]>([]);
  const selectedProperty = ref<PropertyItem | null>(null);
  const hoveredPropertyId = ref<number | null>(null);
  const activeCategory = ref<string>('all');
  const only3D = ref<boolean>(false);
  const searchQuery = ref<string>('');
  const minPrice = ref<number | null>(null);
  const maxPrice = ref<number | null>(null);
  const bedroomsFilter = ref<string | number>('any');
  const isLoading = ref<boolean>(false);
  const error = ref<string | null>(null);

  // Airbnb Luxe signature features
  const showMap = ref<boolean>(false);
  const displayTotal = ref<boolean>(false);
  const isTripDesignerOpen = ref<boolean>(false);
  const wishlist = ref<number[]>([1, 3]); // default favorite ids

  const filteredProperties = computed(() => {
    return properties.value.filter((p) => {
      // Category filter
      if (activeCategory.value !== 'all' && activeCategory.value !== 'trending') {
        if (activeCategory.value === '3d-tours') {
          if (!p.has_3d_tour) return false;
        } else if (p.category !== activeCategory.value) {
          return false;
        }
      }

      // 3D only filter
      if (only3D.value && !p.has_3d_tour) {
        return false;
      }

      // Search query
      if (searchQuery.value.trim()) {
        const q = searchQuery.value.toLowerCase();
        const matchTitle = p.title.toLowerCase().includes(q);
        const matchLoc = p.location.toLowerCase().includes(q);
        const matchCountry = p.country.toLowerCase().includes(q);
        const matchArch = p.architectural_style.toLowerCase().includes(q);
        const matchDesigner = p.designer ? p.designer.toLowerCase().includes(q) : false;
        if (!matchTitle && !matchLoc && !matchCountry && !matchArch && !matchDesigner) return false;
      }

      // Price filter
      if (minPrice.value !== null && p.price_per_night < minPrice.value) return false;
      if (maxPrice.value !== null && p.price_per_night > maxPrice.value) return false;

      // Bedrooms filter
      if (bedroomsFilter.value !== 'any' && p.bedrooms < Number(bedroomsFilter.value)) return false;

      return true;
    });
  });

  function isWishlisted(id: number): boolean {
    return wishlist.value.includes(id);
  }

  function toggleWishlist(id: number) {
    if (wishlist.value.includes(id)) {
      wishlist.value = wishlist.value.filter((itemId) => itemId !== id);
    } else {
      wishlist.value.push(id);
    }
  }

  function toggleMap() {
    showMap.value = !showMap.value;
  }

  function toggleDisplayTotal() {
    displayTotal.value = !displayTotal.value;
  }

  function openTripDesigner() {
    isTripDesignerOpen.value = true;
  }

  function closeTripDesigner() {
    isTripDesignerOpen.value = false;
  }

  function resetFilters() {
    activeCategory.value = 'all';
    only3D.value = false;
    searchQuery.value = '';
    minPrice.value = null;
    maxPrice.value = null;
    bedroomsFilter.value = 'any';
  }

  async function fetchProperties() {
    isLoading.value = true;
    error.value = null;
    try {
      const res = await api.getProperties({
        include_unavailable: true, // host can see all
      });
      if (res.success && res.data) {
        properties.value = res.data;
        if (!selectedProperty.value && res.data.length > 0) {
          selectedProperty.value = res.data[0];
        }
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to load properties';
    } finally {
      isLoading.value = false;
    }
  }

  async function selectPropertyBySlug(slug: string) {
    const existing = properties.value.find((p) => p.slug === slug);
    if (existing) {
      selectedProperty.value = existing;
      return existing;
    }
    try {
      const res = await api.getProperty(slug);
      if (res.success && res.data) {
        selectedProperty.value = res.data;
        return res.data;
      }
    } catch (e) {
      // ignore
    }
    return null;
  }

  function setCategory(cat: string) {
    activeCategory.value = cat;
  }

  function toggle3DFilter() {
    only3D.value = !only3D.value;
  }

  return {
    properties,
    selectedProperty,
    hoveredPropertyId,
    activeCategory,
    only3D,
    searchQuery,
    minPrice,
    maxPrice,
    bedroomsFilter,
    isLoading,
    error,
    showMap,
    displayTotal,
    isTripDesignerOpen,
    wishlist,
    filteredProperties,
    fetchProperties,
    selectPropertyBySlug,
    setCategory,
    toggle3DFilter,
    isWishlisted,
    toggleWishlist,
    toggleMap,
    toggleDisplayTotal,
    openTripDesigner,
    closeTripDesigner,
    resetFilters,
  };
});
