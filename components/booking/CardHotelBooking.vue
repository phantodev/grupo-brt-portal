<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';
// Import referente a escolha de trabalhar com a API de HOMOLOG ou PRODUÇÃO
import useApiUrl from '@/composables/useApiUrl';
const { getApiUrl } = useApiUrl();
const apiUrl = getApiUrl();
// Import referente a utilização de TOASTS
import { useToast } from 'vue-toastification';
const toast = useToast();
const route = useRoute();

const props = defineProps({
  // Todos os hotéis feito em uma reserva
  items: {
    type: Object,
    required: true,
  },
  // Armazena o BOOKING CODE
  bookingCode: {
    type: String,
    default: '',
    required: true,
  },
  // Armazena a cada permitida para cancelar o BOOKING, mostra ou não o botão de cancelar reserva.
  cancelData: {
    type: String,
    default: '',
    required: true,
  },
  // Armazena o status do BOOKING, cancelled, reserved, created, etc...
  status: {
    type: Object,
    required: true,
  },
  // Este indice do hotel ajuda para fazer a montagem dos PAXES dentro do componente CardRoomBookin
  hotelIndex: {
    type: Number,
    required: true,
  },
});

// REF para controlar o spinner no botão CANCELAR.
const isCanceling = ref(false);

// REF para controlar o spinner do PRELOAD da imagem de hotéis.
const isLoading = ref(false);

// Função chamada quando a imagem COMEÇAR A CARREGAR
const imageLoading = () => {
  isLoading.value = true;
};
// Função chamada quando a imagem TERMINAR DE CARREGAR
const imageLoaded = () => {
  isLoading.value = false;
};
// Função chamada quando a imagem NÃO VIR DA OMNIBEES OU HOTELBEDS
const imageError = (event: Event) => {
  (event.target as HTMLImageElement).src = '../../assets/no-photo-hotel.png';
  isLoading.value = false; // A imagem não foi carregada, mas o erro é tratado, então paramos de exibir o ícone de carregamento
};

// ===========================================================================
// Função para CANCELAR o BOOKING EFETUADO
// ===========================================================================
const cancelBooking = async () => {
  isCanceling.value = true;
  const authLocalStore = JSON.parse(localStorage.getItem('authStore') || '{}');
  const axiosPayload = {
    reservation: props.bookingCode,
    budgetId: route.params.id,
  };
  try {
    const { data } = await axios.post(`${apiUrl}/api/v1/cart/hotels/cancel`, axiosPayload, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authLocalStore.token}`,
      },
    });
    if (data) {
      toast.success('Booking Cancelado com sucesso!', {
        onClose: () => {
          isCanceling.value = false;
          // RELOAD da página para atualizar o status na tela. Aqui temos que refazer a lógica para mudar as informações SEM RELOAD
          window.location.reload();
        },
      });
    }
  } catch (error) {
    console.error('Erro na chamada da API:', error);
    toast.error('BOOKING CODE inexistente ou já cancelado!');
  }
};
</script>
<template>
  <section class="wrapper-hotel">
    <div class="container-hotel">
      <div class="container-photo-hotel">
        <div v-if="isLoading" class="loader-icon-hotel-img">
          <img src="/assets/spinnerBlue.svg" alt="w-10" />
        </div>
        <!-- Componentes de imagem do NUXT para mostrar a imagem vinda da API ou uma imagem FIXA de "IMAGEM NÃO DISPONÍVEL"-->>
        <nuxt-img
          v-if="props.items.hotel.mainImage"
          class="image-hotel"
          fit="cover"
          :src="props.items.hotel.mainImage"
          loading="lazy"
          @load="imageLoaded"
          @loadstart="imageLoading"
          @error="imageError"
        />
        <nuxt-img
          v-else
          class="image-hotel"
          fit="cover"
          src="../../assets/no-photo-hotel.png"
          loading="lazy"
          @load="imageLoaded"
          @error="imageError"
          @loadstart="imageLoading"
        />
      </div>
      <div class="wrapper-info-hotel">
        <div class="container-info-hotel">
          <div class="hotel-name">
            {{ props.items.hotel.name }}
            <div class="review-stars" v-for="start in props.items.hotel.category">
              <StarIcon />
            </div>
          </div>
          <div class="hotel-address">
            {{ props.items.hotel.address + ' - ' + props.items.city }}
          </div>
        </div>
        <div class="container-btn-booking-cancel">
          <div class="container-booking-code" v-if="props.bookingCode !== ''">
            <span class="text-xl">😜</span>
            <span class="text-white"> {{ props.bookingCode }}</span>
          </div>
          <button
            :disabled="isCanceling"
            @click="cancelBooking"
            class="btn-cancel-booking"
            v-if="props.cancelData !== '' && props.status.name !== 'cancelled'"
          >
            <span class="text-xl">😩</span>
            <span class="text-xs">
              <span v-if="!isCanceling"> Cancelar Reserva</span>
              <img v-else src="~/assets/spinner.svg" alt="" class="w-6 h-6" />
            </span>
          </button>
        </div>
      </div>
    </div>
    <div class="wrapper-container-card-rooms">
      <div class="w-full">
        <CardRoomsBooking
          :hotelIndex="props.hotelIndex"
          :room="items.room"
          :idHotel="items.hotel.id"
          :status="props.status"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.container-btn-booking-cancel {
  @apply flex gap-4;
}
.container-booking-code {
  @apply flex flex-row gap-4;
}
.btn-cancel-booking {
  @apply text-white bg-red-700 font-bold rounded-md px-6 py-3 flex items-center gap-2;
}
.container-booking-code {
  @apply text-white bg-lime-600 font-bold text-xs rounded-md px-6 py-3 flex items-center gap-2;
}
.show-btn-reserve-and-change-hosting {
  @apply flex-1 flex flex-col gap-2;
}
.loader-icon-hotel-img {
  @apply flex items-center justify-center h-full;
}
.image-hotel {
  @apply absolute inset-0 object-cover object-left w-full h-full;
}
.wrapper-container-card-rooms {
  @apply w-full p-4  bg-slate-200 rounded-b-lg flex flex-col md:flex-row flex-wrap items-center;
}
.wrapper-info-hotel {
  @apply w-full  bg-slate-100 p-6 flex flex-row justify-between items-center;
}
.container-info-hotel {
  @apply flex gap-2 flex-col;
}
.container-photo-hotel {
  @apply w-36 object-cover relative;
}
.wrapper-hotel {
  @apply flex flex-col w-full max-w-6xl rounded-lg overflow-hidden shadow-2xl bg-white mb-4;
}
.container-hotel {
  @apply flex flex-col md:flex-row w-full;
}

.review-stars {
  @apply flex flex-row mt-[-3px];
}
.hotel-name {
  @apply font-bold text-lg flex items-center gap-2;
}
.hotel-address {
  @apply text-xs capitalize;
}
</style>
