export interface User {
  id: number;
  name: string;
  email: string;
  role: 'host' | 'guest' | 'admin';
  avatar?: string;
  is_host: boolean;
  is_guest: boolean;
  phone?: string;
  travel_preferences?: string[];
  villa_name?: string;
  villa_location?: string;
  architectural_style?: string;
  inspection_requested?: boolean;
}

export interface Property {
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
  virtual_tour_rooms?: { id: string; name: string; description: string }[];
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

export interface Booking {
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

export const users: User[] = [
  {
    id: 1,
    name: 'Alex Montgomery',
    email: 'host@luxestay.com',
    role: 'host',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    is_host: true,
    is_guest: false,
  },
  {
    id: 2,
    name: 'Marcus Vance',
    email: 'guest@luxestay.com',
    role: 'guest',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    is_host: false,
    is_guest: true,
  },
  {
    id: 3,
    name: 'Sophia Lin',
    email: 'sophia@luxestay.com',
    role: 'guest',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    is_host: false,
    is_guest: true,
  },
];

export const properties: Property[] = [
  {
    id: 1,
    slug: 'villa-kinkaku',
    title: 'Villa Kinkaku & Reflection Pool',
    subtitle: 'Cantilevered Teak Pavilion & Hinoki Spa Sanctuary',
    location: 'Kyoto, Kansai',
    country: 'Japan',
    category: 'trending',
    architectural_style: 'Organic Modernism',
    designer: 'Kengo Kuma & Associates',
    lat: 35.0116,
    lng: 135.7681,
    price_per_night: 2450,
    formatted_price: 'Mex$2,450 / night',
    rating: 4.98,
    reviews_count: 84,
    bedrooms: 4,
    bathrooms: 5,
    max_guests: 8,
    sqft: 6400,
    has_3d_tour: true,
    is_available: true,
    description:
      'Suspended gracefully above an emerald koi basin and manicured cedar groves, Villa Kinkaku balances ancient Japanese joinery with bold cantilevered titanium and low-iron glass facades. Designed by Pritzker laureates, it features private natural onsen baths fed by subterranean thermal springs.',
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1800&q=85',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80',
    ],
    amenities: [
      'Thermal Onsen & Hinoki Cedar Spa',
      'Heated Infinity Reflection Pool',
      'Private Tea Ceremony Master',
      'Acoustic Listening Lounge & Vinyl Vault',
      'Michelin-Trained Private Chef Service',
      'Sub-Zero Wine Cellar & Sake Gallery',
    ],
    virtual_tour_rooms: [
      { id: 'pool', name: 'Cantilever Pool Deck', description: 'Zero-edge pool with optic fiber lighting mirroring Kyoto constellations.' },
      { id: 'living', name: 'Main Glass Pavilion', description: 'Double-height volume wrapped in frameless floor-to-ceiling motorized glazing.' },
      { id: 'master', name: 'Cantilever Master Suite', description: 'Floating bedroom with uninterrupted panorama of the bamboo forest.' },
      { id: 'onsen', name: 'Private Hinoki Spa', description: 'Deep soaking tub sculpted from 300-year-old salvaged Japanese cypress.' },
    ],
    sleeping_arrangements: [
      { room: 'Master Sanctuary', bed_type: '1 King Bed', bath: 'Private Hinoki Spa Onsen' },
      { room: 'Bamboo Pavilion Suite', bed_type: '1 King Bed', bath: 'Ensuite Stone Rain Shower' },
      { room: 'Zen Garden Suite', bed_type: '1 Queen Bed', bath: 'Private Japanese Soaking Tub' },
      { room: 'Tea Terrace Room', bed_type: '2 Twin Beds', bath: 'Ensuite Marble Bath' },
    ],
    review_ratings: {
      cleanliness: 5.0,
      accuracy: 5.0,
      communication: 5.0,
      location: 4.9,
      check_in: 5.0,
      value: 4.9,
    },
    featured_reviews: [
      {
        author: 'Julian Sterling',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        date: 'August 2026',
        comment: 'Unsurpassed architectural beauty. Our Luxe trip designer arranged a private morning tea ceremony overlooking the mist. Exceptional in every metric.',
        rating: 5,
      },
      {
        author: 'Dr. Catherine Vance',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
        date: 'July 2026',
        comment: 'The cantilever master suite felt like sleeping suspended above Kyoto. The 3D virtual tour before arrival was completely accurate down to the millimetre.',
        rating: 5,
      }
    ],
    trip_designer: {
      name: 'Yuki Takahashi',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
      role: 'Dedicated Luxe Trip Designer',
      intro: 'Coordinating private high-speed Kyoto airport transfers, kaiseki master reservations, and temple access.',
    },
    host: {
      name: 'Kenji & Elena Sato',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      response_rate: '100% within 15 minutes',
      is_superhost: true,
    },
  },
  {
    id: 2,
    slug: 'malibu-sunset',
    title: 'The Malibu Cantilever Crest',
    subtitle: 'Brutalist Concrete & Sunset Ocean Cantilever',
    location: 'Malibu, California',
    country: 'United States',
    category: 'beachfront',
    architectural_style: 'Warm Brutalism',
    designer: 'Olson Kundig Architects',
    lat: 34.0259,
    lng: -118.7798,
    price_per_night: 3800,
    formatted_price: 'Mex$3,800 / night',
    rating: 4.99,
    reviews_count: 112,
    bedrooms: 5,
    bathrooms: 6,
    max_guests: 10,
    sqft: 8200,
    has_3d_tour: true,
    is_available: true,
    description:
      'Perched dramatically over the Pacific surf, this warm board-formed architectural monolith features an extraordinary 42-foot cantilevered living wing. Frameless glass pocket doors disappear to unite indoor fire features with the ocean horizon.',
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1800&q=85',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80',
    ],
    amenities: [
      'Private Funicular to Secluded Cove',
      'Cantilevered Infinity Spa Over Surf',
      'Dolby Atmos Screening Pavilion',
      'Tesla Solar Roof & Ultra-Fast Charging',
      'Dedicated Butler & Chauffeur Fleet',
      'Commercial Grade Outdoor Kitchen',
    ],
    virtual_tour_rooms: [
      { id: 'pool', name: 'Pacific Infinity Deck', description: 'Sweeping cantilever deck suspended 180 feet above crashing waves.' },
      { id: 'living', name: 'Great Ocean Hall', description: 'Continuous board-formed concrete and travertine fireplaces.' },
      { id: 'master', name: 'Skyline Suite', description: 'Floor-to-ceiling glass wrapping the coastal mountain contours.' },
    ],
    sleeping_arrangements: [
      { room: 'Ocean Cantilever Suite', bed_type: '1 King Bed', bath: 'Travertine Soaking Tub Over Surf' },
      { room: 'Pacific Sunset Suite', bed_type: '1 King Bed', bath: 'Ensuite Glass Rain Shower' },
      { room: 'Cove Vista Bedroom', bed_type: '1 King Bed', bath: 'Private Terrace & Bath' },
      { room: 'Funicular Terrace Suite', bed_type: '1 Queen Bed', bath: 'Ensuite Bath' },
      { room: 'Garden Bunk Suite', bed_type: '2 Queen Beds', bath: 'Ensuite Double Vanity' },
    ],
    review_ratings: {
      cleanliness: 5.0,
      accuracy: 5.0,
      communication: 5.0,
      location: 5.0,
      check_in: 5.0,
      value: 4.8,
    },
    featured_reviews: [
      {
        author: 'Eleanor Roosevelt-Cross',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        date: 'September 2026',
        comment: 'The private funicular down to the beach cove and the cantilevered hot tub are pure magic. Alex Montgomery and the Luxe concierge exceeded all expectations.',
        rating: 5,
      }
    ],
    trip_designer: {
      name: 'Harrison Reed',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      role: 'Dedicated Luxe Trip Designer',
      intro: 'Handling Malibu private surf coaches, organic chef provisioning, and luxury fleet coordination.',
    },
    host: {
      name: 'Alex Montgomery',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      response_rate: '99% within 20 minutes',
      is_superhost: true,
    },
  },
  {
    id: 3,
    slug: 'the-glass-horizon',
    title: 'The Glass Horizon at Lake Como',
    subtitle: 'Floating Lakeside Pavilion with Private Berth',
    location: 'Bellagio, Lake Como',
    country: 'Italy',
    category: 'mansions',
    architectural_style: 'Rationalist Minimalist',
    designer: 'Piero Lissoni & Studio',
    lat: 45.9872,
    lng: 9.2625,
    price_per_night: 4200,
    formatted_price: 'Mex$4,200 / night',
    rating: 5.0,
    reviews_count: 67,
    bedrooms: 6,
    bathrooms: 7,
    max_guests: 12,
    sqft: 9500,
    has_3d_tour: true,
    is_available: true,
    description:
      'A neoclassical stone foundation re-envisioned through ultra-slender Swiss engineered steel and anti-reflective glass. Boasts direct lake access, a Riva boat house, and terraced Italian gardens planted with centuries-old olive and cypress trees.',
    images: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1800&q=85',
      'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?auto=format&fit=crop&w=1200&q=80',
    ],
    amenities: [
      'Private Riva Aquarama Yacht Dock',
      'Heated Lake-Level Pool with Submerged Glass',
      'Historic Wine Grotto & Tasting Vault',
      'Helipad Access (10 min from Milan)',
      'Full Concierge & Sommelier Staff',
    ],
    virtual_tour_rooms: [
      { id: 'dock', name: 'Lakeside Jetty & Boathouse', description: 'Hand-cut Moltrasio stone pier with mooring for vintage watercraft.' },
      { id: 'pavilion', name: 'Central Glass Gallery', description: '360-degree panorama of the Como mountain ridges.' },
    ],
    sleeping_arrangements: [
      { room: 'Lake-Front Royal Master', bed_type: '1 King Bed', bath: 'Carrara Marble Spa & Balcony' },
      { room: 'Cypress Garden Suite', bed_type: '1 King Bed', bath: 'Private Stone Bath' },
      { room: 'The Bellagio Suite', bed_type: '1 King Bed', bath: 'Ensuite Rain Shower' },
      { room: 'Riva Boathouse Wing', bed_type: '1 Queen Bed', bath: 'Direct Water Access' },
      { room: 'Olive Terrace Room', bed_type: '1 Queen Bed', bath: 'Ensuite Bath' },
      { room: 'Alpine Ridge Suite', bed_type: '2 Single Beds', bath: 'Ensuite Bath' },
    ],
    review_ratings: {
      cleanliness: 5.0,
      accuracy: 5.0,
      communication: 5.0,
      location: 5.0,
      check_in: 5.0,
      value: 5.0,
    },
    featured_reviews: [
      {
        author: 'Lord Alistair Sterling',
        avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=150&q=80',
        date: 'August 2026',
        comment: 'Arrival via the private Riva boat directly onto the stone jetty set an unforgettable tone. Pristine 300-point condition, exceptional wine vault.',
        rating: 5,
      }
    ],
    trip_designer: {
      name: 'Matteo Colombo',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
      role: 'Dedicated Luxe Trip Designer',
      intro: 'Curating vintage Riva charters, helicopter transfers from Malpensa, and private Villa Balbianello tours.',
    },
    host: {
      name: 'Contessa Beatrice Visconti',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
      response_rate: '100% within 1 hour',
      is_superhost: true,
    },
  },
  {
    id: 4,
    slug: 'villa-mirage',
    title: 'Villa Mirage Palm Springs',
    subtitle: 'Desert Modernism with Cantilever Terrazzo',
    location: 'Palm Springs, California',
    country: 'United States',
    category: 'desert',
    architectural_style: 'Mid-Century Futurism',
    designer: 'E. Stewart Williams Heritage Studio',
    lat: 33.8303,
    lng: -116.5453,
    price_per_night: 1950,
    formatted_price: 'Mex$1,950 / night',
    rating: 4.96,
    reviews_count: 93,
    bedrooms: 3,
    bathrooms: 4,
    max_guests: 6,
    sqft: 4800,
    has_3d_tour: true,
    is_available: true,
    description:
      'Tucked into the San Jacinto granite foothills, Villa Mirage reinterprets desert modernism with cast terrazzo floors, floating shade planes, and a sunken conversation pit framing twilight desert colors.',
    images: [
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1800&q=85',
      'https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=1200&q=80',
    ],
    amenities: [
      'Olympic Length Saline Lap Pool',
      'Sunken Fire Pit with Mountain Vista',
      'Solar Geo-Thermal Climate Envelope',
      'Stargazing Observatory Deck',
    ],
    virtual_tour_rooms: [
      { id: 'pool', name: 'Desert Reflection Deck', description: 'Mirrored water surface framing the dry palm silhouettes.' },
      { id: 'lounge', name: 'Sunken Fire Pavilion', description: 'Integrated desert stone seating with panoramic glass.' },
    ],
    sleeping_arrangements: [
      { room: 'San Jacinto Master', bed_type: '1 King Bed', bath: 'Private Outdoor Shower & Terrazzo Tub' },
      { room: 'Cactus Courtyard Suite', bed_type: '1 King Bed', bath: 'Ensuite Bath' },
      { room: 'Oasis Guest Suite', bed_type: '1 Queen Bed', bath: 'Ensuite Bath' },
    ],
    review_ratings: {
      cleanliness: 5.0,
      accuracy: 4.9,
      communication: 5.0,
      location: 4.9,
      check_in: 5.0,
      value: 4.9,
    },
    featured_reviews: [
      {
        author: 'Chloe Davenport',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        date: 'July 2026',
        comment: 'The sunken fire pit against the twilight desert peaks was serene beyond words. Flawlessly clean, with every detail taken care of.',
        rating: 5,
      }
    ],
    trip_designer: {
      name: 'Samantha Brooks',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      role: 'Dedicated Luxe Trip Designer',
      intro: 'Arranging Joshua Tree private stargazing astronomers, private pilates instructors, and in-villa mixologists.',
    },
    host: {
      name: 'David Sterling',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
      response_rate: '98% within 30 minutes',
      is_superhost: true,
    },
  },
  {
    id: 5,
    slug: 'alpine-monolith',
    title: 'The Alpine Monolith Zermatt',
    subtitle: 'Carved Granite Sanctuary with Matterhorn Alignment',
    location: 'Zermatt, Valais',
    country: 'Switzerland',
    category: 'ski',
    architectural_style: 'Alpine Brutalism',
    designer: 'Peter Zumthor Studio Alumnus',
    lat: 45.9765,
    lng: 7.7491,
    price_per_night: 3100,
    formatted_price: 'Mex$3,100 / night',
    rating: 4.97,
    reviews_count: 49,
    bedrooms: 4,
    bathrooms: 5,
    max_guests: 8,
    sqft: 5600,
    has_3d_tour: true,
    is_available: true,
    description:
      'Carved directly into the schist rock of the Swiss Alps, this monolithic timber and stone chalet aligns perfectly with the jagged geometry of the Matterhorn. Includes private ski-in/ski-out elevator.',
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1800&q=85',
      'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1200&q=80',
    ],
    amenities: [
      'Ski-In / Ski-Out Private Express Tunnel',
      'Indoor Heated Grotto Pool & Cryo-Chamber',
      'Open Fireplace with Smoked Oak Hearth',
      'Matterhorn Stargazing Telescope Suite',
    ],
    virtual_tour_rooms: [
      { id: 'grotto', name: 'Subterranean Stone Spa', description: 'Heated spring water carved directly inside Swiss granite.' },
      { id: 'lounge', name: 'Matterhorn Great Room', description: 'Direct unobstructed axis to the alpine summit.' },
    ],
    sleeping_arrangements: [
      { room: 'Matterhorn Peak Suite', bed_type: '1 King Bed', bath: 'Granite Soaking Tub Facing Summit' },
      { room: 'Alpine Schist Suite', bed_type: '1 King Bed', bath: 'Private Steam Room & Bath' },
      { room: 'Glacier Panorama Suite', bed_type: '1 King Bed', bath: 'Ensuite Stone Bath' },
      { room: 'Pine Hearth Room', bed_type: '2 Single Beds', bath: 'Ensuite Bath' },
    ],
    review_ratings: {
      cleanliness: 5.0,
      accuracy: 5.0,
      communication: 5.0,
      location: 5.0,
      check_in: 5.0,
      value: 4.8,
    },
    featured_reviews: [
      {
        author: 'Marc de Fontaine',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        date: 'February 2026',
        comment: 'Skiing directly into the private mountain elevator after powder runs was extraordinary. The indoor granite grotto pool is a masterpiece.',
        rating: 5,
      }
    ],
    trip_designer: {
      name: 'Franziska Weber',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      role: 'Dedicated Luxe Trip Designer',
      intro: 'Organizing private heli-skiing guides, Zermatt equipment pre-fitting, and fondue fireside dining.',
    },
    host: {
      name: 'Hanspeter & Heidi Meyer',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
      response_rate: '100% within 10 minutes',
      is_superhost: true,
    },
  },
  {
    id: 6,
    slug: 'cycladic-haven',
    title: 'The Cycladic Haven Oia',
    subtitle: 'Sculpted Caldera Cliff Villa with Infinity Plunge',
    location: 'Oia, Santorini',
    country: 'Greece',
    category: 'beachfront',
    architectural_style: 'Neo-Cycladic Minimal',
    designer: 'Kapsimalis Architects',
    lat: 36.4618,
    lng: 25.3753,
    price_per_night: 2850,
    formatted_price: 'Mex$2,850 / night',
    rating: 4.95,
    reviews_count: 120,
    bedrooms: 3,
    bathrooms: 4,
    max_guests: 6,
    sqft: 4100,
    has_3d_tour: true,
    is_available: true,
    description:
      'Hand-plastered white lime walls cascading 300 meters down the volcanic caldera. Featuring curved monolithic archways, zero-edge heated cliff pools, and private sunset terraces overlooking the Aegean Sea.',
    images: [
      'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1800&q=85',
      'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',
    ],
    amenities: [
      'Caldera Edge Infinity Plunge Pool',
      'Cave Wine Cellar with Assyrtiko Vintages',
      'Daily Champagne Breakfast on Private Terrace',
      'Dedicated Porter & Yacht Charter Service',
    ],
    virtual_tour_rooms: [
      { id: 'pool', name: 'Aegean Cliff Edge', description: 'Floating water boundary merging into the caldera crater.' },
      { id: 'cave', name: 'Sculpted White Master Cave', description: 'Curvilinear bedroom formed from natural volcanic rock.' },
    ],
    sleeping_arrangements: [
      { room: 'Caldera Cliff Master Cave', bed_type: '1 King Bed', bath: 'Sculpted Volcanic Stone Bath' },
      { room: 'Aegean Sunset Suite', bed_type: '1 King Bed', bath: 'Private Plunge Access & Bath' },
      { room: 'White Vault Bedroom', bed_type: '1 Queen Bed', bath: 'Ensuite Lime Plaster Bath' },
    ],
    review_ratings: {
      cleanliness: 5.0,
      accuracy: 5.0,
      communication: 5.0,
      location: 5.0,
      check_in: 4.9,
      value: 4.9,
    },
    featured_reviews: [
      {
        author: 'Camilla Valenti',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
        date: 'June 2026',
        comment: 'Watching the Santorini sunset directly from our private cliff plunge pool with chilled Assyrtiko wine was the trip of a lifetime. Completely private and tranquil.',
        rating: 5,
      }
    ],
    trip_designer: {
      name: 'Nikos Alexopoulos',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80',
      role: 'Dedicated Luxe Trip Designer',
      intro: 'Managing caldera catamaran sunset cruises, luggage porterage down the cliff, and private winery access.',
    },
    host: {
      name: 'Nikos & Eleni Karras',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80',
      response_rate: '100% within 15 minutes',
      is_superhost: true,
    },
  },
];

