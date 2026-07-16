import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { User } from '../types';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const accessToken = ref<string | null>(null);
  const refreshToken = ref<string | null>(null);
  const isAuthenticated = ref<boolean>(false);

  function setAuth(newUser: User, newAccessToken: string, newRefreshToken: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', newAccessToken);
      localStorage.setItem('refreshToken', newRefreshToken);
    }
    user.value = newUser;
    accessToken.value = newAccessToken;
    refreshToken.value = newRefreshToken;
    isAuthenticated.value = true;
  }

  function clearAuth() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
    user.value = null;
    accessToken.value = null;
    refreshToken.value = null;
    isAuthenticated.value = false;
  }

  function updateUser(updatedUser: Partial<User>) {
    if (user.value) {
      user.value = { ...user.value, ...updatedUser };
    }
  }

  return {
    user,
    accessToken,
    refreshToken,
    isAuthenticated,
    setAuth,
    clearAuth,
    updateUser,
  };
}, {
  persist: {
    storage: localStorage,
    pick: ['user', 'accessToken', 'refreshToken', 'isAuthenticated'],
  }
});
