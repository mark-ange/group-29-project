<script setup lang="ts">
import { ref } from 'vue';
import { X, Lock, Mail, User, AlertCircle } from 'lucide-vue-next';
import { useAuthStore } from '../stores/auth';

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'authSuccess'): void;
}>();

const authStore = useAuthStore();

const isRegister = ref(false);
const name = ref('');
const email = ref('');
const password = ref('');
const role = ref<'guest' | 'host'>('guest');
const errorMessage = ref<string | null>(null);

const handleSubmit = async () => {
  errorMessage.value = null;
  try {
    if (isRegister.value) {
      await authStore.register(name.value, email.value, password.value, role.value);
    } else {
      await authStore.login(email.value, password.value);
    }
    emit('authSuccess');
    emit('close');
  } catch (err: any) {
    errorMessage.value = err.message || 'Authentication failed';
  }
};

</script>

<template>
  <div class="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
    <div class="relative w-full max-w-md rounded-3xl bg-white shadow-2xl border border-neutral-200/80 p-8 space-y-6 animate-in fade-in zoom-in-95">
      <!-- Close Button -->
      <button
        @click="emit('close')"
        class="absolute top-5 right-5 p-2 rounded-full text-neutral-400 hover:text-neutral-900 transition-colors"
      >
        <X class="w-5 h-5" />
      </button>

      <!-- Header -->
      <div class="space-y-1">
        <div class="w-10 h-10 rounded-2xl bg-[#1A1A1A] flex items-center justify-center text-white mb-3 shadow">
          <Lock class="w-5 h-5 text-[#BA0934]" />
        </div>
        <h2 class="text-2xl font-extrabold text-[#1A1A1A]">
          {{ isRegister ? 'Join the Sanctuary Collection' : 'Authenticate to LuxeStay' }}
        </h2>
        <p class="text-xs text-neutral-500">
          {{ isRegister ? 'Register your private credentials on PostgreSQL' : 'Sign in to review confirmed bookings and 3D architectural files' }}
        </p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div v-if="isRegister" class="space-y-1">
          <label class="block text-[11px] font-bold uppercase tracking-wider text-neutral-500">Full Name</label>
          <div class="relative">
            <User class="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              v-model="name"
              type="text"
              required
              placeholder="Victoria Vance"
              class="w-full text-xs pl-10 pr-4 py-3 rounded-2xl bg-neutral-50 border border-neutral-200 focus:outline-none focus:border-[#BA0934]"
            />
          </div>
        </div>

        <div class="space-y-1">
          <label class="block text-[11px] font-bold uppercase tracking-wider text-neutral-500">Email Address</label>
          <div class="relative">
            <Mail class="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              v-model="email"
              type="email"
              required
              placeholder="you@domain.com"
              class="w-full text-xs pl-10 pr-4 py-3 rounded-2xl bg-neutral-50 border border-neutral-200 focus:outline-none focus:border-[#BA0934]"
            />
          </div>
        </div>

        <div class="space-y-1">
          <label class="block text-[11px] font-bold uppercase tracking-wider text-neutral-500">Password</label>
          <div class="relative">
            <Lock class="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              v-model="password"
              type="password"
              required
              placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
              class="w-full text-xs pl-10 pr-4 py-3 rounded-2xl bg-neutral-50 border border-neutral-200 focus:outline-none focus:border-[#BA0934]"
            />
          </div>
        </div>

        <div v-if="isRegister" class="space-y-1">
          <label class="block text-[11px] font-bold uppercase tracking-wider text-neutral-500">Role</label>
          <div class="grid grid-cols-2 gap-2">
            <button
              type="button"
              @click="role = 'guest'"
              :class="[
                'py-2.5 px-3 rounded-2xl text-xs font-bold border transition-colors',
                role === 'guest' ? 'bg-[#1A1A1A] text-white border-transparent' : 'bg-neutral-50 text-neutral-700 border-neutral-200',
              ]"
            >
              Guest Traveler
            </button>
            <button
              type="button"
              @click="role = 'host'"
              :class="[
                'py-2.5 px-3 rounded-2xl text-xs font-bold border transition-colors',
                role === 'host' ? 'bg-[#1A1A1A] text-white border-transparent' : 'bg-neutral-50 text-neutral-700 border-neutral-200',
              ]"
            >
              Property Host
            </button>
          </div>
        </div>

        <!-- Error Alert -->
        <div v-if="errorMessage" class="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle class="w-4 h-4 flex-shrink-0" />
          <span>{{ errorMessage }}</span>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="authStore.isLoading"
          class="w-full py-3.5 px-4 rounded-2xl bg-[#BA0934] hover:bg-[#960729] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
        >
          <span>{{ authStore.isLoading ? 'Authenticating...' : isRegister ? 'Register Sanctuary Account' : 'Sign In' }}</span>
        </button>
      </form>

      <!-- Toggle Mode -->
      <div class="text-center pt-2 border-t border-neutral-100">
        <button
          @click="isRegister = !isRegister; errorMessage = null"
          class="text-xs font-medium text-neutral-600 hover:text-[#BA0934] transition-colors"
        >
          {{ isRegister ? 'Already have an account? Sign in' : "Don't have an account? Register now" }}
        </button>
      </div>
    </div>
  </div>
</template>
