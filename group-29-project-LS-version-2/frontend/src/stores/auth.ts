import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { api } from '../services/api';

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: 'guest' | 'host' | 'admin';
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

export const useAuthStore = defineStore('auth', () => {
  // Real authentication state: starts as null when logged out
  const user = ref<UserProfile | null>(null);
  const token = ref<string | null>(localStorage.getItem('luxestay_token'));
  const isLoading = ref(false);
  const authError = ref<string | null>(null);

  // Global Auth Modal Controls
  const isAuthModalOpen = ref(false);
  const authModalTab = ref<'login' | 'register-guest' | 'register-host'>('login');
  const authPromptReason = ref<string>('');

  function openAuth(tab: 'login' | 'register-guest' | 'register-host' = 'login', reason: string = '') {
    authModalTab.value = tab;
    authPromptReason.value = reason;
    isAuthModalOpen.value = true;
  }

  function closeAuth() {
    isAuthModalOpen.value = false;
    authPromptReason.value = '';
  }

  const isHost = computed(() => user.value?.role === 'host' || user.value?.role === 'admin');
  const isGuest = computed(() => user.value?.role === 'guest');

  async function checkAuth() {
    const savedToken = localStorage.getItem('luxestay_token');
    if (!savedToken) {
      user.value = null;
      token.value = null;
      return;
    }

    try {
      isLoading.value = true;
      const res = await api.getMe();
      if (res.success && res.data) {
        user.value = res.data;
        token.value = savedToken;
      } else {
        user.value = null;
        token.value = null;
        localStorage.removeItem('luxestay_token');
      }
    } catch (e) {
      user.value = null;
      token.value = null;
      localStorage.removeItem('luxestay_token');
    } finally {
      isLoading.value = false;
    }
  }

  async function login(email: string, password: string) {
    isLoading.value = true;
    authError.value = null;
    try {
      const res = await api.login({ email, password });
      if (res.success) {
        user.value = res.data.user;
        token.value = res.data.token;
        localStorage.setItem('luxestay_token', res.data.token);
        return true;
      }
    } catch (err: any) {
      authError.value = err.message || 'Login failed';
      throw err;
    } finally {
      isLoading.value = false;
    }
    return false;
  }

  async function register(payload: {
    name: string;
    email: string;
    password?: string;
    role: 'guest' | 'host';
    phone?: string;
    travel_preferences?: string[];
    villa_name?: string;
    villa_location?: string;
    architectural_style?: string;
    bedrooms?: number;
    nightly_rate?: number;
    inspection_requested?: boolean;
  } | string, emailArg?: string, passwordArg?: string, roleArg: string = 'guest') {
    isLoading.value = true;
    authError.value = null;
    try {
      const data = typeof payload === 'string'
        ? { name: payload, email: emailArg || '', password: passwordArg || '', role: (roleArg as 'guest' | 'host') || 'guest' }
        : payload;

      const res = await api.register(data);
      if (res.success) {
        user.value = res.data.user;
        token.value = res.data.token;
        localStorage.setItem('luxestay_token', res.data.token);
        return true;
      }
    } catch (err: any) {
      authError.value = err.message || 'Registration failed';
      throw err;
    } finally {
      isLoading.value = false;
    }
    return false;
  }

  async function logout() {
    try {
      await api.logout();
    } catch (e) {
      // ignore
    }
    user.value = null;
    token.value = null;
    localStorage.removeItem('luxestay_token');
  }

  async function switchRole(newRole: 'host' | 'guest') {
    if (newRole === 'host') {
      try {
        await login('host@luxestay.com', 'password');
      } catch (e) {
        user.value = {
          id: 1,
          name: 'Alex Montgomery',
          email: 'host@luxestay.com',
          role: 'host',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
          is_host: true,
          is_guest: false,
        };
      }
    } else {
      try {
        await login('guest@luxestay.com', 'password');
      } catch (e) {
        user.value = {
          id: 2,
          name: 'Marcus Vance',
          email: 'guest@luxestay.com',
          role: 'guest',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
          is_host: false,
          is_guest: true,
        };
      }
    }
  }

  return {
    user,
    token,
    isLoading,
    authError,
    isHost,
    isGuest,
    isAuthModalOpen,
    authModalTab,
    authPromptReason,
    openAuth,
    closeAuth,
    checkAuth,
    login,
    register,
    logout,
    switchRole,
  };
});
