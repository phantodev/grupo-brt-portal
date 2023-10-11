import { defineStore } from 'pinia';

export const useAuthStore = defineStore(
  'authStore',
  () => {
    const cnpjTenant = ref<string>('');
    const token = ref<string>('');
    const name = ref<string>('');
    const email = ref<string>('');
    const consultant = ref<string>('');
    const permissions = ref<string[]>([]);
    const productsReleased = ref({
      hostel: true,
      flight: false,
    });

    return {
      token,
      cnpjTenant,
      permissions,
      productsReleased,
      consultant,
      name,
      email,
    };
  },
  { persist: { storage: persistedState.localStorage } }
);
