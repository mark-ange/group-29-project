<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import {
  X,
  Sparkles,
  CheckCircle2,
  Calendar,
  MapPin,
  Users,
  Clock,
  Star,
  ChevronRight,
  ArrowLeft,
  Check,
  Award,
  DollarSign,
  Phone,
  Mail,
  SlidersHorizontal,
  Lock,
} from 'lucide-vue-next';
import { usePropertyStore } from '../stores/properties';
import { useAuthStore } from '../stores/auth';

const propertyStore = usePropertyStore();
const authStore = useAuthStore();

export interface TripDesigner {
  id: number;
  name: string;
  role: string;
  rating: number;
  reviewCount: number;
  dailyRate: number;
  area: string;
  regionKey: string; // 'como' | 'careyes' | 'alps' | 'kyoto' | 'riviera'
  experience: string;
  avatar: string;
  specialties: string[];
  bio: string;
  responseTime: string;
  badge: string;
}

const designers: TripDesigner[] = [
  {
    id: 1,
    name: 'Countess Allegra Visconti',
    role: 'Principal Master Trip Director & Heritage Architect',
    rating: 5.0,
    reviewCount: 128,
    dailyRate: 6500,
    area: 'Lake Como & Italian Lakes',
    regionKey: 'como',
    experience: '14 Years Curating Lombard Estates',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    specialties: ['Historic Palazzo Buyouts', 'Private Riva Charters', '3-Star Michelin Gastronomy'],
    bio: 'Curator of high-profile private villa buyouts and nautical excursions on Lake Como, offering closed-door access to Lombard historic archives.',
    responseTime: '< 10 mins',
    badge: 'Premier Master Director',
  },
  {
    id: 2,
    name: 'Sebastian Thorne',
    role: 'Senior Alpine & Mountain Expedition Designer',
    rating: 4.98,
    reviewCount: 94,
    dailyRate: 5200,
    area: 'Zermatt, Valais & Swiss Alps',
    regionKey: 'alps',
    experience: '11 Years in High Alps',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    specialties: ['Heli-Ski Transfers', 'Private Glacier Guides', 'Sommelier Alpine Cellars'],
    bio: 'Former Swiss alpine director specializing in private helicopter logistics, high-altitude champagne terraces, and five-star chalet operations.',
    responseTime: '< 15 mins',
    badge: 'High Altitude Specialist',
  },
  {
    id: 3,
    name: 'Camila Morales-Suarez',
    role: 'Lead Coastal & Pacific Estate Concierge',
    rating: 4.95,
    reviewCount: 82,
    dailyRate: 4400,
    area: 'Costa Careyes & Pacific Coast',
    regionKey: 'careyes',
    experience: '9 Years in Careyes & Punta Mita',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    specialties: ['Superyacht Charters', 'Private Estate Security', 'Mesoamerican Haute Cuisine'],
    bio: 'Specialized in oceanfront castles, Careyes polo hospitality, and secluded private cove day-trips along the Mexican Pacific Coast.',
    responseTime: '< 15 mins',
    badge: 'Pacific Coast Director',
  },
  {
    id: 4,
    name: 'Kenjiro Takahashi',
    role: 'Master Cultural & Sukiya Architecture Curator',
    rating: 4.94,
    reviewCount: 76,
    dailyRate: 3900,
    area: 'Kyoto, Tokyo & Hakone',
    regionKey: 'kyoto',
    experience: '12 Years in Kansai & Kyoto',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    specialties: ['Private Temple Gardens', 'Geiko Evening Banquets', 'Kaiseki Master Tables'],
    bio: 'Opens doors to centuries-old Sukiya compounds, private Zen temple courtyards, and secretive Kyoto artisanal workshops.',
    responseTime: '< 20 mins',
    badge: 'Cultural Heritage Fellow',
  },
  {
    id: 5,
    name: 'Chloe Dubois',
    role: 'Associate Luxe Itinerary Designer & Sommelier',
    rating: 4.88,
    reviewCount: 51,
    dailyRate: 2900,
    area: 'French Riviera, Cannes & Provence',
    regionKey: 'riviera',
    experience: '6 Years in Côte d’Azur',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    specialties: ['Grand Cru Vineyard Access', 'Contemporary Art Previews', 'Holistic Seaside Spas'],
    bio: 'Bespoke French Riviera travel curator specializing in private art foundations, helicopter transfers to Monaco, and premier vineyard estates.',
    responseTime: '< 20 mins',
    badge: 'Sommelier & Art Curator',
  },
  {
    id: 6,
    name: 'Mateo Navarro',
    role: 'Regional Travel Coordinator & Butler Director',
    rating: 4.75,
    reviewCount: 39,
    dailyRate: 1850,
    area: 'Costa Careyes & Riviera Maya',
    regionKey: 'careyes',
    experience: '4 Years in Coastal Hospitality',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
    specialties: ['Villa Provisioning', 'Marine Expeditions', 'On-Demand Chauffeur Fleet'],
    bio: 'Energetic estate logistics specialist delivering accessible luxury coordination, trusted regional transportation, and family itinerary planning.',
    responseTime: '< 25 mins',
    badge: 'Best Value Specialist',
  },
];

