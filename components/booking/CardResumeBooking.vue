<script setup lang="ts">
// Função para formatar a data que vem invertida do banco
import { useDateFormatter } from '../../composables/useDateFormatter';
const { formatDate } = useDateFormatter();
// PINIA do Booking
import { useBookingStore } from '../../stores/BookingStore';
const bookingStore = useBookingStore();
// Função para pegar o ID do Booking na booking/:ID
const route = useRoute();

const props = defineProps({
  // REF para calcular o total do budget/booking
  totalOfBudget: {
    type: Number,
    required: true,
  },
  // REF para guardar a inbformação da MOEDA do budget/booking. Exemplo: BRL, USD ou GBP
  budgetCurrency: {
    type: String,
    required: true,
  },
  // REF para armazenar a data de viagem
  dates: {
    type: Array,
    required: true,
  },
  // REF para armazenar o destino da viagem
  destination: {
    type: String,
    required: true,
  },
  // REF para armazenar a data de quando este budget foi criado
  createdAt: {
    type: String,
    required: true,
  },
  // REF para armazenar o STATUS da budget/booking
  status: {
    type: Object,
    required: true,
  },
  // REF para armazenar o consultor do budget/booking
  consultant: {
    type: Object,
    required: true,
  },
});
// OBJETO para pegar as cores que foram definidas FIXAS para os status
const COLORS_STATUS = {
  created: 'bg-lime-700',
  cancelled: 'bg-red-700',
  email_sent: 'bg-orange-700',
  finished: 'bg-green-700',
  paid: 'bg-blue-700',
  partially_cancelled: 'bg-pink-700',
  partially_reserved: 'bg-emerald-700',
  reserved: 'bg-yellow-700',
  waiting_payment: 'bg-fuchsia-700',
};
</script>
<template>
  <section class="wrapper-search">
    <section class="container-search">
      <div class="container-title-package-customer-logo">
        <div class="title-package">
          <span v-if="bookingStore.budgetSelectedInfos.pax_filled === 0"
            >Escolha os quartos para gerar um orçamento!</span
          >
          <span v-if="bookingStore.budgetSelectedInfos.pax_filled !== 0">
            Orçamento #{{ route.params.id }} | Valor Total:
          </span>
          <span v-if="bookingStore.budgetSelectedInfos.pax_filled !== 0" class="text-lime-600">{{
            budgetCurrency + ' ' + useFormatCurrency(totalOfBudget)
          }}</span>
        </div>
        <div>
          <img src="/assets/logo-cliente.png" alt="" class="customer-logo" />
        </div>
      </div>
      <div class="wrapper-infos">
        <button
          type="submit"
          :class="[COLORS_STATUS[props.status.name as keyof typeof COLORS_STATUS] || 'bg-black']"
          class="budget-alert"
          v-if="props.status && Object.keys(props.status).length > 0"
        >
          <Icon name="material-symbols:notifications-active-outline-rounded" size="1.5rem" color="#ffffff" />
          <div>
            {{ props.status.description }}
          </div>
        </button>
        <button type="submit" class="budget-alert bg-gray-300" v-else>
          <img src="/assets/spinner.svg" alt="Loader" />
        </button>
        <div>
          <div class="agency-name font-bold">
            <strong>{{ props.consultant?.tenant?.corporate_name }}</strong>
          </div>
          <div class="agency-email">{{ props.consultant?.tenant?.email }}</div>
          <div class="agency-phone">{{ props.consultant?.tenant?.phone }}</div>
        </div>
        <div v-if="props.createdAt">
          <div class="data-budget">
            <strong>Dados de abertura:</strong>
            {{ props.createdAt }}
          </div>
          <div class="name-seller"><strong>Por:</strong> {{ props.consultant?.name }}</div>
          <div class="chief-seller"><strong>Responsável:</strong> {{ props.consultant?.email }}</div>
        </div>
      </div>
      <div class="wrapper-origin-destiny" v-if="props.destination">
        <div class="container-origin-destiny">
          <div>
            <span class="text-blue-800">{{ props.destination }}</span>
          </div>
        </div>
        <div class="container-calendar">
          <Icon name="material-symbols:date-range-outline" size="1.2rem" color="#114E8C" />
          <div>
            {{ formatDate(props.dates[0] as string) }} -
            {{ formatDate(props.dates[1] as string) }}
          </div>
        </div>
      </div>
      <div class="list-rooms">
        <div class="wrapper-rooms">
          <div
            class="container-rooms"
            v-for="(room, index) in bookingStore?.budgetSelectedInfos?.criteria?.hotels[0]?.rooms"
            :key="index"
          >
            <span class="tag-room">Quarto {{ index + 1 }}</span>
            <Icon
              name="fa6-solid:child-reaching"
              size="1rem"
              color="#114E8C"
              v-for="adult in bookingStore?.budgetSelectedInfos?.criteria?.hotels[0].pax[index]"
            />
            <Icon
              name="fa6-solid:child"
              size="0.9rem"
              color="#114E8C"
              v-for="children in bookingStore?.budgetSelectedInfos?.criteria?.hotels[0].children[index]"
            />
          </div>
        </div>
      </div>
    </section>
  </section>
</template>

<style scoped>
.tag-room {
  @apply bg-blue-800 text-white text-[10px] rounded-full px-2 flex flex-row justify-center items-center gap-2 mr-2;
}
.wrapper-infos {
  @apply text-xs md:text-sm flex flex-col md:flex-row gap-4 md:gap-6;
}
.budget-alert {
  @apply w-52 h-16 uppercase flex justify-center items-center gap-2 border p-4 text-white rounded-md text-xs font-bold hover:bg-yellow-600  transition-colors duration-300;
}
.wrapper-rooms {
  @apply flex gap-2 flex-col md:flex-row;
}
.container-rooms {
  @apply flex items-end;
}
.container-calendar {
  @apply flex items-center gap-3;
}
.container-origin-destiny {
  @apply flex items-center gap-3 text-xs md:text-base;
}
.wrapper-origin-destiny {
  @apply flex flex-col md:flex-row font-bold gap-2 mt-4;
}
.list-rooms {
  @apply mt-2 text-sm;
}
.title-package {
  @apply text-base md:text-2xl font-bold text-blue-800;
}
.container-title-package-customer-logo {
  @apply flex items-center justify-between;
}
.container-search {
  @apply bg-white rounded-lg shadow-2xl p-6 w-full max-w-6xl;
}
.wrapper-search {
  @apply flex justify-center mt-6 flex-col items-center;
}
</style>
../../stores/BookingStore
