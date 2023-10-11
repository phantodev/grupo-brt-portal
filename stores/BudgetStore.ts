import { defineStore } from 'pinia';
import axios from 'axios';
import useApiUrl from '@/composables/useApiUrl';
import { IHotelToReserve } from '~/types/Bookings';
import { useToast } from 'vue-toastification';
const { getApiUrl } = useApiUrl();
const apiUrl = getApiUrl();
const toast = useToast();

export const useBudgetStore = defineStore('budgetStore', () => {
  // Defina hotelTest como um array que contém hotelItem
  const hotelsToReserve = ref<Array<IHotelToReserve>>([]);
  const budgetSelectedInfos = ref();

  const getBudget = async (id: any) => {
    console.log('ENTROU NO GET!');
    // Pegar o token do localStorage
    const authLocalStore = JSON.parse(localStorage.getItem('authStore') || '{}');
    const token = authLocalStore.token;
    try {
      const { data } = await axios.get(`${apiUrl}/api/v1/budgets/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (data) {
        console.log('ENTROU AQUI NO BUDGET!');
        budgetSelectedInfos.value = data.data;
      }
    } catch (error) {
      console.error('Erro na chamada da API:', error);
    }
  };
  const addHotelToReserve = (dataHotel: IHotelToReserve) => {
    if (hotelsToReserve.value.length < budgetSelectedInfos.value.criteria.hotels[0].rooms) {
      hotelsToReserve.value.push(dataHotel);
    } else {
      toast.error('Limite de quartos excedido. Exclua se necessário!');
    }
  };

  const removeHotelToReserve = (hotelIndex: number) => {
    hotelsToReserve.value.splice(hotelIndex, 1);
  };

  const $reset = (): void => {
    // budgetSelectedInfos.value = undefined;
  };

  return {
    getBudget,
    budgetSelectedInfos,
    hotelsToReserve,
    addHotelToReserve,
    removeHotelToReserve,
    $reset,
  };
});