const step = ref<'form' | 'designer-selection' | 'success'>('form');

// Form state
const destination = ref('Lake Como, Italy');
const tripDays = ref(5);
const dates = ref('Next Month (Flexible)');
const guests = ref('4 Guests');
const selectedServices = ref<string[]>([
  'Private In-Villa Michelin Chef',
  'Airport Luxury Chauffeur & Funicular',
]);
const notes = ref('');
const contactName = ref('Marcus Vance');
const contactEmail = ref('guest@luxestay.com');
const contactPhone = ref('+1 (310) 555-0199');
const isSubmitting = ref(false);

// Designer selection state
const activeAreaFilter = ref<string>('all');
const sortBy = ref<'best' | 'price-low' | 'price-high'>('best');
const selectedDesigner = ref<TripDesigner | null>(designers[0]);

const destinationOptions = [
  { label: 'Lake Como, Italy', regionKey: 'como' },
  { label: 'Costa Careyes, Mexico', regionKey: 'careyes' },
  { label: 'Zermatt, Swiss Alps', regionKey: 'alps' },
  { label: 'Kyoto, Japan', regionKey: 'kyoto' },
  { label: 'French Riviera, France', regionKey: 'riviera' },
  { label: 'All Global Sanctuaries', regionKey: 'all' },
];

const availableServices = [
  'Private In-Villa Michelin Chef',
  'Airport Luxury Chauffeur & Funicular',
  'Pre-Arrival Sommelier Wine Cellar Stocking',
  'Private Yacht or Riva Boat Charter',
  'Licensed On-Demand Massage & Spa Therapists',
  'Helicopter Mountain / Coastal Transfer',
  'Custom Architectural & Cultural Tours',
  'Dedicated Daily Housekeeping & Butler Service',
];

// If a property was selected when opening, pre-fill destination & region
watch(
  () => propertyStore.selectedProperty,
  (prop) => {
    if (prop) {
      destination.value = `${prop.location}, ${prop.country}`;
      const loc = (prop.location + ' ' + prop.country).toLowerCase();
      if (loc.includes('como') || loc.includes('italy')) {
        activeAreaFilter.value = 'como';
      } else if (loc.includes('careyes') || loc.includes('mexico')) {
        activeAreaFilter.value = 'careyes';
      } else if (loc.includes('zermatt') || loc.includes('swiss') || loc.includes('switzerland')) {
        activeAreaFilter.value = 'alps';
      } else if (loc.includes('kyoto') || loc.includes('japan')) {
        activeAreaFilter.value = 'kyoto';
      } else {
        activeAreaFilter.value = 'all';
      }
    }
  },
  { immediate: true }
);

function toggleService(service: string) {
  if (selectedServices.value.includes(service)) {
    selectedServices.value = selectedServices.value.filter((s) => s !== service);
  } else {
    selectedServices.value.push(service);
  }
}

