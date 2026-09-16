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
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<UserProfile | null>(null);
  const token = ref<string | null>(localStorage.getItem('luxestay_token'));
  const isLoading = ref(false);
  const authError = ref<string | null>(null);

  const isHost = computed(() => user.value?.role === 'host' || user.value?.role === 'admin');
  const isGuest = computed(() => user.value?.role === 'guest');

  async function checkAuth() {
    try {
      isLoading.value = true;
      const res = await api.getMe();
      if (res.success && res.data) {
        user.value = res.data;
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

  async function register(name: string, email: string, password: string, role: string = 'guest') {
    isLoading.value = true;
    authError.value = null;
    try {
      const res = await api.register({ name, email, password, role });
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

  return {
    user,
    token,
    isLoading,
    authError,
    isHost,
    isGuest,
    checkAuth,
    login,
    register,
    logout,
  };
});
