import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';
import useApiUrl from '@/composables/useApiUrl';
const { getApiUrl } = useApiUrl();
const apiUrl = getApiUrl();

export const useCurrencyStore = defineStore('currencyStore', () => {
  const EUR = ref<string>('');
  const USD = ref<string>('');
  const GBP = ref<string>('');

  const getAllCurrencies = async () => {
    // Pegar o token do localStorage
    const authLocalStore = JSON.parse(localStorage.getItem('authStore') || '{}');
    const token = authLocalStore.token;
    try {
      const { data } = await axios.get(`${apiUrl}/api/v1/exchanges`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      EUR.value = data.data[0].EUR;
      USD.value = data.data[0].USD;
      GBP.value = data.data[0].GBP;
    } catch (error: any) {
      if (error.response) {
        throw createError({
          statusCode: error.response.status,
          statusMessage: 'API getAllBudgets fora do ar. Entre em contato com o GRUPO BRT!',
        });
      }
    }
  };
  return {
    EUR,
    USD,
    GBP,
    getAllCurrencies,
  };
});
