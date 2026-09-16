export type AppView = 'explore' | 'guest-dashboard';

export interface VirtualHotspot {
  id: string;
  title: string;
  description: string;
  x: number; // percentage or normalized coordinate
  y: number;
  category?: 'architecture' | 'material' | 'amenity' | 'view' | 'furniture';
}

export interface VirtualTourRoom {
  id: string;
  name: string;
  subtitle: string;
  imageUrl: string;
  floor: number;
  hotspots: VirtualHotspot[];
}

export interface Property {
  id: string;
  title: string;
  subtitle: string;
  location: string;
  country: string;
  pricePerNight: number;
  currency: string;
  rating: number;
  reviewsCount: number;
  datesAvailable: string;
  category: 'trending' | '3d-tours' | 'beachfront' | 'cabins' | 'mansions' | 'modernist';
  has3dTour: boolean;
  images: string[];
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  sqft: number;
  architecturalStyle: string;
  description: string;
  amenities: string[];
  host: {
    name: string;
    avatar: string;
    isSuperhost: boolean;
    responseRate: string;
  };
  virtualTourRooms?: VirtualTourRoom[];
}

export interface ActiveBooking {
  id: string;
  propertyId: string;
  propertyTitle: string;
  location: string;
  dates: string;
  guestsCount: number;
  imageUrl: string;
  status: 'Active Booking' | 'Upcoming' | 'Completed';
  has3dTour: boolean;
}

export interface TripHistoryItem {
  id: string;
  propertyTitle: string;
  location: string;
  dates: string;
  status: 'Completed' | 'Upcoming' | 'Cancelled';
  imageUrl: string;
  has3dMemory: boolean;
}

export interface ConciergeMessage {
  id: string;
  sender: 'concierge' | 'user';
  senderName: string;
  avatar?: string;
  text: string;
  timestamp: string;
}

export interface HostListing {
  id: string;
  title: string;
  location: string;
  pricePerNight: number;
  reviewsCount: number;
  status: '3D Active' | 'Processing 3D' | 'Draft';
  imageUrl: string;
  views3d: number;
}

export interface PendingApproval {
  id: string;
  guestName: string;
  guestAvatar: string;
  propertyTitle: string;
  dates: string;
  totalPrice: number;
  nights: number;
}

export interface FilterOptions {
  category: string;
  only3DTours: boolean;
  minPrice: number;
  maxPrice: number;
  bedrooms: number | 'any';
  amenities: string[];
  searchQuery: string;
}
