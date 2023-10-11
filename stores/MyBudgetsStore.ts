import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import axios from 'axios';
import { ApiResponse } from '../types/MyBudgets';
import useApiUrl from '@/composables/useApiUrl';
import { useToast } from 'vue-toastification';
const { getApiUrl } = useApiUrl();
const apiUrl = getApiUrl();

export const useMyBudgetsStore = defineStore('myBudgetsStore', () => {
  const page = ref(1);
  const myBudgets = ref<ApiResponse | null>(null);
  const getAllBudgets = async () => {
    // Pegar o token do localStorage
    const authLocalStore = JSON.parse(localStorage.getItem('authStore') || '{}');
    const token = authLocalStore.token;
    try {
      const { data } = await axios.get(
        `${apiUrl}/api/v1/budgets-by-user?page=${page.value}&sort=created_at&dir=desc&perPage=20`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      myBudgets.value = data;
    } catch (error: any) {
      if (error.response) {
        throw createError({
          statusCode: error.response.status,
          statusMessage: 'API getAllBudgets fora do ar. Entre em contato com o GRUPO BRT!',
        });
      }
    }
  };
  watch(page, (newPage) => {
    getAllBudgets();
  });
  return {
    getAllBudgets,
    myBudgets,
    page,
  };
});
