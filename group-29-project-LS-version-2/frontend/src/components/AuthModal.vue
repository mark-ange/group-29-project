<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import {
  X,
  Lock,
  Mail,
  User,
  Shield,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  Building,
  Home,
  Phone,
  ArrowRight,
  Compass,
  Check,
} from 'lucide-vue-next';
import { useAuthStore } from '../stores/auth';
import { usePropertyStore } from '../stores/properties';

const props = withDefaults(
  defineProps<{
    initialTab?: 'login' | 'register-guest' | 'register-host';
  }>(),
  {
    initialTab: 'login',
  }
);

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'authSuccess', user: any): void;
}>();

const authStore = useAuthStore();
const propertyStore = usePropertyStore();

// Active tab state
const currentTab = ref<'login' | 'register-guest' | 'register-host'>(props.initialTab);

watch(
  () => props.initialTab,
  (newTab) => {
    if (newTab) currentTab.value = newTab;
  }
);

// Form States
const showPassword = ref(false);
const rememberMe = ref(true);
const forgotPasswordSent = ref(false);
const errorMessage = ref<string | null>(null);
const successMessage = ref<string | null>(null);

// 1. Login State
const loginEmail = ref('guest@luxestay.com');
const loginPassword = ref('password');

// 2. Guest Registration State
const guestName = ref('');
const guestEmail = ref('');
const guestPassword = ref('');
const guestPhone = ref('');
const selectedPreferences = ref<string[]>([
  'Beachfront Cantilevers',
  '3D Spatial Models',
]);
const requestTripDesigner = ref(true);

const luxuryStyleOptions = [
  'Beachfront Cantilevers',
  'Lakeside Palazzos',
  'Alpine Chalets',
  'Desert Modernism',
  '3D Spatial Models',
  'Private Helipads',
];

const togglePreference = (pref: string) => {
  if (selectedPreferences.value.includes(pref)) {
    selectedPreferences.value = selectedPreferences.value.filter((p) => p !== pref);
  } else {
    selectedPreferences.value.push(pref);
  }
};

// 3. Host Registration State
const hostName = ref('');
const hostEmail = ref('');
const hostPassword = ref('');
const hostPhone = ref('');
const villaName = ref('');
const villaLocation = ref('');
const architecturalStyle = ref('Modern Architectural Masterpiece');
const bedroomsCount = ref(4);
const estimatedRate = ref(32000);
const requestInspection = ref(true);

const architecturalOptions = [
  'Modern Architectural Masterpiece',
  'Minimalist Cantilever Glasshouse',
  'Historic Italian Palazzo Restoration',
  'Traditional Sukiya-Zukuri Pavilion',
  'Alpine Timber & Granite Chalet',
  'Organic Desert Adobe Compound',
];

// Quick Demo Fillers
const selectedDemoUser = ref<'host' | 'guest' | null>('guest');

const selectDemo = (type: 'host' | 'guest') => {
  selectedDemoUser.value = type;
  if (type === 'host') {
    loginEmail.value = 'host@luxestay.com';
    loginPassword.value = 'password';
  } else {
    loginEmail.value = 'guest@luxestay.com';
    loginPassword.value = 'password';
  }
};

// Password Strength Computation for Registration
const passwordStrength = computed(() => {
  const pwd = currentTab.value === 'register-guest' ? guestPassword.value : hostPassword.value;
  if (!pwd) return { score: 0, label: 'None', color: 'bg-neutral-200' };
  if (pwd.length < 6) return { score: 1, label: 'Weak', color: 'bg-rose-500' };
  if (pwd.length < 10) return { score: 2, label: 'Good', color: 'bg-amber-500' };
  return { score: 3, label: 'Strong', color: 'bg-emerald-500' };
});

