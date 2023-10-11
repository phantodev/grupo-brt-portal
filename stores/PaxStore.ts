import { defineStore } from 'pinia';
import { useToast } from 'vue-toastification';
import { ListPaxes } from 'types/SavePaxes';
const toast = useToast();
import { ref } from 'vue';
import useApiUrl from '@/composables/useApiUrl';
const { getApiUrl } = useApiUrl();
const apiUrl = getApiUrl();
import axios from 'axios';

export const usePaxStore = defineStore('paxStore', () => {
  // Esta REF quando a pessoa está pela primeira vez preenchendo o campo e o objeto paxes_filled === 0
  // Controlo se os paxes foram salvos no BANCO e mudo para true.
  const allPaxesSaved = ref<boolean>(false);
  // Esta REF é para saber se todos os passagerios estão preenchidos com CPF válidos!
  const isPaxesValid = ref<boolean>(false);
  // Esta váriavel controla o estado esta rolando o FETCHING da API
  const isLoading = ref<boolean>(false);
  // Aqui é a linha para começar vazio os PAXES
  const listPaxes = ref<ListPaxes>([]);
  // Aqui é a linha quando os paxes foram preechidos já
  // const listPaxes = ref<Hotels>([
  //   {
  //     hotelId: 3138,
  //     rooms: [
  //       {
  //         roomId: '10221#40587-2',
  //         paxes: [
  //           {
  //             name: 'Edu',
  //             email: 'edu@edu.com'
  //           },
  //           {
  //             name: 'Valdo',
  //             email: 'valdo@valdo.com'
  //           }
  //         ]
  //       }
  //     ]
  //   },
  //   {
  //     hotelId: 3138,
  //     rooms: [
  //       {
  //         roomId: '10221#40587-2',
  //         paxes: [
  //           {
  //             name: 'Helan',
  //             email: 'helan@edu.com'
  //           },
  //           {
  //             name: 'dike',
  //             email: 'dike@dike.com'
  //           }
  //         ]
  //       }
  //     ]
  //   }
  // ])
  const paxesPlayload = ref({
    budgetId: 0,
    hotels: listPaxes.value,
  });

  const getPaxesFromBudget = () => {
    // Ler o objeto paxes do budget e colocar no listPaxes
  };

  const savePaxes = async (budgetId: number) => {
    // Verifica se o isPaxes é igual a TRUE
    if (isPaxesValid.value) {
      // Enviar os PAXES para  API
      paxesPlayload.value.budgetId = budgetId;
      const authLocalStore = JSON.parse(localStorage.getItem('authStore') || '{}');
      const token = authLocalStore.token;
      isLoading.value = true;
      try {
        const { data } = await axios.post(`${apiUrl}/api/v2/budgets/save-pax`, paxesPlayload.value, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (data) {
          toast.success('Passageiros salvos com sucesso. Agora você pode reservar!');
          allPaxesSaved.value = true;
          isLoading.value = false;
        }
      } catch (error: any) {
        if (error.response) {
          throw createError({
            statusCode: error.response.status,
            statusMessage: 'API fora do ar. Entre em contato com o GRUPO BRT!',
          });
        }
      }
    } else {
      toast.error('Você possui campos de hóspedes inválidos!');
    }
  };

  return {
    listPaxes,
    isLoading,
    isPaxesValid,
    savePaxes,
    paxesPlayload,
    getPaxesFromBudget,
    allPaxesSaved,
  };
});
