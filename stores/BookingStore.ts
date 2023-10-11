import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router';
const { getApiUrl } = useApiUrl();
const apiUrl = getApiUrl();
import { useToast } from 'vue-toastification';
const toast = useToast();
const route = useRoute();

export const useBookingStore = defineStore('bookingStore', () => {
  const isBooking = ref(false);
  const sideBarOpen = ref<Boolean>(false);
  const budgetSelectedInfos = ref();
  const bookPayload = ref({
    budgetId: 0,
    pax: [],
    hotelId: 0,
    roomId: '',
    option: 1,
    location: '',
  });
  const createBook = async () => {
    isBooking.value = true;
    bookPayload.value.budgetId = budgetSelectedInfos.value.id;
    bookPayload.value.pax = budgetSelectedInfos.value.pax;
    bookPayload.value.hotelId = budgetSelectedInfos.value.hotels[0][0].items[0].hotel.id;
    bookPayload.value.roomId = budgetSelectedInfos.value.hotels[0][0].items[0].room[0].id;
    bookPayload.value.location = budgetSelectedInfos.value.hotels[0][0].items[0].city;
    // Pegar o token do localStorage
    const authLocalStore = JSON.parse(localStorage.getItem('authStore') || '{}');
    const token = authLocalStore.token;
    try {
      const { data } = await axios.post(`${apiUrl}/api/v1/cart/hotels/book`, bookPayload.value, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (data) {
        toast.success('Booking efetuado com sucesso!', {
          onClose: () => {
            isBooking.value = false;
            // Pegar o orçamento atualizado toda vez que entra nesta rota!
            getBudget(route.params.id);
          },
        });
      }
    } catch (error) {
      toast.error('Booking não efetuado. Problemas técnicos!', {
        onClose: () => {
          isBooking.value = false;
        },
      });
    }
  };
  const getBudget = async (id: any) => {
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
        budgetSelectedInfos.value = data.data;
      }
    } catch (error) {
      console.error('Erro na chamada da API:', error);
    }
  };
  return {
    createBook,
    getBudget,
    budgetSelectedInfos,
    sideBarOpen,
    isBooking,
  };
});