// Handlers
const handleLogin = async () => {
  errorMessage.value = null;
  forgotPasswordSent.value = false;

  if (!loginEmail.value || !loginPassword.value) {
    errorMessage.value = 'Please enter both your email address and password.';
    return;
  }

  try {
    await authStore.login(loginEmail.value, loginPassword.value);
    emit('authSuccess', authStore.user);
    emit('close');
  } catch (err: any) {
    errorMessage.value = err.message || 'Unable to sign in. Please verify your credentials.';
  }
};

const handleRegisterGuest = async () => {
  errorMessage.value = null;

  if (!guestName.value || !guestEmail.value || !guestPassword.value) {
    errorMessage.value = 'Please provide your full name, email address, and a secure password.';
    return;
  }

  try {
    await authStore.register({
      name: guestName.value,
      email: guestEmail.value,
      password: guestPassword.value,
      role: 'guest',
      phone: guestPhone.value,
      travel_preferences: selectedPreferences.value,
    });

    emit('authSuccess', authStore.user);
    emit('close');
  } catch (err: any) {
    errorMessage.value = err.message || 'Guest registration failed.';
  }
};

const handleRegisterHost = async () => {
  errorMessage.value = null;

  if (!hostName.value || !hostEmail.value || !hostPassword.value || !villaName.value) {
    errorMessage.value = 'Please complete your host name, email, password, and estate name.';
    return;
  }

  try {
    await authStore.register({
      name: hostName.value,
      email: hostEmail.value,
      password: hostPassword.value,
      role: 'host',
      phone: hostPhone.value,
      villa_name: villaName.value,
      villa_location: villaLocation.value || 'Costa Careyes, Mexico',
      architectural_style: architecturalStyle.value,
      bedrooms: bedroomsCount.value,
      nightly_rate: estimatedRate.value,
      inspection_requested: requestInspection.value,
    });

    // Refresh property catalog so newly enlisted villa appears instantly
    await propertyStore.fetchProperties();

    emit('authSuccess', authStore.user);
    emit('close');
  } catch (err: any) {
    errorMessage.value = err.message || 'Host registration failed.';
  }
};

const handleForgotPassword = () => {
  if (!loginEmail.value) {
    errorMessage.value = 'Please enter your email address first.';
    return;
  }
  forgotPasswordSent.value = true;
  errorMessage.value = null;
};
</script>