// Filtered and sorted designers list
const filteredDesigners = computed(() => {
  let list = [...designers];

  // Area filter
  if (activeAreaFilter.value !== 'all') {
    list = list.filter((d) => d.regionKey === activeAreaFilter.value);
  }

  // Sorting
  if (sortBy.value === 'best') {
    // Highest rating first, then review count
    list.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
  } else if (sortBy.value === 'price-low') {
    // Lowest daily rate first
    list.sort((a, b) => a.dailyRate - b.dailyRate);
  } else if (sortBy.value === 'price-high') {
    // Highest daily rate first
    list.sort((a, b) => b.dailyRate - a.dailyRate);
  }

  return list;
});

function goToDesignerSelection() {
  // Map selected destination to region filter if available
  const match = destinationOptions.find((o) => o.label === destination.value);
  if (match && match.regionKey !== 'all') {
    activeAreaFilter.value = match.regionKey;
  }
  // Auto-select first designer in view
  if (filteredDesigners.value.length > 0 && (!selectedDesigner.value || !filteredDesigners.value.some(d => d.id === selectedDesigner.value?.id))) {
    selectedDesigner.value = filteredDesigners.value[0];
  }
  step.value = 'designer-selection';
}

function selectDesigner(designer: TripDesigner) {
  selectedDesigner.value = designer;
}

async function confirmDesignerAndSubmit() {
  if (!selectedDesigner.value) return;

  // Strict Auth Guard: Logged-out visitors cannot book a designer
  if (!authStore.user) {
    authStore.openAuth('login', 'Please sign in or register to book a dedicated Trip Designer.');
    return;
  }

  isSubmitting.value = true;
  await new Promise((resolve) => setTimeout(resolve, 700));
  isSubmitting.value = false;
  step.value = 'success';
}

