import { defineStore } from 'pinia';
import axios from 'axios';
import { IHotelToReserve } from '../types/Bookings';
import { useToast } from 'vue-toastification';
// import { useSearchStore } from './SearchStore';
import useApiUrl from '@/composables/useApiUrl';
import { HotelCriteria, UserChoice } from '../types/Hotels';
const { getApiUrl } = useApiUrl();
const apiUrl = getApiUrl();
// const searchStore = useSearchStore();
const toast = useToast();

export const useHotelStore = defineStore('hotelStore', () => {
  // ###############################################
  // As REFs abaixo são relacionadas ao FILTRO
  // ###############################################
  const searchQuery = ref('');
  const breakfastFilter = ref({
    withBreakfast: true,
    withoutBreakfast: true,
  });
  const minPrice = ref(0);
  const maxPrice = ref(2000);
  const rangePriceFilter = ref([0, 2000]);
  const categoryFilter: Ref<{ [key: number]: boolean }> = ref({
    1: true,
    2: true,
    3: true,
    4: true,
    5: true,
  });
  // ###############################################
  // ###############################################
  // Pegar o token do localStorage
  const token = ref('');
  const consultant = ref('');
  // Defina hotelTest como um array que contém hotelItem
  const budgetId = ref<string>('');
  const hotelsToReserve = ref<Array<IHotelToReserve>>([]);
  const isLoading = ref(false);
  const userChoice = ref<UserChoice>({
    consultant: '',
    criteria: {
      hotels: [],
      flights: null,
      services: null,
    },
    items: {
      hotel: [],
      flight: [],
      service: [],
    },
  });

  const createBudget = async (criteria: HotelCriteria) => {
    isLoading.value = true;
    userChoice.value.criteria.hotels.push(criteria as HotelCriteria);
    // userChoice.value.criteria.hotels[0] = criteria;
    const authLocalStore = JSON.parse(localStorage.getItem('authStore') || '{}');
    token.value = authLocalStore.token || '';
    userChoice.value.consultant = authLocalStore.consultant || '';
    try {
      const { data } = await axios.post(`${apiUrl}/api/v1/cart/create-budget`, userChoice.value, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.value}`,
        },
      });
      if (data) {
        toast.success('Orçamento criado com sucesso!', {
          onClose: () => {
            isLoading.value = false;
            navigateTo('/budget/' + data.data.id);
          },
        });
      }
    } catch (error) {
      console.error('Erro na chamada da API:', error);
    }
  };

  const $reset = (): void => {
    hotelsToReserve.value = [];
  };

  return {
    createBudget,
    budgetId,
    userChoice,
    hotelsToReserve,
    $reset,
    token,
    consultant,
    minPrice,
    maxPrice,
    rangePriceFilter,
    searchQuery,
    breakfastFilter,
    categoryFilter,
    isLoading,
  };
});
