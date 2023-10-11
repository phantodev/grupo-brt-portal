<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { IRooms } from '../../types/Hotels';
import axios from 'axios';
import useApiUrl from '@/composables/useApiUrl';
import { ICancellationPolicies } from '~/types/CancellationPolicies';
const { getApiUrl } = useApiUrl();
import { useDateFormatter } from '../../composables/useDateFormatter';
const { formatDate } = useDateFormatter();
const apiUrl = getApiUrl();
import { Pax } from '~/types/SavePaxes';
import { useBookingStore } from '../../stores/BookingStore';
const bookingStore = useBookingStore();

const props = defineProps({
  room: {
    type: Array as () => IRooms[],
    required: true,
  },
  idHotel: {
    type: Number,
    required: true,
  },
  hotelIndex: {
    type: Number,
    required: true,
  },
  // Armazena o status do BOOKING, cancelled, reserved, created, etc...
  status: {
    type: Object,
    required: true,
  },
});

const paxListOfThisHotel = ref<Pax[]>([]);
const startDate = ref(bookingStore.budgetSelectedInfos.criteria.hotels[0].dates[0]);
const endDate = ref(bookingStore.budgetSelectedInfos.criteria.hotels[0].dates[1]);
const destination = ref(bookingStore.budgetSelectedInfos.criteria.hotels[0].destination);

// Um array de politicas de cacelamento de acordo com o hotel
const cancellationPolicies = ref<ICancellationPolicies[][]>([]);

onMounted(async () => {
  // Essa lógica é para capturar todos os paxes deste ROOM que vem dentro do OBJETO pax em budgetSelectedInfos e adicionar dentro do array aqui neste componente.
  const targetRoom = props.hotelIndex + 1; // Adiciona 1 ao hotelIndex
  const paxes: Pax[] = bookingStore.budgetSelectedInfos.pax;
  const foundPaxes = paxes.filter((pax) => pax.room === targetRoom.toString());
  paxListOfThisHotel.value = foundPaxes;
  const authLocalStore = JSON.parse(localStorage.getItem('authStore') || '{}');
  const token = authLocalStore.token;
  // Aqui faz um loop no Rooms que tem no hotel e pega as políticas
  for (const room of props.room) {
    try {
      const { data } = await axios.post(
        `${apiUrl}/api/v1/cart/hotels/get-policies`,
        {
          hotel: props.idHotel,
          ratePlanID: room.breakdownSales.plan,
          startDate: startDate.value,
          endDate: endDate.value,
          location: destination.value,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      cancellationPolicies.value.push(
        data.response.getCancellationPoliciesResult.SelectedHotel.Rooms.RoomResultCancelationPolicies_c
          .OperatorCancellationPolicies.CancellationPolicy
      );
    } catch (error: any) {
      if (error.response) {
        throw createError({
          statusCode: error.response.status,
          statusMessage: 'API fora do ar. Entre em contato com o GRUPO BRT!',
        });
      }
    }
  }
});
</script>
<template>
  <div class="room-card" v-for="(room, index) in props.room" :key="index">
    <div class="room-card__header">
      <div class="header__info">
        <div class="info__title">
          <Icon name="material-symbols:verified-rounded" v-if="room.recommended" color="#00b9ff" size="1.2rem" />
          {{ room.description }}
          <div class="title__icons">
            <Icon name="fa6-solid:child-reaching" size="0.9rem" color="#4B5563" />
            <Icon name="fa6-solid:child" size="0.8rem" color="#4B5563" />
          </div>
        </div>
        <div class="info__features">
          <div class="features--coffee">
            <Icon
              name="streamline:food-drinks-tea-cup-herbal-cook-tea-tisane-cup-drink-cooking-nutrition-mug-food"
              size="0.8rem"
              color="#4B5563"
            />
            <span v-if="!room.breakfastIncluded">Café da Manhã Não Incluído</span>
            <span v-else>Café da Manhã Incluído</span>
          </div>
          <div class="features--prepayment" v-if="room.prePayment">Pagamento Imediato</div>
          <div class="features--nonrefundable" v-if="room.isNonRefundable">Não Reembolsável</div>
          <div class="features--refundable" v-else>Reembolsável</div>
        </div>
      </div>
      <div class="header__price">
        <div class="price__value">
          {{ room.price.total.Currency + ' ' + useFormatCurrency(room.price.total.Value) }}
        </div>
      </div>
    </div>
    <div class="room-card__guest">
      <div class="guest__title">
        <span><strong> Hóspedes no Quarto</strong></span>
        <button
          class="title__btn-change-paxes"
          v-if="props.status.name !== 'cancelled' || props.status.name !== 'reserved'"
        >
          Alterar Hóspedes
        </button>
      </div>
      <div class="guest__name-pax" v-for="pax in paxListOfThisHotel">
        <strong>Nome: </strong>{{ pax.name + ' ' + pax.lastName }} - <strong>CPF:</strong> {{ pax.cpf }} -
        <strong>Telefone:</strong> {{ pax.phone }} - <strong>Gênero:</strong> {{ pax.gender }} -
        <strong>Nascimento:</strong> {{ formatDate(pax.birthDate) }} - <strong>E-mail:</strong> {{ pax.email }}
      </div>
    </div>
    <div class="room-card__policy">
      <span><strong>Política de Cancelamento do Quarto</strong></span>
      <div v-for="policy in cancellationPolicies[index] as unknown as ICancellationPolicies">
        Entre estas datas {{ formatDate(policy.StartDate) }} até {{ formatDate(policy.EndDate) }} a taxa de cancelamento
        é: {{ policy.Price.Currency }} {{ useFormatCurrency(policy.Price.Value) }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.room-card {
  @apply bg-white rounded-md mb-2;
}

.room-card__header {
  @apply flex p-4;
}

.header__info {
  @apply flex flex-col rounded-lg flex-grow;
}

.info__title {
  @apply text-sm font-bold flex items-center gap-1 mb-1;
}

.title__icons {
  @apply flex items-end -mt-1;
}

.info__features {
  @apply text-xs flex items-center gap-2;
}

.features--coffee {
  @apply flex items-center gap-2;
}

.features--prepayment {
  @apply flex items-center gap-2 bg-violet-100 text-violet-800 px-4 py-1 rounded-full;
}

.features--nonrefundable {
  @apply bg-red-100 text-red-600 px-4 py-[2px] rounded-full;
}

.features--refundable {
  @apply bg-lime-100 text-lime-600 px-4 py-[2px] rounded-full;
}

.header__price {
  @apply flex items-center;
}

.price__value {
  @apply gap-1 justify-end text-base font-bold w-fit mr-2;
}

.room-card__guest {
  @apply px-4 py-4 border-t border-zinc-200 mx-4 flex flex-col;
}

.guest__title {
  @apply flex gap-2 items-center;
}

.title__btn-change-paxes {
  @apply font-bold text-blue-800 text-xs;
}

.guest__name-pax {
  @apply text-xs py-1;
}

.room-card__policy {
  @apply px-4 py-4 border-t border-zinc-200 mx-4 flex flex-col gap-2;
}
</style>