<template>
  <div class="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 transition-all">
    <div
      class="relative w-full max-w-xl rounded-3xl bg-white dark:bg-neutral-900 shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden my-auto max-h-[92vh] flex flex-col text-neutral-900 dark:text-neutral-100 animate-in fade-in zoom-in-95 duration-200"
    >
      <!-- Top Bar with Airbnb Luxe Monogram & Close Button -->
      <div class="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-neutral-50/80 dark:bg-neutral-850/80">
        <div class="flex items-center gap-2.5">
          <div class="w-7 h-7 rounded-lg bg-neutral-900 dark:bg-white flex items-center justify-center text-white dark:text-neutral-900 shadow-xs">
            <span class="font-serif italic font-black text-xs text-[#BA0934]">L</span>
          </div>
          <div class="flex items-baseline gap-1.5">
            <span class="font-extrabold text-sm tracking-tight text-neutral-900 dark:text-white">LuxeStay</span>
            <span class="font-serif italic text-[10px] tracking-widest uppercase font-extrabold text-[#BA0934]">LUXE</span>
          </div>
        </div>

        <button
          @click="emit('close')"
          class="p-2 rounded-full text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-neutral-800 transition cursor-pointer"
        >
          <X class="w-4 h-4" />
        </button>
      </div>

      <!-- Tabbed Navigation Switcher (Airbnb Pill Design) -->
      <div class="px-6 pt-5 pb-2 bg-white dark:bg-neutral-900 border-b border-neutral-100 dark:border-neutral-800/80">
        <div class="p-1 rounded-2xl bg-neutral-100 dark:bg-neutral-800 grid grid-cols-3 gap-1">
          <!-- Tab 1: Log In -->
          <button
            type="button"
            @click="currentTab = 'login'; errorMessage = null"
            class="py-2.5 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            :class="
              currentTab === 'login'
                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-sm'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            "
          >
            <Lock class="w-3.5 h-3.5 text-[#BA0934]" />
            <span>Sign In</span>
          </button>

          <!-- Tab 2: Register Guest -->
          <button
            type="button"
            @click="currentTab = 'register-guest'; errorMessage = null"
            class="py-2.5 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            :class="
              currentTab === 'register-guest'
                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-sm'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            "
          >
            <User class="w-3.5 h-3.5 text-[#BA0934]" />
            <span>Guest Signup</span>
          </button>

          <!-- Tab 3: Register Host -->
          <button
            type="button"
            @click="currentTab = 'register-host'; errorMessage = null"
            class="py-2.5 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            :class="
              currentTab === 'register-host'
                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-sm'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            "
          >
            <Shield class="w-3.5 h-3.5 text-[#BA0934]" />
            <span>Host Signup</span>
          </button>
        </div>
      </div>

      <!-- Modal Body (Scrollable for comprehensive registration fields) -->
      <div class="overflow-y-auto p-6 sm:p-8 space-y-6">
        <!-- Global Error Notification -->
        <div
          v-if="errorMessage"
          class="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-300 text-xs flex items-center gap-2.5 animate-in fade-in"
        >
          <AlertCircle class="w-4 h-4 shrink-0 text-rose-600" />
          <span>{{ errorMessage }}</span>
        </div>

        <!-- ========================================================= -->
        <!-- VIEW 1: LOG IN -->
        <!-- ========================================================= -->
        <div v-if="currentTab === 'login'" class="space-y-6">
          <div class="space-y-1.5">
            <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-[10px] font-bold uppercase tracking-wider text-[#BA0934]">
              <span>Verified Luxe Access</span>
            </div>
            <h3 class="text-2xl font-extrabold tracking-tight">
              Welcome back to LuxeStay
            </h3>
            <p class="text-xs text-neutral-500 dark:text-neutral-400">
              Authenticate to review active reservations, access your dedicated trip designer, or manage host estate operations.
            </p>
          </div>

          <!-- Interactive 1-Click Demo Profiles -->
          <div class="space-y-2 p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-850 border border-neutral-200/80 dark:border-neutral-800">
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-extrabold uppercase tracking-wider text-neutral-400">
                Instant 1-Click Demo Profiles
              </span>
              <span class="text-[10px] text-neutral-500">Auto-fills credentials</span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <!-- Demo 1: Guest Marcus -->
              <button
                type="button"
                @click="selectDemo('guest')"
                class="p-2.5 rounded-xl border text-left transition-all flex items-center gap-2.5 cursor-pointer"
                :class="
                  selectedDemoUser === 'guest'
                    ? 'border-[#BA0934] bg-white dark:bg-neutral-800 shadow-sm ring-1 ring-[#BA0934]'
                    : 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800/60 hover:border-neutral-400'
                "
              >
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
                  alt="Marcus"
                  class="w-8 h-8 rounded-full object-cover shrink-0"
                />
                <div class="min-w-0 flex-1">
                  <div class="flex items-center justify-between">
                    <p class="text-xs font-bold text-neutral-900 dark:text-white truncate">Marcus Vance</p>
                    <span class="text-[9px] px-1.5 py-0.2 rounded bg-neutral-100 dark:bg-neutral-700 font-semibold text-[#BA0934]">Guest</span>
                  </div>
                  <p class="text-[10px] text-neutral-500 truncate">3 Bookings &bull; Dedicated Concierge</p>
                </div>
              </button>

              <!-- Demo 2: Host Alex -->
              <button
                type="button"
                @click="selectDemo('host')"
                class="p-2.5 rounded-xl border text-left transition-all flex items-center gap-2.5 cursor-pointer"
                :class="
                  selectedDemoUser === 'host'
                    ? 'border-[#BA0934] bg-white dark:bg-neutral-800 shadow-sm ring-1 ring-[#BA0934]'
                    : 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800/60 hover:border-neutral-400'
                "
              >
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                  alt="Alex"
                  class="w-8 h-8 rounded-full object-cover shrink-0"
                />
                <div class="min-w-0 flex-1">
                  <div class="flex items-center justify-between">
                    <p class="text-xs font-bold text-neutral-900 dark:text-white truncate">Alex Montgomery</p>
                    <span class="text-[9px] px-1.5 py-0.2 rounded bg-neutral-900 text-white font-semibold">Host</span>
                  </div>
                  <p class="text-[10px] text-neutral-500 truncate">2 Villas &bull; 3D Tours Active</p>
                </div>
              </button>
            </div>
          </div>

          <!-- Sign In Form -->
          <form @submit.prevent="handleLogin" class="space-y-4">
            <!-- Email Field -->
            <div class="space-y-1">
              <label class="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                Email Address
              </label>
              <div class="relative">
                <Mail class="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  v-model="loginEmail"
                  type="email"
                  required
                  placeholder="name@domain.com"
                  class="w-full text-xs pl-10 pr-4 py-3 rounded-2xl bg-neutral-50 dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:border-[#BA0934] dark:focus:border-[#BA0934]"
                />
              </div>
            </div>

            <!-- Password Field -->
            <div class="space-y-1">
              <div class="flex items-center justify-between">
                <label class="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  Password
                </label>
                <button
                  type="button"
                  @click="handleForgotPassword"
                  class="text-[11px] text-[#BA0934] hover:underline cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div class="relative">
                <Lock class="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  v-model="loginPassword"
                  :type="showPassword ? 'text' : 'password'"
                  required
                  placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                  class="w-full text-xs pl-10 pr-11 py-3 rounded-2xl bg-neutral-50 dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:border-[#BA0934] dark:focus:border-[#BA0934]"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition cursor-pointer"
                >
                  <component :is="showPassword ? EyeOff : Eye" class="w-4 h-4" />
                </button>
              </div>
            </div>

            <!-- Forgot Password Notice -->
            <div
              v-if="forgotPasswordSent"
              class="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2"
            >
              <CheckCircle2 class="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Password recovery instructions sent to {{ loginEmail }}.</span>
            </div>

            <!-- Remember Me -->
            <div class="flex items-center justify-between text-xs pt-1">
              <label class="flex items-center gap-2 cursor-pointer text-neutral-600 dark:text-neutral-400">
                <input type="checkbox" v-model="rememberMe" class="accent-[#BA0934] rounded" />
                <span>Keep me signed in on this device</span>
              </label>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              :disabled="authStore.isLoading"
              class="w-full py-3.5 px-4 rounded-2xl bg-[#BA0934] hover:bg-[#960729] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:bg-neutral-400"
            >
              <Lock class="w-3.5 h-3.5" />
              <span>{{ authStore.isLoading ? 'Authenticating...' : 'Sign In to LuxeStay' }}</span>
            </button>
          </form>

          <!-- Quick Navigation Links -->
          <div class="pt-4 border-t border-neutral-100 dark:border-neutral-800 text-center space-y-2 text-xs">
            <p class="text-neutral-500">
              New to LuxeStay?
              <button
                @click="currentTab = 'register-guest'; errorMessage = null"
                class="font-bold text-[#BA0934] hover:underline cursor-pointer ml-1"
              >
                Register as Guest Traveler
              </button>
            </p>
            <p class="text-neutral-500">
              Own an architectural residence?
              <button
                @click="currentTab = 'register-host'; errorMessage = null"
                class="font-bold text-[#BA0934] hover:underline cursor-pointer ml-1"
              >
                Register as Luxe Host
              </button>
            </p>
          </div>
        </div>

        <!-- ========================================================= -->
        <!-- VIEW 2: REGISTER AS GUEST -->
        <!-- ========================================================= -->
        <div v-else-if="currentTab === 'register-guest'" class="space-y-6">
          <div class="space-y-1.5">
            <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              <span>Guest Sanctuary Enrollment</span>
            </div>
            <h3 class="text-2xl font-extrabold tracking-tight">
              Create your Guest Profile
            </h3>
            <p class="text-xs text-neutral-500 dark:text-neutral-400">
              Unlock access to verified luxury villas, 3D spatial walkthroughs, and complimentary dedicated Trip Designer planning.
            </p>
          </div>

          <form @submit.prevent="handleRegisterGuest" class="space-y-4">
            <!-- Full Name -->
            <div class="space-y-1">
              <label class="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                Full Legal Name
              </label>
              <div class="relative">
                <User class="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  v-model="guestName"
                  type="text"
                  required
                  placeholder="e.g. Victoria Vance"
                  class="w-full text-xs pl-10 pr-4 py-3 rounded-2xl bg-neutral-50 dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:border-[#BA0934]"
                />
              </div>
            </div>

            <!-- Email Address -->
            <div class="space-y-1">
              <label class="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                Email Address
              </label>
              <div class="relative">
                <Mail class="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  v-model="guestEmail"
                  type="email"
                  required
                  placeholder="victoria@vanceestates.com"
                  class="w-full text-xs pl-10 pr-4 py-3 rounded-2xl bg-neutral-50 dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:border-[#BA0934]"
                />
              </div>
            </div>

            <!-- Password -->
            <div class="space-y-1">
              <label class="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                Create Password
              </label>
              <div class="relative">
                <Lock class="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  v-model="guestPassword"
                  :type="showPassword ? 'text' : 'password'"
                  required
                  placeholder="Minimum 8 characters"
                  class="w-full text-xs pl-10 pr-11 py-3 rounded-2xl bg-neutral-50 dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:border-[#BA0934]"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition cursor-pointer"
                >
                  <component :is="showPassword ? EyeOff : Eye" class="w-4 h-4" />
                </button>
              </div>

              <!-- Password Strength Bar -->
              <div v-if="guestPassword" class="flex items-center gap-2 pt-1">
                <div class="flex-1 h-1 rounded-full bg-neutral-200 dark:bg-neutral-700 overflow-hidden flex gap-1">
                  <div
                    class="h-full transition-all"
                    :class="[passwordStrength.color, passwordStrength.score >= 1 ? 'w-1/3' : 'w-0']"
                  ></div>
                  <div
                    class="h-full transition-all"
                    :class="[passwordStrength.color, passwordStrength.score >= 2 ? 'w-1/3' : 'w-0']"
                  ></div>
                  <div
                    class="h-full transition-all"
                    :class="[passwordStrength.color, passwordStrength.score >= 3 ? 'w-1/3' : 'w-0']"
                  ></div>
                </div>
                <span class="text-[10px] text-neutral-400 font-semibold">{{ passwordStrength.label }}</span>
              </div>
            </div>

            <!-- Phone Number for Concierge SMS/WhatsApp -->
            <div class="space-y-1">
              <label class="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                Mobile Number (for Trip Designer Updates)
              </label>
              <div class="relative">
                <Phone class="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  v-model="guestPhone"
                  type="tel"
                  placeholder="+1 (555) 345-6789"
                  class="w-full text-xs pl-10 pr-4 py-3 rounded-2xl bg-neutral-50 dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:border-[#BA0934]"
                />
              </div>
            </div>

            <!-- Luxury Aesthetics Selection -->
            <div class="space-y-2 pt-2">
              <label class="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                Preferred Villa Archetypes
              </label>
              <div class="flex flex-wrap gap-2">
                <button
                  type="button"
                  v-for="pref in luxuryStyleOptions"
                  :key="pref"
                  @click="togglePreference(pref)"
                  class="px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5"
                  :class="
                    selectedPreferences.includes(pref)
                      ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 border-neutral-900 dark:border-white shadow-xs'
                      : 'bg-neutral-50 dark:bg-neutral-850 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700 hover:border-neutral-400'
                  "
                >
                  <Check v-if="selectedPreferences.includes(pref)" class="w-3 h-3 text-[#BA0934]" />
                  <span>{{ pref }}</span>
                </button>
              </div>
            </div>

            <!-- Trip Designer Opt-in -->
            <div class="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-800 space-y-1">
              <label class="flex items-start gap-2.5 cursor-pointer text-xs">
                <input type="checkbox" v-model="requestTripDesigner" class="accent-[#BA0934] mt-0.5 rounded" />
                <div>
                  <p class="font-bold text-neutral-900 dark:text-white">Complimentary Trip Designer Assignment</p>
                  <p class="text-[11px] text-neutral-500 leading-relaxed">
                    Pairs you with an in-house luxury travel designer for private aviation, Michelin chef staffing, and tailored bespoke excursions.
                  </p>
                </div>
              </label>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              :disabled="authStore.isLoading"
              class="w-full py-3.5 px-4 rounded-2xl bg-[#BA0934] hover:bg-[#960729] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:bg-neutral-400"
            >
              <Sparkles class="w-3.5 h-3.5 text-amber-300" />
              <span>{{ authStore.isLoading ? 'Enrolling...' : 'Create Guest Sanctuary Account' }}</span>
            </button>
          </form>

          <!-- Back to Login -->
          <div class="pt-4 border-t border-neutral-100 dark:border-neutral-800 text-center text-xs text-neutral-500">
            Already have an account?
            <button
              @click="currentTab = 'login'; errorMessage = null"
              class="font-bold text-[#BA0934] hover:underline cursor-pointer ml-1"
            >
              Sign in
            </button>
          </div>
        </div>

        <!-- ========================================================= -->
        <!-- VIEW 3: REGISTER AS HOST -->
        <!-- ========================================================= -->
        <div v-else-if="currentTab === 'register-host'" class="space-y-6">
          <div class="space-y-1.5">
            <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
              <Shield class="w-3 h-3 text-[#BA0934]" />
              <span>Luxe Property Host Enlistment</span>
            </div>
            <h3 class="text-2xl font-extrabold tracking-tight">
              Enlist your Architectural Residence
            </h3>
            <p class="text-xs text-neutral-500 dark:text-neutral-400">
              List in the Airbnb Luxe Master Collection. Receive full host portal operations, booking approvals, and 300+ point certification.
            </p>
          </div>

          <form @submit.prevent="handleRegisterHost" class="space-y-4">
            <!-- Section 1: Host Personal / Entity Details -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div class="space-y-1">
                <label class="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  Host / Management Entity
                </label>
                <div class="relative">
                  <User class="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    v-model="hostName"
                    type="text"
                    required
                    placeholder="e.g. Elena Rostova"
                    class="w-full text-xs pl-10 pr-4 py-3 rounded-2xl bg-neutral-50 dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:border-[#BA0934]"
                  />
                </div>
              </div>

              <div class="space-y-1">
                <label class="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  Professional Email
                </label>
                <div class="relative">
                  <Mail class="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    v-model="hostEmail"
                    type="email"
                    required
                    placeholder="host@azureestates.com"
                    class="w-full text-xs pl-10 pr-4 py-3 rounded-2xl bg-neutral-50 dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:border-[#BA0934]"
                  />
                </div>
              </div>
            </div>

            <!-- Password -->
            <div class="space-y-1">
              <label class="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                Host Account Password
              </label>
              <div class="relative">
                <Lock class="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  v-model="hostPassword"
                  :type="showPassword ? 'text' : 'password'"
                  required
                  placeholder="Secure host portal credentials"
                  class="w-full text-xs pl-10 pr-11 py-3 rounded-2xl bg-neutral-50 dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:border-[#BA0934]"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition cursor-pointer"
                >
                  <component :is="showPassword ? EyeOff : Eye" class="w-4 h-4" />
                </button>
              </div>
            </div>

            <!-- Section 2: Estate Details -->
            <div class="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-800 space-y-3">
              <h4 class="text-xs font-extrabold uppercase tracking-wider text-neutral-900 dark:text-white flex items-center gap-1.5">
                <Building class="w-3.5 h-3.5 text-[#BA0934]" />
                <span>Primary Estate Specifications</span>
              </h4>

              <div class="space-y-1">
                <label class="block text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                  Villa / Estate Name
                </label>
                <div class="relative">
                  <Home class="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    v-model="villaName"
                    type="text"
                    required
                    placeholder="e.g. Villa Solarium or Palazzo Belvedere"
                    class="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:border-[#BA0934]"
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div class="space-y-1">
                  <label class="block text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                    Destination Location
                  </label>
                  <input
                    v-model="villaLocation"
                    type="text"
                    placeholder="e.g. Amalfi Coast, Italy"
                    class="w-full text-xs px-3 py-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:border-[#BA0934]"
                  />
                </div>

                <div class="space-y-1">
                  <label class="block text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                    Architectural Archetype
                  </label>
                  <select
                    v-model="architecturalStyle"
                    class="w-full text-xs px-3 py-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:border-[#BA0934] cursor-pointer"
                  >
                    <option v-for="opt in architecturalOptions" :key="opt" :value="opt">
                      {{ opt }}
                    </option>
                  </select>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div class="space-y-1">
                  <label class="block text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                    Number of Suites / Bedrooms
                  </label>
                  <select
                    v-model="bedroomsCount"
                    class="w-full text-xs px-3 py-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:border-[#BA0934] cursor-pointer"
                  >
                    <option v-for="n in 12" :key="n" :value="n">
                      {{ n }} {{ n === 1 ? 'Bedroom Suite' : 'Bedroom Suites' }}
                    </option>
                  </select>
                </div>

                <div class="space-y-1">
                  <label class="block text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                    Target Nightly Rate (Mex$)
                  </label>
                  <input
                    v-model="estimatedRate"
                    type="number"
                    step="1000"
                    placeholder="32000"
                    class="w-full text-xs px-3 py-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:border-[#BA0934]"
                  />
                </div>
              </div>
            </div>

            <!-- Luxe 300+ Point Inspection & 3D Spatial LiDAR Scan Opt-in -->
            <div class="p-3.5 rounded-2xl bg-neutral-900 text-white space-y-2">
              <label class="flex items-start gap-2.5 cursor-pointer text-xs">
                <input type="checkbox" v-model="requestInspection" class="accent-[#BA0934] mt-0.5 rounded" />
                <div>
                  <div class="flex items-center gap-1.5 font-bold text-amber-400">
                    <Shield class="w-3.5 h-3.5 text-[#BA0934]" />
                    <span>Request Complimentary 300+ Point Luxe Inspection</span>
                  </div>
                  <p class="text-[11px] text-neutral-300 leading-relaxed mt-0.5">
                    Includes in-person verification by our architectural team and automated 3D spatial tour generation for high-intent luxury bookings.
                  </p>
                </div>
              </label>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              :disabled="authStore.isLoading"
              class="w-full py-3.5 px-4 rounded-2xl bg-[#BA0934] hover:bg-[#960729] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:bg-neutral-400"
            >
              <Building class="w-3.5 h-3.5" />
              <span>{{ authStore.isLoading ? 'Enlisting...' : 'Enlist Estate & Create Host Account' }}</span>
            </button>
          </form>

          <!-- Back to Login -->
          <div class="pt-4 border-t border-neutral-100 dark:border-neutral-800 text-center text-xs text-neutral-500">
            Already registered as a host?
            <button
              @click="currentTab = 'login'; errorMessage = null"
              class="font-bold text-[#BA0934] hover:underline cursor-pointer ml-1"
            >
              Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