export const bookings: Booking[] = [
  {
    id: 101,
    user_id: 3,
    property_id: 1,
    check_in: '2026-10-05',
    check_out: '2026-10-10',
    nights: 5,
    nightly_rate: 2450,
    service_fee: 1470,
    total_price: 13720,
    formatted_total: 'Mex$13,720.00',
    guests_count: 4,
    status: 'approved',
    notes: 'Looking forward to the tea ceremony and Hinoki spa experience.',
    created_at: new Date().toISOString(),
    guest: {
      id: 3,
      name: 'Sophia Lin',
      email: 'sophia@luxestay.com',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    },
    property: {
      id: 1,
      slug: 'villa-kinkaku',
      title: 'Villa Kinkaku & Reflection Pool',
      location: 'Kyoto, Kansai',
      architectural_style: 'Organic Modernism',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1800&q=85',
      has_3d_tour: true,
      is_available: true,
    },
  },
  {
    id: 102,
    user_id: 2,
    property_id: 2,
    check_in: '2026-09-25',
    check_out: '2026-09-29',
    nights: 4,
    nightly_rate: 3800,
    service_fee: 1824,
    total_price: 17024,
    formatted_total: 'Mex$17,024.00',
    guests_count: 2,
    status: 'pending',
    notes: 'Special anniversary celebration trip. Requesting early funicular check-in.',
    created_at: new Date().toISOString(),
    guest: {
      id: 2,
      name: 'Marcus Vance',
      email: 'guest@luxestay.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    },
    property: {
      id: 2,
      slug: 'malibu-sunset',
      title: 'The Malibu Cantilever Crest',
      location: 'Malibu, California',
      architectural_style: 'Warm Brutalism',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1800&q=85',
      has_3d_tour: true,
      is_available: true,
    },
  },
  {
    id: 103,
    user_id: 3,
    property_id: 3,
    check_in: '2026-09-01',
    check_out: '2026-09-08',
    nights: 7,
    nightly_rate: 4200,
    service_fee: 3528,
    total_price: 32928,
    formatted_total: 'Mex$32,928.00',
    guests_count: 6,
    status: 'approved',
    notes: 'Private boat charter requested for Lake Como cruise.',
    created_at: new Date().toISOString(),
    guest: {
      id: 3,
      name: 'Sophia Lin',
      email: 'sophia@luxestay.com',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    },
    property: {
      id: 3,
      slug: 'the-glass-horizon',
      title: 'The Glass Horizon at Lake Como',
      location: 'Bellagio, Lake Como',
      architectural_style: 'Rationalist Minimalist',
      image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1800&q=85',
      has_3d_tour: true,
      is_available: true,
    },
  },
];