function resetAndClose() {
  propertyStore.closeTripDesigner();
  setTimeout(() => {
    step.value = 'form';
  }, 300);
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="propertyStore.isTripDesignerOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md transition-opacity"
      @click.self="resetAndClose"
    >
      <div
        class="bg-white dark:bg-neutral-900 rounded-3xl max-w-4xl w-full shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden relative transition-all my-auto max-h-[92vh] flex flex-col"
      >
        <!-- Top Luxe Header Banner -->
        <div class="bg-neutral-950 text-white px-6 py-5 sm:px-8 sm:py-6 relative overflow-hidden shrink-0 border-b border-neutral-800">
          <div class="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-[#BA0934]/25 blur-3xl pointer-events-none"></div>

          <button
            @click="resetAndClose"
            class="absolute top-5 right-5 p-2 rounded-full bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 hover:text-white transition cursor-pointer"
          >
            <X class="w-5 h-5" />
          </button>

          <div class="space-y-1.5 relative z-10">
            <div class="flex items-center gap-2">
              <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-neutral-800 border border-neutral-700 text-[11px] text-amber-400 font-semibold tracking-wide">
                <Sparkles class="w-3.5 h-3.5" />
                <span>Airbnb Luxe Concierge Network</span>
              </span>

              <!-- Step Breadcrumb -->
              <div class="hidden sm:flex items-center gap-1.5 text-xs text-neutral-400">
                <span :class="step === 'form' ? 'text-white font-bold' : 'text-neutral-500'">1. Itinerary Brief</span>
                <span>&rarr;</span>
                <span :class="step === 'designer-selection' ? 'text-white font-bold' : 'text-neutral-500'">2. Choose Trip Designer</span>
                <span>&rarr;</span>
                <span :class="step === 'success' ? 'text-white font-bold' : 'text-neutral-500'">3. Confirmation</span>
              </div>
            </div>

            <h2 class="text-xl sm:text-2xl font-extrabold tracking-tight">
              {{ step === 'form' ? 'Connect With a Dedicated Trip Designer' : step === 'designer-selection' ? 'Select Your Dedicated Trip Designer' : 'Trip Designer Assigned & Verified' }}
            </h2>
            <p class="text-xs text-neutral-400 max-w-2xl leading-relaxed">
              {{ step === 'form' ? 'Tell us about your bespoke travel requirements. On the next step, select from certified area specialists rated from premier master directors to local coordinators.' : step === 'designer-selection' ? 'Choose from our curated roster of verified Trip Designers stationed in this region. Daily consulting rates vary by designer seniority and accreditation.' : 'Your personal Trip Designer is locked in. Direct communication channels are now open.' }}
            </p>
          </div>
        </div>

        <!-- STEP 1: Form Step -->
        <div v-if="step === 'form'" class="p-6 sm:p-8 space-y-6 overflow-y-auto grow">
          <!-- Trip Details Overview -->
          <div class="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div class="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-800 space-y-1">
              <span class="text-neutral-500 font-medium flex items-center gap-1.5">
                <MapPin class="w-3.5 h-3.5 text-[#BA0934]" /> Area / Destination
              </span>
              <select
                v-model="destination"
                class="w-full font-bold text-neutral-900 dark:text-neutral-100 bg-transparent border-0 p-0 focus:ring-0 text-xs cursor-pointer"
              >
                <option v-for="opt in destinationOptions" :key="opt.label" :value="opt.label" class="text-neutral-900 bg-white">
                  {{ opt.label }}
                </option>
              </select>
            </div>

            <div class="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-800 space-y-1">
              <span class="text-neutral-500 font-medium flex items-center gap-1.5">
                <Calendar class="w-3.5 h-3.5 text-[#BA0934]" /> Planned Stay (Nights)
              </span>
              <div class="flex items-center gap-2">
                <input
                  v-model.number="tripDays"
                  type="number"
                  min="1"
                  max="60"
                  class="w-16 font-bold text-neutral-900 dark:text-neutral-100 bg-transparent border border-neutral-300 dark:border-neutral-700 rounded px-1.5 py-0.5 text-xs"
                />
                <span class="text-[11px] text-neutral-500">nights</span>
              </div>
            </div>

            <div class="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-800 space-y-1">
              <span class="text-neutral-500 font-medium flex items-center gap-1.5">
                <Clock class="w-3.5 h-3.5 text-[#BA0934]" /> Window
              </span>
              <input
                v-model="dates"
                type="text"
                class="w-full font-bold text-neutral-900 dark:text-neutral-100 bg-transparent border-0 p-0 focus:ring-0 text-xs"
              />
            </div>

            <div class="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-800 space-y-1">
              <span class="text-neutral-500 font-medium flex items-center gap-1.5">
                <Users class="w-3.5 h-3.5 text-[#BA0934]" /> Party Size
              </span>
              <input
                v-model="guests"
                type="text"
                class="w-full font-bold text-neutral-900 dark:text-neutral-100 bg-transparent border-0 p-0 focus:ring-0 text-xs"
              />
            </div>
          </div>

          <!-- Bespoke In-Villa Services Checklist -->
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <label class="block text-xs font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider">
                Select Desired Tailored In-Villa Services
              </label>
              <span class="text-[11px] text-neutral-500">{{ selectedServices.length }} Selected</span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                v-for="service in availableServices"
                :key="service"
                type="button"
                @click="toggleService(service)"
                class="p-3 rounded-xl border text-left text-xs transition-all flex items-start gap-2.5 cursor-pointer"
                :class="
                  selectedServices.includes(service)
                    ? 'border-[#BA0934] bg-[#BA0934]/5 text-[#BA0934] dark:bg-[#BA0934]/15 font-semibold'
                    : 'border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:border-neutral-300 dark:hover:border-neutral-700'
                "
              >
                <div
                  class="w-4 h-4 rounded-md border mt-0.5 flex items-center justify-center shrink-0 transition"
                  :class="
                    selectedServices.includes(service)
                      ? 'bg-[#BA0934] border-[#BA0934] text-white'
                      : 'border-neutral-300 dark:border-neutral-600'
                  "
                >
                  <CheckCircle2 v-if="selectedServices.includes(service)" class="w-3 h-3" />
                </div>
                <span>{{ service }}</span>
              </button>
            </div>
          </div>

          <!-- Specific requests / custom notes -->
          <div class="space-y-2">
            <label class="block text-xs font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider">
              Special Itinerary Requests, Dietary or Logistics Notes
            </label>
            <textarea
              v-model="notes"
              rows="2"
              placeholder="e.g. Celebrating a milestone anniversary, prefer plant-forward private chef, need helicopter landing clearance, traveling with art collectors..."
              class="w-full text-xs p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-850 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-[#BA0934] focus:ring-1 focus:ring-[#BA0934]"
            ></textarea>
          </div>

          <!-- Contact Information -->
          <div class="space-y-2">
            <label class="block text-xs font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider">
              Your Primary Contact Details
            </label>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                v-model="contactName"
                type="text"
                placeholder="Full Name"
                class="w-full text-xs p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-850 text-neutral-900 dark:text-neutral-100"
              />
              <input
                v-model="contactEmail"
                type="email"
                placeholder="Email Address"
                class="w-full text-xs p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-850 text-neutral-900 dark:text-neutral-100"
              />
              <input
                v-model="contactPhone"
                type="tel"
                placeholder="WhatsApp / Mobile"
                class="w-full text-xs p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-850 text-neutral-900 dark:text-neutral-100"
              />
            </div>
          </div>

          <!-- Bottom Action Bar -->
          <div class="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-neutral-200 dark:border-neutral-800">
            <div class="text-[11px] text-neutral-500 flex items-center gap-1.5">
              <Award class="w-4 h-4 text-amber-500" />
              <span>Step 1 of 2: Proceed to select your designer by rate &amp; rating</span>
            </div>

            <button
              type="button"
              @click="goToDesignerSelection"
              class="w-full sm:w-auto px-6 py-3 rounded-full bg-[#BA0934] hover:bg-[#960729] text-white text-xs font-bold tracking-wide transition shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Choose Your Trip Designer in {{ destination }}</span>
              <ChevronRight class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- STEP 2: Designer Selection Step -->
        <div v-else-if="step === 'designer-selection'" class="p-6 sm:p-8 space-y-6 overflow-y-auto grow">
          <!-- Filters & Sorting Controls -->
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-2 border-b border-neutral-200 dark:border-neutral-800">
            <!-- Area filter tabs -->
            <div class="flex flex-wrap items-center gap-1.5 text-xs">
              <span class="text-neutral-400 font-semibold mr-1 flex items-center gap-1">
                <MapPin class="w-3.5 h-3.5 text-[#BA0934]" /> Area:
              </span>
              <button
                type="button"
                @click="activeAreaFilter = 'all'"
                :class="[
                  'px-3 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer',
                  activeAreaFilter === 'all'
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-sm'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200',
                ]"
              >
                All Specialists ({{ designers.length }})
              </button>
              <button
                type="button"
                @click="activeAreaFilter = 'como'"
                :class="[
                  'px-3 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer',
                  activeAreaFilter === 'como'
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-sm'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200',
                ]"
              >
                Lake Como
              </button>
              <button
                type="button"
                @click="activeAreaFilter = 'careyes'"
                :class="[
                  'px-3 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer',
                  activeAreaFilter === 'careyes'
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-sm'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200',
                ]"
              >
                Costa Careyes
              </button>
              <button
                type="button"
                @click="activeAreaFilter = 'alps'"
                :class="[
                  'px-3 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer',
                  activeAreaFilter === 'alps'
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-sm'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200',
                ]"
              >
                Swiss Alps
              </button>
              <button
                type="button"
                @click="activeAreaFilter = 'kyoto'"
                :class="[
                  'px-3 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer',
                  activeAreaFilter === 'kyoto'
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-sm'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200',
                ]"
              >
                Kyoto
              </button>
              <button
                type="button"
                @click="activeAreaFilter = 'riviera'"
                :class="[
                  'px-3 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer',
                  activeAreaFilter === 'riviera'
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-sm'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200',
                ]"
              >
                French Riviera
              </button>
            </div>

            <!-- Sorting Dropdown -->
            <div class="flex items-center gap-2 text-xs self-end md:self-auto shrink-0">
              <SlidersHorizontal class="w-3.5 h-3.5 text-neutral-500" />
              <span class="text-neutral-500 font-semibold">Rank by:</span>
              <select
                v-model="sortBy"
                class="px-2.5 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-xs font-bold focus:outline-none cursor-pointer"
              >
                <option value="best">Best Rated (Top Specialists First)</option>
                <option value="price-low">Designer Rate: Lowest to Highest</option>
                <option value="price-high">Designer Rate: Highest to Lowest</option>
              </select>
            </div>
          </div>

          <!-- Guest Warning Banner (Logged Out) -->
          <div v-if="!authStore.user" class="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div class="flex items-center gap-2.5 min-w-0">
              <Lock class="w-4 h-4 text-[#BA0934] shrink-0" />
              <p class="leading-relaxed">
                <strong>Sign In Required:</strong> Assigning a luxury Trip Designer requires an active guest account. Unauthenticated visitors can view designer profiles only.
              </p>
            </div>
            <button
              type="button"
              @click="authStore.openAuth('login', 'Please sign in or register to book a dedicated Trip Designer.')"
              class="px-3.5 py-1.5 rounded-xl bg-[#BA0934] hover:bg-[#960729] text-white text-xs font-bold transition shadow shrink-0 cursor-pointer text-center"
            >
              Sign In to Book
            </button>
          </div>

          <!-- Designer Cards Grid -->
          <div class="space-y-4">
            <div
              v-for="designer in filteredDesigners"
              :key="designer.id"
              @click="selectDesigner(designer)"
              :class="[
                'p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer relative',
                selectedDesigner?.id === designer.id
                  ? 'border-[#BA0934] bg-neutral-50/70 dark:bg-neutral-850/80 shadow-md ring-1 ring-[#BA0934]'
                  : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 bg-white dark:bg-neutral-900',
              ]"
            >
              <!-- Selected Checkmark Pill -->
              <div
                v-if="selectedDesigner?.id === designer.id"
                class="absolute -top-3 right-4 px-3 py-0.5 rounded-full bg-[#BA0934] text-white text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 shadow"
              >
                <Check class="w-3 h-3" />
                <span>Selected Designer</span>
              </div>

              <div class="flex flex-col md:flex-row md:items-start justify-between gap-4 min-w-0">
                <!-- Left: Avatar & Bio Details -->
                <div class="flex items-start gap-4 min-w-0 flex-1">
                  <div class="relative shrink-0">
                    <img
                      :src="designer.avatar"
                      :alt="designer.name"
                      class="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover shadow-sm border border-neutral-200 dark:border-neutral-700"
                    />
                    <div class="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white dark:border-neutral-900 flex items-center justify-center text-white" title="Online &amp; Active">
                      <Check class="w-3 h-3" />
                    </div>
                  </div>

                  <div class="space-y-1.5 min-w-0 flex-1">
                    <div class="flex flex-wrap items-center gap-2 min-w-0">
                      <h3 class="text-base font-extrabold text-neutral-900 dark:text-neutral-100 truncate">
                        {{ designer.name }}
                      </h3>
                      <span class="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-[10px] font-bold shrink-0">
                        {{ designer.badge }}
                      </span>
                    </div>

                    <p class="text-xs font-semibold text-neutral-600 dark:text-neutral-400 break-words">
                      {{ designer.role }}
                    </p>

                    <!-- Location & Experience -->
                    <div class="flex flex-wrap items-center gap-2 text-xs text-neutral-500 min-w-0">
                      <span class="flex items-center gap-1">
                        <MapPin class="w-3 h-3 text-[#BA0934] shrink-0" />
                        <span class="truncate">{{ designer.area }}</span>
                      </span>
                      <span>&bull;</span>
                      <span>{{ designer.experience }}</span>
                      <span>&bull;</span>
                      <span class="text-emerald-600 dark:text-emerald-400 font-semibold shrink-0">{{ designer.responseTime }} response</span>
                    </div>

                    <!-- Bio -->
                    <p class="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed pt-1 break-words">
                      {{ designer.bio }}
                    </p>

                    <!-- Specialty tags -->
                    <div class="flex flex-wrap gap-1.5 pt-1.5">
                      <span
                        v-for="spec in designer.specialties"
                        :key="spec"
                        class="px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-[10px] font-medium"
                      >
                        {{ spec }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Right: Price & Selection Status -->
                <div class="md:text-right flex md:flex-col items-center md:items-end justify-between border-t md:border-t-0 pt-3 md:pt-0 shrink-0">
                  <div class="space-y-0.5">
                    <div class="text-lg font-extrabold text-neutral-900 dark:text-neutral-100 flex items-center md:justify-end gap-1">
                      <span>Mex${{ designer.dailyRate.toLocaleString() }}</span>
                      <span class="text-xs font-normal text-neutral-400">/ day</span>
                    </div>
                    <p class="text-[11px] font-semibold text-[#BA0934]">
                      Mex${{ (designer.dailyRate * tripDays).toLocaleString() }} est. for {{ tripDays }} nights
                    </p>
                    <div class="flex items-center md:justify-end gap-1 text-xs pt-1">
                      <Star class="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span class="font-extrabold text-neutral-900 dark:text-neutral-100">{{ designer.rating.toFixed(2) }}</span>
                      <span class="text-neutral-400">({{ designer.reviewCount }})</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    @click.stop="selectDesigner(designer)"
                    :class="[
                      'px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer mt-2',
                      selectedDesigner?.id === designer.id
                        ? 'bg-[#BA0934] text-white shadow'
                        : 'border border-neutral-300 dark:border-neutral-700 hover:border-neutral-900 text-neutral-700 dark:text-neutral-300',
                    ]"
                  >
                    {{ selectedDesigner?.id === designer.id ? 'Selected' : 'Choose Designer' }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Bottom Sticky Action Bar -->
          <div class="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              @click="step = 'form'"
              class="w-full sm:w-auto px-4 py-2.5 rounded-full border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-semibold text-neutral-700 dark:text-neutral-300 transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft class="w-3.5 h-3.5" />
              <span>&larr; Back to Preferences</span>
            </button>

            <div class="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              <div v-if="selectedDesigner" class="text-right text-xs">
                <span class="text-neutral-400">Chosen:</span>
                <span class="font-extrabold text-neutral-900 dark:text-white ml-1.5">{{ selectedDesigner.name }}</span>
                <span class="text-[#BA0934] font-bold ml-1.5">(Mex${{ selectedDesigner.dailyRate.toLocaleString() }}/day)</span>
              </div>

              <!-- When Logged Out: Prompt Sign In to Book Designer -->
              <button
                v-if="!authStore.user"
                type="button"
                @click="authStore.openAuth('login', 'Please sign in or register to book a dedicated Trip Designer.')"
                class="px-6 py-3 rounded-full bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-white text-white text-xs font-bold tracking-wide transition shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer shrink-0 active:scale-98"
              >
                <Lock class="w-4 h-4 text-[#BA0934]" />
                <span>Sign In to Book Designer</span>
              </button>

              <!-- When Logged In: Confirm Designer -->
              <button
                v-else
                type="button"
                :disabled="!selectedDesigner || isSubmitting"
                @click="confirmDesignerAndSubmit"
                class="px-6 py-3 rounded-full bg-[#BA0934] hover:bg-[#960729] text-white text-xs font-bold tracking-wide transition shadow-md hover:shadow-lg disabled:opacity-50 flex items-center gap-2 cursor-pointer shrink-0"
              >
                <Sparkles v-if="!isSubmitting" class="w-4 h-4" />
                <span>{{ isSubmitting ? 'Finalizing Assignment...' : 'Confirm Designer & Submit' }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- STEP 3: Success Confirmation -->
        <div v-else class="p-8 sm:p-12 text-center space-y-6 overflow-y-auto grow">
          <div class="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
            <CheckCircle2 class="w-8 h-8" />
          </div>

          <div class="space-y-2">
            <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
              <span>Verified Airbnb Luxe Concierge Assigned</span>
            </div>
            <h3 class="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-neutral-100">
              Your Trip Designer is Confirmed
            </h3>
            <p class="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 max-w-lg mx-auto leading-relaxed">
              We have officially assigned <strong class="text-neutral-900 dark:text-neutral-100">{{ selectedDesigner?.name }}</strong> to coordinate your stay in {{ destination }}. They have received your full itinerary brief and tailored in-villa service requests.
            </p>
          </div>

          <!-- Assigned Designer Card -->
          <div
            v-if="selectedDesigner"
            class="max-w-lg mx-auto p-5 rounded-3xl bg-neutral-50 dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-800 text-left space-y-4"
          >
            <div class="flex items-center gap-4">
              <img
                :src="selectedDesigner.avatar"
                :alt="selectedDesigner.name"
                class="w-16 h-16 rounded-2xl object-cover shadow border border-neutral-300 dark:border-neutral-700"
              />
              <div class="space-y-1">
                <div class="flex items-center gap-1.5">
                  <h4 class="text-base font-extrabold text-neutral-900 dark:text-neutral-100">
                    {{ selectedDesigner.name }}
                  </h4>
                  <div class="flex items-center text-xs text-amber-500 font-bold">
                    <Star class="w-3.5 h-3.5 fill-amber-400" />
                    <span class="ml-0.5">{{ selectedDesigner.rating.toFixed(2) }}</span>
                  </div>
                </div>
                <p class="text-xs text-neutral-500">{{ selectedDesigner.role }}</p>
                <div class="text-xs text-neutral-700 dark:text-neutral-300 font-bold">
                  Daily Consultation Rate: <span class="text-[#BA0934]">Mex${{ selectedDesigner.dailyRate.toLocaleString() }} / day</span>
                </div>
              </div>
            </div>

            <!-- Direct Contact Channels -->
            <div class="pt-3 border-t border-neutral-200 dark:border-neutral-800 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div class="p-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center gap-2">
                <Phone class="w-3.5 h-3.5 text-emerald-600" />
                <div>
                  <p class="text-[10px] text-neutral-400 uppercase font-bold">Direct Line / WhatsApp</p>
                  <p class="font-bold text-neutral-900 dark:text-neutral-100">{{ contactPhone }}</p>
                </div>
              </div>

              <div class="p-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center gap-2">
                <Mail class="w-3.5 h-3.5 text-indigo-600" />
                <div>
                  <p class="text-[10px] text-neutral-400 uppercase font-bold">Direct Dispatch</p>
                  <p class="font-bold text-neutral-900 dark:text-neutral-100 truncate">{{ contactEmail }}</p>
                </div>
              </div>
            </div>

            <!-- Summary breakdown -->
            <div class="pt-2 text-xs space-y-1.5 text-neutral-600 dark:text-neutral-400">
              <div class="flex justify-between">
                <span>Destination:</span>
                <span class="font-bold text-neutral-900 dark:text-neutral-100">{{ destination }}</span>
              </div>
              <div class="flex justify-between">
                <span>Timeline:</span>
                <span class="font-bold text-neutral-900 dark:text-neutral-100">{{ tripDays }} Nights ({{ dates }})</span>
              </div>
              <div class="flex justify-between">
                <span>Requested Bespoke Add-ons:</span>
                <span class="font-bold text-neutral-900 dark:text-neutral-100">{{ selectedServices.length }} services</span>
              </div>
            </div>
          </div>

          <div class="pt-2">
            <button
              @click="resetAndClose"
              class="px-8 py-3.5 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold text-xs tracking-wide transition shadow-lg hover:shadow-xl cursor-pointer"
            >
              Done & Return to Luxe Stays
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
