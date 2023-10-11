import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import { IHotels } from './../types/Hotels';
import useApiUrl from '@/composables/useApiUrl';
const { getApiUrl } = useApiUrl();
const apiUrl = getApiUrl();
import axios from 'axios';

interface IHotelSelected {
  id: number;
  name: string;
  rooms: { id: string; name?: string }[];
}

export const useSearchStore = defineStore('searchStore', () => {
  // Esta váriavel controla se o formulário de busca está completo para poder efetuar a busca.
  const isFormComplete = ref<boolean>(false);
  // Esta váriavel controla o estado esta rolando o FETCHING da API
  const isLoading = ref<boolean>(false);
  // searchError serve para quando a API retornor err=1, que pode significar vários erros, mas Welington pediu para mostrar a mensagem "Nenhum hotel encontrado no destino!"
  const searchError = ref<boolean>(false);
  const criteria = ref({
    destination: '',
    dates: [] as string[],
    rooms: 0 as number,
    pax: [] as number[],
    children: [0] as number[],
    childrenAges: {} as Record<string, number>,
  });

  const hotels = ref<IHotels[] | null>(null); // Armazena os dados dos voos que recebeu da API.

  const hotelSelectedWithRooms = ref<IHotelSelected[]>([]);

  const searchHotels = async () => {
    // Pegar o token do localStorage
    const authLocalStore = JSON.parse(localStorage.getItem('authStore') || '{}');
    const token = authLocalStore.token;
    isLoading.value = true;
    try {
      const { data } = await axios.post(`${apiUrl}/api/v2/search/hotels`, criteria.value, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (data && data.response.err === 1) {
        console.log('ERRO 1', data.response.err);
        searchError.value = true;
        return;
      }

      hotels.value = data?.response?.hotels;
      isLoading.value = false;
    } catch (error: any) {
      if (error.response) {
        throw createError({
          statusCode: error.response.status,
          statusMessage: 'API fora do ar. Entre em contato com o GRUPO BRT!',
        });
      }
    }
  };
  // Função para verificar se o formulário ta completo na hora da busca
  watch(
    criteria,
    () => {
      const { destination, dates, rooms, pax } = criteria.value;

      isFormComplete.value = Boolean(
        destination && dates.length > 0 && rooms > 0 && pax.length >= rooms // Garante que há um item em pax para cada quarto
      );
    },
    { deep: true }
  );
  // Está função é para verificar a mudança de rooms e adicionar os PAX os CHILDRENS
  watch(
    () => criteria.value.rooms,
    (newRoomsValue) => {
      if (criteria.value.pax.length < newRoomsValue) {
        const additionalRooms = newRoomsValue - criteria.value.pax.length;
        criteria.value.pax = [...criteria.value.pax, ...Array(additionalRooms).fill(1)];
      } else {
        criteria.value.pax = criteria.value.pax.slice(0, newRoomsValue);
      }

      if (criteria.value.children.length < newRoomsValue) {
        const additionalRooms = newRoomsValue - criteria.value.children.length;
        criteria.value.children = [...criteria.value.children, ...Array(additionalRooms).fill(0)];
      } else {
        criteria.value.children = criteria.value.children.slice(0, newRoomsValue);
      }
    },
    { immediate: true }
  );

  const $reset = (): void => {
    criteria.value = {
      destination: '',
      dates: [] as string[],
      rooms: 0 as number,
      pax: [] as number[],
      children: [0] as number[],
      childrenAges: {} as Record<string, number>,
    };
    hotels.value = null;
    searchError.value = false;
    hotelSelectedWithRooms.value = [];
  };

  return {
    criteria,
    hotels,
    searchError,
    isFormComplete,
    searchHotels,
    hotelSelectedWithRooms,
    isLoading,
    $reset,
  };
});
